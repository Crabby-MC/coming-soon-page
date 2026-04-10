/**
 * ExoraGames.io — Main JavaScript
 * Features:
 *  - Sticky navbar scroll effect
 *  - Active nav-link highlight based on scroll position
 *  - Mobile hamburger menu toggle
 *  - Smooth scroll for nav links (click + close mobile menu)
 *  - Scroll-triggered fade-in animations (IntersectionObserver)
 *  - Animated number counters for stats
 *  - Contact form submission feedback
 */

(function () {
  'use strict';

  /* ─── DOM references ─────────────────────────────── */
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const navLinks    = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const sections    = document.querySelectorAll('#home, #games, #about, #team, #contact');
  const fadeEls     = document.querySelectorAll('.fade-in');
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  const contactForm = document.getElementById('contactForm');

  /* ─── Navbar scroll effect ───────────────────────── */
  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ─── Active nav-link highlight ──────────────────── */
  function updateActiveLink() {
    const scrollMid = window.scrollY + window.innerHeight / 3;

    let current = '';
    sections.forEach(function (section) {
      if (section.offsetTop <= scrollMid) {
        current = section.getAttribute('id');
      }
    });

    allNavLinks.forEach(function (link) {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  /* ─── Mobile hamburger toggle ────────────────────── */
  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));

    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* ─── Close mobile menu on link click ────────────── */
  allNavLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ─── Close mobile menu on outside click ─────────── */
  document.addEventListener('click', function (e) {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ─── Scroll-triggered fade-in (IntersectionObserver) ─ */
  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    // Fallback: make all visible immediately
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ─── Animated counters ──────────────────────────── */
  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1600; // ms
    const start    = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach(function (el) {
      counterObserver.observe(el);
    });
  } else {
    // Fallback: set final values immediately
    statNumbers.forEach(function (el) {
      el.textContent = el.getAttribute('data-target');
    });
  }

  /* ─── Contact form feedback ──────────────────────── */
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('.form-submit');
      const original  = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Message Sent!';
      submitBtn.style.background    = '#22c55e';
      submitBtn.style.borderColor   = '#22c55e';

      setTimeout(function () {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = original;
        submitBtn.style.background   = '';
        submitBtn.style.borderColor  = '';
      }, 3000);
    });
  }
})();
