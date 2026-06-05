const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'database.json');
const markdownDir = path.join(__dirname, 'books');

function clean(str) {
  return (str || '')
    .replace(/"/g, '\\"')
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toMeta(str) {
  const s = clean(str);
  return s.length > 160 ? s.substring(0, 157) + '...' : s;
}

function slugify(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const data = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
const books = data.books || [];

let updated = 0;
let skipped = 0;
let notFound = 0;

books.forEach((book, index) => {
  const fileName = slugify(book.bookTitle) || `book-${index + 1}`;
  const filePath = path.join(markdownDir, `${fileName}.md`);

  // ✅ Vérifie que le fichier .md existe
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Fichier introuvable : ${fileName}.md`);
    notFound++;
    return;
  }

  // ✅ Calcul de la metaDescription
  const metaDescription = toMeta(
    book.metaDescription || book.bookSummary || ''
  );

  // ✅ Lecture du fichier existant
  let content = fs.readFileSync(filePath, 'utf-8');

  // ✅ Vérifie si le champ existe déjà
  if (content.includes('metaDescription:')) {
    console.log(`⏭️  Déjà présent : ${fileName}.md`);
    skipped++;
    return;
  }

  // ✅ Injection dans le frontmatter juste avant le ---  fermant
  content = content.replace(
    /^(---[\s\S]*?)(---)/, 
    `$1metaDescription: "${metaDescription}"\n$2`
  );

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Mis à jour : ${fileName}.md`);
  updated++;
});

console.log(`\n🎉 Terminé — ${updated} mis à jour, ${skipped} déjà OK, ${notFound} introuvables`);

