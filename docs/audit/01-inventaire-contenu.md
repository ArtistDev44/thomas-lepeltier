# 01 — Inventaire du contenu du site d'origine

> Audit réalisé le 23 octobre 2026 sur le site vivant `https://www.thomaslepeltier.fr/` (hébergé sur Vercel). Chapitre rédigé pour guider la refonte `eleventy-excellent`. Les constats portent un identifiant `INV-xx` et une sévérité : **critique** (perte de contenu, blocage d'usage ou d'accessibilité, risque juridique ou SEO majeur), **majeur** (dégrade nettement l'usage ou la qualité), **mineur** (confort, cohérence, finition).

## 0. Périmètre et méthode

- **Cible :** `https://www.thomaslepeltier.fr/` (le domaine nu `thomaslepeltier.fr` redirige en 308 vers `www`). L'ancien hébergement `http://thomas.lepeltier.free.fr/` n'affiche plus qu'une page de renvoi, mais sert encore les pages profondes (INV-01).
- **Moisson :** copie intégrale du site vivant par `wget` (2 004 fichiers, 147 Mo) dans un répertoire isolé ; 590 pages HTML réelles, auxquelles s'ajoutent 590 variantes de `recherche.html?de=…` (même page, paramètre de retour) exclues des statistiques. Page d'accueil, `livres.html`, `articles.html`, `conferences.html`, `qui-suis-je.html`, `contact.html`, `liste-des-publications.html`, `recherche.html` et toutes les autres ont été analysées par script (structure HTML, titres, liens, images, métadonnées, texte).
- **Comparaison avec l'état antérieur :** la copie de juin 2026 (`../thomas.lepeltier.free.fr/`, 635 fichiers) sert de référence pour repérer ce qui a disparu ou changé. Entre juin et le site vivant : 92 fichiers supprimés (dont `sujets/` ×8, `titres/` ×26, `livres/` et `livres (Copie)/` ×32, `styles.css`, `en-tete/`, `cr/wilson-genesis-the-deep-origin-of-societies.html`, `annexes/tout-partie/`) et 51 ajoutés (dont `liste-des-publications.html`, `recherche.html`, 3 annexes, `cr/gollier-l-economie-de-l-in-action-climatique.html`, les fiches livres déplacées à la racine, 22 nouveaux visuels d'article). **Précision utile :** le site vivant a déjà reçu une première modernisation en septembre-octobre 2026 (nouvelle feuille CSS, grille d'accueil, recherche) ; le CSS commenté liste les écarts avec la feuille d'origine de 2015.
- **Liens :** 1 083 URL externes uniques testées au `curl`, les échecs rejoués avec un User-Agent de navigateur. Un 403 ou 402 est classé « non vérifiable » (blocage anti-robot), pas « mort ».
- **Texte :** contrôle orthographique par Hunspell `fr_FR` (via `spylls`) sur le corps des comptes rendus, plus heuristiques de typographie française sur toutes les pages.
- **Limites :** je n'ai pas lu les 528 comptes rendus ; le contrôle orthographique ne détecte pas les erreurs de grammaire ni les homophones. Les affiches de conférence (image seule) n'ont été lues que pour les trois plus récentes. Le rendu graphique, l'accessibilité fine et la navigation sont traités dans les autres chapitres.

## 1. Inventaire des pages par type

### 1.1 Vue d'ensemble

| Type de page | Nombre | Gabarit / URL | Contenu clé | Médias | Verdict |
|---|---:|---|---|---|---|
| Accueil | 1 | `index.html` | Titre de site, accroche, 4 rangées de 4 vignettes (livres, comptes rendus, articles, interventions) | 16 images, toutes avec `alt` descriptif | RÉÉCRIRE (garder le principe, enrichir) |
| Pages principales | 6 (+ `recherche.html`, qui n'existe que sous la forme `recherche.html?de=…`) | `qui-suis-je.html`, `livres.html`, `articles.html`, `conferences.html`, `contact.html`, `liste-des-publications.html`, `recherche.html` | Voir 1.2 | 32 + 165 + 51 + 18 images | voir 1.2 |
| Fiches livres | 14 | `/<slug>.html` à la racine | Présentation, date de parution, résumé, extraits de presse, achat | 1 couverture par fiche | CONSERVER, RÉÉCRIRE les en-têtes |
| Sous-pages de livres | 8 | `darwin-heretique/contents.html`, `univers_paralleles/contents.html`, `autre-cosmos/contents-cosmologie-alternative.html`, `autre-cosmos/debats.html`, `revolution-antispeciste/tdm.html`, `veganes-au-pouvoir/tdm-1.html`, `viande-de-culture/tdm.html`, `hist-philo-sciences/histoire-philosophie-sciences-tb-2.html` | Tables des matières (99 à 613 mots) et débats (1 870 mots) | quelques ornements | CONSERVER |
| Index des comptes rendus par auteur | 25 | `auteurs/a_a.html` à `a_z.html` | 620 vignettes-légendes (auteur, titre, année) | 620 couvertures miniatures | RÉÉCRIRE (génération automatique) |
| Comptes rendus | 528 | `cr/<slug>.html` | Texte de 2 à 5 550 mots, référence du livre, signature, achat | 557 couvertures | CONSERVER, nettoyer |
| Annexes | 6 | `annexes/…` | Textes longs et lettres (voir INV-25) | aucun | CONSERVER |
| Pages articles héritées | 2 | `articles/lecture/…` | Tribune L'Express, référence « Creationism in Europe » | 1 image | CONSERVER / RÉÉCRIRE |
| Documents | 10 PDF + 1 PNG | `articles/lecture/*.pdf` | Tribunes et textes longs (1 à 14 pages) | — | CONVERTIR |
| **Total pages HTML** | **590** | | | | |

### 1.2 Pages principales

| Page | Contenu clé | Médias | Constats | Verdict |
|---|---|---|---|---|
| `index.html` — « Site de Thomas Lepeltier » | Bandeau « L’univers livresque de Thomas Lepeltier / Essayiste, travaillant sur des questions politiques, scientifiques et éthiques » ; 4 derniers livres ; 4 derniers comptes rendus ; 4 derniers articles & entretiens ; 4 dernières interventions publiques | 16 vignettes (JPG/WebP-nommé) | 5 liens vers des fichiers image ; vignettes étirées (INV-11) ; aucune donnée texte sous les vignettes (INV-28) | RÉÉCRIRE |
| `qui-suis-je.html` | Biographie en 2 paragraphes (182 mots), affiliations (Oxford Centre for Animal Ethics, L'Amorce), comptage des productions, lien vers la liste des publications | 1 portrait | Chiffres saisis à la main (INV-15) ; biographie mince | RÉÉCRIRE / ÉTOFFER |
| `livres.html` | 3 sections : Mes livres (10), Livres dirigés (4), Livres auxquels j’ai contribué (18) | 32 couvertures | `alt` = slug ; 18 contributions sans fiche locale (liens éditeurs) ; 9 couvertures < 200 px de large | CONSERVER, enrichir |
| `articles.html` | 165 articles & entretiens en 7 rubriques, légende (publication, numéro, date) | 165 scans de 1re page (65 Mo) | INV-03, INV-27 | RÉÉCRIRE (données structurées) |
| `conferences.html` | 51 interventions, liste « anti-chronologique, non exhaustive » | 51 affiches (19 Mo) | INV-03, INV-22 | RÉÉCRIRE |
| `contact.html` | Une adresse e-mail Gmail (54 mots) | — | INV-14 | RÉÉCRIRE |
| `liste-des-publications.html` | Livres, articles, CR 1998-2026 : 732 entrées, 787 liens, 247 ko | 18 images | INV-24 | RÉÉCRIRE (générée) |
| `recherche.html` | Champ de recherche côté navigateur sur livres, articles et comptes rendus | — | INV-12 | RÉÉCRIRE |

### 1.3 Fiches livres (14)

| Fiche | Parution | Contenu clé | Sous-page |
|---|---|---|---|
| `faut-il-sauver-ours-blanc-transformation-nature.html` | 12 avril 2023 | *Faut-il sauver l’ours blanc ? Essai sur la transformation de la nature* — résumé, extraits (Revue des questions scientifiques…) | — |
| `veganes-au-pouvoir.html` | 1er déc. 2021 (réédition de 2019) | *Les véganes au pouvoir* — résumé, extraits (Sciences & Avenir…) | `veganes-au-pouvoir/tdm-1.html` |
| `big-bang-histoire-critique-d-une-idee.html` | 9 sept. 2021 | *Big bang. Histoire critique d’une idée* (avec J.-M. Bonnet-Bidaud, Gallimard) | — |
| `univers-existe-t-il.html` | 13 janv. 2021 | *L’univers existe-t-il ?* (PUF) | — |
| `imposture-intellectuelle.html` | 20 avril 2017 | *L’imposture intellectuelle des carnivores* | — |
| `cosmologie-face-cachee-univers.html` | 27 févr. 2014 | *La Face cachée de l’Univers* (Seuil) | — |
| `revolution-vegetarienne.html` | 14 nov. 2013 | *La Révolution végétarienne* | — |
| `univers-paralleles.html` | 4 mars 2010 | *Univers parallèles* (Seuil) ; « Traduit en turc » | `univers_paralleles/contents.html` |
| `creationnisme-est-il-scientifique.html` | 14 nov. 2009 | *Vive le créationnisme !* ; « Réponses à mes détracteurs » | `annexes/creationnisme/…` |
| `darwin-heretique.html` | 4 oct. 2007 | *Darwin hérétique* ; traduit en roumain et en portugais | `darwin-heretique/contents.html` |
| `revolution-antispeciste.html` | 15 mars 2023 (1re éd. 2018) | *La Révolution antispéciste* (dir., 2e éd.) | `revolution-antispeciste/tdm.html` |
| `histoire-philosophie-sciences-2.html` | 15 sept. 2022 (1re éd. 2013) | *Histoire et philosophie des sciences* (dir.) | `hist-philo-sciences/histoire-philosophie-sciences-tb-2.html` |
| `viande-de-culture.html` | 7 avril 2021 | *Plaidoyer pour une viande sans animal* (avec D. Chauvet, Puf) | `viande-de-culture/tdm.html` |
| `autre-cosmos-cosmologies-alternatives.html` | 9 mars 2012 | *Un autre cosmos ?* (dir.) | `autre-cosmos/contents-cosmologie-alternative.html`, `autre-cosmos/debats.html` |

Chaque fiche pèse 205 à 585 mots, porte 1 couverture et 15 à 24 liens (achat, presse, éditeur). Constats : INV-16 (formulations datées, titres, liens commerciaux). Verdict : **CONSERVER** (c'est le cœur du site), après nettoyage des en-têtes, des liens et ajout d'un `<h1>` propre.

### 1.4 Conférences (51)

Répartition par année (d'après le nom des fichiers) : 2004 ×1, 2005 ×1, 2008 ×1, 2009 ×3, 2011 ×3, 2012 ×1, 2013 ×2, 2014 ×2, 2015 ×2, 2016 ×3, 2017 ×2, 2018 ×2, 2019 ×4, 2020 ×3, 2021 ×3, 2022 ×1, 2023 ×8, 2024 ×4, 2025 ×2, 2026 ×3. 37 sont servies localement (affiche seule), 14 renvoient vers une vidéo ou un podcast externe. Les trois entrées de 2026 : *Quelle éthique pour l’IA ?* (ESEO Angers, mai 2026), *À l’heure de l’IA, peut-on encore croire au progrès ?* (ESEO Angers, jeudi 21 mai 2026), *Pour en finir avec le vivant !* (séminaire EHESS, 5 mars 2026). Aucune n'est à venir au 23 octobre 2026. Verdict : **RÉÉCRIRE** en fiches texte (INV-03, INV-22).

## 2. Comptes rendus de livres (528 pages)

### 2.1 Statistiques

| Mesure | Valeur |
|---|---|
| Pages `cr/*.html` | 528 (toutes liées depuis au moins un index auteur) |
| Entrées dans les 25 index auteurs | 620 : 602 liées à une page `cr/` (529 cibles distinctes dont 1 manquante), 11 vers un article externe, 6 sans lien ; 64 pages apparaissent plusieurs fois (co-auteurs) |
| Volume de texte | 304 490 mots ; médiane 394 mots, moyenne 577, minimum 2, maximum 5 550 (`cr/foucault-societe.html`) |
| Textes > 1 500 mots | 35 (les plus longs : `foucault-societe` 5 550, `descombes` 4 034, `testart-dons-dieux-anthropologie` 3 972, `belna` 3 623, `nottale-relativite-echelle` 3 595) |
| Comptes rendus < 80 mots | 7 (textes vides, voir INV-06) |
| Poids de page | médiane 19,7 ko HTML (images en sus) |
| Couverture | 528/528 (557 fichiers dans `cr/-couvertures/`), médiane 326 px de large / 31 ko ; 9 > 300 ko (max 892 ko : `huemer-progressive-myths`), 30 GIF, 71 < 200 px |
| `alt` de couverture | 472 = slug de fichier, 3 vides, 53 libellés manuels |
| Titre de page (`<title>`) | unique et pertinent sur les 528 (« Compte rendu de <auteur>, <titre> ») |
| `<h1>` | « L’univers livresque de Thomas Lepeltier » sur les 528 ; 0 intertitre |
| Signature | 511 pages en ont une ; 17 n'en ont aucune ; 19 sans date de publication |
| Périodique de publication (signature, approximatif) | Sciences Humaines 373, revues dont le nom contient « Revue » 43, autres 111 |
| Lien de la signature | 452 vers la page d'accueil du périodique, 18 vers l'article, le reste sans lien |
| Liens externes dans les CR | 1 520 occurrences ; liens d'achat : Amazon 525 pages, Place des libraires 83 pages |
| Années des livres recensés (référence) | 1902 à 2026 ; pic 2000-2020 (14 à 28 par an) ; 15 en 2024, 8 en 2025, 1 en 2026 ; 2 CR signés en 2026 |

### 2.2 Anomalies par fichier

- **Textes vides ou provisoires (7)** : `cr/becker-more-everything-forever.html`, `cr/bregman-ambition-morale.html`, `cr/dumouchel-damiano-vivre-avec-les-robots-empathie-artificielle.html`, `cr/harari-homo-deus.html` (renvoie vers un texte externe), `cr/huemer-progressive-myths.html`, `cr/may-should-we-go-extinct.html`, `cr/taft-motivational-methods-for-vegan-advocacy.html`.
- **Signature manquante (17)** : voir la liste de INV-07.
- **Signature de gabarit** : `cr/may-should-we-go-extinct.html` (« xxx , xxx, xxx »).
- **Couvertures avec `alt` vide (3)** : `cr/engel-epistemologie-pour-une-marquise.html`, `cr/lurz-mindreading-animals.html`, `cr/prinz-beyond-human-nature.html`.
- **Extension de couverture incorrecte (2)** : `cr/-couvertures/ritchie-clearing-the-air.jpg` (PNG), `livres-couvertures/pensee-vegane-experimentation.png` (JPEG).
- **Couvertures lourdes** : `cr/huemer-progressive-myths.html` (892 ko), `cr/descola-pignocchi-ethnographies-des-mondes-a-venir.html` (423 ko), `cr/shapiro-life-as-we-made-it.html` (419 ko).
- **Noms d'URL non normalisés (8)** : `Benovsky-le-puzzle-philosophique`, `Fox-keller-mirage-space-between-nature-nurture`, `Lakoff-Johnson-metaphores-vie-quotidienne`, `attfield-environmental-ethics-a-short-Introduction`, `delahaye-Intelligence-calcul-godel-ordinateurs-quantiques`, `elliott_grigorenko_dyslexia_debate`, `hautefeuille-wieviorka-legalistation_des_drogues` (« legalistation »), `thebaud-mony-science_asservie`.
- **Coquilles dans l'URL** : `cr/hautefeuille-wieviorka-legalistation_des_drogues.html` (« legalistation » pour « legalisation »), `cr/cottret-revolutoin-americaine-quete-bonheur.html` (« revolutoin ») ; `auteurs/a_q.html` n'a qu'une entrée « … ».
- **Coquilles de texte** : annexe D.
- **Pages de compte rendu introuvables** : `cr/wilson-genesis-the-deep-origin-of-societies.html` (INV-02) ; `cr/heams.html` (lien de légende dans `auteurs/a_s.html`, à corriger vers `cr/heams-huneman-lecointre-silberstein-mondes-darwiniens-evolution-de-evolution.html`).

### 2.3 Verdict

**CONSERVER** les 521 comptes rendus rédigés (c'est le plus gros capital éditorial du site : plus de 300 000 mots). **RÉÉCRIRE** (au sens « finaliser ou retirer ») les 7 pages vides. **TRANSFORMER** les métadonnées en champs structurés (INV-29) pour générer les index auteur, thème et titre à partir d'une seule source.

## 3. Liens cassés

### 3.1 Liens et fichiers internes (8 cibles, vérifiées une à une)

| # | Cible introuvable | Page(s) qui la référencent | Cause constatée | Correctif |
|---|---|---|---|---|
| 1 | `/recherche.html` (1 176 occurrences) | toutes les pages (loupe) | **Faux positif de mon contrôle** : la loupe pointe vers `recherche.html?de=<page>`, que la copie enregistre en `recherche.html?de=…` ; la page existe (22 ko, HTTP 200) | Aucun, mais ne pas reproduire le paramètre `?de=` (INV-12) |
| 2 | `/cr/wilson-genesis-the-deep-origin-of-societies.html` | `auteurs/a_w.html` (×2), `liste-des-publications.html` (« 389. ») | Page présente dans la copie de juin, absente du site vivant (HTTP 404) | Restaurer depuis `thomas.lepeltier.free.fr/cr/` |
| 3 | `/annexes/tout-partie/tout_parties.html` | `liste-des-publications.html`, `articles.html` (« Le Tout et les parties dans les systèmes naturels ») | Annexe et images (`tout_parties.jpg`, `tout_parties_tdm.html`) présentes en juin, absentes du site vivant | Restaurer les 4 fichiers |
| 4 | `/histoire-philosophie-sciences.html` | `revolution-vegetarienne.html` (biographie de l'éditeur) ; URL absolue `http://thomas.lepeltier.free.fr/histoire-philosophie-sciences.html` dans `articles.html` | Ancienne édition du livre, remplacée par `histoire-philosophie-sciences-2.html` | Rediriger vers la fiche actuelle |
| 5 | `/cr/heams.html` | `auteurs/a_s.html` (légende, le lien de l'image est correct) | Ancien nom de fichier du compte rendu *Les Mondes darwiniens* | Pointer vers `cr/heams-huneman-lecointre-silberstein-mondes-darwiniens-evolution-de-evolution.html` |
| 6 | `/darwin-heretique/epopee.jpg` | `darwin-heretique/contents.html` (ornement `alt=""`, 166 × 86) | Fichier présent en juin, non copié | Restaurer (ornement) ou supprimer l'image |
| 7 | `/autre-cosmos/riazuelo-uzan-1.html` | `autre-cosmos/debats.html` (lien « ici ») | Fichier absent de toutes les copies, y compris juin | Retrouver les textes ou retirer le lien |
| 8 | `/autre-cosmos/riazuelo-uzan-2.html` | `autre-cosmos/debats.html` | idem | idem |

Hors HTML, 3 liens morts supplémentaires dans le script de recherche (`recherche.html`, INV-12). Aucune page orpheline : toutes les pages sont reliées depuis au moins une autre.

### 3.2 Liens externes

| Classe | URL uniques |
|---|---:|

| Répondent 200 (premier ou second essai) | 921 |
| 404 confirmés | 30 |
| Domaine introuvable (DNS) | 6 |
| Délai dépassé ou erreur TLS | 5 |
| Redirection anormale ou certificat invalide | 6 |
| Liens mal formés ou régie zanox fermée | 6 |
| 405 (redirigent correctement : `adsabs.harvard.edu` → `ui.adsabs…`) | 4 |
| 403 / 402 (anti-robot : non vérifiables) | 105 |
| **Total** | **1 083** |

Domaines les plus cités (occurrences) : `amazon.fr` 540, `scienceshumaines.com` 471, `amzn.to` 438, `placedeslibraires.fr` 90, `lepoint.fr` 74, `causeur.fr` 53, `revue.de.livres.free.fr` 38, `lamorce.co` 34, `larecherche.fr` 30, `pourlascience.fr` 24. 635 URL sont en `http://`. Détail des liens en défaut : annexes A et B ; domaines anti-robot : annexe C.

## 4. Médias

| Mesure | Valeur |
|---|---|
| Fichiers image | 811 (126 Mo) : JPEG 687 (85,2 Mo), PNG 93 (39,9 Mo), GIF 30 (0,9 Mo), WebP réel 1 |
| Par dossier | `articles/` 166 fichiers, 65,4 Mo ; `cr/` 557, 33,9 Mo ; `conferences/` 51, 19 Mo ; `big-bang/` 1, 2,3 Mo ; `livres-couvertures/` 18, 1,9 Mo |
| Images > 500 ko / > 200 ko | 65 / 167 |
| Images > 1 600 px de large | 38 (jusqu'à 2 390 × 3 345 : `articles/1er-page/solidarite-animale.jpg`, 1,96 Mo) |
| Faux `.webp` | 24 (JPEG ou PNG renommés), dont 22 dans `articles/1er-page/` |
| Balises `<img>` | 1 463 : `alt` slug 1 270, `alt` vide 6, sans `width`/`height` 1 445, `loading=lazy` 884 |
| Images référencées introuvables | 1 (`darwin-heretique/epopee.jpg`) |
| Fichiers non référencés par `<img>` | `icon.jpg` (favicon), `articles/1er-page/interview-big-bang-sciences-et-avenir.webp` (cible de lien), `articles/lecture/one-voice-noe_84.png` (cible de lien) |
| Favicon | `icon.jpg` 327 × 218 px, EXIF d'appareil photo ; déclaré `image/x-icon` |
| Documents | 10 PDF (1 à 14 pages, non balisés, avec couche texte) |
| Vidéo, audio | aucun hébergé ; liens vers YouTube (5), Dailymotion, France Culture, RTS, Demain TV |

Constats : INV-03, INV-04, INV-10, INV-11, INV-20, INV-23. Verdict : **CONSERVER** les couvertures et les scans comme sources, mais les **RÉÉCRIRE** (reprise de fichier via pipeline d'images, nouveaux `alt`) ; **SUPPRIMER** les doublons de fichiers hérités.

## 5. Fautes

Constats détaillés : INV-17 (typographie), INV-18 (orthographe et coquilles), INV-19 (balises meta), INV-23 (noms de fichiers). Corrections d'orthographe recensées par le dictionnaire (annexe D).

## 6. Informations obsolètes ou à vérifier

| Élément | Constat | Constat lié |
|---|---|---|
| Chiffres « 10 / 4 / 18 / + de 500 / plus d’une centaine » | Exacts à ce jour (10, 4, 18, 528, 165) mais saisis à la main ; « plus d’une centaine » sous-estime 165 | INV-15 |
| « En librairie le … » | Appliqué à 14 livres, de 2007 à 2023 | INV-16 |
| « (à paraître) » | 10 livres d'index auteurs (2021-2025) et 2 articles ; 1 CR de 2016 encore « à paraître » | INV-06 |
| Conférences | Aucune à venir au 23 oct. 2026 ; dernière entrée : 21 mai 2026 | INV-22 |
| Liens vers `free.fr` | 38 + 1 liens `*.free.fr` externes ; 2 URL absolues vers l'ancien site | INV-26 |
| Liens commerciaux | Fnac via zanox (fermée) ; 9 liens « ebook » Place des libraires renvoient vers la recherche (404) | INV-08, INV-16 |
| Adresse de contact | `thom.lepeltier@gmail.com`, seule voie de contact | INV-14 |
| Réseaux sociaux | Aucun lien, alors que le brief de refonte en demande 3 | INV-14 |
| Mention de copyright | Absente du pied de page (« L’univers livresque de Thomas Lepeltier » seulement) | INV-14 |
| Hébergement | Vercel (en-têtes serveur) ; ancienne copie free.fr toujours en ligne | INV-01 |

## 7. Constats et recommandations (par identifiant)

### INV-01 — L'ancien hébergement free.fr sert toujours une copie complète du site

**Sévérité : critique.**

**Constat.** `http://thomas.lepeltier.free.fr/` n'est qu'une page « le site a déménagé » (meta refresh, 526 octets, aucun code 301), mais les pages profondes répondent toujours 200 avec le contenu intégral : `livres.html`, `qui-suis-je.html`, `auteurs/a_a.html`, `cr/aboudrar-comment-voile-devenu-musulman.html`, `liste-des-publications.html` (246 ko), `recherche.html`. Les pages `sujets/`, `titres/`, `livres/*.html` et `styles.css` y répondent 404. Aucune des pages n'a de `rel=canonical`. Contenu dupliqué sur deux domaines, et deux jeux d'URL concurrents.

**Recommandation.** Au lancement, ne conserver sur free.fr qu'un dispositif de redirection page à page vers le nouveau domaine (tableau de redirections du chapitre navigation) ou retirer les pages. Dans la refonte, poser un `<link rel="canonical">` absolu sur chaque page et déclarer le domaine unique dans le sitemap.

### INV-03 — Contenus essentiels enfermés dans des images (conférences, articles, couvertures)

**Sévérité : critique.**

**Constat.** Page conférences : 51 entrées, chacune est une affiche JPEG/PNG sans aucun texte HTML (titre, lieu et date n'existent que dans le visuel ; l'`alt` est le nom du fichier, ex. `2026-progres-ia-apala`). Les affiches ne sont pas lisibles par un lecteur d'écran, non indexables et non recherchables. Page articles : 37 des 165 entrées pointent d'abord vers le scan de la première page (`.jpg`/`.png`/`.webp`) au lieu d'un texte (26 de ces légendes contiennent aussi un lien externe vers le périodique, souvent sa page d'accueil) ; 3 n'ont aucun lien, 8 mènent vers une page locale et 3 vers un PDF. Sur la page d'accueil, 5 vignettes (4 affiches de conférence et 1 article) mènent directement à un fichier image.

**Recommandation.** Créer un enregistrement texte par intervention (titre, date ISO, lieu, organisateur, lien vidéo ou replay) avec l'affiche en illustration facultative et un `alt` descriptif. Pour les 37 scans, produire une page de texte (ou le PDF existant) ; à défaut, indiquer la référence complète en texte et la citation de la première page en `alt`/légende. Voir aussi le chapitre accessibilité.

### INV-02 — Contenus présents en juin et disparus du site vivant, ou jamais publiés

**Sévérité : majeur.**

**Constat.** Liens internes cassés vérifiés un par un (voir §3.1) : `cr/wilson-genesis-the-deep-origin-of-societies.html` (existait dans la copie de juin, lié depuis `auteurs/a_w.html` et `liste-des-publications.html`), `annexes/tout-partie/tout_parties.html` (annexe avec table des matières et couverture, existait en juin), `darwin-heretique/epopee.jpg` (existait en juin), `histoire-philosophie-sciences.html` (lien interne de `revolution-vegetarienne.html` et URL absolue free.fr dans `articles.html`), `autre-cosmos/riazuelo-uzan-1.html` et `-2.html` (réponses de Riazuelo et Uzan, absentes de toutes les copies).

**Recommandation.** Restaurer le compte rendu Wilson et l'annexe « Le Tout et les parties » depuis la copie de juin (`thomas.lepeltier.free.fr/`), remplacer `epopee.jpg`, corriger les deux liens `histoire-philosophie-sciences.html` vers `histoire-philosophie-sciences-2.html`. Demander à Thomas Lepeltier les deux textes Riazuelo/Uzan, sinon retirer les liens « ici ».

### INV-04 — Texte alternatif des images quasi systématiquement inutilisable

**Sévérité : majeur.**

**Constat.** 1 463 balises `<img>` sur 590 pages : 1 270 (87 %) ont pour `alt` un nom de fichier ou un slug (`vegane-au-pouvoir`, `piketty-sandel-ce-que-l-egalite-veut-dire`, `2023-cnews-1`), 6 ont un `alt` vide alors que l'image porte du sens (`cr/engel-epistemologie-pour-une-marquise.html`, `cr/lurz-mindreading-animals.html`, `cr/prinz-beyond-human-nature.html`, `liste-des-publications.html`). Seule la page d'accueil et quelques `alt` récents (« Va-t-on perdre le contrôle de l’IA ? ») sont descriptifs. Sur les pages de compte rendu l'image est le seul « titre » avant le texte et son `alt` répète le slug (472 des 528 pages).

**Recommandation.** Pour une couverture : `alt="Couverture de <titre>, <auteur>"` ou `alt=""` si le titre est déjà en texte adjacent. Générer l'`alt` depuis les métadonnées (titre/auteur/année) plutôt que de le saisir à la main.

### INV-05 — Même titre H1 sur 528 comptes rendus et sur quasiment toutes les pages

**Sévérité : majeur.**

**Constat.** Le seul `<h1>` de chaque page (528 comptes rendus, fiches livres, annexes, index auteurs) est « L’univers livresque de Thomas Lepeltier » (bandeau de site). Le titre propre à la page (livre recensé, article, rubrique) n'est jamais un titre de niveau 1 : les comptes rendus n'ont aucun `<h2>`, les index auteurs commencent à `<h2>`. Seules 2 pages n'ont aucun `<h1>` (`articles/lecture/creationism-france.html` et `articles/lecture/viande-de-culture-l-express.html`, restées sur l'ancien gabarit HTML 4).

**Recommandation.** Un seul `<h1>` par page = le titre du contenu (titre du livre recensé, nom de la rubrique, titre de l'article) ; le nom du site passe en élément de bandeau non titré. Prévoir `<h2>` pour les sous-parties (« Compte rendu », « Pour acheter », « Livres liés »).

### INV-06 — Textes provisoires publiés : « à venir », « à paraître », « xxx »

**Sévérité : majeur.**

**Constat.** 7 comptes rendus ne contiennent aucun texte (2 à 10 mots : `[à venir]`, `(à paraître)`, `[Texte à venir]`) : `cr/becker-more-everything-forever.html` (2 mots), `cr/bregman-ambition-morale.html` (2 mots), `cr/dumouchel-damiano-vivre-avec-les-robots-empathie-artificielle.html` (3 mots), `cr/harari-homo-deus.html` (3 mots), `cr/huemer-progressive-myths.html` (10 mots), `cr/may-should-we-go-extinct.html` (2 mots), `cr/taft-motivational-methods-for-vegan-advocacy.html` (3 mots). `cr/may-should-we-go-extinct.html` affiche une signature de gabarit « Thomas Lepeltier, xxx , xxx, xxx. » ; `cr/dumouchel-damiano-vivre-avec-les-robots-empathie-artificielle.html` annonce « [Texte à venir] / à paraître » pour un livre de 2016. Les index auteurs répètent 'à paraître' pour 10 livres dont les dates vont de 2021 à 2025 (Harden 2021, McLean 2023, Norberg 2023, Gosseries 2024, Waldenström 2024, Zeleznikow-Johnston 2024, Scientifiques en rébellion 2024, Bregman 2025). Quatre n'ont aucun lien (`auteurs/a_g.html`, `a_m`, `a_w`, `a_z`) ; les autres pointent vers une page vide ou un article externe (`a_b`, `a_h`, `a_n`, `a_s`). Placeholder « … » seul sous la lettre Q (`auteurs/a_q.html`).

**Recommandation.** Ne pas migrer les 7 pages vides : les passer en `draft: true` (non publiées) ou les rédiger. Gérer 'à paraître' par un champ de statut daté (`status: en_preparation`) qui masque l'entrée publiquement, plutôt que par du texte dans le titre.

### INV-07 — Pages de compte rendu sans signature ou sans date de publication

**Sévérité : majeur.**

**Constat.** 17 comptes rendus n'ont aucune signature (journal, numéro, date) alors que la mise en forme l'attend :

- `cr/chambers-against-marriage.html`
- `cr/descola-pignocchi-ethnographies-des-mondes-a-venir.html`
- `cr/edmonds-future-morality.html`
- `cr/gelderloos-comment-la-non-violence-protege-l-etat.html`
- `cr/glover-choisir-ses-enfants-conception-genetique-handicap.html`
- `cr/harden-the-genetic-lottery.html`
- `cr/huemer-progressive-myths.html`
- `cr/jaquet-le-pire-des-maux.html`
- `cr/lyons-politics-animal-experimentation.html`
- `cr/pinker-rationalite-ce-qu-est-la-pensee-rationnelle-et-pourquoi-nous-en-avons-plus-que-jamais-besoin.html`
- `cr/plumwood-reanimer-la-nature.html`
- `cr/robin-la-fabrique-des-pandemies.html`
- `cr/ryan-jetha-au-commencement-etait-le-sexe.html`
- `cr/stoczkowski-hommes-dieux-extraterrestres-ethnologie-croyance-moderne.html`
- `cr/thebaud-mony-science_asservie.html`
- `cr/villalba-oury-collapsologie.html`
- `cr/woessner-seznec-les-illusionnistes-climat-agriculture-nucleaire-ogm.html`

Au total 19 comptes rendus n'ont aucune date de publication du compte rendu.

**Recommandation.** Renseigner (ou marquer « inédit ») le périodique, le numéro et la date dans un champ structuré obligatoire pour les CR publiés ; contrôle à la compilation (build) qui échoue si le champ manque.

### INV-08 — Liens externes morts ou détournés

**Sévérité : majeur.**

**Constat.** 1 083 URL externes uniques (2 040 occurrences), toutes testées, puis les échecs rejoués avec un User-Agent navigateur : 921 répondent 200 ; **30 renvoient 404** ; **6 domaines n'existent plus** ; 5 sont en délai dépassé ou erreur TLS ; 6 redirigent de façon anormale ; 5 liens Fnac passent par la régie `ad.zanox.com` (fermée) et sont mal formés ; 105 répondent 403/402 (blocage anti-robot, non vérifiables automatiquement : surtout `scienceshumaines.com`, `lepoint.fr`, `editions.scienceshumaines.com`). Cas grave : `versusmagazine.co` (2 comptes rendus) redirige maintenant vers un site tiers sans rapport (`fares.globalflightcheck.com`) avec un certificat expiré. Détail en annexes A et B.

**Recommandation.** Retirer immédiatement les liens vers `versusmagazine.co`. Pour chaque lien mort, remplacer par la version archivée (Wayback Machine) ou supprimer l'URL en gardant la référence. Intégrer un contrôle de liens automatisé (par exemple `lychee`) en intégration continue, avec liste d'exceptions pour les domaines à anti-robot.

### INV-09 — Liens d'affiliation Amazon omniprésents, dont une soixantaine malformés, sans mention d'affiliation

**Sévérité : majeur.**

**Constat.** Environ 700 URL d'achat uniques portent l'identifiant d'affiliation `httpthomaslep-21` (461 URL `amazon.fr` avec `tag=`) ou des liens courts `amzn.to` (239), sur 525 des 528 comptes rendus. 59 URL contiennent du HTML collé dans le paramètre `tag` (`…tag=httpthomaslep-21%22%3EAmazon.fr%3C/a%3E…`, `…%3Cimg%20src=%22http://ir-fr.amazon-adsystem.com/…`) : ils fonctionnent par tolérance d'Amazon mais l'attribution est invalide. Le site n'a aucune page de mentions légales, ni mention de l'affiliation (obligation de transparence), ni information sur les traceurs ; `grep` sur le site : aucun résultat pour « mentions légales », « cookies », « confidentialité », « affiliation ».

**Recommandation.** Centraliser les liens d'achat dans une donnée (ISBN + fournisseur) et générer l'URL d'affiliation au build. Ajouter une page Mentions légales (éditeur, hébergeur) et une page Confidentialité, plus une mention visible « Certains liens sont des liens d'affiliation ». Proposer systématiquement une alternative non commerciale (Place des libraires, bibliothèques, éditeur).

### INV-10 — Poids des images : 126 Mo, formats mal choisis, faux fichiers `.webp`

**Sévérité : majeur.**

**Constat.** 811 fichiers image (126 Mo) pour 590 pages HTML (12,9 Mo) : articles 65,4 Mo (166 scans), comptes rendus 33,9 Mo (557 couvertures), conférences 19 Mo (51 affiches). 65 images dépassent 500 ko, 38 dépassent 1 600 px de large ; la plus lourde est `conferences/2021-Rennes-Ecologie-antispecisme.png` (2,3 Mo) ; `big-bang/couverture-big-bang.jpg` fait 2,3 Mo et 1 276 × 2 102 px, affichée sur la page d'accueil et dans 3 autres pages comme vignette. 93 PNG (39,9 Mo) dont 79 > 150 ko, 30 GIF de couvertures. Les 24 fichiers nommés `.webp` sont en réalité des JPEG ou des PNG renommés (ex. `articles/1er-page/why-the-world-is-not-going-to-collapse.webp` : PNG de 1,6 Mo) ; 2 autres ont une extension qui ne correspond pas au format (`cr/-couvertures/ritchie-clearing-the-air.jpg`, `livres-couvertures/pensee-vegane-experimentation.png`). Seuls 884 des 1 463 `<img>` sont en `loading=lazy` ; 1 445 n'ont ni `width` ni `height` (décalage de mise en page).

**Recommandation.** Passer par un pipeline d'images au build (Eleventy Image est déjà dans le projet cible) : AVIF/WebP réels, 3 largeurs (`srcset`), dimensions explicites, `loading=lazy` sauf image principale. Objectif : < 200 ko par vignette de grille, < 1 Mo pour un visuel plein cadre. Conserver les originaux hors du dépôt public.

### INV-11 — Couvertures de basse définition et vignettes déformées

**Sévérité : majeur.**

**Constat.** Sur 557 couvertures de comptes rendus : largeur médiane 326 px, minimum 100 px ; 71 couvertures (dont 9 dans `livres-couvertures/`) font moins de 200 px de large et sont agrandies à l'affichage. Le CSS de l'accueil déclare `object-fit: fill` pour toutes les vignettes de grille avec un commentaire reconnaissant qu'elles sont étirées de −7 % à +5 % (rapports 0,622 à 0,702 pour une tuile à 0,667). Les affiches de conférence en ratio 4:3 sont forcées dans cette même logique.

**Recommandation.** Fixer un ratio de couverture unique avec `object-fit: contain` sur fond neutre (ou rogner à la source), exiger 400 px de large minimum à l'import, et remplacer les 71 petites couvertures par des fichiers éditeur ou de bibliothèque libre.

### INV-12 — Recherche : index codé en dur, trois liens morts, rien sans JavaScript

**Sévérité : majeur.**

**Constat.** `recherche-moteur.js` charge au premier usage 805 ko de HTML (les 25 pages `auteurs/` et `articles.html`) dans le navigateur. Les livres sont listés à la main dans `recherche.html` (variable `MES_LIVRES`, 35 entrées) : 3 pointent vers des pages inexistantes (`veganes-vont-ils-prendre-le-pouvoir.html`, `revolution-antispeciste-1e-edition.html`, `histoire-philosophie-sciences.html`), et les titres des contributions sont déduits de noms de fichier (« Tout et parties », « Religion sh », « Philosophie auteurs themes »). Les paramètres `?de=<page>` (retour à la page précédente) donnent 590 variantes d'URL de la même page. Le repli `noscript` renvoie seulement vers les listes statiques.

**Recommandation.** Remplacer par un index de recherche généré au build (Pagefind est déjà prévu dans le script `build` de la refonte). Une seule page `/recherche/`, sans paramètre de retour, et des titres issus des métadonnées.

### INV-13 — Parcours de classement par sujet et par titre supprimés

**Sévérité : majeur.**

**Constat.** La copie de juin (état antérieur) contenait 8 pages de classement par sujet (`sujets/histoire.html`, `philosophie.html`, `religion.html`, `sciences.html`, etc.) et 26 pages par titre (`titres/t_a.html` à `t_z.html`) pour les comptes rendus. Le site vivant ne propose plus que le classement par auteur (25 pages alphabétiques) et la recherche ; les anciennes URL répondent 404 sur les deux domaines.

**Recommandation.** Réintroduire ces vues comme filtres et pages d'étiquettes générés (thèmes issus des 8 sujets historiques, tri par titre) et prévoir des redirections 301 `/sujets/*` et `/titres/*` vers les nouvelles pages.

### INV-14 — Aucune page légale, aucun réseau social, contact réduit à une adresse en clair

**Sévérité : majeur.**

**Constat.** `contact.html` (54 mots) n'affiche que `thom.lepeltier@gmail.com` en clair (`mailto:`), sans formulaire ni indication de délai ou de motif de contact ; aucune page mentions légales/confidentialité ; aucun lien vers un réseau social ni vers le Oxford Centre for Animal Ethics ou L'Amorce depuis la page de contact. Pas de balises Open Graph, pas de `canonical`, pas de `sitemap.xml`, pas de `robots.txt` (404), pas de page 404 personnalisée (texte brut « The page could not be found »).

**Recommandation.** Page Contact avec formulaire (ou lien de contact protégé contre l'aspiration), motifs (presse, conférences, éditeurs), précisions de disponibilité pour des conférences et liens vers les profils. Ajouter mentions légales, politique de confidentialité, sitemap, robots, canonical, Open Graph et une page 404 de marque.

### INV-15 — Chiffres de la page « Qui suis-je ? » exacts mais figés à la main, formulation datée

**Sévérité : mineur.**

**Constat.** « 10 en tant qu’auteur et 4 que j’ai dirigés » (comptés : 10 + 4 sur `livres.html`), « les livres auxquels j’ai contribué (18) » (18 comptés), « + de 500 » comptes rendus (528 comptés), « plus d’une centaine » d'articles (165 comptés : la formule sous-estime d'environ un tiers). Les nombres sont saisis à la main et divergeront dès le prochain ajout. La page ne compte que 182 mots, un seul portrait, aucun parcours daté ni distinction.

**Recommandation.** Calculer ces compteurs depuis les collections au build. Enrichir la biographie (parcours, affiliations avec dates, enseignement, journalisme) comme le demande le brief.

### INV-16 — Fiches livres : formulations datées, titres incohérents, liens commerciaux morts

**Sévérité : mineur.**

**Constat.** Les 14 fiches affichent « En librairie le … » y compris pour des livres de 2007 à 2014 (Darwin hérétique : « En librairie le 4 octobre 2007 »). `revolution-antispeciste.html` et `histoire-philosophie-sciences-2.html` écrivent « 1er éd. » (à corriger en « 1re éd. »). `veganes-au-pouvoir.html` : `<title>` = « Les Véganes vont-ils prendre le pouvoir ? », titre de page = « Les véganes au pouvoir » (réédition 2021), `alt` de la grille = `vegane-au-pouvoir`. Les boutons « Fnac.com » de `univers-paralleles.html`, `darwin-heretique.html` et `creationnisme-est-il-scientifique.html` passent par `ad.zanox.com` (inopérant). `www.puf.com/content/Faut-il_sauver_lours_blanc` et `…/Lunivers_existe-t-il` répondent 404. 10 livres « auteur » + 4 « dirigés » + 18 contributions : seules 14 fiches existent, les contributions pointent vers des sites d'éditeurs (dont 12 liens vers `editions.scienceshumaines.com`, qui bloque les robots).

**Recommandation.** Remplacer par « Paru le … » (date ISO en donnée), normaliser un titre canonique par livre, supprimer les liens Fnac/zanox, vérifier les pages PUF. Prévoir une fiche courte locale pour les contributions (couverture, sommaire, lien éditeur).

### INV-17 — Typographie française irrégulière

**Sévérité : mineur.**

**Constat.** Sur l'ensemble des pages : apostrophe droite `'` à la place de `’` (12 832 occurrences sur 265 pages, essentiellement les anciens comptes rendus : `cr/foucault-societe.html` 385, `cr/descombes.html` 320, `cr/belna.html` 292) ; espace simple et non insécable devant `? ! : ;` (620 occurrences sur 280 pages, dont les 25 index auteurs) ; absence d'espace devant `?`/`;` (16 occurrences : `cr/simon-vercingetorix-ideologie-francaise.html`, `cr/belna.html`, `cr/descombes.html`, `cr/halm.html`, `cr/baridon.html`, `cr/sanders-the-dark-matter-problem-a-historical-perspective.html`, `liste-des-publications.html`) ; guillemets français sans insécable (24 occurrences / 13 pages) ; guillemets droits `"…"` (51 occurrences / 13 pages, ex. `annexes/d_espagnat.html`) ; doubles espaces (97 / 62 pages) ; espace avant virgule ou point (13 / 12 pages, ex. `cr/magueijo-plus-vite-que-la-lumiere.html`) ; trois points `...` au lieu de `…` (151 / 54 pages, dont 9 sur `univers-paralleles.html`).

**Recommandation.** Appliquer à l'import un correctif typographique automatisé (apostrophes courbes, insécables avant `? ! : ; »` et après `«`, `…`), puis relecture sur échantillon. Le filtre peut tourner à chaque build pour les nouveaux textes.

### INV-18 — Coquilles et orthographe

**Sévérité : mineur.**

**Constat.** Contrôle orthographique (dictionnaire Hunspell `fr_FR`) sur 17 558 mots distincts des comptes rendus : 318 formes inconnues dont une trentaine de vraies fautes (annexe D) : « succintement », « suprimé », « fontionnement », « insuffissante », « rationnalisée », « fondamantales », « renouvellée », « réafirme », « durkhemiens », « shéma »… plus la chaîne parasite « bxgzgktl » dans `cr/steinberger-the-problem-with-god.html` et deux mots tronqués (« suffisa », « soci »). L'orthographe rectifiée est appliquée de façon irrégulière : « entraîn- » 59 fois contre « entrain- » 10 fois, « chaîne » 13 / « chaine » 13, « coût » 48 / « cout » 24 ; la ligature manque dans « oeuvre(s) » (73 occurrences contre 94 « œuvre ») et dans « coeur » (12 contre 30 « cœur »). Les 14 « ième » de `cr/belna.html` sont à écrire « e ».

**Recommandation.** Corriger les fautes (annexe D), choisir une orthographe (rectifiée ou traditionnelle) et la faire respecter par un correcteur dans le flux d'édition ; remplacer `oe` par `œ` à l'import (liste d'exceptions : « moelle », « poésie »).

### INV-19 — Métadonnées SEO génériques ou erronées

**Sévérité : mineur.**

**Constat.** 583 descriptions distinctes pour 590 pages ; 5 pages (`livres.html`, `contact.html`, `conferences.html`, `articles.html`, `articles/lecture/creationism-france.html`) partagent la description du site : « Thomas Lepeltier, Face cachée de l'univers, Revolution végétarienne, Un autre cosmos, Univers parallèles, Vive le creationnisme, Darwin hérétique, comptes rendus de livres » (accents manquants, ne décrit pas la page). La balise `keywords` (obsolète) est présente partout. Titres de page : `<title>` « Site de Thomas Lepeltier : Articles » est dupliqué entre `articles.html` et `articles/lecture/creationism-france.html`. Les comptes rendus ont un titre et une description de qualité (« Compte rendu de Thomas Piketty & Michael Sandel, Ce que l’égalité veut dire »).

**Recommandation.** Gabarits de `<title>` et de description par type de page, descriptions uniques écrites pour accueil, livres, articles, conférences, contact ; supprimer `keywords`.

### INV-20 — Pages héritées de l'ancienne structure

**Sévérité : mineur.**

**Constat.** `articles/lecture/creationism-france.html` : HTML 4.01 transitoire sans `lang`, sans `viewport`, feuille `../../styles_new.css`, 36 mots (une référence + une image), pied de page vide `&nbsp;`. `articles/lecture/viande-de-culture-l-express.html` (1 125 mots) charge aussi `styles_new.css` et n'a pas de `<h1>`. `annexes/tout-partie` n'existe plus (INV-02). Le dossier `articles/lecture/` contient aussi 10 PDF non balisés (`Tagged: no` selon `pdfinfo`, avec couche texte, titres de métadonnées techniques : « Ens_Hist_Phys », « Parrique ») et un PNG de 940 ko (`one-voice-noe_84.png`) servi comme document.

**Recommandation.** Convertir ces documents en pages HTML (texte intégral pour ceux dont les droits le permettent) ou en PDF balisés avec titre et langue renseignés.

### INV-21 — Index des comptes rendus : doublons voulus, entrées sans page, liens hétérogènes

**Sévérité : mineur.**

**Constat.** 25 pages alphabétiques (`a_a` à `a_z`, sans `x`) listent 620 entrées pour 528 pages de compte rendu : 64 pages apparaissent deux fois ou plus (ouvrages à plusieurs auteurs, ex. Adams/Crary/Gruen), 6 entrées n'ont pas de lien (4 « à paraître » — André/Gosseries, McLean, Waldenström, Zeleznikow-Johnston —, Grenouilleau *La Révolution abolitionniste* 2017 qui n'a pas de page, et le « … » de la lettre Q), 1 lien mène à une page absente (Wilson), 11 entrées pointent vers un article externe (Le Point, L'Amorce) au lieu d'une page locale (`auteurs/a_b.html`, `a_k`, `a_l`, `a_m`, `a_o`, `a_r`, `a_s`, `a_y`). Sur les signatures, 452 liens renvoient vers la page d'accueil du périodique (`http://www.scienceshumaines.com`) et 18 seulement vers l'article.

**Recommandation.** Générer les index à partir des métadonnées (auteurs multiples = relations, pas duplication manuelle) ; héberger ou archiver une page de compte rendu pour chaque entrée, même brève, avec lien vers l'article d'origine quand il existe ; lier la signature à l'article précis, ou à défaut ne pas lier.

### INV-22 — Conférences : lien avec APALA et disponibilité non exprimés, noms incohérents

**Sévérité : mineur.**

**Constat.** L'`alt` des deux affiches de 2026 de l'accueil est « … (APALA, 2026) », alors que les deux visuels portent « ESEO Angers – Grande École d’Ingénieurs Généralistes – 21 mai 2026 » (et le séminaire du 5 mars 2026 est à l'EHESS) : à vérifier, `apala` apparaît dans le nom de fichier mais pas dans l'image. La page dit seulement « (liste anti-chronologique, non exhaustive) » : pas de date lisible, pas de thème, pas d'invitation à solliciter une intervention, alors que le brief de refonte demande de l'afficher. 14 entrées renvoient vers un média externe (YouTube ×5, France Culture, Dailymotion ×2, RTS, Demain TV…). `https://jicanimale.fr/jica2023.html` n'existe plus (DNS). 8 interventions pour 2023, 3 pour 2026.

**Recommandation.** Fiche texte par intervention avec date, lieu, organisateur, thème, support (vidéo/audio/slides) et une zone d'appel à contact « Inviter Thomas Lepeltier ». Vérifier l'attribution « APALA » avec Thomas Lepeltier avant toute reprise.

### INV-23 — Images : noms de fichiers et dossiers fragiles

**Sévérité : mineur.**

**Constat.** Dossier nommé `cr/-couvertures/` (commence par un tiret, une URL de ce type est mal gérée par certains outils), 8 URL de compte rendu avec majuscules ou soulignement (`cr/Benovsky-le-puzzle-philosophique.html`, `cr/Lakoff-Johnson-metaphores-vie-quotidienne.html`, `cr/elliott_grigorenko_dyslexia_debate.html`, `cr/thebaud-mony-science_asservie.html`…), 43 images avec majuscules, espaces ou double extension (`articles/1er-page/a-critique-of-appeals-to-science.png.png`). Hébergement sensible à la casse ailleurs que sur Apache/free.fr = liens cassés possibles. Favicon : `icon.jpg` est une photo de 327 × 218 px (non carrée) avec métadonnées EXIF (modèle d'appareil Canon EOS 5D, logiciel Photoshop Elements), déclarée `type="image/x-icon"` pour un fichier JPEG.

**Recommandation.** Normaliser tous les noms en minuscules sans espace ni soulignement et garder une table de redirection `ancien → nouveau` ; fournir un vrai jeu de favicons carrés (SVG + PNG 192/512, `apple-touch-icon`) ; retirer l'EXIF.

### INV-24 — Page « liste des publications » : troisième source de vérité, hors menu

**Sévérité : mineur.**

**Constat.** `liste-des-publications.html` (247 ko, 17 367 mots, 732 entrées de liste, 787 liens) recopie à la main livres, articles et comptes rendus classés par année, avec 43 mentions « (non publié) ». Elle n'est accessible que par le lien « La liste de mes publications → » de `qui-suis-je.html`, a un seul `<h1>` (« L’univers livresque… »), son titre en `<h2>`, et 18 images. Elle fait doublon avec `articles.html` et `auteurs/*`, donc sujette à dérive.

**Recommandation.** La générer au build à partir des mêmes collections que les pages (aucune saisie manuelle) et proposer un export PDF « CV / bibliographie ». Garder une entrée dans le menu secondaire.

### INV-25 — Annexes : contenu rare à conserver, liens obsolètes

**Sévérité : mineur.**

**Constat.** 6 annexes : `annexes/abst_sci.html` (résumés d'articles d'astrophysique, ADS), `annexes/creationnisme/` (3 textes de 579 à 3 770 mots : *Le créationnisme est-il scientifique ?*, *La science n’est pas similaire au jeu d’échecs*, *Questions à Guillaume Lecointre*), `annexes/d_espagnat.html` (lettre), `annexes/revue-de-livres-commentaires.html` (1998-2000, 38 liens vers `revue.de.livres.free.fr`, `perso.easynet.fr/~lalloz` malformé, `gesnet.net` mort). 4 liens ADS (`adsabs.harvard.edu`) répondent 405 mais redirigent vers `ui.adsabs.harvard.edu` : fonctionnels. Aucune de ces pages n'a d'image et toutes sont atteintes par 2 à 4 liens.

**Recommandation.** Conserver, reformater dans le gabarit, mettre à jour les URL ADS vers `ui.adsabs.harvard.edu`, signaler la source archivée (Wayback) pour les sites disparus.

### INV-26 — Dépendance à `*.free.fr` et à `pourlascience.fr`

**Sévérité : mineur.**

**Constat.** 38 liens vers `http://revue.de.livres.free.fr/` et 1 vers `http://bonnetbidaud.free.fr/` (répondent 200 aujourd'hui, hébergement gratuit fragile) ; 2 URL absolues vers `thomas.lepeltier.free.fr` (`liste-des-publications.html` : un PNG qui fonctionne ; `articles.html` : `histoire-philosophie-sciences.html`, 404). 24 signatures pointent vers `http://www.pourlascience.fr/`, qui enchaîne des redirections vers une page de connexion (boucle sans cookies). 635 des 1 083 URL externes sont en `http://` et non `https://`.

**Recommandation.** Remplacer les URL absolues internes par des liens relatifs, passer les liens externes en `https://` quand la cible le permet, archiver les sites de référence perdus.

### INV-27 — Articles : 165 entrées en 7 rubriques, 114 liens externes sans copie

**Sévérité : mineur.**

**Constat.** 7 rubriques (hist. & philo des sciences 37, éthique animale 49, environnement 24, économie 22, historiographie 8, astrophysique 4, divers 21). 114 entrées renvoient d'abord vers l'éditeur (risque de disparition ou d'accès payant), 37 vers un scan, 8 vers une page locale, 3 vers un PDF, 3 sans lien. 2 « (à paraître) » à vérifier (`Journal of Animal Ethics 16(2) 2026`, `Revue d’Études Benthamiennes`). 37 entrées datent de 2026 et 11 de 2025, soit près de 30 % du fonds en moins de deux ans : l'activité récente domine la liste. Aucune date n'existe hors de la légende (texte libre).

**Recommandation.** Un champ `date` ISO + `publication` + `url` + `texte_local` par article, tri chronologique par défaut avec filtre par rubrique ; archiver une copie datée (avec accord de l'éditeur) pour les articles dont l'URL est instable.

### INV-28 — Accueil : bonne base de contenu, entrées peu informatives

**Sévérité : mineur.**

**Constat.** Quatre rangées de quatre vignettes (livres, comptes rendus, articles, interventions) sans texte visible hors `alt` (qui, lui, est correct sur cette page) ; 5 liens de l'accueil mènent directement à un fichier image (`articles/1er-page/va-t-on-perdre-le-controle-des-ia.jpg` et les 4 affiches de conférence) ; le premier « dernier compte rendu » (Ritchie, *Clearing the Air*) ouvre un article du Point au lieu de la page locale. Le bandeau annonce « Essayiste, travaillant sur des questions politiques, scientifiques et éthiques », alors que la page Qui suis-je met en avant l'astrophysique, l'histoire des sciences et l'éthique animale.

**Recommandation.** Garder le principe « productions d'abord » ; ajouter titre, date et source sous chaque vignette, lier chaque vignette à une page locale et aligner la phrase d'accroche avec la biographie.

### INV-29 — Compte rendu : structure plate, métadonnées bibliographiques non structurées

**Sévérité : mineur.**

**Constat.** 528 pages, 304 490 mots au total, 394 mots en médiane (2 à 5 550) ; 35 dépassent 1 500 mots (`cr/foucault-societe.html` : 5 550 mots) sans aucun intertitre. La référence du livre (titre, auteur, éditeur, année) est écrite en texte libre avec `<br>` dans un `<div>`, et la ligne d'achat aussi (Amazon seul sur environ 440 pages, Amazon + Place des libraires sur 83). Aucun champ ISBN, thème, mot-clé, durée de lecture, ni lien vers les autres comptes rendus du même auteur.

**Recommandation.** Modéliser un compte rendu comme une donnée : `livre.titre`, `livre.auteurs[]`, `livre.editeur`, `livre.annee`, `isbn`, `publication`, `date`, `themes[]`, `texte`. Affichage et index générés depuis ces champs.

## 8. Verdicts par ensemble de contenus

| Ensemble | Verdict | Justification |
|---|---|---|
| 14 fiches livres + 8 sous-pages | **CONSERVER** | Cœur du site, textes solides, extraits de presse ; nettoyer en-têtes et liens |
| 521 comptes rendus rédigés | **CONSERVER** | 300 000 mots, capital éditorial unique ; corriger typographie et coquilles |
| 7 comptes rendus vides | **SUPPRIMER** de la publication (ou rédiger) | Aucun contenu, signature de gabarit |
| 165 articles & entretiens | **RÉÉCRIRE** | Sources valables, mais données à structurer (date, éditeur, texte local) |
| 51 conférences | **RÉÉCRIRE** | Contenu uniquement en image ; passer en fiches texte |
| Pages Qui suis-je / Contact | **RÉÉCRIRE** | Trop mince, à enrichir selon le brief |
| Liste des publications | **RÉÉCRIRE** | Remplacer par une page générée + export PDF |
| Index par auteur (25 pages) | **RÉÉCRIRE** | Générer depuis les métadonnées ; ajouter thème et titre (retour des vues de juin) |
| Recherche | **RÉÉCRIRE** | Pagefind, sans index codé en dur |
| 6 annexes | **CONSERVER** | Textes de fond sur le créationnisme et la cosmologie |
| 10 PDF | **RÉÉCRIRE** | Convertir en pages ou PDF balisés |
| Couvertures et scans | **CONSERVER** puis traiter | Même sources, nouveau pipeline, 71 petites couvertures à remplacer |
| Pages héritées (`articles/lecture/creationism-france.html`) | **RÉÉCRIRE** | Gabarit HTML 4 |
| Contenu dupliqué sur `free.fr` | **SUPPRIMER** | Après mise en place des redirections |
| Pages `sujets/`, `titres/` (état de juin) | **RESTAURER** sous forme de filtres | Fonction perdue |

## 9. Synthèse chiffrée

| Indicateur | Valeur |
|---|---:|
| Pages HTML | 590 |
| Comptes rendus / index auteurs / fiches livres / annexes | 528 / 25 / 14 / 6 |
| Articles listés / conférences / contributions / livres (auteur + dirigés) | 165 / 51 / 18 / 14 |
| Images (fichiers / poids) | 811 / 126 Mo |
| Balises `<img>` avec `alt` = nom de fichier | 1 270 sur 1 463 (87 %) |
| Faux `.webp` | 24 |
| Liens internes réellement cassés | 7 (+ 3 dans la recherche) |
| Liens externes uniques testés | 1 083 |
| Dont morts confirmés (404, DNS) | 36 |
| Dont domaine détourné | 1 (`versusmagazine.co`, 2 pages) |
| Liens anti-robot non vérifiables | 105 |
| Pages avec apostrophe droite | 265 (12 832 occurrences) |
| Espaces non insécables manquantes avant `? ! : ;` | 620 occurrences / 280 pages |
| Fautes d'orthographe avérées (hors variantes de réforme) | une trentaine |
| Constats | 29 : **2 critique(s)**, **12 majeur(s)**, **15 mineur(s)** |

### Liste des constats

| ID | Sévérité | Constat | Effort de correction (estimé) |
|---|---|---|---|
| INV-01 | critique | L'ancien hébergement free.fr sert toujours une copie complète du site | faible |
| INV-03 | critique | Contenus essentiels enfermés dans des images (conférences, articles, couvertures) | élevé |
| INV-02 | majeur | Contenus présents en juin et disparus du site vivant, ou jamais publiés | faible |
| INV-04 | majeur | Texte alternatif des images quasi systématiquement inutilisable | moyen |
| INV-05 | majeur | Même titre H1 sur 528 comptes rendus et sur quasiment toutes les pages | faible |
| INV-06 | majeur | Textes provisoires publiés : « à venir », « à paraître », « xxx » | faible |
| INV-07 | majeur | Pages de compte rendu sans signature ou sans date de publication | moyen |
| INV-08 | majeur | Liens externes morts ou détournés | moyen |
| INV-09 | majeur | Liens d'affiliation Amazon omniprésents, dont une soixantaine malformés, sans mention d'affiliation | moyen |
| INV-10 | majeur | Poids des images : 126 Mo, formats mal choisis, faux fichiers `.webp` | moyen |
| INV-11 | majeur | Couvertures de basse définition et vignettes déformées | moyen |
| INV-12 | majeur | Recherche : index codé en dur, trois liens morts, rien sans JavaScript | faible |
| INV-13 | majeur | Parcours de classement par sujet et par titre supprimés | moyen |
| INV-14 | majeur | Aucune page légale, aucun réseau social, contact réduit à une adresse en clair | faible |
| INV-15 | mineur | Chiffres de la page « Qui suis-je ? » exacts mais figés à la main, formulation datée | faible |
| INV-16 | mineur | Fiches livres : formulations datées, titres incohérents, liens commerciaux morts | faible |
| INV-17 | mineur | Typographie française irrégulière | faible |
| INV-18 | mineur | Coquilles et orthographe | moyen |
| INV-19 | mineur | Métadonnées SEO génériques ou erronées | faible |
| INV-20 | mineur | Pages héritées de l'ancienne structure | moyen |
| INV-21 | mineur | Index des comptes rendus : doublons voulus, entrées sans page, liens hétérogènes | moyen |
| INV-22 | mineur | Conférences : lien avec APALA et disponibilité non exprimés, noms incohérents | moyen |
| INV-23 | mineur | Images : noms de fichiers et dossiers fragiles | faible |
| INV-24 | mineur | Page « liste des publications » : troisième source de vérité, hors menu | faible |
| INV-25 | mineur | Annexes : contenu rare à conserver, liens obsolètes | faible |
| INV-26 | mineur | Dépendance à `*.free.fr` et à `pourlascience.fr` | faible |
| INV-27 | mineur | Articles : 165 entrées en 7 rubriques, 114 liens externes sans copie | moyen |
| INV-28 | mineur | Accueil : bonne base de contenu, entrées peu informatives | faible |
| INV-29 | mineur | Compte rendu : structure plate, métadonnées bibliographiques non structurées | moyen |

## Annexe A — Liens externes en 404

| URL | Statut (2e essai, UA navigateur) | Page(s) source |
|---|---|---|
| `http://one-voice.fr/fr/agir-ensemble/notre-magazine.html` | 404 | `articles.html` |
| `http://thomas.lepeltier.free.fr/histoire-philosophie-sciences.html` | 404 | `articles.html` |
| `http://www.amazon.fr/gp/redirect.html?ie=UTF8&location=http%3A%2F%2Fwww.amazon.fr%2Fs%3Fie%3DU…` | 404 | `cr/avezou-sully-histoire-mythe-politique.html` |
| `http://www.aube.lu/web3/pages/1024/frameset.html` | 404 | `creationnisme-est-il-scientifique.html` |
| `http://www.brepols.net/publishers/periodicals.htm#ARIHS` | 404 | `liste-des-publications.html` |
| `http://www.cieletespace.fr/node/8899` | 404 | `autre-cosmos/debats.html` |
| `http://www.editurarosetti.ro/magazin/index.php?carte=46` | 404 | `darwin-heretique.html` |
| `http://www.fondation-droit-animal.org/menu.htm` | 404 | `revolution-vegetarienne.html` |
| `http://www.lavillebrule.com/fr/le_big_bang_n_est_pas_une_theorie_comme_les_autres` | 404 | `autre-cosmos-cosmologies-alternatives.html` |
| `http://www.philomag.com/fiche-ancien-numero.php?id=27` | 404 | `articles.html`, `liste-des-publications.html` |
| `http://www.sps-philoscience.org/activites/publication.php?id=4` | 404 | `livres.html` |
| `http://www.unmondevegan.com/militantisme-politique-et-droits-des-animaux-droits-des-animaux,fr…` | 404 | `cr/josse-militantisme-politique-droits-des-animaux.html` |
| `https://boutique.l214.com/librairie/livres/200-les-animaux-en-islam` | 404 | `cr/masri-animaux-en-islam.html` |
| `https://materiologiques.com/fr/modelisations-simulations-systemes-complexes-2425-5661/372-quan…` | 404 | `cr/genin-quand-la-nature-s-effondre-comprendre-les-transitions-abruptes-dans-les-ecosystemes.html` |
| `https://www.editionssommetoute.com/Livre/vegaux-vers-un-veganisme-intersectionnel` | 404 | `liste-des-publications.html` |
| `https://www.franceculture.fr/emissions/la-methode-scientifique/big-bang-ca-tangue.html` | 404 | `conferences.html` |
| `https://www.placedeslibraires.fr/ebook/9780399590672-survival-of-the-friendliest-brian-hare-va…` | 404 (redirige vers la recherche du site) | `cr/hare-woods-survival-of-the-friendliest.html` |
| `https://www.placedeslibraires.fr/ebook/9780807010884-natural-alan-levinovitz/` | 404 (redirige vers la recherche du site) | `cr/levinovitz-natural-the-seductive-myth-of-nature-s-goodness.html` |
| `https://www.placedeslibraires.fr/ebook/9781101870914-the-goodness-paradox-richard-wrangham/` | 404 (redirige vers la recherche du site) | `cr/wrangham-the-goodness-paradox.html` |
| `https://www.placedeslibraires.fr/ebook/9781472142948-empty-planet-darrell-bricker-john-ibbitso…` | 404 (redirige vers la recherche du site) | `cr/bricker-ibbitson-empty-planet-the-shock-of-global-population-decline.html` |
| `https://www.placedeslibraires.fr/ebook/9781472956736-life-changing-helen-pilcher/` | 404 (redirige vers la recherche du site) | `cr/pilcher-life-changing-how-humans-are-altering-life-on-earth.html` |
| `https://www.placedeslibraires.fr/ebook/9781473545335-how-to-hide-an-empire-daniel-immerwahr/` | 404 (redirige vers la recherche du site) | `cr/immerwahr-how-to-hide-an-empire-history-of-the-united-states.html` |
| `https://www.placedeslibraires.fr/ebook/9782100799718-la-revolution-inachevee-d-einstein-lee-sm…` | 404 (redirige vers la recherche du site) | `cr/smolin-einstein-s-unfinished-revolution.html` |
| `https://www.placedeslibraires.fr/livre/9780241454404-how-the-world-really-works-how-science-ca…` | 404 (redirige vers la recherche du site) | `cr/smil-how-the-world-really-works.html` |
| `https://www.placedeslibraires.fr/livre/9781846046018-galileo-s-error-foundations-for-a-new-sci…` | 404 (redirige vers la recherche du site) | `cr/goff-galileo-s-error-new-science-of-consciousness.html` |
| `https://www.puf.com/content/Faut-il_sauver_lours_blanc` | 404 | `faut-il-sauver-ours-blanc-transformation-nature.html` |
| `https://www.puf.com/content/La_pens%C3%A9e_v%C3%A9gane` | 404 | `articles.html`, `liste-des-publications.html`, `livres.html` |
| `https://www.puf.com/content/Lunivers_existe-t-il` | 404 | `univers-existe-t-il.html` |
| `https://www.uqar.ca/recherche/la-recherche-a-l-uqar/unites-de-recherche/ethos-equipe-de-recher…` | 404 | `articles.html`, `liste-des-publications.html` |
| `https://www.youtube.com/@actionecologie-lecologieal8799/streams` | 404 | `conferences.html` |

## Annexe B — Autres liens externes en défaut

| URL | Problème | Page(s) source |
|---|---|---|
| `http://animauxbonheur.com/` | domaine introuvable (DNS) | `articles.html`, `liste-des-publications.html` |
| `http://www.gesnet.net/philo/` | domaine introuvable (DNS) | `annexes/revue-de-livres-commentaires.html` |
| `http://www.revolutionsanimales-lelivre.com` | domaine introuvable (DNS) | `liste-des-publications.html` |
| `http://www.revolutionsanimales-lelivre.com/` | domaine introuvable (DNS) | `articles.html` |
| `http://www.thinkovery.com/` | domaine introuvable (DNS) | `articles.html` |
| `https://jicanimale.fr/jica2023.html` | domaine introuvable (DNS) | `conferences.html` |
| `http://www.editionsduseuil.fr` | délai dépassé / erreur TLS | `darwin-heretique.html` |
| `http://www.editionsduseuil.fr/` | délai dépassé / erreur TLS | `univers-paralleles.html` |
| `https://www.lechomagazine.uk/` | délai dépassé / erreur TLS | `articles.html`, `liste-des-publications.html` |
| `https://www.odakitap.com/evrenin-sakli-yuzu-thomas-lepeltier/9789750841545` | délai dépassé / erreur TLS | `liste-des-publications.html` |
| `https://www.odakitap.com/paralel-evrenler-thomas-lepeltier/9786058688872` | délai dépassé / erreur TLS | `liste-des-publications.html` |
| `http://philsci-archive.pitt.edu/` | certificat TLS invalide ou expiré | `annexes/creationnisme/creationnisme-est-il-scientifique.html` |
| `http://versusmagazine.co/01/` | **domaine repris par un site tiers** (redirige vers `fares.globalflightcheck.com`) + certificat expiré | `cr/mcwilliams-modern-savage.html` |
| `http://www.leseditionsdeminuit.eu/f/index.php?sp=liv&livre_id=2349` | certificat TLS invalide ou expiré | `articles.html`, `liste-des-publications.html` |
| `http://www.pourlascience.com` | certificat TLS invalide ou expiré | `liste-des-publications.html` |
| `http://www.pourlascience.fr/` | boucle de redirections (SSO) sans cookies | `cr/ait-touati-contes-de-la-lune.html`, `cr/barrau-parrochia-forme-origine-univers-regards-philosophiques-cosmologie.html`, `cr/bojowald-univers-en-rebond.html` (+21) |
| `http://www.versusmagazine.co/articles/la-vie-d-un-chien-vaut-elle-celle-d-un-etre-humain` | **domaine repris par un site tiers** (redirige vers `fares.globalflightcheck.com`) + certificat expiré | `cr/bernstein-moral-equality-of-humans-and-animals.html` |
| `http://ad.zanox.com/ppc/?19611734C1888638571T&ULP=[[http://livre.fnac.com/a2008234/Thomas-Lepe…` | lien Fnac via régie zanox (fermée) et mal formé (`[[…]]`) | `darwin-heretique.html` |
| `http://ad.zanox.com/ppc/?19611734C1888638571T&ULP=[[http://livre.fnac.com/a2747775/Thomas-Lepe…` | lien Fnac via régie zanox (fermée) et mal formé (`[[…]]`) | `creationnisme-est-il-scientifique.html` |
| `http://ad.zanox.com/ppc/?19611734C1888638571T&ULP=[[http://livre.fnac.com/a2799822/Thomas-Lepe…` | lien Fnac via régie zanox (fermée) et mal formé (`[[…]]`) | `univers-paralleles.html` |
| `http://ad.zanox.com/ppc/?19611734C1888638571T&ULP=[[http://livre.fnac.com/a3127859/Pascal-Char…` | lien Fnac via régie zanox (fermée) et mal formé (`[[…]]`) | `cr/charbonnat-quand-sciences-dialoguent-avec-metaphysique.html` |
| `http://ad.zanox.com/ppc/?19611734C1888638571T&ULP=[[http://livre.fnac.com/a3677877/Bernadette-…` | lien Fnac via régie zanox (fermée) et mal formé (`[[…]]`) | `cr/bensaude-vincent-fabriquer-la-vie.html` |
| `http://perso.easynet.fr/~lalloz ` | URL mal formée | `annexes/revue-de-livres-commentaires.html` |

## Annexe C — Domaines répondant 403 ou 402 (non vérifiables automatiquement)

| Domaine | URL |
|---|---:|
| `www.scienceshumaines.com` | 54 |
| `www.lepoint.fr` | 31 |
| `editions.scienceshumaines.com` | 12 |
| `www.wook.pt` | 2 |
| `www.liberation.fr` | 2 |
| `www.lemonde.fr` | 1 |
| `jhupbooks.press.jhu.edu` | 1 |
| `www.lesechos.fr` | 1 |
| `www.cnews.fr` | 1 |

## Annexe D — Coquilles détectées dans les comptes rendus

| Forme relevée | Correction | Premier fichier |
|---|---|---|
| succintement | succinctement | `cr/thiesse-creation-identites-nationales.html` |
| suprimé | supprimé | `cr/rubenstein-le-jour-ou-jesus-devint-dieu-arius-divinite-du-christ.html` |
| interprèter | interpréter | `cr/eisenstaedt-lehoucq-einstein-relativite-generale-univers-a-t-il-une-forme.html` |
| désarmorcer | désamorcer | `cr/doyle.html` |
| leser | léser | `cr/roberts-the-existence-puzzles.html` |
| durkhemiens | durkheimiens | `cr/mucchielli-mythes-et-histoire-des-sciences-humaines.html` |
| fontionnement | fonctionnement | `cr/delahaye-Intelligence-calcul-godel-ordinateurs-quantiques.html` |
| insuffissante | insuffisante | `cr/pourprix-la-fecondite-des-erreurs.html` |
| résonnance | résonance | `cr/afeissa-manifeste-pour-une-ecologie-de-la-difference.html` |
| definies | définies | `cr/bouveresse-rosat-philosophies-de-la-perception.html` |
| procèderaient | procéderaient | `cr/levinovitz-natural-the-seductive-myth-of-nature-s-goodness.html` |
| rationnalisée | rationalisée | `cr/philips-rozworski-people-s-republic-of-walmart.html` |
| fondamantales | fondamentales | `cr/hossenfelder-lost-in-math-how-beauty-leads-physics-astray.html` |
| renouvellée | renouvelée | `cr/darnton-pour-les-lumieres-defense-illustration-methode.html` |
| réafirme | réaffirme | `cr/darnton-pour-les-lumieres-defense-illustration-methode.html` |
| justifer | justifier | `cr/senac-comme-si-nous-etions-des-animaux.html` |
| shéma | schéma | `cr/ryan-jetha-au-commencement-etait-le-sexe.html` |
| premiere | première | `cr/simon-vercingetorix-ideologie-francaise.html` |
| siecle | siècle | `cr/duhem-mixte.html` |
| complétement | complètement | `cr/debove-pourquoi-notre-cerveau-a-invente-le-bien-et-le-mal.html` |
| intelligibité | intelligibilité | `cr/duhem-meca.html` |
| succèda | succéda | `cr/halm.html` |
| régénerescence | régénérescence | `cr/avezou-sully-histoire-mythe-politique.html` |
| entraînaît / entrainaît | entraînait | `cr/torres-human-extinction.html` (+ `cr/galor-le-voyage-de-l-humanite-aux-origines-de-la-richesse-et-des-inegalites.html`) |
| placébo | placebo | `cr/wiseman-myth-moral-brain.html` |
| icones | icônes | `cr/aboudrar-comment-voile-devenu-musulman.html` |
| piqures | piqûres | `cr/winegard-the-mosquito-deadliest-predator.html` |
| couteuses | coûteuses | `cr/davies-cracked-psychiatry.html` |
| bxgzgktl | (chaîne parasite à supprimer) | `cr/steinberger-the-problem-with-god.html` |
| suffisa / soci | mots tronqués | `cr/barberousse-kistler-ludwig-philosophie-sciences.html` (+ `cr/garcia-genieys-invention-du-pays-cathare.html`) |

Formes liées à l'orthographe rectifiée (à harmoniser plutôt qu'à corriger) : « entrainé », « entrainer », « entraine », « entrainant », « chaine », « déchainement », « reconnait », « surcroit », « maitrisant », « accroitre », « brulant », « règlementer », « assoir ».
