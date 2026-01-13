# PERSPECTA-AFRICA v1.0

Outil d'orientation professionnelle pour l'Afrique, multilingue (EN/FR/PT), analyse IA Claude 3.5, freemium (49€ ou équivalent), focus sur compétences transférables en contextes africains.

## Description

PERSPECTA-AFRICA est une plateforme moderne d'orientation professionnelle conçue spécifiquement pour le contexte africain. Elle remplace les codes ROME par une classification ILO adaptée (200+ métiers : agriculture, artisanat, tech émergente, services informels, entrepreneuriat) et utilise l'IA pour analyser les profils.

## Fonctionnalités Clés

*   **Multilingue :** Support natif de l'Anglais, du Français et du Portugais avec détection automatique.
*   **Design Moderne :** Interface fluide et responsive construite avec TailwindCSS, shadcn/ui et Framer Motion.
*   **Thème :** Mode Sombre/Clair avec persistance et détection des préférences système.
*   **Base de Données :** PostgreSQL via Supabase avec gestion des utilisateurs et classification métier ILO.
*   **Authentification :** Système sécurisé via NextAuth.js.

## Stack Technique

*   **Framework :** Next.js 14 (App Router)
*   **Langage :** TypeScript (Strict Mode)
*   **Styling :** TailwindCSS
*   **Composants UI :** shadcn/ui
*   **Animations :** Framer Motion
*   **Internationalisation :** next-intl
*   **Base de Données :** Prisma ORM & PostgreSQL (Supabase)
*   **Auth :** NextAuth.js (v5 Beta)

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
    DATABASE_URL="postgresql://user:password@host:port/db?schema=public"
    AUTH_SECRET="votre_secret_genere_avec_openssl"
    ```

4.  Initialiser la base de données :
    ```bash
    npx prisma db push
    ```

5.  Lancer le serveur de développement :
    ```bash
    npm run dev
    ```

## Structure du Projet

```
src/
├── app/
│   ├── [locale]/       # Routes localisées (Pages)
│   ├── api/            # Routes API (Auth, etc.)
│   └── ...
├── components/         # Composants React réutilisables
├── lib/                # Utilitaires (Prisma, utils)
├── messages/           # Fichiers de traduction (en.json, fr.json, pt.json)
└── ...
```

## Licence

Tous droits réservés © 2026 PERSPECTA-AFRICA.
