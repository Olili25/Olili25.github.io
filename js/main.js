/* =============================================================================
   Tonny Olili — Portfolio
   Vanilla JS, no dependencies. Everything here is progressive enhancement:
   the page is fully readable and navigable with this file removed.
   ============================================================================= */

(function () {
  'use strict';

  /* ---------------------------------------------------------------------------
     CONFIG — edit these two values and the site is yours.
     FORM_ENDPOINT: paste a form service URL (Formspree, Getform, Web3Forms…)
                    to receive messages by email. Leave it empty and the form
                    falls back to opening the visitor's mail client instead.
     CONTACT_EMAIL: used by that mail-client fallback.
     ------------------------------------------------------------------------- */
  var FORM_ENDPOINT = '';
  var CONTACT_EMAIL = 'you@example.com';

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Theme ─────────────────────────────────────────────────────────────── */

  var themeToggle = $('#theme-toggle');
  var root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );
    }
    try { localStorage.setItem('theme', theme); } catch (e) { /* private mode */ }
  }

  if (themeToggle) {
    // Sync the label with whatever the inline head script already picked.
    applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

    themeToggle.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  // Follow the OS only while the visitor hasn't made an explicit choice.
  var schemeQuery = window.matchMedia('(prefers-color-scheme: light)');
  var onSchemeChange = function (e) {
    var chosen = null;
    try { chosen = localStorage.getItem('theme'); } catch (err) { /* ignore */ }
    if (!chosen) root.setAttribute('data-theme', e.matches ? 'light' : 'dark');
  };
  if (schemeQuery.addEventListener) schemeQuery.addEventListener('change', onSchemeChange);
  else if (schemeQuery.addListener) schemeQuery.addListener(onSchemeChange);

  /* ── Mobile navigation ─────────────────────────────────────────────────── */

  var navToggle = $('#nav-toggle');
  var nav = $('#primary-nav');

  function setNav(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('is-locked', open);
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      setNav(navToggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close on link click, Escape, outside click, or when we grow past mobile.
    nav.addEventListener('click', function (e) {
      if (e.target.closest('.nav__link')) setNav(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        navToggle.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (navToggle.getAttribute('aria-expanded') !== 'true') return;
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) setNav(false);
    });

    var wide = window.matchMedia('(min-width: 861px)');
    var onWide = function (e) { if (e.matches) setNav(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide);
    else if (wide.addListener) wide.addListener(onWide);
  }

  /* ── Scroll: sticky header, progress bar, back-to-top ──────────────────── */

  var header = $('#site-header');
  var progress = $('#scroll-progress');
  var toTop = $('#to-top');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    if (header) header.classList.toggle('is-stuck', y > 8);
    if (toTop) toTop.classList.toggle('is-visible', y > 600);

    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ── Reveal on scroll ──────────────────────────────────────────────────── */

  var revealables = $$('.reveal');

  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ── Scroll spy: highlight the section you're reading ──────────────────── */

  var navLinks = $$('.nav__link');
  var sections = navLinks
    .map(function (link) { return document.getElementById(link.getAttribute('href').slice(1)); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var visible = new Map();

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
        else visible.delete(entry.target.id);
      });

      var bestId = null, bestRatio = 0;
      visible.forEach(function (ratio, id) {
        if (ratio > bestRatio) { bestRatio = ratio; bestId = id; }
      });

      if (bestId) {
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + bestId);
        });
      }
    }, {
      threshold: [0.15, 0.35, 0.6],
      rootMargin: '-80px 0px -45% 0px'
    });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ── Hero typewriter ───────────────────────────────────────────────────── */

  var tw = $('#typewriter');
  var PHRASES = ['websites.', 'management systems.', 'useful software.', 'things that work.'];

  if (tw) {
    if (reduceMotion) {
      tw.textContent = PHRASES[0];
    } else {
      var pi = 0, ci = 0, deleting = false;

      var tick = function () {
        var word = PHRASES[pi];
        ci += deleting ? -1 : 1;
        tw.textContent = word.slice(0, ci);

        var delay = deleting ? 45 : 85;

        if (!deleting && ci === word.length) {
          delay = 1900;            // hold the finished phrase
          deleting = true;
        } else if (deleting && ci === 0) {
          deleting = false;
          pi = (pi + 1) % PHRASES.length;
          delay = 320;
        }
        setTimeout(tick, delay);
      };
      setTimeout(tick, 600);
    }
  }

  /* ── Contact form ──────────────────────────────────────────────────────── */

  var form = $('#contact-form');

  if (form) {
    var statusEl = $('#form-status');
    var submitBtn = $('#submit-btn');
    var btnLabel = submitBtn ? $('.btn__label', submitBtn) : null;

    // Look controls up by id rather than `form.name` — on a form element, `name`
    // is its own IDL attribute, so `form.name` is ambiguous. This never is.
    var control = function (id) { return $('#' + id, form); };

    var RULES = {
      name: function (v) {
        if (!v.trim()) return 'Please tell me your name.';
        if (v.trim().length < 2) return 'That name looks a little short.';
        return '';
      },
      email: function (v) {
        if (!v.trim()) return 'I need an email address to reply to.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'That email address doesn\'t look right.';
        return '';
      },
      message: function (v) {
        if (!v.trim()) return 'Don\'t forget the message.';
        if (v.trim().length < 10) return 'A few more words, please — at least 10 characters.';
        return '';
      }
    };

    function validateField(input) {
      var rule = RULES[input.name];
      if (!rule) return true;

      var error = rule(input.value);
      var field = input.closest('.field');
      var errorEl = $('#' + input.id + '-error');

      if (field) field.classList.toggle('is-invalid', Boolean(error));
      if (errorEl) errorEl.textContent = error;
      input.setAttribute('aria-invalid', error ? 'true' : 'false');

      return !error;
    }

    // Validate on blur; once a field is marked invalid, re-check as they type.
    $$('input, textarea', form).forEach(function (input) {
      if (!RULES[input.name]) return;

      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field && field.classList.contains('is-invalid')) validateField(input);
      });
    });

    function setStatus(message, kind) {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.className = 'form-status' + (kind ? ' is-' + kind : '');
    }

    function setBusy(busy, label) {
      if (!submitBtn) return;
      submitBtn.setAttribute('aria-busy', String(busy));
      submitBtn.disabled = busy;
      if (btnLabel) btnLabel.textContent = label;
    }

    // No endpoint configured → hand off to the visitor's mail client.
    function mailtoFallback(data) {
      var subject = 'Portfolio enquiry from ' + data.name;
      var body = data.message + '\n\n— ' + data.name + ' (' + data.email + ')';
      window.location.href = 'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      setStatus('Opening your email app — send the message from there and it reaches me.', 'success');
      setBusy(false, 'Send message');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Silent drop for bots that filled the hidden honeypot.
      var honey = control('company');
      if (honey && honey.value) {
        setStatus('Thanks! Your message has been sent.', 'success');
        form.reset();
        return;
      }

      var fields = $$('input, textarea', form).filter(function (i) { return RULES[i.name]; });
      var firstInvalid = null;

      fields.forEach(function (input) {
        if (!validateField(input) && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        setStatus('Please fix the highlighted fields.', 'error');
        firstInvalid.focus();
        return;
      }

      var data = {
        name: control('name').value.trim(),
        email: control('email').value.trim(),
        message: control('message').value.trim()
      };

      setBusy(true, 'Sending…');
      setStatus('');

      if (!FORM_ENDPOINT) { mailtoFallback(data); return; }

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed with status ' + res.status);
          form.reset();
          $$('.field', form).forEach(function (f) { f.classList.remove('is-invalid'); });
          setStatus('Thanks, ' + data.name.split(' ')[0] + '! Your message is on its way.', 'success');
        })
        .catch(function () {
          setStatus('Something went wrong. Please email me directly at ' + CONTACT_EMAIL + '.', 'error');
        })
        .then(function () {
          setBusy(false, 'Send message');
        });
    });
  }

  /* ── Footer year ───────────────────────────────────────────────────────── */

  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

})();
