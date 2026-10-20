/**
 * Config store (observer pattern).
 *
 * Holds the live design config, lets features subscribe to changes, and keeps an
 * optional draft in storage so design-panel edits survive a page reload.
 * Visitors never get a draft — only pages opened with ?edit load one.
 */
(function register(globalScope, factory) {
  const isNode = typeof module === "object" && module.exports;
  const utils = isNode ? require("./utils.js") : globalScope.Portfolio.utils;
  const api = factory(utils);
  if (isNode) module.exports = api;
  else globalScope.Portfolio.configStore = api;
})(typeof self !== "undefined" ? self : this, function createConfigStoreModule(utils) {
  "use strict";
  const { deepClone, deepMerge } = utils;

  const DRAFT_KEY = "portfolio-design-draft";

  /**
   * @param {object} defaults    The values from config.js.
   * @param {{ storage?: {get,set,remove}, useDraft?: boolean }} options
   */
  function createConfigStore(defaults, { storage, useDraft = false } = {}) {
    const baseConfig = deepClone(defaults || {});
    const subscribers = new Set();
    let config = baseConfig;

    if (useDraft && storage) {
      try {
        const draft = storage.get(DRAFT_KEY);
        if (draft) config = deepMerge(baseConfig, JSON.parse(draft));
      } catch (_) { /* a corrupt draft is ignored */ }
    }

    const notify = () => subscribers.forEach((subscriber) => subscriber(config));
    const saveDraft = () => { if (useDraft && storage) storage.set(DRAFT_KEY, JSON.stringify(config)); };

    return {
      /** Returns a copy, so callers can't mutate state behind the store's back. */
      get: () => deepClone(config),

      /** Applies a change via a function that edits a copy, e.g. update(c => { c.radius = 12 }). */
      update(mutate) {
        const next = deepClone(config);
        mutate(next);
        config = next;
        saveDraft();
        notify();
      },

      /** Drops the draft and returns to config.js values. */
      reset() {
        config = deepClone(baseConfig);
        if (storage) storage.remove(DRAFT_KEY);
        notify();
      },

      subscribe(subscriber) {
        subscribers.add(subscriber);
        return () => subscribers.delete(subscriber);
      },

      /** The text of a config.js file for the current settings. */
      toConfigFile(date = new Date()) {
        return `/* SITE CONFIG — saved from the design panel on ${date.toLocaleDateString("en-GB")}.\n` +
          "   Edit by hand, or open the site with ?edit and use the Design panel. */\n" +
          `window.SITE_CONFIG = ${JSON.stringify(config, null, 2)};\n`;
      },
    };
  }

  return { DRAFT_KEY, createConfigStore };
});
