# 💰 Finance Track - Mobile App (React Native Expo)

**Finance Track** est une application mobile moderne conçue avec **React Native**, **Expo Router** et **TypeScript**, spécialement conçue pour suivre précisément ses finances personnelles avec un découpage temporel fluide : **jour par jour**, **semaine par semaine**, et **par mois**.

---

## ✨ Fonctionnalités Principales

### 1. 📅 Vues Temporelles Dédiées
- **Jour par Jour (Daily)** : Suivi détaillé des dépenses et revenus de la journée, transactions horodatées, indicateur d'évolution sur les 7 jours glissants.
- **Semaine par Semaine (Weekly)** : Synthèse hebdomadaire avec un graphique en barres des 7 jours (Lundi au Dimanche), mettant en avant le jour le plus dépensier et les tendances de consommation.
- **Par Mois (Monthly)** : Vue d'ensemble du mois en cours, répartition par tranche de semaine, suivi du rythme d'épargne et comparaison avec les plafonds budgétaires.
- **Navigation Temporelle Intuitive** : Précédent / Suivant et bouton de retour rapide vers la période actuelle (*"Aujourd'hui"*, *"Cette semaine"*, *"Ce mois-ci"*).

### 2. 💳 Gestion Complète des Transactions
- Ajout ultra-rapide de transactions (Dépense / Revenu).
- Saisie du montant en grands chiffres lisibles avec devise (FCFA).
- Attribution par **catégorie** (Alimentation, Transports, Logement, Loisirs, Santé, Salaire, Freelance, etc.) avec icônes et codes couleurs harmonisés.
- Moyen de paiement (Carte bancaire, Apple Pay, Espèces, Virement).
- Suppression facile avec boîte de confirmation.

### 3. 📊 Analyses & Statistiques Détaillées
- **Solde net**, Total Entrées (+) et Total Sorties (-).
- **Taux d'épargne calculé en temps réel**.
- **Répartition par catégorie** avec barres de progression et pourcentages.
- Moyenne des dépenses journalières et identification de la dépense maximale.

### 4. 🎯 Budgets Mensuels par Catégorie
- Définition de plafonds de dépenses pour chaque catégorie.
- Jauges de progression dynamiques avec code couleur d'alerte :
  - 🟢 **Vert** : Moins de 75% du budget consommé.
  - 🟡 **Ambre** : Entre 75% et 100% (attention au budget).
  - 🔴 **Rouge** : Dépassement de budget.
- Calcul automatique du restant à dépenser.

### 5. 💾 Persistance Hors-Ligne & Données de Démo
- Données persistées localement via `@react-native-async-storage/async-storage`.
- Jeu de données réaliste pré-généré au premier lancement (permettant de tester immédiatement les vues jour, semaine et mois).
- Bouton de réinitialisation des données de démo disponible dans l'onglet *Budgets*.

---

## 📂 Architecture du Projet

```text
finance-track/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Navigation par onglets (Dashboard, Historique, Analyses, Budgets)
│   │   ├── index.tsx           # Tableau de bord (Solde, Graphique, Périodes, Dernières opérations)
│   │   ├── transactions.tsx    # Historique complet avec recherche & filtres
│   │   ├── analytics.tsx       # Graphiques & rapports comparatifs détaillés
│   │   └── budgets.tsx         # Suivi des plafonds budgétaires mensuels
│   ├── _layout.tsx             # Root layout avec FinanceProvider & Modal Stack
│   └── new-transaction.tsx     # Modal de création rapide de transaction
│
├── components/
│   ├── BalanceCard.tsx         # Carte de solde net & flux entrées/sorties
│   ├── CategoryBreakdownCard.tsx # Répartition par catégories & barres de progression
│   ├── EmptyState.tsx          # Composant d'état vide avec CTA
│   ├── FinanceChart.tsx        # Graphique interactif adapté à la période (Jour/Semaine/Mois)
│   ├── PeriodSelector.tsx      # Sélecteur à 3 volets (Jour / Semaine / Mois) + navigation
│   └── TransactionItem.tsx     # Ligne de transaction stylisée
│
├── constants/
│   ├── Colors.ts               # Palette sémantique (Mode sombre & clair)
│   └── categories.ts           # Définitions des catégories de revenus et dépenses
│
├── context/
│   └── FinanceContext.tsx      # Gestionnaire d'état central & calculs de périodes
│
├── services/
│   └── storage.ts              # Sauvegarde locale & générateur de données de démo
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

### 3. Vérification des types TypeScript

```bash
npm run typecheck
```
