(async () => {
  await customElements.whenDefined('pagefind-results');
  const n = window.PagefindComponents.getInstanceManager();
  const e = n.getInstance('default');
  e.triggerFilter('section', ['Comptes-rendus']);
  e.triggerLoad();
})();
