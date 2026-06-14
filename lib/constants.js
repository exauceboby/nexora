// Site Configuration
const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || process.env.APP_DOMAIN || '';
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || process.env.CONTACT_EMAIL || '';
const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || process.env.SUPPORT_PHONE || '';

export const SITE_CONFIG = {
  name: 'NEXORA Technologies & Networks',
  shortName: 'NEXORA NTN',
  domain: appDomain,
  altDomain: '',
  logo: 'https://customer-assets.emergentagent.com/job_94cf8909-296f-44a1-a69a-2729ddef30af/artifacts/8xtvoluc_logo.png',
  logoDark: 'https://customer-assets.emergentagent.com/job_94cf8909-296f-44a1-a69a-2729ddef30af/artifacts/cjyvoesc_NEXORA%202.png',
  
  // CEO Info
  ceo: {
    name: 'Exaucé BOBY ZAKUDA',
    role: 'CEO / PDG',
    title: 'Ingénieur réseau (Starlink • MikroTik • Wi-Fi)',
    photo: '/images/ceo.jpg',
    country: 'RDC'
  },
  
  // Contact Info
  contact: {
    phones: [
      supportPhone
    ],
    email: contactEmail,
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || process.env.WHATSAPP || '',
    website: appDomain
  },
  
  // Social Links
  social: {
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: ''
  }
};

// User Roles
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',      // Accès total
  ADMIN: 'admin',                   // Gestion complète
  MANAGER: 'manager',               // Gestion stock et ventes
  SALES: 'sales',                   // Vendeur - ventes et reçus
  STOCK_KEEPER: 'stock_keeper',     // Gestionnaire de stock
  ACCOUNTANT: 'accountant',         // Comptable - rapports financiers
  MARKETING: 'marketing',           // Publicités et promotions
};

// Role Permissions
export const ROLE_PERMISSIONS = {
  super_admin: ['all'],
  admin: ['products', 'stock', 'orders', 'users', 'leads', 'articles', 'ads', 'reports', 'settings'],
  manager: ['products', 'stock', 'orders', 'reports'],
  sales: ['orders', 'receipts', 'products_view'],
  stock_keeper: ['stock', 'products_view'],
  accountant: ['reports', 'orders_view'],
  marketing: ['ads', 'articles', 'products_view'],
};

// Order Statuses
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  MOBILE_MONEY: 'mobile_money',
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
  WHATSAPP: 'whatsapp'  // Contact via WhatsApp for payment
};

// Product Categories (default)
export const DEFAULT_CATEGORIES = [
  { name: 'Starlink', slug: 'starlink', icon: 'satellite' },
  { name: 'Téléphones', slug: 'phones', icon: 'smartphone' },
  { name: 'Accessoires', slug: 'accessories', icon: 'headphones' },
  { name: 'Réseaux', slug: 'network', icon: 'wifi' },
  { name: 'Services', slug: 'services', icon: 'wrench' },
];

// Currency
export const CURRENCY = {
  code: 'USD',
  symbol: '$',
  name: 'US Dollar'
};
