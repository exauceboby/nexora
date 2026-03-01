import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Helper to get path segments
function getPathSegments(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '').split('/').filter(Boolean);
  return path;
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
    console.error('Error fetching leads:', error);
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
    
    return NextResponse.json({ success: true, data: lead }, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function updateLead(request, leadId) {
  try {
    const db = await getDb();
    const body = await request.json();
    
    const updateData = {
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    const result = await db.collection('leads').updateOne(
      { id: leadId },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404, headers: corsHeaders });
    }
    
    const updatedLead = await db.collection('leads').findOne({ id: leadId });
    return NextResponse.json({ success: true, data: updatedLead }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function deleteLead(request, leadId) {
  try {
    const db = await getDb();
    const result = await db.collection('leads').deleteOne({ id: leadId });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404, headers: corsHeaders });
    }
    
    return NextResponse.json({ success: true, message: 'Lead deleted' }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error deleting lead:', error);
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
    console.error('Error fetching articles:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function createArticle(request) {
  try {
    const db = await getDb();
    const body = await request.json();
    
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
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
    console.error('Error creating article:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function updateArticle(request, articleId) {
  try {
    const db = await getDb();
    const body = await request.json();
    
    let updateData = {
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    // Update slug if title changed
    if (body.title) {
      updateData.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    const result = await db.collection('articles').updateOne(
      { id: articleId },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404, headers: corsHeaders });
    }
    
    const updatedArticle = await db.collection('articles').findOne({ id: articleId });
    return NextResponse.json({ success: true, data: updatedArticle }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

async function deleteArticle(request, articleId) {
  try {
    const db = await getDb();
    const result = await db.collection('articles').deleteOne({ id: articleId });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404, headers: corsHeaders });
    }
    
    return NextResponse.json({ success: true, message: 'Article deleted' }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

// ============ AUTH API ============
async function login(request) {
  try {
    const body = await request.json();
    const { password } = body;
    
    const adminPassword = process.env.ADMIN_PASSWORD || 'nexora2024admin';
    
    if (password === adminPassword) {
      return NextResponse.json({ 
        success: true, 
        token: 'admin-' + uuidv4(),
        message: 'Login successful' 
      }, { headers: corsHeaders });
    }
    
    return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401, headers: corsHeaders });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

// ============ STATS API ============
async function getStats() {
  try {
    const db = await getDb();
    
    const totalLeads = await db.collection('leads').countDocuments();
    const newLeads = await db.collection('leads').countDocuments({ status: 'NEW' });
    const contactedLeads = await db.collection('leads').countDocuments({ status: 'CONTACTED' });
    const confirmedLeads = await db.collection('leads').countDocuments({ status: 'CONFIRMED' });
    const installedLeads = await db.collection('leads').countDocuments({ status: 'INSTALLED' });
    
    const starlinkLeads = await db.collection('leads').countDocuments({ type: 'starlink' });
    const quoteLeads = await db.collection('leads').countDocuments({ type: 'quote' });
    const partnerLeads = await db.collection('leads').countDocuments({ type: 'partner' });
    const contactLeads = await db.collection('leads').countDocuments({ type: 'contact' });
    
    const totalArticles = await db.collection('articles').countDocuments();
    const publishedArticles = await db.collection('articles').countDocuments({ published: true });
    
    return NextResponse.json({
      success: true,
      data: {
        leads: {
          total: totalLeads,
          new: newLeads,
          contacted: contactedLeads,
          confirmed: confirmedLeads,
          installed: installedLeads,
          byType: {
            starlink: starlinkLeads,
            quote: quoteLeads,
            partner: partnerLeads,
            contact: contactLeads
          }
        },
        articles: {
          total: totalArticles,
          published: publishedArticles
        }
      }
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

// ============ MAIN HANDLERS ============
export async function GET(request) {
  const path = getPathSegments(request);
  
  // /api/leads
  if (path[0] === 'leads') {
    return getLeads(request);
  }
  
  // /api/articles
  if (path[0] === 'articles') {
    return getArticles(request);
  }
  
  // /api/stats
  if (path[0] === 'stats') {
    return getStats();
  }
  
  // /api/health
  if (path[0] === 'health') {
    return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() }, { headers: corsHeaders });
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });
}

export async function POST(request) {
  const path = getPathSegments(request);
  
  // /api/leads
  if (path[0] === 'leads') {
    return createLead(request);
  }
  
  // /api/articles
  if (path[0] === 'articles') {
    return createArticle(request);
  }
  
  // /api/auth/login
  if (path[0] === 'auth' && path[1] === 'login') {
    return login(request);
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });
}

export async function PUT(request) {
  const path = getPathSegments(request);
  
  // /api/leads/:id
  if (path[0] === 'leads' && path[1]) {
    return updateLead(request, path[1]);
  }
  
  // /api/articles/:id
  if (path[0] === 'articles' && path[1]) {
    return updateArticle(request, path[1]);
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });
}

export async function DELETE(request) {
  const path = getPathSegments(request);
  
  // /api/leads/:id
  if (path[0] === 'leads' && path[1]) {
    return deleteLead(request, path[1]);
  }
  
  // /api/articles/:id
  if (path[0] === 'articles' && path[1]) {
    return deleteArticle(request, path[1]);
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });
}
