/**
 * Filtres des pages-listes (articles, chroniques).
 *
 * La liste est rendue côté serveur : chaque <li> porte des attributs data-* (search, title, tags, year,
 * authors, source). Ce script se contente de masquer, trier et compter. La recherche s'applique toujours
 * aux éléments qui passent déjà les autres filtres : choisir un thème restreint donc la recherche à ce thème.
 */

const normalize = text =>
  String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’‘]/g, "'")
    .toLowerCase()
    .trim();

const split = value => (value ? value.split('|').filter(Boolean) : []);
const OTHER_SOURCES = '__autres';

const initListFilter = form => {
  const list = document.querySelector(form.dataset.list);
  if (!list) return;

  const noun = form.dataset.noun;
  const nouns = form.dataset.nouns;
  const pageSize = Number(form.dataset.pageSize) || 48;
  const status = document.querySelector('[data-list-status]');
  const searchInput = form.elements.q;
  const yearSelect = form.elements.annee;
  const sortSelect = form.elements.tri;
  const extra = form.querySelector('[data-lf-extra]');
  const extraKind = extra?.dataset.lfExtra;
  const chipsBox = form.querySelector('[data-lf-chips]');
  const scopeLabel = form.querySelector('[data-lf-scope]');
  const resetButton = form.querySelector('[data-lf-reset]');
  const fulltextLink = form.querySelector('[data-lf-fulltext]');

  const items = [...list.children].map((el, order) => {
    const authors = split(el.dataset.authors);
    return {
      el,
      order,
      search: normalize(el.dataset.search),
      title: normalize(el.dataset.title).replace(/^[^a-z0-9]+/, ''),
      tags: split(el.dataset.tags),
      year: el.dataset.year || '',
      source: el.dataset.source || '',
      authors,
      authorsNorm: authors.map(normalize),
      authorSort: normalize(el.dataset.sortAuthor || authors[0] || '').replace(/^[^a-z0-9]+/, '')
    };
  });
  const total = items.length;

  // Les supports cités une seule fois sont regroupés pour ne pas allonger le menu.
  if (extraKind === 'source') {
    const perSource = new Map();
    items.forEach(item => perSource.set(item.source, (perSource.get(item.source) ?? 0) + 1));
    items.forEach(item => {
      if (!item.source || perSource.get(item.source) < 2) item.source = OTHER_SOURCES;
    });
  }

  const state = {q: '', tag: '', extra: '', year: '', sort: 'recent'};
  let limit = pageSize;

  const matches = (item, s) => {
    if (s.q && !normalize(s.q).split(/\s+/).every(word => item.search.includes(word))) return false;
    if (s.tag && !item.tags.includes(s.tag)) return false;
    if (s.year && item.year !== s.year) return false;
    if (s.extra) {
      if (extraKind === 'author') {
        const wanted = normalize(s.extra);
        if (!item.authorsNorm.some(author => author.includes(wanted))) return false;
      } else if (item.source !== s.extra) return false;
    }
    return true;
  };
  const count = s => items.reduce((n, item) => n + (matches(item, s) ? 1 : 0), 0);

  // --- Construction des choix à partir des données de la liste -------------------------------------------------
  const tagTotals = new Map();
  items.forEach(item => item.tags.forEach(tag => tagTotals.set(tag, (tagTotals.get(tag) ?? 0) + 1)));
  const chips = [...tagTotals.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'fr'))
    .map(([tag]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'tag list-filter__chip';
      button.setAttribute('aria-pressed', 'false');
      button.dataset.tag = tag;
      button.append(tag + ' ');
      const badge = document.createElement('span');
      badge.className = 'list-filter__count';
      button.append(badge);
      chipsBox?.append(button);
      return {tag, button, badge};
    });

  const years = [...new Set(items.map(item => item.year).filter(Boolean))].sort((a, b) => b - a);
  const yearOptions = years.map(year => {
    const option = new Option(year, year);
    yearSelect?.append(option);
    return {value: year, option};
  });

  let sourceOptions = [];
  if (extraKind === 'source') {
    const names = [...new Set(items.map(item => item.source))].filter(name => name !== OTHER_SOURCES);
    names.sort((a, b) => a.localeCompare(b, 'fr'));
    if (items.some(item => item.source === OTHER_SOURCES)) names.push(OTHER_SOURCES);
    sourceOptions = names.map(name => {
      const option = new Option(name === OTHER_SOURCES ? 'Autres publications' : name, name);
      extra.append(option);
      return {value: name, option};
    });
  }
  if (extraKind === 'author') {
    const datalist = document.getElementById(extra.getAttribute('list'));
    const names = [...new Set(items.flatMap(item => item.authors))].sort((a, b) => a.localeCompare(b, 'fr'));
    names.forEach(name => datalist?.append(new Option(name)));
  }

  // --- Affichage ---------------------------------------------------------------------------------------------------
  const plural = n => (n > 1 ? nouns : noun);
  const sorters = {
    recent: (a, b) => a.order - b.order,
    ancien: (a, b) => b.order - a.order,
    titre: (a, b) => a.title.localeCompare(b.title, 'fr') || a.order - b.order,
    auteur: (a, b) => a.authorSort.localeCompare(b.authorSort, 'fr') || a.order - b.order
  };

  const more = document.createElement('div');
  more.className = 'list-filter__more';
  more.hidden = true;
  const moreButton = document.createElement('button');
  moreButton.type = 'button';
  moreButton.className = 'button';
  moreButton.dataset.ghostButton = '';
  more.append(moreButton);
  const empty = document.createElement('p');
  empty.className = 'list-filter__empty';
  empty.hidden = true;
  empty.append(`Aucune ${noun} ne correspond à ces critères. `);
  const emptyReset = document.createElement('button');
  emptyReset.type = 'button';
  emptyReset.className = 'button';
  emptyReset.dataset.smallButton = '';
  emptyReset.dataset.ghostButton = '';
  emptyReset.textContent = 'Réinitialiser les filtres';
  empty.append(emptyReset);
  list.after(empty, more);

  let statusTimer;
  const announce = text => {
    if (!status) return;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => (status.textContent = text), 300);
  };

  let renderedOrder = 'recent'; // le HTML est déjà dans l'ordre « plus récent d'abord »
  const render = ({focusFrom} = {}) => {
    const sorted = items.filter(item => matches(item, state)).sort(sorters[state.sort] ?? sorters.recent);

    // Réordonne le DOM uniquement quand l'ordre change (le tri par défaut est l'ordre d'origine).
    const orderKey = state.sort;
    if (orderKey !== renderedOrder) {
      const fragment = document.createDocumentFragment();
      [...items].sort(sorters[state.sort] ?? sorters.recent).forEach(item => fragment.append(item.el));
      list.append(fragment);
      renderedOrder = orderKey;
    }

    const visible = new Set(sorted.slice(0, limit));
    items.forEach(item => (item.el.hidden = !visible.has(item)));

    const remaining = sorted.length - visible.size;
    more.hidden = remaining <= 0;
    const next = Math.min(remaining, pageSize);
    moreButton.textContent = `Afficher ${next} ${plural(next)} de plus`;
    empty.hidden = sorted.length > 0;

    const filtered = sorted.length !== total;
    announce(
      sorted.length === 0
        ? `Aucune ${noun} ne correspond à ces critères.`
        : filtered
          ? `${sorted.length} ${plural(sorted.length)} sur ${total}${remaining > 0 ? `, ${visible.size} affichées` : ''}.`
          : `${total} ${nouns}${remaining > 0 ? `, ${visible.size} affichées` : ''}.`
    );

    // Compteurs des choix : ce que donnerait chaque choix avec les autres filtres en vigueur.
    chips.forEach(({tag, button, badge}) => {
      const selected = state.tag === tag;
      const n = count({...state, tag});
      badge.textContent = n;
      button.setAttribute('aria-pressed', String(selected));
      button.disabled = !selected && n === 0;
    });
    yearOptions.forEach(({value, option}) => {
      const n = count({...state, year: value});
      option.textContent = `${value} (${n})`;
      option.disabled = n === 0 && state.year !== value;
    });
    sourceOptions.forEach(({value, option}) => {
      const n = count({...state, extra: value});
      option.textContent = `${value === OTHER_SOURCES ? 'Autres publications' : value} (${n})`;
      option.disabled = n === 0 && state.extra !== value;
    });

    // Libellé de la recherche : elle porte sur la sélection en cours.
    if (scopeLabel) {
      const scope = [];
      if (state.tag) scope.push(`« ${state.tag} »`);
      if (state.extra) scope.push(extraKind === 'author' ? `de ${state.extra}` : state.extra === OTHER_SOURCES ? 'des autres publications' : `dans ${state.extra}`);
      if (state.year) scope.push(`de ${state.year}`);
      const n = count({...state, q: ''});
      scopeLabel.textContent = `Rechercher parmi les ${n} ${plural(n)}${scope.length ? ' ' + scope.join(' ') : ''}`;
    }

    resetButton.hidden = !(state.q || state.tag || state.extra || state.year || state.sort !== 'recent');

    // Le lien vers la recherche plein texte reprend les mots saisis
    if (fulltextLink) {
      const url = new URL(fulltextLink.getAttribute('href'), location.origin);
      if (state.q) url.searchParams.set('q', state.q);
      else url.searchParams.delete('q');
      fulltextLink.setAttribute('href', url.pathname + url.search);
    }

    if (focusFrom) {
      const target = sorted[focusFrom]?.el.querySelector('a');
      target?.focus({preventScroll: false});
    }
  };

  // --- Adresse de la page : on peut partager ou retrouver une recherche ---------------------------------------------
  const writeUrl = () => {
    const params = new URLSearchParams();
    if (state.q) params.set('q', state.q);
    if (state.tag) params.set('theme', state.tag);
    if (state.extra) params.set(extra.name, state.extra);
    if (state.year) params.set('annee', state.year);
    if (state.sort !== 'recent') params.set('tri', state.sort);
    const query = params.toString();
    try {
      history.replaceState(null, '', location.pathname + (query ? `?${query}` : '') + location.hash);
    } catch {
      /* contexte sans historique : pas grave */
    }
  };

  const syncControls = () => {
    searchInput.value = state.q;
    if (yearSelect) yearSelect.value = state.year;
    if (sortSelect) sortSelect.value = state.sort;
    if (extra) extra.value = state.extra;
  };

  const update = () => {
    limit = pageSize;
    writeUrl();
    render();
  };

  const readUrl = () => {
    const params = new URLSearchParams(location.search);
    state.q = params.get('q') ?? '';
    const tag = params.get('theme');
    if (tag && tagTotals.has(tag)) state.tag = tag;
    const year = params.get('annee');
    if (year && years.includes(year)) state.year = year;
    const wanted = extra && params.get(extra.name);
    if (wanted && (extraKind === 'author' || sourceOptions.some(({value}) => value === wanted))) state.extra = wanted;
    const sort = params.get('tri');
    if (sort && sortSelect && [...sortSelect.options].some(option => option.value === sort)) state.sort = sort;
  };

  // --- Événements ---------------------------------------------------------------------------------------------------
  form.addEventListener('submit', event => event.preventDefault());
  searchInput.addEventListener('input', () => {
    state.q = searchInput.value;
    update();
  });
  chips.forEach(({tag, button}) =>
    button.addEventListener('click', () => {
      state.tag = state.tag === tag ? '' : tag;
      update();
    })
  );
  yearSelect?.addEventListener('change', () => {
    state.year = yearSelect.value;
    update();
  });
  sortSelect?.addEventListener('change', () => {
    state.sort = sortSelect.value;
    update();
  });
  extra?.addEventListener(extraKind === 'author' ? 'input' : 'change', () => {
    state.extra = extra.value.trim();
    update();
  });

  const reset = () => {
    Object.assign(state, {q: '', tag: '', year: '', extra: '', sort: 'recent'});
    syncControls();
    update();
    searchInput.focus();
  };
  resetButton.addEventListener('click', reset);
  emptyReset.addEventListener('click', reset);

  moreButton.addEventListener('click', () => {
    const firstNew = limit;
    limit += pageSize;
    render({focusFrom: firstNew});
  });

  // --- Démarrage ----------------------------------------------------------------------------------------------------
  readUrl();
  syncControls();
  render();
  document.querySelectorAll('[data-lf-fallback]').forEach(el => (el.hidden = true));
  form.hidden = false;
};

// Ce script est inséré dans le <head> : on attend que la liste soit dans le DOM.
// Quoi qu'il arrive, la liste cesse d'être tronquée par le CSS (`data-lf-pending`) une fois le script passé.
const start = () =>
  document.querySelectorAll('[data-list-filter]').forEach(form => {
    try {
      initListFilter(form);
    } finally {
      document.querySelector(form.dataset.list)?.removeAttribute('data-lf-pending');
    }
  });
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();
