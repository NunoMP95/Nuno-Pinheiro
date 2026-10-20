/**
 * Scroll reveal and count-up numbers.
 * Both run once and are skipped entirely when the visitor prefers reduced motion.
 * Content is visible by default in CSS; these only add the effect on top.
 */
(function register(globalScope, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else (globalScope.Portfolio = globalScope.Portfolio || {}).motion = api;
})(typeof self !== "undefined" ? self : this, function createMotionModule() {
  "use strict";

  const COUNT_DURATION_MS = 1200;

  /** Starts fast, settles gently. t is progress from 0 to 1. */
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  /** Value to display at a given moment of the count-up. */
  function countValueAt(elapsedMs, target, durationMs = COUNT_DURATION_MS) {
    const progress = Math.min(Math.max(elapsedMs / durationMs, 0), 1);
    return Math.round(target * easeOutCubic(progress));
  }

  /** Animates an element's text from 0 to its data-count value. */
  function animateCount(element, { requestFrame = requestAnimationFrame, durationMs = COUNT_DURATION_MS } = {}) {
    const target = Number(element.dataset.count);
    let startTime = null;
    element.textContent = "0";
    const step = (now) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      element.textContent = String(countValueAt(elapsed, target, durationMs));
      if (elapsed < durationMs) requestFrame(step);
    };
    requestFrame(step);
  }

  /** Adds `.in` to each element the first time it scrolls into view. */
  function revealOnScroll(elements, { IntersectionObserverImpl = globalThis.IntersectionObserver } = {}) {
    if (!IntersectionObserverImpl) { elements.forEach((element) => element.classList.add("in")); return; }
    const observer = new IntersectionObserverImpl((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
  }

  /** Starts every counter once, when `trigger` (the stats row) is mostly visible. */
  function countUpWhenVisible(trigger, counters, { IntersectionObserverImpl = globalThis.IntersectionObserver } = {}) {
    if (!trigger || !counters.length || !IntersectionObserverImpl) return;
    const observer = new IntersectionObserverImpl((entries) => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      counters.forEach((counter) => animateCount(counter));
    }, { threshold: 0.4 });
    observer.observe(trigger);
  }

  function initMotion({ reducedMotion, revealElements, statsRow, counters }) {
    if (reducedMotion) {
      revealElements.forEach((element) => element.classList.add("in"));
      return;
    }
    revealOnScroll(revealElements);
    countUpWhenVisible(statsRow, counters);
  }

  return { COUNT_DURATION_MS, easeOutCubic, countValueAt, animateCount, revealOnScroll, countUpWhenVisible, initMotion };
});
