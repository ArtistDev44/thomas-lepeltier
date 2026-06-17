import {toISOString, formatDate} from './filters/dates.js';
import {markdownFormat} from './filters/markdown-format.js';
import {shuffleArray} from './filters/sort-random.js';
import {sortAlphabetically} from './filters/sort-alphabetic.js';
import {splitlines} from './filters/splitlines.js';
import {striptags} from './filters/striptags.js';
import {slugifyString} from './filters/slugify.js';
import lettrine from './filters/lettrine.js';

const relatedRapports = function (rapports, currentTags, currentUrl) {
  if (!rapports) return [];
  return rapports
    .filter(rapport => {
      if (rapport.url === currentUrl) return false;
      return rapport.data.tags && rapport.data.tags.some(tag => currentTags.includes(tag));
    })
    .map(rapport => {
      const commonTags = rapport.data.tags.filter(tag => currentTags.includes(tag));
      return {...rapport, commonTagsCount: commonTags.length};
    })
    .sort((a, b) => b.commonTagsCount - a.commonTagsCount)
    .slice(0, 5);
};

export const relatedLivres = function (livres, currentTags, currentUrl) {
  if (!livres) return [];
  return livres
    .filter(livre => {
      if (livre.url === currentUrl) return false;
      return livre.data.tags && livre.data.tags.some(tag => currentTags.includes(tag));
    })
    .map(livre => {
      const commonTags = livre.data.tags.filter(tag => currentTags.includes(tag));
      return {...livre, commonTagsCount: commonTags.length};
    })
    .sort((a, b) => b.commonTagsCount - a.commonTagsCount)
    .slice(0, 5);
};

export default {
  toISOString,
  formatDate,
  markdownFormat,
  splitlines,
  striptags,
  shuffleArray,
  sortAlphabetically,
  slugifyString,
  relatedRapports,
  relatedLivres, // ajout$
  lettrine
};
