// En production, l'URL canonique est imposée : sitemap, canonicals, flux et robots.txt en dépendent.
const productionUrl = 'https://www.thomaslepeltier.fr';
export const url = (
  process.env.URL || (process.env.ELEVENTY_ENV === 'production' ? productionUrl : 'http://localhost:8080')
).replace(/\/$/, '');
// Extract domain from `url`
export const domain = new URL(url).hostname;
export const siteName = 'Thomas Lepeltier';
export const siteDescription =
  'Docteur en astrophysique, historien et philosophe des sciences, Thomas Lepeltier présente ses livres, articles et plus de 500 chroniques d`essais.';
export const siteType = 'Person'; // schema
export const locale = 'fr_FR';
export const lang = 'fr';
export const skipContent = 'Passer au contenu';
// for the site content author, used in <head> meta and post h-card microformat
export const author = {
  name: 'Thomas Lepeltier', // i.e. Lene Saile - page / blog author's name. Must be set.
  avatar: '/icon-512x512.png', // path to the author's avatar. In this case just using a favicon.
  me: [
    // loop over verified rel=me profiles in the HTML <head>
    'https://www.instagram.com/thomas.lepeltier/'
  ]
};
// for the site developer, used for footer credits and humans.txt info
export const creator = {
  name: 'Guillaume RENOULT', // i.e. Lene Saile - creator's (developer) name.
  email: 'guillaume.renoult@mail-esd.com',
  website: 'https://portfolio-guillaume-renoult.vercel.app/'
};
export const pathToSvgLogo = 'src/assets/svg/misc/logo.svg'; // used for favicon generation
export const themeColor = '#c8104f'; // used in manifest, for example primary color value
export const themeLight = '#f4f5f4'; // used for meta tag theme-color, if light colors are prefered. best use value set for light bg
export const themeDark = '#0d0f0e'; // used for meta tag theme-color, if dark colors are prefered. best use value set for dark bg
export const opengraph_default = '/assets/images/template/opengraph-default.jpg'; // fallback/default meta image
export const opengraph_default_alt =
  "Thomas Lepeltier, docteur en astrophysique, philosophe et historien des sciences. Livres, articles et plus de 500 chroniques d'essais.";
export const blog = {
  // RSS feed
  name: 'Chroniques',
  description:
    "Persuadés que trop d'essais ne trouvent pas le nombre de lecteurs qu'ils méritent, nous publions des chroniques pour les faire connaître à un plus large public.",
  // feed links are looped over in the head. You may add more to the array.
  feedLinks: [
    {
      title: 'Atom Feed',
      url: '/feed.xml',
      type: 'application/atom+xml'
    },
    {
      title: 'JSON Feed',
      url: '/feed.json',
      type: 'application/json'
    }
  ],
  // Tags
  tagSingle: 'Rubrique',
  tagPlural: 'Rubriques',
  tagMore: 'Autres rubriques',
  // pagination
  paginationLabel: 'Blog',
  paginationPage: 'Page',
  paginationPrevious: 'Précédent',
  paginationNext: 'Prochain',
  paginationNumbers: true
};
export const details = {
  aria: 'contrôle des sections',
  expand: 'tout étendre',
  collapse: 'tout resserrer'
};
export const dialog = {
  close: 'Fermer',
  next: 'Prochain',
  previous: 'Précédent'
};
export const navigation = {
  navLabel: 'Menu',
  ariaTop: 'Main',
  ariaBottom: 'Complementaire',
  ariaPlatforms: 'Plateformes',
  drawerNav: true,
  subMenu: true
};
export const themeSwitch = {
  title: 'Theme',
  light: 'light',
  dark: 'dark'
};
export const tests = {
  pa11y: {
    // keep customPaths empty if you want to test all pages
    customPaths: ['/', '/bio/', '/livres/', '/chroniques/', '/interventions/', '/recherche/'],
    globalIgnore: []
  }
};
export const viewRepo = {
  // this is for the view/edit on github link. The value in the package.json will be pulled in.
  allow: true,
  infoText: 'Voir cette page sur GitHub'
};
// Désactivé : gadget du modèle de départ (confettis chargés depuis un CDN tiers quand on tape « eleventy »)
export const easteregg = false;
