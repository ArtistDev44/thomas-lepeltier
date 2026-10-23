import fs from 'node:fs';
import path from 'node:path';

const relativePath = 'assets/images/conferences';

/** Enregistrements, émissions ou pages de l'événement, par nom de fichier (sans extension). */
const liens = {
  '2024-the-flares': 'https://youtu.be/6PRXFDhZEtU',
  '2024-france-culture-big-bang': 'https://www.radiofrance.fr/franceculture/podcasts/ils-ont-change-le-monde/big-bang-et-l-univers-fut-1551889',
  '2023-cnews-la-chasse': 'https://www.dailymotion.com/video/x8przt1',
  '2023-Ecologie-a-l-endroit': 'https://www.youtube.com/watch?v=sErPBolekgo',
  '2023-france-culture-ours-blanc': 'https://www.youtube.com/@actionecologie-lecologieal8799/streams',
  '2023-athlete-ethique-retour-sur-debat': 'https://www.youtube.com/watch?v=JeY9YoVFSPs',
  '2023-kumquat-ecologie-antispecisme-1': 'https://www.youtube.com/watch?v=_h1L-OTL5Ls',
  '2023-cnews-1': 'https://www.dailymotion.com/video/x8lhtzw',
  '2023-Jica': 'https://jicanimale.fr/jica2023.html',
  '2022-big-bang-france-culture': 'https://www.franceculture.fr/emissions/la-methode-scientifique/big-bang-ca-tangue.html',
  '2021-Ecraser-insectes-EQA': 'https://www.youtube.com/watch?v=NzRbGmfIR_4',
  '2019-Namur': 'https://esphin.unamur.be/activites/inauguration/intervenants/lepeltier-thomas',
  '2019-rts': 'https://www.rts.ch/play/radio/chouette-/audio/demain-tous-veganes--thomas-lepeltier-philosophe-et-historien-des-sciences?id=10603755',
  '2019-Demain-TV': 'https://www.demain.fr/accueil/a-la-une/tambour-battant-vegetalisme-veganisme-quel-sens-ont-ces-choix-de-vie'
};

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
        caption: `${subject}, ${year}${suffix}`,
        lien: liens[path.parse(file).name]
      };
    })
    .sort((a, b) => b.year.localeCompare(a.year) || a.file.localeCompare(b.file));
}
