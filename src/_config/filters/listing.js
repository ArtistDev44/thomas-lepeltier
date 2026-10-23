/** Aides pour les pages-listes filtrables (articles, chroniques). */

/** Découpe « A et B », « A, B et C », « A & B (eds) » en noms d'auteurs individuels. */
export const splitAuteurs = fullName =>
  String(fullName ?? '')
    .replace(/\((?:eds?|éds?|dir\.?|ed\.)\)/gi, '')
    .split(/\s+et\s+|\s*&\s*|\s*,\s*/)
    .map(name => name.trim())
    .filter(Boolean);

/** Regroupe les variantes d'écriture d'un même support. */
const sourceAliases = [
  [/^sciences humaines$/i, 'Sciences Humaines'],
  [/^l[’']amorce/i, 'L’Amorce'],
  [/^le journal des libertés$/i, 'Journal des libertés'],
  [/^(dans|in) /i, 'Ouvrage collectif']
];

/**
 * Support de publication d'un article, déduit de sa description (« Titre, Support, numéro, date »).
 * Renvoie une chaîne vide quand la description ne permet pas de le déterminer.
 */
export const sourceArticle = (description, title) => {
  const text = String(description ?? '').trim();
  const start = String(title ?? '').trim();
  if (!start || !text.startsWith(start)) return '';

  const source = text
    .slice(start.length)
    .replace(/^[\s,.:;]+/, '')
    .split(',')[0]
    .replace(/\.$/, '')
    .trim();
  if (!source || /^\d/.test(source)) return '';

  const alias = sourceAliases.find(([pattern]) => pattern.test(source));
  return alias ? alias[1] : source;
};
