'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Banknote,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  Car,
  CheckCircle2,
  ChevronRight,
  Cloud,
  Code2,
  CreditCard,
  FileCheck2,
  Filter,
  Headphones,
  Home as HomeIcon,
  Image as ImageIcon,
  Landmark,
  Layers3,
  LogIn,
  Lock,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  PackageCheck,
  Plus,
  ReceiptText,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Store,
  Truck,
  Upload,
  UserCheck,
  UserCircle,
  UserPlus,
  Users,
  Wallet,
  X,
  Zap,
} from 'lucide-react';
import { sessionActions, uiActions } from '@/lib/redux/slices';

const STORAGE_KEY = 'nexora_marketplace_v1';
const AUTH_KEY = 'nexora_auth_v1';

const cities = ['Kinshasa', 'Lubumbashi', 'Goma', 'Bukavu', 'Kisangani', 'Bunia', 'Isiro', 'Mbuji-Mayi', 'Kananga', 'Matadi'];

const categoryDepartments = [
  { name: 'Telephones & accessoires', category: 'Telephones', icon: Smartphone },
  { name: 'Informatique & reseaux', category: 'Informatique', icon: Code2 },
  { name: 'Energie & electronique', category: 'Electronique', icon: Zap },
  { name: 'Maison & construction', category: 'Construction', icon: Building2 },
  { name: 'Logistique & transport', category: 'Logistique', icon: Truck },
  { name: 'Services cloud & logiciels', category: 'Cloud', icon: Cloud },
  { name: 'Mode & accessoires', category: 'Apparel', icon: ShoppingBag },
  { name: 'Machines industrielles', category: 'Machinery', icon: PackageCheck },
  { name: 'Automobile & motos', category: 'Automotive', icon: Car },
  { name: 'Agriculture & alimentation', category: 'Agriculture', icon: Store },
];

const topMarketplaceLinks = [
  { label: 'Toutes les categories', target: 'market' },
  { label: 'Selections premium', target: 'market' },
  { label: 'Protection commande', target: 'wallet' },
  { label: 'Espace acheteur', target: 'rfq' },
  { label: 'Centre aide', target: 'messaging' },
  { label: 'App & mobile', target: 'profile' },
  { label: 'Vendre sur Nexora', target: 'market' },
];

const frequentSearches = ['Smartphone 5G', 'Drones', 'Motos electriques', 'Montres connectees', 'Voitures', 'Motos', 'Trottinettes electriques', 'Ordinateurs', 'Telephones', 'Kits solaires'];

const sourcingSteps = [
  { title: 'Search products', text: 'Compare prices, MOQ, suppliers and delivery terms.' },
  { title: 'Contact suppliers', text: 'Chat, ask for samples, negotiate and request proforma.' },
  { title: 'Pay with escrow', text: 'Funds stay protected until delivery is accepted.' },
  { title: 'Track and resolve', text: 'Delivery proof, dispute center and seller payout.' },
];

const marketplaceShowcase = [
  {
    title: 'Toutes les categories',
    text: 'Parcourez vetements, electronique, maison, sports, bijoux, beaute, logistique, machines, automobile et agriculture.',
    items: ['Categories pour vous', 'Recherches frequentes', 'Produits recommandes', 'Nouveaux fabricants'],
  },
  {
    title: 'Fabricants verifies',
    text: 'Trouvez des fournisseurs agrees avec verification KYC, niveau fournisseur, catalogue, echantillons et contact direct.',
    items: ['Recherche usine', 'Meilleurs fournisseurs', 'Echantillons', 'Salons et selection premium'],
  },
  {
    title: 'Protection de commande',
    text: 'Paiement securise, livraison dans les delais, remboursement, preuve de livraison, litige et arbitrage Nexora.',
    items: ['Paiements surs', 'Politique de remboursement', 'Logistique', 'Service apres-vente'],
  },
  {
    title: 'Espace acheteur',
    text: 'Commandes, panier, favoris, messages, demandes de devis, suivi de statut et centre de support.',
    items: ['Panier', 'Commandes', 'Messages', 'Demandes de prix'],
  },
  {
    title: 'Vendre sur Nexora',
    text: 'Creation de boutique, publication produits, gestion du stock, devis, paiements, retraits et verification vendeur.',
    items: ['Centre vendeur', 'Devenir fournisseur verifie', 'Partenariats', 'Application fournisseurs'],
  },
  {
    title: 'Parametres internationaux',
    text: 'Pays ou region, adresse de livraison, langue, devise, code postal, taxes, exoneration et preferences d’achat.',
    items: ['Adresse livraison', 'Langue', 'Devise', 'Programme fiscal'],
  },
];

const buyerTools = [
  ['Compte', 'Connexion, inscription, compte social, profil, securite et historique.'],
  ['Panier', 'Panier vide ou rempli, acces panier, quantites, prix, taxes et livraison.'],
  ['Adresse', 'Pays, region, ville, code postal et adresse libre saisie par l’utilisateur.'],
  ['Langue et devise', 'Selection de langue, devise et preferences modifiables.'],
  ['Recherche image', 'Extension type Lens pour chercher un produit a partir d’une image.'],
  ['Application mobile', 'Acces mobile pour acheter, vendre, discuter, suivre et payer.'],
];

const footerGroups = [
  ['Obtenir de l’aide', ['Centre assistance', 'Discussion en direct', 'Verifier le statut de commande', 'Remboursements', 'Signaler un abus']],
  ['Paiements et protections', ['Paiements surs et faciles', 'Politique de remboursement', 'Livraison a temps', 'Suivi de production', 'Services inspection']],
  ['Approvisionnement', ['Demande de devis', 'Programme de conformite fiscale', 'Fabricants verifies', 'Echantillons', 'Personnalisation rapide']],
  ['Vendre sur Nexora', ['Commencer a vendre', 'Centre vendeurs', 'Devenir fournisseur verifie', 'Partenariats', 'Application fournisseurs']],
  ['Nexora', ['A propos', 'Politiques de conformite', 'Centre de nouvelles', 'Carrieres', 'Respect de l’integrite']],
];

const categoryImages = {
  Telephones: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
  Informatique: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  Electronique: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80',
  Construction: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80',
  Logistique: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80',
  Cloud: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
  Apparel: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80',
  Machinery: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80',
  Automotive: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80',
  Agriculture: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=80',
};

const modules = [
  { id: 'market', label: 'Market', icon: Store, color: 'emerald' },
  { id: 'cab', label: 'Cab', icon: Car, color: 'amber' },
  { id: 'cloud', label: 'Cloud', icon: Cloud, color: 'sky' },
  { id: 'software', label: 'Software', icon: Code2, color: 'violet' },
  { id: 'logistics', label: 'Logistics', icon: Truck, color: 'lime' },
  { id: 'wallet', label: 'Wallet', icon: Wallet, color: 'rose' },
];

const roles = [
  'SUPER_ADMIN',
  'ADMIN_NATIONAL',
  'ADMIN_VILLE',
  'FINANCE',
  'RESPONSABLE_COMMERCIAL',
  'AGENT_TERRAIN',
  'SUPPORT',
  'VENDEUR',
  'FOURNISSEUR',
  'ACHETEUR',
  'CHAUFFEUR',
  'LIVREUR',
  'DEVELOPPEUR_PARTENAIRE',
  'CLIENT_CLOUD',
];

const emptyPlatformState = {
  currentUserId: '',
  users: [],
  shops: [],
  commissionRules: [],
  products: [],
  orders: [],
  rides: [],
  deliveries: [],
  software: [],
  cloudRequests: [],
  kyc: [],
  transactions: [],
  withdrawals: [],
  messages: [],
  notifications: [],
  auditLogs: [],
  rfqs: [],
  quotes: [],
  favorites: [],
  disputes: [],
};

const anonymousUser = {
  id: '',
  name: 'Nexora User',
  role: 'ACHETEUR',
  phone: '',
  email: '',
  city: 'Kinshasa',
  kycStatus: 'PENDING',
  status: 'PENDING',
  availableBalance: 0,
  blockedBalance: 0,
  avatarUrl: '',
  companyName: '',
  address: '',
};


function normalizeState(saved) {
  const base = { ...emptyPlatformState, ...(saved || {}) };
  return {
    ...base,
    users: (base.users || []).map((user) => ({
      status: 'ACTIVE',
      availableBalance: 0,
      blockedBalance: 0,
      avatarUrl: '',
      companyName: '',
      address: '',
      ...user,
    })),
    currentUserId: base.currentUserId || base.users?.[0]?.id || '',
    shops: base.shops || [],
    commissionRules: base.commissionRules || [],
    products: (base.products || []).map((product) => ({
      shopId: '',
      sku: `SKU-${product.id || Date.now()}`,
      subcategory: '',
      condition: 'Neuf',
      pickupAddress: product.city || '',
      promoPrice: 0,
      status: 'APPROVED',
      rejectionReason: '',
      commissionRate: 8,
      moq: 1,
      wholesalePrice: Number(product.price || 0),
      leadTime: '48h',
      b2bEnabled: false,
      origin: 'RDC',
      certifications: [],
      imageUrl: imageForCategory(product.category),
      minOrderValue: Number(product.price || 0),
      tradeAssurance: true,
      ...product,
    })),
    orders: (base.orders || []).map((order) => ({
      deliveryStatus: 'PENDING',
      commission: Number(order.total || 0) * 0.08,
      ...order,
    })),
    withdrawals: base.withdrawals || [],
    auditLogs: base.auditLogs || [],
    notifications: base.notifications || [],
    messages: base.messages || [],
    transactions: base.transactions || [],
    rfqs: base.rfqs || [],
    quotes: base.quotes || [],
    favorites: base.favorites || [],
    disputes: base.disputes || [],
  };
}

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function currency(value) {
  return new Intl.NumberFormat('fr-CD', { style: 'currency', currency: 'USD' }).format(Number(value || 0));
}

function normalizeCategory(value) {
  const text = String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/Ã©|Ã‰|é|É/g, 'e')
    .toLowerCase();
  if (text.includes('phone') || text.includes('tel')) return 'Telephones';
  if (text.includes('info') || text.includes('reseau') || text.includes('rã') || text.includes('ré')) return 'Informatique';
  if (text.includes('elect') || text.includes('solar') || text.includes('energie')) return 'Electronique';
  if (text.includes('construct') || text.includes('maison')) return 'Construction';
  if (text.includes('logistique') || text.includes('transport')) return 'Logistique';
  if (text.includes('cloud') || text.includes('software')) return 'Cloud';
  if (text.includes('mode') || text.includes('apparel') || text.includes('fashion')) return 'Apparel';
  if (text.includes('machine') || text.includes('industrial')) return 'Machinery';
  if (text.includes('auto') || text.includes('moto') || text.includes('car')) return 'Automotive';
  if (text.includes('agri') || text.includes('food') || text.includes('aliment')) return 'Agriculture';
  return value || 'Autres';
}

function imageForCategory(value) {
  return categoryImages[normalizeCategory(value)] || '/images/nexora-ecosystem-hero.png';
}

function statusClass(status) {
  const value = String(status || '').toUpperCase();
  if (['VERIFIED', 'RELEASED', 'DELIVERED', 'COMPLETED', 'APPROVED', 'PAID', 'ACCEPTED', 'AWARDED', 'RESOLVED', 'GOLD'].includes(value)) {
    return 'bg-emerald-100 text-emerald-800 ring-emerald-200';
  }
  if (['PENDING', 'PAYMENT_PENDING', 'PICKUP_PENDING', 'SCOPING', 'OPEN', 'SENT'].includes(value)) {
    return 'bg-amber-100 text-amber-800 ring-amber-200';
  }
  if (['ESCROW_HOLD', 'DRIVER_ASSIGNED', 'IN_TRANSIT', 'CONFIRMED'].includes(value)) {
    return 'bg-blue-100 text-blue-800 ring-blue-200';
  }
  if (['DISPUTED', 'REJECTED', 'REFUNDED', 'CANCELLED', 'SUSPENDED'].includes(value)) {
    return 'bg-rose-100 text-rose-800 ring-rose-200';
  }
  return 'bg-slate-100 text-slate-700 ring-slate-200';
}

function Badge({ children }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${statusClass(children)}`}>{children}</span>;
}

function Metric({ icon: Icon, label, value, note }) {
  return (
    <div className="rounded-lg border border-cyan-100/80 bg-white/90 p-5 shadow-sm shadow-blue-950/5 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-50 text-blue-700 ring-1 ring-cyan-100">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {note && <p className="mt-3 text-xs font-medium text-slate-500">{note}</p>}
    </div>
  );
}

function Panel({ title, icon: Icon, action, children }) {
  return (
    <section className="rounded-lg border border-cyan-100/80 bg-white/95 shadow-sm shadow-blue-950/5 backdrop-blur">
      <div className="flex items-center justify-between gap-4 border-b border-cyan-50 px-5 py-4">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-5 w-5 text-blue-700" />}
          <h2 className="text-lg font-black text-slate-950">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className="min-h-24 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
    />
  );
}

function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-700 text-white shadow-lg shadow-blue-900/15 hover:from-cyan-400 hover:to-blue-600',
    dark: 'bg-[#07111f] text-white hover:bg-[#0d1d34]',
    light: 'bg-white text-slate-950 ring-1 ring-slate-200 hover:bg-slate-50',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
    ghost: 'bg-white/10 text-white ring-1 ring-cyan-200/20 hover:bg-white/15',
  };

  return (
    <button
      {...props}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function PublicMarketplace({ query, setQuery, products, users, cart, setCart }) {
  const dispatch = useDispatch();
  const [openPanel, setOpenPanel] = useState('');
  const [activeCategory, setActiveCategory] = useState(categoryDepartments[0]?.category || 'Telephones');
  const [searchType, setSearchType] = useState('Produits');
  const [region, setRegion] = useState('Uganda');
  const [language, setLanguage] = useState('Francais');
  const [publicCurrency, setPublicCurrency] = useState('USD');
  const [rfqOpen, setRfqOpen] = useState(false);
  const [classifiedOpen, setClassifiedOpen] = useState(false);
  const [lensOpen, setLensOpen] = useState(false);
  const [toast, setToast] = useState('');

  const fallbackProducts = [
    { id: 'fallback-phone', name: 'Smartphone 5G debloque gros et detail', category: 'Telephones', city: 'Kampala', origin: 'UG', price: 189, wholesalePrice: 169, moq: 5, stock: 240, rating: 4.8, sponsored: true, tradeAssurance: true, imageUrl: categoryImages.Telephones, sellerId: 'public-seller-1' },
    { id: 'fallback-drone', name: 'Drone 4K pliable pour boutiques et revendeurs', category: 'Electronique', city: 'Kampala', origin: 'CN', price: 79, wholesalePrice: 64, moq: 10, stock: 170, rating: 4.6, sponsored: true, tradeAssurance: true, imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=900&q=80', sellerId: 'public-seller-2' },
    { id: 'fallback-logistics', name: 'Service fret maritime et aerien porte a porte', category: 'Logistique', city: 'Entebbe', origin: 'UG', price: 35, wholesalePrice: 29, moq: 1, stock: 999, rating: 4.7, sponsored: false, tradeAssurance: true, imageUrl: categoryImages.Logistique, sellerId: 'public-seller-3' },
    { id: 'fallback-laptop', name: 'Ordinateurs portables reconditionnes verifies', category: 'Informatique', city: 'Nairobi', origin: 'KE', price: 260, wholesalePrice: 230, moq: 3, stock: 80, rating: 4.5, sponsored: true, tradeAssurance: true, imageUrl: categoryImages.Informatique, sellerId: 'public-seller-4' },
    { id: 'fallback-fashion', name: 'Sacs et accessoires mode pour boutiques', category: 'Apparel', city: 'Kampala', origin: 'TR', price: 18, wholesalePrice: 12, moq: 30, stock: 520, rating: 4.4, sponsored: false, tradeAssurance: true, imageUrl: categoryImages.Apparel, sellerId: 'public-seller-5' },
    { id: 'fallback-solar', name: 'Kits solaires domestiques avec installation', category: 'Electronique', city: 'Gulu', origin: 'UG', price: 145, wholesalePrice: 128, moq: 2, stock: 95, rating: 4.9, sponsored: true, tradeAssurance: true, imageUrl: categoryImages.Electronique, sellerId: 'public-seller-6' },
    { id: 'fallback-machinery', name: 'Machine emballage petite production', category: 'Machinery', city: 'Kampala', origin: 'CN', price: 890, wholesalePrice: 830, moq: 1, stock: 16, rating: 4.6, sponsored: false, tradeAssurance: true, imageUrl: categoryImages.Machinery, sellerId: 'public-seller-7' },
    { id: 'fallback-car', name: 'Moto electrique livraison urbaine', category: 'Automotive', city: 'Jinja', origin: 'UG', price: 620, wholesalePrice: 575, moq: 2, stock: 25, rating: 4.5, sponsored: true, tradeAssurance: true, imageUrl: categoryImages.Automotive, sellerId: 'public-seller-8' },
  ];

  const searchText = query.trim().toLowerCase();
  const publicProducts = (products?.length ? products : fallbackProducts)
    .filter((product) => {
      const haystack = `${product.name} ${product.category} ${product.city} ${product.origin}`.toLowerCase();
      return !searchText || haystack.includes(searchText);
    });
  const visibleProducts = publicProducts.length ? publicProducts : fallbackProducts;
  const suppliers = users.filter((user) => ['VENDEUR', 'FOURNISSEUR'].includes(user.role)).slice(0, 5);
  const categoryStats = categoryDepartments.map((department, index) => {
    const count = visibleProducts.filter((product) => normalizeCategory(product.category) === department.category).length;
    return { ...department, count: count || (index + 2) * 137 };
  });
  const featuredProducts = visibleProducts.filter((product) => product.sponsored || product.tradeAssurance).slice(0, 5);
  const flashProducts = (featuredProducts.length ? featuredProducts : visibleProducts).slice(0, 5);
  const activeCategoryProducts = visibleProducts.filter((product) => normalizeCategory(product.category) === activeCategory).slice(0, 6);
  const cartTotal = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);

  function goTo(path) {
    window.location.href = path;
  }

  function togglePanel(panel) {
    setOpenPanel((current) => current === panel ? '' : panel);
  }

  function addPublicProduct(product) {
    setCart((previous) => {
      const price = Number(product.promoPrice || product.wholesalePrice || product.price || 0);
      const existing = previous.find((item) => item.productId === product.id);
      if (existing) {
        return previous.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [{ productId: product.id, name: product.name, quantity: 1, price, sellerId: product.sellerId || 'public-seller' }, ...previous];
    });
    setOpenPanel('cart');
  }

  function updatePublicCart(productId, delta) {
    setCart((previous) => previous
      .map((item) => item.productId === productId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item)
      .filter((item) => item.quantity > 0));
  }

  function submitPublicForm(event, key, label) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    const saved = JSON.parse(window.localStorage.getItem(key) || '[]');
    window.localStorage.setItem(key, JSON.stringify([{ ...payload, id: uid('public'), createdAt: new Date().toISOString() }, ...saved]));
    setToast(`${label} enregistree. Connectez-vous pour la suivre dans votre espace.`);
    form.reset();
    setRfqOpen(false);
    setClassifiedOpen(false);
    setLensOpen(false);
  }

  const panelClass = 'absolute right-0 top-full z-50 mt-3 w-[min(92vw,520px)] rounded-lg border border-slate-200 bg-white p-5 text-slate-950 shadow-2xl shadow-slate-950/20';
  const navLinks = [
    ['categories', 'Toutes les categories'],
    ['verified', 'Fabricants Verified'],
    ['assurance', 'Trade Assurance'],
    ['work', 'Nexora Work'],
    ['tax', 'Exoneration de taxes'],
    ['buyer', 'Centre acheteur'],
    ['app', 'App & Extension'],
    ['supplier', 'Devenir fournisseur'],
  ];
  const paymentBadges = ['ID Check', 'PCI DSS', 'SSL', 'Verified', 'Visa', 'Mastercard', 'Mobile Money', 'PayPal', 'Apple Pay', 'Google Pay'];
  const quickActions = [
    ['Demander un devis', ReceiptText, () => setRfqOpen(true)],
    ['Top du classement', BarChart3, () => document.getElementById('recommended-products')?.scrollIntoView({ behavior: 'smooth' })],
    ['Customization rapide', Zap, () => setRfqOpen(true)],
    ['Publier une annonce', Store, () => setClassifiedOpen(true)],
  ];

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-slate-950">
      {toast && (
        <div className="fixed left-1/2 top-4 z-[120] w-[min(92vw,560px)] -translate-x-1/2 rounded-lg border border-cyan-200 bg-white px-4 py-3 text-sm font-black text-slate-900 shadow-xl shadow-slate-950/15">
          <div className="flex items-center justify-between gap-3">
            <span>{toast}</span>
            <button onClick={() => setToast('')} className="rounded-full p-1 hover:bg-slate-100" aria-label="Fermer"><X className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1800px] items-center gap-4 px-4 py-4 lg:px-8">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="nexora-logo-plate shrink-0" aria-label="Accueil Nexora">
            <img src="/images/nexora-logo-full.png" alt="Nexora" className="h-8 w-auto sm:h-9" />
          </button>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              document.getElementById('recommended-products')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden min-w-0 flex-1 items-center rounded-full border-2 border-orange-500 bg-white pl-2 shadow-sm lg:flex"
          >
            <select value={searchType} onChange={(event) => setSearchType(event.target.value)} className="h-12 rounded-full bg-transparent px-4 text-sm font-bold outline-none">
              <option>Produits</option>
              <option>Fournisseurs</option>
              <option>Fabricants</option>
              <option>Annonces</option>
            </select>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher produits, fournisseurs ou services" className="h-12 min-w-0 flex-1 border-l border-slate-200 px-4 text-lg font-semibold outline-none placeholder:text-slate-400" />
            <button type="button" onClick={() => setLensOpen(true)} className="mr-2 rounded-full p-2 hover:bg-slate-100" aria-label="Recherche image"><ImageIcon className="h-6 w-6" /></button>
            <button className="mr-1 inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 px-8 text-base font-black text-white shadow-lg shadow-orange-500/20"><Search className="h-5 w-5" /> Rechercher</button>
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <div className="relative hidden xl:block">
              <button onClick={() => togglePanel('region')} className="flex h-12 items-center gap-2 rounded-lg px-3 text-left text-sm font-bold hover:bg-slate-100">
                <MapPin className="h-5 w-5" />
                <span className="leading-tight"><span className="block text-xs font-semibold text-slate-500">Adresse de livraison</span>{region}</span>
              </button>
              {openPanel === 'region' && (
                <div className={panelClass}>
                  <h3 className="text-xl font-black">Votre pays/region</h3>
                  <p className="mt-2 text-sm font-semibold text-slate-600">Les options d'expedition et les frais varient selon votre emplacement.</p>
                  <button onClick={() => goTo('/login')} className="mt-5 h-12 w-full rounded-full bg-orange-600 text-sm font-black text-white">Connectez-vous pour ajouter une adresse</button>
                  <div className="my-5 flex items-center gap-3 text-sm font-bold text-slate-500"><span className="h-px flex-1 bg-slate-200" />Ou<span className="h-px flex-1 bg-slate-200" /></div>
                  <select value={region} onChange={(event) => setRegion(event.target.value)} className="h-12 w-full rounded-md border border-slate-300 px-3 font-bold outline-none">
                    {['Uganda', 'RDC', 'Kenya', 'Rwanda', 'Tanzania', 'Saudi Arabia', 'France', 'Canada'].map((item) => <option key={item}>{item}</option>)}
                  </select>
                  <input className="mt-3 h-12 w-full rounded-md border border-slate-300 px-3 font-semibold outline-none" placeholder="Saisissez un code postal" />
                  <input className="mt-3 h-12 w-full rounded-md border border-slate-300 px-3 font-semibold outline-none" placeholder="Adresse de livraison" />
                  <button onClick={() => setOpenPanel('')} className="mt-4 h-12 w-full rounded-full bg-orange-600 text-sm font-black text-white">Sauvegarder</button>
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => togglePanel('locale')} className="grid h-12 w-12 place-items-center rounded-full hover:bg-slate-100" aria-label="Langue et devise"><Landmark className="h-6 w-6" /></button>
              {openPanel === 'locale' && (
                <div className={panelClass}>
                  <h3 className="text-xl font-black">Definir la langue et la devise</h3>
                  <p className="mt-2 text-sm font-semibold text-slate-600">Vous pouvez modifier ces parametres a tout moment.</p>
                  <label className="mt-5 block text-sm font-bold">Langue</label>
                  <select value={language} onChange={(event) => setLanguage(event.target.value)} className="mt-2 h-12 w-full rounded-md border border-slate-300 px-3 font-bold outline-none">
                    {['Francais', 'English', 'Swahili', 'Lingala', 'Arabic'].map((item) => <option key={item}>{item}</option>)}
                  </select>
                  <label className="mt-4 block text-sm font-bold">Devise</label>
                  <select value={publicCurrency} onChange={(event) => setPublicCurrency(event.target.value)} className="mt-2 h-12 w-full rounded-md border border-slate-300 px-3 font-bold outline-none">
                    {['USD', 'UGX', 'CDF', 'KES', 'EUR', 'SAR'].map((item) => <option key={item}>{item}</option>)}
                  </select>
                  <button onClick={() => setOpenPanel('')} className="mt-5 h-12 w-full rounded-full bg-orange-600 text-sm font-black text-white">Sauvegarder</button>
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => togglePanel('cart')} className="relative grid h-12 w-12 place-items-center rounded-full hover:bg-slate-100" aria-label="Panier">
                <ShoppingBag className="h-6 w-6" />
                {cart.length > 0 && <span className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-orange-600 px-1 text-xs font-black text-white">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>}
              </button>
              {openPanel === 'cart' && (
                <div className={panelClass}>
                  <h3 className="text-xl font-black">Panier</h3>
                  {!cart.length ? (
                    <div className="py-8 text-center">
                      <ShoppingBag className="mx-auto h-16 w-16 text-orange-500" />
                      <p className="mt-4 text-lg font-black">Votre panier est vide</p>
                      <button onClick={() => document.getElementById('recommended-products')?.scrollIntoView({ behavior: 'smooth' })} className="mt-5 h-11 w-full rounded-full border border-slate-900 text-sm font-black">Parcourir les produits</button>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {cart.map((item) => (
                        <div key={item.productId} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-black">{item.name}</p>
                            <p className="text-sm font-semibold text-slate-600">{currency(item.price)} x {item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => updatePublicCart(item.productId, -1)} className="grid h-8 w-8 place-items-center rounded-full border font-black">-</button>
                            <button onClick={() => updatePublicCart(item.productId, 1)} className="grid h-8 w-8 place-items-center rounded-full border font-black">+</button>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-black">
                        <span>Total</span>
                        <span>{currency(cartTotal)}</span>
                      </div>
                      <button onClick={() => goTo('/login')} className="h-12 w-full rounded-full bg-orange-600 text-sm font-black text-white">Acceder au panier</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => togglePanel('account')} className="grid h-12 w-12 place-items-center rounded-full hover:bg-slate-100" aria-label="Compte"><UserCircle className="h-7 w-7" /></button>
              {openPanel === 'account' && (
                <div className={panelClass}>
                  <h3 className="text-xl font-black">Bienvenue sur Nexora</h3>
                  <button onClick={() => goTo('/login')} className="mt-5 h-12 w-full rounded-full bg-orange-600 text-sm font-black text-white">Se connecter</button>
                  <p className="my-4 text-center text-sm font-semibold text-slate-500">Ou continuez avec</p>
                  <div className="grid grid-cols-3 gap-3">
                    {['Facebook', 'Google', 'LinkedIn'].map((item) => <button key={item} onClick={() => goTo('/login')} className="h-12 rounded-lg border border-slate-200 text-sm font-black">{item}</button>)}
                  </div>
                  <div className="mt-5 border-t border-slate-200 pt-4">
                    {['Mon Nexora', 'Commandes', 'Messages', 'Mes devis', 'Favoris', 'Wallet', 'Centre vendeur'].map((item) => (
                      <button key={item} onClick={() => goTo('/login')} className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm font-bold hover:bg-slate-50">
                        {item}<ChevronRight className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => goTo('/signup')} className="hidden h-12 rounded-full bg-orange-600 px-6 text-sm font-black text-white shadow-lg shadow-orange-500/20 sm:block">S'inscrire</button>
          </div>
        </div>

        <div className="border-t border-slate-100 px-4 pb-3 lg:hidden">
          <form onSubmit={(event) => event.preventDefault()} className="mt-3 flex rounded-full border-2 border-orange-500 bg-white pl-3">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher sur Nexora" className="h-11 min-w-0 flex-1 bg-transparent text-sm font-bold outline-none" />
            <button className="grid h-11 w-12 place-items-center rounded-full bg-orange-600 text-white"><Search className="h-5 w-5" /></button>
          </form>
        </div>

        <nav className="border-t border-slate-100 px-4 lg:px-8">
          <div className="mx-auto flex max-w-[1800px] items-center gap-7 overflow-x-auto text-sm font-bold">
            {navLinks.map(([key, label]) => (
              <button key={key} onClick={() => key === 'categories' ? togglePanel('mega') : document.getElementById(key)?.scrollIntoView({ behavior: 'smooth' })} className="relative whitespace-nowrap py-4 hover:text-orange-600">
                {key === 'categories' && <Menu className="mr-2 inline h-4 w-4" />}{label}
              </button>
            ))}
          </div>
        </nav>

        {openPanel === 'mega' && (
          <div className="absolute left-4 right-4 top-full z-40 mx-auto max-w-[1800px] rounded-b-lg border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-950/20 lg:left-8 lg:right-8">
            <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
              <div className="max-h-[420px] overflow-y-auto border-r border-slate-100 pr-3">
                {categoryStats.map((department) => {
                  const Icon = department.icon;
                  return (
                    <button key={department.category} onClick={() => setActiveCategory(department.category)} className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-left font-bold ${activeCategory === department.category ? 'bg-slate-100 text-orange-600' : 'hover:bg-slate-50'}`}>
                      <span className="flex items-center gap-3"><Icon className="h-6 w-6" />{department.name}</span>
                      <span className="text-xs text-slate-500">{department.count}</span>
                    </button>
                  );
                })}
              </div>
              <div>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-2xl font-black">Categories pour vous</h3>
                  <button onClick={() => setOpenPanel('')} className="rounded-full p-2 hover:bg-slate-100" aria-label="Fermer"><X className="h-5 w-5" /></button>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
                  {(activeCategoryProducts.length ? activeCategoryProducts : visibleProducts.slice(0, 6)).map((product) => (
                    <button key={product.id} onClick={() => { setQuery(product.name); setOpenPanel(''); }} className="text-center">
                      <img src={product.imageUrl || imageForCategory(product.category)} alt="" className="mx-auto h-28 w-28 rounded-full bg-slate-100 object-cover" />
                      <span className="mt-2 block text-sm font-bold">{product.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <section className="bg-white">
        <div className="mx-auto max-w-[1800px] px-4 py-8 lg:px-8">
          <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-2xl font-black sm:text-3xl">Bienvenue sur Nexora</h1>
            <div className="flex flex-wrap items-center gap-4">
              {quickActions.map(([label, Icon, action]) => (
                <button key={label} onClick={action} className="inline-flex items-center gap-2 text-base font-black hover:text-orange-600">
                  <Icon className="h-7 w-7" />{label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-[450px_1fr_570px]">
            <div className="max-h-[456px] overflow-y-auto rounded-lg bg-[#f7f7f7] p-4">
              {categoryStats.slice(0, 8).map((department) => {
                const Icon = department.icon;
                return (
                  <button key={department.category} onClick={() => setActiveCategory(department.category)} className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-lg font-black hover:bg-white">
                    <span className="flex items-center gap-3"><Icon className="h-7 w-7" />{department.name}</span>
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </button>
                );
              })}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {visibleProducts.slice(0, 2).map((product) => (
                <article key={product.id} className="rounded-lg bg-[#f7f7f7] p-6">
                  <p className="text-2xl font-black">Recherches...</p>
                  <p className="mt-1 text-lg font-black">{normalizeCategory(product.category)}</p>
                  <img src={product.imageUrl || imageForCategory(product.category)} alt="" className="mt-5 h-72 w-full rounded-lg bg-white object-cover" />
                </article>
              ))}
            </div>

            <div className="overflow-hidden rounded-lg bg-sky-200">
              <div className="grid h-full min-h-[456px] grid-cols-[0.8fr_1fr]">
                <div className="bg-sky-100 p-7 text-blue-950">
                  <p className="text-3xl font-black leading-tight">Decouvrez de nouveaux fabricants</p>
                  <div className="mt-8 grid grid-cols-3 gap-3 text-sm font-bold">
                    <span><b className="block text-2xl">34k</b>Fournisseurs</span>
                    <span><b className="block text-2xl">5000</b>Secteurs</span>
                    <span><b className="block text-2xl">78</b>Services</span>
                  </div>
                  <button onClick={() => document.getElementById('verified')?.scrollIntoView({ behavior: 'smooth' })} className="mt-8 rounded-full bg-blue-950 px-6 py-3 text-sm font-black text-white">Aller decouvrir</button>
                </div>
                <div className="relative bg-gradient-to-br from-sky-200 to-blue-900 p-6 text-white">
                  <img src={categoryImages.Machinery} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
                  <div className="relative flex h-full flex-col justify-end">
                    <p className="text-2xl font-black">Recherche d'usines</p>
                    <p className="mt-2 text-sm font-bold">Meilleurs fournisseurs, echantillons et personnalisation rapide.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {frequentSearches.slice(0, 10).map((term) => (
              <button key={term} onClick={() => setQuery(term)} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold hover:bg-orange-100 hover:text-orange-700">{term}</button>
            ))}
          </div>
        </div>
      </section>

      <section id="recommended-products" className="mx-auto max-w-[1800px] px-4 py-9 lg:px-8">
        <div className="mb-5 flex items-center justify-center gap-4">
          <span className="h-px w-24 bg-slate-300" />
          <h2 className="text-xl font-black text-slate-500">Recommande pour votre entreprise</h2>
          <span className="h-px w-24 bg-slate-300" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5">
          {visibleProducts.slice(0, 15).map((product) => (
            <article key={product.id} className="group rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-100 transition hover:shadow-xl">
              <div className="relative">
                <img src={product.imageUrl || imageForCategory(product.category)} alt="" className="h-64 w-full rounded-lg bg-slate-100 object-cover" />
                <button onClick={() => setLensOpen(true)} className="absolute bottom-3 left-3 grid h-10 w-10 place-items-center rounded-full bg-white shadow-lg" aria-label="Recherche image"><ImageIcon className="h-5 w-5" /></button>
              </div>
              <h3 className="mt-3 line-clamp-2 min-h-[48px] text-base font-bold leading-6">{product.name}</h3>
              <p className="mt-2 text-2xl font-black">{currency(product.wholesalePrice || product.price)}</p>
              <p className="text-sm font-semibold text-slate-600">MOQ: {product.moq || 1} pieces · {product.stock || 0} disponibles</p>
              <p className="mt-1 text-sm font-bold text-blue-600"><BadgeCheck className="mr-1 inline h-4 w-4" />Verified · {product.origin || product.city}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button onClick={() => addPublicProduct(product)} className="h-10 rounded-full bg-orange-600 text-sm font-black text-white">Ajouter</button>
                <button onClick={() => setRfqOpen(true)} className="h-10 rounded-full border border-slate-300 text-sm font-black">Devis</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="assurance" className="mx-auto max-w-[1800px] px-4 py-8 lg:px-8">
        <div className="grid overflow-hidden rounded-lg bg-[#762f32] text-white lg:grid-cols-[0.85fr_1.3fr]">
          <div className="bg-black/10 p-8">
            <p className="text-3xl font-black"><span className="text-orange-400">Nexora</span> Guaranteed</p>
            {['Commandes et paiements rapides', 'Livraison dans les delais', 'Garantie de remboursement'].map((item) => (
              <p key={item} className="mt-4 text-xl font-black"><CheckCircle2 className="mr-2 inline h-5 w-5" />{item}</p>
            ))}
            <button onClick={() => document.getElementById('buyer')?.scrollIntoView({ behavior: 'smooth' })} className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-black text-slate-950">Decouvrir maintenant</button>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-4">
            {flashProducts.slice(0, 4).map((product) => (
              <article key={product.id} className="rounded-lg bg-white p-3 text-slate-950">
                <img src={product.imageUrl || imageForCategory(product.category)} alt="" className="h-36 w-full rounded-md object-cover" />
                <p className="mt-2 text-xl font-black">{currency(product.price)}</p>
                <p className="text-sm font-bold text-emerald-700">Livraison protegee</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1800px] px-4 py-8 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-white">
          <div className="flex items-center justify-between bg-orange-600 px-5 py-4 text-white">
            <h2 className="text-2xl font-black">Flash sales et top ventes</h2>
            <p className="text-sm font-black">Fin dans 02:18:40</p>
          </div>
          <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
            {flashProducts.map((product) => (
              <article key={product.id} className="rounded-lg border border-slate-100 p-3">
                <img src={product.imageUrl || imageForCategory(product.category)} alt="" className="h-44 w-full rounded-lg object-cover" />
                <h3 className="mt-3 line-clamp-2 min-h-[44px] font-bold">{product.name}</h3>
                <p className="mt-2 text-xl font-black text-orange-700">{currency(product.price)}</p>
                <p className="text-sm font-semibold text-slate-500">Top classement · Stock {product.stock || 0}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="verified" className="bg-white px-4 py-10 lg:px-8">
        <div className="mx-auto grid max-w-[1800px] gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-700">Fabricants Verified</p>
            <h2 className="mt-2 text-4xl font-black">Votre acces a des fournisseurs agrees</h2>
            <div className="mt-6 grid overflow-hidden rounded-lg text-white md:grid-cols-3">
              {['Recherche d usines', 'Meilleurs fournisseurs', 'Echantillon d usine'].map((title, index) => (
                <article key={title} className="relative min-h-[260px] p-6">
                  <img src={[categoryImages.Machinery, categoryImages.Construction, categoryImages.Logistique][index]} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 to-blue-950/15" />
                  <div className="relative flex h-full flex-col justify-end">
                    <p className="text-2xl font-black">{title}</p>
                    <button onClick={() => setRfqOpen(true)} className="mt-4 grid h-12 w-12 place-items-center rounded-full bg-white text-slate-950"><ArrowRight className="h-5 w-5" /></button>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <aside className="rounded-lg bg-[#f3f3f3] p-6">
            <h3 className="text-2xl font-black">Autres selections en vedette</h3>
            {['Centre de dropshipping', 'Centre d echantillons', 'Personnalisation rapide', 'Salons', 'Vendeurs verifies', 'Partenariats'].map((item) => (
              <button key={item} onClick={() => setRfqOpen(true)} className="block w-full rounded-md px-2 py-3 text-left text-lg font-semibold hover:bg-white">{item}</button>
            ))}
          </aside>
        </div>
      </section>

      <section id="buyer" className="mx-auto max-w-[1800px] px-4 py-10 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-lg bg-white p-8">
            <p className="text-xl font-black"><ShieldCheck className="mr-2 inline h-7 w-7 text-amber-500" />Trade Assurance</p>
            <h2 className="mt-8 text-4xl font-black leading-tight">Profitez d'une protection du paiement a la livraison</h2>
            <button onClick={() => setRfqOpen(true)} className="mt-8 rounded-full bg-orange-600 px-8 py-3 text-sm font-black text-white">En savoir plus</button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              ['Paiements surs et faciles', ShieldCheck],
              ['Politique de remboursement', Banknote],
              ['Services expedition et logistique', Truck],
              ['Protections apres-vente', PackageCheck],
            ].map(([title, Icon]) => (
              <button key={title} onClick={() => setOpenPanel('help')} className="flex items-center justify-between rounded-lg bg-white p-8 text-left text-xl font-black">
                <span className="flex items-center gap-5"><span className="grid h-20 w-20 place-items-center rounded-full bg-amber-100"><Icon className="h-9 w-9" /></span>{title}</span>
                <ArrowRight className="h-7 w-7" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="tax" className="bg-white px-4 py-12 lg:px-8">
        <div className="mx-auto grid max-w-[1800px] gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <h2 className="text-4xl font-black">Programme d'exoneration fiscale Nexora</h2>
            <p className="mt-4 text-lg font-semibold">Faites une seule demande pour profiter d'exoneration et de remboursement de TVA.</p>
            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {['Inscription facile', 'Achats exoneres', 'Remboursement facile'].map((item) => (
                <article key={item} className="rounded-lg bg-orange-50 p-5">
                  <ReceiptText className="h-9 w-9 text-orange-700" />
                  <p className="mt-4 text-xl font-black text-orange-700">{item}</p>
                  <p className="mt-2 text-sm font-semibold">Documents, verification, taxes eligibles et suivi du remboursement.</p>
                </article>
              ))}
            </div>
          </div>
          <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80" alt="" className="h-full min-h-[330px] w-full rounded-lg object-cover" />
        </div>
      </section>

      <section id="work" className="mx-auto grid max-w-[1800px] gap-8 px-4 py-12 lg:grid-cols-[1fr_0.8fr] lg:px-8">
        <div className="rounded-lg bg-white p-8">
          <p className="text-3xl font-black">Nexora Work</p>
          <h2 className="mt-4 text-5xl font-black leading-tight">Votre equipe commerciale d'IA 7j/7, 24h/24</h2>
          <p className="mt-5 text-xl font-semibold">De la conception au sourcing, laissez l'assistant Nexora preparer vos demandes et comparer les offres.</p>
          <button onClick={() => dispatch(uiActions.setAssistantOpen(true))} className="mt-8 rounded-full bg-emerald-600 px-8 py-3 text-sm font-black text-white">Ouvrir l'assistant IA</button>
        </div>
        <div className="rounded-lg bg-emerald-100 p-8">
          <div className="rounded-lg bg-white p-5 shadow-xl">
            <div className="grid gap-3 sm:grid-cols-3">
              {['Sourcing agent', 'Qualite', 'Logistique'].map((item) => (
                <div key={item} className="rounded-lg border border-slate-100 p-4 text-center">
                  <UserCheck className="mx-auto h-8 w-8 text-emerald-600" />
                  <p className="mt-2 text-sm font-black">{item}</p>
                  <button onClick={() => dispatch(uiActions.setAssistantOpen(true))} className="mt-3 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Chat</button>
                </div>
              ))}
            </div>
            <p className="mt-5 rounded-lg bg-emerald-600 p-4 text-sm font-bold text-white">Trouver des fournisseurs LED strips · MOQ 500pcs · prix cible 0.12 USD/pc</p>
          </div>
        </div>
      </section>

      <section id="app" className="bg-white px-4 py-12 lg:px-8">
        <div className="mx-auto grid max-w-[1800px] gap-8 lg:grid-cols-2">
          <div className="border-r border-slate-200 pr-0 lg:pr-10">
            <h2 className="text-3xl font-black">Telechargez l'application Nexora</h2>
            <p className="mt-4 text-lg font-semibold">Trouvez des produits, communiquez avec fournisseurs, gerez et payez vos commandes depuis mobile.</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className="rounded-lg bg-black px-5 py-3 text-sm font-black text-white">App Store</span>
              <span className="rounded-lg bg-black px-5 py-3 text-sm font-black text-white">Google Play</span>
              <span className="grid h-32 w-32 place-items-center rounded-lg border border-slate-300 text-center text-xs font-black">QR CODE</span>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black">Decouvrez Nexora Lens</h2>
            <p className="mt-4 text-lg font-semibold">Utilisez la recherche d'images pour trouver et comparer des produits similaires avec prix de gros.</p>
            <button onClick={() => setLensOpen(true)} className="mt-6 rounded-full bg-orange-600 px-8 py-3 text-sm font-black text-white">Ajouter a l'extension</button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1800px] px-4 py-10 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-lg bg-emerald-700 p-8 text-white">
            <p className="text-sm font-black uppercase tracking-[0.2em]">Mode annonces locales</p>
            <h2 className="mt-3 text-4xl font-black">Vendez comme sur une plateforme de petites annonces.</h2>
            <p className="mt-4 text-lg font-semibold">Publier une annonce, choisir la region, negocier par message, booster la visibilite et suivre les demandes.</p>
            <button onClick={() => setClassifiedOpen(true)} className="mt-7 rounded-full bg-white px-8 py-3 text-sm font-black text-emerald-800">Publier une annonce</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categoryStats.slice(0, 8).map((item) => (
              <button key={item.category} onClick={() => { setActiveCategory(item.category); document.getElementById('recommended-products')?.scrollIntoView({ behavior: 'smooth' }); }} className="rounded-lg bg-white p-5 text-left shadow-sm ring-1 ring-slate-100 hover:shadow-lg">
                <item.icon className="h-8 w-8 text-emerald-700" />
                <p className="mt-4 text-lg font-black">{item.name}</p>
                <p className="text-sm font-bold text-slate-500">{item.count} annonces</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-white px-4 py-12 lg:px-8">
        <div className="mx-auto max-w-[1800px] border-t border-slate-200 pt-10">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
            {footerGroups.map(([title, links]) => (
              <div key={title}>
                <p className="text-lg font-black">{title}</p>
                <div className="mt-4 space-y-3">
                  {links.map((link) => <button key={link} onClick={() => setOpenPanel('help')} className="block text-left text-sm font-semibold text-slate-700 hover:text-orange-600">{link}</button>)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-2">
            {paymentBadges.map((item) => <span key={item} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-black text-slate-700">{item}</span>)}
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
              {['Nexora Express', 'Nexora Wholesale', 'Nexora Pay', 'Nexora Logistics', 'Nexora Cloud', 'Nexora Lens'].map((item) => <span key={item}>{item}</span>)}
            </div>
            <div className="flex flex-wrap gap-2">
              {['Facebook', 'LinkedIn', 'X', 'Instagram', 'YouTube', 'TikTok'].map((item) => <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black">{item}</span>)}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-slate-500">
            {['Politiques et reglementations', 'Mentions legales', 'Regles de mise en vente', 'Droits de propriete intellectuelle', 'Politique de confidentialite', 'Conditions d utilisation', 'Respect de l integrite'].map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </footer>

      <div className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl lg:block">
        <button onClick={() => dispatch(uiActions.setAssistantOpen(true))} className="grid h-16 w-16 place-items-center border-b border-slate-100 hover:bg-slate-50" aria-label="Assistant"><MessageCircle className="h-7 w-7" /></button>
        <button onClick={() => setLensOpen(true)} className="grid h-16 w-16 place-items-center border-b border-slate-100 text-orange-600 hover:bg-slate-50" aria-label="Lens"><ImageIcon className="h-7 w-7" /></button>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="grid h-16 w-16 place-items-center hover:bg-slate-50" aria-label="Retour en haut"><ArrowRight className="h-7 w-7 -rotate-90" /></button>
      </div>

      {openPanel === 'help' && (
        <div className="fixed inset-0 z-[90] bg-slate-950/40 p-4" onClick={() => setOpenPanel('')}>
          <div className="mx-auto mt-24 max-w-2xl rounded-lg bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black">Centre d'assistance Nexora</h3>
              <button onClick={() => setOpenPanel('')} className="rounded-full p-2 hover:bg-slate-100" aria-label="Fermer"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {['Discussion en direct', 'Verifier le statut de commande', 'Remboursements', 'Signaler un abus', 'Ouvrir un litige', 'Suivi de production'].map((item) => (
                <button key={item} onClick={() => goTo('/login')} className="rounded-lg border border-slate-200 p-4 text-left font-black hover:border-orange-300 hover:bg-orange-50">{item}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {(rfqOpen || classifiedOpen || lensOpen) && (
        <div className="fixed inset-0 z-[95] overflow-y-auto bg-slate-950/55 p-4">
          <div className="mx-auto my-10 max-w-2xl rounded-lg bg-white p-6 text-slate-950 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black">{rfqOpen ? 'Demander un devis' : classifiedOpen ? 'Publier une annonce' : 'Recherche image Nexora Lens'}</h3>
              <button onClick={() => { setRfqOpen(false); setClassifiedOpen(false); setLensOpen(false); }} className="rounded-full p-2 hover:bg-slate-100" aria-label="Fermer"><X className="h-5 w-5" /></button>
            </div>

            {rfqOpen && (
              <form onSubmit={(event) => submitPublicForm(event, 'nexora_public_rfqs', 'Demande de devis')} className="mt-5 grid gap-4 sm:grid-cols-2">
                <input name="title" required placeholder="Produit ou service recherche" className="h-12 rounded-md border border-slate-300 px-3 font-semibold outline-none sm:col-span-2" />
                <select name="category" className="h-12 rounded-md border border-slate-300 px-3 font-semibold outline-none">{categoryDepartments.map((item) => <option key={item.category}>{item.name}</option>)}</select>
                <input name="quantity" type="number" min="1" required placeholder="Quantite" className="h-12 rounded-md border border-slate-300 px-3 font-semibold outline-none" />
                <input name="targetPrice" type="number" min="0" step="0.01" placeholder="Prix cible" className="h-12 rounded-md border border-slate-300 px-3 font-semibold outline-none" />
                <input name="deliveryCity" placeholder="Ville de livraison" className="h-12 rounded-md border border-slate-300 px-3 font-semibold outline-none" />
                <textarea name="details" required placeholder="Specifications, delai, certification, emballage ou personnalisation" className="min-h-32 rounded-md border border-slate-300 px-3 py-3 font-semibold outline-none sm:col-span-2" />
                <button className="h-12 rounded-full bg-orange-600 text-sm font-black text-white sm:col-span-2">Envoyer la demande</button>
              </form>
            )}

            {classifiedOpen && (
              <form onSubmit={(event) => submitPublicForm(event, 'nexora_public_ads', 'Annonce')} className="mt-5 grid gap-4 sm:grid-cols-2">
                <input name="title" required placeholder="Titre de l'annonce" className="h-12 rounded-md border border-slate-300 px-3 font-semibold outline-none sm:col-span-2" />
                <select name="category" className="h-12 rounded-md border border-slate-300 px-3 font-semibold outline-none">{categoryDepartments.map((item) => <option key={item.category}>{item.name}</option>)}</select>
                <input name="price" type="number" min="0" step="0.01" placeholder="Prix" className="h-12 rounded-md border border-slate-300 px-3 font-semibold outline-none" />
                <input name="city" placeholder="Ville ou region" className="h-12 rounded-md border border-slate-300 px-3 font-semibold outline-none" />
                <input name="phone" placeholder="Telephone de contact" className="h-12 rounded-md border border-slate-300 px-3 font-semibold outline-none" />
                <textarea name="description" required placeholder="Description de l'annonce" className="min-h-32 rounded-md border border-slate-300 px-3 py-3 font-semibold outline-none sm:col-span-2" />
                <button className="h-12 rounded-full bg-emerald-700 text-sm font-black text-white sm:col-span-2">Publier l'annonce</button>
              </form>
            )}

            {lensOpen && (
              <form onSubmit={(event) => submitPublicForm(event, 'nexora_public_lens', 'Recherche image')} className="mt-5 space-y-4">
                <label className="grid min-h-52 cursor-pointer place-items-center rounded-lg border-2 border-dashed border-slate-300 p-6 text-center font-black hover:border-orange-400">
                  <input type="file" name="image" accept="image/*" className="sr-only" />
                  <span><ImageIcon className="mx-auto mb-3 h-10 w-10 text-orange-600" />Importer une image produit</span>
                </label>
                <textarea name="details" placeholder="Ajoutez les details que vous voulez comparer" className="min-h-28 w-full rounded-md border border-slate-300 px-3 py-3 font-semibold outline-none" />
                <button className="h-12 w-full rounded-full bg-orange-600 text-sm font-black text-white">Lancer la recherche</button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default function Home() {
  const dispatch = useDispatch();
  const [state, setState] = useState(() => normalizeState(emptyPlatformState));
  const [active, setActive] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [cart, setCart] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState('landing');
  const [authToken, setAuthToken] = useState('');
  const [marketMode, setMarketMode] = useState('products');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedSupplierId, setSelectedSupplierId] = useState('');

  useEffect(() => {
    async function boot() {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      const savedAuth = window.localStorage.getItem(AUTH_KEY);
      try {
        const response = await fetch('/api/platform/bootstrap');
        const payload = await response.json();
        const backendState = payload.success ? payload.data : emptyPlatformState;
        const localState = saved ? JSON.parse(saved) : {};
        const normalized = normalizeState({ ...backendState, ...localState });
        setState(normalized);
        if (savedAuth) {
          const session = JSON.parse(savedAuth);
          if (session?.userId && normalized.users.some((user) => user.id === session.userId)) {
            setIsAuthenticated(true);
            setAuthToken(session.token || '');
            setAuthView('app');
            dispatch(sessionActions.setSession({ userId: session.userId, token: session.token || '', role: normalized.users.find((user) => user.id === session.userId)?.role || 'UTILISATEUR' }));
            setState((previous) => ({ ...previous, currentUserId: session.userId }));
          }
        }
      } catch {
        setState(normalizeState(emptyPlatformState));
      }
    }
    boot();
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (isAuthenticated) {
      window.localStorage.setItem(AUTH_KEY, JSON.stringify({ userId: state.currentUserId, token: authToken, loggedAt: new Date().toISOString() }));
    }
  }, [authToken, isAuthenticated, state.currentUserId]);

  const currentUser = state.users.find((user) => user.id === state.currentUserId) || state.users[0] || anonymousUser;
  const isNationalScope = ['SUPER_ADMIN', 'ADMIN_NATIONAL', 'FINANCE'].includes(currentUser.role);
  const canSeeCity = (city) => isNationalScope || currentUser.city === city;
  const scopedProducts = state.products.filter((product) => canSeeCity(product.city));
  const scopedOrders = state.orders.filter((order) => canSeeCity(order.city));
  const scopedUsers = state.users.filter((user) => canSeeCity(user.city));

  const stats = useMemo(() => {
    const escrow = state.transactions.filter((item) => item.status === 'ESCROW_HOLD').reduce((sum, item) => sum + item.amount, 0);
    const revenue = state.transactions.filter((item) => item.status === 'RELEASED').reduce((sum, item) => sum + item.commission, 0);
    const openOps = state.orders.filter((item) => item.status !== 'DELIVERED').length
      + state.rides.filter((item) => item.status !== 'COMPLETED').length
      + state.deliveries.filter((item) => item.status !== 'DELIVERED').length
      + state.cloudRequests.filter((item) => item.status !== 'DELIVERED').length;

    return {
      users: state.users.length,
      sellers: state.users.filter((item) => item.role === 'VENDEUR').length,
      suppliers: state.users.filter((item) => item.role === 'FOURNISSEUR').length,
      products: state.products.length,
      escrow,
      revenue,
      openOps,
      kycPending: state.kyc.filter((item) => item.status === 'PENDING').length,
      messages: state.messages.filter((item) => item.status === 'OPEN').length,
      rfqs: (state.rfqs || []).filter((item) => item.status === 'OPEN').length,
      disputes: (state.disputes || []).filter((item) => item.status !== 'RESOLVED').length,
    };
  }, [state]);

  const filteredProducts = state.products.filter((product) => {
    const search = `${product.name} ${product.category} ${product.subcategory} ${product.city} ${product.origin}`.toLowerCase();
    return product.status === 'APPROVED'
      && canSeeCity(product.city)
      && search.includes(query.toLowerCase())
      && (categoryFilter === 'ALL' || normalizeCategory(product.category) === categoryFilter)
      && (cityFilter === 'ALL' || product.city === cityFilter);
  });

  const scopedRfqs = (state.rfqs || []).filter((rfq) => canSeeCity(rfq.city));
  const scopedQuotes = (state.quotes || []).filter((quote) => scopedRfqs.some((rfq) => rfq.id === quote.rfqId));
  const scopedDisputes = (state.disputes || []).filter((dispute) => canSeeCity(dispute.city));
  const supplierUsers = state.users.filter((user) => ['VENDEUR', 'FOURNISSEUR'].includes(user.role) && canSeeCity(user.city));
  const featuredProducts = filteredProducts.filter((product) => product.sponsored || product.tradeAssurance).slice(0, 6);
  const selectedProduct = state.products.find((product) => product.id === selectedProductId);
  const selectedSupplier = state.users.find((user) => user.id === selectedSupplierId);

  function patch(partial) {
    setState((previous) => ({ ...previous, ...partial }));
  }

  function notify(text, type = 'SYSTEM') {
    patch({
      notifications: [{ id: uid('n'), type, text, read: false }, ...state.notifications],
    });
  }

  function audit(action, entity, entityId, detail, city = currentUser.city) {
    return {
      id: uid('a'),
      actorId: currentUser.id,
      action,
      entity,
      entityId,
      city,
      detail,
      createdAt: new Date().toISOString(),
    };
  }

  function startSession(userId, token = authToken) {
    patch({ currentUserId: userId });
    setAuthToken(token || '');
    setIsAuthenticated(true);
    setAuthView('app');
    dispatch(sessionActions.setSession({ userId, token: token || '', role: state.users.find((user) => user.id === userId)?.role || 'UTILISATEUR' }));
    window.localStorage.setItem(AUTH_KEY, JSON.stringify({ userId, token: token || '', loggedAt: new Date().toISOString() }));
  }

  async function loginUser(formData) {
    const identifier = String(formData.get('identifier') || '').toLowerCase().trim();
    const password = String(formData.get('password') || '');
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    const payload = await response.json();
    if (payload.success && payload.user) {
      const exists = state.users.some((item) => item.id === payload.user.id);
      patch({ users: exists ? state.users.map((item) => item.id === payload.user.id ? { ...item, ...payload.user } : item) : [payload.user, ...state.users] });
      startSession(payload.user.id, payload.token);
      return;
    }
    notify(payload.error || 'Identifiants incorrects.', 'AUTH');
  }

  async function signupUser(formData) {
    const role = formData.get('role') || 'ACHETEUR';
    const user = {
      id: uid('u'),
      name: formData.get('name'),
      role,
      phone: formData.get('phone'),
      email: formData.get('email'),
      city: formData.get('city'),
      kycStatus: ['VENDEUR', 'FOURNISSEUR'].includes(role) ? 'PENDING' : 'VERIFIED',
      walletBalance: 0,
      status: ['VENDEUR', 'FOURNISSEUR'].includes(role) ? 'PENDING_VERIFICATION' : 'ACTIVE',
      sellerStatus: ['VENDEUR', 'FOURNISSEUR'].includes(role) ? 'PENDING' : '',
      supplierLevel: role === 'FOURNISSEUR' ? 'STANDARD' : '',
      availableBalance: 0,
      blockedBalance: 0,
      avatarUrl: '',
      companyName: formData.get('companyName') || '',
      address: formData.get('address') || '',
      active: true,
    };
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...user, password: formData.get('password') }),
    });
    const payload = await response.json();
    if (payload.success && payload.user) {
      patch({ users: [payload.user, ...state.users] });
      startSession(payload.user.id, payload.token);
      return;
    }
    notify(payload.error || 'Inscription impossible.', 'AUTH');
  }

  function logoutUser() {
    window.localStorage.removeItem(AUTH_KEY);
    setAuthToken('');
    setIsAuthenticated(false);
    setAuthView('landing');
    dispatch(sessionActions.clearSession());
    setMobileOpen(false);
  }

  async function updateProfile(formData) {
    const updated = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      city: formData.get('city'),
      companyName: formData.get('companyName'),
      address: formData.get('address'),
    };
    if (authToken) {
      try {
        const response = await fetch('/api/me', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
          body: JSON.stringify(updated),
        });
        const payload = await response.json();
        if (payload.success && payload.user) {
          patch({ users: state.users.map((user) => user.id === currentUser.id ? { ...user, ...payload.user } : user) });
          notify('Profil synchronise avec le backend.', 'PROFILE');
          return;
        }
      } catch {
        // Local storage fallback when MongoDB is not configured.
      }
    }
    patch({
      users: state.users.map((user) => user.id === currentUser.id ? { ...user, ...updated } : user),
      auditLogs: [audit('UPDATE_PROFILE', 'users', currentUser.id, `Profil mis a jour : ${updated.name}`, updated.city), ...state.auditLogs],
    });
    notify('Profil mis a jour.', 'PROFILE');
  }

  function uploadAvatar(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      let avatarUrl = String(reader.result || '');
      if (authToken) {
        try {
          const response = await fetch('/api/uploads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
            body: JSON.stringify({
              fileName: file.name,
              mimeType: file.type,
              size: file.size,
              purpose: 'avatar',
              fileBase64: avatarUrl,
            }),
          });
          const payload = await response.json();
          if (payload.success && payload.upload?.url) {
            avatarUrl = payload.upload.url;
          }
        } catch {
          // Local storage fallback when MongoDB is not configured.
        }
      }
      patch({
        users: state.users.map((user) => user.id === currentUser.id ? { ...user, avatarUrl } : user),
      });
      notify('Photo de profil ajoutee.', 'PROFILE');
    };
    reader.readAsDataURL(file);
  }

  function addUser(formData) {
    const user = {
      id: uid('u'),
      name: formData.get('name'),
      role: formData.get('role'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      city: formData.get('city'),
      kycStatus: 'PENDING',
      walletBalance: 0,
      status: 'PENDING_VERIFICATION',
      availableBalance: 0,
      blockedBalance: 0,
      active: true,
    };
    patch({
      users: [user, ...state.users],
      auditLogs: [audit('CREATE_USER', 'users', user.id, `Compte créé pour ${user.name}`, user.city), ...state.auditLogs],
    });
    notify(`${user.name} créé avec le rôle ${user.role}.`, 'USER');
  }

  function addProduct(formData) {
    const product = {
      id: uid('p'),
      sellerId: currentUser.id,
      shopId: formData.get('shopId') || state.shops.find((shop) => shop.sellerId === currentUser.id)?.id || '',
      name: formData.get('name'),
      sku: formData.get('sku') || `SKU-${Date.now()}`,
      category: formData.get('category'),
      subcategory: formData.get('subcategory') || '',
      condition: formData.get('condition') || 'Neuf',
      city: formData.get('city'),
      pickupAddress: formData.get('pickupAddress') || '',
      price: Number(formData.get('price')),
      promoPrice: Number(formData.get('promoPrice') || 0),
      stock: Number(formData.get('stock')),
      sponsored: formData.get('sponsored') === 'on',
      rating: 0,
      status: 'PENDING_APPROVAL',
      rejectionReason: '',
      commissionRate: Number(formData.get('commissionRate') || 8),
      moq: Number(formData.get('moq') || 1),
      wholesalePrice: Number(formData.get('wholesalePrice') || formData.get('price')),
      leadTime: formData.get('leadTime') || '48h',
      b2bEnabled: formData.get('b2bEnabled') !== 'off',
      origin: formData.get('origin') || 'RDC',
      certifications: String(formData.get('certifications') || '').split(',').map((item) => item.trim()).filter(Boolean),
      imageUrl: formData.get('imageUrl') || imageForCategory(formData.get('category')),
      minOrderValue: Number(formData.get('minOrderValue') || formData.get('price')),
      tradeAssurance: true,
    };
    patch({
      products: [product, ...state.products],
      auditLogs: [audit('SUBMIT_PRODUCT', 'products', product.id, `Produit soumis : ${product.name}`, product.city), ...state.auditLogs],
    });
    notify(`Produit publié : ${product.name}.`, 'MARKET');
  }

  function createShop(formData) {
    const shop = {
      id: uid('shop'),
      sellerId: currentUser.id,
      name: formData.get('name'),
      slug: String(formData.get('name')).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: formData.get('description'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      city: formData.get('city'),
      openingHours: formData.get('openingHours') || '08:00 - 18:00',
      rating: 0,
      status: 'PENDING_APPROVAL',
    };
    patch({
      shops: [shop, ...state.shops],
      auditLogs: [audit('CREATE_SHOP', 'shops', shop.id, `Boutique créée : ${shop.name}`, shop.city), ...state.auditLogs],
    });
    notify(`Boutique soumise à validation : ${shop.name}.`, 'MARKET');
  }

  function moderateProduct(productId, status, reason = '') {
    const product = state.products.find((item) => item.id === productId);
    patch({
      products: state.products.map((item) => item.id === productId ? { ...item, status, rejectionReason: reason } : item),
      auditLogs: [audit(status === 'APPROVED' ? 'APPROVE_PRODUCT' : 'REJECT_PRODUCT', 'products', productId, `${status} : ${product?.name || productId}`, product?.city), ...state.auditLogs],
    });
    notify(`Produit ${status.toLowerCase()} : ${product?.name || productId}.`, 'MARKET');
  }

  function requestWithdrawal(formData) {
    const withdrawal = {
      id: uid('w'),
      sellerId: currentUser.id,
      amount: Number(formData.get('amount')),
      method: formData.get('method'),
      destination: formData.get('destination'),
      status: 'PENDING',
      requestedAt: new Date().toISOString(),
    };
    patch({
      withdrawals: [withdrawal, ...state.withdrawals],
      auditLogs: [audit('REQUEST_WITHDRAWAL', 'withdrawals', withdrawal.id, `Retrait demandé : ${currency(withdrawal.amount)}`, currentUser.city), ...state.auditLogs],
    });
    notify(`Demande de retrait envoyée : ${currency(withdrawal.amount)}.`, 'FINANCE');
  }

  function moderateWithdrawal(withdrawalId, status) {
    const withdrawal = state.withdrawals.find((item) => item.id === withdrawalId);
    patch({
      withdrawals: state.withdrawals.map((item) => item.id === withdrawalId ? { ...item, status } : item),
      auditLogs: [audit(status === 'PAID' ? 'PAY_WITHDRAWAL' : 'REJECT_WITHDRAWAL', 'withdrawals', withdrawalId, `${status} : ${currency(withdrawal?.amount)}`, currentUser.city), ...state.auditLogs],
    });
    notify(`Retrait ${status.toLowerCase()} : ${currency(withdrawal?.amount)}.`, 'FINANCE');
  }

  function addToCart(product) {
    setCart((previous) => {
      const existing = previous.find((item) => item.productId === product.id);
      if (existing) {
        return previous.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [{ productId: product.id, name: product.name, quantity: 1, price: product.price, sellerId: product.sellerId }, ...previous];
    });
  }

  function createOrder() {
    if (!cart.length) return;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderNumber = `NX${new Date().getFullYear().toString().slice(2)}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(state.orders.length + 1).padStart(4, '0')}`;
    const order = {
      id: uid('o'),
      orderNumber,
      customerId: currentUser.id,
      sellerId: cart[0].sellerId,
      city: currentUser.city,
      items: cart,
      total,
      status: 'PAYMENT_PENDING',
      escrowStatus: 'PAYMENT_PENDING',
      paymentMethod: 'MOBILE_MONEY',
      createdAt: new Date().toISOString(),
    };
    const transaction = {
      id: uid('t'),
      module: 'MARKET',
      reference: orderNumber,
      amount: total,
      status: 'ESCROW_HOLD',
      payerId: currentUser.id,
      receiverId: cart[0].sellerId,
      commission: total * 0.08,
      createdAt: new Date().toISOString(),
    };
    patch({
      orders: [{ ...order, status: 'CONFIRMED', escrowStatus: 'ESCROW_HOLD' }, ...state.orders],
      transactions: [transaction, ...state.transactions],
      products: state.products.map((product) => {
        const item = cart.find((cartItem) => cartItem.productId === product.id);
        return item ? { ...product, stock: Math.max(0, product.stock - item.quantity) } : product;
      }),
    });
    setCart([]);
    notify(`Commande ${orderNumber} créée et fonds bloqués en escrow.`, 'ESCROW');
  }

  function createMarketOrders() {
    if (!cart.length) return;

    const grouped = cart.reduce((acc, item) => {
      acc[item.sellerId] = [...(acc[item.sellerId] || []), item];
      return acc;
    }, {});
    const createdOrders = [];
    const createdTransactions = [];
    const createdAudits = [];

    Object.entries(grouped).forEach(([sellerId, items], index) => {
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const commission = items.reduce((sum, item) => {
        const product = state.products.find((entry) => entry.id === item.productId);
        const rate = Number(product?.commissionRate || 8);
        return sum + (item.price * item.quantity * rate) / 100;
      }, 0);
      const orderNumber = `NX${new Date().getFullYear().toString().slice(2)}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(state.orders.length + index + 1).padStart(4, '0')}`;

      createdOrders.push({
        id: uid('o'),
        orderNumber,
        customerId: currentUser.id,
        sellerId,
        city: currentUser.city,
        items,
        total,
        status: 'CONFIRMED',
        escrowStatus: 'ESCROW_HOLD',
        paymentMethod: 'MANUAL_FINANCE',
        deliveryStatus: 'PENDING',
        commission,
        createdAt: new Date().toISOString(),
      });

      createdTransactions.push({
        id: uid('t'),
        module: 'MARKET',
        reference: orderNumber,
        amount: total,
        status: 'ESCROW_HOLD',
        payerId: currentUser.id,
        receiverId: sellerId,
        commission,
        createdAt: new Date().toISOString(),
      });

      createdAudits.push(audit('CREATE_ORDER_ESCROW', 'orders', orderNumber, `Commande ${orderNumber}, escrow ${currency(total)}`, currentUser.city));
    });

    patch({
      orders: [...createdOrders, ...state.orders],
      transactions: [...createdTransactions, ...state.transactions],
      products: state.products.map((product) => {
        const item = cart.find((cartItem) => cartItem.productId === product.id);
        return item ? { ...product, stock: Math.max(0, product.stock - item.quantity) } : product;
      }),
      users: state.users.map((user) => {
        const held = createdTransactions
          .filter((transaction) => transaction.receiverId === user.id)
          .reduce((sum, transaction) => sum + transaction.amount, 0);
        return held ? { ...user, blockedBalance: Number(user.blockedBalance || 0) + held } : user;
      }),
      auditLogs: [...createdAudits, ...state.auditLogs],
    });
    setCart([]);
    notify(`${createdOrders.length} commande(s) créée(s), paiement manuel validé et fonds bloqués en escrow.`, 'ESCROW');
  }

  function toggleFavorite(productId) {
    const existing = (state.favorites || []).find((item) => item.userId === currentUser.id && item.productId === productId);
    patch({
      favorites: existing
        ? state.favorites.filter((item) => item.id !== existing.id)
        : [{ id: uid('fav'), userId: currentUser.id, productId, createdAt: new Date().toISOString() }, ...(state.favorites || [])],
    });
  }

  function createRfq(formData) {
    const rfq = {
      id: uid('rfq'),
      buyerId: currentUser.id,
      title: formData.get('title'),
      category: formData.get('category'),
      city: formData.get('city'),
      quantity: Number(formData.get('quantity')),
      targetPrice: Number(formData.get('targetPrice') || 0),
      deliveryDeadline: formData.get('deliveryDeadline') || 'A negocier',
      notes: formData.get('notes') || '',
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };
    patch({
      rfqs: [rfq, ...(state.rfqs || [])],
      auditLogs: [audit('CREATE_RFQ', 'rfqs', rfq.id, `Demande devis : ${rfq.title}`, rfq.city), ...state.auditLogs],
    });
    notify(`Demande de devis ouverte : ${rfq.title}.`, 'RFQ');
  }

  function createRfqFromProduct(product) {
    const rfq = {
      id: uid('rfq'),
      buyerId: currentUser.id,
      title: `Demande prix gros : ${product.name}`,
      category: normalizeCategory(product.category),
      city: product.city,
      quantity: Math.max(10, Number(product.moq || 1)),
      targetPrice: Number(product.wholesalePrice || product.price || 0),
      deliveryDeadline: product.leadTime || 'A negocier',
      notes: `RFQ creee depuis la fiche ${product.sku || product.id}.`,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };
    patch({
      rfqs: [rfq, ...(state.rfqs || [])],
      auditLogs: [audit('CREATE_RFQ_FROM_PRODUCT', 'rfqs', rfq.id, rfq.title, rfq.city), ...state.auditLogs],
    });
    setActive('rfq');
    notify(`RFQ creee pour ${product.name}.`, 'RFQ');
  }

  function contactSupplierForProduct(product) {
    const supplier = state.users.find((user) => user.id === product.sellerId);
    const message = {
      id: uid('m'),
      channel: 'Acheteur - Fournisseur',
      from: currentUser.name,
      to: supplier?.name || product.sellerId,
      text: `Bonjour, je veux negocier ${product.name} en quantite. MOQ ${product.moq || 1}, prix de gros ${currency(product.wholesalePrice || product.price)}.`,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };
    patch({ messages: [message, ...state.messages] });
    setActive('messaging');
    notify(`Message envoye a ${supplier?.name || 'fournisseur'}.`, 'MESSAGE');
  }

  function sendQuote(formData) {
    const rfq = (state.rfqs || []).find((item) => item.id === formData.get('rfqId'));
    const quote = {
      id: uid('q'),
      rfqId: formData.get('rfqId'),
      supplierId: currentUser.id,
      unitPrice: Number(formData.get('unitPrice')),
      quantity: Number(formData.get('quantity')),
      leadTime: formData.get('leadTime'),
      paymentTerms: formData.get('paymentTerms') || 'Escrow Nexora',
      status: 'SENT',
      createdAt: new Date().toISOString(),
    };
    patch({
      quotes: [quote, ...(state.quotes || [])],
      auditLogs: [audit('SEND_QUOTE', 'quotes', quote.id, `Devis envoye pour ${rfq?.title || quote.rfqId}`, rfq?.city), ...state.auditLogs],
    });
    notify('Devis fournisseur envoye au client.', 'RFQ');
  }

  function acceptQuote(quote) {
    const rfq = (state.rfqs || []).find((item) => item.id === quote.rfqId);
    if (!rfq) return;
    const total = Number(quote.unitPrice || 0) * Number(quote.quantity || 0);
    const commission = total * 0.08;
    const orderNumber = `NX${new Date().getFullYear().toString().slice(2)}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(state.orders.length + 1).padStart(4, '0')}`;
    const order = {
      id: uid('o'),
      orderNumber,
      customerId: rfq.buyerId,
      sellerId: quote.supplierId,
      city: rfq.city,
      items: [{ productId: rfq.id, name: rfq.title, quantity: quote.quantity, price: quote.unitPrice }],
      total,
      status: 'CONFIRMED',
      escrowStatus: 'ESCROW_HOLD',
      paymentMethod: 'MANUAL_FINANCE',
      deliveryStatus: 'PENDING',
      commission,
      createdAt: new Date().toISOString(),
    };
    const transaction = {
      id: uid('t'),
      module: 'RFQ_MARKET',
      reference: orderNumber,
      amount: total,
      status: 'ESCROW_HOLD',
      payerId: rfq.buyerId,
      receiverId: quote.supplierId,
      commission,
      createdAt: new Date().toISOString(),
    };
    patch({
      orders: [order, ...state.orders],
      transactions: [transaction, ...state.transactions],
      rfqs: state.rfqs.map((item) => item.id === rfq.id ? { ...item, status: 'AWARDED' } : item),
      quotes: state.quotes.map((item) => item.id === quote.id ? { ...item, status: 'ACCEPTED' } : item),
      users: state.users.map((user) => user.id === quote.supplierId ? { ...user, blockedBalance: Number(user.blockedBalance || 0) + total } : user),
      auditLogs: [audit('ACCEPT_QUOTE_ESCROW', 'orders', orderNumber, `Devis accepte, escrow ${currency(total)}`, rfq.city), ...state.auditLogs],
    });
    notify(`Devis accepte : commande ${orderNumber} creee et fonds bloques.`, 'ESCROW');
  }

  function openDispute(formData) {
    const dispute = {
      id: uid('dispute'),
      reference: formData.get('reference'),
      openedById: currentUser.id,
      assignedToId: 'u-1',
      reason: formData.get('reason'),
      status: 'OPEN',
      resolution: '',
      city: formData.get('city') || currentUser.city,
      createdAt: new Date().toISOString(),
    };
    patch({
      disputes: [dispute, ...(state.disputes || [])],
      transactions: state.transactions.map((item) => item.reference === dispute.reference ? { ...item, status: 'DISPUTED' } : item),
      auditLogs: [audit('OPEN_DISPUTE', 'disputes', dispute.id, `Litige ouvert : ${dispute.reference}`, dispute.city), ...state.auditLogs],
    });
    notify(`Litige ouvert pour ${dispute.reference}.`, 'DISPUTE');
  }

  function resolveDispute(disputeId, resolution) {
    const dispute = (state.disputes || []).find((item) => item.id === disputeId);
    patch({
      disputes: state.disputes.map((item) => item.id === disputeId ? { ...item, status: 'RESOLVED', resolution } : item),
      auditLogs: [audit('RESOLVE_DISPUTE', 'disputes', disputeId, resolution, dispute?.city), ...state.auditLogs],
    });
    notify(`Litige resolu : ${dispute?.reference || disputeId}.`, 'DISPUTE');
  }

  function createRide(formData) {
    const city = formData.get('city');
    const fare = Number(formData.get('fare'));
    const driver = state.users.find((user) => user.role === 'CHAUFFEUR' && user.city === city) || state.users.find((user) => user.role === 'CHAUFFEUR');
    const ride = {
      id: uid('r'),
      customerId: currentUser.id,
      driverId: driver?.id || '',
      city,
      service: formData.get('service'),
      pickup: formData.get('pickup'),
      destination: formData.get('destination'),
      fare,
      status: driver ? 'DRIVER_ASSIGNED' : 'SEARCHING_DRIVER',
      paymentStatus: 'ESCROW_HOLD',
      rating: null,
      createdAt: new Date().toISOString(),
    };
    const transaction = {
      id: uid('t'),
      module: 'CAB',
      reference: ride.id,
      amount: fare,
      status: 'ESCROW_HOLD',
      payerId: currentUser.id,
      receiverId: driver?.id || '',
      commission: fare * 0.15,
      createdAt: new Date().toISOString(),
    };
    patch({ rides: [ride, ...state.rides], transactions: [transaction, ...state.transactions] });
    notify(`Course ${ride.service} créée à ${city}.`, 'CAB');
  }

  function createDelivery(formData) {
    const price = Number(formData.get('price'));
    const delivery = {
      id: uid('d'),
      customerId: currentUser.id,
      courierId: '',
      city: formData.get('city'),
      type: formData.get('type'),
      pickup: formData.get('pickup'),
      destination: formData.get('destination'),
      proof: 'PENDING',
      status: 'PICKUP_PENDING',
      price,
      createdAt: new Date().toISOString(),
    };
    const transaction = {
      id: uid('t'),
      module: 'LOGISTICS',
      reference: delivery.id,
      amount: price,
      status: 'ESCROW_HOLD',
      payerId: currentUser.id,
      receiverId: '',
      commission: price * 0.12,
      createdAt: new Date().toISOString(),
    };
    patch({ deliveries: [delivery, ...state.deliveries], transactions: [transaction, ...state.transactions] });
    notify(`Livraison créée : ${delivery.pickup} → ${delivery.destination}.`, 'LOGISTICS');
  }

  function createCloudRequest(formData) {
    const request = {
      id: uid('c'),
      customerId: currentUser.id,
      service: formData.get('service'),
      priority: formData.get('priority'),
      status: 'SCOPING',
      city: formData.get('city'),
      budget: Number(formData.get('budget')),
      message: formData.get('message'),
      createdAt: new Date().toISOString(),
    };
    patch({ cloudRequests: [request, ...state.cloudRequests] });
    notify(`Demande cloud ouverte : ${request.service}.`, 'CLOUD');
  }

  function buySoftware(item) {
    const transaction = {
      id: uid('t'),
      module: 'SOFTWARE',
      reference: item.id,
      amount: item.price,
      status: 'RELEASED',
      payerId: currentUser.id,
      receiverId: item.developerId,
      commission: item.price * 0.1,
      createdAt: new Date().toISOString(),
    };
    patch({
      software: state.software.map((software) => software.id === item.id ? { ...software, downloads: software.downloads + 1 } : software),
      transactions: [transaction, ...state.transactions],
    });
    notify(`Licence achetée : ${item.name}.`, 'SOFTWARE');
  }

  function submitKyc(formData) {
    const record = {
      id: uid('k'),
      userId: currentUser.id,
      type: formData.get('type'),
      documents: formData.get('type') === 'Entreprise'
        ? ['RCCM', 'ID Nat', 'Numéro fiscal', 'Adresse']
        : ['Carte d’identité', 'Photo selfie'],
      status: 'PENDING',
      city: formData.get('city'),
      submittedAt: new Date().toISOString(),
    };
    patch({ kyc: [record, ...state.kyc] });
    notify('Dossier KYC soumis pour validation.', 'KYC');
  }

  function sendMessage(formData) {
    const message = {
      id: uid('m'),
      channel: formData.get('channel'),
      from: currentUser.name,
      to: formData.get('to'),
      text: formData.get('text'),
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };
    patch({ messages: [message, ...state.messages] });
    notify(`Nouveau message ${message.channel}.`, 'MESSAGE');
  }

  function updateCollection(collection, id, fields) {
    patch({
      [collection]: state[collection].map((item) => item.id === id ? { ...item, ...fields } : item),
    });
  }

  function releaseTransaction(transaction) {
    const sellerNetAmount = Math.max(0, Number(transaction.amount || 0) - Number(transaction.commission || 0));
    patch({
      transactions: state.transactions.map((item) => item.id === transaction.id ? { ...item, status: 'RELEASED' } : item),
      orders: state.orders.map((item) => item.orderNumber === transaction.reference ? { ...item, escrowStatus: 'RELEASED', status: 'COMPLETED', deliveryStatus: 'DELIVERED' } : item),
      rides: state.rides.map((item) => item.id === transaction.reference ? { ...item, paymentStatus: 'RELEASED', status: 'COMPLETED' } : item),
      deliveries: state.deliveries.map((item) => item.id === transaction.reference ? { ...item, status: 'DELIVERED', proof: 'SIGNED_PHOTO' } : item),
      users: state.users.map((user) => user.id === transaction.receiverId ? {
        ...user,
        availableBalance: Number(user.availableBalance || 0) + sellerNetAmount,
        blockedBalance: Math.max(0, Number(user.blockedBalance || 0) - Number(transaction.amount || 0)),
      } : user),
      auditLogs: [audit('RELEASE_ESCROW', 'transactions', transaction.id, `Fonds libérés : ${transaction.reference}`, currentUser.city), ...state.auditLogs],
    });
    notify(`Fonds libérés pour ${transaction.reference}.`, 'ESCROW');
  }

  async function resetPlatformSession() {
    const response = await fetch('/api/platform/bootstrap');
    const payload = await response.json();
    setState(normalizeState(payload.success ? payload.data : emptyPlatformState));
    setCart([]);
    setIsAuthenticated(false);
    setAuthView('landing');
    window.localStorage.removeItem(AUTH_KEY);
  }

  const nav = [
    { id: 'home', label: 'Accueil', icon: HomeIcon },
    { id: 'dashboard', label: 'Pilotage', icon: BarChart3 },
    { id: 'market', label: 'Market', icon: ShoppingBag },
    { id: 'suppliers', label: 'Fournisseurs', icon: Building2 },
    { id: 'rfq', label: 'RFQ / Devis', icon: ReceiptText },
    { id: 'cab', label: 'Cab', icon: Car },
    { id: 'logistics', label: 'Logistics', icon: Truck },
    { id: 'software', label: 'Software', icon: Code2 },
    { id: 'cloud', label: 'Cloud', icon: Cloud },
    { id: 'wallet', label: 'Wallet / Escrow', icon: Wallet },
    { id: 'disputes', label: 'Litiges', icon: AlertTriangle },
    { id: 'kyc', label: 'KYC', icon: FileCheck2 },
    { id: 'messaging', label: 'Messages', icon: MessageCircle },
    { id: 'profile', label: 'Profil', icon: UserCircle },
    { id: 'admin', label: 'Administration', icon: ShieldCheck },
  ];

  if (!isAuthenticated) {
    const publicProducts = state.products.filter((product) => product.status === 'APPROVED');
    return (
      <PublicMarketplace
        query={query}
        setQuery={setQuery}
        products={publicProducts}
        users={state.users}
        cart={cart}
        setCart={setCart}
      />
    );
  }

  if (!isAuthenticated) {
    if (authView === 'login' || authView === 'signup') {
      const isSignup = authView === 'signup';
      return (
        <main className="min-h-screen bg-[#07111f] text-white">
          <header className="border-b border-cyan-300/10 bg-[#07111f]/95">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <button onClick={() => setAuthView('landing')} className="flex items-center gap-3" aria-label="Retour accueil Nexora">
                <img src="/images/nexora-logo-full.png" alt="Nexora" className="h-11 w-auto" />
              </button>
              <Button variant="ghost" onClick={() => setAuthView('landing')}>Accueil</Button>
            </div>
          </header>

          <section className="mx-auto grid min-h-[calc(100vh-64px)] max-w-6xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div className="hidden lg:block">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Compte Nexora</p>
              <h1 className="mt-4 text-4xl font-black tracking-tight">Un espace clair pour acheter, vendre et gerer vos operations.</h1>
              <div className="mt-8 grid gap-3">
                {[
                  ['Acheteurs', 'Recherche, panier, commandes, favoris et demandes de prix.'],
                  ['Vendeurs', 'Boutique, produits, prix, stock, commandes et paiements.'],
                  ['Fournisseurs', 'Devis, negociations, documents, verification et suivi.'],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-lg border border-cyan-200/10 bg-white/[0.06] p-4">
                    <p className="font-black text-white">{title}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-300">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-cyan-200/15 bg-[#0b1728] p-5 shadow-2xl shadow-blue-950/30 sm:p-7">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">{isSignup ? 'Inscription' : 'Connexion'}</p>
                  <h2 className="mt-2 text-2xl font-black">{isSignup ? 'Creer votre compte' : 'Acceder a votre compte'}</h2>
                </div>
                <img src="/images/nexora-mark.png" alt="" className="h-14 w-14" />
              </div>

              <div className="mb-5 grid grid-cols-2 rounded-lg border border-cyan-200/10 bg-white/[0.05] p-1">
                <button onClick={() => setAuthView('login')} className={`rounded-md px-3 py-2 text-sm font-black ${!isSignup ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-white shadow-lg shadow-blue-950/20' : 'text-slate-300'}`}>Connexion</button>
                <button onClick={() => setAuthView('signup')} className={`rounded-md px-3 py-2 text-sm font-black ${isSignup ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-white shadow-lg shadow-blue-950/20' : 'text-slate-300'}`}>Inscription</button>
              </div>

              {!isSignup ? (
                <form action={loginUser} className="space-y-4">
                  <Field label="Email ou telephone"><Input name="identifier" required placeholder="Email ou telephone" /></Field>
                  <Field label="Mot de passe"><Input name="password" type="password" required placeholder="Mot de passe" /></Field>
                  <Button className="w-full"><LogIn className="h-4 w-4" /> Entrer</Button>
                </form>
              ) : (
                <form action={signupUser} className="grid gap-4 sm:grid-cols-2">
                  <Field label="Nom"><Input name="name" required placeholder="Nom" /></Field>
                  <Field label="Role"><Select name="role"><option>ACHETEUR</option><option>VENDEUR</option><option>FOURNISSEUR</option><option>LIVREUR</option></Select></Field>
                  <Field label="Email"><Input name="email" type="email" required placeholder="Email" /></Field>
                  <Field label="Telephone"><Input name="phone" required placeholder="Telephone" /></Field>
                  <Field label="Ville"><Select name="city">{cities.map((city) => <option key={city}>{city}</option>)}</Select></Field>
                  <Field label="Entreprise"><Input name="companyName" placeholder="Optionnel" /></Field>
                  <Field label="Adresse"><Input name="address" placeholder="Adresse" /></Field>
                  <Field label="Mot de passe"><Input name="password" type="password" required placeholder="Mot de passe" /></Field>
                  <Button className="sm:col-span-2"><UserPlus className="h-4 w-4" /> Creer le compte</Button>
                </form>
              )}
            </div>
          </section>
        </main>
      );
    }

    return (
      <main className="min-h-screen bg-[#07111f] text-white">
        <header className="sticky top-0 z-40 border-b border-cyan-300/10 bg-[#07111f]/90 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <img src="/images/nexora-logo-full.png" alt="Nexora" className="h-11 w-auto" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => { window.location.href = '/login'; }}><LogIn className="h-4 w-4" /> Connexion</Button>
              <Button onClick={() => { window.location.href = '/signup'; }}><UserPlus className="h-4 w-4" /> Inscription</Button>
            </div>
          </div>
          <div className="hidden border-t border-cyan-300/10 px-4 py-2 sm:px-6 lg:block lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto text-sm font-bold text-slate-300">
              {topMarketplaceLinks.map((item) => (
                <button key={item.label} onClick={() => { window.location.href = '/login'; }} className="whitespace-nowrap rounded-full px-3 py-1.5 hover:bg-white/10 hover:text-white">
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <section className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Nexora Marketplace</p>
              <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Achetez, vendez et livrez plus vite.</h1>
              <p className="mt-5 max-w-2xl text-lg font-medium text-slate-300">
                Une plateforme moderne pour trouver des produits, comparer les vendeurs, negocier les prix et suivre vos commandes en toute confiance.
              </p>
              <div className="mt-6 rounded-lg border border-cyan-200/20 bg-white/[0.08] p-2 shadow-2xl shadow-blue-950/30 backdrop-blur">
                <div className="grid gap-2 md:grid-cols-[140px_1fr_auto]">
                  <Select defaultValue="Produits">
                    <option>Produits</option>
                    <option>Fabricants</option>
                    <option>Fournisseurs</option>
                  </Select>
                  <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Que recherchez-vous ?" />
                  <Button onClick={() => { window.location.href = '/login'; }}><Search className="h-4 w-4" /> Rechercher</Button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {frequentSearches.slice(0, 7).map((term) => (
                  <button key={term} onClick={() => { setQuery(term); window.location.href = '/login'; }} className="rounded-full border border-cyan-200/15 bg-white/[0.08] px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-cyan-400/15">{term}</button>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button onClick={() => { window.location.href = '/signup'; }}><UserPlus className="h-4 w-4" /> Creer mon compte</Button>
                <Button variant="ghost" onClick={() => { window.location.href = '/login'; }}><LogIn className="h-4 w-4" /> Se connecter</Button>
              </div>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ['Categories', 'Produits classes par secteur'],
                ['Demandes de prix', 'Recevoir plusieurs offres'],
                ['Commande protegee', 'Paiement, livraison et preuves'],
                ['Espace acheteur', 'Commandes, favoris et messages'],
                ['Vendre sur Nexora', 'Boutique, stock et paiements'],
                ['Mobile', 'Outils acheteur et vendeur'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-lg border border-cyan-200/10 bg-white/[0.06] p-4">
                  <p className="font-black">{title}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-400">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full rounded-lg border border-cyan-200/15 bg-[#0b1728] p-5 shadow-2xl shadow-blue-950/30">
              <div className="flex items-center justify-between gap-4 border-b border-cyan-200/10 pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Tableau marketplace</p>
                  <h2 className="mt-2 text-2xl font-black">Tout le commerce Nexora, organise.</h2>
                </div>
                <img src="/images/nexora-mark.png" alt="" className="h-16 w-16" />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ['Acheter', 'Comparer les offres, contacter les vendeurs et suivre la livraison.'],
                  ['Vendre', 'Publier des produits, gerer les commandes et recevoir les paiements.'],
                  ['Fournir', 'Repondre aux demandes de prix et negocier avec les acheteurs.'],
                  ['Administrer', 'Verifier les comptes, surveiller les litiges et les transactions.'],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-lg border border-cyan-200/10 bg-white/[0.06] p-4">
                    <p className="font-black text-white">{title}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-300">{text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-lg border border-cyan-200/10 bg-gradient-to-r from-cyan-400/15 to-blue-600/15 p-4">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-200">Acces plateforme</p>
                <p className="mt-2 text-sm font-semibold text-slate-300">Connectez-vous pour ouvrir les pages produits, fournisseurs, commandes, messages, profil et administration.</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button onClick={() => { window.location.href = '/login'; }}><LogIn className="h-4 w-4" /> Connexion</Button>
                  <Button variant="ghost" onClick={() => { window.location.href = '/signup'; }}><UserPlus className="h-4 w-4" /> Inscription</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-cyan-300/10 bg-[#0b1728] px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-center gap-3 text-sm font-black text-slate-200">
              {[
                'Toutes les categories',
                'Fabricants verifies',
                'Protection paiement',
                'Accio Work / assistant IA',
                'Exoneration de taxes',
                'Centre acheteur',
                'App & extension',
                'Devenir fournisseur',
              ].map((item) => (
                <button key={item} onClick={() => { window.location.href = '/login'; }} className="rounded-full border border-cyan-200/10 bg-white/[0.06] px-4 py-2 hover:border-cyan-300/40 hover:bg-cyan-400/10">
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Fonctionnalites marketplace</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Les services visibles dans une vraie plateforme d’achat.</h2>
            </div>
            <Button onClick={() => { window.location.href = '/signup'; }}><UserPlus className="h-4 w-4" /> Ouvrir un compte</Button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {marketplaceShowcase.map((item) => (
              <article key={item.title} className="rounded-lg border border-cyan-200/10 bg-[#0b1728] p-5 shadow-xl shadow-blue-950/10">
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-300">{item.text}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.items.map((entry) => (
                    <span key={entry} className="rounded-full border border-cyan-200/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-cyan-100">{entry}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#081321] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Centre acheteur</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">Compte, panier, livraison et preferences.</h2>
              <p className="mt-4 text-sm font-semibold leading-6 text-slate-300">
                Les menus des captures sont integres comme modules Nexora : compte utilisateur, panier, pays/region, langue, devise, adresse de livraison, recherche par image, application mobile et assistance.
              </p>
              <div className="mt-6 rounded-lg border border-cyan-200/10 bg-white/[0.06] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-black">Panier</p>
                    <p className="mt-1 text-sm font-semibold text-slate-300">Votre panier peut etre vide ou contenir produits, quantites, taxes, livraison et total.</p>
                  </div>
                  <ShoppingBag className="h-9 w-9 text-cyan-300" />
                </div>
                <Button className="mt-4" variant="ghost" onClick={() => { window.location.href = '/login'; }}>Acceder au panier</Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {buyerTools.map(([title, text]) => (
                <div key={title} className="rounded-lg border border-cyan-200/10 bg-[#0b1728] p-5">
                  <p className="font-black">{title}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-5 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            ['Application mobile', 'Acheter, vendre, discuter avec les fournisseurs, payer et suivre les commandes depuis mobile.', ['App Store', 'Google Play']],
            ['Nexora Lens', 'Recherche par image pour trouver des produits similaires, comparer les prix de gros et personnaliser les commandes.', ['Extension navigateur', 'Recherche image']],
            ['Assistant IA sourcing', 'Aide a trouver des fabricants, preparer une demande de devis et comparer les offres 24/7.', ['Accio Work', 'Assistant achat']],
          ].map(([title, text, actions]) => (
            <article key={title} className="rounded-lg border border-cyan-200/10 bg-[#0b1728] p-5">
              <p className="text-xl font-black">{title}</p>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-300">{text}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {actions.map((action) => <span key={action} className="rounded-md bg-white px-3 py-2 text-xs font-black text-slate-950">{action}</span>)}
              </div>
            </article>
          ))}
        </section>

        <footer className="border-t border-cyan-300/10 bg-[#07111f] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
              {footerGroups.map(([title, links]) => (
                <div key={title}>
                  <p className="font-black text-white">{title}</p>
                  <div className="mt-4 space-y-2">
                    {links.map((link) => (
                      <button key={link} onClick={() => { window.location.href = '/login'; }} className="block text-left text-sm font-semibold text-slate-400 hover:text-cyan-200">{link}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 grid gap-4 border-t border-cyan-300/10 pt-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-black text-white">Paiements et confiance</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['ID Check', 'SSL', 'VISA', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay', 'Mobile Money', 'Banque'].map((item) => (
                    <span key={item} className="rounded-md border border-cyan-200/10 bg-white/[0.06] px-3 py-2 text-xs font-bold text-slate-200">{item}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-black text-white">Restez connecte</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['Facebook', 'LinkedIn', 'X', 'Instagram', 'YouTube', 'TikTok'].map((item) => (
                    <span key={item} className="rounded-full border border-cyan-200/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-slate-300">{item}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
              {['Politiques et reglementations', 'Mentions legales', 'Regles de mise en vente', 'Droits de propriete intellectuelle', 'Politique de confidentialite', 'Conditions d’utilisation', 'Respect de l’integrite'].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </footer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e8fbff_0,#f8fbff_34%,#eef4fb_100%)] text-slate-950">
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-cyan-300/10 bg-[#07111f] text-white shadow-2xl shadow-blue-950/30 transition lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between border-b border-cyan-200/10 px-5">
          <div className="flex items-center gap-3">
            <img src="/images/nexora-mark.png" alt="Nexora" className="h-11 w-11" />
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em]">NEXORA</p>
              <p className="text-xs font-semibold text-slate-400">B2B marketplace</p>
            </div>
          </div>
          <button className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Fermer le menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="rounded-lg border border-cyan-200/10 bg-white/[0.06] p-4 shadow-lg shadow-black/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Session unique</p>
            <p className="mt-2 font-black">{currentUser.name}</p>
            <div className="mt-2 flex items-center gap-2">
              <Badge>{currentUser.role}</Badge>
            </div>
            <label className="mt-3 block text-xs font-bold uppercase tracking-wide text-slate-400" htmlFor="sidebar-user">Changer de compte</label>
            <select
              id="sidebar-user"
              value={state.currentUserId}
              onChange={(event) => patch({ currentUserId: event.target.value })}
              className="mt-2 w-full rounded-lg border border-cyan-200/10 bg-[#0d1d34] px-3 py-2 text-sm font-bold text-white outline-none ring-cyan-400 focus:ring-2"
            >
              {state.users.map((user) => <option key={user.id} value={user.id}>{user.name} · {user.role}</option>)}
            </select>
          </div>

          <nav className="mt-5 space-y-1 pb-6">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActive(item.id);
                    setMobileOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-bold transition ${active === item.id ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-40 border-b border-cyan-100 bg-white/85 shadow-sm shadow-blue-950/5 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Ouvrir le menu">
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Marketplace B2B/B2C</p>
                <div className="flex items-center gap-2">
                  <img src="/images/nexora-mark.png" alt="" className="h-7 w-7" />
                  <h1 className="text-lg font-black sm:text-xl">NEXORA</h1>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={state.currentUserId}
                onChange={(event) => patch({ currentUserId: event.target.value })}
                className="hidden max-w-[260px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-800 outline-none ring-emerald-500 focus:ring-2 md:block"
                aria-label="Changer de compte"
              >
                {state.users.map((user) => <option key={user.id} value={user.id}>{user.name} · {user.role}</option>)}
              </select>
              <button className="relative rounded-lg border border-slate-200 bg-white p-2">
                <Bell className="h-5 w-5" />
                {state.notifications.some((item) => !item.read) && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />}
              </button>
              <Button variant="light" className="hidden md:inline-flex" onClick={() => dispatch(uiActions.setAssistantOpen(true))}><Zap className="h-4 w-4" /> IA</Button>
              <Button variant="light" className="hidden md:inline-flex" onClick={() => setActive('profile')}><UserCircle className="h-4 w-4" /> Profil</Button>
              <Button variant="light" className="hidden md:inline-flex" onClick={logoutUser}>Sortir</Button>
              <Button variant="light" onClick={() => setActive('market')}><Store className="h-4 w-4" /> Sell</Button>
            </div>
          </div>
        </header>

        <div className="px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-8">
          {active === 'home' && (
            <div className="space-y-6">
              <section className="relative overflow-hidden rounded-lg bg-slate-950 p-6 text-white shadow-sm">
                <img src="/images/nexora-ecosystem-hero.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40" />
                <div className="relative grid gap-8 lg:grid-cols-[1fr_360px]">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">Welcome to Nexora</p>
                    <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">Find products, verified suppliers and factory quotes in one B2B marketplace.</h2>
                    <p className="mt-4 max-w-2xl text-slate-300">Search products, compare manufacturers, post RFQs, pay with escrow, track delivery and manage disputes from one buyer center.</p>
                    <div className="mt-6 rounded-lg bg-white p-2 text-slate-950 shadow-2xl">
                      <div className="grid gap-2 md:grid-cols-[150px_1fr_auto]">
                        <Select defaultValue={marketMode === 'suppliers' ? 'Manufacturers' : 'Products'} onChange={(event) => setMarketMode(event.target.value === 'Manufacturers' ? 'suppliers' : 'products')}>
                          <option>Products</option>
                          <option>Manufacturers</option>
                        </Select>
                        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What are you looking for?" />
                        <Button onClick={() => setActive('market')}><Search className="h-4 w-4" /> Search</Button>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {frequentSearches.map((term) => (
                        <button key={term} onClick={() => { setQuery(term); setActive('market'); }} className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-slate-200">{term}</button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/10 p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-white/10">
                        {currentUser.avatarUrl ? <img src={currentUser.avatarUrl} alt="" className="h-full w-full object-cover" /> : <UserCircle className="h-10 w-10 text-emerald-200" />}
                      </div>
                      <div>
                        <p className="font-black">{currentUser.name}</p>
                        <p className="text-sm font-semibold text-slate-300">{currentUser.role} · {currentUser.city}</p>
                      </div>
                    </div>
                    <div className="mt-5 space-y-3 text-sm">
                      {sourcingSteps.map((step) => (
                        <div key={step.title} className="rounded-lg bg-white/10 p-3">
                          <b>{step.title}</b>
                          <span className="mt-1 block text-slate-300">{step.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid gap-4 lg:grid-cols-[280px_1fr_300px]">
                  <div>
                    <p className="text-sm font-black uppercase tracking-wide text-slate-500">Departements</p>
                    <div className="mt-3 space-y-2">
                      {categoryDepartments.map((department) => {
                        const Icon = department.icon;
                        return (
                          <button key={department.category} onClick={() => { setCategoryFilter(department.category); setActive('market'); }} className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-left text-sm font-bold hover:border-emerald-300 hover:bg-emerald-50">
                            <Icon className="h-5 w-5 text-emerald-700" />
                            {department.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                      <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Recherche marketplace</p>
                      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Produit, fournisseur, categorie, ville..." className="pl-10" />
                        </div>
                        <Button onClick={() => setActive('market')}><Search className="h-4 w-4" /> Rechercher</Button>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {['Smartphone', 'Routeur', 'Solaire', 'Prix gros', 'Fournisseur verifie'].map((tag) => (
                          <button key={tag} onClick={() => { setQuery(tag); setActive('market'); }} className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-700 ring-1 ring-emerald-200">{tag}</button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      {featuredProducts.slice(0, 3).map((product) => (
                        <button key={product.id} onClick={() => { setSelectedProductId(product.id); setActive('market'); }} className="overflow-hidden rounded-lg border border-slate-200 bg-white text-left shadow-sm hover:border-emerald-300">
                          <img src={product.imageUrl || imageForCategory(product.category)} alt="" className="h-28 w-full object-cover" />
                          <div className="p-3">
                            <p className="line-clamp-2 text-sm font-black">{product.name}</p>
                            <p className="mt-1 text-xs font-bold text-slate-500">MOQ {product.moq || 1} · {currency(product.wholesalePrice || product.price)}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-black">Trade Assurance Nexora</p>
                    <div className="mt-3 space-y-3 text-sm font-semibold text-slate-600">
                      <p className="flex gap-2"><ShieldCheck className="h-5 w-5 text-emerald-700" /> Fournisseurs verifies KYC.</p>
                      <p className="flex gap-2"><Lock className="h-5 w-5 text-emerald-700" /> Paiement bloque en escrow.</p>
                      <p className="flex gap-2"><Truck className="h-5 w-5 text-emerald-700" /> Suivi livraison et preuve.</p>
                      <p className="flex gap-2"><AlertTriangle className="h-5 w-5 text-emerald-700" /> Litige arbitre par Nexora.</p>
                    </div>
                    <Button className="mt-4 w-full" onClick={() => setActive('rfq')}><ReceiptText className="h-4 w-4" /> Demander un devis</Button>
                  </div>
                </div>
              </section>

              <section className="grid gap-4 lg:grid-cols-3">
                <button onClick={() => setActive('rfq')} className="rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm hover:border-emerald-300">
                  <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Request for Quotation</p>
                  <h3 className="mt-2 text-xl font-black">Post sourcing requirements</h3>
                  <p className="mt-2 text-sm font-semibold text-slate-600">Receive quotes from multiple matching suppliers and convert the best one to escrow order.</p>
                </button>
                <button onClick={() => { setMarketMode('products'); setActive('market'); }} className="rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm hover:border-emerald-300">
                  <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Top Ranking</p>
                  <h3 className="mt-2 text-xl font-black">Best products and suppliers</h3>
                  <p className="mt-2 text-sm font-semibold text-slate-600">Sponsored products, verified vendors, popular categories and business recommendations.</p>
                </button>
                <button onClick={() => setActive('messaging')} className="rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm hover:border-emerald-300">
                  <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Fast customization</p>
                  <h3 className="mt-2 text-xl font-black">Negotiate directly</h3>
                  <p className="mt-2 text-sm font-semibold text-slate-600">Contact supplier, request samples, define branding, delivery and payment terms.</p>
                </button>
              </section>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Metric icon={ShoppingBag} label="Commandes" value={state.orders.filter((order) => order.customerId === currentUser.id || order.sellerId === currentUser.id).length} note="Achat ou vente" />
                <Metric icon={ReceiptText} label="RFQ" value={scopedRfqs.length} note="Demandes et devis" />
                <Metric icon={Wallet} label="Wallet" value={currency(currentUser.availableBalance || 0)} note="Solde disponible" />
                <Metric icon={AlertTriangle} label="Litiges" value={scopedDisputes.length} note="A suivre" />
              </div>

              <Panel title="Recommended for your business" icon={ShoppingBag}>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {featuredProducts.slice(0, 4).map((product) => {
                    const supplier = state.users.find((user) => user.id === product.sellerId);
                    return (
                      <article key={product.id} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                        <img src={product.imageUrl || imageForCategory(product.category)} alt="" className="h-32 w-full object-cover" />
                        <div className="p-4">
                          <p className="line-clamp-2 font-black">{product.name}</p>
                          <p className="mt-2 text-sm font-bold text-emerald-700">{currency(product.wholesalePrice || product.price)} · MOQ {product.moq || 1}</p>
                          <p className="mt-1 text-xs font-semibold text-slate-500">{supplier?.name || 'Supplier'} · {product.city}</p>
                          <Button className="mt-3 w-full" variant="light" onClick={() => { setSelectedProductId(product.id); setActive('market'); }}>View product</Button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </Panel>

              <Panel title="Actions rapides" icon={Zap}>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {[
                    ['market', ShoppingBag, 'Marketplace', 'Catalogue et panier'],
                    ['suppliers', Building2, 'Fournisseurs', 'Annuaire et KYC'],
                    ['rfq', ReceiptText, 'RFQ / Devis', 'Negocier un prix'],
                    ['wallet', Wallet, 'Wallet', 'Escrow et retraits'],
                  ].map(([id, Icon, title, text]) => (
                    <button key={id} onClick={() => setActive(id)} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm"><Icon className="h-5 w-5" /></span>
                      <span><b className="block">{title}</b><span className="text-xs font-semibold text-slate-500">{text}</span></span>
                    </button>
                  ))}
                </div>
              </Panel>
            </div>
          )}

          {active === 'dashboard' && (
            <div className="space-y-6">
              <section className="relative overflow-hidden rounded-lg bg-slate-950 p-6 text-white shadow-sm">
                <img src="/images/nexora-ecosystem-hero.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40" />
                <div className="relative grid gap-8 lg:grid-cols-[1fr_0.75fr]">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">Compte unique + services intégrés</p>
                    <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">Piloter commerce, transport, cloud, logiciels, logistique et paiements depuis une seule plateforme.</h2>
                    <p className="mt-4 max-w-2xl text-slate-300">Cette version permet de simuler les workflows clés du cahier des charges : création, paiement, escrow, validation, KYC, messagerie et administration.</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {modules.map((item) => (
                        <span key={item.id} className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-bold">{item.label}</span>
                      ))}
                    </div>
                  </div>
                  <Panel title="Notifications" icon={Bell}>
                    <div className="space-y-3">
                      {state.notifications.slice(0, 4).map((item) => (
                        <div key={item.id} className="rounded-lg bg-slate-50 p-3 text-slate-900">
                          <p className="text-xs font-black text-emerald-700">{item.type}</p>
                          <p className="mt-1 text-sm font-semibold">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </Panel>
                </div>
              </section>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Metric icon={Users} label="Utilisateurs" value={stats.users} note={`${stats.sellers} vendeur(s) · ${stats.suppliers} fournisseur(s)`} />
                <Metric icon={ShoppingBag} label="Produits" value={stats.products} note={`${stats.rfqs} demande(s) RFQ ouvertes`} />
                <Metric icon={Lock} label="Fonds escrow" value={currency(stats.escrow)} note="Transactions sécurisées" />
                <Metric icon={Zap} label="Opérations ouvertes" value={stats.openOps} note={`${stats.disputes} litige(s) a arbitrer`} />
              </div>

              <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
                <Panel title="Modules opérationnels" icon={Layers3}>
                  <div className="grid gap-3 md:grid-cols-2">
                    {modules.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button key={item.id} onClick={() => setActive(item.id)} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50">
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm">
                              <Icon className="h-5 w-5" />
                            </span>
                            <div>
                              <p className="font-black">{item.label}</p>
                              <p className="text-xs font-semibold text-slate-500">Ouvrir le module</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-slate-400" />
                        </button>
                      );
                    })}
                  </div>
                </Panel>

                <Panel title="Implantation Phase 1" icon={MapPin}>
                  <div className="grid grid-cols-2 gap-2">
                    {cities.map((city) => (
                      <div key={city} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold">{city}</div>
                    ))}
                  </div>
                </Panel>
              </div>
              <Panel title="Journal d’audit" icon={FileCheck2}>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                        <th className="py-3">Date</th>
                        <th>Action</th>
                        <th>Entité</th>
                        <th>Ville</th>
                        <th>Détail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.auditLogs.filter((log) => canSeeCity(log.city)).slice(0, 20).map((log) => (
                        <tr key={log.id} className="border-b border-slate-100">
                          <td className="py-3">{new Date(log.createdAt).toLocaleString('fr-FR')}</td>
                          <td className="font-black">{log.action}</td>
                          <td>{log.entity}</td>
                          <td>{log.city}</td>
                          <td>{log.detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            </div>
          )}

          {active === 'market' && (
            <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
              <div className="space-y-6">
                <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Nexora marketplace</p>
                      <h2 className="mt-1 text-2xl font-black">Catalogue B2B/B2C, fournisseurs et devis</h2>
                    </div>
                    <div className="flex rounded-lg bg-slate-100 p-1">
                      {[
                        ['products', 'Produits'],
                        ['suppliers', 'Fournisseurs'],
                        ['rfq', 'RFQ'],
                      ].map(([id, label]) => (
                        <button key={id} onClick={() => setMarketMode(id)} className={`rounded-md px-3 py-2 text-sm font-black ${marketMode === id ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}>{label}</button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_220px_220px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher produit, fournisseur, categorie, ville..." className="pl-10" />
                    </div>
                    <Select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                      <option value="ALL">Toutes categories</option>
                      {categoryDepartments.map((department) => <option key={department.category} value={department.category}>{department.name}</option>)}
                    </Select>
                    <Select value={cityFilter} onChange={(event) => setCityFilter(event.target.value)}>
                      <option value="ALL">Toutes villes</option>
                      {cities.map((city) => <option key={city}>{city}</option>)}
                    </Select>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryDepartments.map((department) => {
                      const Icon = department.icon;
                      return (
                        <button key={department.category} onClick={() => setCategoryFilter(department.category)} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm font-black ${categoryFilter === department.category ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                          <Icon className="h-4 w-4" />
                          {department.name}
                        </button>
                      );
                    })}
                  </div>
                </section>

                {marketMode === 'suppliers' && (
                  <Panel title="Fournisseurs verifies" icon={Building2}>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {supplierUsers.map((supplier) => {
                        const supplierProducts = state.products.filter((product) => product.sellerId === supplier.id);
                        return (
                          <article key={supplier.id} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-xs font-black uppercase tracking-wide text-emerald-700">{supplier.role}</p>
                                <h3 className="mt-1 text-lg font-black">{supplier.name}</h3>
                                <p className="mt-1 text-sm font-semibold text-slate-600">{supplier.city} · {supplier.companyName || 'Entreprise non renseignee'}</p>
                              </div>
                              <Badge>{supplier.supplierLevel || supplier.kycStatus}</Badge>
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                              <p><span className="block text-xs font-bold text-slate-500">Produits</span><b>{supplierProducts.length}</b></p>
                              <p><span className="block text-xs font-bold text-slate-500">KYC</span><b>{supplier.kycStatus}</b></p>
                              <p><span className="block text-xs font-bold text-slate-500">Ville</span><b>{supplier.city}</b></p>
                            </div>
                            <div className="mt-4 flex gap-2">
                              <Button className="flex-1" onClick={() => setSelectedSupplierId(supplier.id)}>Voir boutique</Button>
                              <Button variant="light" onClick={() => setActive('rfq')}>Demander devis</Button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </Panel>
                )}

                {marketMode === 'rfq' && (
                  <Panel title="Acheter en gros par demande de devis" icon={ReceiptText}>
                    <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
                      <form action={createRfq} className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <Field label="Produit recherche"><Input name="title" required placeholder="Ex: 500 smartphones" /></Field>
                        <Field label="Categorie"><Select name="category">{categoryDepartments.map((item) => <option key={item.category}>{item.category}</option>)}</Select></Field>
                        <Field label="Ville"><Select name="city">{cities.map((city) => <option key={city}>{city}</option>)}</Select></Field>
                        <Field label="Quantite"><Input name="quantity" type="number" min="1" required /></Field>
                        <Field label="Prix cible"><Input name="targetPrice" type="number" min="0" /></Field>
                        <Field label="Details"><Textarea name="notes" placeholder="Specifications, marque, livraison, garantie..." /></Field>
                        <Button className="w-full"><ReceiptText className="h-4 w-4" /> Publier la demande</Button>
                      </form>
                      <div className="grid gap-3">
                        {scopedRfqs.slice(0, 4).map((rfq) => (
                          <div key={rfq.id} className="rounded-lg border border-slate-200 bg-white p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-black">{rfq.title}</p>
                                <p className="mt-1 text-sm font-semibold text-slate-600">{rfq.quantity} unite(s) · {rfq.city} · cible {currency(rfq.targetPrice)}</p>
                              </div>
                              <Badge>{rfq.status}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Panel>
                )}

                {marketMode === 'products' && (
                <Panel title="NEXORA Market" icon={Store}>
                  <div className="grid gap-3 md:grid-cols-[1fr_220px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher produit, catégorie, ville..." className="pl-10" />
                    </div>
                    <Select value={cityFilter} onChange={(event) => setCityFilter(event.target.value)}>
                      <option value="ALL">Toutes les villes</option>
                      {cities.map((city) => <option key={city}>{city}</option>)}
                    </Select>
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {filteredProducts.map((product) => (
                      <article key={product.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:border-emerald-300 hover:shadow-md">
                        <button onClick={() => setSelectedProductId(product.id)} className="block w-full text-left">
                          <img src={product.imageUrl || imageForCategory(product.category)} alt="" className="h-44 w-full bg-slate-100 object-cover" />
                        </button>
                        <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">{product.category}</p>
                            <h3 className="mt-1 text-lg font-black">{product.name}</h3>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {product.sponsored && <Badge>SPONSORED</Badge>}
                            <Badge>{product.status}</Badge>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                          <p><span className="block text-xs font-bold text-slate-500">Prix</span><b>{currency(product.price)}</b></p>
                          <p><span className="block text-xs font-bold text-slate-500">Stock</span><b>{product.stock}</b></p>
                          <p><span className="block text-xs font-bold text-slate-500">Ville</span><b>{product.city}</b></p>
                        </div>
                        <p className="mt-3 text-xs font-semibold text-slate-500">Commission Nexora : {product.commissionRate || 8}% · SKU {product.sku || 'N/A'}</p>
                        {product.b2bEnabled && (
                          <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-900">
                            MOQ {product.moq || 1} · Gros {currency(product.wholesalePrice || product.price)} · Delai {product.leadTime || '48h'}
                          </div>
                        )}
                        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                          <Button onClick={() => addToCart(product)}>
                            <Plus className="h-4 w-4" />
                            Panier
                          </Button>
                          <Button variant="light" onClick={() => toggleFavorite(product.id)}>
                            {state.favorites.some((item) => item.userId === currentUser.id && item.productId === product.id) ? 'Favori' : 'Suivre'}
                          </Button>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <Button variant="light" onClick={() => createRfqFromProduct(product)}>Devis</Button>
                          <Button variant="light" onClick={() => contactSupplierForProduct(product)}>Contacter</Button>
                        </div>
                        <Button variant="dark" className="mt-2 w-full" onClick={() => setSelectedProductId(product.id)}>Voir fiche</Button>
                        </div>
                      </article>
                    ))}
                  </div>
                </Panel>
                )}

                <Panel title="Publier un produit vendeur" icon={PackageCheck}>
                  <form action={addProduct} className="grid gap-4 md:grid-cols-3">
                    <Field label="Nom"><Input name="name" required placeholder="Ex: Laptop Dell Latitude" /></Field>
                    <Field label="Catégorie"><Input name="category" required placeholder="Informatique" /></Field>
                    <Field label="Ville"><Select name="city">{cities.map((city) => <option key={city}>{city}</option>)}</Select></Field>
                    <Field label="Prix USD"><Input name="price" type="number" required min="1" /></Field>
                    <Field label="Stock"><Input name="stock" type="number" required min="0" /></Field>
                    <Field label="MOQ B2B"><Input name="moq" type="number" min="1" defaultValue="1" /></Field>
                    <Field label="Prix grossiste"><Input name="wholesalePrice" type="number" min="0" /></Field>
                    <Field label="Delai fournisseur"><Input name="leadTime" placeholder="Ex: 5 jours" /></Field>
                    <Field label="Origine"><Input name="origin" defaultValue="RDC" /></Field>
                    <Field label="Certifications"><Input name="certifications" placeholder="RCCM, garantie, ISO" /></Field>
                    <label className="flex items-end gap-2 pb-3 text-sm font-bold text-slate-700">
                      <input name="sponsored" type="checkbox" className="h-4 w-4" />
                      Produit sponsorisé
                    </label>
                    <Button className="md:col-span-3"><Plus className="h-4 w-4" /> Publier</Button>
                  </form>
                </Panel>
                <Panel title="Créer une boutique vendeur" icon={Store}>
                  <form action={createShop} className="grid gap-4 md:grid-cols-2">
                    <Field label="Nom boutique"><Input name="name" required placeholder="Nom de votre boutique" /></Field>
                    <Field label="Téléphone"><Input name="phone" required placeholder="Telephone" /></Field>
                    <Field label="Ville"><Select name="city">{cities.map((city) => <option key={city}>{city}</option>)}</Select></Field>
                    <Field label="Horaires"><Input name="openingHours" defaultValue="08:00 - 18:00" /></Field>
                    <Field label="Adresse"><Input name="address" required /></Field>
                    <Field label="Description"><Input name="description" required /></Field>
                    <Button className="md:col-span-2"><Plus className="h-4 w-4" /> Soumettre boutique</Button>
                  </form>
                </Panel>

                <Panel title="Validation produits par NEXORA" icon={ShieldCheck}>
                  <div className="grid gap-3">
                    {scopedProducts.filter((product) => product.status !== 'APPROVED').map((product) => (
                      <div key={product.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-black">{product.name}</p>
                            <p className="mt-1 text-sm text-slate-600">{product.category} · {product.city} · {currency(product.price)}</p>
                          </div>
                          <Badge>{product.status}</Badge>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button variant="light" onClick={() => moderateProduct(product.id, 'APPROVED')}>Approuver</Button>
                          <Button variant="danger" onClick={() => moderateProduct(product.id, 'REJECTED', 'Informations produit insuffisantes')}>Rejeter</Button>
                        </div>
                      </div>
                    ))}
                    {scopedProducts.filter((product) => product.status !== 'APPROVED').length === 0 && (
                      <p className="rounded-lg bg-slate-50 p-4 text-sm font-semibold text-slate-500">Aucun produit en attente dans votre périmètre.</p>
                    )}
                  </div>
                </Panel>
              </div>

              <Panel title="Panier & commande escrow" icon={ReceiptText}>
                <div className="space-y-3">
                  {cart.length === 0 && <p className="rounded-lg bg-slate-50 p-4 text-sm font-semibold text-slate-500">Ajoute un produit pour créer une commande avec fonds bloqués.</p>}
                  {cart.map((item) => (
                    <div key={item.productId} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="font-black">{item.name}</p>
                      <p className="text-sm text-slate-600">{item.quantity} × {currency(item.price)}</p>
                    </div>
                  ))}
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex items-center justify-between font-black">
                      <span>Total</span>
                      <span>{currency(cart.reduce((sum, item) => sum + item.price * item.quantity, 0))}</span>
                    </div>
                    <Button disabled={!cart.length} className="mt-4 w-full" onClick={createMarketOrders}>
                      <Lock className="h-4 w-4" />
                      Payer et bloquer en escrow
                    </Button>
                  </div>
                </div>
              </Panel>
            </div>
          )}

          {active === 'suppliers' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Metric icon={Building2} label="Fournisseurs" value={supplierUsers.length} note="Vendeurs et grossistes actifs" />
                <Metric icon={BadgeCheck} label="Verifies" value={supplierUsers.filter((user) => user.kycStatus === 'VERIFIED').length} note="KYC valide" />
                <Metric icon={ShoppingBag} label="Produits B2B" value={state.products.filter((product) => product.b2bEnabled).length} note="MOQ et prix grossiste" />
              </div>
              <Panel title="Annuaire fournisseurs" icon={Building2}>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {supplierUsers.map((supplier) => {
                    const supplierProducts = state.products.filter((product) => product.sellerId === supplier.id);
                    const shop = state.shops.find((item) => item.sellerId === supplier.id);
                    return (
                      <article key={supplier.id} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">{supplier.role}</p>
                            <h3 className="mt-1 text-lg font-black">{supplier.name}</h3>
                            <p className="mt-1 text-sm font-semibold text-slate-600">{supplier.city} · {shop?.name || 'Boutique a configurer'}</p>
                          </div>
                          <Badge>{supplier.kycStatus}</Badge>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                          <p><span className="block text-xs font-bold text-slate-500">Niveau</span><b>{supplier.supplierLevel || 'STANDARD'}</b></p>
                          <p><span className="block text-xs font-bold text-slate-500">Produits</span><b>{supplierProducts.length}</b></p>
                          <p><span className="block text-xs font-bold text-slate-500">Solde</span><b>{currency(supplier.availableBalance || 0)}</b></p>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button variant="light" onClick={() => patch({ users: state.users.map((user) => user.id === supplier.id ? { ...user, kycStatus: 'VERIFIED', sellerStatus: 'VERIFIED', supplierLevel: 'GOLD' } : user) })}>Certifier</Button>
                          <Button variant="danger" onClick={() => patch({ users: state.users.map((user) => user.id === supplier.id ? { ...user, status: 'SUSPENDED' } : user) })}>Suspendre</Button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </Panel>
            </div>
          )}

          {active === 'rfq' && (
            <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
              <div className="space-y-6">
                <Panel title="Demande de devis acheteur" icon={ReceiptText}>
                  <form action={createRfq} className="space-y-4">
                    <Field label="Besoin"><Input name="title" required placeholder="Ex: 200 sacs de ciment" /></Field>
                    <Field label="Categorie"><Input name="category" required placeholder="Construction" /></Field>
                    <Field label="Ville"><Select name="city">{cities.map((city) => <option key={city}>{city}</option>)}</Select></Field>
                    <Field label="Quantite"><Input name="quantity" type="number" min="1" required /></Field>
                    <Field label="Prix cible / unite"><Input name="targetPrice" type="number" min="0" /></Field>
                    <Field label="Delai souhaite"><Input name="deliveryDeadline" placeholder="Ex: 10 jours" /></Field>
                    <Field label="Details"><Textarea name="notes" placeholder="Specifications, qualite, livraison..." /></Field>
                    <Button className="w-full"><Plus className="h-4 w-4" /> Publier RFQ</Button>
                  </form>
                </Panel>
                <Panel title="Repondre comme fournisseur" icon={Store}>
                  <form action={sendQuote} className="space-y-4">
                    <Field label="RFQ"><Select name="rfqId">{scopedRfqs.filter((rfq) => rfq.status === 'OPEN').map((rfq) => <option key={rfq.id} value={rfq.id}>{rfq.title}</option>)}</Select></Field>
                    <Field label="Prix unitaire"><Input name="unitPrice" type="number" min="1" required /></Field>
                    <Field label="Quantite"><Input name="quantity" type="number" min="1" required /></Field>
                    <Field label="Delai fournisseur"><Input name="leadTime" required placeholder="Ex: 5 jours" /></Field>
                    <Field label="Conditions"><Textarea name="paymentTerms" defaultValue="Escrow Nexora, liberation apres reception" /></Field>
                    <Button className="w-full"><ArrowRight className="h-4 w-4" /> Envoyer devis</Button>
                  </form>
                </Panel>
              </div>
              <div className="space-y-6">
                <Panel title="Demandes ouvertes" icon={Search}>
                  <div className="grid gap-3">
                    {scopedRfqs.map((rfq) => (
                      <div key={rfq.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-black">{rfq.title}</p>
                            <p className="mt-1 text-sm text-slate-600">{rfq.category} · {rfq.city} · {rfq.quantity} unite(s)</p>
                          </div>
                          <Badge>{rfq.status}</Badge>
                        </div>
                        <p className="mt-3 text-sm font-semibold text-slate-700">{rfq.notes}</p>
                        <p className="mt-2 text-xs font-bold text-slate-500">Prix cible {currency(rfq.targetPrice)} · Delai {rfq.deliveryDeadline}</p>
                      </div>
                    ))}
                  </div>
                </Panel>
                <Panel title="Devis fournisseurs" icon={ReceiptText}>
                  <div className="grid gap-3">
                    {scopedQuotes.map((quote) => {
                      const rfq = state.rfqs.find((item) => item.id === quote.rfqId);
                      const supplier = state.users.find((item) => item.id === quote.supplierId);
                      const total = Number(quote.unitPrice || 0) * Number(quote.quantity || 0);
                      return (
                        <div key={quote.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="font-black">{rfq?.title || quote.rfqId}</p>
                              <p className="mt-1 text-sm text-slate-600">{supplier?.name || quote.supplierId} · {quote.quantity} x {currency(quote.unitPrice)}</p>
                            </div>
                            <Badge>{quote.status}</Badge>
                          </div>
                          <p className="mt-3 text-sm font-semibold text-slate-700">Total {currency(total)} · Delai {quote.leadTime}</p>
                          <p className="mt-1 text-xs font-bold text-slate-500">{quote.paymentTerms}</p>
                          <Button disabled={quote.status === 'ACCEPTED'} className="mt-4 w-full" onClick={() => acceptQuote(quote)}>
                            <Lock className="h-4 w-4" />
                            Accepter et bloquer en escrow
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </Panel>
              </div>
            </div>
          )}

          {active === 'cab' && (
            <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
              <Panel title="Commander une course" icon={Car}>
                <form action={createRide} className="space-y-4">
                  <Field label="Service"><Select name="service"><option>Taxi</option><option>Moto-taxi</option><option>Livraison repas</option><option>Transport entreprise</option></Select></Field>
                  <Field label="Ville"><Select name="city">{cities.map((city) => <option key={city}>{city}</option>)}</Select></Field>
                  <Field label="Départ"><Input name="pickup" required placeholder="Adresse de départ" /></Field>
                  <Field label="Destination"><Input name="destination" required placeholder="Adresse d’arrivée" /></Field>
                  <Field label="Tarif estimé USD"><Input name="fare" type="number" required min="1" defaultValue="12" /></Field>
                  <Button className="w-full"><Car className="h-4 w-4" /> Lancer la course</Button>
                </form>
              </Panel>
              <Panel title="Courses en temps réel" icon={MapPin}>
                <div className="grid gap-3">
                  {state.rides.map((ride) => (
                    <div key={ride.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-black">{ride.service} · {ride.city}</p>
                          <p className="mt-1 text-sm text-slate-600">{ride.pickup} → {ride.destination}</p>
                        </div>
                        <Badge>{ride.status}</Badge>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span className="font-black">{currency(ride.fare)}</span>
                        <Badge>{ride.paymentStatus}</Badge>
                        <Button variant="light" onClick={() => updateCollection('rides', ride.id, { status: 'COMPLETED', paymentStatus: 'RELEASED', rating: 5 })}>Terminer</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          )}

          {active === 'logistics' && (
            <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
              <Panel title="Créer une livraison" icon={Truck}>
                <form action={createDelivery} className="space-y-4">
                  <Field label="Type"><Select name="type"><option>Livraison urbaine</option><option>Livraison inter-ville</option><option>Livraison nationale</option></Select></Field>
                  <Field label="Ville"><Select name="city">{cities.map((city) => <option key={city}>{city}</option>)}</Select></Field>
                  <Field label="Ramassage"><Input name="pickup" required /></Field>
                  <Field label="Destination"><Input name="destination" required /></Field>
                  <Field label="Prix USD"><Input name="price" type="number" required min="1" defaultValue="7" /></Field>
                  <Button className="w-full"><Truck className="h-4 w-4" /> Affecter livraison</Button>
                </form>
              </Panel>
              <Panel title="Suivi logistique" icon={PackageCheck}>
                <div className="grid gap-3">
                  {state.deliveries.map((delivery) => (
                    <div key={delivery.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-black">{delivery.type} · {delivery.city}</p>
                          <p className="mt-1 text-sm text-slate-600">{delivery.pickup} → {delivery.destination}</p>
                        </div>
                        <Badge>{delivery.status}</Badge>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button variant="light" onClick={() => updateCollection('deliveries', delivery.id, { status: 'IN_TRANSIT' })}>En transit</Button>
                        <Button variant="light" onClick={() => updateCollection('deliveries', delivery.id, { status: 'DELIVERED', proof: 'SIGNED_PHOTO' })}>Preuve photo + signature</Button>
                        <Badge>{delivery.proof}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          )}

          {active === 'software' && (
            <Panel title="NEXORA Software Store" icon={Code2}>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {state.software.map((item) => (
                  <article key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wide text-violet-700">{item.type}</p>
                        <h3 className="mt-1 text-xl font-black">{item.name}</h3>
                      </div>
                      <Badge>{item.active ? 'ACTIVE' : 'DISABLED'}</Badge>
                    </div>
                    <p className="mt-4 text-sm font-semibold text-slate-600">{item.license}</p>
                    <div className="mt-5 flex items-center justify-between">
                      <b>{currency(item.price)}</b>
                      <span className="text-sm font-bold text-slate-500">{item.downloads} téléchargements</span>
                    </div>
                    <Button className="mt-4 w-full" onClick={() => buySoftware(item)}>
                      <CreditCard className="h-4 w-4" />
                      Acheter licence
                    </Button>
                  </article>
                ))}
              </div>
            </Panel>
          )}

          {active === 'cloud' && (
            <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
              <Panel title="Demande Cloud / IT" icon={Cloud}>
                <form action={createCloudRequest} className="space-y-4">
                  <Field label="Service"><Select name="service"><option>Création site web</option><option>Application mobile</option><option>ERP</option><option>CRM</option><option>Hébergement</option><option>Cybersécurité</option><option>Maintenance informatique</option></Select></Field>
                  <Field label="Priorité"><Select name="priority"><option>LOW</option><option>MEDIUM</option><option>HIGH</option><option>CRITICAL</option></Select></Field>
                  <Field label="Ville"><Select name="city">{cities.map((city) => <option key={city}>{city}</option>)}</Select></Field>
                  <Field label="Budget USD"><Input name="budget" type="number" min="0" defaultValue="500" /></Field>
                  <Field label="Besoin"><Textarea name="message" required placeholder="Décrivez le projet..." /></Field>
                  <Button className="w-full"><BriefcaseBusiness className="h-4 w-4" /> Ouvrir ticket</Button>
                </form>
              </Panel>
              <Panel title="Pipeline services technologiques" icon={Headphones}>
                <div className="grid gap-3">
                  {state.cloudRequests.map((request) => (
                    <div key={request.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-black">{request.service}</p>
                          <p className="mt-1 text-sm text-slate-600">{request.message}</p>
                        </div>
                        <Badge>{request.status}</Badge>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Badge>{request.priority}</Badge>
                        <span className="font-black">{currency(request.budget)}</span>
                        <Button variant="light" onClick={() => updateCollection('cloudRequests', request.id, { status: 'IN_PROGRESS' })}>En production</Button>
                        <Button variant="light" onClick={() => updateCollection('cloudRequests', request.id, { status: 'DELIVERED' })}>Livré</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          )}

          {active === 'disputes' && (
            <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
              <Panel title="Ouvrir un litige" icon={AlertTriangle}>
                <form action={openDispute} className="space-y-4">
                  <Field label="Reference commande"><Select name="reference">{state.orders.map((order) => <option key={order.id} value={order.orderNumber}>{order.orderNumber}</option>)}</Select></Field>
                  <Field label="Ville"><Select name="city">{cities.map((city) => <option key={city}>{city}</option>)}</Select></Field>
                  <Field label="Motif"><Textarea name="reason" required placeholder="Produit non recu, qualite, remboursement..." /></Field>
                  <Button className="w-full" variant="danger"><AlertTriangle className="h-4 w-4" /> Ouvrir litige</Button>
                </form>
              </Panel>
              <Panel title="Centre arbitrage Nexora" icon={ShieldCheck}>
                <div className="grid gap-3">
                  {scopedDisputes.map((dispute) => {
                    const owner = state.users.find((user) => user.id === dispute.openedById);
                    return (
                      <div key={dispute.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-black">{dispute.reference}</p>
                            <p className="mt-1 text-sm text-slate-600">{owner?.name || dispute.openedById} · {dispute.city}</p>
                          </div>
                          <Badge>{dispute.status}</Badge>
                        </div>
                        <p className="mt-3 text-sm font-semibold text-slate-700">{dispute.reason}</p>
                        {dispute.resolution && <p className="mt-2 text-xs font-bold text-emerald-700">{dispute.resolution}</p>}
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button variant="light" onClick={() => resolveDispute(dispute.id, 'Remboursement client valide par Nexora')}>Rembourser client</Button>
                          <Button variant="light" onClick={() => resolveDispute(dispute.id, 'Paiement fournisseur libere apres preuve acceptee')}>Liberer fournisseur</Button>
                          <Button variant="danger" onClick={() => resolveDispute(dispute.id, 'Litige classe sans suite')}>Classer</Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Panel>
            </div>
          )}

          {active === 'wallet' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Metric icon={Wallet} label="Fonds escrow" value={currency(stats.escrow)} note="À valider ou libérer" />
                <Metric icon={Banknote} label="Commissions acquises" value={currency(stats.revenue)} note="Transactions libérées" />
                <Metric icon={AlertTriangle} label="Litiges" value={state.transactions.filter((item) => item.status === 'DISPUTED').length} note="À arbitrer" />
              </div>
              <Panel title="Transactions escrow" icon={Landmark}>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                        <th className="py-3">Module</th>
                        <th>Référence</th>
                        <th>Montant</th>
                        <th>Commission</th>
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.transactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-slate-100">
                          <td className="py-3 font-black">{transaction.module}</td>
                          <td>{transaction.reference}</td>
                          <td>{currency(transaction.amount)}</td>
                          <td>{currency(transaction.commission)}</td>
                          <td><Badge>{transaction.status}</Badge></td>
                          <td className="flex gap-2 py-2">
                            <Button variant="light" disabled={transaction.status === 'RELEASED'} onClick={() => releaseTransaction(transaction)}>Libérer</Button>
                            <Button variant="danger" onClick={() => updateCollection('transactions', transaction.id, { status: 'DISPUTED' })}>Litige</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
              <div className="grid gap-6 xl:grid-cols-2">
                <Panel title="Retrait vendeur" icon={Wallet}>
                  <form action={requestWithdrawal} className="grid gap-4 md:grid-cols-2">
                    <Field label="Montant USD"><Input name="amount" type="number" min="1" required /></Field>
                    <Field label="Méthode"><Select name="method"><option>Mobile Money</option><option>Banque</option><option>Paiement manuel</option></Select></Field>
                    <Field label="Destination"><Input name="destination" required placeholder="Telephone ou compte bancaire" /></Field>
                    <div className="flex items-end"><Button className="w-full"><ArrowRight className="h-4 w-4" /> Demander retrait</Button></div>
                  </form>
                  <div className="mt-5 space-y-3">
                    {state.withdrawals.map((withdrawal) => (
                      <div key={withdrawal.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-black">{currency(withdrawal.amount)} · {withdrawal.method}</p>
                            <p className="text-sm text-slate-600">{withdrawal.destination}</p>
                          </div>
                          <Badge>{withdrawal.status}</Badge>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button variant="light" onClick={() => moderateWithdrawal(withdrawal.id, 'PAID')}>Valider finance</Button>
                          <Button variant="danger" onClick={() => moderateWithdrawal(withdrawal.id, 'REJECTED')}>Rejeter</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>

                <Panel title="Règles de commission" icon={ReceiptText}>
                  <div className="space-y-3">
                    {state.commissionRules.map((rule) => (
                      <div key={rule.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-black">{rule.scope} · {rule.target}</p>
                            <p className="text-sm text-slate-600">Ville : {rule.city}</p>
                          </div>
                          <span className="text-2xl font-black text-emerald-700">{rule.rate}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            </div>
          )}

          {active === 'kyc' && (
            <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
              <Panel title="Soumettre KYC" icon={FileCheck2}>
                <form action={submitKyc} className="space-y-4">
                  <Field label="Type"><Select name="type"><option>Particulier</option><option>Entreprise</option></Select></Field>
                  <Field label="Ville"><Select name="city">{cities.map((city) => <option key={city}>{city}</option>)}</Select></Field>
                  <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                    <b>Particulier :</b> carte d’identité + selfie.<br />
                    <b>Entreprise :</b> RCCM, ID Nat, numéro fiscal, adresse.
                  </div>
                  <Button className="w-full"><FileCheck2 className="h-4 w-4" /> Envoyer dossier</Button>
                </form>
              </Panel>
              <Panel title="Validation identité" icon={UserCheck}>
                <div className="grid gap-3">
                  {state.kyc.map((record) => {
                    const user = state.users.find((item) => item.id === record.userId);
                    return (
                      <div key={record.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-black">{user?.name || record.userId}</p>
                            <p className="mt-1 text-sm text-slate-600">{record.type} · {record.city} · {record.documents.join(', ')}</p>
                          </div>
                          <Badge>{record.status}</Badge>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button variant="light" onClick={() => updateCollection('kyc', record.id, { status: 'VERIFIED' })}>Valider</Button>
                          <Button variant="danger" onClick={() => updateCollection('kyc', record.id, { status: 'REJECTED' })}>Rejeter</Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Panel>
            </div>
          )}

          {active === 'messaging' && (
            <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
              <Panel title="Nouveau message" icon={MessageCircle}>
                <form action={sendMessage} className="space-y-4">
                  <Field label="Canal"><Select name="channel"><option>Acheteur ↔ Vendeur</option><option>Client ↔ Chauffeur</option><option>Client ↔ Support</option><option>Administration ↔ Utilisateur</option></Select></Field>
                  <Field label="Destinataire"><Input name="to" required defaultValue="Support Nexora" /></Field>
                  <Field label="Message"><Textarea name="text" required /></Field>
                  <Button className="w-full"><Mail className="h-4 w-4" /> Envoyer</Button>
                </form>
              </Panel>
              <Panel title="Boîte de messagerie" icon={MessageCircle}>
                <div className="space-y-3">
                  {state.messages.map((message) => (
                    <div key={message.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-black">{message.channel}</p>
                          <p className="mt-1 text-sm text-slate-600">{message.from} → {message.to}</p>
                        </div>
                        <Badge>{message.status}</Badge>
                      </div>
                      <p className="mt-3 text-sm font-medium text-slate-800">{message.text}</p>
                      <Button className="mt-3" variant="light" onClick={() => updateCollection('messages', message.id, { status: 'CLOSED' })}>Clôturer</Button>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          )}

          {active === 'profile' && (
            <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
              <Panel title="Mon profil" icon={UserCircle}>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                    {currentUser.avatarUrl ? <img src={currentUser.avatarUrl} alt="" className="h-full w-full object-cover" /> : <UserCircle className="h-12 w-12 text-slate-400" />}
                  </div>
                  <div>
                    <p className="font-black">{currentUser.name}</p>
                    <p className="text-sm font-semibold text-slate-600">{currentUser.role} · {currentUser.city}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge>{currentUser.kycStatus}</Badge>
                      <Badge>{currentUser.status || 'ACTIVE'}</Badge>
                    </div>
                  </div>
                </div>
                <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm font-black text-slate-600 hover:border-emerald-400 hover:bg-emerald-50">
                  <Upload className="h-4 w-4" />
                  Importer photo de profil
                  <input type="file" accept="image/*" className="hidden" onChange={uploadAvatar} />
                </label>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">Disponible</p><p className="mt-1 font-black">{currency(currentUser.availableBalance || 0)}</p></div>
                  <div className="rounded-lg bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">Bloque</p><p className="mt-1 font-black">{currency(currentUser.blockedBalance || 0)}</p></div>
                </div>
              </Panel>

              <Panel title="Informations du compte" icon={FileCheck2}>
                <form action={updateProfile} className="grid gap-4 md:grid-cols-2">
                  <Field label="Nom"><Input name="name" required defaultValue={currentUser.name} /></Field>
                  <Field label="Role"><Input value={currentUser.role} readOnly /></Field>
                  <Field label="Email"><Input name="email" type="email" required defaultValue={currentUser.email} /></Field>
                  <Field label="Telephone"><Input name="phone" required defaultValue={currentUser.phone} /></Field>
                  <Field label="Ville"><Select name="city" defaultValue={currentUser.city}>{cities.map((city) => <option key={city}>{city}</option>)}</Select></Field>
                  <Field label="Entreprise"><Input name="companyName" defaultValue={currentUser.companyName || ''} /></Field>
                  <Field label="Adresse"><Input name="address" defaultValue={currentUser.address || ''} /></Field>
                  <div className="flex items-end gap-2">
                    <Button className="w-full"><UserCheck className="h-4 w-4" /> Sauvegarder</Button>
                  </div>
                </form>
                <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-black">Securite compte</p>
                  <p className="mt-1 text-sm font-semibold text-slate-600">La prochaine etape backend active mot de passe chiffre, session serveur, OTP et validation email/SMS.</p>
                </div>
              </Panel>
            </div>
          )}

          {active === 'admin' && (
            <div className="space-y-6">
              <Panel title="Session, rôle et périmètre ville" icon={ShieldCheck}>
                <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
                  <Field label="Utilisateur simulé">
                    <Select value={state.currentUserId} onChange={(event) => patch({ currentUserId: event.target.value })}>
                      {state.users.map((user) => <option key={user.id} value={user.id}>{user.name} · {user.role} · {user.city}</option>)}
                    </Select>
                  </Field>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Périmètre actif</p>
                    <p className="mt-1 font-black">{isNationalScope ? 'Toutes les villes RDC' : currentUser.city}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-600">{currentUser.role}</p>
                  </div>
                </div>
              </Panel>
              <Panel title="Créer un compte unique" icon={Users}>
                <form action={addUser} className="grid gap-4 md:grid-cols-3">
                  <Field label="Nom"><Input name="name" required /></Field>
                  <Field label="Rôle"><Select name="role">{roles.map((role) => <option key={role}>{role}</option>)}</Select></Field>
                  <Field label="Ville"><Select name="city">{cities.map((city) => <option key={city}>{city}</option>)}</Select></Field>
                  <Field label="Téléphone"><Input name="phone" required /></Field>
                  <Field label="Email"><Input name="email" type="email" required /></Field>
                  <div className="flex items-end"><Button className="w-full"><Plus className="h-4 w-4" /> Créer utilisateur</Button></div>
                </form>
              </Panel>

              <div className="grid gap-6 xl:grid-cols-2">
                <Panel title="Utilisateurs et rôles" icon={ShieldCheck}>
                  <div className="space-y-3">
                    {scopedUsers.map((user) => (
                      <div key={user.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-black">{user.name}</p>
                            <p className="text-sm text-slate-600">{user.email} · {user.city}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge>{user.role}</Badge>
                            <Badge>{user.kycStatus}</Badge>
                            <Badge>{user.status || 'ACTIVE'}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>

                <Panel title="Sécurité système" icon={Lock}>
                  <div className="grid gap-3">
                    {[
                      'JWT + Refresh token',
                      'OTP SMS et OTP Email',
                      'Authentification à deux facteurs',
                      'RBAC multi-rôles',
                      'Audit logs',
                      'Anti-fraude et rate limiting',
                      'Protection XSS / CSRF / injection',
                      'Sauvegardes automatiques',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        <span className="font-bold">{item}</span>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            </div>
          )}
        </div>
      </div>
      {selectedProduct && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="mx-auto max-w-5xl rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Fiche produit</p>
                <h3 className="text-xl font-black">{selectedProduct.name}</h3>
              </div>
              <button onClick={() => setSelectedProductId('')} className="rounded-lg border border-slate-200 p-2"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-6 p-5 lg:grid-cols-[1fr_380px]">
              <div>
                <img src={selectedProduct.imageUrl || imageForCategory(selectedProduct.category)} alt="" className="h-80 w-full rounded-lg bg-slate-100 object-cover" />
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-lg bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">Categorie</p><p className="mt-1 font-black">{selectedProduct.category}</p></div>
                  <div className="rounded-lg bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">Origine</p><p className="mt-1 font-black">{selectedProduct.origin || 'RDC'}</p></div>
                  <div className="rounded-lg bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">Delai</p><p className="mt-1 font-black">{selectedProduct.leadTime || 'A negocier'}</p></div>
                </div>
                <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <p className="font-black text-emerald-900">Trade Assurance Nexora</p>
                  <p className="mt-1 text-sm font-semibold text-emerald-800">Paiement escrow, fournisseur verifie, preuve de livraison et litige arbitre par Nexora.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-500">Prix detail</p>
                      <p className="text-3xl font-black text-slate-950">{currency(selectedProduct.price)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-500">Prix gros</p>
                      <p className="text-xl font-black text-emerald-700">{currency(selectedProduct.wholesalePrice || selectedProduct.price)}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                    <p><span className="block text-xs font-bold text-slate-500">MOQ</span><b>{selectedProduct.moq || 1}</b></p>
                    <p><span className="block text-xs font-bold text-slate-500">Stock</span><b>{selectedProduct.stock}</b></p>
                    <p><span className="block text-xs font-bold text-slate-500">SKU</span><b>{selectedProduct.sku}</b></p>
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  {(() => {
                    const supplier = state.users.find((user) => user.id === selectedProduct.sellerId);
                    return (
                      <>
                        <p className="text-xs font-bold text-slate-500">Fournisseur</p>
                        <p className="mt-1 font-black">{supplier?.name || selectedProduct.sellerId}</p>
                        <p className="text-sm font-semibold text-slate-600">{supplier?.city || selectedProduct.city} · {supplier?.supplierLevel || supplier?.kycStatus || 'STANDARD'}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge>{supplier?.kycStatus || 'PENDING'}</Badge>
                          <Badge>{selectedProduct.tradeAssurance ? 'TRADE_ASSURANCE' : 'DIRECT'}</Badge>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <div className="grid gap-2">
                  <Button onClick={() => addToCart(selectedProduct)}><Plus className="h-4 w-4" /> Ajouter au panier</Button>
                  <Button variant="light" onClick={() => createRfqFromProduct(selectedProduct)}><ReceiptText className="h-4 w-4" /> Demander prix de gros</Button>
                  <Button variant="light" onClick={() => contactSupplierForProduct(selectedProduct)}><MessageCircle className="h-4 w-4" /> Contacter fournisseur</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedSupplier && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="mx-auto max-w-4xl rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Boutique fournisseur</p>
                <h3 className="text-xl font-black">{selectedSupplier.name}</h3>
              </div>
              <button onClick={() => setSelectedSupplierId('')} className="rounded-lg border border-slate-200 p-2"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-5">
              <div className="grid gap-4 md:grid-cols-4">
                <Metric icon={BadgeCheck} label="KYC" value={selectedSupplier.kycStatus} note={selectedSupplier.supplierLevel || 'STANDARD'} />
                <Metric icon={ShoppingBag} label="Produits" value={state.products.filter((product) => product.sellerId === selectedSupplier.id).length} note="Catalogue actif" />
                <Metric icon={MapPin} label="Ville" value={selectedSupplier.city} note={selectedSupplier.address || 'Adresse'} />
                <Metric icon={Wallet} label="Escrow" value={currency(selectedSupplier.blockedBalance || 0)} note="Fonds bloques" />
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {state.products.filter((product) => product.sellerId === selectedSupplier.id).map((product) => (
                  <button key={product.id} onClick={() => setSelectedProductId(product.id)} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-left hover:border-emerald-300">
                    <img src={product.imageUrl || imageForCategory(product.category)} alt="" className="h-20 w-24 rounded-lg object-cover" />
                    <span>
                      <b className="block">{product.name}</b>
                      <span className="text-sm font-semibold text-slate-600">MOQ {product.moq || 1} · {currency(product.wholesalePrice || product.price)}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-2xl backdrop-blur lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          {[
            { id: 'home', label: 'Accueil', icon: HomeIcon },
            { id: 'market', label: 'Market', icon: ShoppingBag },
            { id: 'rfq', label: 'Devis', icon: ReceiptText },
            { id: 'wallet', label: 'Wallet', icon: Wallet },
            { id: 'profile', label: 'Profil', icon: UserCircle },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => setActive(item.id)} className={`flex flex-col items-center justify-center rounded-lg px-2 py-2 text-[11px] font-black ${active === item.id ? 'bg-emerald-100 text-emerald-800' : 'text-slate-500'}`}>
                <Icon className="h-5 w-5" />
                <span className="mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </main>
  );
}
