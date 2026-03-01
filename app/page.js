'use client';

import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { 
  Satellite, Wifi, Globe, Code, Shield, Zap, Users, Award, 
  ChevronRight, Menu, X, Phone, Mail, MapPin, ArrowRight,
  Check, Star, MessageCircle, Building, GraduationCap, Coffee,
  Home as HomeIcon, Briefcase, ShoppingCart, Package, Plus, Minus,
  Trash2, Search, Filter, Eye, Edit, Printer, Download, LogOut,
  BarChart3, Settings, Bell, User, FileText, Image, Tag, Layers,
  ChevronDown, ExternalLink, TrendingUp, DollarSign, Box, AlertTriangle,
  Smartphone, Monitor, Wrench, Rocket, Play, Quote, ChevronUp, Send,
  Clock, Target, Headphones, Database, Server, Layout
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
import { PORTFOLIO_ITEMS, TESTIMONIALS, TECHNOLOGIES, IT_SERVICES, STATS, PROCESS_STEPS, PARTNERS } from '@/lib/data';

// ============ CONTEXT ============
const CartContext = createContext();
const AuthContext = createContext();

function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      return [...prev, { ...product, quantity }];
    });
  };
  const removeFromCart = (productId) => setCart(prev => prev.filter(item => item.id !== productId));
  const updateQuantity = (productId, quantity) => { if (quantity <= 0) { removeFromCart(productId); return; } setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item)); };
  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  return <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>{children}</CartContext.Provider>;
}
function useCart() { return useContext(CartContext); }

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const login = async (username, password) => {
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
    const data = await res.json();
    if (data.success) { setUser(data.user); setToken(data.token); return { success: true }; }
    return { success: false, error: data.error };
  };
  const logout = () => { setUser(null); setToken(null); };
  return <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user }}>{children}</AuthContext.Provider>;
}
function useAuth() { return useContext(AuthContext); }

// ============ ANIMATED COUNTER ============
function AnimatedCounter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ============ SCROLL ANIMATION HOOK ============
function useScrollAnimation() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1, rootMargin: '50px' });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, isVisible];
}

// ============ CHATBOT WIDGET ============
function ChatWidget({ locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: locale === 'fr' ? 'Bonjour ! Comment puis-je vous aider ?' : 'Hello! How can I help you?' }
  ]);
  const [input, setInput] = useState('');

  const quickReplies = locale === 'fr' 
    ? ['Prix Starlink', 'Devis site web', 'Support technique', 'Parler à un conseiller']
    : ['Starlink prices', 'Website quote', 'Technical support', 'Talk to advisor'];

  const handleQuickReply = (reply) => {
    setMessages(prev => [...prev, { from: 'user', text: reply }]);
    setTimeout(() => {
      const botReply = locale === 'fr' 
        ? 'Pour une réponse rapide, contactez-nous directement sur WhatsApp !' 
        : 'For a quick response, contact us directly on WhatsApp!';
      setMessages(prev => [...prev, { from: 'bot', text: botReply }]);
    }, 500);
  };

  const openWhatsApp = () => {
    const msg = locale === 'fr' ? 'Bonjour NEXORA, je souhaite des informations.' : 'Hello NEXORA, I would like some information.';
    window.open(`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/30 hover:scale-110 transition-all">
        {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>
      
      {isOpen && (
        <div className="fixed bottom-40 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
            <h3 className="font-semibold">NEXORA Assistant</h3>
            <p className="text-sm text-blue-100">{locale === 'fr' ? 'Réponse rapide' : 'Quick response'}</p>
          </div>
          
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl ${msg.from === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 border-t">
            <div className="flex flex-wrap gap-2 mb-3">
              {quickReplies.map((reply, i) => (
                <button key={i} onClick={() => handleQuickReply(reply)} className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                  {reply}
                </button>
              ))}
            </div>
            <Button onClick={openWhatsApp} className="w-full bg-green-500 hover:bg-green-600">
              <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
            </Button>
          </div>
        </div>
      )}
    </>
  );
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
    { id: 'services', label: locale === 'fr' ? 'Services IT' : 'IT Services' },
    { id: 'starlink', label: 'Starlink' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'about', label: t.nav.about },
    { id: 'contact', label: t.nav.contact },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <button onClick={() => setCurrentPage('home')} className="flex items-center space-x-2 group">
            <img src={SITE_CONFIG.logo} alt="NEXORA" className="h-10 w-10 object-contain" />
            <span className={`font-bold text-xl tracking-tight hidden sm:block ${isScrolled ? 'text-gray-900' : 'text-white'}`}>NEXORA</span>
          </button>

          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => setCurrentPage(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  currentPage === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : isScrolled ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >{item.label}</button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')} className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-all ${isScrolled ? 'border-gray-200 hover:border-blue-300' : 'border-white/30 text-white hover:bg-white/10'}`}>
              {locale === 'fr' ? 'EN' : 'FR'}
            </button>
            <button onClick={() => setCurrentPage('cart')} className="relative p-2 rounded-full hover:bg-gray-100/20 transition-colors">
              <ShoppingCart className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>
            <Button onClick={() => setCurrentPage('contact')} className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30">
              {locale === 'fr' ? 'Devis Gratuit' : 'Free Quote'}
            </Button>
            <button onClick={() => setCurrentPage('portal')} className={`hidden lg:block px-3 py-1.5 text-xs font-medium transition-colors ${isScrolled ? 'text-gray-500 hover:text-blue-600' : 'text-white/70 hover:text-white'}`}>Portail</button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100/20 transition-colors">
              {isMobileMenuOpen ? <X size={24} className={isScrolled ? 'text-gray-900' : 'text-white'} /> : <Menu size={24} className={isScrolled ? 'text-gray-900' : 'text-white'} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => { setCurrentPage(item.id); setIsMobileMenuOpen(false); }}
                className={`w-full px-4 py-3 rounded-xl text-left font-medium transition-all ${currentPage === item.id ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >{item.label}</button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

// ============ CONTACT FORM ============
function ContactForm({ locale, type = 'contact', service = '' }) {
  const t = translations[locale];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', company: '', country: 'RDC', city: '', message: '', pack: '', service: service });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...formData, type }) });
      if (response.ok) { setSubmitStatus('success'); setFormData({ name: '', phone: '', email: '', company: '', country: 'RDC', city: '', message: '', pack: '', service: '' }); }
      else setSubmitStatus('error');
    } catch (error) { setSubmitStatus('error'); }
    setIsSubmitting(false);
    setTimeout(() => setSubmitStatus(null), 5000);
  };

  const redirectToWhatsApp = () => {
    const msg = `Bonjour NEXORA,\n\nNom: ${formData.name}\nTél: ${formData.phone}\nEmail: ${formData.email}\nEntreprise: ${formData.company || 'N/A'}\nPays: ${formData.country}\n\nMessage:\n${formData.message}`;
    window.open(`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
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
      <Select value={formData.country} onValueChange={(v) => setFormData({...formData, country: v})}>
        <SelectTrigger className="bg-white/80 border-gray-200 h-12"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="RDC">RD Congo</SelectItem>
          <SelectItem value="Congo">Congo</SelectItem>
          <SelectItem value="Rwanda">Rwanda</SelectItem>
          <SelectItem value="Uganda">Uganda</SelectItem>
          <SelectItem value="Kenya">Kenya</SelectItem>
          <SelectItem value="Other">Autre</SelectItem>
        </SelectContent>
      </Select>
      {type === 'quote' && (
        <Select value={formData.service} onValueChange={(v) => setFormData({...formData, service: v})}>
          <SelectTrigger className="bg-white/80 border-gray-200 h-12"><SelectValue placeholder={locale === 'fr' ? 'Type de service' : 'Service type'} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="website">Site Web</SelectItem>
            <SelectItem value="mobile">Application Mobile</SelectItem>
            <SelectItem value="software">Logiciel de Gestion</SelectItem>
            <SelectItem value="network">Réseaux / Wi-Fi</SelectItem>
            <SelectItem value="starlink">Starlink</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      )}
      <Textarea placeholder={t.form.details} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="bg-white/80 border-gray-200 focus:border-blue-500 min-h-[120px]" />
      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12 shadow-lg shadow-blue-500/30">
          {isSubmitting ? '...' : (locale === 'fr' ? 'Envoyer' : 'Send')}
        </Button>
        <Button type="button" onClick={redirectToWhatsApp} className="bg-green-500 hover:bg-green-600 text-white h-12">
          <MessageCircle className="w-5 h-5" />
        </Button>
      </div>
      {submitStatus === 'success' && <div className="p-4 bg-green-100 text-green-700 rounded-xl text-center font-medium">{t.form.success}</div>}
      {submitStatus === 'error' && <div className="p-4 bg-red-100 text-red-700 rounded-xl text-center font-medium">{t.form.error}</div>}
    </form>
  );
}

// ============ HOME PAGE ============
function HomePage({ locale, setCurrentPage }) {
  const t = translations[locale];
  const [heroRef, heroVisible] = useScrollAnimation();
  const [statsRef, statsVisible] = useScrollAnimation();
  
  const services = [
    { icon: Satellite, title: t.services.starlink.title, desc: t.services.starlink.desc, color: 'from-blue-600 to-cyan-500', page: 'starlink' },
    { icon: Globe, title: locale === 'fr' ? 'Sites Web' : 'Websites', desc: locale === 'fr' ? 'Sites vitrines, e-commerce, applications web' : 'Showcase sites, e-commerce, web apps', color: 'from-violet-600 to-purple-500', page: 'services' },
    { icon: Smartphone, title: locale === 'fr' ? 'Apps Mobiles' : 'Mobile Apps', desc: locale === 'fr' ? 'Applications iOS et Android natives' : 'Native iOS and Android apps', color: 'from-pink-500 to-rose-500', page: 'services' },
    { icon: Wifi, title: t.services.network.title, desc: t.services.network.desc, color: 'from-orange-500 to-amber-500', page: 'services' },
    { icon: Monitor, title: locale === 'fr' ? 'Logiciels' : 'Software', desc: locale === 'fr' ? 'ERP, CRM, gestion de stock' : 'ERP, CRM, inventory management', color: 'from-emerald-500 to-teal-500', page: 'services' },
    { icon: Wrench, title: locale === 'fr' ? 'Maintenance' : 'Maintenance', desc: locale === 'fr' ? 'Support technique 24/7' : '24/7 technical support', color: 'from-gray-600 to-gray-500', page: 'services' }
  ];

  const reasons = [
    { icon: Award, title: t.why.corporate.title, desc: t.why.corporate.desc, gradient: 'from-blue-600 to-indigo-600' },
    { icon: Zap, title: t.why.performance.title, desc: t.why.performance.desc, gradient: 'from-amber-500 to-orange-500' },
    { icon: Shield, title: t.why.support.title, desc: t.why.support.desc, gradient: 'from-emerald-500 to-teal-500' }
  ];
  
  return (
    <>
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-20">
            <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-futuristic-devices-99786-large.mp4" type="video/mp4" />
          </video>
          <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-600/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className={`relative z-10 max-w-7xl mx-auto px-4 text-center transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-8">
            <Satellite className="w-4 h-4 mr-2 text-blue-400" />
            {locale === 'fr' ? '🚀 Partenaire Starlink Officiel en RDC' : '🚀 Official Starlink Partner in DRC'}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            {locale === 'fr' ? 'Solutions IT &' : 'IT Solutions &'}<br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient">{locale === 'fr' ? 'Connectivité Premium' : 'Premium Connectivity'}</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            {locale === 'fr' 
              ? 'Développement web & mobile, logiciels de gestion, Starlink, réseaux Wi-Fi — Excellence et innovation au service de votre croissance.'
              : 'Web & mobile development, management software, Starlink, Wi-Fi networks — Excellence and innovation for your growth.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button onClick={() => setCurrentPage('contact')} size="lg" className="bg-white text-slate-900 hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-2xl group">
              {locale === 'fr' ? 'Demander un Devis' : 'Request Quote'}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button onClick={() => setCurrentPage('portfolio')} size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold">
              <Play className="mr-2 w-5 h-5" /> {locale === 'fr' ? 'Voir nos Réalisations' : 'View Our Work'}
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/60 text-sm">
            <span className="flex items-center"><Check className="w-4 h-4 mr-1 text-green-400" /> {locale === 'fr' ? '150+ Clients' : '150+ Clients'}</span>
            <span className="flex items-center"><Check className="w-4 h-4 mr-1 text-green-400" /> {locale === 'fr' ? '5 ans d\'expérience' : '5 years experience'}</span>
            <span className="flex items-center"><Check className="w-4 h-4 mr-1 text-green-400" /> {locale === 'fr' ? 'Support 24/7' : '24/7 Support'}</span>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/50" />
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="py-16 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className={`text-center transition-all duration-700 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="text-4xl sm:text-5xl font-bold text-blue-600 mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-gray-600">{stat.label[locale]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700">{locale === 'fr' ? 'NOS SERVICES' : 'OUR SERVICES'}</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{locale === 'fr' ? 'Solutions Complètes' : 'Complete Solutions'}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{locale === 'fr' ? 'Du développement à la connectivité, nous couvrons tous vos besoins technologiques' : 'From development to connectivity, we cover all your technology needs'}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden" onClick={() => setCurrentPage(service.page)}>
                <CardContent className="p-8 relative">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.desc}</p>
                  <ArrowRight className="w-5 h-5 text-blue-600 mt-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700">{locale === 'fr' ? 'NOTRE PROCESSUS' : 'OUR PROCESS'}</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{locale === 'fr' ? 'Comment ça Marche' : 'How it Works'}</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {PROCESS_STEPS.map((step, i) => {
              const IconComponent = { MessageCircle, FileText, Code, Rocket }[step.icon] || MessageCircle;
              return (
                <div key={i} className="text-center relative">
                  {i < PROCESS_STEPS.length - 1 && <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500 to-blue-200" />}
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mb-6 shadow-xl relative z-10">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm font-bold text-blue-600 mb-2">ÉTAPE {step.step}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title[locale]}</h3>
                  <p className="text-gray-600">{step.description[locale]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-white/10 text-white border-white/20">{locale === 'fr' ? 'TÉMOIGNAGES' : 'TESTIMONIALS'}</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">{locale === 'fr' ? 'Nos Clients Témoignent' : 'Client Testimonials'}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((testimonial, i) => (
              <Card key={i} className="bg-white/10 backdrop-blur border-white/20 text-white">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                  </div>
                  <Quote className="w-8 h-8 text-blue-400/50 mb-4" />
                  <p className="text-white/90 text-sm mb-6 leading-relaxed">{testimonial.content}</p>
                  <div className="flex items-center gap-3">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-xs text-white/60">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-16 bg-white border-y">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-500 mb-8 font-medium">{locale === 'fr' ? 'Technologies & Partenaires' : 'Technologies & Partners'}</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {PARTNERS.map((partner, i) => (
              <div key={i} className="flex items-center gap-2 text-2xl hover:opacity-100 transition-opacity cursor-default">
                <span>{partner.logo}</span>
                <span className="text-sm font-medium text-gray-600">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Nexora */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{t.why.title}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {reasons.map((reason, index) => (
              <div key={index} className="text-center p-8 rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
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

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">{locale === 'fr' ? 'Prêt à Transformer Votre Business ?' : 'Ready to Transform Your Business?'}</h2>
          <p className="text-xl text-blue-100 mb-10">{locale === 'fr' ? 'Contactez-nous pour un devis gratuit et personnalisé.' : 'Contact us for a free personalized quote.'}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={() => setCurrentPage('contact')} size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-2xl">
              {locale === 'fr' ? 'Obtenir un Devis' : 'Get a Quote'}
            </Button>
            <Button onClick={() => window.open(`https://wa.me/${SITE_CONFIG.contact.whatsapp}`, '_blank')} size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold">
              <MessageCircle className="mr-2 w-5 h-5" /> WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

// ============ SERVICES IT PAGE ============
function ServicesPage({ locale, setCurrentPage }) {
  const [selectedService, setSelectedService] = useState(null);
  
  const iconMap = { Globe, Smartphone, Monitor, Wrench };

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <Badge className="mb-4 bg-white/10 text-white border-white/20">{locale === 'fr' ? 'DÉVELOPPEMENT & IT' : 'DEVELOPMENT & IT'}</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            {locale === 'fr' ? 'Services de Développement' : 'Development Services'}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {locale === 'fr' 
              ? 'Sites web, applications mobiles, logiciels de gestion — Solutions sur mesure pour votre entreprise'
              : 'Websites, mobile apps, management software — Custom solutions for your business'}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {IT_SERVICES.map((service, i) => {
              const IconComponent = iconMap[service.icon] || Globe;
              return (
                <Card key={i} className="overflow-hidden hover:shadow-2xl transition-all group">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg flex-shrink-0">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title[locale]}</h3>
                        <p className="text-gray-600 mb-4">{service.description[locale]}</p>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-sm text-gray-500">{locale === 'fr' ? 'À partir de' : 'Starting from'}</span>
                          <span className="text-2xl font-bold text-blue-600">${service.startingPrice}</span>
                        </div>
                        <ul className="grid grid-cols-2 gap-2 mb-6">
                          {service.features[locale].map((feature, j) => (
                            <li key={j} className="flex items-center text-sm text-gray-600">
                              <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <Button onClick={() => setCurrentPage('contact')} className="w-full bg-blue-600 hover:bg-blue-700">
                          {locale === 'fr' ? 'Demander un Devis' : 'Request Quote'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">{locale === 'fr' ? 'Technologies Maîtrisées' : 'Technologies We Master'}</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {TECHNOLOGIES.map((tech, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all">
                <span className="text-xl">{tech.icon}</span>
                <span className="font-medium text-gray-700">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">{locale === 'fr' ? 'Un Projet en Tête ?' : 'Have a Project in Mind?'}</h2>
          <p className="text-blue-100 mb-8">{locale === 'fr' ? 'Discutons de votre projet et trouvons la meilleure solution ensemble.' : 'Let\'s discuss your project and find the best solution together.'}</p>
          <Button onClick={() => window.open(`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(locale === 'fr' ? 'Bonjour, j\'ai un projet de développement à discuter.' : 'Hello, I have a development project to discuss.')}`, '_blank')} size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            <MessageCircle className="mr-2 w-5 h-5" /> {locale === 'fr' ? 'Discuter sur WhatsApp' : 'Chat on WhatsApp'}
          </Button>
        </div>
      </section>
    </div>
  );
}

// ============ PORTFOLIO PAGE ============
function PortfolioPage({ locale }) {
  const [filter, setFilter] = useState('all');
  const categories = ['all', 'Web', 'Mobile', 'Logiciel', 'Réseau', 'Starlink'];

  const filteredItems = filter === 'all' ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter(item => item.category === filter);

  return (
    <div className="pt-20 min-h-screen">
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Badge className="mb-4 bg-white/10 text-white border-white/20">PORTFOLIO</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">{locale === 'fr' ? 'Nos Réalisations' : 'Our Work'}</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">{locale === 'fr' ? 'Découvrez quelques-uns de nos projets récents' : 'Discover some of our recent projects'}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <Button key={cat} variant={filter === cat ? 'default' : 'outline'} onClick={() => setFilter(cat)} className="rounded-full">
                {cat === 'all' ? (locale === 'fr' ? 'Tout' : 'All') : cat}
              </Button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden group hover:shadow-2xl transition-all">
                <div className="relative h-48 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <Badge className="bg-blue-600">{item.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-sm text-blue-600 font-medium mb-1">{item.client} • {item.year}</p>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.map((tech, j) => (
                      <span key={j} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">{tech}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ============ STARLINK PAGE ============
function StarlinkPage({ locale }) {
  const t = translations[locale];
  const packs = [
    { icon: HomeIcon, label: t.starlinkOffer.house, desc: locale === 'fr' ? 'Usage résidentiel' : 'Residential use', price: 650 },
    { icon: Briefcase, label: t.starlinkOffer.business, desc: locale === 'fr' ? 'PME & Entreprises' : 'SMEs & Enterprises', price: 750 },
    { icon: GraduationCap, label: t.starlinkOffer.school, desc: locale === 'fr' ? 'Établissements scolaires' : 'Schools', price: 700 },
    { icon: Coffee, label: t.starlinkOffer.cyber, desc: locale === 'fr' ? 'Cybercafés & Hotspot' : 'Cybercafés & Hotspot', price: 800 }
  ];
  
  return (
    <div className="pt-20">
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img src="https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1920" alt="Starlink" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">🛰️ STARLINK EN RDC</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">{t.starlinkOffer.title}</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">{locale === 'fr' ? 'Internet satellite haute performance — Couverture nationale' : 'High-performance satellite internet — National coverage'}</p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur border-white/20 text-center p-8">
              <Satellite className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <p className="text-blue-400 font-medium mb-2">{t.starlinkOffer.kit}</p>
              <p className="text-4xl font-bold text-white">$150</p>
              <p className="text-gray-400 text-sm mt-2">{locale === 'fr' ? 'minimum à l\'obtention' : 'minimum upfront'}</p>
            </Card>
            <Card className="bg-white/10 backdrop-blur border-blue-500/50 text-center p-8 ring-2 ring-blue-500/30">
              <Zap className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <p className="text-blue-400 font-medium mb-2">{t.starlinkOffer.monthly}</p>
              <p className="text-4xl font-bold text-white">$100</p>
              <p className="text-gray-400 text-sm mt-2">{locale === 'fr' ? '/ mois × 5 mois' : '/ month × 5 months'}</p>
            </Card>
            <Card className="bg-white/10 backdrop-blur border-white/20 text-center p-8">
              <Star className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <p className="text-amber-400 font-medium mb-2">{t.starlinkOffer.subscription}</p>
              <p className="text-2xl font-bold text-white">{locale === 'fr' ? 'Non inclus' : 'Not included'}</p>
              <p className="text-gray-400 text-sm mt-2">{locale === 'fr' ? 'abonnement mensuel' : 'monthly subscription'}</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{t.starlinkOffer.packs}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {packs.map((pack, i) => (
              <Card key={i} className="text-center p-8 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group" onClick={() => window.open(`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(`Je suis intéressé par le pack ${pack.label} Starlink`)}`, '_blank')}>
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <pack.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{pack.label}</h3>
                <p className="text-gray-600 text-sm mb-4">{pack.desc}</p>
                <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                  <MessageCircle className="w-4 h-4 mr-2" /> {locale === 'fr' ? 'Commander' : 'Order'}
                </Button>
              </Card>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{t.faq.title}</h2>
            <div className="space-y-4">
              {[{ q: t.faq.q1, a: t.faq.a1 }, { q: t.faq.q2, a: t.faq.a2 }, { q: t.faq.q3, a: t.faq.a3 }, { q: t.faq.q4, a: t.faq.a4 }].map((faq, i) => (
                <div key={i} className="p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{locale === 'fr' ? 'Demander mon kit Starlink' : 'Request my Starlink kit'}</h2>
          </div>
          <Card className="p-8 shadow-xl">
            <ContactForm locale={locale} type="starlink" />
          </Card>
        </div>
      </section>
    </div>
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

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, adsRes] = await Promise.all([fetch('/api/products?active=true'), fetch('/api/categories'), fetch('/api/ads?active=true&position=shop')]);
      const [productsData, categoriesData, adsData] = await Promise.all([productsRes.json(), categoriesRes.json(), adsRes.json()]);
      if (productsData.success) setProducts(productsData.data);
      if (categoriesData.success) setCategories(categoriesData.data);
      if (adsData.success) setAds(adsData.data);
    } catch (error) { console.error('Error:', error); }
    setLoading(false);
  };

  const filteredProducts = products.filter(p => (selectedCategory === 'all' || p.categoryId === selectedCategory) && p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">🛍️ BOUTIQUE</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{locale === 'fr' ? 'Notre Boutique' : 'Our Shop'}</h1>
          <p className="text-xl text-blue-100">{locale === 'fr' ? 'Téléphones, Starlink, Accessoires et plus' : 'Phones, Starlink, Accessories and more'}</p>
        </div>
      </section>

      {ads.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid md:grid-cols-3 gap-4">
            {ads.slice(0, 3).map((ad) => (
              <div key={ad.id} onClick={() => window.open(`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(`Je suis intéressé par: ${ad.title}`)}`, '_blank')} className="relative overflow-hidden rounded-2xl cursor-pointer group">
                <img src={ad.image} alt={ad.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div><h3 className="text-white font-semibold">{ad.title}</h3><p className="text-white/80 text-sm">{ad.description}</p></div>
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
            <Input placeholder={locale === 'fr' ? 'Rechercher...' : 'Search...'} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-12" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant={selectedCategory === 'all' ? 'default' : 'outline'} onClick={() => setSelectedCategory('all')} className="rounded-full">{locale === 'fr' ? 'Tout' : 'All'}</Button>
            {categories.map((cat) => <Button key={cat.id} variant={selectedCategory === cat.id ? 'default' : 'outline'} onClick={() => setSelectedCategory(cat.id)} className="rounded-full">{cat.name}</Button>)}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" /></div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden hover:shadow-xl transition-all">
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {product.images?.[0] ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center"><Package className="w-16 h-16 text-gray-300" /></div>}
                  {product.comparePrice > product.price && <Badge className="absolute top-2 left-2 bg-red-500">-{Math.round((1 - product.price / product.comparePrice) * 100)}%</Badge>}
                  {product.featured && <Badge className="absolute top-2 right-2 bg-amber-500"><Star className="w-3 h-3" /></Badge>}
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
                      <ShoppingCart className="w-4 h-4 mr-2" />{product.stock <= 0 ? 'Rupture' : 'Ajouter'}
                    </Button>
                    <Button variant="outline" onClick={() => window.open(`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(`Bonjour, je suis intéressé par: ${product.name} ($${product.price})`)}`, '_blank')}>
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12"><Package className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500 text-lg">{locale === 'fr' ? 'Aucun produit trouvé' : 'No products found'}</p></div>
        )}
      </div>
    </div>
  );
}

// ============ CART PAGE ============
function CartPage({ locale, setCurrentPage }) {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const [customerForm, setCustomerForm] = useState({ name: '', phone: '', email: '', address: '' });
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handleCheckout = () => {
    if (!customerForm.name || !customerForm.phone) { alert(locale === 'fr' ? 'Veuillez remplir votre nom et téléphone' : 'Please fill your name and phone'); return; }
    const itemsText = cart.map(item => `- ${item.name} x${item.quantity} = $${item.price * item.quantity}`).join('\n');
    const msg = `🛒 *Nouvelle Commande NEXORA*\n\n*Client:* ${customerForm.name}\n*Tél:* ${customerForm.phone}\n${customerForm.email ? `*Email:* ${customerForm.email}\n` : ''}${customerForm.address ? `*Adresse:* ${customerForm.address}\n` : ''}\n*Produits:*\n${itemsText}\n\n*TOTAL: $${cartTotal}*`;
    window.open(`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    setOrderSuccess({ orderNumber: 'WA-' + Date.now() });
    clearCart();
  };

  if (orderSuccess) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-4 p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><Check className="w-10 h-10 text-green-600" /></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{locale === 'fr' ? 'Commande envoyée !' : 'Order sent!'}</h2>
          <p className="text-gray-600 mb-6">{locale === 'fr' ? 'Nous vous contacterons bientôt.' : 'We will contact you soon.'}</p>
          <Button onClick={() => setCurrentPage('shop')} className="w-full">{locale === 'fr' ? 'Continuer' : 'Continue'}</Button>
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
                      {item.images?.[0] ? <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" /> : <Package className="w-8 h-8 text-gray-300 m-auto" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-blue-600 font-bold">${item.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="w-4 h-4" /></Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => removeFromCart(item.id)} className="ml-auto text-red-500"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                    <p className="font-bold text-lg">${item.price * item.quantity}</p>
                  </div>
                </Card>
              ))}
            </div>
            <Card className="p-6 h-fit sticky top-24">
              <h3 className="text-lg font-semibold mb-4">{locale === 'fr' ? 'Finaliser' : 'Checkout'}</h3>
              <div className="space-y-3 mb-6">
                <Input placeholder={locale === 'fr' ? 'Votre nom *' : 'Your name *'} value={customerForm.name} onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})} />
                <Input placeholder={locale === 'fr' ? 'Téléphone *' : 'Phone *'} value={customerForm.phone} onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})} />
                <Input placeholder="Email" value={customerForm.email} onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})} />
                <Input placeholder={locale === 'fr' ? 'Adresse' : 'Address'} value={customerForm.address} onChange={(e) => setCustomerForm({...customerForm, address: e.target.value})} />
              </div>
              <div className="border-t pt-4 mb-6"><div className="flex justify-between text-lg font-bold"><span>Total</span><span>${cartTotal}</span></div></div>
              <Button onClick={handleCheckout} className="w-full bg-green-500 hover:bg-green-600 h-12 text-lg">
                <MessageCircle className="w-5 h-5 mr-2" /> {locale === 'fr' ? 'Commander via WhatsApp' : 'Order via WhatsApp'}
              </Button>
            </Card>
          </div>
        )}
      </div>
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
          <Badge className="mb-4 bg-white/10 text-white border-white/20">{locale === 'fr' ? 'À PROPOS' : 'ABOUT US'}</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">{t.about.title}</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t.about.subtitle}</p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[{ title: t.about.vision, text: t.about.visionText, icon: Eye }, { title: t.about.mission, text: t.about.missionText, icon: Target }, { title: t.about.values, text: t.about.valuesText, icon: Award }].map((item, i) => (
              <Card key={i} className="p-8 text-center hover:shadow-xl transition-all">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mb-6"><item.icon className="w-8 h-8 text-white" /></div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </Card>
            ))}
          </div>

          <div className="max-w-xl mx-auto text-center">
            <Card className="p-8 bg-gradient-to-br from-gray-50 to-blue-50">
              <img src={SITE_CONFIG.ceo.photo} alt={SITE_CONFIG.ceo.name} className="w-40 h-40 rounded-full mx-auto mb-6 object-cover border-4 border-blue-500 shadow-xl" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{SITE_CONFIG.ceo.name}</h3>
              <p className="text-blue-600 font-medium mb-2">{SITE_CONFIG.ceo.role}</p>
              <p className="text-gray-600 mb-4">{SITE_CONFIG.ceo.title}</p>
              <Badge>{t.about.representativeRole}</Badge>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2"><AnimatedCounter end={stat.value} suffix={stat.suffix} /></div>
                <p className="text-blue-100">{stat.label[locale]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ============ CONTACT PAGE ============
function ContactPage({ locale }) {
  const t = translations[locale];
  const contacts = [
    { icon: Phone, label: '+243 971 037 431', href: 'tel:+243971037431' },
    { icon: Phone, label: '+243 822 888 909', href: 'tel:+243822888909' },
    { icon: Mail, label: SITE_CONFIG.contact.email, href: `mailto:${SITE_CONFIG.contact.email}` },
    { icon: Globe, label: SITE_CONFIG.contact.website, href: `https://${SITE_CONFIG.contact.website}` }
  ];

  return (
    <div className="pt-20">
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Badge className="mb-4 bg-white/10 text-white border-white/20">CONTACT</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">{t.contact.title}</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t.contact.subtitle}</p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">{locale === 'fr' ? 'Parlons de Votre Projet' : 'Let\'s Talk About Your Project'}</h2>
              <p className="text-gray-600 mb-8">{locale === 'fr' ? 'Contactez-nous par téléphone, email ou WhatsApp. Nous répondons rapidement !' : 'Contact us by phone, email or WhatsApp. We respond quickly!'}</p>
              
              <div className="space-y-4 mb-8">
                {contacts.map((contact, i) => (
                  <a key={i} href={contact.href} className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 group-hover:bg-blue-600 flex items-center justify-center transition-colors">
                      <contact.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-medium text-gray-900">{contact.label}</span>
                  </a>
                ))}
              </div>

              <Button onClick={() => window.open(`https://wa.me/${SITE_CONFIG.contact.whatsapp}`, '_blank')} className="w-full bg-green-500 hover:bg-green-600 h-14 text-lg">
                <MessageCircle className="w-6 h-6 mr-2" /> WhatsApp
              </Button>
            </div>

            <Card className="p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{locale === 'fr' ? 'Demande de Devis' : 'Quote Request'}</h3>
              <ContactForm locale={locale} type="quote" />
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============ PORTAL PAGE (ADMIN) ============
function PortalPage({ locale }) {
  const { user, login, logout, isAuthenticated } = useAuth();
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [data, setData] = useState({ leads: [], products: [], categories: [], orders: [], users: [], ads: [], articles: [] });
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', comparePrice: '', cost: '', categoryId: '', brand: '', stock: '', images: '', featured: false });
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', icon: '' });
  const [adForm, setAdForm] = useState({ title: '', description: '', image: '', link: '', linkType: 'whatsapp', position: 'shop', active: true });
  const [editingItem, setEditingItem] = useState(null);
  const [showDialog, setShowDialog] = useState(null);

  const handleLogin = async (e) => { e.preventDefault(); const result = await login(loginForm.username, loginForm.password); if (!result.success) setLoginError(locale === 'fr' ? 'Identifiants incorrects' : 'Invalid credentials'); else fetchAllData(); };

  const fetchAllData = async () => {
    try {
      const results = await Promise.all(['stats', 'leads', 'products', 'categories', 'orders', 'users', 'ads', 'articles'].map(ep => fetch(`/api/${ep}`).then(r => r.json())));
      setStats(results[0].data);
      setData({ leads: results[1].data || [], products: results[2].data || [], categories: results[3].data || [], orders: results[4].data || [], users: results[5].data || [], ads: results[6].data || [], articles: results[7].data || [] });
    } catch (error) { console.error('Error:', error); }
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
    setAdForm({ title: '', description: '', image: '', link: '', linkType: 'whatsapp', position: 'shop', active: true }); setEditingItem(null); setShowDialog(null); fetchAllData();
  };

  const deleteItem = async (type, id) => { if (!confirm('Confirmer?')) return; await fetch(`/api/${type}/${id}`, { method: 'DELETE' }); fetchAllData(); };
  const updateLeadStatus = async (id, status) => { await fetch(`/api/leads/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }); fetchAllData(); };
  const updateOrderStatus = async (id, status) => { await fetch(`/api/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }); fetchAllData(); };

  const printReceipt = (order) => {
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>Reçu #${order.orderNumber}</title><style>body{font-family:Arial;padding:20px;max-width:400px;margin:0 auto}.header{text-align:center;border-bottom:2px solid #000;padding-bottom:10px;margin-bottom:20px}.logo{font-size:24px;font-weight:bold}.item{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px dashed #ccc}.total{font-size:18px;font-weight:bold;text-align:right;margin-top:20px;padding-top:10px;border-top:2px solid #000}.footer{text-align:center;margin-top:30px;font-size:12px;color:#666}</style></head><body><div class="header"><div class="logo">NEXORA NTN</div><p>+243 971 037 431</p></div><p><strong>Reçu #${order.orderNumber}</strong></p><p>Date: ${new Date(order.createdAt).toLocaleString()}</p><p>Client: ${order.customer?.name || 'N/A'}</p><p>Tél: ${order.customer?.phone || 'N/A'}</p><div>${order.items?.map(i => `<div class="item"><span>${i.name} x${i.quantity}</span><span>$${i.price * i.quantity}</span></div>`).join('')}</div><div class="total">TOTAL: $${order.total}</div><div class="footer"><p>Merci!</p><p>www.nexora.cd</p></div></body></html>`);
    w.document.close(); w.print();
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 p-8">
          <div className="text-center mb-8">
            <img src={SITE_CONFIG.logo} alt="NEXORA" className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Portail NEXORA</h1>
            <p className="text-gray-500">Connexion admin</p>
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
            <div><h1 className="font-bold text-lg">Portail NEXORA</h1><p className="text-sm text-gray-500">{user?.name || 'Admin'}</p></div>
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
            <Card className="p-4"><div className="flex items-center gap-3"><DollarSign className="w-8 h-8 text-blue-600" /><div><p className="text-xs text-gray-500">Revenus</p><p className="text-xl font-bold">${stats.revenue?.total || 0}</p></div></div></Card>
            <Card className="p-4"><div className="flex items-center gap-3"><ShoppingCart className="w-8 h-8 text-green-600" /><div><p className="text-xs text-gray-500">Commandes</p><p className="text-xl font-bold">{stats.orders?.total || 0}</p></div></div></Card>
            <Card className="p-4"><div className="flex items-center gap-3"><Package className="w-8 h-8 text-purple-600" /><div><p className="text-xs text-gray-500">Produits</p><p className="text-xl font-bold">{stats.products?.total || 0}</p></div></div></Card>
            <Card className="p-4"><div className="flex items-center gap-3"><Users className="w-8 h-8 text-amber-600" /><div><p className="text-xs text-gray-500">Leads</p><p className="text-xl font-bold">{stats.leads?.total || 0}</p></div></div></Card>
            <Card className="p-4"><div className="flex items-center gap-3"><AlertTriangle className="w-8 h-8 text-red-600" /><div><p className="text-xs text-gray-500">Stock bas</p><p className="text-xl font-bold">{stats.products?.lowStock || 0}</p></div></div></Card>
            <Card className="p-4"><div className="flex items-center gap-3"><Image className="w-8 h-8 text-cyan-600" /><div><p className="text-xs text-gray-500">Pubs</p><p className="text-xl font-bold">{stats.ads?.active || 0}</p></div></div></Card>
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
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid md:grid-cols-2 gap-6">
              <Card><CardHeader><CardTitle>Commandes récentes</CardTitle></CardHeader><CardContent>{data.orders.slice(0, 5).map(order => (<div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0"><div><p className="font-medium">#{order.orderNumber}</p><p className="text-sm text-gray-500">{order.customer?.name}</p></div><div className="text-right"><p className="font-bold">${order.total}</p><Badge>{order.status}</Badge></div></div>))}</CardContent></Card>
              <Card><CardHeader><CardTitle>Leads récents</CardTitle></CardHeader><CardContent>{data.leads.slice(0, 5).map(lead => (<div key={lead.id} className="flex items-center justify-between py-2 border-b last:border-0"><div><p className="font-medium">{lead.name}</p><p className="text-sm text-gray-500">{lead.type}</p></div><Badge variant={lead.status === 'NEW' ? 'default' : 'secondary'}>{lead.status}</Badge></div>))}</CardContent></Card>
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
                    <Input placeholder="Nom *" value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} />
                    <Textarea placeholder="Description" value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} />
                    <div className="grid grid-cols-3 gap-4">
                      <Input type="number" placeholder="Prix *" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} />
                      <Input type="number" placeholder="Ancien prix" value={productForm.comparePrice} onChange={(e) => setProductForm({...productForm, comparePrice: e.target.value})} />
                      <Input type="number" placeholder="Stock" value={productForm.stock} onChange={(e) => setProductForm({...productForm, stock: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Select value={productForm.categoryId} onValueChange={(v) => setProductForm({...productForm, categoryId: v})}><SelectTrigger><SelectValue placeholder="Catégorie" /></SelectTrigger><SelectContent>{data.categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}</SelectContent></Select>
                      <Input placeholder="Marque" value={productForm.brand} onChange={(e) => setProductForm({...productForm, brand: e.target.value})} />
                    </div>
                    <Input placeholder="URLs images (virgule)" value={productForm.images} onChange={(e) => setProductForm({...productForm, images: e.target.value})} />
                    <label className="flex items-center gap-2"><input type="checkbox" checked={productForm.featured} onChange={(e) => setProductForm({...productForm, featured: e.target.checked})} /> Vedette</label>
                    <Button onClick={saveProduct} className="w-full">{editingItem ? 'Mettre à jour' : 'Créer'}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-4">
              {data.products.map(product => (
                <Card key={product.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">{product.images?.[0] ? <img src={product.images[0]} alt="" className="w-full h-full object-cover" /> : <Package className="w-8 h-8 text-gray-300 m-auto" />}</div>
                    <div className="flex-1"><h3 className="font-semibold">{product.name}</h3><p className="text-sm text-gray-500">{product.categoryName} • Stock: {product.stock}</p><span className="font-bold text-blue-600">${product.price}</span></div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditingItem(product); setProductForm({ ...product, price: product.price?.toString(), comparePrice: product.comparePrice?.toString(), stock: product.stock?.toString(), images: product.images?.join(', ') || '' }); setShowDialog('product'); }}><Edit className="w-4 h-4" /></Button>
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
                    <Button onClick={saveCategory} className="w-full">{editingItem ? 'Mettre à jour' : 'Créer'}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.categories.map(cat => (<Card key={cat.id} className="p-4"><div className="flex items-center justify-between"><div><h3 className="font-semibold">{cat.name}</h3><p className="text-sm text-gray-500">{cat.slug}</p></div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => { setEditingItem(cat); setCategoryForm(cat); setShowDialog('category'); }}><Edit className="w-4 h-4" /></Button><Button size="sm" variant="destructive" onClick={() => deleteItem('categories', cat.id)}><Trash2 className="w-4 h-4" /></Button></div></div></Card>))}
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <h2 className="text-xl font-bold mb-4">Commandes ({data.orders.length})</h2>
            <div className="space-y-4">
              {data.orders.map(order => (
                <Card key={order.id} className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div><Badge className="mb-2">{order.status}</Badge><h3 className="font-bold">#{order.orderNumber}</h3><p className="text-gray-600">{order.customer?.name} • {order.customer?.phone}</p><p className="text-lg font-bold mt-2">${order.total}</p></div>
                    <div className="flex flex-col gap-2">
                      <Select value={order.status} onValueChange={(v) => updateOrderStatus(order.id, v)}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent>{Object.values(ORDER_STATUS).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
                      <Button size="sm" variant="outline" onClick={() => printReceipt(order)}><Printer className="w-4 h-4 mr-2" />Imprimer</Button>
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
                    <div><div className="flex gap-2 mb-2"><Badge variant={lead.status === 'NEW' ? 'default' : 'secondary'}>{lead.status}</Badge><Badge variant="outline">{lead.type}</Badge></div><h3 className="font-semibold">{lead.name}</h3><p className="text-gray-600">{lead.phone} • {lead.email}</p>{lead.message && <p className="text-sm bg-gray-50 p-2 rounded mt-2">{lead.message}</p>}</div>
                    <Select value={lead.status} onValueChange={(v) => updateLeadStatus(lead.id, v)}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent>{['NEW', 'CONTACTED', 'CONFIRMED', 'INSTALLED'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ads">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Publicités ({data.ads.length})</h2>
              <Dialog open={showDialog === 'ad'} onOpenChange={(open) => { setShowDialog(open ? 'ad' : null); if (!open) { setEditingItem(null); setAdForm({ title: '', description: '', image: '', link: '', linkType: 'whatsapp', position: 'shop', active: true }); } }}>
                <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Ajouter</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>{editingItem ? 'Modifier' : 'Nouvelle'} Publicité</DialogTitle></DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input placeholder="Titre *" value={adForm.title} onChange={(e) => setAdForm({...adForm, title: e.target.value})} />
                    <Textarea placeholder="Description" value={adForm.description} onChange={(e) => setAdForm({...adForm, description: e.target.value})} />
                    <Input placeholder="URL image *" value={adForm.image} onChange={(e) => setAdForm({...adForm, image: e.target.value})} />
                    <Select value={adForm.position} onValueChange={(v) => setAdForm({...adForm, position: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="home">Accueil</SelectItem><SelectItem value="shop">Boutique</SelectItem></SelectContent></Select>
                    <Button onClick={saveAd} className="w-full">{editingItem ? 'Mettre à jour' : 'Créer'}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.ads.map(ad => (<Card key={ad.id} className="overflow-hidden">{ad.image && <img src={ad.image} alt="" className="w-full h-32 object-cover" />}<CardContent className="p-4"><Badge className="mb-2">{ad.active ? 'Actif' : 'Inactif'}</Badge><h3 className="font-semibold">{ad.title}</h3><div className="flex gap-2 mt-4"><Button size="sm" variant="outline" onClick={() => { setEditingItem(ad); setAdForm(ad); setShowDialog('ad'); }}><Edit className="w-4 h-4" /></Button><Button size="sm" variant="destructive" onClick={() => deleteItem('ads', ad.id)}><Trash2 className="w-4 h-4" /></Button></div></CardContent></Card>))}
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
  const [email, setEmail] = useState('');
  
  const handleNewsletter = (e) => {
    e.preventDefault();
    window.open(`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(`Newsletter: ${email}`)}`, '_blank');
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">{locale === 'fr' ? 'Restez Informé' : 'Stay Informed'}</h3>
              <p className="text-gray-400">{locale === 'fr' ? 'Recevez nos offres et actualités' : 'Receive our offers and news'}</p>
            </div>
            <form onSubmit={handleNewsletter} className="flex gap-2 w-full md:w-auto">
              <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 w-64" />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700"><Send className="w-4 h-4" /></Button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src={SITE_CONFIG.logo} alt="NEXORA" className="h-10 w-10" />
              <span className="font-bold text-xl">NEXORA</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">{t.footer.slogan}</p>
            <div className="space-y-2 text-gray-400 text-sm">
              {SITE_CONFIG.contact.phones.slice(0, 2).map((p, i) => <p key={i}>{p}</p>)}
              <p>{SITE_CONFIG.contact.email}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">{locale === 'fr' ? 'Services' : 'Services'}</h4>
            <ul className="space-y-3 text-gray-400">
              <li><button onClick={() => setCurrentPage('services')} className="hover:text-white transition-colors">{locale === 'fr' ? 'Développement' : 'Development'}</button></li>
              <li><button onClick={() => setCurrentPage('starlink')} className="hover:text-white transition-colors">Starlink</button></li>
              <li><button onClick={() => setCurrentPage('shop')} className="hover:text-white transition-colors">{locale === 'fr' ? 'Boutique' : 'Shop'}</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">{locale === 'fr' ? 'Entreprise' : 'Company'}</h4>
            <ul className="space-y-3 text-gray-400">
              <li><button onClick={() => setCurrentPage('about')} className="hover:text-white transition-colors">{locale === 'fr' ? 'À propos' : 'About'}</button></li>
              <li><button onClick={() => setCurrentPage('portfolio')} className="hover:text-white transition-colors">Portfolio</button></li>
              <li><button onClick={() => setCurrentPage('contact')} className="hover:text-white transition-colors">Contact</button></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} NEXORA Technologies & Networks. {t.footer.rights}.
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
      case 'services': return <ServicesPage locale={locale} setCurrentPage={setCurrentPage} />;
      case 'portfolio': return <PortfolioPage locale={locale} />;
      case 'shop': return <ShopPage locale={locale} setCurrentPage={setCurrentPage} />;
      case 'cart': return <CartPage locale={locale} setCurrentPage={setCurrentPage} />;
      case 'starlink': return <StarlinkPage locale={locale} />;
      case 'about': return <AboutPage locale={locale} />;
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
          <ChatWidget locale={locale} />
        </main>
      </CartProvider>
    </AuthProvider>
  );
}
