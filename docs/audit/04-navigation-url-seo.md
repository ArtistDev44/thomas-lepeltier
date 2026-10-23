# 04 — Navigation, arborescence, recherche, URL et SEO technique

> Audit du site vivant `https://www.thomaslepeltier.fr` (crawl du 23 octobre 2026). Comparaison avec la refonte compilée (`dist/`, build local). Redirections détaillées dans [`redirections-proposees.csv`](./redirections-proposees.csv) (593 lignes : 590 pages + 3 règles de motif).
> Grilles utilisées : heuristiques de Nielsen, principes de Krug (test du coffre / *trunk test*), WCAG 2.2 (pour les points communs avec la navigation), bonnes pratiques SEO technique.
> Sévérités : **critique** (bloque ou fait perdre du référencement / des utilisateurs), **majeur** (dégrade nettement un parcours ou le SEO), **mineur** (confort, hygiène).

---

## 0. Ce que le crawl a établi (chiffres clés)

| Mesure | Valeur |
|---|---|
| Pages HTML réelles | **590** (528 comptes rendus, 25 index d'auteurs, 14 fiches livres, 7 tables des matières, 6 annexes, 2 pages « articles/lecture », 1 texte de débats, 1 accueil, 6 pages principales dont `liste-des-publications.html`) |
| Variantes `recherche.html?de=…` | 590 (une par page : à ne pas indexer, voir NAV-12) |
| Profondeur maximale | 2 niveaux (`/cr/x.html`, `/annexes/creationnisme/x.html`) |
| Entrées de menu | 6 + loupe (Accueil, Qui suis-je ?, Livres, Comptes rendus, Articles, Contact), répétées dans le pied de page |
| Images | 1 463 balises, 811 fichiers, 126 Mo ; 107 fichiers > 300 Ko, 18 > 1 Mo |
| Liens internes cassés | 8 cibles (+ 3 cibles cassées dans la liste de la recherche) |
| Liens externes uniques | 1 083 ; ≈ 30 en 404, ≈ 16 domaines morts / certificats expirés, ≈ 108 en 403 (blocage anti-robot, à revérifier à la main) |
| `sitemap.xml`, `robots.txt` | **404 tous les deux** |
| `canonical`, Open Graph, JSON-LD | **absents sur 590 pages** |
| `<h1>` | **identique sur 588 pages** (« L'univers livresque de Thomas Lepeltier ») |

Deux faits de contexte à connaître avant tout le reste :

1. `www.thomaslepeltier.fr` est servi par Vercel. L'apex `thomaslepeltier.fr` fait un 308 vers `www` (correct). Le premier site, `thomas.lepeltier.free.fr`, n'est **pas** entièrement éteint (voir NAV-01).
2. Le site vivant a déjà reçu une première passe de modernisation (feuille de style de septembre 2026 : police Charter/Georgia, fond papier, accueil en grilles de vignettes). L'audit porte sur cet état-là. L'architecture, elle, est restée celle d'origine.

---

## 1. Constats

### 1.1 Hébergement, domaines, indexation

| ID | Sév. | Constat | Recommandation |
|---|---|---|---|
| **NAV-01** | **Critique** | L'ancien domaine `thomas.lepeltier.free.fr` ne redirige que sa page d'accueil (page-relais de 526 octets, `<meta http-equiv="refresh" content="0">` + canonical vers l'apex : ce n'est **pas** une redirection 301). Toutes les autres pages répondent encore `200` en parallèle (`livres.html`, `articles.html`, `qui-suis-je.html`, `cr/gilson.html` datée de 2010, etc.). Résultat : deux copies du site en concurrence, chaîne `free.fr → apex (HTML) → www (308)` pour l'accueil. | Rediriger **chaque** URL free.fr en 301 vers sa cible finale (une seule étape, table du CSV). Free permet un `.htaccess` (à tester) ; à défaut, remplacer le contenu de chaque page par un relais `meta refresh` + `rel="canonical"` vers la nouvelle URL. Déclarer le changement d'adresse dans Google Search Console. |
| **NAV-02** | **Critique** | Aucun `sitemap.xml` ni `robots.txt` (404). La page 404 est le texte brut Vercel « NOT_FOUND » : pas de menu, pas de marque, pas de recherche, pas de lien d'accueil. | Générer `sitemap.xml` et `robots.txt` (la refonte en produit déjà un, voir §7) ; page 404 de la refonte (`dist/404.html`) avec menu, recherche et liens vers Livres / Chroniques / Articles. |
| **NAV-03** | **Critique** | Le seul `<h1>` de 588 pages est le nom du site ; le titre réel de la page (livre, auteur, rubrique) est un `<h2>` ou absent (530 pages n'ont **aucun** `<h2>`). Les moteurs et les lecteurs d'écran n'ont aucun titre de page exploitable (recoupe l'audit d'accessibilité, WCAG 2.4.6 / 1.3.1). | Un `<h1>` unique et propre à chaque page (titre du livre, de la chronique, nom de la rubrique). Le nom du site passe dans un `<p>` ou un lien de logo, hors `<h1>`. |
| **NAV-04** | Majeur | Aucun `canonical`, aucun Open Graph / Twitter Card, aucun JSON-LD, aucun `hreflang`. `<meta name="keywords">` présent sur les 590 pages (ignoré des moteurs depuis des années). Favicon JPEG déclaré `image/x-icon`, pas de manifeste, `/favicon.ico` en 404. | `canonical` absolu sur chaque page, OG/Twitter (couverture du livre en image), JSON-LD `Person` (accueil), `Book` (fiches), `Article`/`Review` (chroniques), `BreadcrumbList`. Supprimer `keywords`. Favicons SVG + PNG + ICO. |
| **NAV-05** | Majeur | **Titres** : 492 chroniques sur 528 dépassent 60 caractères (médiane 92, tronqués en résultats de recherche) et suivent le gabarit « Compte rendu du livre de X, *Titre*, par Thomas Lepeltier ». Les pages principales ont « Site de Thomas Lepeltier : Livres » (marque en tête). **Descriptions** : 222 chroniques (42 %) répètent le titre mot pour mot ; 5 pages (`articles.html`, `contact.html`, `livres.html`…) partagent la même description « Face cachée de l'univers, Revolution végétarienne… » ; `articles.html` est en doublon de titre avec `articles/lecture/creationism-france.html`. | Gabarit `Titre du livre — Auteur · Chronique | Thomas Lepeltier` (≤ 60 car.), description rédigée de 140-160 car. (première phrase de la chronique), marque en fin de titre. |
| **NAV-06** | Mineur | Aucun lien d'affiliation n'est marqué `rel="sponsored"` (Amazon `tag=httpthomaslep-21`) ; trackers Zanox/Fnac morts (`ad.zanox.com/…ULP=[[…]]`, URL invalides). Les 2 liens `target="_blank"` du site portent `noopener`. | Retirer les trackers morts ; `rel="sponsored noopener"` sur les liens d'achat ; liens vers l'éditeur ou une librairie indépendante en priorité. |

### 1.2 Menu et arborescence

| ID | Sév. | Constat | Recommandation |
|---|---|---|---|
| **NAV-07** | **Majeur** | **Les conférences n'ont aucune entrée de menu.** `conferences.html` n'a qu'**un seul lien entrant** (le renvoi « Autres interventions » de l'accueil). Or le brief fait de la disponibilité pour des conférences un axe fort. La page elle-même : 51 images, 56 mots, alt = nom de fichier, aucune date, aucun lieu, aucun appel à inviter. | Entrée de menu de premier niveau « Conférences » ; page avec liste datée en texte (date, lieu, titre, vidéo), CTA « Inviter Thomas » (mailto + formulaire), lien APALA. Voir §3 et §4. |
| **NAV-08** | **Majeur** | « Comptes rendus » pointe vers `auteurs/a_a.html` : un index **alphabétique par nom d'auteur** (25 pages, une par lettre, 17 à 48 Ko chacune, une seule dimension de tri). Aucun tri par date, thème ou note ; nom de fichier opaque (`a_a`). Un visiteur qui connaît le titre mais pas l'auteur doit passer par la loupe. Même problème dans `articles.html` : une seule page de 165 vignettes, groupée par 7 thèmes, sans filtre. | Hub chroniques avec filtres (thème, année, auteur, mot-clé) et pagination ; la recherche plein texte devient le chemin principal. Garder des URL de lettre lisibles (`/chroniques/auteurs/b/`) si l'index alphabétique est conservé. |
| **NAV-09** | Majeur | **Libellés incohérents** entre menu, titre de page et titre visible : « Comptes rendus » (menu) / « Comptes rendus de livres » (h2) / « Chroniques » (refonte) ; « Conférences » (URL) / « Interventions publiques » (h2) ; « Qui suis-je ? » (menu) / « Ma biographie » (refonte) ; « Livres » (menu) / « Mes livres » (accueil). Le brief parle de « Productions ». | Un seul vocabulaire, validé par le client : *Productions* (Livres, Chroniques de livres, Articles & entretiens), *Conférences*, *Qui suis-je ?*, *Contact*. |
| **NAV-10** | Majeur | Trois vignettes de l'accueil (article « Va-t-on perdre le contrôle des IA ? », conférences 2026) et **84 liens** de `articles.html` + `conferences.html` pointent **directement vers un fichier image** (`.jpg`/`.png`), sans page, sans titre, sans bouton retour, sans contexte. Les couvertures de `livres.html` sont des images sans titre visible (la recherche doit les énumérer à la main, cf. NAV-13). | Chaque vignette mène à une page ou à la source externe, jamais à une image seule. Titre visible sous chaque couverture ; `alt` descriptif. |
| **NAV-11** | Mineur | Pas de fil d'Ariane, pas de « Retour à la liste », pas de précédent/suivant sur les 528 chroniques ni sur les fiches livres ; aucune suggestion de contenus liés. Seul `liste-des-publications.html` offre des « ↑ Retour à Articles ». | Fil d'Ariane (`Accueil › Productions › Chroniques › Titre`) + précédent/suivant + « autres chroniques du même auteur / thème ». |
| **NAV-12** | Mineur | Les 590 pages portent une loupe qui renvoie vers `recherche.html?de=<page-courante>` : 590 URL quasi identiques crawlables, rien n'empêche leur indexation. | `noindex` sur la page de recherche ou une URL unique `/recherche/` avec retour via l'historique du navigateur. |
| **NAV-13** | Mineur | **URL** : extension `.html` sur tout ; 31 URL avec `_` (`a_a.html`, `d_espagnat.html`, `univers_paralleles/`) ; majuscules dans des slugs (`cr/Benovsky-le-puzzle-philosophique.html`, 42 images avec majuscules) ; slug se terminant par un tiret (`questions-a-guillaume-lecointre-.html`) ; `.png.png` ; dossiers de livres incohérents (`univers_paralleles/` vs `autre-cosmos/` vs `hist-philo-sciences/`) ; 528 chroniques à plat dans `/cr/` avec couvertures dans un dossier `cr/-couvertures/` ; suffixes `-1`, `-2` sans signification (`histoire-philosophie-sciences-2.html`). Pas de trailing slash ni d'URL sans extension (`/livres` → 404, `/qui-suis-je` → 404). | Slugs en minuscules, sans extension, sans `_`, avec slash final (ce que fait déjà la refonte), 301 depuis les anciennes. Les URL sans extension ou sans slash final doivent aussi répondre (règle Vercel `trailingSlash`/`cleanUrls`). |

### 1.3 Recherche

Mesure faite en lançant la recherche « darwin » dans Chromium sans interface (copie locale du site, 1ʳᵉ recherche, cache vide).

| ID | Sév. | Constat | Recommandation |
|---|---|---|---|
| **NAV-14** | Majeur | **Indexation côté client à chaque première recherche** : `recherche-moteur.js` télécharge `auteurs/a_a.html … a_z.html` (26 pages) + `articles.html` = **27 requêtes, ≈ 805 Ko bruts (≈ 208 Ko compressés)**, puis extrait les titres du HTML. Pas d'index préfabriqué, pas d'autocomplétion. Fonctionne, mais lourd sur mobile et fragile : toute modification de gabarit casse l'extraction (le script décrit lui-même trois façons de repérer les titres selon l'époque). | Index statique **Pagefind** (déjà prévu dans la refonte : `npm run build` lance `pagefind`) : index fragmenté, quelques Ko par requête, plein texte, tolérance aux accents, filtres. Voir NAV-16. |
| **NAV-15** | Majeur | La recherche ne couvre que les **titres** et un tableau de 35 entrées codé en dur (`MES_LIVRES`). **3 de ces entrées mènent à une 404** : `veganes-vont-ils-prendre-le-pouvoir.html`, `revolution-antispeciste-1e-edition.html`, `histoire-philosophie-sciences.html`. Aucun résultat dans le texte des chroniques. Un espace parasite est inséré dans les résultats quand le titre contient une balise (« Les Mondes darwin iens »). | Plein texte sur les chroniques ; les livres sont générés depuis les mêmes données que les fiches (plus de liste à la main). Test automatique « chaque résultat répond 200 ». |
| **NAV-16** | Mineur | Accès à la recherche = une loupe de 19 px sans champ visible, `title="Rechercher"` ; la page de résultats est correcte (étiquette `<label>` masquée, `type=search`, compteur de résultats, regroupement Livres / Articles / Comptes rendus). | Champ de recherche visible en tête (ou bouton-modale), raccourci `/`, suggestions dynamiques de titres (demande du brief). Conserver le regroupement par type. |

### 1.4 Liens cassés et poids de page (impact navigation et SEO)

| ID | Sév. | Constat | Recommandation |
|---|---|---|---|
| **NAV-17** | Majeur | **8 cibles internes cassées**, dont : `cr/wilson-genesis-the-deep-origin-of-societies.html` (3 liens : bibliographie + index W), `annexes/tout-partie/tout_parties.html` (2 liens : articles + bibliographie), `cr/heams.html` (index S), `histoire-philosophie-sciences.html` (depuis `revolution-vegetarienne.html`), `autre-cosmos/riazuelo-uzan-1.html` et `-2.html` (depuis `debats.html`), `darwin-heretique/epopee.jpg`. Hors site : ≈ 30 URL externes en 404 (PUF, Placedeslibraires, Franceculture, Ciel et Espace, Philomag…) et ≈ 16 domaines morts (`animauxbonheur.com`, `revolutionsanimales-lelivre.com`, `thinkovery.com`…). | Corriger ou retirer les 8 liens internes. Vérificateur de liens dans l'intégration continue ; archive web.archive.org pour les sources disparues. Liste complète : `/tmp/audit_out/ext_status.tsv`. |
| **NAV-18** | Majeur | **Poids** : `articles.html` = 98 Ko de HTML (20 Ko compressés) mais **64 Mo d'images** (165 vignettes, dont 18 > 1 Mo) ; `conferences.html` 19 Mo (51 images, certaines à 2,3 Mo) ; `livres.html` 6,5 Mo ; l'accueil 4 Mo dont `couverture-big-bang.jpg` à **2,3 Mo**. Les vignettes sont `loading="lazy"` (bon réflexe) mais **sans `width`/`height`** (CLS) et les premières images de l'accueil sont aussi en `lazy` (retarde le LCP). Les JPEG/PNG d'origine sont servis tels quels. Pas de `srcset`. | Pipeline d'images de la refonte (`@11ty/eleventy-img` : WebP/AVIF, largeurs multiples, dimensions imposées) ; première rangée de l'accueil en `loading="eager"` + `fetchpriority="high"`. Objectif : accueil < 500 Ko d'images. Lighthouse n'était pas installé : valeurs LCP/CLS **estimées**, à mesurer après refonte. |
| **NAV-19** | Mineur | `liste-des-publications.html` : 17 367 mots, **787 liens**, 248 Ko (64 Ko compressés), 4 niveaux de titres, **3 liens entrants seulement** (`qui-suis-je.html`, `annexes/abst_sci.html`…). Ressource précieuse (bibliographie complète) mais enfouie, et inexistante dans la refonte. | La conserver sous forme de page « Bibliographie » (`/bibliographie/`), avec sommaire ancré et filtres par type/thème/année, liée depuis la bio et le pied de page. |

### 1.5 Contact et appel à l'action

| ID | Sév. | Constat | Recommandation |
|---|---|---|---|
| **NAV-20** | Majeur | `contact.html` : un titre et une adresse `mailto:` (54 mots). Aucun formulaire, aucun réseau social, aucune mention de la disponibilité pour des conférences, aucun lien vers APALA. Le contact est pourtant la dernière étape de presque tous les parcours professionnels (voir §2). | Page Contact avec : bloc « Inviter Thomas pour une conférence » (sujets proposés, formats, zone), formulaire ou `mailto` pré-rempli (objet), réseaux (LinkedIn, Instagram), lien APALA. |

---

## 2. Parcours utilisateurs (ux-heuristics : Nielsen + Krug)

Clics comptés depuis l'accueil du site vivant.

| # | Persona / tâche | Chemin actuel | Clics | Frictions | Verdict |
|---|---|---|---|---|---|
| P1 | Lecteur cherche un livre précis (*Univers parallèles*) | Accueil montre seulement 4 livres récents → « Tous mes livres » → grille de 32 couvertures **sans titre** → fiche. Ou loupe → saisie → résultat. | 3 (ou 3 actions) | Titres invisibles, livres anciens introuvables sans scruter les alt ; 3 entrées de recherche cassées. | Acceptable mais devinette |
| P2 | Lecteur veut l'avis de Lepeltier sur un essai (ex. Piketty & Sandel) | Menu « Comptes rendus » → page **A** → il faut deviner la lettre de l'auteur → page → vignette → chronique. Sinon loupe (1ʳᵉ recherche ≈ 805 Ko). | 4-5 | Index par auteur uniquement ; la lettre n'est pas la bonne si on connaît le titre. | Faible |
| P3 | Journaliste cherche bio + conférences | Menu « Qui suis-je ? » (182 mots, 1 photo) puis… aucune entrée « Conférences » : il faut revenir à l'accueil, descendre au bas de la 4ᵉ section, « Autres interventions ». | 3 | Conférences cachées, bio très brève, aucun dossier de presse ni photo téléchargeable. | **Échec partiel** |
| P4 | Organisateur veut inviter Thomas | Aucun parcours dédié. Conférences (cachées) → images sans texte → Contact (mail seul). | ≥ 4, sans CTA | Pas de thèmes proposés, pas de formulaire, pas d'APALA. | **Échec** |
| P5 | Étudiant cherche un article | Menu « Articles » → page de 165 vignettes (64 Mo d'images) groupées par 7 thèmes, aucun filtre, 47 vignettes qui mènent à une image, 217 liens externes ouverts dans le même onglet (aucun retour facile). | 2-3 | Page lente, pas de recherche sur place, pas de date/revue lisible. | Faible |
| P6 | Visiteur mobile | Menu de 7 éléments sur 2 lignes (pas de burger), barre non collante ; accueil 4 Mo d'images ; grille 2 colonnes sous 560 px. | — | Menu lisible et sans hamburger (point fort), mais poids de page et cibles tactiles de 19 px (loupe). | Moyen |

**Test du coffre (Krug)** sur 5 pages : le visiteur sait-il (a) où il est, (b) à quel site, (c) quelles sont les rubriques, (d) comment chercher ?

| Page | Site ? | Page ? | Rubriques ? | « Vous êtes ici » ? | Recherche ? |
|---|---|---|---|---|---|
| Accueil | Oui | Oui (« Mes derniers livres »…) | Oui | Oui (onglet souligné) | Loupe discrète |
| Livres | Oui | Oui (h2 « Mes livres ») | Oui | Oui | Loupe |
| Chronique | Oui | **Non**, le h1 est le nom du site | Oui | Oui (« Comptes rendus » souligné) | Loupe |
| Articles | Oui | Oui | Oui | Oui | Loupe |
| Conférences | Oui | Oui | **Non, la rubrique n'est pas dans le menu** | **Non** (aucun onglet actif) | Loupe |

**Score ux-heuristics (navigation) : 6 / 10.** Points forts : menu court et stable, libellés simples, état actif visible, boutons et résultats de recherche bien étiquetés, pas de menu burger caché. Points à lever pour atteindre 10 : conférences invisibles et sans CTA (−2), index de comptes rendus à une seule dimension (−1), titre de page invisible (h1 générique) (−1), vignettes sans titre ni page cible (−1), absence de fil d'Ariane / retour / contenus liés (−1).

---

## 3. Structure cible proposée

Alignée sur le brief (`../notes.md` : productions d'abord, conférences mises en avant, « Qui suis-je ? », contact) et sur les URL **déjà construites** dans la refonte (aucune redirection supplémentaire à gérer pour `/livres/`, `/chroniques/`, `/articles/`, `/bio/`, `/contact/`).

```
Menu : Productions ▾ | Conférences | Qui suis-je ? | Contact | 🔍 (champ de recherche)

/                                   Accueil : productions (livres, chroniques, articles), conférences, mini-bio
├── /productions/                   (à créer) hub : 3 cartes + recherche globale
│   ├── /livres/                    Mes livres · Ouvrages dirigés · Contributions (ancres)
│   │   └── /livres/<slug>/         fiche + table des matières (#table-des-matieres) + extraits de presse
│   ├── /chroniques/                comptes rendus : filtres thème / année / auteur, pagination
│   │   ├── /chroniques/<slug>/     une chronique
│   │   └── /chroniques/auteurs/<lettre>/   (optionnel) index alphabétique
│   ├── /articles/                  articles & entretiens, filtres par thème/revue/année
│   │   └── /articles/<slug>/
│   └── /bibliographie/             (à créer) l'ancienne « liste des publications »
├── /interventions/                 Conférences : liste datée + CTA « Inviter Thomas » + APALA
├── /bio/                           intitulé « Qui suis-je ? » ; affiliations (Oxford, L'Amorce)
├── /contact/                       coordonnées + bloc invitation + réseaux
├── /recherche/                     (noindex) résultats Pagefind
├── /annexes/<slug>/                (à créer) textes complémentaires (créationnisme, d'Espagnat…)
└── Pied de page : /mentions-legales/ · /confidentialite/ · flux RSS · réseaux
```

Choix à valider : garder l'URL `/interventions/` (déjà construite, libellé de menu « Conférences ») plutôt que de renommer en `/conferences/`. Les pages techniques du modèle de départ (`/styleguide/`, `/card/`, `/built-with/`, `/pages/test/`, `/test/`) ne doivent pas être publiées.

---

## 4. Plan de redirections 301

Le crawl donne un **mappage complet** : 524 chroniques appariées par le nom de fichier de leur couverture (clé fiable : elle figure dans l'ancienne page et dans la nouvelle), 3 appariées par titre, 1 sans équivalent (Gollier, *L'économie de l'(in)action climatique*), plus les 62 autres pages. Détail et remarques ligne par ligne dans le CSV.

| Famille | Règle | Nombre |
|---|---|---|
| Pages principales | `index.html → /`, `qui-suis-je.html → /bio/`, `livres.html → /livres/`, `articles.html → /articles/`, `conferences.html → /interventions/`, `contact.html → /contact/` | 6 |
| Chroniques | `/cr/<ancien>.html → /chroniques/<nouveau-slug>/` (règle **par fichier**, les slugs diffèrent) | 528 |
| Index d'auteurs | `/auteurs/a_*.html → /chroniques/` (ou l'index de lettre s'il est recréé) | 25 |
| Fiches livres | par fichier (14), ex. `darwin-heretique.html → /livres/darwin-heretique-l-eternel-retour-du-creationnisme/` | 14 |
| Tables des matières | `<dossier>/(tdm\|contents).html → /livres/<slug>/#table-des-matieres` | 7 |
| Annexes | `/annexes/**.html → /annexes/<slug>/` (**pages à créer**) | 6 |
| Divers | `liste-des-publications.html → /bibliographie/` (**à créer**), `articles/lecture/*` | 3 |
| Recherche | `/recherche.html` (avec ou sans `?de=`) `→ /recherche/` | motif |
| Domaines | free.fr (toutes pages) et `http://` : un seul saut vers la cible finale | motif |

### 4.1 Extrait `vercel.json` (hébergement actuel : Vercel)

Vercel ignore le fichier `_redirects` que génère aujourd'hui le gabarit `src/common/_redirects.njk` (de plus, `dist/_redirects` est **vide** : aucune page n'a de `redirectFrom`). Le plus simple est de générer `redirects` dans `vercel.json` à partir du CSV (593 règles : sous la limite documentée de Vercel pour ce fichier, à revérifier au moment du déploiement).

```json
{
  "cleanUrls": false,
  "trailingSlash": true,
  "redirects": [
    { "source": "/index.html",                     "destination": "/",               "permanent": true },
    { "source": "/qui-suis-je.html",               "destination": "/bio/",           "permanent": true },
    { "source": "/livres.html",                    "destination": "/livres/",        "permanent": true },
    { "source": "/articles.html",                  "destination": "/articles/",      "permanent": true },
    { "source": "/conferences.html",               "destination": "/interventions/", "permanent": true },
    { "source": "/contact.html",                   "destination": "/contact/",       "permanent": true },
    { "source": "/liste-des-publications.html",    "destination": "/bibliographie/", "permanent": true },
    { "source": "/recherche.html",                 "destination": "/recherche/",     "permanent": true },
    { "source": "/auteurs/:fichier.html",          "destination": "/chroniques/",    "permanent": true },
    { "source": "/darwin-heretique.html",          "destination": "/livres/darwin-heretique-l-eternel-retour-du-creationnisme/", "permanent": true },
    { "source": "/cr/gilson.html",                 "destination": "/chroniques/<nouveau-slug>/", "permanent": true }
  ]
}
```

Notes d'implémentation :
- Générer les 528 règles `cr/*` et les 14 fiches livres depuis le CSV (script Node ou Python dans la chaîne de build) ; ne pas les écrire à la main.
- Avantage d'une règle **par fichier** pour `cr/` : les slugs de la refonte ne reprennent pas ceux de l'ancien site.
- Le paramètre `?de=…` ne change pas la cible ; vérifier au déploiement que la requête n'est pas recopiée gênante.
- Les 6 règles « à créer » doivent pointer vers la bonne page **avant** la mise en ligne, sinon rediriger temporairement vers la rubrique mère (302) pour ne pas diffuser de 404 en 301.
- `www` reste l'hôte canonique (l'apex le redirige déjà en 308 : conserver).

### 4.2 Domaine free.fr (`.htaccess`, à tester sur l'hébergement)

```apache
RewriteEngine On
# table de correspondance exacte pour les URL qui changent (générée depuis le CSV)
RewriteRule ^qui-suis-je\.html$ https://www.thomaslepeltier.fr/bio/ [R=301,L]
# repli : même chemin sur www (qui redirige ensuite vers la cible finale)
RewriteRule ^(.*)$ https://www.thomaslepeltier.fr/$1 [R=301,L]
```

### 4.3 Points d'attention

- Les chroniques de la refonte comptent **552** URL pour **528** anciennes pages : 24 sont nouvelles ou issues d'un autre tri, à vérifier (pas de redirection nécessaire, mais présence dans le sitemap).
- Le contenu de l'ancien `cr/hoquet-buffon-linne-biologie.html` correspond à `/chroniques/buffon-/-linne-eternels-rivaux-de-la-biologie/` : un `/` dans le titre a créé un chemin imbriqué. **À corriger côté refonte avant de rediriger** (slug propre `buffon-linne-eternels-rivaux-de-la-biologie`).
- Le CR double Villalba + Oury est réduit à la seule chronique Oury dans la refonte : à fusionner ou à recréer.
- Redirections à **ne pas** casser : les images d'articles et de couvertures servent parfois de liens externes. Conserver ou rediriger `articles/1er-page/*` et `cr/-couvertures/*` pendant au moins 12 mois.

---

## 5. Points de vigilance sur la refonte (`dist/`)

Cette section ne sort pas du périmètre navigation/URL/SEO : ce sont les écarts qui feraient perdre le bénéfice de la migration.

| ID | Sév. | Constat dans la refonte | Recommandation |
|---|---|---|---|
| **NAV-21** | **Critique** | Dans le build local, `canonical`, `sitemap.xml` (717 URL) et `robots.txt` pointent vers `http://localhost:8080/…` (variable `URL` non définie). Si déployé ainsi, Google reçoit des canonicals invalides. | Définir `URL=https://www.thomaslepeltier.fr` dans l'environnement de build Vercel et vérifier `dist/` avant mise en ligne. |
| **NAV-22** | Majeur | `dist/_redirects` est vide et Vercel ne le lit pas : **aucune** redirection n'est en place pour les 590 anciennes URL. | Générer `vercel.json` depuis le CSV (§4.1) ; test de redirection en masse (§6). |
| **NAV-23** | Majeur | Ce qui existe sur l'ancien site et manque dans la refonte : fiche *La Face cachée de l'Univers* (14 fiches construites, dont la 1ʳᵉ édition de *Histoire et philosophie des sciences* qui n'a pas de page sur l'ancien site, mais pas ce livre), tables des matières (le champ `lien_table_des_matieres` pointe vers `viande-de-culture/tdm.html`, y compris pour *Imposture intellectuelle*, mauvais livre), 6 annexes, bibliographie (17 000 mots), liste datée des conférences. Les fichiers `src/pages/annexes/*.html` ne sortent pas dans `dist/`. | Créer ces pages (§3) avant d'activer les redirections correspondantes. |
| **NAV-24** | Majeur | Menu de la refonte : Accueil, Bio, Livres ▾, Articles, Chroniques, Contact. **« Interventions » n'y figure pas** (même défaut que l'ancien site). Pagefind n'est pas présent dans `dist/` (étape `npx pagefind` du script `build` non exécutée) : la page `/recherche/` n'a pas d'index. | Ajouter Conférences au menu ; vérifier que le déploiement lance `npm run build` et non `build:11ty`. |
| **NAV-25** | Majeur | Slugs des chroniques générés depuis le titre : guillemets français conservés (`…l«-affaire-arius-»`, `lost-ego-la-tragedie-du-«-je-suis-»`), titres jusqu'à 95 caractères, 1 chemin imbriqué (`buffon-/-linne-…`). Dates `1234-01-01` en front matter (18 URL du sitemap en `lastmod` 1234). | Filtre `slugify` strict (ASCII, sans « / » ni guillemets), longueur ≤ 70 ; dates réelles. |
| **NAV-26** | Mineur | Le sitemap et `dist/` contiennent des pages du modèle de départ : `/card/`, `/styleguide/`, `/built-with/`, `/pages/test/`, `/test/`, des tags techniques (`/tags/fetch/`, `critiquesg`, `meslivres`, `livresdiriges`). Chronique de test `resolution-max-test`. | Les exclure du build ou `noindex` + retrait du sitemap. |
| **NAV-27** | Mineur | Chroniques paginées par 50 (12 pages `/chroniques/page-N/`) sans index alphabétique ni filtre serveur ; titres de page courts (« Ma biographie », « Liste des livres publiés ») sans la marque. | Pagination + filtres Pagefind ; gabarit de titre `Page · Thomas Lepeltier`. |

---

## 6. Checklist de contrôle post-migration

À exécuter dans cet ordre, le jour de la mise en ligne puis à J+7, J+30, J+90.

1. **Avant bascule** : `URL` de production définie ; `dist/sitemap.xml` et `dist/robots.txt` sans `localhost` ; `vercel.json` généré ; page 404 de la refonte active ; pages à créer (§5, NAV-23) publiées.
2. **Test en masse des redirections** : boucler sur le CSV avec `curl -s -o /dev/null -w "%{http_code} %{redirect_url}"` ; attendu : 301 puis 200 sur la cible, **zéro chaîne** (une seule redirection) et zéro 404. Rejouer sur l'ancien domaine free.fr.
3. **Crawl de la nouvelle version** (Screaming Frog ou `wget --spider`) : 0 lien interne cassé, 0 image cassée, un seul `<h1>` par page, `canonical` présent, aucune page `noindex` par erreur.
4. **Search Console** : ajouter la propriété du domaine ; envoyer le nouveau sitemap ; utiliser l'outil de changement d'adresse si l'hôte change ; suivre « Pages » (non indexées, 404 soft, doublons) et « Expérience » (LCP, CLS, INP).
5. **Indexation** : contrôler `site:thomaslepeltier.fr` à J+7 et J+30 ; les 590 anciennes URL doivent progressivement disparaître au profit des nouvelles.
6. **Recherche interne** : requêtes types (« darwin », « véganes », « Piketty ») : chaque résultat renvoie 200.
7. **Liens externes** : relancer la vérification (≈ 1 083 URL) ; remplacer les 404 par des archives.
8. **Mesure** : Lighthouse mobile sur accueil, une fiche livre, une chronique, `/articles/` ; seuils visés : LCP < 2,5 s, CLS < 0,1, accessibilité ≥ 95.
9. **Conserver** les anciennes redirections au moins 12 mois ; ne jamais les réaffecter.

---

## 7. Synthèse navigation / SEO (ordre de priorité)

| Priorité | Action | Impact | Effort | Constats |
|---|---|---|---|---|
| 1 | Fixer `URL` de production et vérifier canonicals/sitemap/robots de `dist/` | Très élevé | Faible | NAV-02, NAV-21 |
| 2 | Redirections 301 générées depuis le CSV (+ free.fr) | Très élevé | Moyen | NAV-01, NAV-22 |
| 3 | Un `<h1>` par page, gabarits de titres et descriptions | Élevé | Faible | NAV-03, NAV-05 |
| 4 | Créer les pages manquantes (Face cachée, TDM, annexes, bibliographie, conférences datées) | Élevé | Moyen | NAV-23, NAV-19, NAV-07 |
| 5 | Menu : Productions / Conférences / Qui suis-je ? / Contact + champ de recherche ; CTA d'invitation | Élevé | Faible | NAV-07, NAV-20, NAV-24 |
| 6 | Pagefind plein texte + page 404 utile | Élevé | Moyen | NAV-14, NAV-15, NAV-02 |
| 7 | Images optimisées, dimensions, LCP | Élevé | Moyen | NAV-18 |
| 8 | Corriger slugs (« / », guillemets) et dates `1234` | Moyen | Faible | NAV-25 |
| 9 | Fil d'Ariane, précédent/suivant, contenus liés ; vignettes jamais vers une image | Moyen | Moyen | NAV-10, NAV-11 |
| 10 | Nettoyage : liens cassés, affiliation `sponsored`, pages de modèle, `noindex` recherche | Moyen | Faible | NAV-06, NAV-12, NAV-17, NAV-26 |

---

*Limites de l'audit : pas de Lighthouse ni de mesure réelle du LCP/CLS (outil absent), valeurs estimées. Les 108 liens externes en 403 (blocage de robot) n'ont pas été vérifiés à la main. La part d'« ancienne » et de « nouvelle » version du site vivant a été déduite de l'en-tête de `styles_new.css` ; le crawl a été fait sur l'état en ligne le 23 octobre 2026.*
