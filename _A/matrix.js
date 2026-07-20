/* =====================================================================
   BITO Games — NOVA Universe
   matrix.js — ambient "rain" canvas
   --------------------------------------------------------------------
   Deliberately NOT the green wall. Glyphs fall slowly, tinted toward
   the NOVA violet / cyan palette, drawn at low opacity (set in CSS)
   so it reads as ambient texture. Single throttled rAF loop, paused
   when the tab is hidden, fully disabled under prefers-reduced-motion.
   Performance target: smooth on M1 / 8GB and low-end Linux.
   ===================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return; // gate: respect the user

  var canvas = document.getElementById("matrix-canvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  // Glyph set: katakana-ish + code symbols + digits (no pure A-Z wall)
  var GLYPHS =
    "01<>/\\[]{}=+*アイウエオカキクケコサシスセソﾊﾋﾌﾍﾎ01ﾊﾐﾑﾒﾓﾔﾕﾗﾘﾜﾝ#$%&".split("");

  // Accent tints, weighted toward NOVA violet with cyan flecks.
  var COLORS = [
    "rgba(157,107,255,",  // nova violet (most common)
    "rgba(157,107,255,",
    "rgba(157,107,255,",
    "rgba(42,245,255,",   // cyan fleck
    "rgba(255,180,61,"     // rare amber fleck (megacorp nod)
  ];

  var dpr = Math.min(window.devicePixelRatio || 1, 1.5); // cap DPR for perf
  var fontSize = 16;
  var columns = 0;
  var drops = [];     // y position (in rows) per column
  var speeds = [];    // fractional speed per column
  var tints = [];     // color index per column
  var w = 0, h = 0;

  function setup() {
    w = canvas.clientWidth = window.innerWidth;
    h = canvas.clientHeight = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    fontSize = w < 600 ? 14 : 16;
    columns = Math.floor(w / fontSize);
    drops = new Array(columns);
    speeds = new Array(columns);
    tints = new Array(columns);
    for (var i = 0; i < columns; i++) {
      drops[i] = Math.random() * -50;            // stagger start above view
      speeds[i] = 0.35 + Math.random() * 0.45;   // SLOW: fractional rows/frame
      tints[i] = (Math.random() * COLORS.length) | 0;
    }
    ctx.font = fontSize + "px 'JetBrains Mono', monospace";
    ctx.textBaseline = "top";
  }

  // Throttle to ~30fps — plenty for ambient texture, gentle on the CPU.
  var FRAME_MS = 1000 / 30;
  var last = 0;
  var running = false;

  function draw(now) {
    if (!running) return;
    requestAnimationFrame(draw);

    if (now - last < FRAME_MS) return;
    last = now;

    // Fade previous frame: low alpha = longer, softer trails.
    ctx.fillStyle = "rgba(5,6,10,0.08)";
    ctx.fillRect(0, 0, w, h);

    for (var i = 0; i < columns; i++) {
      var x = i * fontSize;
      var y = drops[i] * fontSize;

      if (y > 0) {
        var glyph = GLYPHS[(Math.random() * GLYPHS.length) | 0];
        // Leading glyph slightly brighter than the trail.
        var base = COLORS[tints[i]];
        ctx.fillStyle = base + "0.85)";
        ctx.fillText(glyph, x, y);

        // Faint second glyph just behind, for depth.
        ctx.fillStyle = base + "0.25)";
        ctx.fillText(
          GLYPHS[(Math.random() * GLYPHS.length) | 0],
          x,
          y - fontSize
        );
      }

      drops[i] += speeds[i];

      // Recycle column when it runs off the bottom (randomised).
      if (y > h && Math.random() > 0.975) {
        drops[i] = Math.random() * -20;
        speeds[i] = 0.35 + Math.random() * 0.45;
        tints[i] = (Math.random() * COLORS.length) | 0;
      }
    }
  }

  function start() {
    if (running) return;
    running = true;
    last = 0;
    requestAnimationFrame(draw);
  }
  function stop() { running = false; }

  // Pause when tab hidden — no wasted cycles in the background.
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else start();
  });

  // Debounced resize.
  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      setup();
    }, 200);
  });

  setup();
  start();
})();
