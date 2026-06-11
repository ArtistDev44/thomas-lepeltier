export const url = process.env.URL || 'http://localhost:8080';
// Extract domain from `url`
export const domain = new URL(url).hostname;
export const siteName = 'Thomas Lepeltier';
export const siteDescription = 'Docteur en astrophysique, historien et philosophe des sciences, Thomas Lepeltier présente ses livres, articles et plus de 500 comptes rendus d`essais.';
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
  website: 'https://portfolio-guillaume-renoult.vercel.app/',
};
export const pathToSvgLogo = 'src/assets/svg/misc/logo.svg'; // used for favicon generation
export const themeColor = '#dd4462'; // used in manifest, for example primary color value
export const themeLight = '#f8f8f8'; // used for meta tag theme-color, if light colors are prefered. best use value set for light bg
export const themeDark = '#2e2e2e'; // used for meta tag theme-color, if dark colors are prefered. best use value set for dark bg
export const opengraph_default = '/assets/images/template/opengraph-default.jpg'; // fallback/default meta image
export const opengraph_default_alt =
  "Thomas Lepeltier, docteur en astrophysique, philosophe et historien des sciences. Livres, articles et plus de 500 comptes rendus d'essais.";
export const blog = {
  // RSS feed
  name: 'Comptes-rendus',
  description: 'Persuadés que trop d\'essais ne trouvent pas le nombre de lecteurs qu\'ils méritent, nous publions des comptes rendus pour les faire connaître à un plus large public.',
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
  tagSingle: 'Tag',
  tagPlural: 'Tags',
  tagMore: 'Plus de tags:',
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
  drawerNav: false,
  subMenu: true
};
export const themeSwitch = {
  title: 'Theme',
  light: 'light',
  dark: 'dark'
};
export const greenweb = {
  // https://carbontxt.org/
  disclosures: [
    {
      docType: 'sustainability-page',
      url: `${url}/sustainability/`,
      domain: domain
    }
  ],
  services: [{domain: 'netlify.com', serviceType: 'cdn'}]
};
export const tests = {
  pa11y: {
    // keep customPaths empty if you want to test all pages
    customPaths: ['/', '/about/', '/blog/', '/styleguide/'],
    globalIgnore: []
  }
};
export const viewRepo = {
  // this is for the view/edit on github link. The value in the package.json will be pulled in.
  allow: true,
  infoText: 'Voir cette page sur GitHub'
};
export const easteregg = true;
