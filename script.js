// Signup form handling — graceful fallback if Formspree not configured yet.

(function () {
  const form = document.getElementById('signup-form');
  const note = document.getElementById('signup-note');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    const actionUrl = form.getAttribute('action') || '';

    // Until Formspree is configured, redirect to mailto fallback
    if (actionUrl.includes('YOUR_FORM_ID')) {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value.trim();
      if (!email) return;
      window.location.href = 'mailto:info@bitogames.com?subject=Notify%20me&body=' + encodeURIComponent('Email: ' + email + '\nNotify me when the first game drops.');
      if (note) {
        note.innerHTML = 'Email client opening — or send directly to <a href="mailto:info@bitogames.com">info@bitogames.com</a>';
      }
    }
    // Otherwise the form posts to Formspree normally
  });
})();
