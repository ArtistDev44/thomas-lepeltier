/**
 * Page /recherche/ : recherche plein texte (index Pagefind) avec filtres par type de contenu et par catégorie.
 *
 * L'index est généré au build (`npm run build`) et, en dev, par `src/_config/events/pagefind-dev.js`.
 * Chaque changement de saisie ou de filtre relance trois recherches : les résultats, puis deux recherches
 * qui servent uniquement à compter ce que donnerait chaque type (resp. chaque catégorie) si on le choisissait.
 */

const PAGEFIND_URL = '/pagefind/pagefind.js';
const PAGE_SIZE = 20;
const RETRY_DELAY = 3000;
const MAX_ATTEMPTS = 8;

const TYPE_ORDER = ['Livres', 'Articles', 'Chroniques', 'Annexes', 'Pages'];
const TYPE_LABELS = {Pages: 'Pages du site'};
const TYPE_SINGULAR = {Livres: 'Livre', Articles: 'Article', Chroniques: 'Chronique', Annexes: 'Annexe', Pages: 'Page'};

const plural = (n, one, many) => `${n.toLocaleString('fr-FR')} ${n > 1 ? many : one}`;
const escapeHtml = text => text.replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c]);

const initSearch = form => {
  const input = form.elements.q;
  const typesBox = form.querySelector('[data-sf-types]');
  const catsBox = form.querySelector('[data-sf-cats]');
  const resetButton = form.querySelector('[data-sf-reset]');
  const status = document.querySelector('[data-sf-status]');
  const list = document.querySelector('[data-sf-results]');
  const moreBox = document.querySelector('[data-sf-more]');
  const moreButton = moreBox.querySelector('button');

  const state = {q: '', type: '', cats: new Set()};
  let pagefind;
  let totals = {section: {}, categorie: {}};
  let typeChips = new Map();
  let catChips = new Map();
  let current = null; // résultats de la recherche en cours, chargés par pages
  let shown = 0;
  let token = 0;
  let timer;

  const isBrowsing = () => !state.q && !state.type && !state.cats.size;
  const filtersFor = ({type, cats}) => {
    const filters = {};
    if (type) filters.section = type;
    if (cats.size) filters.categorie = {any: [...cats]};
    return filters;
  };

  // --- URL ---------------------------------------------------------------------------------------------------
  const readUrl = () => {
    const params = new URLSearchParams(location.search);
    state.q = (params.get('q') ?? '').trim();
    state.type = params.get('type') ?? '';
    state.cats = new Set(params.getAll('cat'));
    input.value = state.q;
  };
  const writeUrl = () => {
    const params = new URLSearchParams();
    if (state.q) params.set('q', state.q);
    if (state.type) params.set('type', state.type);
    state.cats.forEach(cat => params.append('cat', cat));
    const query = params.toString();
    history.replaceState(null, '', location.pathname + (query ? `?${query}` : ''));
  };

  // --- Filtres -----------------------------------------------------------------------------------------------
  const makeChip = (box, kind, value, label) => {
    const wrapper = document.createElement('label');
    wrapper.className = 'search-chip';
    const field = document.createElement('input');
    field.type = kind;
    field.name = kind === 'radio' ? 'type' : 'cat';
    field.value = value;
    const text = document.createElement('span');
    text.append(label + ' ');
    const count = document.createElement('span');
    count.className = 'search-chip__count';
    text.append(count);
    wrapper.append(field, text);
    box.append(wrapper);
    return {field, count};
  };

  const buildFilters = () => {
    const types = Object.keys(totals.section).sort((a, b) => TYPE_ORDER.indexOf(a) - TYPE_ORDER.indexOf(b));
    typeChips.set('', makeChip(typesBox, 'radio', '', 'Tous'));
    types.forEach(type => typeChips.set(type, makeChip(typesBox, 'radio', type, TYPE_LABELS[type] ?? type)));

    const cats = Object.entries(totals.categorie).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'fr'));
    cats.forEach(([cat]) => catChips.set(cat, makeChip(catsBox, 'checkbox', cat, cat)));
    // Une catégorie inconnue dans l'URL est ignorée plutôt que de ne rien renvoyer.
    state.cats = new Set([...state.cats].filter(cat => catChips.has(cat)));
    if (state.type && !typeChips.has(state.type)) state.type = '';
  };

  const syncControls = counts => {
    typeChips.forEach(({field, count}, type) => {
      const n = counts.types.get(type) ?? 0;
      field.checked = state.type === type;
      count.textContent = n.toLocaleString('fr-FR');
      field.disabled = n === 0 && state.type !== type;
    });
    catChips.forEach(({field, count}, cat) => {
      const n = counts.cats.get(cat) ?? 0;
      field.checked = state.cats.has(cat);
      count.textContent = n.toLocaleString('fr-FR');
      field.disabled = n === 0 && !state.cats.has(cat);
    });
    resetButton.hidden = isBrowsing();
  };

  // --- Résultats ---------------------------------------------------------------------------------------------
  const describe = total => {
    const parts = [plural(total, 'résultat', 'résultats')];
    if (state.q) parts[0] += ` pour « ${state.q} »`;
    const scope = [];
    if (state.type) scope.push(`dans ${(TYPE_LABELS[state.type] ?? state.type).toLowerCase()}`);
    if (state.cats.size) scope.push(`${state.cats.size > 1 ? 'catégories' : 'catégorie'} ${[...state.cats].join(' ou ')}`);
    return parts[0] + (scope.length ? `, ${scope.join(', ')}` : '') + '.';
  };

  const renderResult = data => {
    const type = data.filters?.section?.[0] ?? '';
    const cats = data.filters?.categorie ?? [];
    const meta = [data.meta?.auteur, data.meta?.annee].filter(Boolean).join(' · ');
    const item = document.createElement('li');
    item.className = 'search-result';
    item.innerHTML = `
      <p class="search-result__type">${escapeHtml(TYPE_SINGULAR[type] ?? type)}${meta ? ` · ${escapeHtml(meta)}` : ''}</p>
      <h3 class="search-result__title"><a href="${escapeHtml(data.url)}">${escapeHtml(data.meta?.title ?? data.url)}</a></h3>
      <p class="search-result__excerpt">${data.excerpt}</p>
      ${cats.length ? `<p class="search-result__tags">${cats.map(cat => `<span class="tag">${escapeHtml(cat)}</span>`).join('')}</p>` : ''}`;
    return item;
  };

  const showMore = async ({focusFirst = false} = {}) => {
    if (!current) return;
    const mine = token;
    const batch = current.slice(shown, shown + PAGE_SIZE);
    moreButton.disabled = true;
    const loaded = await Promise.all(batch.map(result => result.data()));
    if (mine !== token) return;
    const items = loaded.map(renderResult);
    list.append(...items);
    shown += batch.length;
    moreBox.hidden = shown >= current.length;
    moreButton.disabled = false;
    moreButton.textContent = `Afficher plus de résultats (${(current.length - shown).toLocaleString('fr-FR')} restants)`;
    if (focusFirst) items[0]?.querySelector('a')?.focus();
  };

  const emptyState = html => {
    list.replaceChildren();
    moreBox.hidden = true;
    current = null;
    status.innerHTML = html;
  };

  const run = async () => {
    const mine = ++token;
    const noType = {type: '', cats: state.cats};
    const noCat = {type: state.type, cats: new Set()};
    const term = state.q || null;

    const [main, typeSearch, catSearch] = await Promise.all([
      pagefind.search(term, {
        filters: filtersFor(state),
        ...(state.q ? {} : {sort: {annee: 'desc'}})
      }),
      pagefind.search(term, {filters: filtersFor(noType)}),
      pagefind.search(term, {filters: filtersFor(noCat)})
    ]);
    if (mine !== token) return;

    const types = new Map(Object.entries(typeSearch.filters.section ?? {}));
    types.set('', typeSearch.results.length);
    syncControls({types, cats: new Map(Object.entries(catSearch.filters.categorie ?? {}))});
    writeUrl();

    list.replaceChildren();
    list.setAttribute('aria-busy', 'false');

    if (isBrowsing()) {
      current = null;
      moreBox.hidden = true;
      status.textContent = `${plural(main.results.length, 'page indexée', 'pages indexées')}. Saisissez un mot ou choisissez un type de contenu ou une catégorie.`;
      return;
    }
    if (!main.results.length) {
      emptyState('Aucun résultat. Essayez un autre mot, une orthographe voisine, ou retirez un filtre.');
      return;
    }

    current = main.results;
    shown = 0;
    status.textContent = describe(current.length);
    await showMore();
  };

  const schedule = (delay = 0) => {
    clearTimeout(timer);
    list.setAttribute('aria-busy', 'true');
    timer = setTimeout(() => run().catch(fail), delay);
  };

  const fail = error => {
    console.error('[recherche]', error);
    emptyState('Le moteur de recherche a rencontré un problème. Rechargez la page, ou parcourez les listes de <a href="/livres/">livres</a>, <a href="/articles/">articles</a> et <a href="/chroniques/">chroniques</a>.');
  };

  // --- Événements --------------------------------------------------------------------------------------------
  input.addEventListener('input', () => {
    state.q = input.value.trim();
    schedule(180);
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    state.q = input.value.trim();
    schedule();
  });
  form.addEventListener('change', event => {
    const field = event.target;
    if (field.name === 'type') state.type = field.value;
    else if (field.name === 'cat') field.checked ? state.cats.add(field.value) : state.cats.delete(field.value);
    else return;
    schedule();
  });
  resetButton.addEventListener('click', () => {
    state.q = '';
    state.type = '';
    state.cats.clear();
    input.value = '';
    input.focus();
    schedule();
  });
  moreButton.addEventListener('click', () => showMore({focusFirst: true}));

  // --- Démarrage ---------------------------------------------------------------------------------------------
  // En dev, l'index est construit en arrière-plan juste après le premier rendu : on réessaie quelques fois
  // (l'adresse change à chaque essai, car le navigateur garde en mémoire l'échec d'un import).
  const load = async attempt => {
    try {
      // 1er essai : l'adresse exacte du <link rel="modulepreload"> de la page, donc déjà en cache
      pagefind = await import(/* @vite-ignore */ attempt === 1 ? PAGEFIND_URL : `${PAGEFIND_URL}?essai=${attempt}`);
      await pagefind.init();
      totals = await pagefind.filters();
    } catch (error) {
      if (attempt >= MAX_ATTEMPTS) {
        console.error('[recherche]', error);
        emptyState('L’index de recherche est introuvable. En développement, lancez <code>npm run build</code> ou patientez quelques secondes après le démarrage de <code>npm run dev</code>, puis rechargez la page.');
        return;
      }
      status.textContent = 'Préparation de l’index de recherche…';
      setTimeout(() => load(attempt + 1), RETRY_DELAY);
      return;
    }
    readUrl();
    buildFilters();
    form.hidden = false;
    schedule();
  };

  status.textContent = 'Chargement de la recherche…';
  load(1);
};

// Le script est dans le <head> : on attend que le formulaire existe.
const start = () => {
  const form = document.querySelector('[data-site-search]');
  if (form) initSearch(form);
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();
