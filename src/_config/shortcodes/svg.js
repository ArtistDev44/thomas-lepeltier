/**
 * Generates an optimized SVG shortcode with optional attributes.
 *
 * @param {string} svgName - The name of the SVG file (without the .svg extension).
 * @param {string} [ariaName=''] - The ARIA label for the SVG.
 * @param {string} [className=''] - The CSS class name for the SVG.
 * @param {string} [styleName=''] - The inline style for the SVG.
 * @returns {Promise<string>} The optimized SVG shortcode.
 */

import {optimize} from 'svgo';
import {readFileSync, statSync} from 'node:fs';

// Chaque SVG est optimisé une seule fois (invalidé si le fichier change) au lieu d'une fois par page.
const optimizedSvgs = new Map();

const getOptimizedSvg = svgName => {
  const filePath = `./src/assets/svg/${svgName}.svg`;
  const {mtimeMs} = statSync(filePath);

  const cached = optimizedSvgs.get(filePath);
  if (cached?.mtimeMs === mtimeMs) return cached.data;

  const {data} = optimize(readFileSync(filePath, 'utf8'));
  optimizedSvgs.set(filePath, {mtimeMs, data});
  return data;
};

export const svgShortcode = async (svgName, ariaName = '', className = '', styleName = '') => {
  const data = getOptimizedSvg(svgName);

  return data.replace(
    /<svg(.*?)>/,
    `<svg$1 ${ariaName ? `aria-label="${ariaName}"` : 'aria-hidden="true"'} ${className ? `class="${className}"` : ''} ${styleName ? `style="${styleName}"` : ''} >`
  );
};
