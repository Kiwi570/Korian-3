// ============================================
// KOKBIF CONSTANTS
// ============================================

export const APP_NAME = 'Kokbif'
export const APP_TAGLINE = 'Votre temps, simplifié.'
export const APP_VERSION = '1.0.0'

// Stats Hero
export const HERO_STATS = [
  { value: 150, suffix: '+', label: 'Consultants actifs', icon: '👥' },
  { value: 98, suffix: '%', label: 'Satisfaction', icon: '⭐' },
  { value: 24, suffix: 'h', label: 'Approbation max', icon: '⚡' },
  { value: 4, suffix: 'h', label: 'Gagnées/semaine', icon: '🎯' },
]

// Morphing words for Hero
export const MORPHING_WORDS = [
  { text: 'précieux', color: 'from-gold-400 to-amber-500' },
  { text: 'simplifié', color: 'from-emerald-400 to-teal-500' },
  { text: 'valorisé', color: 'from-violet-400 to-purple-500' },
  { text: 'optimisé', color: 'from-rose-400 to-pink-500' },
]

// Problems
export const PROBLEMS = [
  {
    icon: 'FileSpreadsheet',
    title: 'Fichiers Excel éparpillés',
    description: 'Timesheets perdus dans les emails, versions multiples, erreurs de saisie fréquentes.',
    stat: '67%',
    statLabel: 'perdent des données',
    color: 'rose',
  },
  {
    icon: 'Clock',
    title: 'Heures perdues',
    description: 'Saisie manuelle répétitive, relances par email, approbations interminables.',
    stat: '4h',
    statLabel: 'perdues/semaine',
    color: 'amber',
  },
  {
    icon: 'AlertTriangle',
    title: 'Non-conformité',
    description: 'Jours fériés oubliés, règles des 40h non respectées, risques légaux.',
    stat: '23%',
    statLabel: 'non conformes',
    color: 'violet',
  },
  {
    icon: 'BarChart3',
    title: 'Aucune visibilité',
    description: 'Pas de suivi en temps réel, reporting manuel fastidieux.',
    stat: '0',
    statLabel: 'dashboard',
    color: 'blue',
  },
]

// Features
export const FEATURES = [
  {
    icon: 'Clock',
    title: 'Timesheet intelligent',
    description: 'Calendrier interactif avec jours fériés luxembourgeois, saisie rapide et validation automatique.',
    badge: 'Populaire',
    color: 'gold',
    size: 'large',
    benefits: ['Jours fériés LU pré-remplis', 'Multi-projets', 'Validation instantanée'],
  },
  {
    icon: 'CalendarDays',
    title: 'Gestion des congés',
    description: 'Demandez et suivez vos congés en 3 clics. Solde en temps réel.',
    badge: null,
    color: 'emerald',
    size: 'normal',
    benefits: ['Demande en 3 clics', 'Solde temps réel', 'Demi-journées supportées'],
  },
  {
    icon: 'BarChart3',
    title: 'Dashboard analytics',
    description: 'Visualisez vos heures et tendances avec des graphiques interactifs.',
    badge: 'Nouveau',
    color: 'violet',
    size: 'normal',
    benefits: ['Graphiques interactifs', 'Export PDF', 'Historique complet'],
  },
  {
    icon: 'Trophy',
    title: 'Gamification',
    description: 'Gagnez des XP, débloquez des badges, montez de niveau.',
    badge: null,
    color: 'amber',
    size: 'normal',
    benefits: ['Système XP & niveaux', '15 badges à débloquer', 'Leaderboard équipe'],
  },
  {
    icon: 'Shield',
    title: 'Conforme Luxembourg',
    description: '100% conforme aux règles locales. RGPD, droit du travail.',
    badge: null,
    color: 'blue',
    size: 'normal',
    benefits: ['RGPD compliant', 'Droit du travail LU', 'Données sécurisées'],
  },
  {
    icon: 'Zap',
    title: '100% Responsive',
    description: 'Accédez depuis n\'importe quel appareil, partout.',
    badge: null,
    color: 'rose',
    size: 'normal',
    benefits: ['Mobile & tablette', 'Mode hors-ligne', 'Sync instantanée'],
  },
]

// Testimonials
export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Marie Dupont',
    role: 'Senior Consultant',
    company: 'BGL BNP Paribas',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    content: 'Kokbif a révolutionné ma gestion du temps. Je gagne facilement 4 heures par semaine !',
    rating: 5,
    featured: true,
  },
  {
    id: 2,
    name: 'Thomas Weber',
    role: 'Développeur Full Stack',
    company: 'POST Luxembourg',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    content: 'Fini les tableurs Excel ! Tout est centralisé, simple et rapide.',
    rating: 5,
    featured: false,
  },
  {
    id: 3,
    name: 'Julie Martin',
    role: 'Chef de Projet',
    company: 'Clearstream',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    content: 'Les demandes de congés sont approuvées en quelques heures. Le workflow est parfait.',
    rating: 5,
    featured: false,
  },
  {
    id: 4,
    name: 'Pierre Durand',
    role: 'Consultant SAP',
    company: 'Deloitte',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    content: 'Enfin un outil qui comprend les spécificités du Luxembourg !',
    rating: 5,
    featured: false,
  },
  {
    id: 5,
    name: 'Sophie Keller',
    role: 'Business Analyst',
    company: 'SES',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    content: 'Le dashboard est génial pour suivre mes heures en temps réel.',
    rating: 5,
    featured: true,
  },
  {
    id: 6,
    name: 'Lucas Bernard',
    role: 'DevOps Engineer',
    company: 'Amazon Luxembourg',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    content: 'La gamification rend la saisie des heures presque fun !',
    rating: 5,
    featured: false,
  },
]

// Process steps
export const PROCESS_STEPS = [
  {
    number: '01',
    icon: 'UserPlus',
    title: 'Créez votre compte',
    description: 'Inscription en 30 secondes avec votre email. Gratuit, sans engagement.',
    tags: ['Gratuit', '30 sec'],
    color: 'blue',
    duration: '30 secondes',
  },
  {
    number: '02',
    icon: 'Clock',
    title: 'Saisissez vos heures',
    description: 'Interface intuitive avec calendrier. Jours fériés LU pré-remplis.',
    tags: ['Calendrier LU', 'Simple'],
    color: 'gold',
    duration: '2 minutes',
  },
  {
    number: '03',
    icon: 'Send',
    title: 'Soumettez en 1 clic',
    description: 'Validez et envoyez automatiquement à votre manager.',
    tags: ['1 clic', 'Notification'],
    color: 'emerald',
    duration: '1 clic',
  },
  {
    number: '04',
    icon: 'PartyPopper',
    title: 'Approuvé !',
    description: 'Votre manager approuve en quelques secondes depuis son mobile.',
    tags: ['< 24h', 'Mobile'],
    color: 'violet',
    duration: '< 24 heures',
  },
]

// Client logos
export const CLIENT_LOGOS = [
  { name: 'BGL BNP Paribas', initials: 'BGL', color: '#009639' },
  { name: 'POST Luxembourg', initials: 'POST', color: '#FFCC00' },
  { name: 'SES', initials: 'SES', color: '#00A0E3' },
  { name: 'Clearstream', initials: 'CS', color: '#00205B' },
  { name: 'Spuerkeess', initials: 'BCEE', color: '#e30613' },
  { name: 'Deloitte', initials: 'DL', color: '#86bc25' },
]

// Contact info
export const CONTACT_INFO = {
  address: '31, Porte de France, L-4360 Esch-sur-Alzette',
  phone: '+352 20 60 08 83',
  email: 'contact@kokbif.com',
  website: 'https://www.kokbif.com',
}

// Footer links
export const FOOTER_LINKS = [
  {
    title: 'Produit',
    links: [
      { label: 'Fonctionnalités', href: '#features' },
      { label: 'Témoignages', href: '#testimonials' },
      { label: 'Process', href: '#process' },
    ],
  },
  {
    title: 'Entreprise',
    links: [
      { label: 'À propos', href: '#' },
      { label: 'Carrières', href: '#' },
      { label: 'Contact', href: '#cta' },
    ],
  },
  {
    title: 'Légal',
    links: [
      { label: 'Mentions légales', href: '/legal#mentions' },
      { label: 'Confidentialité', href: '/legal#privacy' },
      { label: 'CGU', href: '/legal#cgu' },
    ],
  },
]

// Social links
export const SOCIAL_LINKS = [
  { icon: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/company/kokbif' },
  { icon: 'twitter', label: 'Twitter', href: 'https://twitter.com/kokbif' },
  { icon: 'github', label: 'GitHub', href: 'https://github.com/kokbif' },
]

// Navigation links
export const NAV_LINKS = [
  { label: 'Fonctionnalités', href: '#features' },
  { label: 'Témoignages', href: '#testimonials' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#cta' },
]
