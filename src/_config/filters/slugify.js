import slugify from 'slugify';

/** Converts string to a slug form. Slashes and French quotation marks never reach the URL. */
export const slugifyString = str => {
  return slugify(str.replace(/\//g, ' '), {
    replacement: '-',
    remove: /[#,&,+()$~%.'":*¿?¡!<>{}«»]/g,
    lower: true
  });
};
