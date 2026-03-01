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
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };
  
  const removeFromCart = (productId) => setCart(prev => prev.filter(item => item.id !== productId));
  
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
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

function useCart() { return useContext(CartContext); }

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
    if (data.success) { setUser(data.user); setToken(data.token); return { success: true }; }
    return { success: false, error: data.error };
  };
  
  const logout = () => { setUser(null); setToken(null); };
  
  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() { return useContext(AuthContext); }

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
    { id: 'projects', label: t.nav.projects },
    { id: 'contact', label: t.nav.contact },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg shadow-black/5' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <button onClick={() => setCurrentPage('home')} className="flex items-center space-x-2 group">
            <img src={SITE_CONFIG.logo} alt="NEXORA" className="h-10 w-10 object-contain" />
            <span className="font-bold text-xl tracking-tight hidden sm:block">NEXORA</span>
          </button>

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

          <div className="flex items-center space-x-3">
            <button onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')} className="px-3 py-1.5 text-sm font-medium rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
              {locale === 'fr' ? 'EN' : 'FR'}
            </button>

            <button onClick={() => setCurrentPage('cart')} className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </button>

            <Button onClick={() => setCurrentPage('shop')} className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30">
              {locale === 'fr' ? 'Acheter' : 'Shop'}
            </Button>

            <button onClick={() => setCurrentPage('portal')} className="hidden lg:block px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors">
              Portail
            </button>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

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

// ============ CONTACT FORM ============
function ContactForm({ locale, type = 'contact' }) {
  const t = translations[locale];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', company: '', country: 'RDC', city: '', message: '', pack: '', service: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type })
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', phone: '', email: '', company: '', country: 'RDC', city: '', message: '', pack: '', service: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    }
    
    setIsSubmitting(false);
    setTimeout(() => setSubmitStatus(null), 5000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input placeholder={t.contact.name + ' *'} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="bg-white/80 border-gray-200 focus:border-blue-500 h-12" />
        <Input placeholder={t.contact.phone + ' *'} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required className="bg-white/80 border-gray-200 focus:border-blue-500 h-12" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input type="email" placeholder={t.contact.email} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-white/80 border-gray-200 focus:border-blue-500 h-12" />
        <Input placeholder={t.contact.company} value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="bg-white/80 border-gray-200 focus:border-blue-500 h-12" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Select value={formData.country} onValueChange={(v) => setFormData({...formData, country: v})}>
          <SelectTrigger className="bg-white/80 border-gray-200 focus:border-blue-500 h-12"><SelectValue placeholder={t.contact.country} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="RDC">RD Congo</SelectItem>
            <SelectItem value="Congo">Congo</SelectItem>
            <SelectItem value="Rwanda">Rwanda</SelectItem>
            <SelectItem value="Burundi">Burundi</SelectItem>
            <SelectItem value="Uganda">Uganda</SelectItem>
            <SelectItem value="Kenya">Kenya</SelectItem>
            <SelectItem value="Other">Autre</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder={t.contact.city} value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="bg-white/80 border-gray-200 focus:border-blue-500 h-12" />
      </div>

      {type === 'starlink' && (
        <Select value={formData.pack} onValueChange={(v) => setFormData({...formData, pack: v})}>
          <SelectTrigger className="bg-white/80 border-gray-200 focus:border-blue-500 h-12"><SelectValue placeholder={t.form.selectPack} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="home">Maison / Home</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="school">École / School</SelectItem>
            <SelectItem value="cyber">Cybercafé</SelectItem>
          </SelectContent>
        </Select>
      )}

      {type === 'quote' && (
        <Select value={formData.service} onValueChange={(v) => setFormData({...formData, service: v})}>
          <SelectTrigger className="bg-white/80 border-gray-200 focus:border-blue-500 h-12"><SelectValue placeholder={t.form.selectService} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="starlink">Starlink</SelectItem>
            <SelectItem value="network">Réseaux / Network</SelectItem>
            <SelectItem value="mikrotik">Hotspot MikroTik</SelectItem>
            <SelectItem value="it">Solutions IT</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Textarea placeholder={t.form.details} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="bg-white/80 border-gray-200 focus:border-blue-500 min-h-[120px]" />

      <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg shadow-lg shadow-blue-500/30">
        {isSubmitting ? t.form.submitting : t.form.submit}
      </Button>

      {submitStatus === 'success' && <div className="p-4 bg-green-100 text-green-700 rounded-xl text-center font-medium">{t.form.success}</div>}
      {submitStatus === 'error' && <div className="p-4 bg-red-100 text-red-700 rounded-xl text-center font-medium">{t.form.error}</div>}
    </form>
  );
}

// ============ HOME PAGE ============
function HomePage({ locale, setCurrentPage }) {
  const t = translations[locale];
  
  const services = [
    { icon: Satellite, title: t.services.starlink.title, desc: t.services.starlink.desc, color: 'from-blue-600 to-cyan-500', page: 'starlink' },
    { icon: Wifi, title: t.services.network.title, desc: t.services.network.desc, color: 'from-violet-600 to-purple-500', page: 'network' },
    { icon: Globe, title: t.services.mikrotik.title, desc: t.services.mikrotik.desc, color: 'from-orange-500 to-amber-500', page: 'network' },
    { icon: Code, title: t.services.it.title, desc: t.services.it.desc, color: 'from-emerald-500 to-teal-500', page: 'network' }
  ];

  const reasons = [
    { icon: Award, title: t.why.corporate.title, desc: t.why.corporate.desc, gradient: 'from-blue-600 to-indigo-600' },
    { icon: Zap, title: t.why.performance.title, desc: t.why.performance.desc, gradient: 'from-amber-500 to-orange-500' },
    { icon: Shield, title: t.why.support.title, desc: t.why.support.desc, gradient: 'from-emerald-500 to-teal-500' }
  ];

  const packs = [
    { icon: HomeIcon, label: t.starlinkOffer.house },
    { icon: Briefcase, label: t.starlinkOffer.business },
    { icon: GraduationCap, label: t.starlinkOffer.school },
    { icon: Coffee, label: t.starlinkOffer.cyber }
  ];
  
  return (
    <>
      {/* Hero */}
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
              {locale === 'fr' ? 'Partenaire Starlink & Boutique Tech en RDC' : 'Starlink Partner & Tech Store in DRC'}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              {t.hero.title}<br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{t.hero.titleHighlight}</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">{t.hero.subtitle}</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={() => setCurrentPage('contact')} size="lg" className="bg-white text-slate-900 hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-2xl shadow-white/20 group">
                {t.hero.cta1}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button onClick={() => setCurrentPage('starlink')} size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold backdrop-blur-sm">
                {t.hero.cta2}
              </Button>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-white/50 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{t.services.title}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t.services.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="group cursor-pointer border-0 shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/50 transition-all duration-500 hover:-translate-y-2" onClick={() => setCurrentPage(service.page)}>
                <CardContent className="p-8">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Starlink Offer */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-6">{t.starlinkOffer.subtitle}</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8">{t.starlinkOffer.title}</h2>

              <div className="space-y-4 mb-8">
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-400 font-medium">{t.starlinkOffer.kit}</p>
                      <p className="text-2xl font-bold text-white">{t.starlinkOffer.kitPrice}</p>
                    </div>
                    <Check className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-400 font-medium">{t.starlinkOffer.monthly}</p>
                      <p className="text-2xl font-bold text-white">{t.starlinkOffer.monthlyPrice}</p>
                    </div>
                    <Check className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur border border-amber-500/30 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-400 font-medium">{t.starlinkOffer.subscription}</p>
                      <p className="text-lg text-gray-400">{t.starlinkOffer.subscriptionNote}</p>
                    </div>
                    <Star className="w-8 h-8 text-amber-400" />
                  </div>
                </div>
              </div>

              <Button onClick={() => setCurrentPage('starlink')} size="lg" className="bg-white text-slate-900 hover:bg-gray-100 text-lg px-8 py-6 shadow-2xl shadow-white/20">
                {t.starlinkOffer.cta}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-6">{t.starlinkOffer.packs}</h3>
              <div className="grid grid-cols-2 gap-4">
                {packs.map((pack, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all cursor-pointer group">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <pack.icon className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white font-medium">{pack.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{locale === 'fr' ? 'Découvrez notre Boutique' : 'Discover our Shop'}</h2>
          <p className="text-blue-100 mb-8">{locale === 'fr' ? 'Téléphones California, Kits Starlink, Accessoires et plus' : 'California phones, Starlink kits, Accessories and more'}</p>
          <Button onClick={() => setCurrentPage('shop')} size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            <ShoppingCart className="w-5 h-5 mr-2" />
            {locale === 'fr' ? 'Visiter la Boutique' : 'Visit Shop'}
          </Button>
        </div>
      </section>

      {/* Why Nexora */}
      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{t.why.title}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {reasons.map((reason, index) => (
              <div key={index} className="text-center p-8 rounded-3xl bg-white shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/50 transition-all duration-500 hover:-translate-y-2">
                <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${reason.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                  <reason.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{reason.title}</h3>
                <p className="text-gray-600 leading-relaxed">{reason.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{t.contact.quickContact}</h2>
              <p className="text-lg text-gray-600 mb-8">{t.contact.quickContactDesc}</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-semibold text-gray-900">+243 971 037 431</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900">nexorainfo@nexora.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-3xl p-8">
              <ContactForm locale={locale} type="contact" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">{locale === 'fr' ? 'Prêt à déployer ?' : 'Ready to deploy?'}</h2>
          <p className="text-xl text-blue-100 mb-10">{locale === 'fr' ? 'Demandez un devis ou envoyez une demande Starlink maintenant.' : 'Request a quote or send a Starlink request now.'}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={() => setCurrentPage('contact')} size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-2xl">{t.hero.cta1}</Button>
            <Button onClick={() => setCurrentPage('starlink')} size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold">{t.hero.cta2}</Button>
          </div>
        </div>
      </section>
    </>
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
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{locale === 'fr' ? 'Notre Boutique' : 'Our Shop'}</h1>
          <p className="text-xl text-blue-100">{locale === 'fr' ? 'Téléphones, Starlink, Accessoires et plus' : 'Phones, Starlink, Accessories and more'}</p>
        </div>
      </section>

      {ads.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ads.slice(0, 3).map((ad) => (
              <div key={ad.id} onClick={() => handleAdClick(ad)} className="relative overflow-hidden rounded-2xl cursor-pointer group">
                <img src={ad.image} alt={ad.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
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

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input placeholder={locale === 'fr' ? 'Rechercher un produit...' : 'Search products...'} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-12" />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button variant={selectedCategory === 'all' ? 'default' : 'outline'} onClick={() => setSelectedCategory('all')} className="rounded-full">{locale === 'fr' ? 'Tout' : 'All'}</Button>
            {categories.map((cat) => (
              <Button key={cat.id} variant={selectedCategory === cat.id ? 'default' : 'outline'} onClick={() => setSelectedCategory(cat.id)} className="rounded-full">{cat.name}</Button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" /></div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Package className="w-16 h-16 text-gray-300" /></div>
                  )}
                  {product.comparePrice > product.price && (
                    <Badge className="absolute top-2 left-2 bg-red-500">-{Math.round((1 - product.price / product.comparePrice) * 100)}%</Badge>
                  )}
                  {product.featured && <Badge className="absolute top-2 right-2 bg-amber-500"><Star className="w-3 h-3 mr-1" /> Featured</Badge>}
                </div>
                <CardContent className="p-4">
                  <p className="text-xs text-blue-600 font-medium mb-1">{product.categoryName || product.brand}</p>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold text-gray-900">${product.price}</span>
                    {product.comparePrice > product.price && <span className="text-sm text-gray-400 line-through">${product.comparePrice}</span>}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => addToCart(product)} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={product.stock <= 0}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.stock <= 0 ? 'Rupture' : 'Ajouter'}
                    </Button>
                    <Button variant="outline" onClick={() => window.open(`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(`Je suis intéressé par: ${product.name} ($${product.price})`)}`, '_blank')}>
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
            <p className="text-gray-500 text-lg">{locale === 'fr' ? 'Aucun produit trouvé' : 'No products found'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ CART PAGE ============
function CartPage({ locale, setCurrentPage }) {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const [customerForm, setCustomerForm] = useState({ name: '', phone: '', email: '', address: '' });
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
            items: cart.map(item => ({ productId: item.id, name: item.name, price: item.price, quantity: item.quantity })),
            subtotal: cartTotal,
            total: cartTotal,
            paymentMethod
          })
        });
        const data = await res.json();
        if (data.success) { setOrderSuccess(data.data); clearCart(); }
      } catch (error) { console.error('Order error:', error); }
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{locale === 'fr' ? 'Commande envoyée !' : 'Order sent!'}</h2>
          <p className="text-gray-600 mb-6">{locale === 'fr' ? 'Nous vous contacterons bientôt pour confirmer votre commande.' : 'We will contact you soon to confirm your order.'}</p>
          <p className="text-sm text-gray-500 mb-6">Commande: #{orderSuccess.orderNumber}</p>
          <Button onClick={() => setCurrentPage('shop')} className="w-full">{locale === 'fr' ? 'Continuer les achats' : 'Continue shopping'}</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{locale === 'fr' ? 'Votre Panier' : 'Your Cart'}</h1>

        {cart.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-6">{locale === 'fr' ? 'Votre panier est vide' : 'Your cart is empty'}</p>
            <Button onClick={() => setCurrentPage('shop')}>{locale === 'fr' ? 'Visiter la boutique' : 'Visit shop'}</Button>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.images?.[0] ? <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package className="w-8 h-8 text-gray-300" /></div>}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-blue-600 font-bold">${item.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="w-4 h-4" /></Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => removeFromCart(item.id)} className="ml-auto text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                    <div className="text-right"><p className="font-bold text-lg">${item.price * item.quantity}</p></div>
                  </div>
                </Card>
              ))}
            </div>

            <div>
              <Card className="p-6 sticky top-24">
                <h3 className="text-lg font-semibold mb-4">{locale === 'fr' ? 'Récapitulatif' : 'Summary'}</h3>
                
                <div className="space-y-3 mb-6">
                  <Input placeholder={locale === 'fr' ? 'Votre nom *' : 'Your name *'} value={customerForm.name} onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})} />
                  <Input placeholder={locale === 'fr' ? 'Téléphone *' : 'Phone *'} value={customerForm.phone} onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})} />
                  <Input placeholder="Email" value={customerForm.email} onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})} />
                  <Input placeholder={locale === 'fr' ? 'Adresse' : 'Address'} value={customerForm.address} onChange={(e) => setCustomerForm({...customerForm, address: e.target.value})} />
                </div>

                <div className="space-y-2 mb-6">
                  <label className="text-sm font-medium">{locale === 'fr' ? 'Mode de paiement' : 'Payment method'}</label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp">WhatsApp (Commander)</SelectItem>
                      <SelectItem value="cash">Cash à la livraison</SelectItem>
                      <SelectItem value="mobile_money">Mobile Money</SelectItem>
                      <SelectItem value="card">Carte bancaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold"><span>Total</span><span>${cartTotal}</span></div>
                </div>

                <Button onClick={handleCheckout} disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
                  {paymentMethod === 'whatsapp' && <MessageCircle className="w-5 h-5 mr-2" />}
                  {paymentMethod === 'whatsapp' ? (locale === 'fr' ? 'Commander via WhatsApp' : 'Order via WhatsApp') : (locale === 'fr' ? 'Passer la commande' : 'Place order')}
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ STARLINK PAGE ============
function StarlinkPage({ locale }) {
  const t = translations[locale];
  
  return (
    <div className="pt-20">
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-6">Starlink en RDC</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">{t.starlinkOffer.title}</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">Internet satellite haute performance pour les particuliers et entreprises</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { label: t.starlinkOffer.kit, price: '$150', note: 'minimum à l\'obtention', icon: Satellite },
              { label: t.starlinkOffer.monthly, price: '$100', note: '/ mois × 5 mois', icon: Zap },
              { label: t.starlinkOffer.subscription, price: 'Non inclus', note: 'abonnement mensuel', icon: Star }
            ].map((item, i) => (
              <Card key={i} className="p-8 bg-white/10 backdrop-blur border-white/20 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-blue-400 font-medium mb-2">{item.label}</p>
                <p className="text-3xl font-bold text-white">{item.price}</p>
                <p className="text-gray-400 text-sm mt-2">{item.note}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{t.starlinkOffer.packs}</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { icon: HomeIcon, label: t.starlinkOffer.house, desc: 'Usage résidentiel' },
              { icon: Briefcase, label: t.starlinkOffer.business, desc: 'PME & Entreprises' },
              { icon: GraduationCap, label: t.starlinkOffer.school, desc: 'Établissements scolaires' },
              { icon: Coffee, label: t.starlinkOffer.cyber, desc: 'Cybercafés & Hotspot' }
            ].map((pack, i) => (
              <Card key={i} className="text-center p-8 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                  <pack.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{pack.label}</h3>
                <p className="text-gray-600">{pack.desc}</p>
              </Card>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{t.faq.title}</h2>
            <div className="space-y-4">
              {[
                { q: t.faq.q1, a: t.faq.a1 },
                { q: t.faq.q2, a: t.faq.a2 },
                { q: t.faq.q3, a: t.faq.a3 },
                { q: t.faq.q4, a: t.faq.a4 }
              ].map((faq, i) => (
                <div key={i} className="p-6 bg-gray-50 rounded-2xl">
                  <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{locale === 'fr' ? 'Demander mon kit Starlink' : 'Request my Starlink kit'}</h2>
            <p className="text-gray-600">{locale === 'fr' ? 'Remplissez le formulaire et nous vous contacterons rapidement.' : 'Fill out the form and we will contact you shortly.'}</p>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <ContactForm locale={locale} type="starlink" />
          </div>
        </div>
      </section>
    </div>
  );
}

// ============ NETWORK PAGE ============
function NetworkPage({ locale }) {
  const services = [
    { title: locale === 'fr' ? 'Réseaux LAN/Wi-Fi' : 'LAN/Wi-Fi Networks', desc: locale === 'fr' ? 'Architecture réseau complète, couverture Wi-Fi optimisée, sécurisation avancée.' : 'Complete network architecture, optimized Wi-Fi coverage, advanced security.', features: ['Architecture LAN', 'Wi-Fi professionnel', 'Sécurité réseau', 'VPN & Firewall'] },
    { title: 'Hotspot MikroTik', desc: locale === 'fr' ? 'Système de vouchers, contrôle d\'accès et monétisation pour business et cybercafés.' : 'Voucher system, access control and monetization for business and cybercafés.', features: ['Vouchers', 'Portail captif', 'Contrôle bande passante', 'Rapports'] },
    { title: locale === 'fr' ? 'Solutions IT' : 'IT Solutions', desc: locale === 'fr' ? 'Développement web/mobile, applications de gestion sur mesure.' : 'Web/mobile development, custom management applications.', features: ['Sites web', 'Apps mobiles', 'Logiciels de gestion', 'Maintenance'] }
  ];

  return (
    <div className="pt-20">
      <section className="py-24 bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">{locale === 'fr' ? 'Réseaux & Solutions IT' : 'Network & IT Solutions'}</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">{locale === 'fr' ? 'Infrastructure réseau, hotspot MikroTik et développement sur mesure' : 'Network infrastructure, MikroTik hotspot and custom development'}</p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <Card key={i} className="p-8 hover:shadow-xl transition-all">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.desc}</p>
                <ul className="space-y-2">
                  {service.features.map((f, j) => (
                    <li key={j} className="flex items-center text-gray-700">
                      <Check className="w-5 h-5 text-green-500 mr-2" />{f}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{locale === 'fr' ? 'Demander un devis' : 'Request a quote'}</h2>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <ContactForm locale={locale} type="quote" />
          </div>
        </div>
      </section>
    </div>
  );
}

// ============ PARTNERS PAGE ============
function PartnersPage({ locale }) {
  const t = translations[locale];
  
  return (
    <div className="pt-20">
      <section className="py-24 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">{t.partners.title}</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t.partners.subtitle}</p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{t.partners.benefits}</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[t.partners.benefit1, t.partners.benefit2, t.partners.benefit3, t.partners.benefit4].map((benefit, i) => (
              <Card key={i} className="p-6 text-center hover:shadow-xl transition-all">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <Check className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="font-medium text-gray-900">{benefit}</p>
              </Card>
            ))}
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-50 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">{locale === 'fr' ? 'Devenir partenaire' : 'Become a partner'}</h3>
              <ContactForm locale={locale} type="partner" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============ ABOUT PAGE ============
function AboutPage({ locale }) {
  const t = translations[locale];
  
  return (
    <div className="pt-20">
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">{t.about.title}</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t.about.subtitle}</p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.about.vision}</h3>
              <p className="text-gray-600">{t.about.visionText}</p>
            </Card>
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.about.mission}</h3>
              <p className="text-gray-600">{t.about.missionText}</p>
            </Card>
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.about.values}</h3>
              <p className="text-gray-600">{t.about.valuesText}</p>
            </Card>
          </div>

          <div className="max-w-xl mx-auto text-center">
            <div className="bg-gray-50 rounded-3xl p-8">
              <img src={SITE_CONFIG.ceo.photo} alt={SITE_CONFIG.ceo.name} className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-blue-500 shadow-xl" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{SITE_CONFIG.ceo.name}</h3>
              <p className="text-blue-600 font-medium mb-2">{SITE_CONFIG.ceo.role}</p>
              <p className="text-gray-600">{SITE_CONFIG.ceo.title}</p>
              <p className="text-gray-500 text-sm mt-2">{t.about.representativeRole}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============ PROJECTS PAGE ============
function ProjectsPage({ locale }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles?published=true');
      const data = await res.json();
      if (data.success) setArticles(data.data);
    } catch (error) { console.error('Error:', error); }
    setLoading(false);
  };

  return (
    <div className="pt-20">
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">{locale === 'fr' ? 'Projets & Actualités' : 'Projects & News'}</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">{locale === 'fr' ? 'Découvrez nos réalisations et restez informé de nos actualités' : 'Discover our achievements and stay informed of our news'}</p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12"><div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" /></div>
          ) : articles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-xl transition-all">
                  {article.image && <div className="h-48 overflow-hidden"><img src={article.image} alt={article.title} className="w-full h-full object-cover" /></div>}
                  <CardContent className="p-6">
                    <p className="text-sm text-blue-600 font-medium mb-2">{article.category || 'Article'}</p>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{article.title}</h3>
                    <p className="text-gray-600 line-clamp-3">{article.excerpt || article.content?.substring(0, 150)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12"><p className="text-gray-500 text-lg">{locale === 'fr' ? 'Aucun article pour le moment.' : 'No articles yet.'}</p></div>
          )}
        </div>
      </section>
    </div>
  );
}

// ============ CONTACT PAGE ============
function ContactPage({ locale }) {
  const t = translations[locale];
  const contacts = [
    { icon: Phone, label: '+243 971 037 431' },
    { icon: Phone, label: '+243 822 888 909' },
    { icon: Phone, label: '+256 702 282 251' },
    { icon: Phone, label: '+254 11 746 6544' },
    { icon: Mail, label: 'nexorainfo@nexora.com' },
    { icon: Globe, label: 'www.nexora.cd' }
  ];

  return (
    <div className="pt-20">
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">{t.contact.title}</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t.contact.subtitle}</p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">{locale === 'fr' ? 'Nos coordonnées' : 'Our contact details'}</h2>
              
              <div className="space-y-4 mb-8">
                {contacts.map((contact, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <contact.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-900">{contact.label}</span>
                  </div>
                ))}
              </div>

              <a href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors">
                <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp
              </a>
            </div>

            <div className="bg-gray-50 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{t.contact.quickContact}</h3>
              <ContactForm locale={locale} type="contact" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============ PORTAL PAGE (ADMIN/EMPLOYEE) ============
function PortalPage({ locale }) {
  const { user, login, logout, isAuthenticated } = useAuth();
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [data, setData] = useState({ leads: [], products: [], categories: [], orders: [], users: [], ads: [], articles: [] });
  const [loading, setLoading] = useState(false);
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', comparePrice: '', cost: '', categoryId: '', brand: '', stock: '', images: '', featured: false });
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', icon: '' });
  const [adForm, setAdForm] = useState({ title: '', description: '', image: '', link: '', linkType: 'product', position: 'shop' });
  const [userForm, setUserForm] = useState({ username: '', password: '', name: '', email: '', phone: '', role: 'sales' });
  const [articleForm, setArticleForm] = useState({ title: '', content: '', excerpt: '', category: '', image: '', published: false });
  const [editingItem, setEditingItem] = useState(null);
  const [showDialog, setShowDialog] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(loginForm.username, loginForm.password);
    if (!result.success) setLoginError(locale === 'fr' ? 'Identifiants incorrects' : 'Invalid credentials');
    else fetchAllData();
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(['stats', 'leads', 'products', 'categories', 'orders', 'users', 'ads', 'articles'].map(ep => fetch(`/api/${ep}`).then(r => r.json())));
      setStats(results[0].data);
      setData({ leads: results[1].data || [], products: results[2].data || [], categories: results[3].data || [], orders: results[4].data || [], users: results[5].data || [], ads: results[6].data || [], articles: results[7].data || [] });
    } catch (error) { console.error('Error:', error); }
    setLoading(false);
  };

  useEffect(() => { if (isAuthenticated) fetchAllData(); }, [isAuthenticated]);

  const saveProduct = async () => {
    const method = editingItem ? 'PUT' : 'POST';
    const url = editingItem ? `/api/products/${editingItem.id}` : '/api/products';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...productForm, price: parseFloat(productForm.price) || 0, comparePrice: parseFloat(productForm.comparePrice) || 0, cost: parseFloat(productForm.cost) || 0, stock: parseInt(productForm.stock) || 0, images: productForm.images ? productForm.images.split(',').map(s => s.trim()) : [], categoryName: data.categories.find(c => c.id === productForm.categoryId)?.name || '' }) });
    setProductForm({ name: '', description: '', price: '', comparePrice: '', cost: '', categoryId: '', brand: '', stock: '', images: '', featured: false });
    setEditingItem(null); setShowDialog(null); fetchAllData();
  };

  const saveCategory = async () => {
    const method = editingItem ? 'PUT' : 'POST';
    const url = editingItem ? `/api/categories/${editingItem.id}` : '/api/categories';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(categoryForm) });
    setCategoryForm({ name: '', description: '', icon: '' }); setEditingItem(null); setShowDialog(null); fetchAllData();
  };

  const saveAd = async () => {
    const method = editingItem ? 'PUT' : 'POST';
    const url = editingItem ? `/api/ads/${editingItem.id}` : '/api/ads';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(adForm) });
    setAdForm({ title: '', description: '', image: '', link: '', linkType: 'product', position: 'shop' }); setEditingItem(null); setShowDialog(null); fetchAllData();
  };

  const saveUser = async () => {
    const method = editingItem ? 'PUT' : 'POST';
    const url = editingItem ? `/api/users/${editingItem.id}` : '/api/users';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userForm) });
    setUserForm({ username: '', password: '', name: '', email: '', phone: '', role: 'sales' }); setEditingItem(null); setShowDialog(null); fetchAllData();
  };

  const saveArticle = async () => {
    const method = editingItem ? 'PUT' : 'POST';
    const url = editingItem ? `/api/articles/${editingItem.id}` : '/api/articles';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(articleForm) });
    setArticleForm({ title: '', content: '', excerpt: '', category: '', image: '', published: false }); setEditingItem(null); setShowDialog(null); fetchAllData();
  };

  const deleteItem = async (type, id) => { if (!confirm('Confirmer?')) return; await fetch(`/api/${type}/${id}`, { method: 'DELETE' }); fetchAllData(); };
  const updateLeadStatus = async (id, status) => { await fetch(`/api/leads/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }); fetchAllData(); };
  const updateOrderStatus = async (id, status) => { await fetch(`/api/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }); fetchAllData(); };

  const printReceipt = (order) => {
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>Reçu #${order.orderNumber}</title><style>body{font-family:Arial;padding:20px;max-width:400px;margin:0 auto}.header{text-align:center;border-bottom:2px solid #000;padding-bottom:10px;margin-bottom:20px}.logo{font-size:24px;font-weight:bold}.item{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px dashed #ccc}.total{font-size:18px;font-weight:bold;text-align:right;margin-top:20px;padding-top:10px;border-top:2px solid #000}.footer{text-align:center;margin-top:30px;font-size:12px;color:#666}</style></head><body><div class="header"><div class="logo">NEXORA NTN</div><p>Technologies & Networks</p><p>+243 971 037 431</p></div><p><strong>Reçu #${order.orderNumber}</strong></p><p>Date: ${new Date(order.createdAt).toLocaleString()}</p><p>Client: ${order.customer?.name || 'N/A'}</p><p>Tél: ${order.customer?.phone || 'N/A'}</p><div class="items">${order.items?.map(i => `<div class="item"><span>${i.name} x${i.quantity}</span><span>$${i.price * i.quantity}</span></div>`).join('')}</div><div class="total">TOTAL: $${order.total}</div><p>Paiement: ${order.paymentMethod}</p><div class="footer"><p>Merci pour votre achat!</p><p>www.nexora.cd</p></div></body></html>`);
    w.document.close(); w.print();
  };

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
            <Input placeholder="Nom d'utilisateur" value={loginForm.username} onChange={(e) => setLoginForm({...loginForm, username: e.target.value})} />
            <Input type="password" placeholder="Mot de passe" value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} />
            {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Se connecter</Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-100">
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={SITE_CONFIG.logo} alt="NEXORA" className="h-10 w-10" />
            <div><h1 className="font-bold text-lg">Portail NEXORA</h1><p className="text-sm text-gray-500">{user?.name || 'Admin'} • {user?.role || 'super_admin'}</p></div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={fetchAllData}><Bell className="w-4 h-4" /></Button>
            <Button variant="ghost" size="sm" onClick={logout}><LogOut className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <Card className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-blue-100 rounded-lg"><DollarSign className="w-5 h-5 text-blue-600" /></div><div><p className="text-xs text-gray-500">Revenus</p><p className="text-lg font-bold">${stats.revenue?.total || 0}</p></div></div></Card>
            <Card className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-green-100 rounded-lg"><ShoppingCart className="w-5 h-5 text-green-600" /></div><div><p className="text-xs text-gray-500">Commandes</p><p className="text-lg font-bold">{stats.orders?.total || 0}</p></div></div></Card>
            <Card className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-purple-100 rounded-lg"><Package className="w-5 h-5 text-purple-600" /></div><div><p className="text-xs text-gray-500">Produits</p><p className="text-lg font-bold">{stats.products?.total || 0}</p></div></div></Card>
            <Card className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-amber-100 rounded-lg"><Users className="w-5 h-5 text-amber-600" /></div><div><p className="text-xs text-gray-500">Leads</p><p className="text-lg font-bold">{stats.leads?.total || 0}</p></div></div></Card>
            <Card className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-red-100 rounded-lg"><AlertTriangle className="w-5 h-5 text-red-600" /></div><div><p className="text-xs text-gray-500">Stock bas</p><p className="text-lg font-bold">{stats.products?.lowStock || 0}</p></div></div></Card>
            <Card className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-cyan-100 rounded-lg"><Image className="w-5 h-5 text-cyan-600" /></div><div><p className="text-xs text-gray-500">Pubs</p><p className="text-lg font-bold">{stats.ads?.active || 0}</p></div></div></Card>
          </div>
        )}

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

          <TabsContent value="dashboard">
            <div className="grid md:grid-cols-2 gap-6">
              <Card><CardHeader><CardTitle className="flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> Commandes récentes</CardTitle></CardHeader><CardContent>{data.orders.slice(0, 5).map(order => (<div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0"><div><p className="font-medium">#{order.orderNumber}</p><p className="text-sm text-gray-500">{order.customer?.name}</p></div><div className="text-right"><p className="font-bold">${order.total}</p><Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>{order.status}</Badge></div></div>))}</CardContent></Card>
              <Card><CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Leads récents</CardTitle></CardHeader><CardContent>{data.leads.slice(0, 5).map(lead => (<div key={lead.id} className="flex items-center justify-between py-2 border-b last:border-0"><div><p className="font-medium">{lead.name}</p><p className="text-sm text-gray-500">{lead.type} • {lead.phone}</p></div><Badge variant={lead.status === 'NEW' ? 'default' : 'secondary'}>{lead.status}</Badge></div>))}</CardContent></Card>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Produits ({data.products.length})</h2>
              <Dialog open={showDialog === 'product'} onOpenChange={(open) => { setShowDialog(open ? 'product' : null); if (!open) { setEditingItem(null); setProductForm({ name: '', description: '', price: '', comparePrice: '', cost: '', categoryId: '', brand: '', stock: '', images: '', featured: false }); } }}>
                <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Ajouter</Button></DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>{editingItem ? 'Modifier' : 'Nouveau'} Produit</DialogTitle></DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input placeholder="Nom du produit *" value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} />
                    <Textarea placeholder="Description" value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} />
                    <div className="grid grid-cols-3 gap-4">
                      <Input type="number" placeholder="Prix *" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} />
                      <Input type="number" placeholder="Ancien prix" value={productForm.comparePrice} onChange={(e) => setProductForm({...productForm, comparePrice: e.target.value})} />
                      <Input type="number" placeholder="Coût" value={productForm.cost} onChange={(e) => setProductForm({...productForm, cost: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Select value={productForm.categoryId} onValueChange={(v) => setProductForm({...productForm, categoryId: v})}><SelectTrigger><SelectValue placeholder="Catégorie" /></SelectTrigger><SelectContent>{data.categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}</SelectContent></Select>
                      <Input placeholder="Marque" value={productForm.brand} onChange={(e) => setProductForm({...productForm, brand: e.target.value})} />
                    </div>
                    <Input type="number" placeholder="Stock" value={productForm.stock} onChange={(e) => setProductForm({...productForm, stock: e.target.value})} />
                    <Input placeholder="URLs images (séparées par virgule)" value={productForm.images} onChange={(e) => setProductForm({...productForm, images: e.target.value})} />
                    <label className="flex items-center gap-2"><input type="checkbox" checked={productForm.featured} onChange={(e) => setProductForm({...productForm, featured: e.target.checked})} /> Produit vedette</label>
                    <Button onClick={saveProduct} className="w-full">{editingItem ? 'Mettre à jour' : 'Créer'}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-4">
              {data.products.map(product => (
                <Card key={product.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">{product.images?.[0] ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package className="w-8 h-8 text-gray-300" /></div>}</div>
                    <div className="flex-1"><div className="flex items-center gap-2"><h3 className="font-semibold">{product.name}</h3>{product.featured && <Badge variant="secondary"><Star className="w-3 h-3" /></Badge>}</div><p className="text-sm text-gray-500">{product.categoryName || product.brand} • SKU: {product.sku}</p><div className="flex items-center gap-4 mt-1"><span className="font-bold text-blue-600">${product.price}</span><span className={`text-sm ${product.stock <= 5 ? 'text-red-500' : 'text-green-500'}`}>Stock: {product.stock}</span></div></div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditingItem(product); setProductForm({ name: product.name, description: product.description || '', price: product.price?.toString() || '', comparePrice: product.comparePrice?.toString() || '', cost: product.cost?.toString() || '', categoryId: product.categoryId || '', brand: product.brand || '', stock: product.stock?.toString() || '', images: product.images?.join(', ') || '', featured: product.featured || false }); setShowDialog('product'); }}><Edit className="w-4 h-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteItem('products', product.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Catégories ({data.categories.length})</h2>
              <Dialog open={showDialog === 'category'} onOpenChange={(open) => { setShowDialog(open ? 'category' : null); if (!open) { setEditingItem(null); setCategoryForm({ name: '', description: '', icon: '' }); } }}>
                <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Ajouter</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>{editingItem ? 'Modifier' : 'Nouvelle'} Catégorie</DialogTitle></DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input placeholder="Nom *" value={categoryForm.name} onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})} />
                    <Input placeholder="Description" value={categoryForm.description} onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})} />
                    <Input placeholder="Icône" value={categoryForm.icon} onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})} />
                    <Button onClick={saveCategory} className="w-full">{editingItem ? 'Mettre à jour' : 'Créer'}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.categories.map(cat => (<Card key={cat.id} className="p-4"><div className="flex items-center justify-between"><div><h3 className="font-semibold">{cat.name}</h3><p className="text-sm text-gray-500">{cat.slug}</p></div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => { setEditingItem(cat); setCategoryForm({ name: cat.name, description: cat.description || '', icon: cat.icon || '' }); setShowDialog('category'); }}><Edit className="w-4 h-4" /></Button><Button size="sm" variant="destructive" onClick={() => deleteItem('categories', cat.id)}><Trash2 className="w-4 h-4" /></Button></div></div></Card>))}
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <h2 className="text-xl font-bold mb-4">Commandes ({data.orders.length})</h2>
            <div className="space-y-4">
              {data.orders.map(order => (
                <Card key={order.id} className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div><div className="flex items-center gap-2 mb-2"><Badge>{order.status}</Badge><Badge variant="outline">{order.paymentMethod}</Badge></div><h3 className="font-bold">#{order.orderNumber}</h3><p className="text-gray-600">{order.customer?.name} • {order.customer?.phone}</p><div className="mt-2 text-sm text-gray-500">{order.items?.map((i, idx) => <span key={idx}>{i.name} x{i.quantity}{idx < order.items.length - 1 ? ', ' : ''}</span>)}</div><p className="text-lg font-bold mt-2">${order.total}</p><p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</p></div>
                    <div className="flex flex-col gap-2">
                      <Select value={order.status} onValueChange={(v) => updateOrderStatus(order.id, v)}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent>{Object.values(ORDER_STATUS).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
                      <Button size="sm" variant="outline" onClick={() => printReceipt(order)}><Printer className="w-4 h-4 mr-2" /> Imprimer</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leads">
            <h2 className="text-xl font-bold mb-4">Leads ({data.leads.length})</h2>
            <div className="space-y-4">
              {data.leads.map(lead => (
                <Card key={lead.id} className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div><div className="flex items-center gap-2 mb-2"><Badge variant={lead.status === 'NEW' ? 'default' : 'secondary'}>{lead.status}</Badge><Badge variant="outline">{lead.type}</Badge></div><h3 className="font-semibold">{lead.name}</h3><p className="text-gray-600">{lead.phone} • {lead.email}</p>{lead.company && <p className="text-gray-500">{lead.company}</p>}{lead.message && <p className="text-sm bg-gray-50 p-2 rounded mt-2">{lead.message}</p>}<p className="text-xs text-gray-400 mt-2">{new Date(lead.createdAt).toLocaleString()}</p></div>
                    <Select value={lead.status} onValueChange={(v) => updateLeadStatus(lead.id, v)}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent>{['NEW', 'CONTACTED', 'CONFIRMED', 'INSTALLED'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ads">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Publicités ({data.ads.length})</h2>
              <Dialog open={showDialog === 'ad'} onOpenChange={(open) => { setShowDialog(open ? 'ad' : null); if (!open) { setEditingItem(null); setAdForm({ title: '', description: '', image: '', link: '', linkType: 'product', position: 'shop' }); } }}>
                <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Ajouter</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>{editingItem ? 'Modifier' : 'Nouvelle'} Publicité</DialogTitle></DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input placeholder="Titre *" value={adForm.title} onChange={(e) => setAdForm({...adForm, title: e.target.value})} />
                    <Textarea placeholder="Description" value={adForm.description} onChange={(e) => setAdForm({...adForm, description: e.target.value})} />
                    <Input placeholder="URL image *" value={adForm.image} onChange={(e) => setAdForm({...adForm, image: e.target.value})} />
                    <Select value={adForm.linkType} onValueChange={(v) => setAdForm({...adForm, linkType: v})}><SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger><SelectContent><SelectItem value="product">Produit</SelectItem><SelectItem value="whatsapp">WhatsApp</SelectItem><SelectItem value="external">Externe</SelectItem></SelectContent></Select>
                    <Select value={adForm.position} onValueChange={(v) => setAdForm({...adForm, position: v})}><SelectTrigger><SelectValue placeholder="Position" /></SelectTrigger><SelectContent><SelectItem value="home">Accueil</SelectItem><SelectItem value="shop">Boutique</SelectItem></SelectContent></Select>
                    <Button onClick={saveAd} className="w-full">{editingItem ? 'Mettre à jour' : 'Créer'}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.ads.map(ad => (<Card key={ad.id} className="overflow-hidden">{ad.image && <img src={ad.image} alt={ad.title} className="w-full h-32 object-cover" />}<CardContent className="p-4"><div className="flex items-center justify-between mb-2"><Badge variant={ad.active ? 'default' : 'secondary'}>{ad.active ? 'Actif' : 'Inactif'}</Badge><Badge variant="outline">{ad.position}</Badge></div><h3 className="font-semibold">{ad.title}</h3><p className="text-sm text-gray-500">{ad.clicks || 0} clics</p><div className="flex gap-2 mt-4"><Button size="sm" variant="outline" className="flex-1" onClick={() => { setEditingItem(ad); setAdForm({ title: ad.title, description: ad.description || '', image: ad.image || '', link: ad.link || '', linkType: ad.linkType || 'product', position: ad.position || 'shop' }); setShowDialog('ad'); }}><Edit className="w-4 h-4" /></Button><Button size="sm" variant="destructive" onClick={() => deleteItem('ads', ad.id)}><Trash2 className="w-4 h-4" /></Button></div></CardContent></Card>))}
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Utilisateurs ({data.users.length})</h2>
              <Dialog open={showDialog === 'user'} onOpenChange={(open) => { setShowDialog(open ? 'user' : null); if (!open) { setEditingItem(null); setUserForm({ username: '', password: '', name: '', email: '', phone: '', role: 'sales' }); } }}>
                <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Ajouter</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>{editingItem ? 'Modifier' : 'Nouvel'} Utilisateur</DialogTitle></DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input placeholder="Nom d'utilisateur *" value={userForm.username} onChange={(e) => setUserForm({...userForm, username: e.target.value})} />
                    {!editingItem && <Input type="password" placeholder="Mot de passe *" value={userForm.password} onChange={(e) => setUserForm({...userForm, password: e.target.value})} />}
                    <Input placeholder="Nom complet *" value={userForm.name} onChange={(e) => setUserForm({...userForm, name: e.target.value})} />
                    <Input placeholder="Email" value={userForm.email} onChange={(e) => setUserForm({...userForm, email: e.target.value})} />
                    <Input placeholder="Téléphone" value={userForm.phone} onChange={(e) => setUserForm({...userForm, phone: e.target.value})} />
                    <Select value={userForm.role} onValueChange={(v) => setUserForm({...userForm, role: v})}><SelectTrigger><SelectValue placeholder="Rôle" /></SelectTrigger><SelectContent>{Object.entries(USER_ROLES).map(([k, v]) => <SelectItem key={v} value={v}>{k}</SelectItem>)}</SelectContent></Select>
                    <Button onClick={saveUser} className="w-full">{editingItem ? 'Mettre à jour' : 'Créer'}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.users.map(u => (<Card key={u.id} className="p-4"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><User className="w-6 h-6 text-blue-600" /></div><div className="flex-1"><h3 className="font-semibold">{u.name}</h3><p className="text-sm text-gray-500">@{u.username}</p><Badge variant="outline" className="mt-1">{u.role}</Badge></div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => { setEditingItem(u); setUserForm({ username: u.username, password: '', name: u.name, email: u.email || '', phone: u.phone || '', role: u.role }); setShowDialog('user'); }}><Edit className="w-4 h-4" /></Button><Button size="sm" variant="destructive" onClick={() => deleteItem('users', u.id)}><Trash2 className="w-4 h-4" /></Button></div></div></Card>))}
            </div>
          </TabsContent>

          <TabsContent value="articles">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Articles ({data.articles.length})</h2>
              <Dialog open={showDialog === 'article'} onOpenChange={(open) => { setShowDialog(open ? 'article' : null); if (!open) { setEditingItem(null); setArticleForm({ title: '', content: '', excerpt: '', category: '', image: '', published: false }); } }}>
                <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Ajouter</Button></DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>{editingItem ? 'Modifier' : 'Nouvel'} Article</DialogTitle></DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input placeholder="Titre *" value={articleForm.title} onChange={(e) => setArticleForm({...articleForm, title: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="Catégorie" value={articleForm.category} onChange={(e) => setArticleForm({...articleForm, category: e.target.value})} />
                      <Input placeholder="URL image" value={articleForm.image} onChange={(e) => setArticleForm({...articleForm, image: e.target.value})} />
                    </div>
                    <Textarea placeholder="Extrait" value={articleForm.excerpt} onChange={(e) => setArticleForm({...articleForm, excerpt: e.target.value})} className="min-h-[80px]" />
                    <Textarea placeholder="Contenu" value={articleForm.content} onChange={(e) => setArticleForm({...articleForm, content: e.target.value})} className="min-h-[200px]" />
                    <label className="flex items-center gap-2"><input type="checkbox" checked={articleForm.published} onChange={(e) => setArticleForm({...articleForm, published: e.target.checked})} /> Publié</label>
                    <Button onClick={saveArticle} className="w-full">{editingItem ? 'Mettre à jour' : 'Créer'}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-4">
              {data.articles.map(article => (<Card key={article.id} className="p-4"><div className="flex items-start justify-between gap-4"><div className="flex-1"><div className="flex items-center gap-2 mb-2"><Badge variant={article.published ? 'default' : 'secondary'}>{article.published ? 'Publié' : 'Brouillon'}</Badge>{article.category && <Badge variant="outline">{article.category}</Badge>}</div><h3 className="font-semibold">{article.title}</h3>{article.excerpt && <p className="text-gray-600 text-sm mt-1">{article.excerpt}</p>}<p className="text-xs text-gray-400 mt-2">{new Date(article.createdAt).toLocaleDateString()}</p></div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => { setEditingItem(article); setArticleForm({ title: article.title, content: article.content || '', excerpt: article.excerpt || '', category: article.category || '', image: article.image || '', published: article.published }); setShowDialog('article'); }}><Edit className="w-4 h-4" /></Button><Button size="sm" variant="destructive" onClick={() => deleteItem('articles', article.id)}><Trash2 className="w-4 h-4" /></Button></div></div></Card>))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ============ FOOTER ============
function Footer({ locale, setCurrentPage }) {
  const t = translations[locale];
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src={SITE_CONFIG.logo} alt="NEXORA" className="h-10 w-10" />
              <span className="font-bold text-xl">NEXORA</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">{t.footer.slogan}</p>
            <div className="space-y-2 text-gray-400">
              {SITE_CONFIG.contact.phones.slice(0, 2).map((p, i) => <p key={i}>{p}</p>)}
              <p>{SITE_CONFIG.contact.email}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">{t.footer.services}</h4>
            <ul className="space-y-3 text-gray-400">
              <li><button onClick={() => setCurrentPage('shop')} className="hover:text-white transition-colors">Boutique</button></li>
              <li><button onClick={() => setCurrentPage('starlink')} className="hover:text-white transition-colors">Starlink</button></li>
              <li><button onClick={() => setCurrentPage('network')} className="hover:text-white transition-colors">Réseaux & IT</button></li>
              <li><button onClick={() => setCurrentPage('partners')} className="hover:text-white transition-colors">Revendeurs</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">{t.footer.company}</h4>
            <ul className="space-y-3 text-gray-400">
              <li><button onClick={() => setCurrentPage('about')} className="hover:text-white transition-colors">À propos</button></li>
              <li><button onClick={() => setCurrentPage('projects')} className="hover:text-white transition-colors">Projets</button></li>
              <li><button onClick={() => setCurrentPage('contact')} className="hover:text-white transition-colors">Contact</button></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} NEXORA Technologies & Networks. {t.footer.rights}.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0"><span className="text-gray-600 text-sm">nexora.cd</span></div>
        </div>
      </div>
    </footer>
  );
}

// ============ WHATSAPP BUTTON ============
function WhatsAppButton() {
  return (
    <a href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 hover:scale-110 transition-all">
      <MessageCircle className="w-7 h-7 text-white" />
    </a>
  );
}

// ============ MAIN APP ============
export default function App() {
  const [locale, setLocale] = useState('fr');
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage locale={locale} setCurrentPage={setCurrentPage} />;
      case 'shop': return <ShopPage locale={locale} setCurrentPage={setCurrentPage} />;
      case 'cart': return <CartPage locale={locale} setCurrentPage={setCurrentPage} />;
      case 'starlink': return <StarlinkPage locale={locale} />;
      case 'network': return <NetworkPage locale={locale} />;
      case 'partners': return <PartnersPage locale={locale} />;
      case 'about': return <AboutPage locale={locale} />;
      case 'projects': return <ProjectsPage locale={locale} />;
      case 'contact': return <ContactPage locale={locale} />;
      case 'portal': return <PortalPage locale={locale} />;
      default: return <HomePage locale={locale} setCurrentPage={setCurrentPage} />;
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
