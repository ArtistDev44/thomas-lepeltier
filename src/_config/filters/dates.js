import dayjs from 'dayjs';

/** Converts the given date string to ISO8610 format. */
export const toISOString = dateString => dayjs(dateString).toISOString();

/** Formats a date using dayjs's conventions: https://day.js.org/docs/en/display/format */
export const formatDate = (date, format) => dayjs(date).format(format);

/** Année d'une date, ou chaîne vide quand elle est inconnue (le contenu migré utilise 1234-01-01 comme valeur factice). */
export const anneeConnue = date => {
  const year = date ? new Date(date).getUTCFullYear() : NaN;
  return Number.isNaN(year) || year < 1500 ? '' : String(year);
};
