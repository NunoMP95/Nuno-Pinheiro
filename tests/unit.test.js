/**
 * Unit tests for the pure parts of the site. Run with:  npm test  (or: node --test)
 * No dependencies — uses Node's built-in test runner (Node 18+).
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const { deepMerge, createSafeStorage } = require("../src/js/core/utils.js");
const { buildTokenStylesheet, paletteToDeclarations } = require("../src/js/core/tokens.js");
const { resolveTheme, createThemeController } = require("../src/js/features/theme.js");
const { planSectionLayout } = require("../src/js/features/sections.js");
const { easeOutCubic, countValueAt } = require("../src/js/features/motion.js");
const { createConfigStore, DRAFT_KEY } = require("../src/js/core/config-store.js");
const { swapItems, isEditMode } = require("../src/js/features/design-panel.js");

/** In-memory stand-in for localStorage. */
function fakeStorage(initial = {}) {
  const data = { ...initial };
  return { get: (k) => (k in data ? data[k] : null), set: (k, v) => { data[k] = v; }, remove: (k) => { delete data[k]; }, data };
}

test("deepMerge merges nested objects and replaces arrays", () => {
  const merged = deepMerge({ dark: { text: "#fff", bg: "#000" }, sections: ["a", "b"] }, { dark: { text: "#eee" }, sections: ["b"] });
  assert.deepEqual(merged, { dark: { text: "#eee", bg: "#000" }, sections: ["b"] });
});

test("createSafeStorage never throws when storage is blocked", () => {
  const throwing = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); }, removeItem() { throw new Error("blocked"); } };
  const storage = createSafeStorage(throwing);
  assert.equal(storage.get("x"), null);
  assert.doesNotThrow(() => storage.set("x", "1"));
  assert.doesNotThrow(() => storage.remove("x"));
});

test("paletteToDeclarations maps config keys to CSS variables and skips empty ones", () => {
  assert.equal(paletteToDeclarations({ background: "#021034", textDim: "#AEBBFC", accent: "" }), "--bg:#021034;--text-dim:#AEBBFC;");
});

test("buildTokenStylesheet includes fonts, radius, width and both palettes", () => {
  const css = buildTokenStylesheet({ fonts: { sans: "Roboto" }, radius: 12, maxWidth: 1100, dark: { text: "#fff" }, light: { text: "#000" } });
  assert.match(css, /--sans:'Roboto'/);
  assert.match(css, /--radius:12px;/);
  assert.match(css, /--maxw:1100px;/);
  assert.match(css, /\[data-theme=dark\]\{--text:#fff;\}/);
  assert.match(css, /\[data-theme=light\]\{--text:#000;\}/);
});

test("resolveTheme: saved choice wins, then config, then device", () => {
  assert.equal(resolveTheme({ savedTheme: "light", defaultTheme: "dark" }), "light");
  assert.equal(resolveTheme({ savedTheme: null, defaultTheme: "dark", systemPrefersLight: true }), "dark");
  assert.equal(resolveTheme({ savedTheme: null, defaultTheme: "system", systemPrefersLight: true }), "light");
  assert.equal(resolveTheme({ savedTheme: "purple", defaultTheme: "system", systemPrefersLight: false }), "dark");
});

test("theme controller toggles, remembers the choice and notifies listeners", () => {
  const attributes = { "data-theme": "dark" };
  const root = { getAttribute: (n) => attributes[n], setAttribute: (n, v) => { attributes[n] = v; } };
  const storage = fakeStorage();
  const controller = createThemeController({ root, storage, mediaQuery: null, getDefaultTheme: () => "system" });
  const seen = [];
  controller.onChange((t) => seen.push(t));
  controller.toggleTheme();
  assert.equal(controller.getTheme(), "light");
  assert.equal(storage.data.theme, "light");
  assert.deepEqual(seen, ["light"]);
});

test("theme controller follows the device only until the visitor chooses", () => {
  let changeHandler;
  const attributes = { "data-theme": "dark" };
  const root = { getAttribute: (n) => attributes[n], setAttribute: (n, v) => { attributes[n] = v; } };
  const storage = fakeStorage();
  const mediaQuery = { addEventListener: (_, handler) => { changeHandler = handler; } };
  const controller = createThemeController({ root, storage, mediaQuery, getDefaultTheme: () => "system" });
  controller.followSystemSetting();
  changeHandler({ matches: true });
  assert.equal(controller.getTheme(), "light");
  controller.setTheme("dark", { remember: true });
  changeHandler({ matches: true });
  assert.equal(controller.getTheme(), "dark");
});

test("planSectionLayout orders configured sections first and hides the rest", () => {
  assert.deepEqual(planSectionLayout(["skills", "work", "unknown"], ["work", "experience", "skills"]), [
    { id: "skills", visible: true },
    { id: "work", visible: true },
    { id: "experience", visible: false },
  ]);
});

test("count-up easing starts at 0, ends exactly on target and never overshoots", () => {
  assert.equal(easeOutCubic(0), 0);
  assert.equal(easeOutCubic(1), 1);
  assert.equal(countValueAt(0, 100), 0);
  assert.equal(countValueAt(1200, 100), 100);
  assert.equal(countValueAt(5000, 100), 100);
  assert.ok(countValueAt(600, 100) > 50, "eases out: more than half done at half time");
});

test("config store: update notifies, saves a draft in edit mode, reset restores defaults", () => {
  const storage = fakeStorage();
  const store = createConfigStore({ radius: 20, sections: ["work"] }, { storage, useDraft: true });
  let notified = 0;
  store.subscribe(() => { notified += 1; });
  store.update((c) => { c.radius = 8; });
  assert.equal(store.get().radius, 8);
  assert.equal(JSON.parse(storage.data[DRAFT_KEY]).radius, 8);
  store.reset();
  assert.equal(store.get().radius, 20);
  assert.equal(storage.data[DRAFT_KEY], undefined);
  assert.equal(notified, 2);
});

test("config store ignores drafts for visitors and survives a corrupt draft", () => {
  const storage = fakeStorage({ [DRAFT_KEY]: "{not json" });
  assert.equal(createConfigStore({ radius: 20 }, { storage, useDraft: true }).get().radius, 20);
  const visitorStorage = fakeStorage({ [DRAFT_KEY]: JSON.stringify({ radius: 2 }) });
  assert.equal(createConfigStore({ radius: 20 }, { storage: visitorStorage, useDraft: false }).get().radius, 20);
});

test("config store output is a valid config.js", () => {
  const text = createConfigStore({ radius: 20 }).toConfigFile(new Date(2026, 9, 19));
  const sandbox = {};
  new Function("window", text)(sandbox);
  assert.deepEqual(sandbox.SITE_CONFIG, { radius: 20 });
});

test("design panel helpers", () => {
  assert.deepEqual(swapItems(["a", "b", "c"], 0, 1), ["b", "a", "c"]);
  assert.ok(isEditMode("?edit"));
  assert.ok(isEditMode("?x=1&edit"));
  assert.ok(!isEditMode("?editor=1"));
});
