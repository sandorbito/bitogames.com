/* =====================================================================
   matrix.js — ambient "rain" canvas for BITO Games / NOVA Universe
   Design Direction B: this is AMBIENT TEXTURE, not wallpaper.
   - very low opacity (set in CSS) + slowed cadence
   - throttled to a low frame rate so it stays cheap on M1/8GB & low-end Linux
   - single canvas, no WebGL
   - fully gated by prefers-reduced-motion (won't run at all)
   ===================================================================== */
(function () {
  "use strict";

  var canvas = document.getElementById("matrix-canvas");
  if (!canvas) return;

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Respect reduced motion: leave the canvas blank and never animate.
  if (reduceMotion) {
    canvas.style.display = "none";
    return;
  }

  var ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  // NOVA-flavoured glyph set: katakana hints + tech digits + light glyphs.
  var GLYPHS = "01アイウカキサソタヌネハユラリ<>/[]{}=*+ノ#░▒".split("");

  // Accent palette — violet-leaning with rare cyan/amber sparks.
  var COLORS = ["#8b6cff", "#8b6cff", "#8b6cff", "#2ff3ff", "#ffc14d"];

  var fontSize = 16;
  var columns = 0;
  var drops = [];          // y head position per column (in cells)
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Throttle: target ~12fps. Slow cadence = ambient, premium, low CPU.
  var FRAME_MS = 1000 / 12;
  var lastFrame = 0;
  var rafId = null;
  var running = false;

  function size() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    columns = Math.ceil(w / fontSize);
    drops = new Array(columns);
    for (var i = 0; i < columns; i++) {
      // stagger starts so the field doesn't pulse in unison
      drops[i] = Math.floor(Math.random() * -50);
    }
    ctx.font = fontSize + "px 'JetBrains Mono', monospace";
    ctx.textBaseline = "top";
  }

  function draw() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    // Fade prior frame — long trails, gentle.
    ctx.fillStyle = "rgba(7, 8, 12, 0.22)";
    ctx.fillRect(0, 0, w, h);

    for (var i = 0; i < columns; i++) {
      var x = i * fontSize;
      var y = drops[i] * fontSize;

      var glyph = GLYPHS[(Math.random() * GLYPHS.length) | 0];

      // Mostly violet; occasional accent spark for the lead glyph.
      var color = COLORS[0];
      if (Math.random() > 0.985) {
        color = COLORS[(Math.random() * COLORS.length) | 0];
      }
      ctx.fillStyle = color;
      ctx.fillText(glyph, x, y);

      // Reset column once it's well past the bottom, with random gaps.
      if (y > h && Math.random() > 0.975) {
        drops[i] = Math.floor(Math.random() * -20);
      }
      drops[i]++;
    }
  }

  function loop(now) {
    if (!running) return;
    rafId = window.requestAnimationFrame(loop);
    if (now - lastFrame < FRAME_MS) return;
    lastFrame = now;
    draw();
  }

  function start() {
    if (running) return;
    running = true;
    lastFrame = 0;
    rafId = window.requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // Pause when the tab is hidden — don't burn cycles in the background.
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else start();
  });

  // Debounced resize.
  var resizeTimer = null;
  window.addEventListener("resize", function () {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(size, 180);
  });

  size();
  start();
})();
