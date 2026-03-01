'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Satellite, Wifi, Globe, Code, Shield, Zap, Users, Award, 
  ChevronRight, Menu, X, Phone, Mail, MapPin, ArrowRight,
  Check, Star, MessageCircle, Building, GraduationCap, Coffee,
  Home as HomeIcon, Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { translations } from '@/lib/translations';

// Images
const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1590433332541-12e70dd1d4a6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjBpbnRlcm5ldHxlbnwwfHx8Ymx1ZXwxNzcyMzU2OTE3fDA&ixlib=rb-4.1.0&q=85',
  starlink: 'https://images.unsplash.com/photo-1651421745900-bc90a58ec0ed?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHwyfHxzYXRlbGxpdGUlMjBpbnRlcm5ldHxlbnwwfHx8Ymx1ZXwxNzcyMzU2OTE3fDA&ixlib=rb-4.1.0&q=85',
  network: 'https://images.unsplash.com/photo-1708481295267-4b1859f4ffc2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxuZXR3b3JrJTIwaW5mcmFzdHJ1Y3R1cmV8ZW58MHx8fGJsdWV8MTc3MjM1NjkyNHww&ixlib=rb-4.1.0&q=85',
  tech: 'https://images.unsplash.com/photo-1580982330720-bd5e0fed108b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHx0ZWNobm9sb2d5JTIwYnVzaW5lc3N8ZW58MHx8fGJsdWV8MTc3MjM1Njk0N3ww&ixlib=rb-4.1.0&q=85',
  business: 'https://images.pexels.com/photos/14268860/pexels-photo-14268860.jpeg',
  africa: 'https://images.pexels.com/photos/7163460/pexels-photo-7163460.jpeg'
};

// Navigation Component
function Navigation({ locale, setLocale, currentPage, setCurrentPage }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = translations[locale];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'starlink', label: t.nav.starlink },
    { id: 'network', label: t.nav.network },
    { id: 'partners', label: t.nav.partners },
    { id: 'about', label: t.nav.about },
    { id: 'projects', label: t.nav.projects },
    { id: 'contact', label: t.nav.contact },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? 'glass shadow-lg shadow-black/5' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button 
            onClick={() => setCurrentPage('home')}
            className="flex items-center space-x-2 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="font-bold text-xl tracking-tight">NEXORA</span>
          </button>

          {/* Desktop Navigation */}
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
            {/* Language Switcher */}
            <button
              onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
              className="px-3 py-1.5 text-sm font-medium rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              {locale === 'fr' ? 'EN' : 'FR'}
            </button>

            {/* CTA Button */}
            <Button 
              onClick={() => setCurrentPage('starlink')}
              className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
            >
              {t.nav.getQuote}
            </Button>

            {/* Admin Link */}
            <button
              onClick={() => setCurrentPage('admin')}
              className="hidden lg:block px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors"
            >
              Admin
            </button>

            {/* Mobile Menu Button */}
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
        <div className="lg:hidden glass border-t border-gray-200">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-xl text-left font-medium transition-all ${
                  currentPage === item.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
            <Button 
              onClick={() => {
                setCurrentPage('admin');
                setIsMobileMenuOpen(false);
              }}
              variant="outline"
              className="w-full mt-4"
            >
              Admin Dashboard
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

// Hero Section
function HeroSection({ locale, setCurrentPage }) {
  const t = translations[locale];
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${IMAGES.hero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-600/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-8">
            <Satellite className="w-4 h-4 mr-2 text-blue-400" />
            Partenaire Starlink en RDC
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            {t.hero.title}
            <br />
            <span className="text-gradient bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {t.hero.titleHighlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => setCurrentPage('contact')}
              size="lg"
              className="bg-white text-slate-900 hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-2xl shadow-white/20 hover:shadow-white/30 transition-all group"
            >
              {t.hero.cta1}
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

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

// Services Section
function ServicesSection({ locale, setCurrentPage }) {
  const t = translations[locale];
  
  const services = [
    {
      icon: Satellite,
      title: t.services.starlink.title,
      desc: t.services.starlink.desc,
      color: 'from-blue-600 to-cyan-500',
      page: 'starlink'
    },
    {
      icon: Wifi,
      title: t.services.network.title,
      desc: t.services.network.desc,
      color: 'from-violet-600 to-purple-500',
      page: 'network'
    },
    {
      icon: Globe,
      title: t.services.mikrotik.title,
      desc: t.services.mikrotik.desc,
      color: 'from-orange-500 to-amber-500',
      page: 'network'
    },
    {
      icon: Code,
      title: t.services.it.title,
      desc: t.services.it.desc,
      color: 'from-emerald-500 to-teal-500',
      page: 'network'
    }
  ];

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t.services.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.services.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="group cursor-pointer border-0 shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/50 transition-all duration-500 hover:-translate-y-2"
              onClick={() => setCurrentPage(service.page)}
            >
              <CardContent className="p-8">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Starlink Offer Section
function StarlinkOfferSection({ locale, setCurrentPage }) {
  const t = translations[locale];
  
  const packs = [
    { icon: HomeIcon, label: t.starlinkOffer.house },
    { icon: Briefcase, label: t.starlinkOffer.business },
    { icon: GraduationCap, label: t.starlinkOffer.school },
    { icon: Coffee, label: t.starlinkOffer.cyber }
  ];

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${IMAGES.starlink})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      </div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-6">
              {t.starlinkOffer.subtitle}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8">
              {t.starlinkOffer.title}
            </h2>

            {/* Pricing Cards */}
            <div className="space-y-4 mb-8">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-400 font-medium">{t.starlinkOffer.kit}</p>
                    <p className="text-2xl font-bold text-white">{t.starlinkOffer.kitPrice}</p>
                  </div>
                  <Check className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-400 font-medium">{t.starlinkOffer.monthly}</p>
                    <p className="text-2xl font-bold text-white">{t.starlinkOffer.monthlyPrice}</p>
                  </div>
                  <Check className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <div className="glass-card rounded-2xl p-6 border-amber-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-400 font-medium">{t.starlinkOffer.subscription}</p>
                    <p className="text-lg text-gray-400">{t.starlinkOffer.subscriptionNote}</p>
                  </div>
                  <Star className="w-8 h-8 text-amber-400" />
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setCurrentPage('starlink')}
              size="lg"
              className="bg-white text-slate-900 hover:bg-gray-100 text-lg px-8 py-6 shadow-2xl shadow-white/20"
            >
              {t.starlinkOffer.cta}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Right: Packs */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">{t.starlinkOffer.packs}</h3>
            <div className="grid grid-cols-2 gap-4">
              {packs.map((pack, index) => (
                <div 
                  key={index}
                  className="glass-card rounded-2xl p-6 text-center hover:bg-white/20 transition-all cursor-pointer group"
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <pack.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-white font-medium">{pack.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 glass-card rounded-2xl">
              <p className="text-blue-400 text-sm mb-2">Option Business</p>
              <p className="text-white">
                Monétisation hotspot MikroTik (vouchers) pour business et cybercafés
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Why Nexora Section
function WhyNexoraSection({ locale }) {
  const t = translations[locale];
  
  const reasons = [
    {
      icon: Award,
      title: t.why.corporate.title,
      desc: t.why.corporate.desc,
      gradient: 'from-blue-600 to-indigo-600'
    },
    {
      icon: Zap,
      title: t.why.performance.title,
      desc: t.why.performance.desc,
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      icon: Shield,
      title: t.why.support.title,
      desc: t.why.support.desc,
      gradient: 'from-emerald-500 to-teal-500'
    }
  ];

  return (
    <section className="py-24 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t.why.title}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div 
              key={index}
              className="text-center p-8 rounded-3xl bg-white shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/50 transition-all duration-500 hover:-translate-y-2"
            >
              <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${reason.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                <reason.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {reason.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {reason.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Contact Form Component
function ContactForm({ locale, type = 'contact' }) {
  const t = translations[locale];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    country: 'RDC',
    city: '',
    message: '',
    pack: '',
    service: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type
        })
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '', phone: '', email: '', company: '',
          country: 'RDC', city: '', message: '', pack: '', service: ''
        });
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
        <Input
          placeholder={t.contact.name + ' *'}
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
          className="bg-white/80 border-gray-200 focus:border-blue-500 h-12"
        />
        <Input
          placeholder={t.contact.phone + ' *'}
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          required
          className="bg-white/80 border-gray-200 focus:border-blue-500 h-12"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          type="email"
          placeholder={t.contact.email}
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="bg-white/80 border-gray-200 focus:border-blue-500 h-12"
        />
        <Input
          placeholder={t.contact.company}
          value={formData.company}
          onChange={(e) => setFormData({...formData, company: e.target.value})}
          className="bg-white/80 border-gray-200 focus:border-blue-500 h-12"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Select value={formData.country} onValueChange={(v) => setFormData({...formData, country: v})}>
          <SelectTrigger className="bg-white/80 border-gray-200 focus:border-blue-500 h-12">
            <SelectValue placeholder={t.contact.country} />
          </SelectTrigger>
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
        <Input
          placeholder={t.contact.city}
          value={formData.city}
          onChange={(e) => setFormData({...formData, city: e.target.value})}
          className="bg-white/80 border-gray-200 focus:border-blue-500 h-12"
        />
      </div>

      {type === 'starlink' && (
        <Select value={formData.pack} onValueChange={(v) => setFormData({...formData, pack: v})}>
          <SelectTrigger className="bg-white/80 border-gray-200 focus:border-blue-500 h-12">
            <SelectValue placeholder={t.form.selectPack} />
          </SelectTrigger>
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
          <SelectTrigger className="bg-white/80 border-gray-200 focus:border-blue-500 h-12">
            <SelectValue placeholder={t.form.selectService} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="starlink">Starlink</SelectItem>
            <SelectItem value="network">Réseaux / Network</SelectItem>
            <SelectItem value="mikrotik">Hotspot MikroTik</SelectItem>
            <SelectItem value="it">Solutions IT</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Textarea
        placeholder={t.form.details}
        value={formData.message}
        onChange={(e) => setFormData({...formData, message: e.target.value})}
        className="bg-white/80 border-gray-200 focus:border-blue-500 min-h-[120px]"
      />

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg shadow-lg shadow-blue-500/30"
      >
        {isSubmitting ? t.form.submitting : t.form.submit}
      </Button>

      {submitStatus === 'success' && (
        <div className="p-4 bg-green-100 text-green-700 rounded-xl text-center font-medium">
          {t.form.success}
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="p-4 bg-red-100 text-red-700 rounded-xl text-center font-medium">
          {t.form.error}
        </div>
      )}
    </form>
  );
}

// Contact Section (Home page)
function ContactSection({ locale }) {
  const t = translations[locale];
  
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t.contact.quickContact}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {t.contact.quickContactDesc}
            </p>

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
  );
}

// CTA Section
function CTASection({ locale, setCurrentPage }) {
  const t = translations[locale];
  
  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-700 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          {locale === 'fr' ? 'Prêt à déployer ?' : 'Ready to deploy?'}
        </h2>
        <p className="text-xl text-blue-100 mb-10">
          {locale === 'fr' 
            ? 'Demandez un devis ou envoyez une demande Starlink maintenant.'
            : 'Request a quote or send a Starlink request now.'}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={() => setCurrentPage('contact')}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-2xl"
          >
            {t.hero.cta1}
          </Button>
          <Button 
            onClick={() => setCurrentPage('starlink')}
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold"
          >
            {t.hero.cta2}
          </Button>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer({ locale, setCurrentPage }) {
  const t = translations[locale];
  
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="font-bold text-xl">NEXORA</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              {t.footer.slogan}
            </p>
            <div className="space-y-2 text-gray-400">
              <p>+243 971 037 431</p>
              <p>+243 822 888 909</p>
              <p>nexorainfo@nexora.com</p>
              <p>www.nexora.cd</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t.footer.services}</h4>
            <ul className="space-y-3 text-gray-400">
              <li><button onClick={() => setCurrentPage('starlink')} className="hover:text-white transition-colors">Starlink</button></li>
              <li><button onClick={() => setCurrentPage('network')} className="hover:text-white transition-colors">Réseaux & IT</button></li>
              <li><button onClick={() => setCurrentPage('partners')} className="hover:text-white transition-colors">Revendeurs</button></li>
            </ul>
          </div>

          {/* Company */}
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
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} NEXORA Technologies & Networks. {t.footer.rights}.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-gray-600 text-sm">nexora.cd</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// WhatsApp Button
function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/243971037431?text=Bonjour%20NEXORA%2C%20je%20souhaite%20un%20devis%20%2F%20infos."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 transition-all hover:scale-110"
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </a>
  );
}

// ============ PAGE COMPONENTS ============

// Home Page
function HomePage({ locale, setCurrentPage }) {
  return (
    <>
      <HeroSection locale={locale} setCurrentPage={setCurrentPage} />
      <ServicesSection locale={locale} setCurrentPage={setCurrentPage} />
      <StarlinkOfferSection locale={locale} setCurrentPage={setCurrentPage} />
      <WhyNexoraSection locale={locale} />
      <ContactSection locale={locale} />
      <CTASection locale={locale} setCurrentPage={setCurrentPage} />
    </>
  );
}

// Starlink Page
function StarlinkPage({ locale }) {
  const t = translations[locale];
  
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${IMAGES.starlink})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-6">
              Starlink en RDC
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              {t.starlinkOffer.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Internet satellite haute performance pour les particuliers et entreprises
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="glass-card rounded-3xl p-8 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6">
                <Satellite className="w-8 h-8 text-white" />
              </div>
              <p className="text-blue-400 font-medium mb-2">{t.starlinkOffer.kit}</p>
              <p className="text-3xl font-bold text-white">$150</p>
              <p className="text-gray-400 text-sm mt-2">minimum à l'obtention</p>
            </div>
            <div className="glass-card rounded-3xl p-8 text-center border-blue-500/50">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <p className="text-blue-400 font-medium mb-2">{t.starlinkOffer.monthly}</p>
              <p className="text-3xl font-bold text-white">$100</p>
              <p className="text-gray-400 text-sm mt-2">/ mois × 5 mois</p>
            </div>
            <div className="glass-card rounded-3xl p-8 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <p className="text-amber-400 font-medium mb-2">{t.starlinkOffer.subscription}</p>
              <p className="text-xl font-bold text-white">Non inclus</p>
              <p className="text-gray-400 text-sm mt-2">abonnement mensuel</p>
            </div>
          </div>
        </div>
      </section>

      {/* Packs */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t.starlinkOffer.packs}
          </h2>
          
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

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              {t.faq.title}
            </h2>
            
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

      {/* Form */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {locale === 'fr' ? 'Demander mon kit Starlink' : 'Request my Starlink kit'}
            </h2>
            <p className="text-gray-600">
              {locale === 'fr' 
                ? 'Remplissez le formulaire et nous vous contacterons rapidement.'
                : 'Fill out the form and we will contact you shortly.'}
            </p>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <ContactForm locale={locale} type="starlink" />
          </div>
        </div>
      </section>
    </div>
  );
}

// Network & IT Page
function NetworkPage({ locale }) {
  const t = translations[locale];
  
  const services = [
    {
      title: locale === 'fr' ? 'Réseaux LAN/Wi-Fi' : 'LAN/Wi-Fi Networks',
      desc: locale === 'fr' 
        ? 'Architecture réseau complète, couverture Wi-Fi optimisée, sécurisation avancée.'
        : 'Complete network architecture, optimized Wi-Fi coverage, advanced security.',
      features: ['Architecture LAN', 'Wi-Fi professionnel', 'Sécurité réseau', 'VPN & Firewall']
    },
    {
      title: 'Hotspot MikroTik',
      desc: locale === 'fr'
        ? 'Système de vouchers, contrôle d\'accès et monétisation pour business et cybercafés.'
        : 'Voucher system, access control and monetization for business and cybercafés.',
      features: ['Vouchers', 'Portail captif', 'Contrôle bande passante', 'Rapports']
    },
    {
      title: locale === 'fr' ? 'Solutions IT' : 'IT Solutions',
      desc: locale === 'fr'
        ? 'Développement web/mobile, applications de gestion sur mesure.'
        : 'Web/mobile development, custom management applications.',
      features: ['Sites web', 'Apps mobiles', 'Logiciels de gestion', 'Maintenance']
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${IMAGES.network})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            {locale === 'fr' ? 'Réseaux & Solutions IT' : 'Network & IT Solutions'}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {locale === 'fr' 
              ? 'Infrastructure réseau, hotspot MikroTik et développement sur mesure'
              : 'Network infrastructure, MikroTik hotspot and custom development'}
          </p>
        </div>
      </section>

      {/* Services */}
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
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {locale === 'fr' ? 'Demander un devis' : 'Request a quote'}
            </h2>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <ContactForm locale={locale} type="quote" />
          </div>
        </div>
      </section>
    </div>
  );
}

// Partners Page
function PartnersPage({ locale }) {
  const t = translations[locale];
  
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${IMAGES.business})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            {t.partners.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t.partners.subtitle}
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t.partners.benefits}
          </h2>
          
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
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {locale === 'fr' ? 'Devenir partenaire' : 'Become a partner'}
              </h3>
              <ContactForm locale={locale} type="partner" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// About Page
function AboutPage({ locale }) {
  const t = translations[locale];
  
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${IMAGES.africa})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            {t.about.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t.about.subtitle}
          </p>
        </div>
      </section>

      {/* Content */}
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

          {/* Representative */}
          <div className="max-w-xl mx-auto text-center">
            <div className="bg-gray-50 rounded-3xl p-8">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Exaucé Boby</h3>
              <p className="text-blue-600 font-medium mb-4">{t.about.representativeRole}</p>
              <p className="text-gray-600">
                CEO / PDG — Ingénieur réseau (Starlink • MikroTik • Wi-Fi)
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Projects/Blog Page
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
      if (data.success) {
        setArticles(data.data);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
    setLoading(false);
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            {locale === 'fr' ? 'Projets & Actualités' : 'Projects & News'}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {locale === 'fr' 
              ? 'Découvrez nos réalisations et restez informé de nos actualités'
              : 'Discover our achievements and stay informed of our news'}
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : articles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-xl transition-all">
                  {article.image && (
                    <div className="h-48 overflow-hidden">
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <p className="text-sm text-blue-600 font-medium mb-2">{article.category || 'Article'}</p>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{article.title}</h3>
                    <p className="text-gray-600 line-clamp-3">{article.excerpt || article.content?.substring(0, 150)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {locale === 'fr' ? 'Aucun article pour le moment.' : 'No articles yet.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Contact Page
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
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            {t.contact.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t.contact.subtitle}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {locale === 'fr' ? 'Nos coordonnées' : 'Our contact details'}
              </h2>
              
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

              <a
                href="https://wa.me/243971037431"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
              </a>
            </div>

            {/* Form */}
            <div className="bg-gray-50 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {t.contact.quickContact}
              </h3>
              <ContactForm locale={locale} type="contact" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Admin Page
function AdminPage({ locale }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('leads');
  const [leads, setLeads] = useState([]);
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Article form
  const [articleForm, setArticleForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    image: '',
    published: false
  });
  const [editingArticle, setEditingArticle] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setLoginError('');
        fetchData();
      } else {
        setLoginError(locale === 'fr' ? 'Mot de passe incorrect' : 'Invalid password');
      }
    } catch (error) {
      setLoginError('Error');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsRes, articlesRes, statsRes] = await Promise.all([
        fetch('/api/leads'),
        fetch('/api/articles'),
        fetch('/api/stats')
      ]);
      
      const leadsData = await leadsRes.json();
      const articlesData = await articlesRes.json();
      const statsData = await statsRes.json();
      
      if (leadsData.success) setLeads(leadsData.data);
      if (articlesData.success) setArticles(articlesData.data);
      if (statsData.success) setStats(statsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const updateLeadStatus = async (id, status) => {
    try {
      await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchData();
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const saveArticle = async () => {
    try {
      const method = editingArticle ? 'PUT' : 'POST';
      const url = editingArticle ? `/api/articles/${editingArticle.id}` : '/api/articles';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleForm)
      });
      
      setArticleForm({ title: '', content: '', excerpt: '', category: '', image: '', published: false });
      setEditingArticle(null);
      fetchData();
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  const deleteArticle = async (id) => {
    if (confirm(locale === 'fr' ? 'Supprimer cet article ?' : 'Delete this article?')) {
      try {
        await fetch(`/api/articles/${id}`, { method: 'DELETE' });
        fetchData();
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  };

  const editArticle = (article) => {
    setEditingArticle(article);
    setArticleForm({
      title: article.title,
      content: article.content || '',
      excerpt: article.excerpt || '',
      category: article.category || '',
      image: article.image || '',
      published: article.published
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <Card className="p-8">
            <h1 className="text-2xl font-bold text-center mb-6">Admin Dashboard</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder={locale === 'fr' ? 'Mot de passe admin' : 'Admin password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
              />
              {loginError && (
                <p className="text-red-500 text-sm text-center">{loginError}</p>
              )}
              <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                {locale === 'fr' ? 'Se connecter' : 'Login'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  const statuses = ['NEW', 'CONTACTED', 'CONFIRMED', 'INSTALLED'];
  const statusColors = {
    NEW: 'bg-blue-100 text-blue-700',
    CONTACTED: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-green-100 text-green-700',
    INSTALLED: 'bg-purple-100 text-purple-700'
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button onClick={fetchData} variant="outline">
            {locale === 'fr' ? 'Actualiser' : 'Refresh'}
          </Button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <p className="text-sm text-gray-500 mb-1">Total Leads</p>
              <p className="text-3xl font-bold text-gray-900">{stats.leads.total}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-gray-500 mb-1">New</p>
              <p className="text-3xl font-bold text-blue-600">{stats.leads.new}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-gray-500 mb-1">Confirmed</p>
              <p className="text-3xl font-bold text-green-600">{stats.leads.confirmed}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-gray-500 mb-1">Installed</p>
              <p className="text-3xl font-bold text-purple-600">{stats.leads.installed}</p>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="leads">Leads ({leads.length})</TabsTrigger>
            <TabsTrigger value="articles">Articles ({articles.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="leads">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
              </div>
            ) : leads.length > 0 ? (
              <div className="space-y-4">
                {leads.map((lead) => (
                  <Card key={lead.id} className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                            {lead.status}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                            {lead.type}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                        <p className="text-gray-600 text-sm">{lead.phone} • {lead.email}</p>
                        {lead.company && <p className="text-gray-500 text-sm">{lead.company}</p>}
                        <p className="text-gray-500 text-sm">{lead.country} {lead.city && `• ${lead.city}`}</p>
                        {lead.message && (
                          <p className="text-gray-600 text-sm mt-2 bg-gray-50 p-2 rounded">{lead.message}</p>
                        )}
                        <p className="text-gray-400 text-xs mt-2">
                          {new Date(lead.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Select 
                        value={lead.status} 
                        onValueChange={(v) => updateLeadStatus(lead.id, v)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">{locale === 'fr' ? 'Aucun lead' : 'No leads'}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="articles">
            {/* Article Form */}
            <Card className="p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">
                {editingArticle 
                  ? (locale === 'fr' ? 'Modifier l\'article' : 'Edit article')
                  : (locale === 'fr' ? 'Nouvel article' : 'New article')}
              </h3>
              <div className="space-y-4">
                <Input
                  placeholder={locale === 'fr' ? 'Titre' : 'Title'}
                  value={articleForm.title}
                  onChange={(e) => setArticleForm({...articleForm, title: e.target.value})}
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    placeholder={locale === 'fr' ? 'Catégorie' : 'Category'}
                    value={articleForm.category}
                    onChange={(e) => setArticleForm({...articleForm, category: e.target.value})}
                  />
                  <Input
                    placeholder={locale === 'fr' ? 'URL image' : 'Image URL'}
                    value={articleForm.image}
                    onChange={(e) => setArticleForm({...articleForm, image: e.target.value})}
                  />
                </div>
                <Textarea
                  placeholder="Excerpt"
                  value={articleForm.excerpt}
                  onChange={(e) => setArticleForm({...articleForm, excerpt: e.target.value})}
                  className="min-h-[80px]"
                />
                <Textarea
                  placeholder="Content"
                  value={articleForm.content}
                  onChange={(e) => setArticleForm({...articleForm, content: e.target.value})}
                  className="min-h-[200px]"
                />
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={articleForm.published}
                      onChange={(e) => setArticleForm({...articleForm, published: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span>{locale === 'fr' ? 'Publié' : 'Published'}</span>
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveArticle} className="bg-blue-600 hover:bg-blue-700">
                    {editingArticle 
                      ? (locale === 'fr' ? 'Mettre à jour' : 'Update')
                      : (locale === 'fr' ? 'Créer' : 'Create')}
                  </Button>
                  {editingArticle && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditingArticle(null);
                        setArticleForm({ title: '', content: '', excerpt: '', category: '', image: '', published: false });
                      }}
                    >
                      {locale === 'fr' ? 'Annuler' : 'Cancel'}
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Articles List */}
            {articles.length > 0 ? (
              <div className="space-y-4">
                {articles.map((article) => (
                  <Card key={article.id} className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            article.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {article.published ? 'Published' : 'Draft'}
                          </span>
                          {article.category && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                              {article.category}
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900">{article.title}</h3>
                        {article.excerpt && (
                          <p className="text-gray-600 text-sm mt-1">{article.excerpt}</p>
                        )}
                        <p className="text-gray-400 text-xs mt-2">
                          {new Date(article.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => editArticle(article)}>
                          {locale === 'fr' ? 'Modifier' : 'Edit'}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteArticle(article.id)}>
                          {locale === 'fr' ? 'Supprimer' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">{locale === 'fr' ? 'Aucun article' : 'No articles'}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ============ MAIN APP ============
export default function App() {
  const [locale, setLocale] = useState('fr');
  const [currentPage, setCurrentPage] = useState('home');

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage locale={locale} setCurrentPage={setCurrentPage} />;
      case 'starlink':
        return <StarlinkPage locale={locale} />;
      case 'network':
        return <NetworkPage locale={locale} />;
      case 'partners':
        return <PartnersPage locale={locale} />;
      case 'about':
        return <AboutPage locale={locale} />;
      case 'projects':
        return <ProjectsPage locale={locale} />;
      case 'contact':
        return <ContactPage locale={locale} />;
      case 'admin':
        return <AdminPage locale={locale} />;
      default:
        return <HomePage locale={locale} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <main className="min-h-screen">
      <Navigation 
        locale={locale} 
        setLocale={setLocale} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
      />
      
      {renderPage()}
      
      {currentPage !== 'admin' && (
        <Footer locale={locale} setCurrentPage={setCurrentPage} />
      )}
      
      <WhatsAppButton />
    </main>
  );
}
