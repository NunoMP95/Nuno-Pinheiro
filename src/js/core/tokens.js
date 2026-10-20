/**
 * Design tokens: turns config.js values into CSS custom properties.
 * `buildTokenStylesheet` is pure (config in, CSS string out) so it can be tested;
 * the DOM-touching helpers are kept separate and tiny.
 */
(function register(globalScope, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else (globalScope.Portfolio = globalScope.Portfolio || {}).tokens = api;
})(typeof self !== "undefined" ? self : this, function createTokens() {
  "use strict";

  /** config.js palette key → CSS custom property used in styles.css. Add a row to add a token. */
  const PALETTE_TO_CSS_VARIABLE = {
    background: "--bg",
    surface: "--surface",
    text: "--text",
    textDim: "--text-dim",
    textMute: "--text-mute",
    accent: "--accent",
    accentText: "--accent-text",
    onAccent: "--on-accent",
    blue: "--blue",
  };

  /** Fonts already requested by the HTML <link>, so they are never loaded twice. */
  const PRELOADED_FONTS = new Set(["Roboto", "Roboto Mono"]);
  const STYLE_ELEMENT_ID = "site-tokens";

  /** "#021034" style declarations for one theme palette, e.g. "--bg:#021034;". */
  function paletteToDeclarations(palette = {}) {
    return Object.entries(PALETTE_TO_CSS_VARIABLE)
      .filter(([paletteKey]) => palette[paletteKey])
      .map(([paletteKey, cssVariable]) => `${cssVariable}:${palette[paletteKey]};`)
      .join("");
  }

  /** Full stylesheet text for the shared tokens plus the dark and light palettes. */
  function buildTokenStylesheet(config = {}) {
    const fonts = config.fonts || {};
    const shared = [
      fonts.sans && `--sans:'${fonts.sans}',Arial,sans-serif;`,
      fonts.mono && `--mono:'${fonts.mono}',ui-monospace,Menlo,monospace;`,
      config.radius != null && `--radius:${config.radius}px;`,
      config.maxWidth && `--maxw:${config.maxWidth}px;`,
    ].filter(Boolean).join("");

    return (
      `:root{${shared}}` +
      // Dark is also the no-attribute default, matching styles.css.
      `:root,[data-theme=dark]{${paletteToDeclarations(config.dark)}}` +
      `[data-theme=light]{${paletteToDeclarations(config.light)}}`
    );
  }

  /** Google Fonts stylesheet URL for a family name. */
  function googleFontUrl(familyName) {
    return `https://fonts.googleapis.com/css2?family=${familyName.replace(/ /g, "+")}:wght@300;400;500;700&display=swap`;
  }

  function loadFont(familyName, doc = document) {
    if (!familyName || PRELOADED_FONTS.has(familyName)) return;
    PRELOADED_FONTS.add(familyName);
    const link = doc.createElement("link");
    link.rel = "stylesheet";
    link.href = googleFontUrl(familyName);
    doc.head.appendChild(link);
  }

  /** Writes the token stylesheet into a single <style> element (created once). */
  function applyTokens(config, doc = document) {
    const fonts = config.fonts || {};
    loadFont(fonts.sans, doc);
    loadFont(fonts.mono, doc);
    let styleElement = doc.getElementById(STYLE_ELEMENT_ID);
    if (!styleElement) {
      styleElement = doc.createElement("style");
      styleElement.id = STYLE_ELEMENT_ID;
      doc.head.appendChild(styleElement);
    }
    styleElement.textContent = buildTokenStylesheet(config);
  }

  return { PALETTE_TO_CSS_VARIABLE, paletteToDeclarations, buildTokenStylesheet, googleFontUrl, applyTokens };
});
