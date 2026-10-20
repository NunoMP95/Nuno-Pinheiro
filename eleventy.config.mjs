/**
 * Eleventy configuration.
 * Docs: https://www.11ty.dev/docs/config/
 *
 * src/   → what you edit (templates, Markdown, data, CSS, JS)
 * _site/ → what Eleventy builds and what gets published (never edit by hand)
 */
import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  // ----- Static files: copied to _site exactly as they are -----
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/config.js");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/*.pdf"); // e.g. nuno-pinheiro-cv.pdf
  eleventyConfig.addPassthroughCopy("src/images"); // case study images → /images/...

  // Rewrites root links like "/styles.css" if the site is ever served from a
  // sub-folder (set with --pathprefix). With username.github.io nothing changes.
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // Rebuild the browser when CSS/JS change while running `npm start`.
  eleventyConfig.addWatchTarget("src/styles.css");
  eleventyConfig.addWatchTarget("src/js/");

  /**
   * Case study section wrapper, used inside Markdown:
   *   {% csSection "overview", "01 · Overview" %}
   *   ## Overview
   *   Your text…
   *   {% endcsSection %}
   * The blank lines around the content let Markdown process what's inside.
   */
  eleventyConfig.addPairedShortcode("csSection", (content, id, label) =>
    `<section class="cs-sec" id="${id}">\n\n<p class="label">${label}</p>\n\n${content.trim()}\n\n</section>`
  );

  /**
   * Case study image with a caption, used inside Markdown:
   *   {% figure "/images/case-studies/scheduling-optimisation-engine/blueprint.png", "Describe what the image shows", "Optional caption" %}
   * Alt text is required (pass "" only for purely decorative images), so the build
   * fails loudly instead of publishing an inaccessible image.
   */
  const escapeAttribute = (text) => String(text).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  eleventyConfig.addShortcode("figure", (src, alt, caption = "") => {
    if (alt === undefined) throw new Error(`{% figure "${src}" %} needs alt text as the second value`);
    const captionHtml = caption ? `<figcaption>${caption}</figcaption>` : "";
    return `<figure class="cs-figure cs-image"><img src="${escapeAttribute(src)}" alt="${escapeAttribute(alt)}" loading="lazy" decoding="async">${captionHtml}</figure>`;
  });

  /** Current year, for the footer copyright. */
  eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));

  /** Case studies collection, sorted by the `order` value in each file's front matter. */
  eleventyConfig.addCollection("caseStudies", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/case-studies/*.md").sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99))
  );

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    // Let Markdown files use Nunjucks tags (shortcodes and includes).
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md"],
  };
}
