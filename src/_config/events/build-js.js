import path from 'node:path';
import fg from 'fast-glob';
import esbuild from 'esbuild';
import {signature, writeIfChanged} from './utils.js';

export const buildJs = async (inputPath, outputPath) => {
  const result = await esbuild.build({
    target: 'es2020',
    entryPoints: [inputPath],
    bundle: true,
    minify: true,
    write: false
  });

  const output = result.outputFiles[0].text;

  await writeIfChanged(outputPath, output);

  return output;
};

let lastSignature = null;

export const buildAllJs = async () => {
  // Les scripts sont indépendants des templates : on ne les recompile que s'ils ont changé.
  const currentSignature = await signature(['src/assets/scripts/**/*.js']);
  if (currentSignature === lastSignature) return;

  const tasks = [];

  const inlineBundleFiles = await fg(['src/assets/scripts/bundle/**/*.js']);
  for (const inputPath of inlineBundleFiles) {
    const baseName = path.basename(inputPath);
    const outputPath = `src/_includes/scripts/${baseName}`;
    tasks.push(buildJs(inputPath, outputPath));
  }

  const componentFiles = await fg(['src/assets/scripts/components/**/*.js']);
  for (const inputPath of componentFiles) {
    const baseName = path.basename(inputPath);
    const outputPath = `dist/assets/scripts/components/${baseName}`;
    tasks.push(buildJs(inputPath, outputPath));
  }

  await Promise.all(tasks);

  lastSignature = currentSignature;
};
