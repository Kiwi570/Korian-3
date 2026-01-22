# 🚀 Kokbif V2 - Plateforme de Gestion du Temps

> **Kokbif** - Votre temps, simplifié. Une plateforme moderne et gamifiée pour la gestion des timesheets et congés, conçue pour les consultants IT au Luxembourg.

![Version](https://img.shields.io/badge/version-2.0.0-gold)
![React](https://img.shields.io/badge/React-18.2-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)

---

## ✨ Fonctionnalités

### 🎯 Consultant
- **Dashboard personnalisé** avec stats en temps réel, streak de jours, XP et niveau
- **Timesheet intelligent** avec calendrier interactif, jours fériés LU pré-remplis, multi-projets
- **Gestion des congés** avec demi-journées, types variés (CP, RTT, maladie...), soldes en temps réel
- **Gamification** : 15 badges à débloquer, système XP, leaderboard, confetti celebrations 🎉

### 👔 Manager
- **Vue équipe complète** : 12 consultants avec statuts, alertes retards, rappels automatiques
- **Approbations** : workflow fluide, approbation en 1 clic, "Tout approuver", refus avec motif
- **Reports & Analytics** : graphiques heures/semaine, répartition par client, top performers

### 🔔 Système de Notifications
- Notifications bidirectionnelles (consultant ↔ manager)
- Toasts avec auto-dismiss
- Badge de notification avec indicateur nouveau

### 🎨 Design Premium
- Dark mode élégant (dark-950 + gold-500)
- Animations fluides avec Framer Motion
- 100% Responsive (mobile-first)
- Micro-interactions soignées

---

## 🏃 Installation & Lancement

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation

```bash
# 1. Extraire le ZIP
unzip kokbif-v2-perfect.zip
cd kokbif-v2-perfect

# 2. Installer les dépendances
npm install

# 3. Lancer en mode développement
npm run dev

# 4. Ouvrir dans le navigateur
# http://localhost:5173
```

### Build Production

```bash
npm run build
npm run preview
```

---

## 🔑 Comptes de Démonstration

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| **Consultant** | paul.martin@kokbif.com | demo123 |
| **Manager** | korian.dupont@kokbif.com | demo123 |
| **Marie** | marie.dupont@kokbif.com | demo123 |

> 💡 Tous les comptes ont accès aux deux rôles via le toggle dans le header de l'app.

---

## 📁 Structure du Projet

```
src/
├── features/               # Features-based architecture
│   ├── landing/           # Page marketing
│   │   ├── sections/      # Hero, Features, Testimonials...
│   │   └── components/    # VideoModal, ScrollProgress
│   ├── auth/              # Login, Register, ForgotPassword
│   ├── onboarding/        # Parcours d'accueil 6 étapes
│   ├── consultant/        # Dashboard, Timesheet, Leave, Achievements
│   ├── manager/           # Dashboard, Team, Approvals, Reports
│   ├── settings/          # Paramètres utilisateur
│   └── legal/             # Mentions légales, CGU, Confidentialité
├── shared/
│   ├── components/ui/     # Button, Badge, Modal, Toast, Skeleton...
│   ├── context/           # AuthContext, AppContext
│   ├── hooks/             # Custom hooks
│   └── lib/               # Utils, Constants, Animations
└── App.jsx                # Routes et providers
```

---

## 🎮 Scénario de Démo Suggéré

1. **Landing** → Scroll les sections, cliquer "Commencer"
2. **Login** → `paul.martin@kokbif.com` / `demo123`
3. **Onboarding** → Parcours de bienvenue
4. **Dashboard Consultant** → Explorer les stats
5. **Timesheet** → Saisir 2-3 jours, multi-projets
6. **Soumettre** → Observer confetti + XP + toast
7. **Switch Manager** → Toggle dans le header
8. **Approvals** → Voir la demande, approuver
9. **Switch Consultant** → Voir notification de validation
10. **Achievements** → Explorer les badges débloqués

---

## 🛠️ Stack Technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| React | 18.2 | UI Framework |
| Vite | 5.0 | Build tool |
| Tailwind CSS | 3.4 | Styling |
| Framer Motion | 11.0 | Animations |
| React Router | 6.x | Routing |
| date-fns | 3.x | Dates |
| canvas-confetti | 1.x | Celebrations |
| Lucide React | 0.4 | Icons |

---

## 🎨 Thème & Couleurs

```css
/* Couleurs principales */
--gold-500: #F59E0B      /* Accent principal */
--dark-950: #030712      /* Background */
--dark-900: #0a0f1a      /* Cards */
--dark-800: #1a1f2e      /* Borders */

/* Couleurs sémantiques */
--emerald-500: #10B981   /* Success */
--amber-500: #F59E0B     /* Warning */
--rose-500: #F43F5E      /* Error */
--blue-500: #3B82F6      /* Info */
--violet-500: #8B5CF6    /* Accent */
```

---

## 📝 Données de Test

- **12 consultants** avec avatars, niveaux, streaks, projets
- **9 projets** multi-clients (BGL, POST, SES, Clearstream...)
- **6 semaines d'historique** de timesheets
- **5 demandes d'approbation** en attente
- **Congés équipe** avec calendrier visuel

---

## 🔒 Fonctionnalités Sécurité

- Authentification avec localStorage (démo)
- Protection des routes (ProtectedRoute)
- Redirection automatique selon rôle
- Session persistante

---

## 📱 Responsive Design

- **Mobile** : Navigation collapsible, cards empilées
- **Tablet** : Layout adapté, sidebar mini
- **Desktop** : Expérience complète, sidebar étendue

---

## 🚀 Prochaines Évolutions

- [ ] Backend API réel (Node.js/NestJS)
- [ ] Base de données PostgreSQL
- [ ] Export PDF CRA officiel
- [ ] Notifications push
- [ ] Intégration calendrier externe
- [ ] Mode hors-ligne (PWA)
- [ ] Thème clair
- [ ] Multi-langue (FR/EN/DE/LU)

---

## 📄 License

© 2026 Kokbif S.à r.l. - Tous droits réservés.

---

## 💬 Contact

- **Email** : contact@kokbif.com
- **Adresse** : 31, Porte de France, L-4360 Esch-sur-Alzette
- **Téléphone** : +352 20 60 08 83

---

Fait avec ❤️ au Luxembourg 🇱🇺
