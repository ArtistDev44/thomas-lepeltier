import fs from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';

/**
 * Empreinte (chemin + mtime + taille) d'un ensemble de fichiers : permet de savoir
 * si une étape de build doit être rejouée sans relire ni recompiler quoi que ce soit.
 */
export const signature = async (patterns, options = {}) => {
  const entries = await fg(patterns, {stats: true, ...options});
  return entries
    .map(({path: file, stats}) => `${file}:${stats.mtimeMs}:${stats.size}`)
    .sort()
    .join('|');
};

/**
 * N'écrit le fichier que si son contenu a changé : évite de déclencher
 * inutilement le watcher d'Eleventy (et donc un nouveau rebuild) en dev.
 */
export const writeIfChanged = async (outputPath, content) => {
  await fs.mkdir(path.dirname(outputPath), {recursive: true});
  const previous = await fs.readFile(outputPath, 'utf-8').catch(() => null);
  if (previous !== content) await fs.writeFile(outputPath, content);
};
