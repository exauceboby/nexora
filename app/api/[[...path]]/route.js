import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail, getLeadNotificationEmail, getOrderConfirmationEmail, CONTACT_EMAIL } from '@/lib/resend';
import { USER_ROLES, ORDER_STATUS, PAYMENT_METHODS } from '@/lib/constants';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

function getPathSegments(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '').split('/').filter(Boolean);
  return path;
}

function generateOrderNumber() {
  const date = new Date();
  const prefix = 'NX';
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${year}${month}-${random}`;
}

// ============ LEADS API ============
async function getLeads(request) {
  try {
    const db = await getDb();
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const status = url.searchParams.get('status');
    
    let query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    
    const leads = await db.collection('leads')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({ success: true, data: leads }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function createLead(request) {
  try {
    const db = await getDb();
    const body = await request.json();
    
    const lead = {
      id: uuidv4(),
      ...body,
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await db.collection('leads').insertOne(lead);
    
    // Send email notification
    try {
      const emailContent = getLeadNotificationEmail(lead);
      await sendEmail({
        to: CONTACT_EMAIL,
        ...emailContent
      });
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }
    
    return NextResponse.json({ success: true, data: lead }, { status: 201, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function updateLead(request, leadId) {
  try {
    const db = await getDb();
    const body = await request.json();
    
    const updateData = { ...body, updatedAt: new Date().toISOString() };
    
    await db.collection('leads').updateOne({ id: leadId }, { $set: updateData });
    const updatedLead = await db.collection('leads').findOne({ id: leadId });
    
    return NextResponse.json({ success: true, data: updatedLead }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function deleteLead(request, leadId) {
  try {
    const db = await getDb();
    await db.collection('leads').deleteOne({ id: leadId });
    return NextResponse.json({ success: true, message: 'Lead deleted' }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

// ============ USERS API ============
async function getUsers(request) {
  try {
    const db = await getDb();
    const url = new URL(request.url);
    const role = url.searchParams.get('role');
    
    let query = {};
    if (role) query.role = role;
    
    const users = await db.collection('users')
      .find(query)
      .project({ password: 0 })
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({ success: true, data: users }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function createUser(request) {
  try {
    const db = await getDb();
    const body = await request.json();
    
    // Check if username exists
    const existing = await db.collection('users').findOne({ username: body.username });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Username already exists' }, { status: 400, headers: corsHeaders });
    }
    
    const user = {
      id: uuidv4(),
      username: body.username,
      password: body.password, // In production, hash this!
      name: body.name,
      email: body.email,
      phone: body.phone,
      role: body.role || USER_ROLES.SALES,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await db.collection('users').insertOne(user);
    
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json({ success: true, data: userWithoutPassword }, { status: 201, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function updateUser(request, userId) {
  try {
    const db = await getDb();
    const body = await request.json();
    
    const updateData = { ...body, updatedAt: new Date().toISOString() };
    delete updateData.id;
    
    await db.collection('users').updateOne({ id: userId }, { $set: updateData });
    const updatedUser = await db.collection('users').findOne({ id: userId }, { projection: { password: 0 } });
    
    return NextResponse.json({ success: true, data: updatedUser }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function deleteUser(request, userId) {
  try {
    const db = await getDb();
    await db.collection('users').deleteOne({ id: userId });
    return NextResponse.json({ success: true, message: 'User deleted' }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

// ============ CATEGORIES API ============
async function getCategories() {
  try {
    const db = await getDb();
    const categories = await db.collection('categories').find({}).sort({ order: 1 }).toArray();
    return NextResponse.json({ success: true, data: categories }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function createCategory(request) {
  try {
    const db = await getDb();
    const body = await request.json();
    
    const category = {
      id: uuidv4(),
      name: body.name,
      slug: body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: body.description || '',
      icon: body.icon || 'package',
      image: body.image || '',
      order: body.order || 0,
      active: true,
      createdAt: new Date().toISOString()
    };
    
    await db.collection('categories').insertOne(category);
    return NextResponse.json({ success: true, data: category }, { status: 201, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function updateCategory(request, categoryId) {
  try {
    const db = await getDb();
    const body = await request.json();
    
    if (body.name) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    
    await db.collection('categories').updateOne({ id: categoryId }, { $set: body });
    const updated = await db.collection('categories').findOne({ id: categoryId });
    return NextResponse.json({ success: true, data: updated }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function deleteCategory(request, categoryId) {
  try {
    const db = await getDb();
    await db.collection('categories').deleteOne({ id: categoryId });
    return NextResponse.json({ success: true, message: 'Category deleted' }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

// ============ PRODUCTS API ============
async function getProducts(request) {
  try {
    const db = await getDb();
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const featured = url.searchParams.get('featured');
    const active = url.searchParams.get('active');
    
    let query = {};
    if (category) query.categoryId = category;
    if (featured === 'true') query.featured = true;
    if (active !== 'false') query.active = true;
    
    const products = await db.collection('products')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({ success: true, data: products }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function getProductById(productId) {
  try {
    const db = await getDb();
    const product = await db.collection('products').findOne({ id: productId });
    
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404, headers: corsHeaders });
    }
    
    return NextResponse.json({ success: true, data: product }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function createProduct(request) {
  try {
    const db = await getDb();
    const body = await request.json();
    
    const product = {
      id: uuidv4(),
      name: body.name,
      slug: body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: body.description || '',
      price: parseFloat(body.price) || 0,
      comparePrice: parseFloat(body.comparePrice) || 0,
      cost: parseFloat(body.cost) || 0,
      categoryId: body.categoryId || '',
      categoryName: body.categoryName || '',
      brand: body.brand || '',
      sku: body.sku || `SKU-${Date.now()}`,
      barcode: body.barcode || '',
      images: body.images || [],
      stock: parseInt(body.stock) || 0,
      lowStockAlert: parseInt(body.lowStockAlert) || 5,
      trackStock: body.trackStock !== false,
      featured: body.featured || false,
      active: body.active !== false,
      tags: body.tags || [],
      specifications: body.specifications || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await db.collection('products').insertOne(product);
    return NextResponse.json({ success: true, data: product }, { status: 201, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function updateProduct(request, productId) {
  try {
    const db = await getDb();
    const body = await request.json();
    
    body.updatedAt = new Date().toISOString();
    if (body.name) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    
    await db.collection('products').updateOne({ id: productId }, { $set: body });
    const updated = await db.collection('products').findOne({ id: productId });
    return NextResponse.json({ success: true, data: updated }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function deleteProduct(request, productId) {
  try {
    const db = await getDb();
    await db.collection('products').deleteOne({ id: productId });
    return NextResponse.json({ success: true, message: 'Product deleted' }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

// ============ STOCK MOVEMENTS API ============
async function getStockMovements(request) {
  try {
    const db = await getDb();
    const url = new URL(request.url);
    const productId = url.searchParams.get('productId');
    
    let query = {};
    if (productId) query.productId = productId;
    
    const movements = await db.collection('stock_movements')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();
    
    return NextResponse.json({ success: true, data: movements }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function createStockMovement(request) {
  try {
    const db = await getDb();
    const body = await request.json();
    
    const movement = {
      id: uuidv4(),
      productId: body.productId,
      productName: body.productName,
      type: body.type, // 'in', 'out', 'adjustment'
      quantity: parseInt(body.quantity),
      reason: body.reason || '',
      reference: body.reference || '',
      userId: body.userId || '',
      userName: body.userName || '',
      createdAt: new Date().toISOString()
    };
    
    await db.collection('stock_movements').insertOne(movement);
    
    // Update product stock
    const quantityChange = movement.type === 'out' ? -movement.quantity : movement.quantity;
    await db.collection('products').updateOne(
      { id: movement.productId },
      { $inc: { stock: quantityChange } }
    );
    
    return NextResponse.json({ success: true, data: movement }, { status: 201, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

// ============ ORDERS API ============
async function getOrders(request) {
  try {
    const db = await getDb();
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const customerId = url.searchParams.get('customerId');
    
    let query = {};
    if (status) query.status = status;
    if (customerId) query.customerId = customerId;
    
    const orders = await db.collection('orders')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({ success: true, data: orders }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function getOrderById(orderId) {
  try {
    const db = await getDb();
    const order = await db.collection('orders').findOne({ id: orderId });
    
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404, headers: corsHeaders });
    }
    
    return NextResponse.json({ success: true, data: order }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function createOrder(request) {
  try {
    const db = await getDb();
    const body = await request.json();
    
    const order = {
      id: uuidv4(),
      orderNumber: generateOrderNumber(),
      customer: {
        name: body.customerName,
        phone: body.customerPhone,
        email: body.customerEmail || '',
        address: body.customerAddress || ''
      },
      items: body.items || [],
      subtotal: parseFloat(body.subtotal) || 0,
      discount: parseFloat(body.discount) || 0,
      tax: parseFloat(body.tax) || 0,
      total: parseFloat(body.total) || 0,
      paymentMethod: body.paymentMethod || PAYMENT_METHODS.WHATSAPP,
      paymentStatus: body.paymentStatus || 'pending',
      status: ORDER_STATUS.PENDING,
      notes: body.notes || '',
      sellerId: body.sellerId || '',
      sellerName: body.sellerName || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await db.collection('orders').insertOne(order);
    
    // Update stock for each item
    for (const item of order.items) {
      await db.collection('products').updateOne(
        { id: item.productId },
        { $inc: { stock: -item.quantity } }
      );
      
      // Record stock movement
      await db.collection('stock_movements').insertOne({
        id: uuidv4(),
        productId: item.productId,
        productName: item.name,
        type: 'out',
        quantity: item.quantity,
        reason: 'Vente',
        reference: order.orderNumber,
        createdAt: new Date().toISOString()
      });
    }
    
    // Send confirmation email if customer has email
    if (order.customer.email) {
      try {
        const emailContent = getOrderConfirmationEmail(order, order.items);
        await sendEmail({
          to: order.customer.email,
          ...emailContent
        });
      } catch (emailError) {
        console.error('Order email failed:', emailError);
      }
    }
    
    return NextResponse.json({ success: true, data: order }, { status: 201, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function updateOrder(request, orderId) {
  try {
    const db = await getDb();
    const body = await request.json();
    
    body.updatedAt = new Date().toISOString();
    
    await db.collection('orders').updateOne({ id: orderId }, { $set: body });
    const updated = await db.collection('orders').findOne({ id: orderId });
    return NextResponse.json({ success: true, data: updated }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

// ============ ADVERTISEMENTS API ============
async function getAds(request) {
  try {
    const db = await getDb();
    const url = new URL(request.url);
    const active = url.searchParams.get('active');
    const position = url.searchParams.get('position');
    
    let query = {};
    if (active === 'true') {
      query.active = true;
      query.startDate = { $lte: new Date().toISOString() };
      query.$or = [
        { endDate: { $gte: new Date().toISOString() } },
        { endDate: null },
        { endDate: '' }
      ];
    }
    if (position) query.position = position;
    
    const ads = await db.collection('ads')
      .find(query)
      .sort({ order: 1, createdAt: -1 })
      .toArray();
    
    return NextResponse.json({ success: true, data: ads }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function createAd(request) {
  try {
    const db = await getDb();
    const body = await request.json();
    
    const ad = {
      id: uuidv4(),
      title: body.title,
      description: body.description || '',
      image: body.image,
      link: body.link || '',
      linkType: body.linkType || 'product', // product, category, external, whatsapp
      productId: body.productId || '',
      categoryId: body.categoryId || '',
      position: body.position || 'home', // home, shop, sidebar, popup
      order: body.order || 0,
      active: body.active !== false,
      startDate: body.startDate || new Date().toISOString(),
      endDate: body.endDate || null,
      clicks: 0,
      views: 0,
      createdBy: body.createdBy || '',
      createdAt: new Date().toISOString()
    };
    
    await db.collection('ads').insertOne(ad);
    return NextResponse.json({ success: true, data: ad }, { status: 201, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function updateAd(request, adId) {
  try {
    const db = await getDb();
    const body = await request.json();
    
    await db.collection('ads').updateOne({ id: adId }, { $set: body });
    const updated = await db.collection('ads').findOne({ id: adId });
    return NextResponse.json({ success: true, data: updated }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function deleteAd(request, adId) {
  try {
    const db = await getDb();
    await db.collection('ads').deleteOne({ id: adId });
    return NextResponse.json({ success: true, message: 'Ad deleted' }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function trackAdClick(request, adId) {
  try {
    const db = await getDb();
    await db.collection('ads').updateOne({ id: adId }, { $inc: { clicks: 1 } });
    const ad = await db.collection('ads').findOne({ id: adId });
    return NextResponse.json({ success: true, data: ad }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

// ============ ARTICLES API ============
async function getArticles(request) {
  try {
    const db = await getDb();
    const url = new URL(request.url);
    const published = url.searchParams.get('published');
    const slug = url.searchParams.get('slug');
    
    let query = {};
    if (published === 'true') query.published = true;
    if (slug) query.slug = slug;
    
    const articles = await db.collection('articles')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({ success: true, data: articles }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function createArticle(request) {
  try {
    const db = await getDb();
    const body = await request.json();
    
    const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const article = {
      id: uuidv4(),
      ...body,
      slug,
      published: body.published || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await db.collection('articles').insertOne(article);
    return NextResponse.json({ success: true, data: article }, { status: 201, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function updateArticle(request, articleId) {
  try {
    const db = await getDb();
    const body = await request.json();
    
    let updateData = { ...body, updatedAt: new Date().toISOString() };
    if (body.title) {
      updateData.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    
    await db.collection('articles').updateOne({ id: articleId }, { $set: updateData });
    const updated = await db.collection('articles').findOne({ id: articleId });
    return NextResponse.json({ success: true, data: updated }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function deleteArticle(request, articleId) {
  try {
    const db = await getDb();
    await db.collection('articles').deleteOne({ id: articleId });
    return NextResponse.json({ success: true, message: 'Article deleted' }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

// ============ AUTH API ============
async function login(request) {
  try {
    const db = await getDb();
    const body = await request.json();
    const { username, password } = body;
    
    // Check admin password first
    const adminPassword = process.env.ADMIN_PASSWORD || 'nexora2024admin';
    if (password === adminPassword && (!username || username === 'admin')) {
      return NextResponse.json({ 
        success: true, 
        token: 'admin-' + uuidv4(),
        user: {
          id: 'admin',
          username: 'admin',
          name: 'Administrateur',
          role: USER_ROLES.SUPER_ADMIN
        }
      }, { headers: corsHeaders });
    }
    
    // Check user in database
    const user = await db.collection('users').findOne({ 
      username: username,
      password: password,
      active: true
    });
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return NextResponse.json({ 
        success: true, 
        token: 'user-' + uuidv4(),
        user: userWithoutPassword
      }, { headers: corsHeaders });
    }
    
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

// ============ STATS API ============
async function getStats() {
  try {
    const db = await getDb();
    
    // Leads stats
    const totalLeads = await db.collection('leads').countDocuments();
    const newLeads = await db.collection('leads').countDocuments({ status: 'NEW' });
    
    // Products stats
    const totalProducts = await db.collection('products').countDocuments();
    const lowStockProducts = await db.collection('products').countDocuments({
      $expr: { $lte: ['$stock', '$lowStockAlert'] }
    });
    
    // Orders stats
    const totalOrders = await db.collection('orders').countDocuments();
    const pendingOrders = await db.collection('orders').countDocuments({ status: ORDER_STATUS.PENDING });
    const todayOrders = await db.collection('orders').countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)).toISOString() }
    });
    
    // Revenue
    const ordersForRevenue = await db.collection('orders').find({ 
      status: { $nin: [ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUNDED] }
    }).toArray();
    const totalRevenue = ordersForRevenue.reduce((sum, order) => sum + (order.total || 0), 0);
    
    // Articles
    const totalArticles = await db.collection('articles').countDocuments();
    const publishedArticles = await db.collection('articles').countDocuments({ published: true });
    
    // Users
    const totalUsers = await db.collection('users').countDocuments();
    
    // Ads
    const activeAds = await db.collection('ads').countDocuments({ active: true });
    
    return NextResponse.json({
      success: true,
      data: {
        leads: { total: totalLeads, new: newLeads },
        products: { total: totalProducts, lowStock: lowStockProducts },
        orders: { total: totalOrders, pending: pendingOrders, today: todayOrders },
        revenue: { total: totalRevenue },
        articles: { total: totalArticles, published: publishedArticles },
        users: { total: totalUsers },
        ads: { active: activeAds }
      }
    }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

// ============ RECEIPTS API ============
async function generateReceipt(request) {
  try {
    const body = await request.json();
    const { orderId } = body;
    
    const db = await getDb();
    const order = await db.collection('orders').findOne({ id: orderId });
    
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404, headers: corsHeaders });
    }
    
    // Generate receipt data
    const receipt = {
      id: uuidv4(),
      orderId: order.id,
      orderNumber: order.orderNumber,
      customer: order.customer,
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      tax: order.tax,
      total: order.total,
      paymentMethod: order.paymentMethod,
      generatedAt: new Date().toISOString(),
      company: {
        name: 'NEXORA Technologies & Networks',
        address: 'RDC',
        phone: '+243 971 037 431',
        email: 'nexorainfo@nexora.com',
        website: 'www.nexora.cd'
      }
    };
    
    return NextResponse.json({ success: true, data: receipt }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

// ============ MAIN HANDLERS ============
export async function GET(request) {
  const path = getPathSegments(request);
  
  if (path[0] === 'health') {
    return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() }, { headers: corsHeaders });
  }
  if (path[0] === 'leads') return getLeads(request);
  if (path[0] === 'users') return getUsers(request);
  if (path[0] === 'categories') return getCategories();
  if (path[0] === 'products') {
    if (path[1]) return getProductById(path[1]);
    return getProducts(request);
  }
  if (path[0] === 'stock-movements') return getStockMovements(request);
  if (path[0] === 'orders') {
    if (path[1]) return getOrderById(path[1]);
    return getOrders(request);
  }
  if (path[0] === 'ads') return getAds(request);
  if (path[0] === 'articles') return getArticles(request);
  if (path[0] === 'stats') return getStats();
  
  return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });
}

export async function POST(request) {
  const path = getPathSegments(request);
  
  if (path[0] === 'leads') return createLead(request);
  if (path[0] === 'users') return createUser(request);
  if (path[0] === 'categories') return createCategory(request);
  if (path[0] === 'products') return createProduct(request);
  if (path[0] === 'stock-movements') return createStockMovement(request);
  if (path[0] === 'orders') return createOrder(request);
  if (path[0] === 'ads') {
    if (path[1] === 'click' && path[2]) return trackAdClick(request, path[2]);
    return createAd(request);
  }
  if (path[0] === 'articles') return createArticle(request);
  if (path[0] === 'auth' && path[1] === 'login') return login(request);
  if (path[0] === 'receipts' && path[1] === 'generate') return generateReceipt(request);
  
  return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });
}

export async function PUT(request) {
  const path = getPathSegments(request);
  
  if (path[0] === 'leads' && path[1]) return updateLead(request, path[1]);
  if (path[0] === 'users' && path[1]) return updateUser(request, path[1]);
  if (path[0] === 'categories' && path[1]) return updateCategory(request, path[1]);
  if (path[0] === 'products' && path[1]) return updateProduct(request, path[1]);
  if (path[0] === 'orders' && path[1]) return updateOrder(request, path[1]);
  if (path[0] === 'ads' && path[1]) return updateAd(request, path[1]);
  if (path[0] === 'articles' && path[1]) return updateArticle(request, path[1]);
  
  return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });
}

export async function DELETE(request) {
  const path = getPathSegments(request);
  
  if (path[0] === 'leads' && path[1]) return deleteLead(request, path[1]);
  if (path[0] === 'users' && path[1]) return deleteUser(request, path[1]);
  if (path[0] === 'categories' && path[1]) return deleteCategory(request, path[1]);
  if (path[0] === 'products' && path[1]) return deleteProduct(request, path[1]);
  if (path[0] === 'ads' && path[1]) return deleteAd(request, path[1]);
  if (path[0] === 'articles' && path[1]) return deleteArticle(request, path[1]);
  
  return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });
}
