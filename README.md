# 💰 Finance Track - Mobile App (React Native Expo)

**Finance Track** est une application mobile moderne conçue avec **React Native**, **Expo Router** et **TypeScript**, spécialement conçue pour suivre précisément ses finances personnelles avec un découpage temporel fluide : **jour par jour**, **semaine par semaine**, et **par mois**.

---

## ✨ Fonctionnalités Principales

### 1. 📅 Vues Temporelles Dédiées
- **Jour par Jour (Daily)** : Suivi détaillé des dépenses et revenus de la journée, transactions horodatées, indicateur d'évolution sur les 7 jours glissants.
- **Semaine par Semaine (Weekly)** : Synthèse hebdomadaire avec un graphique en barres des 7 jours (Lundi au Dimanche), mettant en avant le jour le plus dépensier et les tendances de consommation.
- **Par Mois (Monthly)** : Vue d'ensemble du mois en cours, répartition par tranche de semaine et suivi du rythme d'épargne.
- **Navigation Temporelle Intuitive** : Précédent / Suivant et bouton de retour rapide vers la période actuelle (*"Aujourd'hui"*, *"Cette semaine"*, *"Ce mois-ci"*).

### 2. 💳 Gestion Complète des Transactions
- Ajout ultra-rapide de transactions (Dépense / Revenu) depuis le bouton central `+`.
- Saisie du montant en grands chiffres lisibles avec devise (FCFA).
- Sélecteur de date via un calendrier mensuel natif (`DatePickerModal`).
- Option de récurrence mensuelle (marquée visuellement).
- **Suppression au glissement** (swipe) avec confirmation, ou appui long.

### 3. 💾 Persistance Hors-Ligne & Données de Démo
- Données persistées localement : **SQLite** (`expo-sqlite`) sur mobile, **AsyncStorage** sur le web.
- Écran de premier lancement (**Onboarding**) avec CTA unique.
- Jeu de données réaliste de démo pré-généré à la demande (permettant de tester immédiatement les vues jour, semaine et mois).
- Bouton de réinitialisation (zero-baseline / données de démo) disponible dans les réglages.

---

## 📂 Architecture du Projet

```text
finance-track/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Barre d'onglets flottante + FAB central
│   │   ├── index.tsx           # Tableau de bord (Solde, Graphique, Périodes, Dernières opérations)
│   │   └── transactions.tsx    # Historique complet avec recherche & filtres
│   ├── _layout.tsx             # Root layout (ThemeProvider, FinanceProvider, gate onboarding)
│   ├── onboarding.tsx          # Écran de bienvenue (premier lancement)
│   └── new-transaction.tsx     # Modal de création rapide de transaction
│
├── components/
│   ├── BalanceCard.tsx         # Carte de solde net & flux entrées/sorties
│   ├── DatePickerModal.tsx     # Calendrier mensuel natif (sélection de date)
│   ├── EmptyState.tsx          # Composant d'état vide avec CTA
│   ├── FinanceChart.tsx        # Graphique interactif adapté à la période (Jour/Semaine/Mois)
│   ├── PeriodSelector.tsx      # Sélecteur à 3 volets (Jour / Semaine / Mois) + navigation
│   └── TransactionItem.tsx     # Ligne de transaction (swipe-to-delete)
│
├── constants/
│   └── Colors.ts               # Palette sémantique unifiée (tokens clair & sombre)
│
├── context/
│   ├── FinanceContext.tsx      # Gestionnaire d'état central & calculs de périodes
│   └── ThemeContext.tsx        # Thème clair/sombre (source de vérité unique)
│
├── services/
│   ├── storage.ts              # Persistance native (SQLite) + générateur de données de démo
│   ├── storage.web.ts          # Persistance web (AsyncStorage)
│   └── storageShared.ts        # Types & helpers partagés entre plateformes
│
├── types/
│   └── finance.ts              # Définitions TypeScript complètes
│
└── utils/
    └── dateUtils.ts            # Fonctions utilitaires de calcul de dates (norme ISO & format FR)
```

---

## 🚀 Lancement du Projet

### Prérequis
- Node.js >= 18
- Application mobile **Expo Go** sur votre smartphone (iOS ou Android), ou un simulateur/émulateur configuré.
- Note : le stockage natif utilise `expo-sqlite`. Pour un build avec modules natifs, utilisez un development build (`npx expo run:ios|android` ou `eas build --profile development`).

### 1. Démarrer le serveur de développement Expo

```bash
cd finance-track
npm run start
```

### 2. Tester sur votre appareil
- **Sur iPhone / Android** : Scannez le QR Code affiché dans le terminal avec l'application Expo Go ou l'appareil photo.
- **Sur simulateur iOS** : Appuyez sur la touche `i` dans le terminal.
- **Sur émulateur Android** : Appuyez sur la touche `a` dans le terminal.
- **Sur navigateur Web** : Appuyez sur la touche `w` dans le terminal.

### 3. Vérifications (types & lint)

```bash
npm run typecheck
npm run lint
```
