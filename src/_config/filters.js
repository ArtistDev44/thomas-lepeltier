import {toISOString, formatDate} from './filters/dates.js';
import {markdownFormat} from './filters/markdown-format.js';
import {shuffleArray} from './filters/sort-random.js';
import {sortAlphabetically} from './filters/sort-alphabetic.js';
import {splitlines} from './filters/splitlines.js';
import {striptags} from './filters/striptags.js';
import {slugifyString} from './filters/slugify.js';

const relatedBooks = function(books, currentTags, currentUrl) {
  if (!books) return [];  // 👈 sécurité
  return books
    .filter(book => {
      if (book.url === currentUrl) return false;
      return book.data.tags && book.data.tags.some(tag => currentTags.includes(tag));
    })
    .map(book => {
      const commonTags = book.data.tags.filter(tag => currentTags.includes(tag));
      return { ...book, commonTagsCount: commonTags.length };
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
  relatedBooks  // 👈 ajouté ici
};
