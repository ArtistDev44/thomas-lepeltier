// filters/lettrine.js

export default function lettrine(content) {
  if (!content) return content;

  return content.replace(/(<p>)([A-ZÀ-ŸA-Za-zà-ÿ])/, (match, tag, lettre) => {
    return `${tag}<span class="lettrine" aria-hidden="true">${lettre}</span>`;
  });
}
