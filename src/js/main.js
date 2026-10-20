/**
 * Entry point: wires the feature modules together.
 * Each feature is independent; this file is the only place that knows about all of them,
 * so adding a feature means writing a module and adding one line to `startPortfolio`.
 */
(function startPortfolio(win, doc) {
  "use strict";
  const { utils, tokens, configStore, theme, mobileMenu, sections, motion, designPanel } = win.Portfolio;
  const { query, queryAll, createSafeStorage } = utils;

  const storage = createSafeStorage(win.localStorage);
  const editMode = designPanel.isEditMode(win.location.search);
  const store = configStore.createConfigStore(win.SITE_CONFIG, { storage, useDraft: editMode });
  const sectionsContainer = query("#sections");

  // Design tokens + section layout always reflect the store (and re-run on every change).
  const applyConfig = (config) => {
    tokens.applyTokens(config, doc);
    sections.applySectionLayout(sectionsContainer, config.sections, doc);
  };
  applyConfig(store.get());
  store.subscribe(applyConfig);

  const themeController = theme.createThemeController({
    root: doc.documentElement,
    storage,
    mediaQuery: win.matchMedia(theme.LIGHT_QUERY),
    getDefaultTheme: () => store.get().defaultTheme,
  });
  themeController.bindToggleButtons(queryAll("[data-theme-toggle]"), query('meta[name="theme-color"]'));
  themeController.followSystemSetting();

  mobileMenu.createMobileMenu({ button: query(".burger"), menu: query("#menu"), win, doc });

  motion.initMotion({
    reducedMotion: win.matchMedia("(prefers-reduced-motion: reduce)").matches,
    revealElements: queryAll(".reveal"),
    statsRow: query(".stats"),
    counters: queryAll("[data-count]"),
  });

  queryAll(".year").forEach((element) => { element.textContent = String(new Date().getFullYear()); });

  if (editMode) designPanel.createDesignPanel({ store, themeController, sectionsContainer, doc });
})(window, document);
