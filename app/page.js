'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { 
  Satellite, Wifi, Globe, Code, Shield, Zap, Users, Award, 
  ChevronRight, Menu, X, Phone, Mail, MapPin, ArrowRight,
  Check, Star, MessageCircle, Building, GraduationCap, Coffee,
  Home as HomeIcon, Briefcase, ShoppingCart, Package, Plus, Minus,
  Trash2, Search, Filter, Eye, Edit, Printer, Download, LogOut,
  BarChart3, Settings, Bell, User, FileText, Image, Tag, Layers,
  ChevronDown, ExternalLink, TrendingUp, DollarSign, Box, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { translations } from '@/lib/translations';
import { SITE_CONFIG, USER_ROLES, ORDER_STATUS, PAYMENT_METHODS } from '@/lib/constants';

// ============ CONTEXT ============
const CartContext = createContext();
const AuthContext = createContext();

function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };
  
  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };
  
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };
  
  const clearCart = () => setCart([]);
  
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  return useContext(CartContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  
  const login = async (username, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    }
    return { success: false, error: data.error };
  };
  
  const logout = () => {
    setUser(null);
    setToken(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

// ============ NAVIGATION ============
function Navigation({ locale, setLocale, currentPage, setCurrentPage }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const t = translations[locale];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'shop', label: locale === 'fr' ? 'Boutique' : 'Shop' },
    { id: 'starlink', label: t.nav.starlink },
    { id: 'network', label: t.nav.network },
    { id: 'partners', label: t.nav.partners },
    { id: 'about', label: t.nav.about },
    { id: 'contact', label: t.nav.contact },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg shadow-black/5' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button onClick={() => setCurrentPage('home')} className="flex items-center space-x-2 group">
            <img 
              src={SITE_CONFIG.logo} 
              alt="NEXORA" 
              className="h-10 w-10 object-contain"
            />
            <span className="font-bold text-xl tracking-tight hidden sm:block">NEXORA</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  currentPage === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
              className="px-3 py-1.5 text-sm font-medium rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              {locale === 'fr' ? 'EN' : 'FR'}
            </button>

            {/* Cart */}
            <button
              onClick={() => setCurrentPage('cart')}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <Button 
              onClick={() => setCurrentPage('shop')}
              className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30"
            >
              {locale === 'fr' ? 'Acheter' : 'Shop'}
            </Button>

            <button
              onClick={() => setCurrentPage('portal')}
              className="hidden lg:block px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors"
            >
              Portail
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setIsMobileMenuOpen(false); }}
                className={`w-full px-4 py-3 rounded-xl text-left font-medium transition-all ${
                  currentPage === item.id ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
            <Button onClick={() => { setCurrentPage('portal'); setIsMobileMenuOpen(false); }} variant="outline" className="w-full mt-4">
              Portail Employé
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ============ HERO SECTION ============
function HeroSection({ locale, setCurrentPage }) {
  const t = translations[locale];
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-600/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-8">
            <Satellite className="w-4 h-4 mr-2 text-blue-400" />
            {locale === 'fr' ? 'Partenaire Starlink & Boutique Tech' : 'Starlink Partner & Tech Store'}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            {t.hero.title}
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {t.hero.titleHighlight}
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            {locale === 'fr' 
              ? 'Starlink, téléphones California, réseaux et solutions IT — Qualité premium, prix compétitifs.'
              : 'Starlink, California phones, networks and IT solutions — Premium quality, competitive prices.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => setCurrentPage('shop')}
              size="lg"
              className="bg-white text-slate-900 hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-2xl shadow-white/20 group"
            >
              <ShoppingCart className="mr-2 w-5 h-5" />
              {locale === 'fr' ? 'Visiter la Boutique' : 'Visit Shop'}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              onClick={() => setCurrentPage('starlink')}
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold backdrop-blur-sm"
            >
              {t.hero.cta2}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ SHOP PAGE ============
function ShopPage({ locale, setCurrentPage }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, adsRes] = await Promise.all([
        fetch('/api/products?active=true'),
        fetch('/api/categories'),
        fetch('/api/ads?active=true&position=shop')
      ]);
      
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      const adsData = await adsRes.json();
      
      if (productsData.success) setProducts(productsData.data);
      if (categoriesData.success) setCategories(categoriesData.data);
      if (adsData.success) setAds(adsData.data);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAdClick = async (ad) => {
    await fetch(`/api/ads/click/${ad.id}`, { method: 'POST' });
    if (ad.linkType === 'whatsapp') {
      window.open(`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(`Je suis intéressé par: ${ad.title}`)}`, '_blank');
    } else if (ad.linkType === 'product' && ad.productId) {
      // Could navigate to product detail
    } else if (ad.link) {
      window.open(ad.link, '_blank');
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {locale === 'fr' ? 'Notre Boutique' : 'Our Shop'}
          </h1>
          <p className="text-xl text-blue-100">
            {locale === 'fr' ? 'Téléphones, Starlink, Accessoires et plus' : 'Phones, Starlink, Accessories and more'}
          </p>
        </div>
      </section>

      {/* Ads Banner */}
      {ads.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ads.slice(0, 3).map((ad) => (
              <div 
                key={ad.id}
                onClick={() => handleAdClick(ad)}
                className="relative overflow-hidden rounded-2xl cursor-pointer group"
              >
                <img 
                  src={ad.image} 
                  alt={ad.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div>
                    <h3 className="text-white font-semibold">{ad.title}</h3>
                    <p className="text-white/80 text-sm">{ad.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder={locale === 'fr' ? 'Rechercher un produit...' : 'Search products...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className="rounded-full"
            >
              {locale === 'fr' ? 'Tout' : 'All'}
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat.id)}
                className="rounded-full"
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {product.images?.[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                  {product.comparePrice > product.price && (
                    <Badge className="absolute top-2 left-2 bg-red-500">
                      -{Math.round((1 - product.price / product.comparePrice) * 100)}%
                    </Badge>
                  )}
                  {product.featured && (
                    <Badge className="absolute top-2 right-2 bg-amber-500">
                      <Star className="w-3 h-3 mr-1" /> Featured
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <p className="text-xs text-blue-600 font-medium mb-1">{product.categoryName || product.brand}</p>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold text-gray-900">${product.price}</span>
                    {product.comparePrice > product.price && (
                      <span className="text-sm text-gray-400 line-through">${product.comparePrice}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => addToCart(product)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      disabled={product.stock <= 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.stock <= 0 ? 'Rupture' : 'Ajouter'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        const msg = `Bonjour, je suis intéressé par: ${product.name} ($${product.price})`;
                        window.open(`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {locale === 'fr' ? 'Aucun produit trouvé' : 'No products found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ CART PAGE ============
function CartPage({ locale, setCurrentPage }) {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const [customerForm, setCustomerForm] = useState({
    name: '', phone: '', email: '', address: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('whatsapp');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handleCheckout = async () => {
    if (!customerForm.name || !customerForm.phone) {
      alert(locale === 'fr' ? 'Veuillez remplir votre nom et téléphone' : 'Please fill your name and phone');
      return;
    }

    setIsSubmitting(true);

    if (paymentMethod === 'whatsapp') {
      const itemsText = cart.map(item => `- ${item.name} x${item.quantity} = $${item.price * item.quantity}`).join('\n');
      const msg = `🛒 *Nouvelle Commande NEXORA*\n\n*Client:* ${customerForm.name}\n*Tél:* ${customerForm.phone}\n${customerForm.email ? `*Email:* ${customerForm.email}\n` : ''}${customerForm.address ? `*Adresse:* ${customerForm.address}\n` : ''}\n*Produits:*\n${itemsText}\n\n*TOTAL: $${cartTotal}*`;
      window.open(`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
      setOrderSuccess({ orderNumber: 'WA-' + Date.now() });
      clearCart();
    } else {
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: customerForm.name,
            customerPhone: customerForm.phone,
            customerEmail: customerForm.email,
            customerAddress: customerForm.address,
            items: cart.map(item => ({
              productId: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity
            })),
            subtotal: cartTotal,
            total: cartTotal,
            paymentMethod
          })
        });
        const data = await res.json();
        if (data.success) {
          setOrderSuccess(data.data);
          clearCart();
        }
      } catch (error) {
        console.error('Order error:', error);
      }
    }
    setIsSubmitting(false);
  };

  if (orderSuccess) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-4 p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {locale === 'fr' ? 'Commande envoyée !' : 'Order sent!'}
          </h2>
          <p className="text-gray-600 mb-6">
            {locale === 'fr' 
              ? 'Nous vous contacterons bientôt pour confirmer votre commande.'
              : 'We will contact you soon to confirm your order.'}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Commande: #{orderSuccess.orderNumber}
          </p>
          <Button onClick={() => setCurrentPage('shop')} className="w-full">
            {locale === 'fr' ? 'Continuer les achats' : 'Continue shopping'}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {locale === 'fr' ? 'Votre Panier' : 'Your Cart'}
        </h1>

        {cart.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-6">
              {locale === 'fr' ? 'Votre panier est vide' : 'Your cart is empty'}
            </p>
            <Button onClick={() => setCurrentPage('shop')}>
              {locale === 'fr' ? 'Visiter la boutique' : 'Visit shop'}
            </Button>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.images?.[0] ? (
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-blue-600 font-bold">${item.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${item.price * item.quantity}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Checkout */}
            <div>
              <Card className="p-6 sticky top-24">
                <h3 className="text-lg font-semibold mb-4">
                  {locale === 'fr' ? 'Récapitulatif' : 'Summary'}
                </h3>
                
                <div className="space-y-3 mb-6">
                  <Input
                    placeholder={locale === 'fr' ? 'Votre nom *' : 'Your name *'}
                    value={customerForm.name}
                    onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
                  />
                  <Input
                    placeholder={locale === 'fr' ? 'Téléphone *' : 'Phone *'}
                    value={customerForm.phone}
                    onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
                  />
                  <Input
                    placeholder="Email"
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
                  />
                  <Input
                    placeholder={locale === 'fr' ? 'Adresse' : 'Address'}
                    value={customerForm.address}
                    onChange={(e) => setCustomerForm({...customerForm, address: e.target.value})}
                  />
                </div>

                <div className="space-y-2 mb-6">
                  <label className="text-sm font-medium">
                    {locale === 'fr' ? 'Mode de paiement' : 'Payment method'}
                  </label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp">WhatsApp (Commander)</SelectItem>
                      <SelectItem value="cash">Cash à la livraison</SelectItem>
                      <SelectItem value="mobile_money">Mobile Money</SelectItem>
                      <SelectItem value="card">Carte bancaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${cartTotal}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
                >
                  {isSubmitting ? (
                    <span className="animate-spin mr-2">⏳</span>
                  ) : paymentMethod === 'whatsapp' ? (
                    <MessageCircle className="w-5 h-5 mr-2" />
                  ) : null}
                  {paymentMethod === 'whatsapp' 
                    ? (locale === 'fr' ? 'Commander via WhatsApp' : 'Order via WhatsApp')
                    : (locale === 'fr' ? 'Passer la commande' : 'Place order')}
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ PORTAL (EMPLOYEE/ADMIN) ============
function PortalPage({ locale }) {
  const { user, login, logout, isAuthenticated } = useAuth();
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [data, setData] = useState({
    leads: [], products: [], categories: [], orders: [], users: [], ads: [], articles: []
  });
  const [loading, setLoading] = useState(false);

  // Forms
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', comparePrice: '', cost: '', 
    categoryId: '', brand: '', stock: '', images: '', featured: false
  });
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', icon: '' });
  const [adForm, setAdForm] = useState({ title: '', description: '', image: '', link: '', linkType: 'product', position: 'shop' });
  const [userForm, setUserForm] = useState({ username: '', password: '', name: '', email: '', phone: '', role: 'sales' });
  
  const [editingItem, setEditingItem] = useState(null);
  const [showDialog, setShowDialog] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(loginForm.username, loginForm.password);
    if (!result.success) {
      setLoginError(locale === 'fr' ? 'Identifiants incorrects' : 'Invalid credentials');
    } else {
      fetchAllData();
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const endpoints = ['stats', 'leads', 'products', 'categories', 'orders', 'users', 'ads', 'articles'];
      const results = await Promise.all(
        endpoints.map(ep => fetch(`/api/${ep}`).then(r => r.json()))
      );
      
      setStats(results[0].data);
      setData({
        leads: results[1].data || [],
        products: results[2].data || [],
        categories: results[3].data || [],
        orders: results[4].data || [],
        users: results[5].data || [],
        ads: results[6].data || [],
        articles: results[7].data || []
      });
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) fetchAllData();
  }, [isAuthenticated]);

  // CRUD Operations
  const saveProduct = async () => {
    const method = editingItem ? 'PUT' : 'POST';
    const url = editingItem ? `/api/products/${editingItem.id}` : '/api/products';
    
    const productData = {
      ...productForm,
      price: parseFloat(productForm.price) || 0,
      comparePrice: parseFloat(productForm.comparePrice) || 0,
      cost: parseFloat(productForm.cost) || 0,
      stock: parseInt(productForm.stock) || 0,
      images: productForm.images ? productForm.images.split(',').map(s => s.trim()) : [],
      categoryName: data.categories.find(c => c.id === productForm.categoryId)?.name || ''
    };

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    
    setProductForm({ name: '', description: '', price: '', comparePrice: '', cost: '', categoryId: '', brand: '', stock: '', images: '', featured: false });
    setEditingItem(null);
    setShowDialog(null);
    fetchAllData();
  };

  const saveCategory = async () => {
    const method = editingItem ? 'PUT' : 'POST';
    const url = editingItem ? `/api/categories/${editingItem.id}` : '/api/categories';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryForm)
    });
    
    setCategoryForm({ name: '', description: '', icon: '' });
    setEditingItem(null);
    setShowDialog(null);
    fetchAllData();
  };

  const saveAd = async () => {
    const method = editingItem ? 'PUT' : 'POST';
    const url = editingItem ? `/api/ads/${editingItem.id}` : '/api/ads';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adForm)
    });
    
    setAdForm({ title: '', description: '', image: '', link: '', linkType: 'product', position: 'shop' });
    setEditingItem(null);
    setShowDialog(null);
    fetchAllData();
  };

  const saveUser = async () => {
    const method = editingItem ? 'PUT' : 'POST';
    const url = editingItem ? `/api/users/${editingItem.id}` : '/api/users';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userForm)
    });
    
    setUserForm({ username: '', password: '', name: '', email: '', phone: '', role: 'sales' });
    setEditingItem(null);
    setShowDialog(null);
    fetchAllData();
  };

  const deleteItem = async (type, id) => {
    if (!confirm(locale === 'fr' ? 'Confirmer la suppression ?' : 'Confirm delete?')) return;
    await fetch(`/api/${type}/${id}`, { method: 'DELETE' });
    fetchAllData();
  };

  const updateLeadStatus = async (id, status) => {
    await fetch(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchAllData();
  };

  const updateOrderStatus = async (id, status) => {
    await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchAllData();
  };

  const printReceipt = async (order) => {
    const receiptWindow = window.open('', '_blank');
    receiptWindow.document.write(`
      <html>
        <head>
          <title>Reçu #${order.orderNumber}</title>
          <style>
            body { font-family: Arial; padding: 20px; max-width: 400px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; }
            .items { margin: 20px 0; }
            .item { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px dashed #ccc; }
            .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; padding-top: 10px; border-top: 2px solid #000; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">NEXORA NTN</div>
            <p>Technologies & Networks</p>
            <p>+243 971 037 431</p>
          </div>
          <p><strong>Reçu #${order.orderNumber}</strong></p>
          <p>Date: ${new Date(order.createdAt).toLocaleString()}</p>
          <p>Client: ${order.customer?.name || 'N/A'}</p>
          <p>Tél: ${order.customer?.phone || 'N/A'}</p>
          <div class="items">
            ${order.items?.map(item => `
              <div class="item">
                <span>${item.name} x${item.quantity}</span>
                <span>$${item.price * item.quantity}</span>
              </div>
            `).join('')}
          </div>
          <div class="total">TOTAL: $${order.total}</div>
          <p>Paiement: ${order.paymentMethod}</p>
          <div class="footer">
            <p>Merci pour votre achat!</p>
            <p>www.nexora.cd</p>
          </div>
        </body>
      </html>
    `);
    receiptWindow.document.close();
    receiptWindow.print();
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 p-8">
          <div className="text-center mb-8">
            <img src={SITE_CONFIG.logo} alt="NEXORA" className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Portail NEXORA</h1>
            <p className="text-gray-500">Connexion employé / admin</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              placeholder="Nom d'utilisateur"
              value={loginForm.username}
              onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
            />
            <Input
              type="password"
              placeholder="Mot de passe"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
            />
            {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Se connecter
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="pt-20 min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={SITE_CONFIG.logo} alt="NEXORA" className="h-10 w-10" />
            <div>
              <h1 className="font-bold text-lg">Portail NEXORA</h1>
              <p className="text-sm text-gray-500">{user?.name || 'Admin'} • {user?.role || 'super_admin'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={fetchAllData}>
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg"><DollarSign className="w-5 h-5 text-blue-600" /></div>
                <div>
                  <p className="text-xs text-gray-500">Revenus</p>
                  <p className="text-lg font-bold">${stats.revenue?.total || 0}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg"><ShoppingCart className="w-5 h-5 text-green-600" /></div>
                <div>
                  <p className="text-xs text-gray-500">Commandes</p>
                  <p className="text-lg font-bold">{stats.orders?.total || 0}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg"><Package className="w-5 h-5 text-purple-600" /></div>
                <div>
                  <p className="text-xs text-gray-500">Produits</p>
                  <p className="text-lg font-bold">{stats.products?.total || 0}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg"><Users className="w-5 h-5 text-amber-600" /></div>
                <div>
                  <p className="text-xs text-gray-500">Leads</p>
                  <p className="text-lg font-bold">{stats.leads?.total || 0}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
                <div>
                  <p className="text-xs text-gray-500">Stock bas</p>
                  <p className="text-lg font-bold">{stats.products?.lowStock || 0}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-100 rounded-lg"><Image className="w-5 h-5 text-cyan-600" /></div>
                <div>
                  <p className="text-xs text-gray-500">Pubs actives</p>
                  <p className="text-lg font-bold">{stats.ads?.active || 0}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex-wrap">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="categories">Catégories</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="ads">Publicités</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" /> Commandes récentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data.orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">#{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">{order.customer?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${order.total}</p>
                        <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" /> Leads récents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data.leads.slice(0, 5).map(lead => (
                    <div key={lead.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-gray-500">{lead.type} • {lead.phone}</p>
                      </div>
                      <Badge variant={lead.status === 'NEW' ? 'default' : 'secondary'}>
                        {lead.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Produits ({data.products.length})</h2>
              <Dialog open={showDialog === 'product'} onOpenChange={(open) => {
                setShowDialog(open ? 'product' : null);
                if (!open) { setEditingItem(null); setProductForm({ name: '', description: '', price: '', comparePrice: '', cost: '', categoryId: '', brand: '', stock: '', images: '', featured: false }); }
              }}>
                <DialogTrigger asChild>
                  <Button><Plus className="w-4 h-4 mr-2" /> Ajouter</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingItem ? 'Modifier' : 'Nouveau'} Produit</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input placeholder="Nom du produit *" value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} />
                    <Textarea placeholder="Description" value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} />
                    <div className="grid grid-cols-3 gap-4">
                      <Input type="number" placeholder="Prix *" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} />
                      <Input type="number" placeholder="Ancien prix" value={productForm.comparePrice} onChange={(e) => setProductForm({...productForm, comparePrice: e.target.value})} />
                      <Input type="number" placeholder="Coût" value={productForm.cost} onChange={(e) => setProductForm({...productForm, cost: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Select value={productForm.categoryId} onValueChange={(v) => setProductForm({...productForm, categoryId: v})}>
                        <SelectTrigger><SelectValue placeholder="Catégorie" /></SelectTrigger>
                        <SelectContent>
                          {data.categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Input placeholder="Marque" value={productForm.brand} onChange={(e) => setProductForm({...productForm, brand: e.target.value})} />
                    </div>
                    <Input type="number" placeholder="Stock" value={productForm.stock} onChange={(e) => setProductForm({...productForm, stock: e.target.value})} />
                    <Input placeholder="URLs images (séparées par virgule)" value={productForm.images} onChange={(e) => setProductForm({...productForm, images: e.target.value})} />
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={productForm.featured} onChange={(e) => setProductForm({...productForm, featured: e.target.checked})} />
                      Produit vedette
                    </label>
                    <Button onClick={saveProduct} className="w-full">{editingItem ? 'Mettre à jour' : 'Créer'}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {data.products.map(product => (
                <Card key={product.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Package className="w-8 h-8 text-gray-300" /></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{product.name}</h3>
                        {product.featured && <Badge variant="secondary"><Star className="w-3 h-3" /></Badge>}
                      </div>
                      <p className="text-sm text-gray-500">{product.categoryName || product.brand} • SKU: {product.sku}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="font-bold text-blue-600">${product.price}</span>
                        <span className={`text-sm ${product.stock <= (product.lowStockAlert || 5) ? 'text-red-500' : 'text-green-500'}`}>
                          Stock: {product.stock}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => {
                        setEditingItem(product);
                        setProductForm({
                          name: product.name,
                          description: product.description || '',
                          price: product.price?.toString() || '',
                          comparePrice: product.comparePrice?.toString() || '',
                          cost: product.cost?.toString() || '',
                          categoryId: product.categoryId || '',
                          brand: product.brand || '',
                          stock: product.stock?.toString() || '',
                          images: product.images?.join(', ') || '',
                          featured: product.featured || false
                        });
                        setShowDialog('product');
                      }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteItem('products', product.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Catégories ({data.categories.length})</h2>
              <Dialog open={showDialog === 'category'} onOpenChange={(open) => {
                setShowDialog(open ? 'category' : null);
                if (!open) { setEditingItem(null); setCategoryForm({ name: '', description: '', icon: '' }); }
              }}>
                <DialogTrigger asChild>
                  <Button><Plus className="w-4 h-4 mr-2" /> Ajouter</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingItem ? 'Modifier' : 'Nouvelle'} Catégorie</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input placeholder="Nom *" value={categoryForm.name} onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})} />
                    <Input placeholder="Description" value={categoryForm.description} onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})} />
                    <Input placeholder="Icône (ex: smartphone, wifi)" value={categoryForm.icon} onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})} />
                    <Button onClick={saveCategory} className="w-full">{editingItem ? 'Mettre à jour' : 'Créer'}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.categories.map(cat => (
                <Card key={cat.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{cat.name}</h3>
                      <p className="text-sm text-gray-500">{cat.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => {
                        setEditingItem(cat);
                        setCategoryForm({ name: cat.name, description: cat.description || '', icon: cat.icon || '' });
                        setShowDialog('category');
                      }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteItem('categories', cat.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <h2 className="text-xl font-bold mb-4">Commandes ({data.orders.length})</h2>
            <div className="space-y-4">
              {data.orders.map(order => (
                <Card key={order.id} className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge>{order.status}</Badge>
                        <Badge variant="outline">{order.paymentMethod}</Badge>
                      </div>
                      <h3 className="font-bold">#{order.orderNumber}</h3>
                      <p className="text-gray-600">{order.customer?.name} • {order.customer?.phone}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        {order.items?.map((item, i) => (
                          <span key={i}>{item.name} x{item.quantity}{i < order.items.length - 1 ? ', ' : ''}</span>
                        ))}
                      </div>
                      <p className="text-lg font-bold mt-2">${order.total}</p>
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Select value={order.status} onValueChange={(v) => updateOrderStatus(order.id, v)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(ORDER_STATUS).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="outline" onClick={() => printReceipt(order)}>
                        <Printer className="w-4 h-4 mr-2" /> Imprimer
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <h2 className="text-xl font-bold mb-4">Leads ({data.leads.length})</h2>
            <div className="space-y-4">
              {data.leads.map(lead => (
                <Card key={lead.id} className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={lead.status === 'NEW' ? 'default' : 'secondary'}>{lead.status}</Badge>
                        <Badge variant="outline">{lead.type}</Badge>
                      </div>
                      <h3 className="font-semibold">{lead.name}</h3>
                      <p className="text-gray-600">{lead.phone} • {lead.email}</p>
                      {lead.company && <p className="text-gray-500">{lead.company}</p>}
                      {lead.message && <p className="text-sm bg-gray-50 p-2 rounded mt-2">{lead.message}</p>}
                      <p className="text-xs text-gray-400 mt-2">{new Date(lead.createdAt).toLocaleString()}</p>
                    </div>
                    <Select value={lead.status} onValueChange={(v) => updateLeadStatus(lead.id, v)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['NEW', 'CONTACTED', 'CONFIRMED', 'INSTALLED'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Ads Tab */}
          <TabsContent value="ads">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Publicités ({data.ads.length})</h2>
              <Dialog open={showDialog === 'ad'} onOpenChange={(open) => {
                setShowDialog(open ? 'ad' : null);
                if (!open) { setEditingItem(null); setAdForm({ title: '', description: '', image: '', link: '', linkType: 'product', position: 'shop' }); }
              }}>
                <DialogTrigger asChild>
                  <Button><Plus className="w-4 h-4 mr-2" /> Ajouter</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingItem ? 'Modifier' : 'Nouvelle'} Publicité</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input placeholder="Titre *" value={adForm.title} onChange={(e) => setAdForm({...adForm, title: e.target.value})} />
                    <Textarea placeholder="Description" value={adForm.description} onChange={(e) => setAdForm({...adForm, description: e.target.value})} />
                    <Input placeholder="URL image *" value={adForm.image} onChange={(e) => setAdForm({...adForm, image: e.target.value})} />
                    <Input placeholder="Lien (optionnel)" value={adForm.link} onChange={(e) => setAdForm({...adForm, link: e.target.value})} />
                    <Select value={adForm.linkType} onValueChange={(v) => setAdForm({...adForm, linkType: v})}>
                      <SelectTrigger><SelectValue placeholder="Type de lien" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product">Produit</SelectItem>
                        <SelectItem value="category">Catégorie</SelectItem>
                        <SelectItem value="external">Externe</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={adForm.position} onValueChange={(v) => setAdForm({...adForm, position: v})}>
                      <SelectTrigger><SelectValue placeholder="Position" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Accueil</SelectItem>
                        <SelectItem value="shop">Boutique</SelectItem>
                        <SelectItem value="sidebar">Sidebar</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={saveAd} className="w-full">{editingItem ? 'Mettre à jour' : 'Créer'}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.ads.map(ad => (
                <Card key={ad.id} className="overflow-hidden">
                  {ad.image && (
                    <img src={ad.image} alt={ad.title} className="w-full h-32 object-cover" />
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={ad.active ? 'default' : 'secondary'}>{ad.active ? 'Actif' : 'Inactif'}</Badge>
                      <Badge variant="outline">{ad.position}</Badge>
                    </div>
                    <h3 className="font-semibold">{ad.title}</h3>
                    <p className="text-sm text-gray-500">{ad.clicks || 0} clics</p>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => {
                        setEditingItem(ad);
                        setAdForm({
                          title: ad.title,
                          description: ad.description || '',
                          image: ad.image || '',
                          link: ad.link || '',
                          linkType: ad.linkType || 'product',
                          position: ad.position || 'shop'
                        });
                        setShowDialog('ad');
                      }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteItem('ads', ad.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Utilisateurs ({data.users.length})</h2>
              <Dialog open={showDialog === 'user'} onOpenChange={(open) => {
                setShowDialog(open ? 'user' : null);
                if (!open) { setEditingItem(null); setUserForm({ username: '', password: '', name: '', email: '', phone: '', role: 'sales' }); }
              }}>
                <DialogTrigger asChild>
                  <Button><Plus className="w-4 h-4 mr-2" /> Ajouter</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingItem ? 'Modifier' : 'Nouvel'} Utilisateur</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input placeholder="Nom d'utilisateur *" value={userForm.username} onChange={(e) => setUserForm({...userForm, username: e.target.value})} />
                    {!editingItem && <Input type="password" placeholder="Mot de passe *" value={userForm.password} onChange={(e) => setUserForm({...userForm, password: e.target.value})} />}
                    <Input placeholder="Nom complet *" value={userForm.name} onChange={(e) => setUserForm({...userForm, name: e.target.value})} />
                    <Input placeholder="Email" value={userForm.email} onChange={(e) => setUserForm({...userForm, email: e.target.value})} />
                    <Input placeholder="Téléphone" value={userForm.phone} onChange={(e) => setUserForm({...userForm, phone: e.target.value})} />
                    <Select value={userForm.role} onValueChange={(v) => setUserForm({...userForm, role: v})}>
                      <SelectTrigger><SelectValue placeholder="Rôle" /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(USER_ROLES).map(([key, value]) => (
                          <SelectItem key={value} value={value}>{key}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={saveUser} className="w-full">{editingItem ? 'Mettre à jour' : 'Créer'}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.users.map(u => (
                <Card key={u.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{u.name}</h3>
                      <p className="text-sm text-gray-500">@{u.username}</p>
                      <Badge variant="outline" className="mt-1">{u.role}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => {
                        setEditingItem(u);
                        setUserForm({ username: u.username, password: '', name: u.name, email: u.email || '', phone: u.phone || '', role: u.role });
                        setShowDialog('user');
                      }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteItem('users', u.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles">
            <h2 className="text-xl font-bold mb-4">Articles ({data.articles.length})</h2>
            <p className="text-gray-500 mb-4">Gérez les articles du blog depuis cette section</p>
            {/* Articles management similar to before */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ============ OTHER PAGES (Simplified) ============
function StarlinkPage({ locale }) {
  const t = translations[locale];
  return (
    <div className="pt-20">
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">{t.starlinkOffer.title}</h1>
          <p className="text-xl text-gray-300 mb-12">Internet satellite haute performance</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { label: 'Kit Starlink', price: '$150', note: 'minimum à l\'obtention' },
              { label: 'Mensuels', price: '$100', note: '× 5 mois' },
              { label: 'Abonnement', price: 'Non inclus', note: 'mensuel Starlink' }
            ].map((item, i) => (
              <Card key={i} className="p-6 bg-white/10 backdrop-blur border-white/20 text-center">
                <p className="text-blue-400 mb-2">{item.label}</p>
                <p className="text-3xl font-bold text-white">{item.price}</p>
                <p className="text-gray-400 text-sm">{item.note}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function NetworkPage({ locale }) {
  return (
    <div className="pt-20">
      <section className="py-24 bg-gradient-to-br from-violet-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            {locale === 'fr' ? 'Réseaux & IT' : 'Network & IT'}
          </h1>
          <p className="text-xl text-gray-300">Infrastructure réseau, hotspot MikroTik et développement</p>
        </div>
      </section>
    </div>
  );
}

function PartnersPage({ locale }) {
  return (
    <div className="pt-20">
      <section className="py-24 bg-gradient-to-br from-emerald-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            {locale === 'fr' ? 'Devenez Revendeur' : 'Become a Reseller'}
          </h1>
        </div>
      </section>
    </div>
  );
}

function AboutPage({ locale }) {
  return (
    <div className="pt-20">
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">À Propos de NEXORA</h1>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <img src={SITE_CONFIG.ceo.photo} alt={SITE_CONFIG.ceo.name} className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-blue-500" />
          <h2 className="text-2xl font-bold">{SITE_CONFIG.ceo.name}</h2>
          <p className="text-blue-600 font-medium">{SITE_CONFIG.ceo.role}</p>
          <p className="text-gray-600 mt-2">{SITE_CONFIG.ceo.title}</p>
        </div>
      </section>
    </div>
  );
}

function ContactPage({ locale }) {
  return (
    <div className="pt-20">
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">Contact</h1>
          <div className="flex flex-wrap justify-center gap-4 text-white">
            {SITE_CONFIG.contact.phones.map((phone, i) => (
              <a key={i} href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <Phone className="w-4 h-4" /> {phone}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ============ FOOTER ============
function Footer({ locale, setCurrentPage }) {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={SITE_CONFIG.logo} alt="NEXORA" className="h-12 w-12" />
              <span className="font-bold text-xl">NEXORA NTN</span>
            </div>
            <p className="text-gray-400 mb-6">Technologies & Networks — Connectivité & Solutions IT Premium</p>
            <div className="space-y-2 text-gray-400 text-sm">
              {SITE_CONFIG.contact.phones.slice(0, 2).map((phone, i) => <p key={i}>{phone}</p>)}
              <p>{SITE_CONFIG.contact.email}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => setCurrentPage('shop')} className="hover:text-white">Boutique</button></li>
              <li><button onClick={() => setCurrentPage('starlink')} className="hover:text-white">Starlink</button></li>
              <li><button onClick={() => setCurrentPage('network')} className="hover:text-white">Réseaux</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Entreprise</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => setCurrentPage('about')} className="hover:text-white">À propos</button></li>
              <li><button onClick={() => setCurrentPage('partners')} className="hover:text-white">Revendeurs</button></li>
              <li><button onClick={() => setCurrentPage('contact')} className="hover:text-white">Contact</button></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} NEXORA Technologies & Networks. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}

// ============ WHATSAPP BUTTON ============
function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 hover:scale-110 transition-all"
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </a>
  );
}

// ============ MAIN APP ============
export default function App() {
  const [locale, setLocale] = useState('fr');
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <><HeroSection locale={locale} setCurrentPage={setCurrentPage} /></>;
      case 'shop': return <ShopPage locale={locale} setCurrentPage={setCurrentPage} />;
      case 'cart': return <CartPage locale={locale} setCurrentPage={setCurrentPage} />;
      case 'starlink': return <StarlinkPage locale={locale} />;
      case 'network': return <NetworkPage locale={locale} />;
      case 'partners': return <PartnersPage locale={locale} />;
      case 'about': return <AboutPage locale={locale} />;
      case 'contact': return <ContactPage locale={locale} />;
      case 'portal': return <PortalPage locale={locale} />;
      default: return <><HeroSection locale={locale} setCurrentPage={setCurrentPage} /></>;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <main className="min-h-screen">
          <Navigation locale={locale} setLocale={setLocale} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          {renderPage()}
          {!['portal', 'cart'].includes(currentPage) && <Footer locale={locale} setCurrentPage={setCurrentPage} />}
          <WhatsAppButton />
        </main>
      </CartProvider>
    </AuthProvider>
  );
}
