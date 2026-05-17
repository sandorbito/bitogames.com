// Matrix rain — canvas background animation.
// Optimized: low FPS, low alpha, GPU-friendly.

(function () {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Katakana + alphanumeric chars give the iconic Matrix look
  const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789';
  const charArray = chars.split('');

  let fontSize = 16;
  let columns = 0;
  let drops = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = new Array(columns).fill(1).map(() => Math.random() * -100);
  }

  resize();
  window.addEventListener('resize', resize);

  let lastTime = 0;
  const interval = 60; // ms between frames — slower = more readable, less CPU

  function draw(now) {
    if (now - lastTime > interval) {
      // Fade previous frame, gives the trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = fontSize + "px 'Share Tech Mono', monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Head of the drop is brighter
        if (Math.random() > 0.975) {
          ctx.fillStyle = '#aaffaa';
        } else {
          ctx.fillStyle = '#00ff41';
        }
        ctx.fillText(text, x, y);

        // Reset drop randomly when off-screen
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      lastTime = now;
    }
    requestAnimationFrame(draw);
  }

  // Pause when tab hidden to save CPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // animation naturally pauses since rAF stops
    }
  });

  requestAnimationFrame(draw);
})();
