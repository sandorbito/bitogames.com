// EN / HU translations for bitogames.com.
// Default language: EN. User choice is persisted in localStorage.

const TRANSLATIONS = {
  en: {
    "page.title": "BITO GAMES — Independent software & games studio",
    "page.desc": "Independent software and game development studio. Native applications and games for desktop (Linux, macOS) and mobile (iOS, iPadOS, Android). Currently in development: Project Nova — a cyberpunk city builder.",

    "nav.projects": "Projects",
    "nav.about": "About",
    "nav.contact": "Contact",

    "hero.title": "CROSS-PLATFORM",
    "hero.subtitle": "native software & games",
    "hero.tagline.html": "Independent software and game development. <strong>Native</strong> applications and games for <strong>desktop and mobile</strong> platforms.",
    "hero.status": "STATUS: PROJECT NOVA — PROTOTYPE PHASE",

    "signup.title": "// JOIN THE SIGNAL",
    "signup.desc": "Get notified when the first game drops. No spam, just launch news.",
    "signup.email.placeholder": "your@email.com",
    "signup.button": "NOTIFY ME →",
    "signup.note.html": "Or write to <a href=\"mailto:info@bitogames.com\">info@bitogames.com</a>",

    "dev.title": "// IN DEVELOPMENT",
    "dev.main.badge": "MAIN PROJECT",
    "dev.main.subtitle": "Working title · Cyberpunk City Builder",
    "dev.main.desc": "A cyberpunk city builder. Manage districts, citizens, infrastructure, and the welfare slider. Developed natively for Linux and macOS.",
    "dev.tag.builder": "City Builder",
    "dev.meta.engine": "Engine: Godot 4",
    "dev.meta.status": "Status: Prototype phase",
    "dev.meta.platforms": "Platforms: Linux, macOS",
    "dev.side.badge": "ACTIVE SIDE PROJECTS",
    "dev.side.intro": "Smaller-scale, standalone applications and experimental games. Published on isolated subpages as they ship.",
    "dev.side.swiftui.desc": "Native applications and games for the Apple ecosystem — macOS, iOS, iPadOS.",
    "dev.side.python.desc": "Developer tools, data analysis scripts, and desktop utilities.",

    "about.title": "// ABOUT",
    "about.p1.html": "BITO GAMES is an <strong>independent</strong> indie studio based on the <strong>Côte d'Azur</strong>. We build software and games <strong>natively</strong> for the platforms we love — Linux, macOS, iOS, iPadOS, Android.",
    "about.p2.html": "Core engine: <a href=\"https://godotengine.org\" target=\"_blank\" rel=\"noopener\">Godot 4</a>, with native <strong>Swift / SwiftUI</strong> for the Apple ecosystem and <strong>Python</strong> for tooling. Distributed on <a href=\"https://store.steampowered.com\" target=\"_blank\" rel=\"noopener\">Steam</a>, <a href=\"https://itch.io\" target=\"_blank\" rel=\"noopener\">Itch.io</a>, the App Store, and right here.",
    "about.quote": "Cross-platform — but always native.",

    "footer.copy": "© 2026 BITO GAMES · Côte d'Azur · Built native",
  },

  hu: {
    "page.title": "BITO GAMES — Független szoftver- és játékfejlesztő stúdió",
    "page.desc": "Független szoftver- és játékfejlesztő stúdió. Natív alkalmazások és játékok asztali (Linux, macOS) és mobil (iOS, iPadOS, Android) platformokra. Jelenlegi projekt: Project Nova — cyberpunk városépítő stratégia.",

    "nav.projects": "Projektek",
    "nav.about": "Rólunk",
    "nav.contact": "Kapcsolat",

    "hero.title": "CROSS-PLATFORM",
    "hero.subtitle": "natív szoftver és játékok",
    "hero.tagline.html": "Független szoftver- és játékfejlesztés. <strong>Natív</strong> alkalmazások és játékok <strong>asztali és mobil</strong> platformokra.",
    "hero.status": "ÁLLAPOT: PROJECT NOVA — PROTOTÍPUS FÁZIS",

    "signup.title": "// IRATKOZZ FEL",
    "signup.desc": "Szólunk, amint megjelenik az első játék. Nincs spam, csak fontos hírek.",
    "signup.email.placeholder": "te@email.com",
    "signup.button": "ÉRTESÍTS →",
    "signup.note.html": "Vagy írj ide: <a href=\"mailto:info@bitogames.com\">info@bitogames.com</a>",

    "dev.title": "// FEJLESZTÉS ALATT",
    "dev.main.badge": "FŐ PROJEKT",
    "dev.main.subtitle": "Munkacím · Cyberpunk városépítő stratégia",
    "dev.main.desc": "Cyberpunk városépítő stratégia. Kerületek, lakosok, infrastruktúra és a jóléti slider menedzselése. Fejlesztés alatt natív Linux és macOS rendszerekre.",
    "dev.tag.builder": "Városépítő",
    "dev.meta.engine": "Motor: Godot 4",
    "dev.meta.status": "Állapot: Prototípus fázis",
    "dev.meta.platforms": "Platformok: Linux, macOS",
    "dev.side.badge": "AKTÍV MELLÉKPROJEKTEK",
    "dev.side.intro": "Kisebb léptékű, önálló alkalmazások és kísérleti játékok. Izolált aloldalakon kerülnek publikálásra.",
    "dev.side.swiftui.desc": "Natív alkalmazások és játékok az Apple ökoszisztémára — macOS, iOS, iPadOS.",
    "dev.side.python.desc": "Fejlesztői eszközök, adatelemző szkriptek és asztali segédprogramok.",

    "about.title": "// RÓLUNK",
    "about.p1.html": "A BITO GAMES egy <strong>független</strong> indie stúdió a <strong>Francia Riviérán</strong>. Szoftvereket és játékokat fejlesztünk <strong>natívan</strong> azokra a platformokra, amiket szeretünk — Linux, macOS, iOS, iPadOS, Android.",
    "about.p2.html": "Fő motor: <a href=\"https://godotengine.org\" target=\"_blank\" rel=\"noopener\">Godot 4</a>, natív <strong>Swift / SwiftUI</strong> az Apple ökoszisztémára és <strong>Python</strong> az eszközökhöz. Disztribúció: <a href=\"https://store.steampowered.com\" target=\"_blank\" rel=\"noopener\">Steam</a>, <a href=\"https://itch.io\" target=\"_blank\" rel=\"noopener\">Itch.io</a>, App Store, és itt.",
    "about.quote": "Cross-platform — de mindig natív.",

    "footer.copy": "© 2026 BITO GAMES · Francia Riviéra · Natív fejlesztés",
  },
};

(function () {
  const STORAGE_KEY = "bitogames-lang";
  const DEFAULT_LANG = "en";

  function apply(lang) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];

    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] != null) el.textContent = dict[key];
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (dict[key] != null) el.innerHTML = dict[key];
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      const pairs = el.getAttribute("data-i18n-attr").split(",");
      pairs.forEach((pair) => {
        const [attr, key] = pair.split(":").map((s) => s.trim());
        if (attr && key && dict[key] != null) el.setAttribute(attr, dict[key]);
      });
    });

    if (dict["page.title"]) document.title = dict["page.title"];

    document.querySelectorAll(".lang-btn").forEach((b) => {
      b.classList.toggle("is-active", b.getAttribute("data-lang") === lang);
    });
  }

  function bind() {
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang");
        try {
          localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) { /* private mode */ }
        apply(lang);
      });
    });
  }

  function init() {
    let lang = DEFAULT_LANG;
    try {
      lang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    } catch (e) { /* private mode */ }
    bind();
    apply(lang);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
