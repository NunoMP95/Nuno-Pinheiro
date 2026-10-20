/* =========================================================
   SITE CONFIG — your design settings live here.
   Edit by hand, OR open any page with ?edit on the end of the
   address (e.g. index.html?edit), use the Design panel, then
   click "Download config.js" and replace this file.
   Colours come from your palette (see README → Palette).
   ========================================================= */
window.SITE_CONFIG = {
  // What a first-time visitor sees: "system" follows their device setting, or force "dark" / "light".
  // Visitors can always switch with the sun/moon button; their choice is remembered.
  defaultTheme: "system",

  dark: {
    background: "#021034",   // Blue 900
    surface:    "#082B70",   // Blue 700 — cards, footer
    text:       "#E1E5FE",   // Blue 100
    textDim:    "#AEBBFC",   // Blue 200 — body text
    textMute:   "#BDBEC3",   // Cool grey 200 — captions
    accent:     "#50D4CB",   // Teal 200 — buttons, highlights
    accentText: "#50D4CB",   // Teal used for text/links
    onAccent:   "#021034",   // text on accent buttons
    blue:       "#7692FA"    // Blue 300 — diagrams
  },
  light: {
    background: "#FFFFFF",
    surface:    "#E1E5FE",   // Blue 100
    text:       "#021034",   // Blue 900
    textDim:    "#2F3034",   // Cool grey 700
    textMute:   "#4F5056",   // Cool grey 600
    accent:     "#50D4CB",   // Teal 200 (fills only — too light for text on white)
    accentText: "#1E5C57",   // Teal 600 — passes contrast on white
    onAccent:   "#021034",
    blue:       "#1349B2"    // Blue 600
  },

  fonts: {
    sans: "Roboto",          // headings and body
    mono: "Roboto Mono"      // labels and diagram text
  },

  radius: 20,                // card corner roundness in px
  maxWidth: 1200,            // page width in px

  // Order of the main home-page sections. Remove an id to hide that section.
  sections: ["work", "experience", "skills"]
};
