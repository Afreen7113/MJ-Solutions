document.addEventListener('DOMContentLoaded', () => {
  // ========== MOBILE NAVIGATION ==========

  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');

  function closeMobileNavIfOpen() {
    if (!navToggle || !navLinks) return;
    navLinks.classList.remove('nav__links--open');
    navToggle.classList.remove('nav__toggle--open');
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('nav__links--open');
      navToggle.classList.toggle('nav__toggle--open');
    });

    navLinks.addEventListener('click', (event) => {
      if (event.target.tagName.toLowerCase() === 'a') {
        closeMobileNavIfOpen();
      }
    });
  }

  // ========== TRUST METRICS COUNTER ANIMATION ==========

  const metricCards = document.querySelectorAll('.metric-card[data-target]');

  if (metricCards.length > 0 && 'IntersectionObserver' in window) {
    const metricsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const card = entry.target;

          if (card.dataset.animated === 'true') return;
          card.dataset.animated = 'true';

          animateMetricCard(card);
          observer.unobserve(card);
        });
      },
      { threshold: 0.5 }
    );

    metricCards.forEach((card) => metricsObserver.observe(card));
  }

  function animateMetricCard(card) {
    const numberEl = card.querySelector('.metric-number');
    if (!numberEl) return;

    const target = parseInt(card.dataset.target, 10) || 0;
    const prefix = card.dataset.prefix || '';
    const suffix = card.dataset.suffix || '';

    const duration = 1200;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(progress * target);

      numberEl.innerHTML = `${prefix}${value}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ========== SCROLL REVEAL ==========

  const revealElements = document.querySelectorAll('[data-reveal]');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // ========== AUTH MODAL (LOGIN / SIGNUP / RESET) ==========

  const authModal = document.getElementById('auth-modal');
  const openAuthEls = document.querySelectorAll('.js-open-auth');

  if (authModal && openAuthEls.length > 0) {
    const backdrop = authModal.querySelector('.auth-modal__backdrop');
    const closeBtn = authModal.querySelector('.auth-modal__close');
    const tabs = authModal.querySelectorAll('.auth-tab');
    const panels = authModal.querySelectorAll('.auth-panel');

    function showPanel(name) {
      panels.forEach((panel) => {
        panel.classList.toggle(
          'auth-panel--active',
          panel.dataset.authPanel === name
        );
      });

      // only highlight tabs for login/signup (not reset)
      tabs.forEach((tab) => {
        const isActive = tab.dataset.authTab === name;
        tab.classList.toggle('is-active', isActive);
      });
    }

    function openAuth(initial = 'login') {
      authModal.classList.add('auth-modal--open');
      document.body.classList.add('modal-open');
      showPanel(initial);
    }

    function closeAuth() {
      authModal.classList.remove('auth-modal--open');
      document.body.classList.remove('modal-open');
    }

    // Open from Get Started / Log In
    openAuthEls.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        closeMobileNavIfOpen();
        openAuth('login');
      });
    });

    // Tab clicks for login/signup
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.authTab;
        showPanel(tabName);
      });
    });

    // Event delegation inside modal: handle Forgot + Back to login
    authModal.addEventListener('click', (e) => {
      const resetLink = e.target.closest('.js-open-reset');
      if (resetLink) {
        e.preventDefault();
        showPanel('reset');      // show reset panel
        tabs.forEach((tab) => tab.classList.remove('is-active')); // no tab selected
        return;
      }

      const backLoginLink = e.target.closest('.js-back-login');
      if (backLoginLink) {
        e.preventDefault();
        showPanel('login');
        // activate login tab
        tabs.forEach((tab) => {
          tab.classList.toggle('is-active', tab.dataset.authTab === 'login');
        });
      }
    });

    // Close handlers
    closeBtn?.addEventListener('click', closeAuth);
    backdrop?.addEventListener('click', closeAuth);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAuth();
    });
  }
});