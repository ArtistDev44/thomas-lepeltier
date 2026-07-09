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
      text: 'Articles',
      url: '/articles/'
    },
    {
      text: 'Chroniques',
      url: '/chroniques/'
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
      text: 'Légal',
      url: '/legal/'
    },
    {
      text: 'Confidentialité',
      url: '/confidentialite/'
    }
  ]
};
