/**
 * Phone menu: a disclosure button that shows/hides the mobile navigation.
 * Closes on link click, on Escape (returning focus to the button), and when the
 * window grows past the desktop breakpoint.
 */
(function register(globalScope, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else (globalScope.Portfolio = globalScope.Portfolio || {}).mobileMenu = api;
})(typeof self !== "undefined" ? self : this, function createMobileMenuModule() {
  "use strict";

  const DESKTOP_BREAKPOINT_PX = 900; // keep in sync with the @media rule in styles.css

  function createMobileMenu({ button, menu, win = window, doc = document }) {
    if (!button || !menu) return null;

    const isOpen = () => button.getAttribute("aria-expanded") === "true";

    function setOpen(open) {
      button.setAttribute("aria-expanded", String(open));
      menu.classList.toggle("open", open);
    }

    button.addEventListener("click", () => setOpen(!isOpen()));
    menu.addEventListener("click", (event) => { if (event.target.closest("a")) setOpen(false); });
    doc.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen()) { setOpen(false); button.focus(); }
    });
    win.addEventListener("resize", () => { if (win.innerWidth > DESKTOP_BREAKPOINT_PX) setOpen(false); });

    return { isOpen, open: () => setOpen(true), close: () => setOpen(false) };
  }

  return { DESKTOP_BREAKPOINT_PX, createMobileMenu };
});
