import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {anneeConnue} from '../filters/dates.js';

/**
 * Visuels Open Graph (1200×630) des fiches qui ont une couverture : chroniques, livres et articles.
 * Les autres pages gardent l'image par défaut (`meta.opengraph_default`).
 *
 * Les JPEG sont fabriqués après le rendu des pages, directement dans le dossier de sortie, par un processus
 * à part (`og-images-render.js`) et mis en cache dans `.cache/og-images` : seules les fiches modifiées sont
 * recalculées. Le texte est mis en page par Pango, qui ne lit que les polices installées sur la machine
 * (les `.woff2` du site ne sont pas utilisables) : on demande donc la famille générique `sans`.
 */

const SECTIONS = {chroniques: 'Chronique', livres: 'Livre', articles: 'Article'};

/** Cartes à produire pendant ce build, alimentées par la collection `ogCards` (voir `eleventy.config.js`). */
const cards = new Map();

/** `/chroniques/mon-titre/` → `/assets/og-images/chroniques-mon-titre.jpg` (null hors des sections concernées). */
export const ogImagePath = url => {
  const [section, ...rest] = String(url ?? '').split('/').filter(Boolean);
  if (!SECTIONS[section] || !rest.length) return null;
  return `/assets/og-images/${[section, ...rest].join('-')}.jpg`;
};

/** Filtre Nunjucks : chemin de l'image Open Graph de la fiche, ou chaîne vide pour utiliser l'image par défaut. */
export const ogImage = (url, imageUrl) => (imageUrl && ogImagePath(url)) || '';

/** À appeler depuis `addCollection` : retient les fiches à illustrer. */
export const collectOgCards = api => {
  cards.clear();
  for (const item of api.getAll()) {
    const {title, imageUrl, authorFullName, authors} = item.data;
    const file = ogImagePath(item.url);
    if (!file || !imageUrl || !title) continue;
    const section = item.url.split('/').filter(Boolean)[0];
    const author = authorFullName || (Array.isArray(authors) ? authors.join(', ') : authors) || '';
    cards.set(file, {
      title: String(title),
      author: String(author),
      label: [SECTIONS[section], anneeConnue(item.date)].filter(Boolean).join(' · '),
      cover: path.join('src', imageUrl)
    });
  }
  return [];
};

/** `eleventy.after` : écrit les JPEG des cartes dans `<sortie>/assets/og-images/`. */
export const buildOgImages = async ({dir}) => {
  if (!cards.size) return;
  fs.mkdirSync('.cache', {recursive: true});
  const cardsFile = path.join('.cache', 'og-cards.json');
  fs.writeFileSync(cardsFile, JSON.stringify(Object.fromEntries(cards)));

  const script = fileURLToPath(new URL('./og-images-render.js', import.meta.url));
  await new Promise(resolve => {
    const child = spawn(process.execPath, [script, cardsFile, dir.output], {stdio: ['ignore', 'inherit', 'inherit']});
    child.on('error', error => {
      console.warn(`[og-images] ${error.message}`);
      resolve();
    });
    child.on('exit', code => {
      if (code) console.warn(`[og-images] le processus de génération s'est arrêté (code ${code})`);
      resolve();
    });
  });
};
