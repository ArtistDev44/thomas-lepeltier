/** All blog posts as a collection. */
export const getAllPosts = collection => {
  return collection.getFilteredByGlob('./src/posts/**/*.md').reverse();
};

/** All relevant pages as a collection for sitemap.xml */
export const showInSitemap = collection => {
  return collection.getFilteredByGlob('./src/**/*.{md,njk}');
};

/** All tags from all posts as a collection - excluding custom collections */
export const tagList = collection => {
  const tagsSet = new Set();
  collection.getAll().forEach(item => {
    if (!item.data.tags) return;
    item.data.tags.filter(tag => !['posts', 'docs', 'all'].includes(tag)).forEach(tag => tagsSet.add(tag));
  });
  return Array.from(tagsSet).sort();
};
export default (eleventyConfig) => {

  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tags = new Set();
    const excluded = ["all", "nav", "post"];

    collectionApi.getAll().forEach(item => {
      if (!item.data.tags) return;

      let itemTags = item.data.tags;

      if (typeof itemTags === "string") {
        itemTags = [itemTags];
      }

      itemTags.forEach(tag => {
        if (!excluded.includes(tag)) {
          tags.add(tag);
        }
      });
    });

    return [...tags].sort();
  });

};
