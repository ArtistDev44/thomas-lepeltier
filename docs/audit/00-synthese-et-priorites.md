# Audit du site thomaslepeltier.fr : synthèse et priorités

Audit réalisé le 23 octobre 2026 pour guider la refonte `eleventy-excellent`. Ce document résume les cinq chapitres détaillés et classe les actions par impact et effort.

## 1. Cadrage

| Point | Constat |
|---|---|
| Site de référence | `https://www.thomaslepeltier.fr` (Vercel). Le site a déjà reçu une première modernisation en septembre 2026 : police Charter/Georgia, fond « papier » `#F4EEE0`, cadres crème `#FFF8D9`, accueil en grilles de couvertures. |
| État d'origine | Le miroir de juin (`../thomas.lepeltier.free.fr`) montre l'état antérieur : Times New Roman 18 px, orange `#ffae15`, bandeaux argent, ombres noires. |
| Ancien domaine | `thomas.lepeltier.free.fr` redirige son accueil par meta-refresh. Toutes les autres pages répondent encore 200, comme l'ancien site (vérifié : `/livres.html`, `/cr/gilson.html`). |
| Méthode | Crawl complet du site vivant (590 pages réelles, 2 004 fichiers, 147 Mo). Analyse statique des 590 pages, contrôle de 1 083 liens externes, captures Chromium à 1440, 768 et 390 px, pa11y sur le site vivant et sur la refonte. Grilles des skills `accessibility-review` (étendue à WCAG 2.2), `ux-heuristics` et `web-design-guidelines`. |
| Limites | Pas de test avec un vrai lecteur d'écran. Pas de Lighthouse : LCP et CLS sont estimés. Les 528 comptes rendus n'ont pas été relus un par un. L'orthographe est contrôlée par script, sans grammaire ni homophones. Polices Charter et Georgia absentes de la machine d'audit : mesures typographiques indicatives. |

## 2. Chapitres et livrables

| Fichier | Contenu | Constats |
|---|---|---|
| `01-inventaire-contenu.md` | Pages, médias, liens cassés, fautes, contenus obsolètes, verdicts conserver/réécrire/supprimer | INV-01 à INV-29 |
| `02-composition-design.md` | Structure par type de page, typographie, couleurs, responsive, identité à préserver, jetons de design cibles | DES-01 à DES-22 |
| `03-accessibilite-wcag22.md` | WCAG 2.2 AA, contrastes, clavier, lecteur d'écran, état de la refonte, garanties à prévoir | A11Y-01 à A11Y-19 |
| `04-navigation-url-seo.md` | Menu, arborescence, recherche, parcours, URL, SEO, structure cible, plan de redirections | NAV-01 à NAV-27 |
| `05-comparaison-refonte.md` | Écarts entre le site vivant et `eleventy-excellent`, blocages de mise en ligne | CMP-01 à CMP-31 |
| `redirections-proposees.csv` | 590 pages plus 3 règles de motif, avec URL cible, code et remarque | n/a |
| `redirections-chroniques.csv` | 519 correspondances de chroniques entre l'ancien et le nouveau site (8 à traiter à la main) | n/a |
| `img/` | Captures du site vivant (`design-*`, `orig-*`) et de la refonte (`refonte-*`) | n/a |

## 3. Chiffres clés

- **Contenu à reprendre :** 14 fiches livres, 528 comptes rendus, 25 index d'auteurs, 51 conférences, 165 articles, 6 annexes et une liste de publications de 17 367 mots.
- **Liens :** 7 à 8 liens internes réellement cassés. Sur 1 083 liens externes : 909 répondent 200, 30 répondent 404, 24 échouent à la connexion, 6 domaines n'existent plus, et une centaine répondent 403 (blocage anti-robot, non vérifiables).
- **Images :** 1 463 images dans les pages. 87 % des textes alternatifs sont des noms de fichier. `articles.html` charge 64 Mo d'images, `conferences.html` 19 Mo. 24 fichiers `.webp` sont en réalité des JPEG ou des PNG renommés.
- **Structure :** le seul `h1` de 588 pages est le nom du site. Les 528 comptes rendus n'ont aucun titre propre en `h1`.
- **SEO :** pas de `sitemap.xml` ni de `robots.txt` (404), pas de canonical ni d'Open Graph, page 404 en texte brut.
- **Accessibilité :** 19 constats sur le site d'origine (2 critiques, 8 majeurs, 9 mineurs). Sur la refonte, pa11y relève 389 erreurs de contraste, presque toutes dues à l'orange `#FF922B`.
- **Score `ux-heuristics` :** 6/10. Aucune tâche n'est bloquée, mais la cohérence entre gabarits, la reconnaissance et la navigation échouent au niveau « majeur ».

## 4. Constats critiques (toutes thématiques)

| ID | Sujet | Pourquoi c'est critique | Recommandation |
|---|---|---|---|
| NAV-01, INV-01 | Doublon free.fr | Le site existe en double. Les anciennes pages free.fr répondent 200 et concurrencent le domaine officiel. | Poser des 301 page à page si free.fr le permet. Sinon, demander la suppression des contenus ou une redirection, et suivre l'indexation dans la Search Console. |
| NAV-02 | Pas de sitemap ni de robots, 404 brute | Indexation non pilotée, visiteur perdu sur une page d'erreur sans menu. | Générer `sitemap.xml` et `robots.txt`, créer une page 404 avec menu, recherche et lien d'accueil. |
| NAV-03, DES-03, A11Y-02 | Un seul `h1` : le nom du site | Titres de page absents pour les lecteurs d'écran et pour les moteurs. | Un `h1` par page, égal au sujet de la page. Le nom du site passe hors `h1`. |
| INV-03, A11Y-01 | Conférences et articles enfermés dans des images | Titre, date et lieu n'existent que dans l'image, sans équivalent texte. | Saisir les 51 conférences et les 165 articles en données structurées (titre, date, lieu, lien, résumé). |
| DES-01, NAV-18 | Pages-listes démesurées | `articles.html` pèse 64 Mo d'images et mesure 22 772 px de haut. | Pagination ou filtres, images redimensionnées en webp/avif avec dimensions explicites. |
| CMP-01, CMP-02 | Chroniques perdues dans la refonte | 14 chroniques sont des pages vides sans lien sortant, 4 ont perdu leur texte. | Relancer la migration depuis la source de l'original, puis comparer texte et liens un par un. |
| CMP-20, NAV-22 | Aucune redirection dans la refonte | `dist/_redirects` est vide et Vercel ne le lit pas : toutes les anciennes URL mènent à une 404. | Générer `vercel.json` depuis les CSV de redirections, puis tester en masse. |
| CMP-21, NAV-21 | Domaine du sitemap et des canonicals | Sans la variable `URL`, tout pointe vers `http://localhost:8080`. | Fixer `URL` en production et vérifier canonicals, sitemap, flux et robots dans `dist/`. |

## 5. Constats majeurs par thématique

- **Contenu.** Contenus disparus depuis juin (page Wilson, annexe « Le Tout et les parties », `epopee.jpg`). Textes provisoires publiés (« à venir », « xxx »). Liens externes morts ou détournés (`versusmagazine.co` est repris par un site tiers). Liens d'affiliation Amazon sans mention, dont une soixantaine malformés. Pages légales absentes, réseaux sociaux absents, contact réduit à une adresse en clair.
- **Design.** 36 % des vignettes sont déformées de plus de 5 % (`object-fit: fill`). Le CSS est recopié dans 588 pages, avec un second gabarit sur 2 pages. Liens non soulignés, distingués du texte à 1,96:1 seulement. Aucun état de focus, aucun lien d'évitement, aucun `prefers-reduced-motion`. Barre de navigation sur 3 lignes à 390 px. Polices non embarquées.
- **Accessibilité.** Focus masqué par l'en-tête collant (27 % des éléments focalisés). Rouge `#E03B27` trop pâle (3,76:1 sur le fond papier). Résultats de recherche non annoncés. 10 PDF non balisés. Liste des publications avec 787 liens dont certains sans nom accessible.
- **Navigation.** Conférences absentes du menu et sans appel à inviter Thomas. « Comptes rendus » mène à un index alphabétique par auteur, sans tri par date ni par thème. Libellés incohérents entre menu, titre et refonte. Recherche qui télécharge 27 pages (environ 805 Ko) à la première requête, avec 3 entrées codées en dur menant à une 404.
- **Refonte.** Identité de l'original non reprise : accueil en hero pleine hauteur contraire au brief, texte en sans-serif, pas de filigrane. Dates inventées (`1234-01-01` affichée « 1 janvier 1234 »), auteurs corrompus, titres d'articles perdus (« Titre inconnu »), 20 articles récents manquants. Seules 20 interventions sur 51 sont affichées. Pages légales avec « Your street 12345, city ». Pages du modèle encore publiées (`/built-with/`, `/card/`, `/styleguide/`, `/test/`). Le `dist/` versionné est un instantané de développement (images en `/.11ty/image/`, pas de `/pagefind/`).

## 6. Identité à préserver et éléments datés

| À préserver | À moderniser |
|---|---|
| Fond « papier » chaud et cadres crème | `h1` unique et titres de page sans hiérarchie |
| Typographie serif (Charter/Georgia) de ton littéraire | Polices non embarquées, texte justifié avec césure et retrait de 40 px |
| Accueil en grilles de couvertures, sobre | Vignettes étirées, cartes sans titre ni page de destination |
| Ton d'essayiste, absence d'effets | CSS recopié par page, deux gabarits |
| Index alphabétique des auteurs (usage réel des lecteurs) | Index limité à une dimension de tri, sans filtre par thème ni date |
| Recherche par titre, tolérante aux accents | Indexation côté client, liste de livres codée en dur |

## 7. Structure cible

Détail et redirections au chapitre 04. Elle s'aligne sur le brief (`../notes.md`) et sur la refonte :

```
Accueil          productions en premier, conférences, mini-bio
Productions      Livres (auteur, dirigés, contributions) · Articles · Comptes rendus
Conférences      historique daté + appel explicite à inviter Thomas (lien APALA)
Qui suis-je ?    bio étayée, affiliations
Contact          adresse, réseaux, disponibilité conférences
Recherche        champ visible, plein texte (Pagefind)
Pied de page     mentions légales, confidentialité, réseaux, copyright
```

## 8. Priorités classées par impact et effort

Impact et effort sont estimés pour la refonte. Les actions 1 à 8 bloquent la mise en ligne ou la préservation du référencement.

| # | Action | Impact | Effort | Constats |
|---|---|---|---|---|
| 1 | Fixer `URL` de production et vérifier canonicals, sitemap, robots et flux dans `dist/` | Très élevé | Faible | NAV-21, CMP-21 |
| 2 | Générer les redirections 301 depuis les CSV (`vercel.json`), traiter les 8 cas manuels, tester en masse | Très élevé | Moyen | NAV-22, CMP-20 |
| 3 | Un `h1` par page, gabarits de titres et de descriptions, titres de comptes rendus affichés | Très élevé | Faible | NAV-03, DES-03, A11Y-02, INV-05 |
| 4 | Reprendre le contenu perdu : 14 chroniques vides, 4 chroniques sans texte, 20 articles récents, 31 interventions de 2018 à 2026, annexes et liste des publications | Très élevé | Moyen | CMP-01, 02, 09, 10, 11, INV-02 |
| 5 | Saisir les 51 conférences et les 165 articles en données structurées (titre, date, lieu, lien) avec texte alternatif réel | Très élevé | Fort (saisie) | INV-03, A11Y-01, CMP-07 |
| 6 | Nettoyer la refonte : pages du modèle, mentions légales réelles, dates `1234`, auteurs corrompus, pied de page « 4.6.1 », liens cassés | Élevé | Faible | CMP-04, 05, 12, 18, 23, 24 |
| 7 | Restaurer l'identité de l'original : accueil sans hero pleine page, serif, papier chaud, filigrane. Adopter les jetons de design du chapitre 02 | Élevé | Moyen | CMP-15, 16, 17, DES-04 |
| 8 | Corriger les contrastes de la refonte (orange `#FF922B`, rouge, gris) et souligner les liens du texte | Élevé | Faible | A11Y-04, 05, CMP-29 |
| 9 | Menu : ajouter Conférences, champ de recherche visible, appel à inviter Thomas, lien APALA | Élevé | Faible | NAV-07, 20, 24, CMP-28 |
| 10 | Recherche Pagefind plein texte en français, page 404 utile, résultats annoncés (`role=status`) | Élevé | Moyen | NAV-14, 15, 02, A11Y-07, CMP-25 |
| 11 | Optimiser les images : webp/avif, dimensions explicites, fin de `object-fit: fill`, correction des faux `.webp` | Élevé | Moyen | NAV-18, INV-10, 11, DES-02, 17 |
| 12 | Mettre en place la structure d'accessibilité : focus visible, `scroll-padding-top`, lien d'évitement, cibles de 44 px, `prefers-reduced-motion`, cartes en listes | Moyen | Faible | A11Y-06, 11, 12, 15, 18 |
| 13 | Corriger les liens externes morts, marquer l'affiliation (`rel="sponsored"` et mention) et supprimer les trackers morts | Moyen | Moyen | INV-08, 09, NAV-06 |
| 14 | Navigation de lecture : fil d'Ariane, précédent/suivant, contenus liés, index des comptes rendus par thème et par date | Moyen | Moyen | NAV-08, 11, CMP-26 |
| 15 | Corriger fautes, typographie française (espaces insécables, guillemets) et slugs (guillemets, `/`) | Moyen | Faible | INV-17, 18, NAV-25 |
| 16 | Republier en HTML les textes servis en PDF non balisé ou en image | Moyen | Fort | A11Y-09 |
| 17 | Ajouter les critiques sur la moitié des livres, les tables des matières, la fiche *La Face cachée de l'Univers* | Moyen | Moyen | CMP-13, NAV-23 |
| 18 | Déclaration d'accessibilité et mentions légales complètes ; tests pa11y et axe en intégration continue | Moyen | Faible | A11Y (chap. 8), CMP-12 |

## 9. Points à trancher avec Thomas Lepeltier

1. **free.fr :** peut-on poser des redirections 301 sur l'ancien hébergement, ou faut-il demander la suppression des pages ?
2. **APALA :** site externe, partenaire ou rubrique ? Le brief ne le précise pas, et la refonte ne le cite que dans la bio.
3. **Liens d'affiliation Amazon :** les conserver (avec mention) ou les supprimer ?
4. **Recherche :** recherche en direct par titres, ou navigation sans rechargement (le brief hésite) ? Cet audit recommande Pagefind plein texte.
5. **Contenu en image :** peut-on obtenir les textes sources des affiches de conférences et des articles servis en image ?
