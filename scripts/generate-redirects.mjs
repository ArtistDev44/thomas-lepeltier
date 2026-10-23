/**
 * Génère les redirections 301 de l'ancien site vers le nouveau dans `vercel.json`.
 *
 * Source de vérité : `redirects/anciennes-urls.csv` (colonnes `ancienne_url`, `nouvelle_url`).
 * Usage : `node scripts/generate-redirects.mjs` après toute modification du CSV.
 * Le reste de `vercel.json` (en-têtes, commande de build) est conservé tel quel.
 */
import fs from 'node:fs';

const csvPath = new URL('../redirects/anciennes-urls.csv', import.meta.url);
const vercelPath = new URL('../vercel.json', import.meta.url);

const rows = fs
  .readFileSync(csvPath, 'utf8')
  .trim()
  .split('\n')
  .slice(1)
  .map(line => line.trim().split(','))
  .map(([source, destination]) => ({source, destination, permanent: true}));

// L'ancien moteur de recherche passait la page d'origine en paramètre (`?de=…`) : on l'ignore.
rows.push({source: '/recherche.html', destination: '/recherche/', permanent: true});

const seen = new Set();
for (const {source, destination} of rows) {
  if (!source.startsWith('/') || !destination.startsWith('/')) throw new Error(`Redirection invalide : ${source} -> ${destination}`);
  if (seen.has(source)) throw new Error(`Source en double : ${source}`);
  seen.add(source);
}

const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
vercel.redirects = rows;
fs.writeFileSync(vercelPath, JSON.stringify(vercel, null, 2) + '\n');
console.log(`${rows.length} redirections écrites dans vercel.json`);
