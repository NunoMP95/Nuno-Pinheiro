/**
 * Design panel — only shown when the URL contains ?edit.
 *
 * The controls are declared as data (COLOUR_FIELDS, FONT_FIELDS, RANGE_FIELDS),
 * so adding a control means adding one line, not new DOM code. Every control writes
 * to the config store; the store notifies the page, which re-applies tokens/sections.
 */
(function register(globalScope, factory) {
  const isNode = typeof module === "object" && module.exports;
  const utils = isNode ? require("../core/utils.js") : globalScope.Portfolio.utils;
  const api = factory(utils);
  if (isNode) module.exports = api;
  else globalScope.Portfolio.designPanel = api;
})(typeof self !== "undefined" ? self : this, function createDesignPanelModule(utils) {
  "use strict";
  const { createElement } = utils;

  const COLOUR_FIELDS = [
    { key: "background", label: "Background" },
    { key: "surface", label: "Cards & footer" },
    { key: "text", label: "Headings" },
    { key: "textDim", label: "Body text" },
    { key: "textMute", label: "Captions" },
    { key: "accent", label: "Accent (buttons)" },
    { key: "accentText", label: "Accent text & links" },
    { key: "onAccent", label: "Text on accent" },
    { key: "blue", label: "Diagram blue" },
  ];
  const FONT_FIELDS = [
    { key: "sans", label: "Headings & body", options: ["Roboto", "Roboto Flex", "Inter", "DM Sans", "Manrope", "IBM Plex Sans", "Source Sans 3"] },
    { key: "mono", label: "Labels", options: ["Roboto Mono", "IBM Plex Mono", "JetBrains Mono", "DM Mono"] },
  ];
  const RANGE_FIELDS = [
    { key: "radius", label: "Card roundness", min: 0, max: 32, step: 1 },
    { key: "maxWidth", label: "Page width", min: 960, max: 1440, step: 20 },
  ];
  const THEME_OPTIONS = ["system", "dark", "light"];

  const isEditMode = (search) => /[?&]edit\b/.test(search);

  /** Returns a new array with items at indexA and indexB swapped. */
  function swapItems(items, indexA, indexB) {
    const copy = items.slice();
    [copy[indexA], copy[indexB]] = [copy[indexB], copy[indexA]];
    return copy;
  }

  /**
   * @param {{ store, themeController, sectionsContainer?: HTMLElement, doc?: Document }} deps
   */
  function createDesignPanel({ store, themeController, sectionsContainer, doc = document }) {
    const panel = createElement("aside", { className: "design-panel", attrs: { id: "design-panel", "aria-label": "Design panel" } }, doc.body);
    const visibilityButton = createElement("button", { text: "Hide design panel", className: "design-panel-toggle", attrs: { id: "design-toggle", type: "button" } }, doc.body);

    visibilityButton.addEventListener("click", () => {
      panel.hidden = !panel.hidden;
      visibilityButton.textContent = panel.hidden ? "Show design panel" : "Hide design panel";
    });

    // ----- small control builders -----
    const heading = (text) => createElement("h3", { text }, panel);
    const hint = (text) => createElement("p", { text, className: "design-panel-hint" }, panel);

    function labelledControl(labelText, controlTag) {
      const label = createElement("label", {}, panel);
      const caption = createElement("span", { text: labelText }, label);
      const control = createElement(controlTag, {}, label);
      return { caption, control };
    }

    function colourInput(field, theme, value) {
      const { control } = labelledControl(field.label, "input");
      control.type = "color";
      control.value = value || "#000000";
      control.addEventListener("input", () => store.update((config) => { (config[theme] = config[theme] || {})[field.key] = control.value; }));
    }

    function selectInput(labelText, options, selected, onChange) {
      const { control } = labelledControl(labelText, "select");
      options.forEach((option) => {
        const optionElement = createElement("option", { text: option, attrs: { value: option } }, control);
        if (option === selected) optionElement.selected = true;
      });
      control.addEventListener("change", () => onChange(control.value));
    }

    function rangeInput(field, value) {
      const { caption, control } = labelledControl(`${field.label} ${value}px`, "input");
      Object.assign(control, { type: "range", min: field.min, max: field.max, step: field.step, value });
      control.addEventListener("input", () => {
        caption.textContent = `${field.label} ${control.value}px`;
        store.update((config) => { config[field.key] = Number(control.value); });
      });
    }

    function sectionRows(config) {
      const sectionElements = Array.from(sectionsContainer.querySelectorAll(":scope > section[id]"));
      const allIds = [...config.sections, ...sectionElements.map((s) => s.id).filter((id) => !config.sections.includes(id))];

      allIds.forEach((id, index) => {
        const title = doc.getElementById(id)?.dataset.title || id;
        const row = createElement("div", { className: "design-panel-row" }, panel);
        const checkbox = createElement("input", { attrs: { type: "checkbox", "aria-label": `Show ${title}` } }, row);
        checkbox.checked = config.sections.includes(id);
        createElement("span", { text: title }, row);
        const moveUp = createElement("button", { text: "↑", attrs: { type: "button", "aria-label": `Move ${title} up` } }, row);
        const moveDown = createElement("button", { text: "↓", attrs: { type: "button", "aria-label": `Move ${title} down` } }, row);
        moveUp.disabled = index === 0;
        moveDown.disabled = index === allIds.length - 1;

        // Keep the visible list in the on-screen order of allIds.
        const setVisibleIds = (orderedIds, visibleIds) =>
          store.update((c) => { c.sections = orderedIds.filter((x) => visibleIds.includes(x)); });

        checkbox.addEventListener("change", () => {
          const visible = checkbox.checked ? [...config.sections, id] : config.sections.filter((x) => x !== id);
          setVisibleIds(allIds, visible);
          render(); // rows read `config` from this render, so rebuild them after each change
        });
        moveUp.addEventListener("click", () => { setVisibleIds(swapItems(allIds, index, index - 1), config.sections); render(); });
        moveDown.addEventListener("click", () => { setVisibleIds(swapItems(allIds, index, index + 1), config.sections); render(); });
      });
    }

    function actionButton(text, className, onClick) {
      const button = createElement("button", { text, className, attrs: { type: "button" } }, panel);
      button.addEventListener("click", () => onClick(button));
    }

    function downloadConfigFile() {
      const link = doc.createElement("a");
      link.href = URL.createObjectURL(new Blob([store.toConfigFile()], { type: "text/javascript" }));
      link.download = "config.js";
      doc.body.appendChild(link);
      link.click();
      link.remove();
    }

    // ----- render the whole panel from the current config -----
    function render() {
      const config = store.get();
      const theme = themeController.getTheme();
      panel.replaceChildren();

      createElement("h2", { text: "Design panel" }, panel);
      hint("Changes preview live and stay in this browser. Click “Download config.js” and replace the file to make them permanent.");

      heading(`Colours · ${theme} theme`);
      hint("Use the sun/moon button to edit the other theme. Keep text contrast at 4.5:1 or more.");
      COLOUR_FIELDS.forEach((field) => colourInput(field, theme, (config[theme] || {})[field.key]));

      heading("Theme");
      selectInput("First-visit theme", THEME_OPTIONS, config.defaultTheme || "system",
        (value) => store.update((c) => { c.defaultTheme = value; }));

      heading("Fonts");
      FONT_FIELDS.forEach((field) => selectInput(field.label, field.options, (config.fonts || {})[field.key],
        (value) => store.update((c) => { (c.fonts = c.fonts || {})[field.key] = value; })));

      heading("Shape & size");
      RANGE_FIELDS.forEach((field) => rangeInput(field, config[field.key]));

      if (sectionsContainer) {
        heading("Sections (order & visibility)");
        sectionRows(config);
      }

      heading("Save");
      actionButton("Download config.js", "design-panel-primary", downloadConfigFile);
      actionButton("Copy config to clipboard", "design-panel-wide", (button) => {
        navigator.clipboard?.writeText(store.toConfigFile()).then(() => { button.textContent = "Copied ✓"; });
      });
      actionButton("Reset to config.js", "design-panel-wide", () => { store.reset(); render(); });
    }

    themeController.onChange(render); // colour pickers follow the theme being edited
    render();
    return { render, element: panel };
  }

  return { COLOUR_FIELDS, FONT_FIELDS, RANGE_FIELDS, isEditMode, swapItems, createDesignPanel };
});
