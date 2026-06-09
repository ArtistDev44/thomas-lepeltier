export default {
  top: [
    {
      text: 'Accueil',
      url: '/'
    },
    {
      text: 'Bio',
      url: '/bio/'
    },
    {
      text: 'Livres',
      url: '/livres/',
      submenu: [
        {
          text: 'Mes livres',
          url: '/livres/#mes-livres'
        },
        {
          text: 'Ouvrages dirigés',
          url: '/livres/#ouvrages-diriges'
        },
        {
          text: 'Contributions',
          url: '/livres/#contributions'
        }
      ]
    },
    {
      text: 'Comptes-rendus',
      url: '/comptes-rendus/'
    },
    {
      text: 'Articles',
      url: '/articles/'
    },
    {
      text: 'Liens',
      url: '/liens/'
    },
    {
      text: 'Contact',
      url: '/contact/'
    }
  ],
  bottom: [
    {
      text: 'Style guide',
      url: '/styleguide/'
    },
    {
      text: 'Imprint',
      url: '/imprint/'
    },
    {
      text: 'Privacy',
      url: '/privacy/'
    },
    {
      text: 'Accessibility',
      url: '/accessibility/'
    }
  ]
};
