import fs from 'node:fs';

const OUTPUT = 'dist';
const INDEX = `${OUTPUT}/pagefind`;

// Les pages dont le contenu alimente la recherche : un changement ailleurs (CSS, scripts…) n'oblige pas à réindexer.
const CONTENT = /^\.\/src\/(articles|livres|posts|annexes|pages|_layouts|_includes\/partials)\//;

let running = false;
let pending = false;

const indexSite = async () => {
  const pagefind = await import('pagefind');
  const {index, errors} = await pagefind.createIndex({forceLanguage: 'fr'});
  if (!index) throw new Error(errors.join(' '));
  await index.addDirectory({path: OUTPUT});
  await index.writeFiles({outputPath: INDEX});
  await pagefind.close();
};

/**
 * En `--serve`, `npm run build` n'est pas exécuté : sans ce hook, `/pagefind/` n'existe pas et la page
 * de recherche reste vide. On indexe donc le site déjà rendu, sans bloquer le serveur : au premier
 * lancement s'il manque, puis quand le contenu a changé (les rafales sont regroupées en une indexation).
 */
export const pagefindDev = async ({results = []} = {}) => {
  const missing = !fs.existsSync(`${INDEX}/pagefind.js`);
  const changed = results.some(({inputPath}) => CONTENT.test(inputPath ?? ''));
  if (!missing && !changed) return;

  if (running) {
    pending = true;
    return;
  }
  running = true;
  try {
    do {
      pending = false;
      await indexSite();
    } while (pending);
    console.log('[pagefind] index de recherche mis à jour');
  } catch (error) {
    console.error('[pagefind] indexation impossible :', error.message);
  } finally {
    running = false;
  }
};
