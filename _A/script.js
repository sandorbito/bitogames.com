/* =====================================================================
   BITO Games — NOVA Universe
   script.js — i18n, scroll reveals, decrypt line, glitch, parallax,
               card tilt, mobile nav, signup form.
   All motion is GPU-friendly (transform/opacity) and gated by
   prefers-reduced-motion. No heavy WebGL, no autoplay video.
   ===================================================================== */

(function () {
  "use strict";

  var REDUCE = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     1. i18n — apply a language from window.TRANSLATIONS
     ------------------------------------------------------------------ */
  function detectLang() {
    var dict = window.TRANSLATIONS || {};
    var stored = null;
    try { stored = localStorage.getItem("bito-lang"); } catch (e) {}
    if (stored && dict[stored]) return stored;

    var nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    if (dict[nav]) return nav;
    return dict.en ? "en" : Object.keys(dict)[0];
  }

  function applyTranslations(lang) {
    var dict = (window.TRANSLATIONS || {})[lang];
    if (!dict) return;

    document.documentElement.setAttribute("lang", lang);

    // Text / HTML content via data-i18n
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (!(key in dict)) return;
      var val = dict[key];

      if (key.endsWith(".html")) {
        el.innerHTML = val;
      } else if (el.tagName === "TITLE") {
        el.textContent = val;
      } else if (el.tagName === "META") {
        el.setAttribute("content", val);
      } else {
        el.textContent = val;
      }
    });

    // Attribute translations via data-i18n-attr="attr:key[,attr2:key2]"
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
        var parts = pair.split(":");
        var attr = (parts[0] || "").trim();
        var key = (parts[1] || "").trim();
        if (attr && key in dict) el.setAttribute(attr, dict[key]);
      });
    });
  }

  var LANG = detectLang();
  applyTranslations(LANG);
  // expose a hook for a future language switcher
  window.setLanguage = function (lang) {
    try { localStorage.setItem("bito-lang", lang); } catch (e) {}
    applyTranslations(lang);
  };

  /* ------------------------------------------------------------------
     2. Scroll reveals — IntersectionObserver, cheap & GPU-friendly
     ------------------------------------------------------------------ */
  function initReveals() {
    var els = document.querySelectorAll(".reveal");
    if (REDUCE || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    // Light stagger within each shared parent for a "cascade" feel.
    var groups = new Map();
    els.forEach(function (el) {
      var p = el.parentElement;
      var arr = groups.get(p) || [];
      el.style.transitionDelay = Math.min(arr.length * 70, 350) + "ms";
      arr.push(el);
      groups.set(p, arr);
      io.observe(el);
    });
  }

  /* ------------------------------------------------------------------
     3. Decrypt effect on the hero status line
     ------------------------------------------------------------------ */
  function initDecrypt() {
    var el = document.querySelector("[data-decrypt]");
    if (!el) return;
    var finalText = el.textContent;

    if (REDUCE) { el.textContent = finalText; return; }

    var scramble = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*<>/";
    var frame = 0;
    var total = finalText.length;

    function tick() {
      var out = "";
      var settled = Math.floor(frame / 2);
      for (var i = 0; i < total; i++) {
        var c = finalText[i];
        if (c === " " || i < settled) {
          out += c;
        } else {
          out += scramble[(Math.random() * scramble.length) | 0];
        }
      }
      el.textContent = out;
      frame++;
      if (settled <= total) {
        setTimeout(function () { requestAnimationFrame(tick); }, 38);
      } else {
        el.textContent = finalText;
      }
    }

    // Kick off shortly after load so the hero settles first.
    setTimeout(tick, 450);
  }

  /* ------------------------------------------------------------------
     4. Glitch — rare & interaction-driven (NOT a constant loop)
     ------------------------------------------------------------------ */
  function initGlitch() {
    var el = document.querySelector("[data-glitch]");
    if (!el || REDUCE) return;

    function burst() {
      el.classList.remove("glitch-burst");
      // force reflow so the animation can re-trigger
      void el.offsetWidth;
      el.classList.add("glitch-burst");
    }
    el.addEventListener("animationend", function () {
      el.classList.remove("glitch-burst");
    });

    // On hover / focus only — premium, not seizure-y.
    el.addEventListener("mouseenter", burst);
    el.addEventListener("focus", burst);

    // One subtle burst on first reveal, then leave it alone.
    setTimeout(burst, 1400);
  }

  /* ------------------------------------------------------------------
     5. Parallax — subtle, on the universe section background tone
     ------------------------------------------------------------------ */
  function initParallax() {
    var section = document.querySelector("[data-parallax-section]");
    if (!section || REDUCE) return;

    var ticking = false;
    function update() {
      var rect = section.getBoundingClientRect();
      var vh = window.innerHeight;
      // progress -1 .. 1 as the section passes the viewport centre
      var progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      var shift = Math.max(-1, Math.min(1, progress)) * -18; // px
      section.style.setProperty("--parallax-y", shift.toFixed(1) + "px");
      var body = section.querySelector(".universe__body");
      if (body) body.style.transform = "translateY(" + shift.toFixed(1) + "px)";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  /* ------------------------------------------------------------------
     6. Card tilt — pointer-driven lift (desktop, fine pointers only)
     ------------------------------------------------------------------ */
  function initTilt() {
    var finePointer = window.matchMedia &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (REDUCE || !finePointer) return;

    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      var raf = null;
      card.addEventListener("pointermove", function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform =
            "translateY(-6px) rotateX(" + (-py * 3).toFixed(2) +
            "deg) rotateY(" + (px * 3).toFixed(2) + "deg)";
          raf = null;
        });
      });
      card.addEventListener("pointerleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ------------------------------------------------------------------
     7. Mobile nav toggle
     ------------------------------------------------------------------ */
  function initNav() {
    var toggle = document.getElementById("nav-toggle");
    var links = document.querySelector(".nav__links");
    if (!toggle || !links) return;

    function close() {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
  }

  /* ------------------------------------------------------------------
     8. Signup form — local validation + friendly feedback
        (no backend wired; swap the success block for a real POST)
     ------------------------------------------------------------------ */
  function initSignup() {
    var form = document.getElementById("signup-form");
    var input = document.getElementById("signup-email");
    var out = document.getElementById("signup-feedback");
    if (!form || !input || !out) return;

    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = input.value.trim();
      out.classList.remove("is-error");

      if (!EMAIL_RE.test(val)) {
        out.textContent = "> invalid address — check the format and retry";
        out.classList.add("is-error");
        input.focus();
        return;
      }
      // Success placeholder. Wire to a real endpoint when ready.
      out.textContent = "> signal locked · you'll hear from BITO Games";
      form.reset();
    });
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  function boot() {
    initReveals();
    initDecrypt();
    initGlitch();
    initParallax();
    initTilt();
    initNav();
    initSignup();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
