const knowledge = [
  {
    id: 'bug',
    modes: ['bug', 'support', 'admin'],
    keys: ['bug', 'erreur', 'probleme', 'bloque', 'ne marche', 'bugue', 'affiche pas', 'css', 'scroll', 'connexion'],
    title: 'Diagnostic bug',
    modules: ['Accueil', 'Login', 'Signup', 'Market', 'Panier', 'IA', 'Redux', 'API'],
    steps: [
      "Identifier la page, l'action exacte, le role et le resultat attendu.",
      'Verifier les champs obligatoires, le token de session, le role utilisateur et les erreurs reseau.',
      'Reproduire le bug puis classer la priorite : LOW, MEDIUM, HIGH ou CRITICAL.',
      'Creer un ticket avec capture, module, description et etapes de reproduction.',
    ],
  },
  {
    id: 'sourcing',
    modes: ['sourcing', 'seller'],
    keys: ['fournisseur', 'fabricant', 'sourcing', 'devis', 'rfq', 'prix gros', 'moq', 'echantillon', 'usine'],
    title: 'Assistant sourcing et RFQ',
    modules: ['Recherche', 'Fabricants verifies', 'RFQ', 'Messages', 'Trade Assurance'],
    steps: [
      'Preciser le produit, la quantite, le budget, le pays de livraison et le delai.',
      'Comparer fournisseurs verifies, MOQ, prix de gros, stock, delai et garanties.',
      'Envoyer une demande de devis pour recevoir plusieurs offres comparables.',
      'Convertir la meilleure offre en commande protegee par escrow.',
    ],
  },
  {
    id: 'payment',
    modes: ['payment', 'orders'],
    keys: ['paiement', 'escrow', 'remboursement', 'litige', 'assurance', 'wallet', 'carte', 'mobile money'],
    title: 'Paiement, escrow et protection',
    modules: ['Panier', 'Commandes', 'Wallet', 'Paiements', 'Litiges'],
    steps: [
      'Verifier le panier, le total, les taxes, le vendeur et le moyen de paiement.',
      'Bloquer les fonds en escrow avant la preparation de la commande.',
      'Liberer le paiement seulement apres preuve de livraison et validation acheteur.',
      'Ouvrir un litige si produit, quantite, delai ou qualite ne correspond pas.',
    ],
  },
  {
    id: 'seller',
    modes: ['seller', 'admin'],
    keys: ['vendeur', 'boutique', 'publier', 'stock', 'produit', 'catalogue', 'annonce', 'fournisseur'],
    title: 'Centre vendeur et fournisseur',
    modules: ['Boutique', 'Produits', 'Stock', 'Commandes', 'Retraits', 'KYC'],
    steps: [
      'Completer profil vendeur, entreprise, adresse et documents KYC.',
      'Publier produits avec photos, SKU, prix detail, prix gros, MOQ, stock et delai.',
      'Repondre aux RFQ, messages et demandes de personnalisation.',
      'Suivre commandes, fonds bloques, solde disponible et retraits.',
    ],
  },
  {
    id: 'delivery',
    modes: ['delivery', 'orders'],
    keys: ['livraison', 'logistique', 'transport', 'adresse', 'pays', 'region', 'code postal', 'tracking'],
    title: 'Livraison et logistique',
    modules: ['Adresse', 'Logistique', 'Suivi', 'Preuve de livraison', 'Support'],
    steps: [
      'Definir pays, ville, adresse libre, code postal et preference de livraison.',
      'Comparer livraison locale, nationale, internationale, express et fret.',
      'Associer transporteur, statut, numero de suivi et preuve de livraison.',
      'Garder la commande protegee jusqu a reception confirmee.',
    ],
  },
  {
    id: 'account',
    modes: ['profile', 'support', 'admin'],
    keys: ['compte', 'connexion', 'inscription', 'profil', 'kyc', 'securite', 'mot de passe', 'role'],
    title: 'Compte, profil et securite',
    modules: ['Login', 'Signup', 'Profil', 'KYC', 'Session', 'RBAC'],
    steps: [
      'Creer un compte avec informations libres : email, telephone, role, ville et adresse.',
      'Connecter le compte par email ou telephone, puis sauvegarder la session.',
      'Completer profil, entreprise, avatar, adresse et verification KYC.',
      'Verifier les droits par role : acheteur, vendeur, fournisseur, livreur ou admin.',
    ],
  },
  {
    id: 'ai',
    modes: ['sourcing', 'bug', 'support', 'seller', 'payment', 'delivery', 'orders', 'profile', 'admin'],
    keys: ['ia', 'assistant', 'intelligence', 'lens', 'image', 'recommandation', 'automatique'],
    title: 'IA Nexora',
    modules: ['Assistant IA', 'Recherche image', 'Recommandations', 'Bug report', 'Service request'],
    steps: [
      'Utiliser le mode adapte : sourcing, bugs, support, vendeur, paiement, livraison, commandes, profil ou admin.',
      'Poser une question precise avec module, role, symptome et objectif.',
      'L IA propose les controles, le module a ouvrir et l action suivante.',
      'Transformer le diagnostic en bug ou demande de service depuis les panneaux rapides.',
    ],
  },
];

const roleGuides = {
  VISITEUR: 'Connectez-vous ou creez un compte pour enregistrer les actions et suivre les demandes.',
  ACHETEUR: 'Priorite acheteur : recherche, panier, RFQ, paiement protege, suivi et litiges.',
  VENDEUR: 'Priorite vendeur : boutique, catalogue, stock, commandes, messages et retraits.',
  FOURNISSEUR: 'Priorite fournisseur : verification, RFQ, echantillons, devis, MOQ et delais.',
  LIVREUR: 'Priorite livraison : missions, adresse, preuve de livraison et statut de colis.',
  SUPER_ADMIN: 'Priorite admin : roles, moderation, KYC, audit, paiements, litiges et support.',
};

function normalize(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function scoreTopic(topic, text, context) {
  const keyScore = topic.keys.reduce((score, key) => score + (text.includes(normalize(key)) ? 3 : 0), 0);
  const modeScore = topic.modes.includes(context) ? 2 : 0;
  return keyScore + modeScore;
}

function selectTopic(message, context) {
  const text = normalize(message);
  return knowledge
    .map((topic) => ({ topic, score: scoreTopic(topic, text, context) }))
    .sort((a, b) => b.score - a.score)[0]?.topic || knowledge[1];
}

export function buildAiResponse({ message = '', context = 'sourcing', role = 'VISITEUR' }) {
  const mode = normalize(context) || 'sourcing';
  const userRole = String(role || 'VISITEUR').toUpperCase();
  const topic = selectTopic(message, mode);
  const roleGuide = roleGuides[userRole] || roleGuides.VISITEUR;
  const steps = topic.steps.map((step, index) => `${index + 1}. ${step}`).join('\n');
  const modules = topic.modules.join(', ');

  return [
    `Mode ${mode}. Role ${userRole}.`,
    `${topic.title}`,
    '',
    'Actions recommandees :',
    steps,
    '',
    `Modules a verifier : ${modules}.`,
    `Conseil role : ${roleGuide}`,
    "Prochaine action : ouvrez le module concerne ou utilisez Signaler un bug / Demander un service si le probleme doit etre suivi.",
  ].join('\n');
}
