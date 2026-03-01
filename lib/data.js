// Sample data for the website

// Portfolio / Réalisations
export const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: 'Système de Gestion Hôtelière',
    category: 'Logiciel',
    client: 'Hôtel Memling',
    description: 'Application complète de gestion hôtelière avec réservations, facturation et reporting.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
    technologies: ['React', 'Node.js', 'MongoDB'],
    year: 2024
  },
  {
    id: 2,
    title: 'Application Mobile E-commerce',
    category: 'Mobile',
    client: 'Boutique KinMarket',
    description: 'Application iOS/Android pour vente en ligne avec paiement Mobile Money.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600',
    technologies: ['React Native', 'Firebase', 'Stripe'],
    year: 2024
  },
  {
    id: 3,
    title: 'Site Web Corporate',
    category: 'Web',
    client: 'Mining Corp RDC',
    description: 'Site vitrine multilingue avec système de recrutement intégré.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
    technologies: ['Next.js', 'Tailwind', 'PostgreSQL'],
    year: 2023
  },
  {
    id: 4,
    title: 'Réseau Wi-Fi Entreprise',
    category: 'Réseau',
    client: 'Banque Centrale',
    description: 'Infrastructure Wi-Fi sécurisée pour 500+ utilisateurs avec portail captif.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600',
    technologies: ['MikroTik', 'UniFi', 'RADIUS'],
    year: 2024
  },
  {
    id: 5,
    title: 'Installation Starlink Business',
    category: 'Starlink',
    client: 'ONG Mercy Corps',
    description: 'Déploiement Starlink avec hotspot monétisé pour zones rurales.',
    image: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=600',
    technologies: ['Starlink', 'MikroTik', 'Voucher System'],
    year: 2024
  },
  {
    id: 6,
    title: 'ERP Gestion Commerciale',
    category: 'Logiciel',
    client: 'Import-Export SARL',
    description: 'Système complet de gestion: stocks, ventes, achats, comptabilité.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
    technologies: ['Python', 'Django', 'PostgreSQL'],
    year: 2023
  }
];

// Témoignages clients
export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Jean-Pierre Mukendi',
    role: 'Directeur Général',
    company: 'Hôtel Memling',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    content: 'NEXORA a transformé notre gestion hôtelière. Le système est fiable, rapide et notre équipe l\'a adopté facilement. Support technique excellent !',
    rating: 5
  },
  {
    id: 2,
    name: 'Marie Kabongo',
    role: 'Responsable IT',
    company: 'Banque Centrale',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    content: 'L\'installation du réseau Wi-Fi a été impeccable. Couverture parfaite, sécurité renforcée. L\'équipe NEXORA est très professionnelle.',
    rating: 5
  },
  {
    id: 3,
    name: 'Patrick Lumumba',
    role: 'Fondateur',
    company: 'KinMarket',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    content: 'Notre application mobile a boosté nos ventes de 300%. NEXORA comprend vraiment les besoins du marché congolais.',
    rating: 5
  },
  {
    id: 4,
    name: 'Sarah Mbuyi',
    role: 'Coordinatrice',
    company: 'ONG Mercy Corps',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    content: 'Starlink a changé la vie de nos communautés rurales. Installation rapide et formation complète. Merci NEXORA !',
    rating: 5
  }
];

// Technologies maîtrisées
export const TECHNOLOGIES = [
  { name: 'React', icon: '⚛️', category: 'Frontend' },
  { name: 'Next.js', icon: '▲', category: 'Frontend' },
  { name: 'React Native', icon: '📱', category: 'Mobile' },
  { name: 'Node.js', icon: '🟢', category: 'Backend' },
  { name: 'Python', icon: '🐍', category: 'Backend' },
  { name: 'MongoDB', icon: '🍃', category: 'Database' },
  { name: 'PostgreSQL', icon: '🐘', category: 'Database' },
  { name: 'MikroTik', icon: '📡', category: 'Network' },
  { name: 'Starlink', icon: '🛰️', category: 'Network' },
  { name: 'AWS', icon: '☁️', category: 'Cloud' },
  { name: 'Docker', icon: '🐳', category: 'DevOps' },
  { name: 'Tailwind', icon: '🎨', category: 'Frontend' }
];

// Services IT détaillés
export const IT_SERVICES = [
  {
    id: 'web',
    icon: 'Globe',
    title: { fr: 'Sites Web', en: 'Websites' },
    description: { 
      fr: 'Sites vitrines, e-commerce, applications web sur mesure',
      en: 'Showcase sites, e-commerce, custom web applications'
    },
    features: {
      fr: ['Site vitrine responsive', 'E-commerce complet', 'Portails web', 'Blogs & CMS', 'SEO optimisé', 'Hébergement inclus'],
      en: ['Responsive showcase site', 'Full e-commerce', 'Web portals', 'Blogs & CMS', 'SEO optimized', 'Hosting included']
    },
    startingPrice: 500
  },
  {
    id: 'mobile',
    icon: 'Smartphone',
    title: { fr: 'Applications Mobiles', en: 'Mobile Apps' },
    description: {
      fr: 'Apps iOS et Android natives ou cross-platform',
      en: 'Native or cross-platform iOS and Android apps'
    },
    features: {
      fr: ['iOS & Android', 'React Native', 'UI/UX moderne', 'Push notifications', 'Intégration API', 'Publication stores'],
      en: ['iOS & Android', 'React Native', 'Modern UI/UX', 'Push notifications', 'API integration', 'Store publishing']
    },
    startingPrice: 1500
  },
  {
    id: 'software',
    icon: 'Monitor',
    title: { fr: 'Logiciels de Gestion', en: 'Management Software' },
    description: {
      fr: 'ERP, CRM, gestion de stock, facturation, comptabilité',
      en: 'ERP, CRM, inventory, invoicing, accounting'
    },
    features: {
      fr: ['Gestion des stocks', 'Facturation & devis', 'Comptabilité', 'Gestion RH', 'Rapports & analytics', 'Multi-utilisateurs'],
      en: ['Inventory management', 'Invoicing & quotes', 'Accounting', 'HR management', 'Reports & analytics', 'Multi-user']
    },
    startingPrice: 2000
  },
  {
    id: 'maintenance',
    icon: 'Wrench',
    title: { fr: 'Maintenance & Support', en: 'Maintenance & Support' },
    description: {
      fr: 'Support technique, mises à jour, monitoring 24/7',
      en: 'Technical support, updates, 24/7 monitoring'
    },
    features: {
      fr: ['Support prioritaire', 'Mises à jour régulières', 'Monitoring 24/7', 'Sauvegardes auto', 'Corrections bugs', 'Évolutions mineures'],
      en: ['Priority support', 'Regular updates', '24/7 monitoring', 'Auto backups', 'Bug fixes', 'Minor evolutions']
    },
    startingPrice: 100
  }
];

// Statistiques
export const STATS = [
  { value: 150, suffix: '+', label: { fr: 'Clients Satisfaits', en: 'Happy Clients' } },
  { value: 200, suffix: '+', label: { fr: 'Projets Réalisés', en: 'Projects Completed' } },
  { value: 5, suffix: '', label: { fr: 'Années d\'Expérience', en: 'Years Experience' } },
  { value: 24, suffix: '/7', label: { fr: 'Support Disponible', en: 'Support Available' } }
];

// Process / Comment ça marche
export const PROCESS_STEPS = [
  {
    step: 1,
    icon: 'MessageCircle',
    title: { fr: 'Consultation', en: 'Consultation' },
    description: { fr: 'Échange sur vos besoins et objectifs', en: 'Discussion about your needs and goals' }
  },
  {
    step: 2,
    icon: 'FileText',
    title: { fr: 'Proposition', en: 'Proposal' },
    description: { fr: 'Devis détaillé et planning du projet', en: 'Detailed quote and project timeline' }
  },
  {
    step: 3,
    icon: 'Code',
    title: { fr: 'Développement', en: 'Development' },
    description: { fr: 'Réalisation avec suivi régulier', en: 'Implementation with regular updates' }
  },
  {
    step: 4,
    icon: 'Rocket',
    title: { fr: 'Livraison', en: 'Delivery' },
    description: { fr: 'Déploiement, formation et support', en: 'Deployment, training and support' }
  }
];

// Partenaires / Marques
export const PARTNERS = [
  { name: 'Starlink', logo: '🛰️' },
  { name: 'MikroTik', logo: '📡' },
  { name: 'Ubiquiti', logo: '📶' },
  { name: 'AWS', logo: '☁️' },
  { name: 'Google Cloud', logo: '🔷' },
  { name: 'MongoDB', logo: '🍃' }
];
