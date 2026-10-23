/**
 * Garde-fou de mise en production : échoue si `dist/` contient un défaut qui bloquerait la mise en ligne.
 * Usage : `node scripts/check-dist.mjs [dossier]` (par défaut `dist`), lancé à la fin de `npm run build`.
 */
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(process.argv[2] ?? 'dist');
const siteUrl = 'https://www.thomaslepeltier.fr';
const errors = [];
const fail = message => errors.push(message);

const walk = dir =>
  fs.readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

const files = walk(dist);
const rel = file => '/' + path.relative(dist, file).split(path.sep).join('/');
const htmlFiles = files.filter(file => file.endsWith('.html'));
const textFiles = files.filter(file => /\.(html|xml|txt|json|webmanifest)$/.test(file) && !file.includes('/pagefind/'));

/** Une URL du site existe si c'est un fichier ou un dossier contenant `index.html`. */
const pageFile = url => {
  const clean = decodeURI(url.split('#')[0].split('?')[0]);
  const target = path.join(dist, clean);
  if (fs.existsSync(target) && fs.statSync(target).isFile()) return target;
  const index = path.join(target, 'index.html');
  return fs.existsSync(index) ? index : null;
};

// 1. Aucune URL de développement ni texte du modèle de départ
const forbidden = [
  [/https?:\/\/localhost/, 'URL localhost'],
  [/\/\.11ty\/image\//, "image servie par le serveur de développement d'Eleventy"],
  [/Your street|12345, city/, 'adresse du gabarit non remplie'],
  [/1234-01-01|1 janvier 1234|January 1, 1234/, 'date factice 1234'],
  [/Eleventy Excellent is inspired|All blog posts can be found here/, 'description du modèle de départ']
];
for (const file of textFiles) {
  const content = fs.readFileSync(file, 'utf8');
  for (const [pattern, label] of forbidden) {
    if (pattern.test(content)) fail(`${rel(file)} : ${label}`);
  }
}

// 2. Fichiers indispensables
for (const required of ['/sitemap.xml', '/robots.txt', '/404.html', '/pagefind/pagefind.js']) {
  if (!fs.existsSync(path.join(dist, required))) fail(`fichier manquant : ${required}`);
}
const sitemap = fs.existsSync(path.join(dist, 'sitemap.xml')) ? fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8') : '';
if (!sitemap.includes(`<loc>${siteUrl}/`)) fail(`sitemap.xml ne pointe pas vers ${siteUrl}`);
const robots = fs.existsSync(path.join(dist, 'robots.txt')) ? fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8') : '';
if (!robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) fail(`robots.txt ne déclare pas ${siteUrl}/sitemap.xml`);

// 3. Pages du modèle de départ
for (const leftover of ['/built-with/', '/card/', '/styleguide/', '/sustainability/', '/test/', '/pages/test/']) {
  if (pageFile(leftover)) fail(`page du modèle encore publiée : ${leftover}`);
}

// 4. Un seul h1 par page et un canonical sur le bon domaine
for (const file of htmlFiles) {
  if (rel(file).startsWith('/pagefind/') || rel(file).startsWith('/assets/')) continue;
  const html = fs.readFileSync(file, 'utf8');
  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1Count !== 1) fail(`${rel(file)} : ${h1Count} balise(s) h1`);
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/);
  if (canonical && !canonical[1].startsWith(siteUrl)) fail(`${rel(file)} : canonical ${canonical[1]}`);
}

// 5. Liens internes
const brokenLinks = new Map();
for (const file of htmlFiles) {
  if (rel(file).startsWith('/pagefind/')) continue;
  const html = fs.readFileSync(file, 'utf8');
  for (const [, href] of html.matchAll(/<a\b[^>]*?\shref="(\/[^"/][^"]*|\/)"/g)) {
    if (!pageFile(href)) brokenLinks.set(href, (brokenLinks.get(href) ?? 0) + 1);
  }
}
for (const [href, count] of brokenLinks) fail(`lien interne cassé : ${href} (${count} page(s))`);

// 6. Redirections de vercel.json : destination existante, source jamais une page vivante
const vercel = JSON.parse(fs.readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
for (const {source, destination} of vercel.redirects ?? []) {
  const [target, anchor] = destination.split('#');
  const file = pageFile(target);
  if (!file) fail(`redirection ${source} -> ${destination} : destination absente`);
  else if (anchor && !fs.readFileSync(file, 'utf8').includes(`id="${anchor}"`)) fail(`redirection ${source} -> ${destination} : ancre absente`);
  if (pageFile(source) && source !== '/index.html') fail(`redirection ${source} masque une page existante`);
}

// 7. Chaque image Open Graph annoncée par une page existe dans dist/
const missingOg = new Set();
for (const file of htmlFiles) {
  if (rel(file).startsWith('/pagefind/')) continue;
  const og = fs.readFileSync(file, 'utf8').match(/<meta property="og:image" content="([^"]*)"/);
  if (!og?.[1].startsWith(siteUrl)) continue;
  const imagePath = decodeURI(og[1].slice(siteUrl.length));
  if (!fs.existsSync(path.join(dist, imagePath))) missingOg.add(`${imagePath} (${rel(file)})`);
}
for (const entry of missingOg) fail(`image Open Graph absente : ${entry}`);

if (errors.length) {
  console.error(`\n${errors.length} problème(s) bloquant(s) dans ${dist} :`);
  for (const error of errors.slice(0, 60)) console.error(` - ${error}`);
  if (errors.length > 60) console.error(` … et ${errors.length - 60} autres`);
  process.exit(1);
}
console.log(`dist/ vérifié : ${htmlFiles.length} pages HTML, ${vercel.redirects?.length ?? 0} redirections, aucun défaut bloquant.`);
