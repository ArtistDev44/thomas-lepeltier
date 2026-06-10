import fs from 'node:fs';
import path from 'node:path';

export default function() {
  // Le chemin vers vos images
  const relativePath = "assets/images/conferences";
  const dirPath = path.join(process.cwd(), "src", relativePath);

  try {
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);

      return files
        .filter(file => /\.(jpe?g|png|gif|webp|svg|avif)$/i.test(file))
        .map(file => ({
          url: `/${relativePath}/${file}`, // URL pour le navigateur
          alt: file.split('.')[0].replace(/-/g, ' ')
        }));
    }
  } catch (e) {
    console.error("Erreur Galerie:", e);
  }
  return [];
};
