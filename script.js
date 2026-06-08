/* =====================================================================
   script.js — BITO Games / NOVA Universe
   - i18n hydration from translations.js (text + HTML keys + attributes)
   - nav: scrolled glass state + mobile menu
   - scroll reveals (IntersectionObserver, GPU-friendly, light stagger)
   - hero status: decrypt / typewriter on load
   - subtle parallax on the universe timeline panel
   - rare, interaction-tied glitch on the hero title
   - signup form validation + faux submit
   All motion is gated by prefers-reduced-motion.
   ===================================================================== */
(function () {
  "use strict";

  var REDUCE = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --------------------------- i18n ---------------------------------
     EN is the source of truth; unknown locales fall back to EN.
     - [data-i18n]            : key for text / .html keys (innerHTML)
     - [data-i18n-attr]       : "attr:key[,attr2:key2]" attribute mapping
     The dictionary is trusted (authored locally), so .html injection
     and attribute writes are safe.                                     */
  function applyI18n(lang) {
    var dict = (window.TRANSLATIONS && window.TRANSLATIONS[lang]) ||
               (window.TRANSLATIONS && window.TRANSLATIONS.en) || {};

    // Text / HTML content
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (!(key in dict)) return;
      var value = dict[key];

      if (key.slice(-5) === ".html") {
        el.innerHTML = value;
      } else if (el.tagName === "TITLE") {
        el.textContent = value;
      } else if (el.tagName === "META") {
        el.setAttribute("content", value);
      } else {
        el.textContent = value;
      }
    });

    // Attribute translations: data-i18n-attr="attr:key[,attr2:key2]"
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
        var parts = pair.split(":");
        var attr = (parts[0] || "").trim();
        var key = (parts[1] || "").trim();
        if (attr && key in dict) el.setAttribute(attr, dict[key]);
      });
    });

    document.documentElement.lang = lang;
  }

  // Pick best available locale; default EN. (Extra dicts can be added later.)
  function pickLang() {
    var avail = window.TRANSLATIONS ? Object.keys(window.TRANSLATIONS) : ["en"];
    var stored = null;
    try { stored = localStorage.getItem("bito-lang"); } catch (e) {}
    if (stored && avail.indexOf(stored) !== -1) return stored;
    var nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    return avail.indexOf(nav) !== -1 ? nav : "en";
  }

  var currentLang = pickLang();
  applyI18n(currentLang);

  /* ---------------------- LANGUAGE SWITCHER -------------------------
     Reflects the active language on the segmented EN / HU / 中文 control
     and lets the user switch. Choice persists via window.setLanguage.   */
  var langButtons = document.querySelectorAll(".lang-switch__btn");

  function syncLangButtons(lang) {
    langButtons.forEach(function (btn) {
      var active = btn.getAttribute("data-lang") === lang;
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      btn.classList.toggle("is-active", active);
    });
  }
  syncLangButtons(currentLang);

  if (langButtons.length) {
    langButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var lang = btn.getAttribute("data-lang");
        if (!lang || lang === currentLang) return;
        window.setLanguage(lang);
      });
    });
  }

  /* ------------------------ NAV behaviour --------------------------- */
  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("nav-toggle");
  var navLinks = document.querySelector(".nav__links");

  // Scrolled state (glass background). Passive listener, rAF-throttled.
  if (nav) {
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        nav.classList.toggle("is-scrolled", window.scrollY > 24);
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Mobile menu toggle.
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* --------------------- SCROLL REVEALS ----------------------------- */
  var reveals = document.querySelectorAll(".reveal");
  if (REDUCE || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // Light stagger for siblings within a group.
        var delay = 0;
        var group = el.parentElement;
        if (group) {
          var sibs = Array.prototype.filter.call(
            group.children,
            function (c) { return c.classList.contains("reveal"); }
          );
          delay = Math.min(sibs.indexOf(el), 5) * 80;
        }
        el.style.transitionDelay = delay + "ms";
        el.classList.add("is-in");
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    reveals.forEach(function (el) { io.observe(el); });
  }

  /* -------------------- HERO STATUS: decrypt ------------------------ */
  var statusEl = document.getElementById("hero-status");
  if (statusEl) {
    var finalText = (window.TRANSLATIONS && window.TRANSLATIONS[currentLang] &&
                     window.TRANSLATIONS[currentLang]["hero.status"]) ||
                    statusEl.textContent;

    if (REDUCE) {
      statusEl.textContent = finalText;
      statusEl.classList.add("is-done");
    } else {
      statusEl.textContent = "";
      var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%*<>/";
      var i = 0;
      var settled = "";

      function decryptStep() {
        if (i > finalText.length) {
          statusEl.textContent = finalText;
          statusEl.classList.add("is-done");
          return;
        }
        settled = finalText.slice(0, i);
        // a couple of scrambling chars trailing the settled head
        var noise = "";
        var noiseLen = Math.min(3, finalText.length - i);
        for (var n = 0; n < noiseLen; n++) {
          var c = finalText[i + n];
          noise += (c === " ")
            ? " "
            : charset[(Math.random() * charset.length) | 0];
        }
        statusEl.textContent = settled + noise;
        i++;
        setTimeout(decryptStep, 38);
      }
      setTimeout(decryptStep, 650);
    }
  }

  /* ---------------- PARALLAX (universe panel) ----------------------- */
  var parallaxEls = document.querySelectorAll("[data-parallax]");
  if (!REDUCE && parallaxEls.length) {
    var pTicking = false;
    function parallax() {
      if (pTicking) return;
      pTicking = true;
      window.requestAnimationFrame(function () {
        var vh = window.innerHeight;
        parallaxEls.forEach(function (el) {
          var rect = el.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > vh) return;  // offscreen: skip
          var speed = parseFloat(el.getAttribute("data-parallax")) || 0.15;
          var centre = rect.top + rect.height / 2 - vh / 2;
          var shift = -(centre * speed);
          el.style.transform = "translate3d(0," + shift.toFixed(1) + "px,0)";
        });
        pTicking = false;
      });
    }
    window.addEventListener("scroll", parallax, { passive: true });
    window.addEventListener("resize", parallax, { passive: true });
    parallax();
  }

  /* --------------- GLITCH: rare + interaction-tied ------------------ */
  var heroTitle = document.querySelector(".hero__title[data-glitch]");
  if (heroTitle && !REDUCE) {
    var glitching = false;
    function fireGlitch() {
      if (glitching) return;
      glitching = true;
      heroTitle.classList.add("is-glitching");
      setTimeout(function () {
        heroTitle.classList.remove("is-glitching");
        glitching = false;
      }, 340);
    }
    // Trigger on hover/focus — not a constant 3–4s loop.
    heroTitle.addEventListener("mouseenter", fireGlitch);
    heroTitle.setAttribute("tabindex", "0");
    heroTitle.addEventListener("focus", fireGlitch);
    // One welcome glitch shortly after the decrypt settles.
    setTimeout(fireGlitch, 2600);
  }

  /* ----------------------- SIGNUP FORM ------------------------------ */
  var form = document.getElementById("signup-form");
  var emailInput = document.getElementById("signup-email");
  var msg = document.getElementById("signup-msg");

  if (form && emailInput && msg) {
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setMsg(text, kind) {
      msg.textContent = text;
      msg.classList.remove("is-ok", "is-err");
      if (kind) msg.classList.add(kind);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = emailInput.value.trim();

      if (!EMAIL_RE.test(val)) {
        emailInput.classList.add("is-invalid");
        setMsg("> Invalid signal address. Check the email and retry.", "is-err");
        emailInput.focus();
        return;
      }

      emailInput.classList.remove("is-invalid");
      // No backend wired yet — acknowledge locally.
      setMsg("> Signal locked. You're on the list — watch your inbox.", "is-ok");
      form.reset();
    });

    emailInput.addEventListener("input", function () {
      emailInput.classList.remove("is-invalid");
    });
  }

  // Language switch entry point (persists choice + re-hydrates the page).
  window.setLanguage = function (lang) {
    if (!window.TRANSLATIONS || !window.TRANSLATIONS[lang]) return;
    try { localStorage.setItem("bito-lang", lang); } catch (e) {}
    currentLang = lang;
    applyI18n(lang);
    syncLangButtons(lang);
  };
})();
