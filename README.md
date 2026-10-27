# Les Farfadets Vertigo

Site internet de l'association **Les Farfadets Vertigo** : présentation des activités (escalade, kayak & paddle, vélo, randonnée…), événements, galerie photos et inscriptions, avec un espace d'administration pour gérer tout le contenu sans toucher au code.

En ligne : https://lesfarfadetsvertigo.fr

## Fonctionnalités

**Site public**
- Page d'accueil avec cartes d'activités, carrousel photos et bandeau d'événements
- Pages d'activités dynamiques (`/[slug]`), créées depuis l'admin
- Formulaires d'inscription aux événements d'activité
- Pages légales : mentions légales, confidentialité, accessibilité
- Coordonnées masquées aux robots (`RevealContact`), sitemap, manifest / icônes PWA

**Administration** (`/admin`, accès via `/login`)
- Pages, menu du header, cartes de l'accueil
- Photos : upload avec compression et conversion côté client (HEIC/HEIF des smartphones) puis optimisation WebP avec `sharp`
- Événements et bandeaux, inscriptions reçues, inscriptions HelloAsso
- Configuration générale (logo, partenaires…), gestion de l'équipe d'admins, page d'aide

**HelloAsso** : un webhook (`/api/webhooks/helloasso`) enregistre les paiements validés dans la base.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4, icônes `lucide-react`, carrousels `embla-carousel`
- MySQL / MariaDB via `mysql2`
- `bcrypt` pour les mots de passe admin, `sharp` pour les images

> ⚠️ Next.js 16 comporte des changements importants par rapport aux versions précédentes (par ex. `proxy.ts` remplace `middleware.ts`). La documentation de la version installée se trouve dans `node_modules/next/dist/docs/`.

## Structure

```
app/
  (public)/          pages légales et inscriptions
  [slug]/            pages d'activités dynamiques
  admin/             espace d'administration
  api/               routes API (inscriptions, événements, webhook HelloAsso)
  login/             connexion admin
  uploads/[filename] sert les images uploadées depuis le dossier uploads/
components/          composants du site (header, footer, carrousels…) et admin/
lib/
  db.ts              connexion MySQL
  helloasso.ts       authentification API HelloAsso
  image-loader.ts    loader d'images Next.js personnalisé
  base-path.ts       préfixe d'URL (vide en production)
proxy.ts             protection des routes /admin
uploads/             images uploadées depuis l'admin (non versionné)
public/              fichiers statiques (logos partenaires, icônes…)
```

Les images uploadées vont dans `uploads/` (hors de `public/`) et sont servies par la route `app/uploads/[filename]`, car Next.js ne sert pas les fichiers ajoutés dans `public/` après le build.

## Installation en local

Prérequis : Node.js 20+, et un serveur MySQL (par exemple [Laragon](https://laragon.org)).

1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Créer la base `farfadets_db` et y importer un export de la base de production.
3. Créer un fichier `.env.local` à la racine (non versionné) :
   ```env
   # Base de données — valeurs par défaut si absentes : localhost / root / (vide) / farfadets_db
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=farfadets_db

   # HelloAsso (identifiants API générés dans l'espace HelloAsso)
   HELLOASSO_CLIENT_ID=
   HELLOASSO_CLIENT_SECRET=
   HELLOASSO_ORGANIZATION_SLUG=les-farfadets-vertigo
   ```
4. Récupérer les images uploadées en production (le dossier `uploads/` n'est pas dans git) :
   ```powershell
   scp -P <port> -r "<utilisateur>@<serveur>:/home/projets/farfadet/uploads/*" .\uploads\
   ```
   À lancer depuis le PC, pas depuis le serveur. Sans cette étape, le logo et certaines photos référencés en base ne s'affichent pas.
5. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```
   puis ouvrir http://localhost:3000.

## Déploiement

Le site tourne sur un VPS, dans `/home/projets/farfadet`, avec le process pm2 `farfadet` de l'utilisateur `debian`.

**Règle d'or : on ne modifie jamais le code directement sur le serveur.** Tout passe par git, sinon le prochain `git pull` est bloqué.

1. En local :
   ```bash
   git add …
   git commit -m "…"
   git push
   ```
2. Sur le serveur, **sans `sudo`** :
   ```bash
   cd /home/projets/farfadet
   git pull
   npm install
   NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=1536 npm run build -- --webpack
   pm2 restart farfadet --update-env
   pm2 save
   ```

Les identifiants de production (base de données, HelloAsso) sont dans le fichier `.env` du serveur, qui n'est pas versionné.

### En cas de problème

- **`Permission denied`** : des fichiers appartiennent à `root` après une commande lancée avec `sudo`. Corriger les droits une fois, puis relancer la commande sans `sudo` :
  ```bash
  sudo chown -R debian:debian /home/projets/farfadet
  ```
- **`git pull` refuse à cause de fichiers modifiés** : regarder `git status` et `git diff`, puis reporter les modifications utiles dans le dépôt en local avant de les annuler sur le serveur.
- **Le site affiche une erreur** :
  ```bash
  pm2 logs farfadet --lines 30 --nostream
  ```
- Ne pas utiliser `sudo pm2` : pm2 est propre à chaque utilisateur, et `sudo pm2` ne voit pas le process `farfadet`.
