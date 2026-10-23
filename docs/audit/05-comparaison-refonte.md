# 05 — Comparaison du site d'origine et de la refonte (eleventy-excellent)

**Date de l'audit :** 23 octobre 2026
**Périmètre :** le site vivant `https://www.thomaslepeltier.fr` (miroir de 590 pages HTML, 1 463 images) face au projet `eleventy-excellent` (`src/`, build de production reconstruit).
**Sévérités :** critique (bloque la mise en ligne ou perd du contenu), majeur (dégrade nettement l'usage, le référencement ou la fidélité), mineur (finition).

## 0. Méthode et réserves

- Le `dist/` versionné dans le dépôt est un instantané de développement, pas un build de production. Il contient des URL d'images `/.11ty/image/?src=…` (718 liens inutilisables hors du serveur de dev), pas de `/pagefind/`, et le sitemap pointe vers `http://localhost:8080`. Je l'ai donc reconstruit hors dépôt (`URL=https://thomaslepeltier.fr ELEVENTY_ENV=production npx eleventy`, puis `pagefind`). Tous les chiffres « refonte » ci-dessous viennent de ce build (752 pages HTML).
- Je n'ai modifié ni `src/` ni aucune autre partie du dépôt. Les scripts sont dans `/tmp/audit_scripts`. Les captures sont dans `docs/audit/img/` (préfixe `refonte-`), plus `orig-accueil-1440.png` pour comparer.
- Dans les captures headless, quelques couvertures sous le pli ne sont pas chargées à cause du `loading="lazy"`. Je n'en tire aucun constat. Les fichiers existent tous dans le build.
- Le site vivant a déjà reçu une première modernisation en septembre 2026 : police Charter/Georgia, fond papier `#F4EEE0`, cadres crème `#FFF8D9`, accueil en grilles de couvertures. Le scraping de la refonte date de juin 2026. Une partie des écarts de contenu vient donc d'un retard de synchronisation.

## 1. Couverture de contenu, type par type

| Type | Site d'origine | Refonte | Écart |
|---|---|---|---|
| Fiches livres | 14 fiches + 11 sous-pages (tables des matières, `contents`, `tdm`) | 14 fiches `src/livres/*.md` ; **0** table des matières publiée | TDM perdues |
| Contributions (livres collectifs) | 18 couvertures dans `livres.html` | 18 entrées dans `_data/contributions.js` | Repris |
| Comptes rendus / chroniques | 528 pages `cr/*.html` + 25 index d'auteurs `auteurs/a_*.html` | 542 `.md` → 542 pages `/chroniques/…` + 11 pages de pagination | 527/528 retrouvés ; voir CMP-02 à CMP-06 |
| Articles & entretiens | 162 vignettes dans `articles.html` (7 rubriques) | 145 `.md` | 142 retrouvés ; 20 absents (tous récents) ; 2 « sans titre » |
| Interventions publiques | 51 visuels dans `conferences.html` | 51 images dans `assets/images/conferences/`, **20 affichées** | 31 non publiées |
| Annexes | `annexes/` (créationnisme ×3, `abst_sci`, `d_espagnat`, `revue-de-livres-commentaires`), `autre-cosmos/debats`, `annexes/tout-partie` | Fichiers HTML bruts dans `src/pages/annexes/`, **absents du `dist/`** | Perdues à la publication |
| Liste des publications | `liste-des-publications.html` (17 367 mots, 787 liens) | Aucune page | Perdue |
| Qui suis-je / Bio | 1 page (182 mots) | `/bio/` : texte réécrit, 12 critiques de référence en accordéon, APALA ajouté | Repris et enrichi |
| Contact | 1 page (e-mail) | `/contact/` : même e-mail, texte d'accueil ajouté | Repris |
| Recherche | Moteur maison (`recherche-moteur.js`) qui lit les pages | Pagefind (712 pages indexées) | Repris, voir CMP-25 |
| Mentions légales / confidentialité | Aucune | `/legal/`, `/confidentialite/` | Nouveau, mais gabarit non rempli (CMP-12) |

Méthode de rapprochement : couverture ou texte pour les chroniques, couverture ou URL pour les articles. J'ai comparé les 527 chroniques appariées (longueur de texte normalisée, auteur, année, titre) et les 142 articles appariés (rubrique, titre, lien, image).

## 2. Tableau des écarts « ancien → nouveau »

Statuts : repris, partiel, absent, nouveau, régression.

### 2.1 Contenu

| ID | Statut | Sév. | Constat factuel | Recommandation |
|---|---|---|---|---|
| CMP-01 | Régression | **Critique** | **14 chroniques qui sont des liens sortants chez l'original** (par exemple Ritchie *Clearing the Air* → Le Point, *If Anyone Builds It*, *Reducetarian Solution*, *Not the End of the World*, *Social Justice Fallacies*) deviennent des pages au **corps vide**. Le lien vers la critique externe n'est pas conservé : `amazonLink: ""`, pas de champ `externalLink`. Le bouton « Lien amazon » pointe vers `href` vide. | Ajouter `externalLink` au gabarit `chronique.njk` et rediriger ou afficher le lien. Récupérer les URL dans `auteurs/a_*.html` de l'original. Sinon ne pas générer ces pages. |
| CMP-02 | Régression | **Critique** | **4 chroniques ont perdu leur texte** alors que l'original en a (1 569 à 3 769 caractères) : Arnaud-Lindet *Histoire et politique à Rome*, Cochrane *Animal Rights Without Liberation*, Ruphy *Pluralismes scientifiques*, Yates *Science et tradition hermétique*. Deux autres sont vides (Dumouchel-Damiano, Taft), mais l'original n'y a qu'un court texte provisoire de 73 et 114 caractères. | Réimporter ces 6 textes depuis `cr/*.html`. Ajouter au scraping un contrôle « corps vide ». |
| CMP-03 | Régression | Majeur | 17 chroniques ont un texte plus court de 10 à 22 % que l'original (par exemple Ferret *L'identité* : 1 482 contre 1 912 caractères ; Benatar-Wasserman ; Baratay ; Pourprix). La cause probable est la perte du paragraphe de fin ou de la signature. | Faire un diff automatique texte à texte sur les 527 pages. Corriger le script de conversion. |
| CMP-04 | Régression | Majeur | **Dates inventées ou factices** : 8 chroniques, 2 articles et 7 livres sur 14 ont `date: 1234-01-01`, affichée « 1 janvier 1234 » sur `/livres/`. Le sitemap contient `<lastmod>1234-01-01…`. Pour les chroniques, `date` est l'année de publication du livre (« Paru en 2015 »), pas la date de la chronique. 14 chroniques ont une année qui diffère de l'original (par exemple Lowith 2002 contre 1949). | Distinguer `anneeLivre` et `dateChronique`. Ne jamais afficher une date inconnue. Supprimer `lastmod` quand la date manque. Corriger les 14 années. |
| CMP-05 | Régression | Majeur | **Auteurs corrompus** : 4 chroniques sans auteur ou « inconnu » (Adams, Cogneau, Gee, Winegard), `HannahRitchie` (prénom et nom collés), valeurs `(dir.)` / `(ed)` / `direction)` utilisées comme nom (Jarrige-Tordjman, Michon), 2 à 3 associations couverture/texte douteuses (Villalba-Oury). | Corriger à la main (≈10 fiches). Ajouter un test sur le format `Prénom Nom`. |
| CMP-06 | Régression | Mineur | Un caractère mathématique est devenu « Ã » dans `cantor.md` (« N Ã Q Ã R »). 5 chroniques gardent un marqueur provisoire (`(à paraître)`, `[à venir]`, `[Texte disponible ici]`). 1 chronique de l'original n'existe pas (Gollier, *L'économie de l'inaction climatique*). | Rétablir le symbole. Masquer ou marquer « à paraître » proprement. Ajouter Gollier. |
| CMP-07 | Régression | **Majeur** | **Articles : les titres sont perdus.** La vignette affiche « Le Point – mai 2026 » au lieu du titre. 8 articles s'appellent « Titre inconnu » (`sans-titre*.md`). 8 n'ont ni `externalLink` ni `internalLink`. 5 ont une description vide. Le titre réel n'est que dans `description`. | Reprendre le titre de la légende de `articles.html`. Afficher sous la vignette « *Titre*, Journal, date ». |
| CMP-08 | Régression | Majeur | **Taxonomie dégradée.** Les rubriques de l'original sont Éthique animale 49, Histoire et philosophie des sciences 34, Environnement 24, Économie 22, Divers 21, Historiographie 8, Astrophysique 4. La refonte donne Divers 49, Éthique animale 47, HPS 36, Historiographie 8, Cosmologie 4, **Économie 1, Environnement 0**. | Reconstituer les rubriques d'origine. Conserver « Astrophysique » ou migrer les 4 articles de façon assumée vers « Cosmologie ». |
| CMP-09 | Absent | **Majeur** | **Contenu récent absent** : 20 articles de juin à octobre 2026 (Causeur, Le Point, Atlantico, Sciences Humaines 392, *L'Amorce*, *European Scientist*). Les 4 vignettes d'articles de l'accueil actuel sont donc inconnues de la refonte. | Rescraper avant livraison. Prévoir un processus de mise à jour (voir CMP-24). |
| CMP-10 | Partiel | **Majeur** | **Interventions : 20 images sur 51.** `interventions.njk` liste 20 entrées en dur (2004 à 2017). Les 31 images de 2018 à 2026 (dont les 5 plus récentes mises en avant sur l'accueil actuel : IA et APALA 2026, *À la recherche de l'univers* 2025, etc.) existent dans `assets/images/conferences/` mais ne sont pas affichées. `_data/conferences.js` (lecture du dossier) n'est pas utilisé. | Utiliser la collection `conferences` issue du dossier, triée par année décroissante, avec légendes. Ajouter un **appel à l'action** (« Je suis disponible pour des conférences »). |
| CMP-11 | Absent | **Majeur** | **Annexes et liste des publications non publiées.** Les 3 textes du créationnisme (≈7 000 mots), `abst_sci`, la lettre de d'Espagnat, `revue-de-livres-commentaires`, `autre-cosmos/debats` et la liste complète des publications (17 000 mots, 787 liens) sont absents du site publié. Les 9 fichiers de `src/pages/annexes/` sont du HTML brut de l'ancien site (Times New Roman 16 px, tables) et ne sont pas rendus. Les liens internes de l'original vers ces pages (`tout_parties.html`, etc.) étaient déjà cassés dans l'original. | Convertir en Markdown dans un layout `annexe`. Créer `/publications/`. Rediriger les anciennes URL (voir CMP-20). |
| CMP-12 | Nouveau | **Majeur** | **Pages légales non finalisées** : `/legal/` affiche « Edit your details in _data/personal.yaml / Your street / 12345, city ». La mention « Je respecte le RGPD… » est un gabarit anglais traduit. Aucune mention d'éditeur, d'hébergeur, de directeur de publication ni du fait que les liens Amazon sont affiliés. | Compléter `personal.yaml`. Rédiger des mentions réelles (LCEN). Indiquer l'affiliation Amazon (`tag=httpthomaslep-21`). |
| CMP-13 | Partiel | Majeur | **Livres : critiques sur 4 fiches sur 14** (le brief en voulait la moitié). Les champs `liens_achat`, `nombre_de_pages`, `edition_nom`, `prix` sont vides sur la fiche d'essai (Viande de culture). Les tables des matières ne sont pas liées (`lien_table_des_matieres` ignoré). Les « ouvrages dirigés » n'ont pas de liste d'auteurs. | Compléter 3 à 4 fiches par semaine avec Thomas. Publier les TDM. Ajouter un champ `coauteurs`. |
| CMP-14 | Nouveau | Mineur | La bio mélange la 3ᵉ et la 1ʳᵉ personne (« Thomas Lepeltier développe… » puis « je suis Associate Fellow »). Les affirmations flatteuses (« Salué par la presse… ») n'ont pas de source. Les descriptions SEO de `/bio/` et `/contact/` sont celles du starter (« Eleventy Excellent is inspired by… »). | Réécrire en 1ʳᵉ personne, sourcer. Remplacer les `description`. |

### 2.2 Identité et design

| ID | Statut | Sév. | Constat factuel | Recommandation |
|---|---|---|---|---|
| CMP-15 | Régression | **Majeur** | **L'identité de l'original n'est pas reprise.** Original : papier chaud `#F4EEE0`, barre et pied crème `#FFF8D9`, titres et corps en serif (Charter/Georgia 19 px), accueil en grilles de couvertures, sobriété. Refonte : fond gris perle texturé, **corps de texte en sans-serif** (Arial/Helvetica), titres serif lourds, **dégradé jaune-orange-bleu** sur chaque H1 (« Liste des livres publiés », « Barre de recherche »…), boutons noirs, soulignement orange du menu. Cela ne correspond ni à l'original ni au brief « brutalisme élégant, palette chaude sophistiquée ». | Reprendre les jetons de l'original (`--papier`, `--creme`, `--encre`, `--lien #1449c4`, Charter). Supprimer `gradient-text`. Garder l'orange en accent unique. |
| CMP-16 | Régression | **Majeur** | **L'accueil contredit le brief.** Hero pleine hauteur (`100svh`) avec photo de conférence assombrie et H1 de 4 lignes, 5 boutons. Le brief demande : « Pas d'image hero pleine page », productions en premier, conférences mises en avant, mini-bio, filigrane. L'accueil de l'original montre déjà livres, comptes rendus, articles et interventions en 4 grilles. Sur mobile, le texte occupe le milieu d'un écran noir. Le contraste du H1 sur la photo échoue en WCAG (pa11y G145). L'image a deux attributs `alt` (un renseigné, un vide) et `aria-hidden`. | Reprendre la structure de l'accueil actuel (4 sections de dernières productions), ajouter mini-bio et bandeau « Conférences : disponible ». Si une photo est voulue, la mettre en filigrane (opacité faible, fixe). |
| CMP-17 | Régression | Mineur | Aucun **filigrane** ni **icône livre** au-delà du petit pictogramme du logo (brief). Les animations sont minimes (parallaxe sur l'accueil). | Implémenter le filigrane en CSS (`background-attachment: fixed`, 6 à 8 % d'opacité), vérifier `prefers-reduced-motion`. |
| CMP-18 | Régression | Mineur | Le pied de page affiche **« Thomas Lepeltier 4.6.1 »** (version du starter), « Style guide » (lien mort), « Made with ♥ and Eleventy by Guillaume RENOULT ». Le sélecteur CSS d'indicateur de lien externe contient `localhost:8080` en dur. | Retirer version et lien Style guide. Garder le crédit si souhaité. Calculer le sélecteur depuis `meta.url`. |
| CMP-19 | Régression | Mineur | Les étiquettes de livre sont des boutons noirs larges (« Éthique animale »), la liste de livres alterne grandes couvertures et cadres vides sous le pli, les dates affichent « 1 janvier 2010 » (jour et mois inventés). | Afficher l'année seule. Étiquettes discrètes. |

### 2.3 Fonctionnalités, SEO, URL

| ID | Statut | Sév. | Constat factuel | Recommandation |
|---|---|---|---|---|
| CMP-20 | Absent | **Critique** | **Aucune redirection.** `dist/_redirects` est vide (0 ligne) : aucune page n'a le champ `redirectFrom`. Toutes les URL de l'original changent : `/cr/gilson.html` → `/chroniques/<titre-slugifié>/`, `/livres.html` → `/livres/`, `/qui-suis-je.html` → `/bio/`, `/conferences.html` → `/interventions/`, `/articles.html` → `/articles/`, `/auteurs/a_x.html` et `/annexes/…` → rien. Le slug d'une chronique vient du titre, donc il ne se déduit pas du nom de fichier d'origine. Le domaine reste le même : tout le référencement acquis est perdu. | J'ai généré `docs/audit/redirections-chroniques.csv` (519 correspondances `ancienne → nouvelle`, 8 lignes « NON RÉSOLU » à traiter à la main). Ajouter les 14 fiches livres, les pages principales, les annexes et les 25 index d'auteurs (vers `/chroniques/` avec filtre, ou une page d'index alphabétique). Brancher le tout dans `redirectFrom` ou directement dans `vercel.json`. Voir aussi `04-navigation-url-seo.md`. |
| CMP-21 | Régression | **Critique** | **Domaine du sitemap, du flux et du `robots.txt` : `http://localhost:8080`** tant que la variable `URL` n'est pas fixée. Avec `URL` posée, le build est correct (`https://thomaslepeltier.fr/sitemap.xml`, 717 URL), mais ni `netlify.toml` ni `vercel.json` ne la définissent. | Documenter et fixer `URL=https://thomaslepeltier.fr` dans l'hébergeur. Ajouter un contrôle de build qui échoue si `localhost` apparaît dans `dist/`. |
| CMP-22 | Régression | Majeur | **Le `dist/` livré est cassé** : 718 liens `/.11ty/image/?src=…` (images invisibles hors serveur de dev), pas de `/pagefind/` (la recherche ne fonctionne pas). `npm run build` règle les deux, mais le dossier versionné trompe. | Retirer `dist/` du dépôt (`.gitignore`) et déployer par CI. |
| CMP-23 | Régression | Majeur | **Liens internes cassés dans le build de production** (13) : `/styleguide/` (pied de page, présent sur 748 pages), `/tags/contributions` (18 occurrences), `/livres/univers-paralleles`, `/thom.lepeltier@gmail.com` (lien `mailto:` sans schéma sur l'accueil), 8 liens de pages TDM déplacées sous `assets/images/livres-couvertures/revolution-antispeciste/tdm/`. L'original en avait 8 (dont 3 pages de chroniques et d'annexes). | Corriger les 5 premiers (retirer ou créer). Supprimer les TDM mal rangées et les republier correctement. Lancer un vérificateur de liens en CI. |
| CMP-24 | Partiel | Majeur | **Pages héritées du starter** encore publiées : `/built-with/` (22 mentions « Eleventy Excellent » / Lene), `/card/`, `/sustainability/`, `/test/` et `/pages/test/` (contenu de test), `/liens/` (« Sites à visiter »), `/tags/fetch`, `/tags/territoire`, `/tags/critiquesg`, `/tags/meslivres`, `/tags/livresdiriges`. `src/docs/` (22 fichiers) n'est pas publié mais reste dans le dépôt. 11 pages ont la description « All blog posts can be found here ». | Supprimer ces pages, tags et `src/docs/`. Fixer les `description`. Retirer `Sustainability` / `carbon.txt` sauf demande. |
| CMP-25 | Partiel | Majeur | **Recherche** : Pagefind couvre 712 pages, mais les articles n'ont pas de corps (seulement un titre « Le Point ») et les chroniques sont filtrées sur le texte. Libellé en anglais (« Search », placeholder « rechercher »). L'original cherchait par titre de livre, d'article et de chronique, ce que le brief reprend (« auto-complétion »). | Indexer titre réel, auteur, journal et année pour les articles (CMP-07). Traduire l'interface (`translations`). |
| CMP-26 | Partiel | Majeur | **Filtres et navigation** : tags présents (`/tags/…`), mais pas d'index alphabétique d'auteurs (l'original avait 25 pages A à Z) ni de filtre par auteur ou coauteur (brief). La pagination des chroniques existe (11 pages), mais `/articles/` n'est pas paginé : 145 vignettes sur une page (103 Ko). Menu : « Bio » remplace « Qui suis-je ? », « Conférences » devient « Interventions » sans lien dans le menu (accessible par l'accueil et le pied). | Ajouter l'index d'auteurs (page `/chroniques/auteurs/`) et un filtre par rubrique pour les articles. Exposer « Interventions » dans le menu. |
| CMP-27 | Nouveau | Mineur | **Flux RSS, OG images, JSON-LD, canonical** présents et corrects en build de production (flux 2,1 Mo, OG par page, `lang="fr"`, canonical). L'image OG par défaut est celle du template (582 Ko). Le `robots.txt` bloque une longue liste de robots d'IA (choix à valider avec Thomas). | Valider la politique robots. Alléger le flux (limiter à 50 entrées). |
| CMP-28 | Nouveau | Mineur | **Liens sociaux** : Instagram et LinkedIn seulement (le brief demande Twitter, Facebook, LinkedIn). **APALA** n'apparaît que dans la bio, sans lien vers le site de l'association. Le copyright (« © 2026 Thomas Lepeltier ») est présent. | Confirmer les réseaux voulus. Ajouter le lien APALA (bio, pied de page). |

### 2.4 Accessibilité et performance

| ID | Statut | Sév. | Constat factuel | Recommandation |
|---|---|---|---|---|
| CMP-29 | Partiel | Majeur | **Contrastes** (pa11y, WCAG2AA, 11 pages) : 12 erreurs. Lien de menu actif en orange (G18, ratio < 4,5:1) sur 5 pages, H1 clair sur photo (accueil) et sur bandeau (chroniques) (G145), lettrine orange (G145) sur les chroniques et fiches livres, une ancre vide `<a href="">` sur la fiche livre. Aucune autre erreur pa11y sur `/livres/`, `/interventions/`, `/recherche/`. Les 974 images ont toutes un `alt`. | Assombrir l'orange de texte (≥ 4,5:1) ou le réserver aux éléments décoratifs. Supprimer le bouton « Lien amazon » quand le lien est vide. Compléter pa11y par un test clavier et lecteur d'écran avant livraison. Voir `03-accessibilite.md`. |
| CMP-30 | Régression | Mineur | **Alternatives textuelles** : toutes les images ont un alt (progrès par rapport à l'original, où l'alt des couvertures de chroniques est un nom de fichier). Mais l'alt des livres est « Première page de mon livre … », ceux de l'accueil et des conférences sont des noms de fichier (« 2004 Fleurance conference », en anglais). | Écrire des alt français courts (« Couverture de … »). |
| CMP-31 | Régression | Majeur | **Poids** : `/chroniques/` pèse 35 Mo au total en pages (542 pages, ~65 Ko chacune) ; `feed.xml` 2,1 Mo ; `articles/index.html` 103 Ko ; 18 Mo d'images de couverture générées. | Réduire le HTML répété (CSS en ligne par page), paginer `/articles/`, limiter le flux. Garder WebP/AVIF et `srcset`. |

## 3. Ce que la refonte corrige vraiment

| Faiblesse de l'original | Statut dans la refonte |
|---|---|
| Un même H1 « L'univers livresque… » sur chaque page | Corrigé : un H1 par page, du titre de la page |
| Pas de `<title>` ni de description propres (même titre sur 2 pages `articles`) | Corrigé en grande partie, mais 17 titres identiques restent (« Sciences Humaines » ×38, « Le Point » ×10, « Titre inconnu » ×8) |
| Pas de canonical, d'Open Graph, de sitemap, de robots, de flux | Ajoutés (à condition de fixer `URL`, CMP-21) |
| Pas de pages légales, de confidentialité | Ajoutées, mais non remplies (CMP-12) |
| `alt` de couvertures = noms de fichier | Remplacé, mais encore imparfait (CMP-30) |
| Pas de pagination ni de tags | Pagination des chroniques, tags (partiels) |
| 8 liens internes cassés | 13 liens cassés (CMP-23) : **non corrigé, aggravé** |
| Recherche maison lente (lit les pages dans le navigateur) | Pagefind plus rapide, mais couverture à revoir (CMP-25) |

## 4. Écarts qui bloquent la mise en ligne

1. **CMP-20** : aucune redirection, perte du référencement. Sans elles, ne pas basculer le domaine.
2. **CMP-21 et CMP-22** : fixer `URL` en production, ne pas livrer le `dist/` actuel, vérifier que `pagefind` s'exécute.
3. **CMP-01 et CMP-02** : 14 chroniques sans lien sortant et 6 chroniques sans texte. Perte de contenu visible.
4. **CMP-07 à CMP-09** : titres d'articles perdus, rubriques écrasées, 20 articles récents absents.
5. **CMP-10 et CMP-11** : 31 interventions et toutes les annexes (dont la liste des publications) ne sont pas publiées.
6. **CMP-12** : pages légales avec le texte « Your street, 12345, city » à remplacer par les vraies mentions.
7. **CMP-04** : dates « 1 janvier 1234 » visibles sur le site.
8. **CMP-15 et CMP-16** : à arbitrer avec Thomas avant d'engager plus de développement : la DA actuelle ne reprend ni l'original ni le brief (hero pleine page, dégradés, sans-serif).
9. **CMP-23 et CMP-24** : liens morts (`/styleguide/`, `/tags/contributions`) et pages du starter (`/test/`, `/built-with/`, `/sustainability/`) à supprimer.

## 5. Ordre de travail proposé (impact / effort)

| Priorité | Actions | Effort |
|---|---|---|
| 1 | Redirections (CMP-20), variable `URL` et garde-fou `localhost` (CMP-21), retirer `dist/` du dépôt (CMP-22) | 0,5 j |
| 2 | Réparer les contenus : 14 liens sortants, 6 textes vides, dates, auteurs, titres d'articles (CMP-01 à 08) | 1 à 2 j |
| 3 | Rescraper les contenus de juin à octobre 2026, ajouter Gollier (CMP-09, CMP-06) | 0,5 j |
| 4 | Publier les 31 interventions, les annexes, les TDM, la liste des publications (CMP-10, 11, 13) | 1 à 2 j |
| 5 | Nettoyer le starter, les liens cassés, les pages légales (CMP-12, 23, 24) | 0,5 j |
| 6 | Reprendre la DA et l'accueil selon l'original et le brief (CMP-15, 16, 17, 18) | 2 à 3 j |
| 7 | Recherche, filtres, accessibilité, poids (CMP-25, 26, 29, 31) | 1 à 2 j |

## 6. Fichiers produits

- `docs/audit/05-comparaison-refonte.md` (ce rapport).
- `docs/audit/redirections-chroniques.csv` : 527 lignes, 519 correspondances et 8 « NON RÉSOLU » (`briquel`, `delacroix-dosse-garcia…`, `hoquet-buffon-linne-biologie`, `josse-militantisme…`, `maclure-taylor…`, `shapiro-life-as-we-made-it`, `smet-lost-ego…`, `tegmark-life-3-0…`).
- `docs/audit/img/refonte-*.png` et `orig-accueil-1440.png` : captures à 1440 px et 390 px.
