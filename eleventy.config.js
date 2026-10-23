/**
 * Most adjustments must be made in `./src/_config/*`
 *
 * Hint VS Code for eleventyConfig autocompletion.
 * © Henry Desroches - https://gist.github.com/xdesro/69583b25d281d055cd12b144381123bf
 * @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig -
 * @returns {Object} -
 */
import fs from 'fs';
import path from 'path';
import Image from '@11ty/eleventy-img';
import sharp from 'sharp';


// register dotenv for process.env.* variables to pickup
import dotenv from 'dotenv';
dotenv.config();

// add yaml support
import yaml from 'js-yaml';

//  config import
import {getAllPosts, showInSitemap, tagList} from './src/_config/collections.js';
import events from './src/_config/events.js';
import filters from './src/_config/filters.js';
import plugins from './src/_config/plugins.js';
import shortcodes from './src/_config/shortcodes.js';

// `serve` et `watch` : on privilégie la légèreté (RAM/CPU) sur l'exhaustivité du rendu
const isDev = ['serve', 'watch'].includes(process.env.ELEVENTY_RUN_MODE);

// Cache des images encodées en base64 (profil, couvertures…) : lues une fois, pas une fois par page
const base64Cache = new Map();

export default async function (eleventyConfig) {
  if (isDev) {
    // Limite le parallélisme d'eleventy-img et de sharp (libvips) pour ne pas saturer CPU/RAM en dev
    Image.concurrency = 2;
    sharp.concurrency(2);
    sharp.cache({memory: 64, files: 0, items: 100});
  }

  // --------------------- Events: before build
  eleventyConfig.on('eleventy.before', async () => {
    await events.buildAllCss();
    await events.buildAllJs();
    events.watchCss();
  });

  // --------------------- custom wtach targets
  // (pas d'images ici : surveiller des centaines de png/jpeg coûte cher et n'a aucun effet sur le rendu)
  // (le CSS n'est pas listé : en `--serve` il est recompilé et injecté à chaud par `events.watchCss`)
  eleventyConfig.addWatchTarget('./src/assets/scripts/');
  eleventyConfig.addWatchTarget('./src/assets/svg/');
  eleventyConfig.addWatchTarget('./src/_includes/webc/');

  // Recharge les feuilles de style de dev en injectant le CSS, sans recharger ni reconstruire les pages
  eleventyConfig.setServerOptions({watch: ['dist/assets/css/dev/**/*.css']});

  // Évite de relancer un build à chaque écriture intermédiaire (enregistrements en rafale)
  eleventyConfig.setWatchThrottleWaitTime(150);

  // --------------------- layout aliases
  eleventyConfig.addLayoutAlias('base', 'base.njk');
  eleventyConfig.addLayoutAlias('page', 'page.njk');
  eleventyConfig.addLayoutAlias('post', 'post.njk');
  eleventyConfig.addLayoutAlias('tags', 'tags.njk');

  //	---------------------  Collections
  eleventyConfig.addCollection('allPosts', getAllPosts);
  eleventyConfig.addCollection('showInSitemap', showInSitemap);
  eleventyConfig.addCollection('tagList', tagList);

  // ---------------------  Plugins
  eleventyConfig.addPlugin(plugins.htmlConfig);
  eleventyConfig.addPlugin(plugins.drafts);

  eleventyConfig.addPlugin(plugins.EleventyRenderPlugin);
  eleventyConfig.addPlugin(plugins.rss);
  eleventyConfig.addPlugin(plugins.syntaxHighlight);

  eleventyConfig.addPlugin(plugins.webc, {
    // Seuls les composants réellement utilisés sont enregistrés : ceux à `webc:setup`
    // (custom-youtube, custom-peertube…) créent un contexte `vm` V8 par page rendue.
    // Pour en réactiver un, l'ajouter ici (et dans `webcTag` ci-dessous).
    components: [
      './src/_includes/webc/custom-card.webc',
      './src/_includes/webc/custom-masonry.webc',
      './src/_includes/webc/custom-masonry-no-js.webc'
    ],
    useTransform: true
  });

  // La transformation WebC parse chaque page HTML avec parse5 et garde l'AST en cache sans jamais
  // l'évincer (clé = HTML complet) : en dev, c'est ~0,5 Go de RAM perdus à chaque rebuild complet.
  // On ne la lance donc que sur les pages qui utilisent réellement un composant.
  const webcTransformName = '@11ty/eleventy-plugin-webc';
  const webcTransform = eleventyConfig.transforms[webcTransformName];
  const webcTag = /<custom-(card|masonry)[\s>/]/;
  eleventyConfig.addTransform(webcTransformName, function (content) {
    return webcTag.test(content) ? webcTransform.call(this, content) : content;
  });

  eleventyConfig.addPlugin(plugins.eleventyImageTransformPlugin, {
    silent: true,
    // formats: ['webp', 'jpeg'],
    formats: ['webp'],
    widths: ['auto'],

    // (l'option `concurrency` n'existe pas ici : la file est réglée plus haut via `Image.concurrency`)
    sharpOptions: {
      animated: false
    },
    sharpWebpOptions: {
      lossless: false,
      quality: 80
    },
    htmlOptions: {
      imgAttributes: {
        loading: 'lazy',
        decoding: 'async'
      },
      pictureAttributes: {}
    }
  });

  // ---------------------  bundle
  eleventyConfig.addBundle('css', {hoist: true});

  // 	--------------------- Library and Data
  eleventyConfig.setLibrary('md', plugins.markdownLib);
  eleventyConfig.addDataExtension('yaml', contents => yaml.load(contents));

  // --------------------- Filters
  eleventyConfig.addFilter('toIsoString', filters.toISOString);
  eleventyConfig.addFilter('toBase64', function (imagePath) {
    if (!imagePath) return '';
    const filePath = path.join('src', imagePath);
    try {
      const {mtimeMs} = fs.statSync(filePath);
      const cached = base64Cache.get(filePath);
      if (cached?.mtimeMs === mtimeMs) return cached.dataUri;

      const file = fs.readFileSync(filePath);
      const ext = path.extname(imagePath).slice(1).toLowerCase();
      const mime = ext === 'jpg' ? 'jpeg' : ext;
      const dataUri = `data:image/${mime};base64,${file.toString('base64')}`;
      base64Cache.set(filePath, {mtimeMs, dataUri});
      return dataUri;
    } catch (e) {
      console.warn(`[toBase64] Image non trouvée : ${filePath}`);
      return '';
    }
  });
  eleventyConfig.addFilter('formatDate', filters.formatDate);
  eleventyConfig.addFilter('anneeConnue', filters.anneeConnue);
  eleventyConfig.addFilter('markdownFormat', filters.markdownFormat);
  eleventyConfig.addFilter('splitlines', filters.splitlines);
  eleventyConfig.addFilter('striptags', filters.striptags);
  eleventyConfig.addFilter('shuffle', filters.shuffleArray);
  eleventyConfig.addFilter('alphabetic', filters.sortAlphabetically);
  eleventyConfig.addFilter('slugify', filters.slugifyString);
  eleventyConfig.addFilter('relatedRapports', filters.relatedRapports);
  eleventyConfig.addFilter('relatedLivres', filters.relatedLivres);
  eleventyConfig.addFilter('publicTags', filters.publicTags);
  eleventyConfig.addFilter('splitAuteurs', filters.splitAuteurs);
  eleventyConfig.addFilter('sourceArticle', filters.sourceArticle);

  // --------------------- Shortcodes
  eleventyConfig.addShortcode('svg', shortcodes.svgShortcode);
  eleventyConfig.addShortcode('image', shortcodes.imageShortcode);
  eleventyConfig.addShortcode('imageKeys', shortcodes.imageKeysShortcode);
  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);

  // --------------------- Events: after build
  if (process.env.ELEVENTY_RUN_MODE === 'build') {
    eleventyConfig.on('eleventy.after', events.svgToJpeg);
  }

  // --------------------- Passthrough File Copy

  // -- same path
  [
    'src/assets/images/galerie/', // <--- AJOUTEZ CETTE LIGNE
    'src/assets/fonts/',
    'src/assets/pdf/',
    'src/assets/images/template',
    'src/assets/og-images'
  ].forEach(path => eleventyConfig.addPassthroughCopy(path));

  eleventyConfig.addPassthroughCopy({
    // -- to root
    'src/assets/images/favicon/*': '/',

    // -- node_modules
    'node_modules/lite-youtube-embed/src/lite-yt-embed.{css,js}': `assets/components/`
  });

  // ----------------------  ignore test files
  if (process.env.ELEVENTY_ENV != 'test') {
    eleventyConfig.ignores.add('src/common/pa11y.njk');
  }

  // Les visuels Open Graph (un SVG par chronique, images en base64 incluses) ne servent qu'au build final :
  // en dev ils coûtent plusieurs centaines de pages à rendre et à garder en mémoire à chaque changement.
  if (isDev) {
    eleventyConfig.ignores.add('src/common/og-images.njk');
  }

  // --------------------- general config
  return {
    markdownTemplateEngine: 'njk',

    dir: {
      output: 'dist',
      input: 'src',
      includes: '_includes',
      layouts: '_layouts'
    }
  };
}
