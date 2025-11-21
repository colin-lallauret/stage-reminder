# Stage Reminder 📍

Application web permettant de gérer et visualiser les entreprises proposant des stages sur une carte interactive.

## 🚀 Installation du projet

### 1. Cloner le projet

```bash
git clone https://github.com/colin-lallauret/stage-reminder.git
cd stage-reminder
```

### 2. Installer les dépendances

```bash
npm install --legacy-peer-deps
```

> **Note** : L'option `--legacy-peer-deps` est nécessaire en raison de certaines incompatibilités entre React 19 et certaines bibliothèques.

### 3. Configuration des variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

Ajoutez-y les informations suivantes (remplacez par vos vraies valeurs) :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-publique-anon
```

> **⚠️ Important** : Ne commitez jamais le fichier `.env.local` dans Git (il est déjà dans `.gitignore`)

## 🎯 Lancer le projet en local

### Démarrer le serveur de développement

```bash
npm run dev
```

Le projet sera accessible à l'adresse : **http://localhost:3000**
