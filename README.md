# PERSPECTA-AFRICA v1.0

Outil d'orientation professionnelle pour l'Afrique, multilingue (EN/FR/PT), analyse IA Claude 3.5, freemium (49€ ou équivalent), focus sur compétences transférables en contextes africains.

## Description

PERSPECTA-AFRICA est une plateforme moderne d'orientation professionnelle conçue spécifiquement pour le contexte africain. Elle remplace les codes ROME par une classification ILO adaptée (200+ métiers : agriculture, artisanat, tech émergente, services informels, entrepreneuriat) et utilise l'IA pour analyser les profils.

## Fonctionnalités Clés

*   **Multilingue :** Support natif de l'Anglais, du Français et du Portugais avec détection automatique via next-intl.
*   **Design Moderne :** Interface fluide et responsive construite avec TailwindCSS 4, shadcn/ui et Framer Motion.
*   **Thème :** Mode Sombre/Clair avec persistance et détection des préférences système (next-themes).
*   **Base de Données :** PostgreSQL via Supabase avec gestion des utilisateurs et classification métier ILO.
*   **Authentification :** Système sécurisé via NextAuth.js avec support Google OAuth et credentials.
*   **Gestion de Profil :** Profils utilisateurs personnalisables avec localisation et préférences linguistiques.

## Stack Technique

*   **Framework :** Next.js 16.1.1 (App Router + Turbopack)
*   **Langage :** TypeScript 5 (Strict Mode)
*   **Styling :** TailwindCSS 4 + PostCSS
*   **Composants UI :** shadcn/ui (Radix UI)
*   **Animations :** Framer Motion 12
*   **Internationalisation :** next-intl 4.7
*   **Base de Données :** Prisma 7.2.0 + PostgreSQL (Supabase)
*   **Database Driver :** @prisma/adapter-pg + pg
*   **Auth :** NextAuth.js v5.0.0-beta.30
*   **Validation :** Zod 4.3.5
*   **Formulaires :** React Hook Form 7.71
*   **Cryptage :** bcryptjs

## Configuration

### Pré-requis

*   Node.js 18+
*   npm

### Installation

1.  Cloner le dépôt :
    ```bash
    git clone https://github.com/votre-user/perspecta-africa.git
    cd perspecta-africa
    ```

2.  Installer les dépendances :
    ```bash
    npm install
    ```

3.  Configurer les variables d'environnement (`.env`) :
    ```env
    # Base de données Supabase
    DATABASE_URL="postgresql://user:password@host:port/db?schema=public&sslmode=require"
    
    # Désactiver la vérification SSL en développement (Supabase)
    NODE_TLS_REJECT_UNAUTHORIZED="0"
    
    # NextAuth
    NEXTAUTH_SECRET="votre_secret_genere_avec_openssl"
    NEXTAUTH_URL="http://localhost:3000"
    
    # Supabase (optionnel pour features supplémentaires)
    SUPABASE_SERVICE_ROLE_KEY="votre_service_role_key"
    NEXT_PUBLIC_SUPABASE_URL="https://votre-projet.supabase.co"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="votre_anon_key"
    ```

4.  Générer le client Prisma :
    ```bash
    npx prisma generate
    ```

5.  Initialiser la base de données :
    ```bash
    npx prisma db push
    ```
    
    Ou appliquer les migrations :
    ```bash
    npx prisma migrate deploy
    ```

6.  Lancer le serveur de développement :
    ```bash
    npm run dev
    ```
    
    L'application sera accessible sur `http://localhost:3000`

## Structure du Projet

```
perspecta-africa/
├── prisma/
│   ├── schema.prisma          # Schéma de base de données Prisma
│   └── migrations/            # Migrations de base de données
├── src/
│   ├── app/
│   │   ├── [locale]/          # Routes localisées
│   │   │   ├── auth/          # Pages d'authentification (signin, signup)
│   │   │   ├── profile/       # Page de profil utilisateur
│   │   │   └── page.tsx       # Page d'accueil
│   │   ├── api/
│   │   │   ├── auth/          # Routes API d'authentification
│   │   │   │   ├── [...nextauth]/  # NextAuth handler
│   │   │   │   └── register/  # Inscription utilisateur
│   │   │   └── user/          # Routes API utilisateur
│   │   ├── globals.css        # Styles globaux
│   │   └── favicon.ico
│   ├── components/            # Composants React réutilisables
│   │   └── ui/                # Composants shadcn/ui
│   ├── lib/
│   │   ├── db.ts              # Configuration Prisma Client
│   │   └── utils.ts           # Fonctions utilitaires
│   ├── messages/              # Fichiers de traduction i18n
│   │   ├── en.json            # Anglais
│   │   ├── fr.json            # Français
│   │   └── pt.json            # Portugais
│   ├── auth.ts                # Configuration NextAuth
│   ├── i18n.ts                # Configuration next-intl
│   └── navigation.ts          # Configuration routing multilingue
├── prisma.config.ts           # Configuration Prisma 7
├── next.config.ts             # Configuration Next.js
├── tailwind.config.ts         # Configuration TailwindCSS
└── package.json
```

## Modèle de Données

### Utilisateurs (User)
- Authentification (email/password + Google OAuth)
- Profil personnalisable (nom, bio, localisation)
- Préférence linguistique (en/fr/pt)
- Gestion de sessions

### Classification ILO
- **JobCategory** : Catégories de métiers ILO
- **Job** : Métiers spécifiques avec descriptions multilingues
- Métadonnées pour le contexte africain (informel, émergent, agricole)

### Évaluations
- **Assessment** : Évaluations utilisateur avec résultats JSON

## Scripts Disponibles

```bash
npm run dev          # Lancer le serveur de développement
npm run build        # Build de production
npm run start        # Démarrer le serveur de production
npm run lint         # Linter le code
```

## Prisma Commands

```bash
npx prisma generate       # Générer le client Prisma
npx prisma db push        # Synchroniser le schéma avec la DB
npx prisma migrate dev    # Créer une nouvelle migration
npx prisma studio         # Ouvrir l'interface Prisma Studio
```

## Dépannage

### Erreur SSL avec Supabase
Si vous rencontrez des erreurs de certificat SSL :
- Assurez-vous que `NODE_TLS_REJECT_UNAUTHORIZED="0"` est dans votre `.env`
- Vérifiez que `sslmode=require` est dans votre `DATABASE_URL`

### Erreur PrismaClient Initialization
Si Prisma ne se connecte pas :
- Exécutez `npx prisma generate` après toute modification du schéma
- Vérifiez que les packages `@prisma/adapter-pg` et `pg` sont installés

### Erreurs de traduction (MISSING_MESSAGE)
- Vérifiez que toutes les clés existent dans `messages/en.json`, `fr.json` et `pt.json`
- Redémarrez le serveur de développement après modification des fichiers de traduction

## Fonctionnalités à Venir

- [ ] Module d'évaluation des compétences
- [ ] Analyse IA avec Claude 3.5
- [ ] Recommandations de métiers personnalisées
- [ ] Système de paiement (freemium 49€)
- [ ] Dashboard administrateur
- [ ] Export de rapports PDF

## Licence

Tous droits réservés © 2026 PERSPECTA-AFRICA.
