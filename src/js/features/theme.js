/**
 * Light / dark theme.
 *
 * Loaded synchronously in <head> (before styles paint) so `applyInitialTheme`
 * can set data-theme without a flash of the wrong theme. Has no dependencies.
 *
 * Rules:
 *  1. A theme the visitor picked with the toggle wins (saved in localStorage).
 *  2. Otherwise config.defaultTheme: "dark", "light" or "system" (device setting).
 *  3. With "system" and no saved choice, the page follows device changes live.
 */
(function register(globalScope, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else (globalScope.Portfolio = globalScope.Portfolio || {}).theme = api;
})(typeof self !== "undefined" ? self : this, function createTheme() {
  "use strict";

  const THEMES = ["dark", "light"];
  const STORAGE_KEY = "theme";
  const LIGHT_QUERY = "(prefers-color-scheme: light)";

  const isTheme = (value) => THEMES.includes(value);

  /** Pure decision function — easy to unit-test every combination. */
  function resolveTheme({ savedTheme, defaultTheme = "system", systemPrefersLight = false }) {
    if (isTheme(savedTheme)) return savedTheme;
    if (isTheme(defaultTheme)) return defaultTheme;
    return systemPrefersLight ? "light" : "dark";
  }

  function readSavedTheme(storage) {
    try { return storage ? storage.getItem(STORAGE_KEY) : null; } catch (_) { return null; }
  }

  /** Runs once in <head>: marks JS as available and sets the starting theme. */
  function applyInitialTheme(win = window) {
    const root = win.document.documentElement;
    root.classList.add("js");
    const config = win.SITE_CONFIG || {};
    root.setAttribute("data-theme", resolveTheme({
      savedTheme: readSavedTheme(win.localStorage),
      defaultTheme: config.defaultTheme,
      systemPrefersLight: win.matchMedia(LIGHT_QUERY).matches,
    }));
  }

  /**
   * Controller for the running page. Browser APIs are injected so tests can pass fakes.
   * @param {{ root: HTMLElement, storage: {get,set}, mediaQuery: MediaQueryList, getDefaultTheme: () => string }} deps
   */
  function createThemeController({ root, storage, mediaQuery, getDefaultTheme }) {
    const listeners = new Set();

    const getTheme = () => (root.getAttribute("data-theme") === "light" ? "light" : "dark");

    function setTheme(theme, { remember = false } = {}) {
      if (!isTheme(theme)) return;
      root.setAttribute("data-theme", theme);
      if (remember) storage.set(STORAGE_KEY, theme);
      listeners.forEach((listener) => listener(theme));
    }

    const toggleTheme = () => setTheme(getTheme() === "dark" ? "light" : "dark", { remember: true });

    /** Follow device changes only until the visitor has made their own choice. */
    function followSystemSetting() {
      if (!mediaQuery || !mediaQuery.addEventListener) return;
      mediaQuery.addEventListener("change", (event) => {
        const visitorHasChosen = isTheme(storage.get(STORAGE_KEY));
        if (!visitorHasChosen && (getDefaultTheme() || "system") === "system") {
          setTheme(event.matches ? "light" : "dark");
        }
      });
    }

    /** Keeps toggle buttons' accessible names and the browser UI colour in sync. */
    function bindToggleButtons(buttons, themeColorMeta) {
      const syncUi = (theme) => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        buttons.forEach((button) => button.setAttribute("aria-label", `Switch to ${nextTheme} theme`));
        if (themeColorMeta) {
          const background = getComputedStyle(root).getPropertyValue("--bg").trim();
          if (background) themeColorMeta.setAttribute("content", background);
        }
      };
      buttons.forEach((button) => button.addEventListener("click", toggleTheme));
      listeners.add(syncUi);
      syncUi(getTheme());
    }

    const onChange = (listener) => { listeners.add(listener); return () => listeners.delete(listener); };

    return { getTheme, setTheme, toggleTheme, followSystemSetting, bindToggleButtons, onChange };
  }

  return { THEMES, STORAGE_KEY, LIGHT_QUERY, resolveTheme, applyInitialTheme, createThemeController };
});
