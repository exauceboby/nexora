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
