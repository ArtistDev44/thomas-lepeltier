import {buildOgImages} from './events/og-images.js';
import {buildAllCss, watchCss} from './events/build-css.js';
import {buildAllJs} from './events/build-js.js';
import {pagefindDev} from './events/pagefind-dev.js';

export default {
  buildOgImages,
  buildAllCss,
  watchCss,
  buildAllJs,
  pagefindDev
};
