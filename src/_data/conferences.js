import fs from 'node:fs';
import path from 'node:path';

const relativePath = 'assets/images/conferences';

/** Capitalise la première lettre sans toucher au reste. */
const capitalize = text => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * Lit le dossier des affiches d'interventions. Le nom du fichier suit le motif `ANNÉE-lieu-ou-sujet[-n]`.
 * Résultat trié de la plus récente à la plus ancienne, au format attendu par `partials/gallery.njk`.
 */
export default function () {
  const dirPath = path.join(process.cwd(), 'src', relativePath);
  if (!fs.existsSync(dirPath)) return [];

  return fs
    .readdirSync(dirPath)
    .filter(file => /\.(jpe?g|png|gif|webp|avif)$/i.test(file))
    .map(file => {
      const [year, ...rest] = path.parse(file).name.split('-');
      const suffix = /^\d+$/.test(rest.at(-1) ?? '') ? ` (${rest.pop()})` : '';
      const subject = capitalize(rest.join(' '));
      return {
        year,
        file,
        image: `./src/${relativePath}/${file}`,
        alt: `Affiche de l’intervention « ${subject} », ${year}${suffix}`,
        caption: `${subject}, ${year}${suffix}`
      };
    })
    .sort((a, b) => b.year.localeCompare(a.year) || a.file.localeCompare(b.file));
}
