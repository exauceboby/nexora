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
