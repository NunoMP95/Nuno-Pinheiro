/**
 * Small, dependency-free helpers shared by every feature.
 *
 * Module pattern used across /js: each file registers itself on
 * `window.Portfolio.<name>` in the browser and on `module.exports` in Node,
 * so the site works when opened straight from disk (no bundler, no server)
 * and the pure functions can be unit-tested with `node --test`.
 */
(function register(globalScope, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else (globalScope.Portfolio = globalScope.Portfolio || {}).utils = api;
})(typeof self !== "undefined" ? self : this, function createUtils() {
  "use strict";

  /** Deep copy of plain JSON-like data (config objects). */
  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  /**
   * Recursively merges `overrides` onto a copy of `base`.
   * Arrays and primitives in `overrides` replace the base value outright.
   */
  function deepMerge(base, overrides) {
    const result = deepClone(base || {});
    for (const [key, value] of Object.entries(overrides || {})) {
      const isPlainObject = value && typeof value === "object" && !Array.isArray(value);
      result[key] = isPlainObject ? deepMerge(result[key], value) : value;
    }
    return result;
  }

  /**
   * Wraps Web Storage so private browsing, blocked cookies or quota errors
   * never break the page: reads fall back to null, writes become no-ops.
   */
  function createSafeStorage(storage) {
    return {
      get(key) {
        try { return storage ? storage.getItem(key) : null; } catch (_) { return null; }
      },
      set(key, value) {
        try { if (storage) storage.setItem(key, value); } catch (_) { /* ignore */ }
      },
      remove(key) {
        try { if (storage) storage.removeItem(key); } catch (_) { /* ignore */ }
      },
    };
  }

  /** querySelector / querySelectorAll (as an array) with an optional scope. */
  const query = (selector, scope = document) => scope.querySelector(selector);
  const queryAll = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  /**
   * Creates an element, optionally sets text/attributes, and appends it.
   * @example createElement("button", { text: "Save", attrs: { type: "button" } }, panel)
   */
  function createElement(tagName, { text, className, attrs = {} } = {}, parent) {
    const element = document.createElement(tagName);
    if (text != null) element.textContent = text;
    if (className) element.className = className;
    for (const [name, value] of Object.entries(attrs)) element.setAttribute(name, value);
    if (parent) parent.appendChild(element);
    return element;
  }

  return { deepClone, deepMerge, createSafeStorage, query, queryAll, createElement };
});
