/**
 * Home-page section order and visibility, driven by config.sections.
 * `planSectionLayout` is pure; `applySectionLayout` only moves/hides DOM nodes.
 */
(function register(globalScope, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else (globalScope.Portfolio = globalScope.Portfolio || {}).sections = api;
})(typeof self !== "undefined" ? self : this, function createSectionsModule() {
  "use strict";

  /**
   * Works out the final order: sections listed in config come first (in that order)
   * and are visible; any other sections keep their place at the end, hidden.
   * Unknown ids in config are ignored.
   * @returns {{ id: string, visible: boolean }[]}
   */
  function planSectionLayout(configuredOrder = [], availableIds = []) {
    const visible = configuredOrder.filter((id) => availableIds.includes(id));
    const hidden = availableIds.filter((id) => !visible.includes(id));
    return [
      ...visible.map((id) => ({ id, visible: true })),
      ...hidden.map((id) => ({ id, visible: false })),
    ];
  }

  /**
   * Reorders the <section>s inside the container and hides their nav links when hidden.
   * Links may be "#work" (same page) or "/#work" (from other pages), so match both.
   */
  function applySectionLayout(container, configuredOrder, doc = document) {
    if (!container || !Array.isArray(configuredOrder)) return [];
    const sections = Array.from(container.querySelectorAll(":scope > section[id]"));
    const plan = planSectionLayout(configuredOrder, sections.map((section) => section.id));

    for (const { id, visible } of plan) {
      const section = doc.getElementById(id);
      section.hidden = !visible;
      container.appendChild(section); // appending an existing node moves it to the end
      doc.querySelectorAll(`a[href="#${id}"], a[href$="/#${id}"]`).forEach((link) => { link.hidden = !visible; });
    }
    return plan;
  }

  return { planSectionLayout, applySectionLayout };
});
