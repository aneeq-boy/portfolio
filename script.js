/*
  Portfolio behavior for Aneeq Ahmed's site.
  Two jobs:
    1. Render Lucide icons from the data-lucide attributes in the markup.
    2. Fade sections in as they scroll into view (skipped for reduced-motion).
*/

function drawIcons() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

// 1. Draw all Lucide icons. The CDN script defines the global `lucide`.
drawIcons();

// 1b. Light / dark theme toggle.
//     The initial theme is applied by the inline bootstrap in <head>.
//     Here we sync the button icon and handle clicks, persisting the choice.
(function () {
  var toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  function currentTheme() {
    var attr = document.documentElement.getAttribute("data-theme");
    if (attr === "light" || attr === "dark") return attr;
    // No explicit choice yet: fall back to what the OS prefers.
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function syncIcon() {
    // Show the icon for the theme you would switch TO.
    var next = currentTheme() === "dark" ? "sun" : "moon";
    toggle.innerHTML = '<i data-lucide="' + next + '"></i>';
    drawIcons();
  }

  toggle.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    syncIcon();
  });

  syncIcon();
})();

// 1c. If the profile photo file is missing, show a clean initials fallback
//     instead of a broken-image icon.
(function () {
  var photo = document.getElementById("profile-photo");
  if (!photo) return;
  function showFallback() {
    var box = photo.parentNode;
    if (!box) return;
    box.innerHTML = '<div class="avatar-fallback" aria-label="Aneeq Ahmed">A</div>';
  }
  photo.addEventListener("error", showFallback);
  // Handle the case where the image already failed before this ran.
  if (photo.complete && photo.naturalWidth === 0) showFallback();
})();

// 2. Scroll reveal. Elements start hidden in CSS and get .in when they enter view.
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var items = document.querySelectorAll(".reveal");

  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(function (el) { io.observe(el); });
})();
