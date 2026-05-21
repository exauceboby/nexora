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

// 3 PILIERS — Positionnement stratégique NEXORA
export const CORE_PILLARS = [
  {
    id: 'starlink',
    icon: 'Satellite',
    badge: { fr: 'PARTENAIRE OFFICIEL', en: 'OFFICIAL PARTNER' },
    title: { fr: 'Starlink Entreprise', en: 'Starlink Business' },
    tagline: { fr: 'Internet haut débit partout en RDC', en: 'High-speed internet anywhere in DRC' },
    description: {
      fr: 'Installation professionnelle, configuration sécurisée et activation rapide pour entreprises, hôtels, ONG et zones reculées.',
      en: 'Professional installation, secure configuration and rapid activation for businesses, hotels, NGOs and remote areas.'
    },
    bullets: {
      fr: ['Installation certifiée < 48h', 'Configuration MikroTik incluse', 'Activation & support inclus', 'Couverture nationale RDC'],
      en: ['Certified install < 48h', 'MikroTik config included', 'Activation & support included', 'DRC nationwide coverage']
    },
    color: 'from-blue-600 to-cyan-500',
    cta: { fr: 'Installer Starlink', en: 'Install Starlink' },
    page: 'starlink'
  },
  {
    id: 'network',
    icon: 'Wifi',
    badge: { fr: 'EXPERTISE', en: 'EXPERTISE' },
    title: { fr: 'Infrastructure Réseau', en: 'Network Infrastructure' },
    tagline: { fr: 'Réseaux pro, hotspots & supervision', en: 'Pro networks, hotspots & monitoring' },
    description: {
      fr: 'Conception, câblage, hotspots professionnels, MikroTik, sécurité, supervision à distance — pour PME, hôtels et grandes entreprises.',
      en: 'Design, cabling, professional hotspots, MikroTik, security, remote monitoring — for SMBs, hotels and enterprises.'
    },
    bullets: {
      fr: ['Conception & câblage structuré', 'Hotspots vouchers (hôtels)', 'VPN & sécurité firewall', 'Supervision 24/7 à distance'],
      en: ['Structured design & cabling', 'Hotspot vouchers (hotels)', 'VPN & firewall security', 'Remote monitoring 24/7']
    },
    color: 'from-orange-500 to-amber-500',
    cta: { fr: 'Demander un Audit', en: 'Request an Audit' },
    page: 'services'
  },
  {
    id: 'smart',
    icon: 'Layers',
    badge: { fr: 'INNOVATION', en: 'INNOVATION' },
    title: { fr: 'Solutions Intelligentes', en: 'Smart Solutions' },
    tagline: { fr: 'Digitalisation & logiciels métiers', en: 'Digitalization & business software' },
    description: {
      fr: 'Logiciels de gestion sur mesure, applications web/mobile, vidéosurveillance IP et automatisation pour digitaliser votre activité.',
      en: 'Custom management software, web/mobile apps, IP surveillance and automation to digitalize your business.'
    },
    bullets: {
      fr: ['ERP / CRM / Gestion stocks', 'Apps mobiles iOS & Android', 'Vidéosurveillance IP', 'Tableaux de bord temps réel'],
      en: ['ERP / CRM / Inventory', 'iOS & Android mobile apps', 'IP video surveillance', 'Real-time dashboards']
    },
    color: 'from-violet-600 to-purple-500',
    cta: { fr: 'Discuter du Projet', en: 'Discuss Project' },
    page: 'services'
  }
];

// PACKS DE SERVICE — Offres packagées pour conversion business
export const SERVICE_PACKAGES = [
  {
    id: 'pme',
    icon: 'Briefcase',
    name: { fr: 'Pack PME Starlink', en: 'SMB Starlink Pack' },
    target: { fr: 'PME — 5 à 30 utilisateurs', en: 'SMBs — 5 to 30 users' },
    price: { fr: 'Sur devis', en: 'Custom quote' },
    badge: null,
    color: 'from-blue-500 to-cyan-500',
    features: {
      fr: [
        'Kit Starlink Business installé',
        'Routeur MikroTik configuré',
        'Wi-Fi sécurisé multi-zones',
        'Configuration VPN & firewall',
        '1 mois de support inclus',
        'Formation utilisateurs'
      ],
      en: [
        'Starlink Business kit installed',
        'Configured MikroTik router',
        'Secure multi-zone Wi-Fi',
        'VPN & firewall setup',
        '1 month support included',
        'User training'
      ]
    }
  },
  {
    id: 'hotel',
    icon: 'Building',
    name: { fr: 'Pack Hôtel & Restaurant', en: 'Hotel & Restaurant Pack' },
    target: { fr: 'Hôtels, restos, lounges', en: 'Hotels, restaurants, lounges' },
    price: { fr: 'Sur devis', en: 'Custom quote' },
    badge: { fr: 'LE + POPULAIRE', en: 'MOST POPULAR' },
    color: 'from-amber-500 to-orange-500',
    features: {
      fr: [
        'Hotspot professionnel avec portail captif',
        'Système de vouchers / tickets Wi-Fi',
        'Limitation de débit par utilisateur',
        'Monitoring en temps réel',
        'Couverture multi-étages',
        'Maintenance & supervision'
      ],
      en: [
        'Professional hotspot with captive portal',
        'Voucher / Wi-Fi ticket system',
        'Per-user bandwidth limiting',
        'Real-time monitoring',
        'Multi-floor coverage',
        'Maintenance & supervision'
      ]
    }
  },
  {
    id: 'enterprise',
    icon: 'Shield',
    name: { fr: 'Pack Entreprise', en: 'Enterprise Pack' },
    target: { fr: 'Grandes entreprises, ONG, banques', en: 'Large companies, NGOs, banks' },
    price: { fr: 'Sur devis', en: 'Custom quote' },
    badge: null,
    color: 'from-violet-600 to-indigo-600',
    features: {
      fr: [
        'Réseau redondant Starlink + fibre',
        'VPN site-à-site sécurisé',
        'Pare-feu d\'entreprise',
        'Backup automatique',
        'Supervision NOC 24/7',
        'SLA & rapports mensuels'
      ],
      en: [
        'Redundant Starlink + fiber network',
        'Secure site-to-site VPN',
        'Enterprise firewall',
        'Automatic backup',
        '24/7 NOC monitoring',
        'SLA & monthly reports'
      ]
    }
  }
];

// MAINTENANCE PLANS — Revenu récurrent
export const MAINTENANCE_PLANS = [
  {
    id: 'essential',
    name: { fr: 'Essentiel', en: 'Essential' },
    period: { fr: '/ mois', en: '/ month' },
    description: { fr: 'Pour les TPE & petits réseaux', en: 'For micro-businesses & small networks' },
    color: 'from-gray-700 to-gray-900',
    popular: false,
    features: {
      fr: [
        'Support technique heures ouvrables',
        'Interventions à distance',
        'Mises à jour mensuelles',
        'Sauvegardes hebdomadaires',
        'Rapport mensuel'
      ],
      en: [
        'Business-hours tech support',
        'Remote interventions',
        'Monthly updates',
        'Weekly backups',
        'Monthly report'
      ]
    }
  },
  {
    id: 'pro',
    name: { fr: 'Pro', en: 'Pro' },
    period: { fr: '/ mois', en: '/ month' },
    description: { fr: 'PME & hôtels en croissance', en: 'Growing SMBs & hotels' },
    color: 'from-blue-600 to-cyan-500',
    popular: true,
    features: {
      fr: [
        'Support prioritaire 7j/7',
        'Intervention sur site (1/mois)',
        'Monitoring 24/7',
        'Sauvegardes quotidiennes',
        'Mises à jour de sécurité',
        'Optimisation trimestrielle'
      ],
      en: [
        'Priority support 7d/7',
        'On-site visit (1/month)',
        '24/7 monitoring',
        'Daily backups',
        'Security updates',
        'Quarterly optimization'
      ]
    }
  },
  {
    id: 'entreprise',
    name: { fr: 'Entreprise', en: 'Enterprise' },
    period: { fr: '/ mois', en: '/ month' },
    description: { fr: 'Infrastructure critique', en: 'Critical infrastructure' },
    color: 'from-violet-600 to-indigo-600',
    popular: false,
    features: {
      fr: [
        'Support 24/7 avec SLA',
        'Interventions illimitées',
        'NOC supervision dédiée',
        'Ingénieur référent assigné',
        'Audit sécurité annuel',
        'Rapports détaillés mensuels',
        'Plan de continuité d\'activité'
      ],
      en: [
        '24/7 support with SLA',
        'Unlimited interventions',
        'Dedicated NOC supervision',
        'Assigned reference engineer',
        'Annual security audit',
        'Detailed monthly reports',
        'Business continuity plan'
      ]
    }
  }
];
