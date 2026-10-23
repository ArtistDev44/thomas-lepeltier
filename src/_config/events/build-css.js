import {watch} from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import postcss from 'postcss';
import postcssImport from 'postcss-import';
import postcssImportExtGlob from 'postcss-import-ext-glob';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import fg from 'fast-glob';
import {signature, writeIfChanged} from './utils.js';

// cssnano est coûteux : inutile en dev (serve/watch), seul le build final minifie.
const minify = () => process.env.ELEVENTY_RUN_MODE === 'build' || !process.env.ELEVENTY_RUN_MODE;
const isServe = () => process.env.ELEVENTY_RUN_MODE === 'serve';

const DEV_GLOBAL_CSS = 'dist/assets/css/dev/global.css';
const DEV_LOCAL_CSS = 'dist/assets/css/dev/local.css';

const buildProcessor = () =>
  postcss([
    postcssImportExtGlob,
    postcssImport,
    tailwindcss,
    autoprefixer,
    ...(minify() ? [cssnano] : [])
  ]);

const buildCss = async (processor, inputPath, outputPaths) => {
  const inputContent = await fs.readFile(inputPath, 'utf-8');
  const result = await processor.process(inputContent, {from: inputPath});

  for (const outputPath of outputPaths) {
    await writeIfChanged(outputPath, result.css);
  }

  return result.css;
};

// Tout ce qui peut changer le rendu d'un fichier CSS (sources, config Tailwind, design tokens).
const CSS_SOURCES = [
  'src/assets/css/**/*.css',
  'tailwind.config.js',
  'src/_data/designTokens/*.json',
  'src/_config/utils/*.js'
];

// Les classes utilitaires de Tailwind (global.css uniquement) dépendent du contenu des templates.
const CONTENT_SOURCES = ['src/**/*.{html,js,md,njk,liquid,webc}'];
const CONTENT_IGNORE = ['src/_includes/css/**', 'src/_includes/scripts/**', 'src/assets/images/**'];

let lastCssSignature = null;
let lastContentSignature = null;

// Les builds CSS sont mis en file : un rebuild déclenché par le watcher CSS et un autre par
// Eleventy ne tournent jamais en parallèle (le second repart de l'empreinte du premier).
let queue = Promise.resolve();

const runBuild = async () => {
  const cssSignature = await signature(CSS_SOURCES);
  const contentSignature = await signature(CONTENT_SOURCES, {ignore: CONTENT_IGNORE});

  const cssChanged = cssSignature !== lastCssSignature;
  const contentChanged = contentSignature !== lastContentSignature;

  // Rien n'a bougé : on évite de relancer postcss/tailwind (la grosse part d'un rebuild en dev).
  if (!cssChanged && !contentChanged) return;

  const processor = buildProcessor();
  const tasks = [];

  // global.css embarque `tailwindcss/utilities` : il dépend aussi des templates.
  const globalCss = buildCss(processor, 'src/assets/css/global/global.css', ['src/_includes/css/global.css']);
  tasks.push(globalCss);

  // Les autres fichiers n'utilisent pas Tailwind : seules leurs sources comptent.
  const localCss = [];
  if (cssChanged) {
    const localCssFiles = await fg(['src/assets/css/local/**/*.css']);
    for (const inputPath of localCssFiles) {
      const baseName = path.basename(inputPath);
      localCss.push(buildCss(processor, inputPath, [`src/_includes/css/${baseName}`]));
    }

    const componentCssFiles = await fg(['src/assets/css/components/**/*.css']);
    for (const inputPath of componentCssFiles) {
      const baseName = path.basename(inputPath);
      tasks.push(buildCss(processor, inputPath, [`dist/assets/css/components/${baseName}`]));
    }
  }

  await Promise.all([...tasks, ...localCss]);

  // En dev, les pages ne contiennent plus le CSS inline : elles pointent vers ces feuilles statiques,
  // que le serveur recharge à chaud (injection) sans reconstruire une seule page.
  if (isServe()) {
    await writeIfChanged(DEV_GLOBAL_CSS, await globalCss);
    if (cssChanged) await writeIfChanged(DEV_LOCAL_CSS, (await Promise.all(localCss)).join('\n'));
  }

  lastCssSignature = cssSignature;
  lastContentSignature = contentSignature;
};

export const buildAllCss = () => {
  queue = queue.catch(() => {}).then(runBuild);
  return queue;
};

let watcherStarted = false;

/**
 * En `--serve`, recompile le CSS directement quand ses sources changent, sans passer par
 * Eleventy : ça évite de re-rendre toutes les pages pour une simple retouche de style.
 */
export const watchCss = () => {
  if (watcherStarted || !isServe()) return;
  watcherStarted = true;

  let timer;
  const rebuild = () => {
    clearTimeout(timer);
    timer = setTimeout(() => buildAllCss().catch(error => console.error('[css]', error.message)), 120);
  };

  for (const target of ['src/assets/css', 'src/_data/designTokens', 'tailwind.config.js']) {
    watch(target, {recursive: true}, rebuild).on('error', () => {});
  }
};
