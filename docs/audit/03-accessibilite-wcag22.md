# Audit d'accessibilité — WCAG 2.2 niveau AA

**Site audité :** https://www.thomaslepeltier.fr/ (état du 23/10/2026, miroir local de 590 pages HTML, 1 463 images, 10 PDF)
**Comparé à :** la refonte `eleventy-excellent` (build `dist/` du jour, 753 pages)
**Référentiel :** WCAG 2.2 AA. La grille des skills `accessibility-review` et `ux-heuristics` est en WCAG 2.1. Je l'ai étendue aux critères 2.2 : 2.4.11, 2.5.7, 2.5.8, 3.2.6, 3.3.7, 3.3.8, plus 2.4.13 à titre indicatif.

---

## 1. Méthode et limites

| Volet | Outil / méthode | Portée |
|---|---|---|
| Automatique | `pa11y` 9.1.1 avec les runners **HTML_CodeSniffer + axe-core 4.11**, standard WCAG2AA, viewports 1280 px et 320 px | 15 pages représentatives du site d'origine (×2 viewports) et 13 pages de la refonte (×2) |
| Analyse statique | Script Python sur les 590 pages : titres, landmarks, `lang`, `alt`, textes de liens, balises obsolètes | 100 % du site |
| Navigateur piloté | Puppeteer et Chromium : tailles de cibles, parcours Tab (150 tabulations avant, 60 arrière), focus masqué par l'en-tête collant, espacement du texte (1.4.12), reflow à 320 px, test réel de la recherche | 13 pages |
| Calcul | Ratios de contraste WCAG calculés sur toute la palette CSS du site | Toutes les couleurs déclarées |
| Revue manuelle | Lecture du balisage et du CSS (`styles_new.css`, feuilles intégrées aux pages, `recherche-moteur.js`) | Gabarits |

**Limites.** Aucun test avec un vrai lecteur d'écran (NVDA, VoiceOver, JAWS) : le tableau « lecteur d'écran » est déduit du balisage et doit être validé en recette. L'automatique détecte environ 30 % des problèmes. Les PDF ont été examinés avec `pdfinfo` seulement.

**Remarque de contexte.** Le site actuel est déjà une version modernisée en septembre 2026 par rapport à l'original (police Charter/Georgia au lieu de Times New Roman, couleurs adoucies, adaptation mobile). Les constats portent sur cet état. Il est nettement meilleur que l'original sur la structure : `lang="fr"`, landmarks `header`/`nav`/`main`/`footer`, pas de tableaux de mise en page, pas de `<font>` ni de `<center>`, 0 image sans attribut `alt`, aucun iframe.

---

## 2. Synthèse chiffrée

### Site d'origine

| Sévérité | Nombre de constats |
|---|---|
| Critique | 2 |
| Majeur | 8 |
| Mineur | 9 |
| **Total** | **19** |

- **Pa11y, 15 pages :** 5 des 15 pages testées sont sans erreur (accueil, livres, conférences, contact, recherche). Les alternatives textuelles non pertinentes de la page conférences passent pourtant inaperçues. Total : 1 022 occurrences axe `link-in-text-block`, 35 contrastes insuffisants, 3 `AlignAttr`, 4 liens sans nom.
- **Statique, 590 pages :**
  - 589 pages sur 590 ont un attribut `lang`.
  - 588/590 ont un `h1` unique, mais **identique** sur chaque page.
  - 1 283 des 1 463 images (88 %) ont un `alt` qui est un nom de fichier ou un slug.
  - Aucune page n'a de lien d'évitement.
- **Navigateur :** aucun défilement horizontal à 320 px sur les 13 pages testées. L'espacement du texte (1.4.12) ne casse rien. Les liens de texte ne sont jamais soulignés au repos (0 sur 77 liens de texte échantillonnés).

### Refonte (build `dist/`)

pa11y sur 13 pages : **389 erreurs de contraste** (axe), 13 `aria-valid-attr-value`, 2 `aria-prohibited-attr`, 2 `aria-required-children`, 2 `link-name`. Une seule cause racine explique l'essentiel : l'orange `#FF922B` utilisé comme couleur de texte et comme fond de bouton (ratio 2,11:1). Voir §7.

---

## 3. Constats — site d'origine

Format : identifiant, critère WCAG 2.2 (niveau), sévérité, constat factuel, recommandation pour la refonte.

### 🔴 Critiques

#### A11Y-01 — Conférences : affiches sans alternative textuelle
- **Critères :** 1.1.1 (A), 2.4.4 (A), 4.1.2 (A)
- **Constat :** `conferences.html` contient 51 images-liens. Les 51 ont pour `alt` le nom de fichier, par exemple `2024-ralentir-nantes.jpg` ou `2026-progres-ia-apala`. Le titre de la conférence, la date, le lieu et l'organisateur n'existent que dans les pixels des affiches (vérifié sur `conferences/2024-ralentir-nantes.jpg` : « Le ralentissement de l'activité économique est-il éthique ? », 27 septembre 2024, Nantes Université). Le nom accessible du lien est donc illisible. 37 de ces liens sur 65 ouvrent directement le fichier image. Pa11y ne le détecte pas, car l'`alt` n'est pas vide.
- **Impact :** la page est inutilisable avec un lecteur d'écran. C'est aussi une perte SEO : les titres de conférences ne sont pas indexables comme texte.
- **Recommandation :**
  1. Modéliser chaque intervention en données : titre, date, lieu, organisateur, type, lien (vidéo, replay).
  2. Rendre une carte **textuelle** (`<h2>` ou `<h3>` avec le titre, `<time datetime>`, lieu), avec l'affiche en vignette `alt=""`.
  3. Si l'affiche est affichée en grand, ajouter une `alt` utile ou `<figcaption>` reprenant son texte.
  4. Pas de lien vers un `.jpg` nu.
  5. Prévoir la même règle pour les 5 vignettes de l'accueil.

#### A11Y-02 — Structure des titres : le `h1` est le nom du site sur toutes les pages
- **Critères :** 1.3.1 (A), 2.4.6 (AA), 2.4.2 (A)
- **Constat :** le bandeau place `<h1>L'univers livresque de Thomas Lepeltier</h1>` dans l'en-tête de 588 pages sur 590. Le vrai titre de la page est un `h2` sur les pages principales (« Livres », « Contact »). Sur les **528 comptes rendus**, le titre du livre recensé n'est dans **aucun titre** : l'unique titre de la page est le nom du site (vérifié sur `cr/gilson.html`, `headings = [h1]`). La recherche a aussi son `h2` « Rechercher » comme seul titre propre. La navigation par titres est donc inutile, et toutes les pages ressemblent à la même au premier coup d'oreille. Le `<title>` est correct sur les comptes rendus mais **générique** sur 32 pages (« Site de Thomas Lepeltier : Livres », etc.), donc différent du `h1`.
- **Recommandation :**
  1. Un `h1` unique par page, égal au sujet de la page (titre du livre ou de l'article, « Livres », « Contact »).
  2. Le nom du site passe dans un `<p>` ou un lien de logo, jamais dans un `h1`.
  3. Pour les comptes rendus : `h1` = « Compte rendu de *[Titre]*, [Auteur] » ; la référence bibliographique reste un bloc secondaire.
  4. `<title>` = « H1 — Thomas Lepeltier », avec la même formulation partout.
  5. Pas de saut de niveaux (pas de saut constaté aujourd'hui : à conserver).

### 🟠 Majeurs

#### A11Y-03 — Textes alternatifs = noms de fichiers (couvertures)
- **Critères :** 1.1.1 (A), 2.4.4 (A)
- **Constat :** 1 283 images sur 1 463 ont un `alt` de type slug : `aboudrar-voile-musulman`, `faut-il-sauver-ours-blanc`, `avant-big-bang-1-2026`. Répartition :
  - `auteurs/a_*.html` : 23 sur 23 sur la page testée (25 pages, environ 600 vignettes) ;
  - `livres.html` : 29 sur 32 ;
  - `articles.html` : 117 sur 165 ;
  - 528 comptes rendus : la couverture a un `alt` du même type.
  Sur les listes d'auteurs et d'articles, l'image et la légende donnent **deux liens adjacents vers la même cible** (image dont le nom est le slug, puis texte), ce qui double les arrêts de tabulation (614 liens image sur les listes d'auteurs). Sur l'accueil, les `alt` sont corrects (« Faut-il sauver l'ours blanc ? »). Il est donc possible de bien faire.
- **Recommandation :**
  - Couverture seule dans un lien : `alt="Couverture de « Titre », Auteur"`.
  - Couverture à côté d'une légende qui contient déjà le lien : mettre `alt=""` et ne garder qu'**un** lien (ou rendre la carte entière cliquable avec un seul `<a>` autour du titre et l'image en `aria-hidden` via CSS `::after` stretch).
  - Générer l'`alt` depuis les métadonnées du livre (champ `titre` + `auteur`) au moment du build, jamais depuis le nom de fichier.
  - Ajouter une règle d'éditorial (§9) et un test en CI qui échoue si `alt` ressemble à un slug ou à un nom de fichier.

#### A11Y-04 — Liens du texte courant non distinguables autrement que par la couleur
- **Critère :** 1.4.1 (A) (et 1.4.11 pour l'indicateur)
- **Constat :** `a { text-decoration: none }` est global ; le soulignement n'apparaît qu'au survol. Le contraste entre le lien `#1449c4` et le texte voisin `#2B2721` est de **1,96:1** (minimum 3:1 sans autre indice). Axe signale `link-in-text-block` en **1 022 occurrences** (dont 404 sur `liste-des-publications.html`, 89 sur `articles.html`) sur 9 pages sur 15. Sur l'échantillon mesuré dans `main`, 0 des 77 liens de paragraphes ou de listes est souligné.
- **Recommandation :** souligner les liens du corps de texte en permanence (`text-decoration: underline; text-underline-offset: .15em; text-decoration-thickness: 1px`), et laisser les liens de navigation sans soulignement. C'est la seule solution robuste : un bleu plus saturé ne passe pas le 3:1 contre l'encre sombre.

#### A11Y-05 — Rouge `#E03B27` insuffisamment contrasté
- **Critère :** 1.4.3 (AA)
- **Constat :** 3,76:1 sur le papier `#F4EEE0` et 4,08:1 sur le cadre crème `#FFF8D9` (minimum 4,5:1). Éléments touchés : `.cr-achat` (« Pour acheter ce livre : », 1 par compte rendu ; confirmé sur `cr/gilson.html`) et `.texte-cite` (citations en rouge dans `autre-cosmos/debats.html` : 34 occurrences pour cette seule page).
- **Recommandation :** remplacer par un rouge ≥ 4,5:1 sur la crème, par exemple `#B3261E` (6,13:1). Le CSS contient déjà `#b3121d` (6,01:1) pour d'autres usages : harmoniser autour d'un seul rouge.

#### A11Y-06 — Focus clavier masqué par l'en-tête collant
- **Critère :** 2.4.11 Focus non masqué, minimum (AA, nouveau en 2.2)
- **Constat :** au-dessus de 760 px, `.barre` est `position: sticky` (63 px de haut, `z-index: 10`) et `scroll-padding-top` vaut `auto`. Sur `articles.html`, en tabulant, **41 des 150 éléments focalisés (27 %) se retrouvent au moins en partie sous la barre**. En Maj+Tab, c'est 25 sur 60 (42 %).
- **Recommandation :** `html { scroll-padding-top: calc(var(--header-h) + 1rem); }`, sur la hauteur réelle de l'en-tête. Sinon, ne pas rendre l'en-tête collant sur les pages longues. À tester sur la refonte avec la même procédure (Tab ×150).

#### A11Y-07 — Résultats de recherche non annoncés
- **Critère :** 4.1.3 Messages d'état (AA)
- **Constat :** la recherche fonctionne (testée : « darwin » → « 14 résultats pour « darwin » », répartis en Livres 1, Articles 1, Comptes rendus 12) et son champ est correctement étiqueté (`<label>` masqué visuellement, `role="search"`). Mais `#compte` n'a ni `aria-live`, ni `role="status"` : le nombre de résultats et le message « Recherche en cours… » ne sont pas annoncés. La page n'a pas de `h1` propre (seulement `h2` « Rechercher »). Le script lit les pages côté navigateur (aucun index) : sans JavaScript, un `<noscript>` renvoie vers les listes (bon point).
- **Recommandation :**
  - `<p id="compte" role="status" aria-live="polite">`.
  - `h1` « Rechercher ».
  - Déplacer le focus sur le compteur ou garder le focus dans le champ avec annonce.
  - Avec Pagefind (déjà dans `npm run build` de la refonte), conserver ces mêmes attributs sur le composant de résultats.

#### A11Y-08 — Liens sans nom accessible ou sans contenu (liste des publications)
- **Critères :** 2.4.4 (A), 4.1.2 (A)
- **Constat :** sur `liste-des-publications.html` : une couverture entourée d'un lien avec `alt=""` (`creationnisme-est-il-scientifique-2.jpg`, nom accessible vide) et deux ancres vides vers `http://www.scienceshumaines.com` (`<a href="…"> </a>`). Axe `link-name` ×4, HTML_CodeSniffer `NoContent` ×2. La page compte 787 éléments focalisables, 740 liens dans le texte, sans lien d'évitement ni sommaire intermédiaire efficace.
- **Recommandation :** corriger ces trois liens ; découper la liste en sections avec table des matières de saut (`#livres`, `#articles`, `#comptes-rendus`) ; avec la refonte, regrouper par année avec `<details>` ou pagination plutôt qu'une page unique de 17 000 mots.

#### A11Y-09 — Texte d'articles servi sous forme d'image ; PDF non balisés
- **Critères :** 1.4.5 (AA), 1.1.1 (A), 1.3.1 (A)
- **Constat :** 41 liens de `articles.html` et 5 de l'accueil ouvrent un fichier image (`.jpg`/`.webp`, première page de l'article scannée) sans transcription. Les 10 PDF (`articles/lecture/*.pdf`, de 1 à 14 pages) sont tous **non balisés** (`Tagged: no`), sans titre exploitable (« Ens_Hist_Phys », « Parrique », un PDF sans titre).
- **Recommandation :**
  - Republier chaque texte en HTML (le contenu sert aussi le référencement).
  - Si un PDF doit rester, le regénérer **balisé** (Word « Enregistrer sous PDF accessible » ou InDesign), avec titre et langue.
  - Le lien doit annoncer « (PDF, 9 pages) ».
  - Ne pas lier un `.jpg` nu comme destination de carte.

#### A11Y-10 — Pages hors gabarit (2 pages)
- **Critères :** 3.1.1 (A), 1.4.4 et 1.4.10 (AA), 2.4.6 (AA)
- **Constat :** `articles/lecture/creationism-france.html` n'a ni `lang`, ni viewport, ni `h1`, et un titre générique. `articles/lecture/viande-de-culture-l-express.html` n'a ni viewport ni `h1`. Ces deux pages utilisent l'ancienne feuille `styles_new.css`. Sans meta viewport, la page ne s'adapte pas au mobile (zoom forcé pour lire).
- **Recommandation :** les migrer vers le gabarit commun de la refonte (§9).

### 🟡 Mineurs

#### A11Y-11 — Aucun lien d'évitement
- **Critère :** 2.4.1 (A), satisfait en partie par les landmarks
- **Constat :** premier arrêt Tab = « Accueil » sur toutes les pages (menu de 7 liens avant le contenu). Les landmarks `nav`/`main` permettent techniquement de contourner. Mais sur `articles.html` (305 focalisables) ou la liste des publications (787), l'absence de lien « Aller au contenu » et de sommaire se ressent.
- **Recommandation :** « Passer au contenu » en premier élément focalisable, visible au focus. La refonte l'a déjà (`skipContent` dans `meta.js`, vérifié dans `dist/index.html`).

#### A11Y-12 — Cibles tactiles petites
- **Critère :** 2.5.8 Taille de la cible, minimum (AA, nouveau en 2.2)
- **Constat :** le menu d'en-tête mesure 38 px de haut au repos (OK). Dans le pied de page, les liens font **24 px de haut à 1280 px et 22 px à 320 px**, la loupe 19×19 px. Ils passent grâce à l'exception d'espacement (au moins 16 px entre cibles), mais pas avec marge de sécurité. Les liens dans une phrase sont exemptés.
- **Recommandation :** cibles ≥ 24×24 px garanties par le CSS (`min-block-size: 2.75rem` sur les liens de nav et de pied, 44 px de préférence sur mobile), icône de recherche entourée d'un bouton de 44 px.

#### A11Y-13 — Texte alternatif des couvertures vide sur 3 comptes rendus, et alternatives de listes
- **Critère :** 1.1.1 (A)
- **Constat :** 3 comptes rendus ont une couverture avec `alt=""` (`engel-epistemologie-pour-une-marquise`, `lurz-mindreading-animals`, `prinz-beyond-human-nature`) : acceptable si la référence figure en texte juste à côté (c'est le cas), mais inconstant. 3 autres `alt` vides sont dans `univers_paralleles/contents.html`, `darwin-heretique/contents.html` et la liste des publications.
- **Recommandation :** règle unique d'éditorial (§9) : si la référence est en texte, `alt=""` ; sinon `alt` descriptif.

#### A11Y-14 — Lettre « vide » de l'index alphabétique trop pâle
- **Critère :** 1.4.3 (AA), exemption possible pour composant inactif
- **Constat :** `.alphabet .vide` (la lettre « X » sans entrée) est en `#A8A093` sur le papier : **2,24:1**. Pa11y le signale ×35 sur 3 pages. Cette lettre n'est pas un lien : c'est un état inactif, donc plausiblement exempté, mais le texte « X » reste lu par les lecteurs d'écran sans contexte.
- **Recommandation :** soit `aria-hidden="true"` sur les lettres vides, soit un gris ≥ 4,5:1 avec `aria-disabled="true"`.

#### A11Y-15 — Pas de liste sémantique pour les cartes
- **Critère :** 1.3.1 (A)
- **Constat :** les 23 à 160 cartes par page sont des `<figure>` dans un `<div class="grille">` : pas de `<ul>/<li>`. Un lecteur d'écran n'annonce ni le nombre d'éléments ni la position.
- **Recommandation :** `<ul role="list">` avec `<li>` par carte.

#### A11Y-16 — Indicateur de lien externe seulement visuel
- **Critère :** 3.2.2 / 2.4.4 (bonne pratique, lié à H83)
- **Constat :** les 77 pastilles `↗` des cartes d'articles sont `aria-hidden="true"` : un utilisateur de lecteur d'écran ne sait pas que la carte quitte le site. Deux pages ouvrent des liens dans des fenêtres nommées (`target="new_1"`, `new_4`, `new_5`) sans avertissement.
- **Recommandation :** ajouter un texte masqué « (nouvelle fenêtre) » ou « (site externe) », et éviter les `target` nommés ; si `_blank`, ajouter `rel="noopener"`.

#### A11Y-17 — Balises obsolètes sur les annexes
- **Critère :** 4.1.1 (A, dépréciation en 2.2) / 1.3.1
- **Constat :** `<hr width="93%" color="black" align="left">` sur 3 annexes (`annexes/abst_sci.html`, `annexes/creationnisme/science-est-elle-un-jeu.html`, `autre-cosmos/debats.html`), erreur HTML_CodeSniffer `AlignAttr`.
- **Recommandation :** retirer ces attributs, styler en CSS.

#### A11Y-18 — Petits corps de texte et animation de survol
- **Critères :** 1.4.4 (AA, le zoom reste possible), 2.3.3 (AAA)
- **Constat :** corps courant de 19 px (très bien), mais légendes en 0,74 em × 19 px = **14 px**, sous-titre de marque à 11,9 px en capitales, pastille `↗` 12,9 px. Aucune règle `prefers-reduced-motion` ; les cartes se soulèvent de 3 px au survol en 0,16 s (`transform: translateY(-3px)`), geste léger.
- **Recommandation :** plancher de 16 px pour tout texte informatif, et enrober les transitions dans `@media (prefers-reduced-motion: no-preference)`.

#### A11Y-19 — Intitulés de liens ambigus
- **Critère :** 2.4.4 (A), 2.4.9 (AAA)
- **Constat :** 3 liens « ici » dans `autre-cosmos/debats.html` (vers `riazuelo-uzan-1.html`, `riazuelo-uzan-2.html`, qui sont par ailleurs introuvables, voir l'audit du contenu) ; des liens dont le texte est « 1. », « 2. » dans la liste des publications.
- **Recommandation :** intitulés autonomes (« réponse de Riazuelo et Uzan »).

---

## 4. Points conformes (à conserver dans la refonte)

| Critère | Constat |
|---|---|
| 3.1.1 Langue de la page (A) | `lang="fr"` sur 589/590 pages |
| 1.4.10 Reflow (AA) | Aucun défilement horizontal à 320 px (13 pages testées), contenu empilé |
| 1.4.12 Espacement du texte (AA) | Interligne 1,5, lettres 0,12 em, mots 0,16 em : aucune coupe ni chevauchement |
| 1.4.4 Redimensionnement (AA) | Unités relatives, corps 18-19 px |
| 1.3.4 Orientation (AA) | Pas de verrouillage |
| 2.4.7 Focus visible (AA) | Aucun `outline: none` dans les 17 feuilles de style ; anneau natif (`outline: auto`) conservé ; champ de recherche : contour 2 px `#8a7a5c` (3,62:1) |
| 2.4.5 Accès multiples (AA) | Menu, recherche, listes par auteur, pied de page répétant le menu |
| 3.2.3 / 3.2.4 Navigation et identification cohérentes (AA) | Même menu à la même place sur 590 pages |
| 3.2.6 Aide cohérente (A, 2.2) | Lien Contact présent dans le menu, même emplacement partout |
| 1.4.3 Contraste du texte courant | `#2B2721` sur `#F4EEE0` : 12,83:1 ; lien `#1449c4` : 6,53:1 ; gris `#6B6355` : 5,13:1 |
| 1.1.1 Image de la loupe | `aria-label="Rechercher"` + SVG `aria-hidden` |
| 1.3.1 Landmarks | `header`, `nav`, `main`, `footer` sur 589/590 pages |
| Médias | Aucun iframe ni vidéo intégrée (liens YouTube / Dailymotion sortants), donc 1.2.x non applicable |

**Non applicables** : 2.5.7 Mouvements de pointage (aucun glisser-déposer), 3.3.7 Saisie redondante et 3.3.8 Authentification accessible (aucun formulaire de saisie ni compte, hors la recherche), 1.4.2 Contrôle du son, 2.2.x limites de temps.

---

## 5. Tableau des contrastes (palette actuelle et refonte)

| Élément | Avant-plan | Arrière-plan | Ratio | Seuil | Résultat |
|---|---|---|---|---|---|
| Texte courant | `#2B2721` | `#F4EEE0` | 12,83:1 | 4,5:1 | ✅ |
| Texte sur cadre crème | `#2B2721` | `#FFF8D9` | 13,91:1 | 4,5:1 | ✅ |
| Chapeau d'accueil | `#4A4437` | `#F4EEE0` | 8,35:1 | 4,5:1 | ✅ |
| Gris des légendes (14 px) et du pied | `#6B6355` | `#F4EEE0` | 5,13:1 | 4,5:1 | ✅ |
| Gris sur crème | `#6B6355` | `#FFF8D9` | 5,56:1 | 4,5:1 | ✅ |
| Lien | `#1449c4` | `#F4EEE0` | 6,53:1 | 4,5:1 | ✅ |
| Lien sur crème | `#1449c4` | `#FFF8D9` | 7,08:1 | 4,5:1 | ✅ |
| **Lien vs texte voisin** | `#1449c4` | `#2B2721` | 1,96:1 | 3:1 (1.4.1) | ❌ A11Y-04 |
| **« Pour acheter ce livre », citations** | `#E03B27` | `#F4EEE0` | 3,76:1 | 4,5:1 | ❌ A11Y-05 |
| **Idem sur crème** | `#E03B27` | `#FFF8D9` | 4,08:1 | 4,5:1 | ❌ A11Y-05 |
| Lettre alphabet vide | `#A8A093` | `#F4EEE0` | 2,24:1 | 4,5:1 | ❌ A11Y-14 (inactif) |
| Contour du champ de recherche (focus) | `#8a7a5c` | `#F4EEE0` | 3,62:1 | 3:1 (1.4.11) | ✅ |
| Traits de séparation | `#E0D6C2` | `#F4EEE0` | 1,25:1 | décoratif | n/a |
| Bord des vignettes | `#EDE6D6` | `#F4EEE0` | 1,07:1 | décoratif (ombre portée) | n/a |
| Rouge `#b3121d` (autres usages) | `#b3121d` | `#F4EEE0` | 6,01:1 | 4,5:1 | ✅ |
| **Refonte : orange en texte** (nav active, lettrines) | `#FF922B` | `#FAF8F4` | 2,11:1 | 4,5:1 | ❌ |
| **Refonte : texte clair sur bouton orange** | `#F7F3EE` | `#FF922B` | 2,02:1 | 4,5:1 | ❌ |
| Correction possible : texte sombre sur bouton orange | `#2E2E2E` | `#FF922B` | 6,08:1 | 4,5:1 | ✅ |
| Correction possible : orange foncé en texte | `#A84F00` | `#FAF8F4` | 5,23:1 | 4,5:1 | ✅ |

---

## 6. Tableaux de contrôle

### Navigation au clavier (site d'origine)

| Élément | Ordre de Tab | Entrée / Espace | Échap | Flèches | Constat |
|---|---|---|---|---|---|
| Menu principal (7 liens) | 1er à 7e arrêts, avant le contenu | Active le lien | n/a | n/a | Pas de lien d'évitement ; page courante signalée par la seule classe `.ici` (pas d'`aria-current`) |
| Loupe de recherche | 7e arrêt | Ouvre `recherche.html?de=page` | n/a | n/a | Nom accessible OK (`aria-label`) |
| Cartes de livres (accueil, listes) | Ordre du DOM | Active | n/a | n/a | Un lien par couverture, nom = slug (A11Y-03) |
| Légende + image (auteurs, articles) | 2 arrêts par carte pour la même cible | Active | n/a | n/a | Doublon de liens |
| Index alphabétique (A à Z) | Une lettre = un arrêt | Active | n/a | n/a | Lettres vides non focalisables |
| Champ de recherche | Focus automatique à l'arrivée sans requête | Valide | Vide le champ du navigateur (type=search) | n/a | Contour visible 2 px ; pas de piège |
| Résultats de recherche | Dans l'ordre des `h2` (Livres, Articles, Comptes rendus) | Active | n/a | n/a | OK, mais non annoncés (A11Y-07) |
| En-tête collant (≥ 761 px) | n/a | n/a | n/a | n/a | Masque 27 % des éléments focalisés (A11Y-06) |
| Liste des publications | 787 arrêts | n/a | n/a | n/a | Aucun raccourci (A11Y-08) |
| Piège clavier | Aucun détecté | | | | ✅ |

### Lecteur d'écran (déduit du balisage, à valider avec NVDA/VoiceOver)

| Élément | Annoncé comme | Problème |
|---|---|---|
| Titre de page (compte rendu) | « Compte rendu de Étienne Gilson… » (titre de document) puis « L'univers livresque de Thomas Lepeltier, titre de niveau 1 » | Le nom du livre n'est dans aucun titre (A11Y-02) |
| Affiche de conférence | « lien, 2024-ralentir-nantes.jpg » | Contenu absent (A11Y-01) |
| Couverture de livre dans une liste | « lien, aboudrar-voile-musulman », puis légende en second lien | Slug illisible et doublon (A11Y-03) |
| Lien dans un paragraphe | « lien, [texte] » | Rien ne le distingue visuellement d'un texte sans soulignement (A11Y-04) |
| Pastille ↗ | (non lue) | Sortie du site non signalée (A11Y-16) |
| Loupe | « lien, Rechercher » | ✅ |
| Compteur de résultats | (silencieux) | A11Y-07 |
| Cartes | Liens successifs sans « liste de N éléments » | A11Y-15 |

### Critères nouveaux de WCAG 2.2

| Critère | Niveau | Résultat site d'origine | Résultat refonte (build du jour) |
|---|---|---|---|
| 2.4.11 Focus non masqué (minimum) | AA | ❌ en-tête collant sans `scroll-padding` | À tester (même procédure Tab ×150) |
| 2.4.12 Focus non masqué (amélioré) | AAA | non évalué | non évalué |
| 2.4.13 Apparence du focus | AAA | Anneau natif, non garanti | À spécifier dans les design tokens |
| 2.5.7 Mouvements de pointage | AA | n/a | À vérifier : galerie `<dialog>` des interventions |
| 2.5.8 Taille de la cible | AA | ⚠️ passe par l'exception d'espacement | À vérifier : boutons de tags `style="width:20vw"` |
| 3.2.6 Aide cohérente | A | ✅ | ✅ (Contact dans le menu) |
| 3.3.7 Saisie redondante | A | n/a | n/a |
| 3.3.8 Authentification accessible | AA | n/a | n/a |
| 3.3.9 Authentification accessible (améliorée) | AAA | n/a | n/a |

---

## 7. État de la refonte `eleventy-excellent` (pa11y sur `dist/`)

**Déjà garanti par le thème :** `lang="fr"`, un lien d'évitement (« Passer au contenu »), un `h1` par page avec un titre propre à la page (testé sur accueil, livres, chroniques), un `<title>` distinct par page, une règle `prefers-reduced-motion` dans les feuilles compilées, 0 image sans `alt`, 0 `alt` vide non justifié (974 images). Le menu a un état `aria-current="page"` et un bouton de sous-menu avec `aria-expanded`.

**Régressions à corriger avant mise en ligne :**

| ID | Critère | Constat sur `dist/` | Sévérité | Recommandation |
|---|---|---|---|---|
| R-01 | 1.4.3 (AA) | **389 erreurs de contraste** réparties sur 13 pages testées. Cause racine : l'orange `#FF922B` (token) servant à la fois de **texte** (lien de navigation actif, lettrines, `h1` des chroniques) et de **fond de bouton avec texte clair** (2,02:1). Sur `/articles/`, 149 erreurs viennent des légendes. Sur `/livres/`, 33 erreurs à 320 px viennent des boutons de tags. Le `h1` en dégradé de l'accueil ne peut pas être mesuré. | 🔴 Critique | Texte sombre `#2E2E2E` sur fond orange (6,08:1) ; orange foncé `#A84F00` (5,23:1) quand l'orange sert de couleur de texte ; interdire un `h1` en texte dégradé sans couleur de repli validée ; valider chaque paire de tokens avec le script de contraste |
| R-02 | 4.1.2 (A) | `aria-labelledby="mainnav-3"` sur le bouton du sous-menu fait référence à un `id` inexistant (seul `mainnav-3-sub` existe), sur 13 pages | 🟠 Majeur | Ajouter l'`id` manquant sur le lien parent, ou utiliser `aria-label` |
| R-03 | 4.1.2 (A) | `/interventions/` : `<div role="list">` contenant des `<dialog>` et non des `listitem` (`aria-required-children`) | 🟠 Majeur | Mettre des `role="listitem"` directs, ou `<ul>/<li>` natifs ; revoir le focus piégé des dialogues |
| R-04 | 2.4.4 (A) | Page 404 : lien avec seulement un `<div class="loader">` (aucun texte) | 🟠 Majeur | Ajouter un nom accessible, ou retirer le lien |
| R-05 | 4.1.2 (A) | `/bio/` : `aria-label` sur un `div` sans rôle (« contrôle des sections ») | 🟡 Mineur | Ajouter `role="group"` ou retirer |
| R-06 | 2.5.8 (AA) | Boutons de tags de `/livres/` avec `style="width: 20vw"` : largeur proportionnelle à l'écran | 🟡 Mineur | Hauteur minimale 44 px, largeur au contenu |
| R-07 | 1.1.1 (A) | 38 `alt` de la refonte ressemblent encore à des slugs | 🟡 Mineur | Voir règle d'éditorial §9 |

---

## 8. Comment la nouvelle version doit garantir la conformité

### 8.1. Design tokens validés
- Toute paire texte/fond du fichier `src/_data/designTokens/colors.json` doit être calculée en CI : ≥ 4,5:1 (texte < 24 px ou < 18,5 px gras), ≥ 3:1 (grand texte et composants d'interface).
- Interdits dans les tokens : orange `#FF922B` en texte, texte clair sur orange, rouge `#E03B27` en texte courant, gris `#A8A093` en texte informatif.
- Tokens recommandés à partir de la palette actuelle :

| Rôle | Valeur | Contraste sur fond papier / crème |
|---|---|---|
| Texte | `#2B2721` | 12,8 à 13,9:1 |
| Texte secondaire | `#5a5344` | 6,6 / 7,1:1 |
| Lien | `#1449c4` **toujours souligné dans le texte** | 6,5 / 7,1:1 |
| Alerte ou mise en avant en rouge | `#B3261E` | 6,1:1 sur crème |
| Accent orange en texte | `#A84F00` | 5,2:1 |
| Bouton orange | fond `#FF922B`, texte `#2E2E2E` | 6,1:1 |

- Cible tactile minimale : `--target-min: 2.75rem` (44 px) pour boutons, liens de menu et de pied.
- Focus : un token `--focus-ring` (2 px, offset 2 px, contraste ≥ 3:1 sur toutes les surfaces, double anneau clair/sombre), appliqué en `:focus-visible`, qui vise aussi 2.4.13.

### 8.2. Composants accessibles
- **Layout :** `<a class="skip-link">`, `header`/`nav`/`main`/`footer`, `scroll-padding-top` égal à la hauteur de l'en-tête collant (ou en-tête non collant).
- **Carte de contenu** (livre, article, compte rendu, conférence) : un composant unique avec `<li>` dans `<ul role="list">`, un seul lien (le titre, avec `::after` couvrant la carte), l'image en `alt=""` si le titre est en texte, un titre de niveau cohérent, `<time datetime>` pour les dates, mention « (site externe) » ou « (PDF, N p.) » dans le nom accessible.
- **Menu et sous-menus :** `aria-current="page"` (déjà présent), identifiants cohérents (R-02), fermeture à Échap, ordre du focus logique.
- **Recherche :** `<label>`, `role="search"`, région `role="status" aria-live="polite"` pour le compteur, `h1` propre, fonctionnement sans JS (renvoi vers les listes).
- **Dialogues et galerie :** `<dialog>` natif avec `aria-labelledby`, focus rendu à l'élément déclencheur à la fermeture, Échap.
- **Pas de titre en texte dégradé** (impossible à mesurer, risque de contraste).

### 8.3. Tests automatisés (déjà amorcés dans `package.json`)
- `npm run test:a11y` (build `ELEVENTY_ENV=test`, serveur, `pa11y-ci --config dist/pa11y.json`) existe : l'étendre à **toutes les gabarits** (accueil, liste livres, fiche livre, liste chroniques, chronique, liste articles, article, interventions, bio, contact, recherche, 404, légal), en activant le runner **axe** en plus de HTML_CodeSniffer, à **1280 px et 320 px**.
- Faire échouer le build si un `alt` ressemble à un nom de fichier (`^[a-z0-9\-_.]+$`), si une page n'a pas de `h1` unique, ou si un lien a un nom vide.
- Exécuter ce job dans la CI GitHub à chaque pull request.

### 8.4. Recette manuelle avant chaque livraison
1. **Clavier seul :** Tab complet sur 5 gabarits ; vérifier focus visible, ordre, absence de piège, focus jamais sous l'en-tête collant (Tab ×150 puis Maj+Tab).
2. **NVDA + Firefox et VoiceOver + Safari :** parcours accueil → livres → fiche livre → chronique → recherche → contact ; liste des titres (touche H), liste des liens, liste des régions.
3. **Zoom 200 % puis 400 %** (équivalent 320 px) : aucun défilement horizontal, aucun texte coupé ; test d'espacement du texte (bookmarklet).
4. **Contraste :** vérifier les états `hover`, `focus`, `active`, désactivé et les dégradés.
5. **Mouvement réduit :** activer « réduire les animations » et contrôler les transitions.
6. **Contenu éditorial :** relire les `alt`, les intitulés de liens, les titres.

### 8.5. Déclaration d'accessibilité
Le site d'un auteur indépendant n'entre vraisemblablement pas dans le champ de l'obligation légale RGAA (secteur public, grandes entreprises) ; à confirmer avec le client. Une page « Accessibilité » **volontaire** reste recommandée : niveau visé (WCAG 2.2 AA, équivalent RGAA 4.1), date du dernier audit, limites connues (par exemple PDF historiques), moyen de signaler un problème (adresse de contact), et lien dans le pied de page. Elle remplace les mentions floues par un engagement vérifiable.

---

## 9. Règles d'éditorial pour les images et les liens

| Cas | Règle |
|---|---|
| Couverture dans un lien, sans texte voisin | `alt="Couverture de « Titre », Auteur"` |
| Couverture à côté d'une référence en texte | `alt=""` et un seul lien |
| Affiche de conférence (image contenant du texte) | **Ne jamais être la seule source** : titre, date, lieu, organisateur en texte ; `alt` = recopie de ce texte si l'affiche est publiée en grand |
| Première page d'article scannée | Vignette `alt=""` ; l'article est lien texte ; pas de lien direct vers l'image ; republier en HTML |
| PDF | Balisé, titré, langue du document renseignée ; lien « Titre (PDF, N pages) » |
| Lien externe | Mention textuelle « (site externe) » dans le nom accessible |
| Intitulé de lien | Jamais « ici » ni « 1. » : intitulé autonome |
| Citation en couleur | Ne pas utiliser la couleur seule : guillemets et `<q>` ou `<blockquote>` |
| Titre de page | `h1` unique = sujet de la page ; `<title>` = « sujet — Thomas Lepeltier » |

---

## 10. Priorités (impact × effort) pour l'accessibilité

| Rang | Action | Constats | Impact | Effort |
|---|---|---|---|---|
| 1 | Corriger les contrastes de la refonte (orange en texte, boutons orange) et valider les tokens en CI | R-01 | Très fort | Faible (tokens + 1 script) |
| 2 | Titre `h1` = sujet de la page ; nom du site hors `h1` ; titre explicite sur les comptes rendus | A11Y-02 | Très fort | Faible (gabarits) |
| 3 | Données structurées pour les conférences, carte textuelle | A11Y-01 | Très fort | Moyen (saisie de 51 entrées) |
| 4 | Générer les `alt` des couvertures depuis les métadonnées, un seul lien par carte | A11Y-03, A11Y-15 | Fort | Moyen (modèle de données) |
| 5 | Souligner les liens du texte, rouge conforme | A11Y-04, A11Y-05 | Fort | Faible (CSS) |
| 6 | Corrections ARIA de la refonte (labelledby, role=list, 404) | R-02 à R-05 | Moyen | Faible |
| 7 | `scroll-padding-top` et focus non masqué | A11Y-06 | Moyen | Faible |
| 8 | Messages d'état de la recherche (`role=status`), `h1` de recherche | A11Y-07 | Moyen | Faible |
| 9 | Republier en HTML les textes servis en image ou PDF non balisé | A11Y-09 | Moyen | Fort (contenu, 10 PDF + 46 scans) |
| 10 | Lien d'évitement (déjà présent dans la refonte), cibles ≥ 44 px, `prefers-reduced-motion`, liste sémantique | A11Y-11, 12, 15, 18 | Faible | Faible |
| 11 | Liens sans nom, « ici », balises obsolètes, pages hors gabarit | A11Y-08, 10, 17, 19 | Faible | Faible (ne se posent plus si la migration reprend le contenu) |
| 12 | Page « Accessibilité » volontaire, recette manuelle NVDA/VoiceOver | §8.4 et §8.5 | Moyen | Faible |

---

*Fichiers de travail : scripts dans `/tmp/audit_scripts` (`run_pa11y.mjs`, `measure.mjs`, `focus_test.mjs`, `search_test.mjs`, `a11y_static.py`), résultats bruts dans `/tmp/audit_out` (`pa11y_live.json`, `pa11y_refonte.json`, `measure_live.json`, captures dans `shots/`).*
