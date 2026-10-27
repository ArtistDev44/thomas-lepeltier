import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

/**
 * Dessin des visuels Open Graph. Lancé dans un processus à part par `og-images.js` : le `sharp` du projet et
 * celui d'`eleventy-img` sont deux copies de libvips, qui se gênent (avertissements en rafale, plantage) quand
 * elles vivent dans le même processus.
 *
 * Usage : node og-images-render.js <fichier-cartes.json> <dossier-de-sortie>
 */

const WIDTH = 1200;
const HEIGHT = 630;
const CACHE_DIR = '.cache/og-images';
const TEMPLATE_VERSION = 5; // à incrémenter quand le dessin change
const COLORS = {bg: '#0d0f0e', accent: '#ff6f9c', text: '#ffffff', soft: '#c9cecb'};
const TEXT_X = 72;
const TEXT_WIDTH = 640;
const COVER_BOX = {x: 760, width: 368, height: 500};

const escapeMarkup = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Un bloc de texte mis en page par Pango, sur fond transparent. */
const textBlock = async (text, {size, color, weight = '', width = TEXT_WIDTH, spacing = 0}) => {
  const markup = `<span foreground="${color}"${spacing ? ` letter_spacing="${spacing}"` : ''}>${escapeMarkup(text)}</span>`;
  return sharp({
    text: {text: markup, font: `sans ${weight} ${size}`.replace('  ', ' '), width, dpi: 72, rgba: true, wrap: 'word'}
  })
    .png()
    .toBuffer({resolveWithObject: true});
};

/** Le titre prend la plus grande taille qui tient en `maxHeight`. */
const titleBlock = async (title, maxHeight) => {
  let block;
  for (const size of [66, 58, 50, 44, 38, 33]) {
    block = await textBlock(title, {size, color: COLORS.text, weight: 'bold'});
    if (block.info.height <= maxHeight) break;
  }
  return block;
};

const background = () =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
    <rect width="100%" height="100%" fill="${COLORS.bg}"/>
    <rect x="${TEXT_X}" y="64" width="64" height="6" fill="${COLORS.accent}"/>
  </svg>`);

/** Couverture à plat, angles à peine adoucis, sans ombre. */
const coverLayers = async file => {
  const {data, info} = await sharp(file)
    .resize({width: COVER_BOX.width, height: COVER_BOX.height, fit: 'inside'})
    .toBuffer({resolveWithObject: true});
  const mask = Buffer.from(
    `<svg width="${info.width}" height="${info.height}"><rect width="100%" height="100%" rx="2" fill="#fff"/></svg>`
  );
  const rounded = await sharp(data).composite([{input: mask, blend: 'dest-in'}]).png().toBuffer();
  const left = COVER_BOX.x + Math.round((COVER_BOX.width - info.width) / 2);
  const top = Math.round((HEIGHT - info.height) / 2);
  return [{input: rounded, left, top}];
};

const render = async card => {
  const hasCover = fs.existsSync(card.cover);
  const layers = hasCover ? await coverLayers(card.cover) : [];
  const width = hasCover ? TEXT_WIDTH : 960;

  const label = await textBlock(card.label, {size: 28, color: COLORS.accent, weight: 'bold', width});
  const author = card.author ? await textBlock(card.author, {size: 30, color: COLORS.soft, weight: 'medium', width}) : null;
  const signature = await textBlock('Thomas Lepeltier', {size: 28, color: COLORS.text, weight: 'bold', width});
  const titleMax = HEIGHT - 110 - label.info.height - (author?.info.height ?? 0) - signature.info.height - 150;
  const title = await titleBlock(card.title, Math.max(titleMax, 200));

  // Le bloc de texte est centré verticalement entre le filet du haut et la signature.
  const stack = [label, title, ...(author ? [author] : [])];
  const gaps = [26, 22];
  const stackHeight = stack.reduce((sum, block, i) => sum + block.info.height + (i ? gaps[Math.min(i - 1, 1)] : 0), 0);
  let y = Math.max(104, Math.round((HEIGHT - 70 - stackHeight - signature.info.height) / 2 + 40));
  const placed = stack.map((block, i) => {
    if (i) y += gaps[Math.min(i - 1, 1)];
    const layer = {input: block.data, left: TEXT_X, top: y};
    y += block.info.height;
    return layer;
  });

  return sharp(background())
    .composite([
      ...layers,
      ...placed,
      {input: signature.data, left: TEXT_X, top: HEIGHT - 64 - signature.info.height}
    ])
    .jpeg({quality: 84, mozjpeg: true})
    .toBuffer();
};

const cacheKey = card => {
  const stat = fs.existsSync(card.cover) ? fs.statSync(card.cover) : {size: 0, mtimeMs: 0};
  return crypto
    .createHash('sha1')
    .update(JSON.stringify([TEMPLATE_VERSION, card, stat.size, stat.mtimeMs]))
    .digest('hex');
};

const [cardsFile, outDir] = process.argv.slice(2);
const cards = Object.entries(JSON.parse(fs.readFileSync(cardsFile, 'utf8')));
fs.mkdirSync(path.join(outDir, 'assets/og-images'), {recursive: true});
fs.mkdirSync(CACHE_DIR, {recursive: true});

let drawn = 0;
let failed = 0;
const worker = async () => {
  for (let entry = cards.shift(); entry; entry = cards.shift()) {
    const [file, card] = entry;
    const cached = path.join(CACHE_DIR, `${cacheKey(card)}.jpg`);
    try {
      if (!fs.existsSync(cached)) {
        fs.writeFileSync(cached, await render(card));
        drawn++;
      }
      fs.copyFileSync(cached, path.join(outDir, file));
    } catch (error) {
      failed++;
      console.warn(`[og-images] ${file} : ${error.message}`);
    }
  }
};
const total = cards.length;
await Promise.all(Array.from({length: 4}, worker));
console.log(`[og-images] ${total - failed} visuels (${drawn} générés, ${total - failed - drawn} en cache)${failed ? `, ${failed} en échec` : ''}`);
