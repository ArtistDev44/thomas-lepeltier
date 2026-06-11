  const manager = window.PagefindComponents.getInstanceManager();
  const instance = manager.getInstance('default');

  // Filtre persistant appliqué une seule fois
  instance.triggerFilter('section', ['Comptes-rendus']);

  instance.triggerLoad();
