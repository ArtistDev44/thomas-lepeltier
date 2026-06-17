# README - Gestion du Site Thomas Lepeltier

## 📋 Table des matières

1. [Introduction](#introduction)
2. [Architecture du projet](#architecture-du-projet)
3. [Guide de démarrage](#guide-de-démarrage)
4. [Gestion du contenu](#gestion-du-contenu)
5. [Commandes principales](#commandes-principales)
6. [Dépannage](#dépannage)
7. [Support et ressources](#support-et-ressources)

---

## Introduction

Bienvenue ! Ce site a été développé avec **Eleventy (11ty)**, un générateur de site statique moderne et performant. Ce document vous guidera pour gérer et mettre à jour votre site sans connaissances techniques approfondies.

### Points clés
- ✅ Site statique (rapide, sécurisé, hébergeable partout)
- ✅ Contenu en Markdown (format simple et lisible)
- ✅ Pas de base de données complexe
- ✅ Versioning avec Git (historique complet des modifications)

---

## Architecture du projet

### 📁 Structure complète

```
thomas-lepeltier/
├── src/                          # 👈 Dossier principal du contenu
│   ├── _data/                   # Données globales (navigation, métadonnées)
│   ├── _includes/               # Composants réutilisables (header, footer, etc.)
│   ├── _layouts/                # Mises en page (base, article, etc.)
│   ├── assets/                  # Images, vidéos, documents
│   ├── articles/                # Articles de blog (fichiers .md)
│   ├── comptes-rendus/          # Comptes-rendus (fichiers .md)
│   ├── commentaires/            # Commentaires critiques (fichiers .md)
│   ├── interventions/           # Interventions publiques (fichiers .md)
│   ├── livres/                  # Bibliographie et œuvres (fichiers .md)
│   ├── liens/                   # Ressources externes (fichiers .md)
│   ├── pages/                   # Pages statiques (À propos, Contact, etc.)
│   ├── css/                     # Feuilles de style (Tailwind CSS)
│   └── index.md                 # Page d'accueil
│
├── dist/                         # 📤 Dossier de sortie (généré automatiquement)
│   ├── articles/                # Articles compilés en HTML
│   ├── assets/                  # Ressources copiées
│   ├── index.html               # Accueil en HTML
│   └── ...                      # Toutes les pages compilées
│
├── .cache/                       # Cache Eleventy (à ignorer)
├── .github/                      # Configuration GitHub (déploiement automatique)
├── node_modules/                # Dépendances Node.js (à ignorer)
│
├── eleventy.config.js           # ⚙️ Configuration Eleventy
├── tailwind.config.js           # ⚙️ Configuration Tailwind CSS
├── netlify.toml                 # ⚙️ Configuration Netlify (déploiement)
├── vercel.json                  # ⚙️ Configuration Vercel (déploiement alternatif)
├── package.json                 # 📦 Dépendances du projet
├── package-lock.json            # 🔒 Versions figées des dépendances
└── README.md                    # Ce fichier
```

### 🔍 Dossiers essentiels pour vous

| Dossier | Utilité | À modifier ? |
|---------|---------|-------------|
| `src/` | Contenu du site | ✅ **OUI** - Modifiez-le régulièrement |
| `src/articles/` | Articles de blog | ✅ **OUI** - Ajoutez/modifiez vos articles |
| `src/assets/` | Images, documents | ✅ **OUI** - Ajoutez vos ressources |
| `dist/` | Site compilé | ❌ **NON** - Généré automatiquement |
| `node_modules/` | Dépendances | ❌ **NON** - Géré par npm |

---

## Guide de démarrage

### 1️⃣ Installation initiale (première fois seulement)

```bash
# Ouvrir le terminal dans le dossier du projet
cd chemin/vers/thomas-lepeltier

# Installer les dépendances
npm install
```

> Si vous n'avez pas **Node.js** installé, téléchargez-le : https://nodejs.org/

### 2️⃣ Lancer le serveur de développement

```bash
npm run dev
```

**Résultat :**
- Site accessible sur `http://localhost:8080`
- Le site se regénère automatiquement à chaque modification
- Appuyez sur `Ctrl+C` pour arrêter le serveur

### 3️⃣ Compiler pour la production

```bash
npm run build
```

**Résultat :**
- Le dossier `dist/` contient votre site prêt à être publié
- Ce dossier est ce qui sera envoyé au serveur d'hébergement

---

## Gestion du contenu

### 📝 Créer un nouvel article

#### Étape 1 : Créer le fichier

Créez un fichier dans `src/articles/` :

```
src/articles/nom-de-larticle.md
```

**Exemple :**
```
src/articles/quantum-cosmology-2024.md
```

#### Étape 2 : Remplir le frontmatter

Chaque article commence par du **frontmatter** (métadonnées entre trois tirets) :

```markdown
---
title: "Cosmologie quantique et réalité"
description: "Réflexions sur les implications philosophiques de la physique quantique"
date: 2024-06-15
author: "Thomas Lepeltier"
tags:
  - cosmologie
  - physique-quantique
  - philosophie
layout: "article.njk"
---

# Contenu de votre article en Markdown

Voici le texte de votre article...
```

#### Étape 3 : Rédiger en Markdown

**Syntaxe Markdown de base :**

```markdown
# Titre principal (H1)
## Sous-titre (H2)
### Sous-sous-titre (H3)

**Texte en gras**
*Texte en italique*
~~Texte barré~~

- Point 1
- Point 2
  - Sous-point

1. Premier point
2. Deuxième point

[Lien vers Google](https://google.com)

![Alt texte](./image.jpg)

> Citation importante

`code inline`

\`\`\`python
# Bloc de code
print("Hello World")
\`\`\`
```

### 📂 Organiser les fichiers

#### Structure recommandée :

```
src/
├── articles/
│   ├── 2024-cosmologie-quantique.md
│   ├── 2024-philosophie-spatiotemporelle.md
│   └── 2023-interpretation-quantique.md
│
├── comptes-rendus/
│   ├── analyse-livre-hawking.md
│   └── critique-theorie-cordes.md
│
├── commentaires/
│   ├── reflexion-realisme.md
│   └── dialogue-materialisme.md
│
└── livres/
    ├── introduction-cosmologie.md
    └── essai-philosophie-quantique.md
```

### 🖼️ Ajouter des images

1. **Placez l'image** dans `src/assets/images/`
2. **Référencez-la** dans votre Markdown :

```markdown
![Description de l'image](./assets/images/nom-image.jpg)
```

**Formats recommandés :**
- JPEG ou PNG (photos)
- SVG (diagrammes)
- WebP (performance)

### 🏷️ Utiliser les tags

Les tags permettent de catégoriser et filtrer le contenu :

```markdown
---
tags:
  - philosophie
  - cosmologie
  - sciences
---
```

**Tags existants recommandés :**
- `philosophie`, `cosmologie`, `physique-quantique`
- `article-blog`, `interview`, `essai`
- `metaphysique`, `ontologie`, `epistemologie`

### 📅 Dates et publication

```markdown
---
date: 2024-06-15
draft: false  # Mettez true pour masquer un article
---
```

### 📄 Éditer les pages statiques

Les pages comme **À propos**, **Contact**, **Mentions légales** se trouvent dans `src/pages/` :

```
src/pages/
├── bio.md              # Biographie
├── contact.md          # Page de contact
├── privacy.md          # Politique de confidentialité
├── imprint.md          # Mentions légales
└── liens.md            # Ressources externes
```

Modifiez-les comme des articles normaux.

---

## Commandes principales

### 🚀 Commandes de base

```bash
# Lancer le serveur local (développement)
npm run dev

# Compiler pour la production
npm run build

# Vérifier l'accessibilité (a11y)
npm run a11y

# Formater le code (Prettier)
npm run format

# Vérifier la syntaxe
npm run lint
```

### 📊 Commandes avancées

```bash
# Nettoyer le cache et regénérer
npm run build -- --full

# Servir le site compilé en local
npm run serve

# Générer le sitemap
npm run sitemap
```

---

## Dépannage

### ❌ Problème : "npm command not found"

**Solution :** Installez Node.js depuis https://nodejs.org/

### ❌ Problème : Le serveur ne démarre pas

```bash
# Effacez le cache et réessayez
rm -rf .cache/
npm run dev
```

### ❌ Problème : Les modifications ne s'affichent pas

**Solutions :**
1. Videz le cache du navigateur (Ctrl+Shift+Suppr)
2. Arrêtez le serveur et relancez-le
3. Vérifiez la syntaxe Markdown (tirets, indentation)

### ❌ Problème : Erreur "layout not found"

Assurez-vous que le fichier de mise en page existe :
```markdown
---
layout: "article.njk"  # Doit exister dans src/_layouts/
---
```

### ❌ Problème : Images non affichées

Vérifiez le chemin :
```markdown
✅ ![Alt](./assets/images/photo.jpg)
❌ ![Alt](/assets/images/photo.jpg)
❌ ![Alt](../images/photo.jpg)
```

### 🆘 Erreur lors du build

```bash
# Réinstallez les dépendances
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Workflow recommandé

### 📋 Checklist avant publication

- [ ] Titre clair et descriptif
- [ ] Description pertinente (50-160 caractères)
- [ ] Date correcte
- [ ] Tags appropriés
- [ ] Vérification orthographe
- [ ] Images optimisées
- [ ] Liens internes fonctionnels
- [ ] Test en local avec `npm run dev`

### 🔄 Cycle de publication

```
1. Créer/modifier le fichier .md dans src/
   ↓
2. Tester en local : npm run dev
   ↓
3. Corriger les erreurs ou erreurs de syntaxe
   ↓
4. Compiler : npm run build
   ↓
5. Déployer vers Netlify/Vercel
   ↓
6. Vérifier le site en ligne
```

---

## Configuration essentielles

### 🔧 Fichiers de configuration (à connaître)

| Fichier | Rôle | Modifier ? |
|---------|------|-----------|
| `eleventy.config.js` | Configuration Eleventy | ❌ NON (sauf expert) |
| `tailwind.config.js` | Style Tailwind CSS | ⚠️ PEUT ÊTRE |
| `netlify.toml` | Déploiement Netlify | ❌ NON (en production) |
| `.env-sample` | Variables d'environnement | ⚠️ AU BESOIN |

### 📝 Métadonnées globales

Les informations générales du site se trouvent dans `src/_data/site.js` :

```javascript
{
  name: "Thomas Lepeltier",
  description: "Site personnel et ressources intellectuelles",
  url: "https://thomas-lepeltier.fr",
  language: "fr",
  author: "Thomas Lepeltier"
}
```

---

## Déploiement

### 🚀 Déployer sur Netlify

1. **Connectez votre dépôt GitHub** à Netlify
2. **Configuration automatique** depuis `netlify.toml`
3. À chaque push, le site se regénère automatiquement

### 🚀 Déployer sur Vercel

1. **Connectez votre dépôt** à Vercel
2. **Configuration** depuis `vercel.json`
3. Déploiement automatique à chaque commit

### 📤 Déploiement manuel

```bash
# 1. Compiler le site
npm run build

# 2. Envoyer le dossier dist/ à votre serveur FTP
# (Demandez les identifiants à votre hébergeur)
```

---

## Ressources et apprentissage

### 📚 Documentation officielle

- **Eleventy :** https://www.11ty.dev/
- **Markdown :** https://commonmark.org/
- **Tailwind CSS :** https://tailwindcss.com/
- **Nunjucks :** https://mozilla.github.io/nunjucks/

### 🎓 Tutoriels recommandés

- Getting Started with 11ty : https://www.11ty.dev/docs/
- Markdown Syntax : https://www.markdownguide.org/
- CSS avec Tailwind : https://tailwindcss.com/docs

### 💬 Obtenir de l'aide

**En cas de problème :**
1. Consultez ce README
2. Vérifiez la documentation Eleventy
3. Contactez votre développeur ou support

---

## Points de contact

### 🔧 Maintenance technique

- **Support général :** Votre développeur web
- **Hébergement (Netlify/Vercel) :** Dashboards respectifs
- **Domaine :** Voir votre registrar de domaine

### 📧 Communication

- **Email de contact :** À configurer dans `src/pages/contact.md`
- **Formulaire :** Géré via Netlify Forms ou service externe
- **Réseaux sociaux :** À ajouter dans les templates

---

## Bonnes pratiques

### ✅ À FAIRE

- ✅ Faire des commits réguliers (`git commit -m "Ajout article sur...""`)
- ✅ Tester en local avant de déployer
- ✅ Utiliser des noms de fichiers explicites
- ✅ Maintenir une hiérarchie claire
- ✅ Documenter les modifications importantes
- ✅ Sauvegarder en Git à chaque modification majeure

### ❌ À ÉVITER

- ❌ Modifier `dist/` directement (regénéré automatiquement)
- ❌ Supprimer `node_modules/` sans raison
- ❌ Ignorer les avertissements du compilateur
- ❌ Publier du contenu en brouillon (draft: true)
- ❌ Utiliser des espaces au lieu de tirets dans les noms de fichiers

---

## Backup et sécurité

### 💾 Sauvegarder votre travail

```bash
# Tout est versionnée dans Git
git status           # Voir les modifications
git add .           # Préparer les changements
git commit -m "Description du changement"  # Valider
git push            # Envoyer vers GitHub
```

### 🔐 Sécurité

- **Ne commitez jamais** d'identifiants ou mots de passe
- **Utilisez `.env`** pour les données sensibles
- **Maintenez à jour** les dépendances : `npm update`
- **Gardez des backups** réguliers

---

## Conclusion

Vous avez maintenant les outils pour gérer votre site de manière autonome ! 

**Résumé :**
1. 📝 Modifiez les fichiers `.md` dans `src/`
2. 🧪 Testez avec `npm run dev`
3. 🚀 Compilez avec `npm run build`
4. 📤 Le déploiement se fait automatiquement via Netlify/Vercel

---

**Version du document :** 1.0  
**Date de création :** 15 juin 2026  
**Dernière mise à jour :** 15 juin 2026

Pour toute question, n'hésitez pas à consulter ce guide ou à contacter votre développeur. 🚀
