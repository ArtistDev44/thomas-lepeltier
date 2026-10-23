/** Étiquettes qui ne servent qu'à classer les collections : elles ne s'affichent jamais au visiteur. */
const internalTags = new Set(['posts', 'article', 'livre', 'mesLivres', 'livresDiriges', 'Chronique']);

export const publicTags = tags => (tags ?? []).filter(tag => !internalTags.has(tag));
