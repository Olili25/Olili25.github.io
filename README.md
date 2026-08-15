# Tonny Olili — Portfolio

A fast, accessible, single-page portfolio built from scratch with plain HTML, CSS and
JavaScript. No frameworks, no build step, no dependencies — open `index.html` and it runs.

Rebuilt from the original two-file site (`index.html` + `style.css`) served at
`192.168.100.75`, keeping all of the original content.

---

## Quick start

```bash
# any static server works — pick one
python3 -m http.server 8000
npx serve .
```

Then open <http://localhost:8000>. You can also just double-click `index.html`.

---

## Make it yours (start here)

Three small edits and the site is fully personalised:

| What | Where |
|------|-------|
| **Email, GitHub, LinkedIn links** | `index.html` — search for `TODO`, in the Contact section |
| **Contact form delivery** | `js/main.js` — `FORM_ENDPOINT` and `CONTACT_EMAIL` at the top |
| **Live URL for SEO/social cards** | `index.html` — replace `https://example.com/` in `<link rel="canonical">` and the `og:`/`twitter:` tags |

### Getting the contact form to actually deliver mail

The site is static, so it has no server to receive a form post. Two options:

1. **Leave `FORM_ENDPOINT` empty** (the default). The form validates the input, then opens
   the visitor's mail app with everything pre-filled to `CONTACT_EMAIL`. Works everywhere,
   no signup.
2. **Paste a form-service URL** into `FORM_ENDPOINT` — [Formspree](https://formspree.io),
   [Web3Forms](https://web3forms.com) and [Getform](https://getform.io) all have free tiers
   and accept a JSON POST. Messages then land in your inbox without the visitor leaving
   the page.

### Colours

Every colour is one HSL token at the top of `css/styles.css`. Change these three and the
whole site re-themes, both light and dark:

```css
--brand-1: 214 90% 54%;   /* primary blue   */
--brand-2: 260 84% 62%;   /* violet         */
--accent:   38 96% 56%;   /* amber highlight */
```

---

## What's in here

```
.
├── index.html          # all markup, one page
├── css/styles.css      # design tokens + components, organised in 12 sections
├── js/main.js          # ~250 lines, no dependencies
├── assets/
│   ├── tonny-olili.jpeg
│   └── favicon.svg
└── README.md
```

## Features

**Design**
- Light & dark themes — follows your OS by default, with a toggle that remembers your
  choice. No flash of the wrong theme on load.
- Fluid typography and spacing via `clamp()` — scales smoothly from 320px to ultrawide
  without a stack of breakpoints.
- Animated aurora background, gradient text, glassmorphic cards, hover states throughout.

**Accessibility**
- Semantic landmarks, a skip link, and a logical heading order.
- Full keyboard support: the mobile menu traps nothing but closes on `Esc`, outside click
  and link activation; every interactive element has a visible focus ring.
- Correct ARIA on the nav toggle (`aria-expanded`/`aria-controls`), form errors
  (`role="alert"`, `aria-describedby`, `aria-invalid`) and status messages (`aria-live`).
- Honours `prefers-reduced-motion` — all animation, the typewriter and smooth scrolling
  stand down.

**Behaviour**
- Scroll-spy nav highlighting, reading-progress bar, sticky blurred header, back-to-top.
- Reveal-on-scroll via `IntersectionObserver`, with a graceful fallback.
- Contact form with inline validation, friendly error copy, busy state, and a honeypot
  field to soak up bots.

**Performance & SEO**
- Zero external requests — no CDN, no web fonts, no analytics. Works fully offline.
- Scroll handlers batched into `requestAnimationFrame`; observers disconnect once done.
- Descriptive meta tags, Open Graph + Twitter cards, and JSON-LD `Person` structured data.
- Print stylesheet, so the page prints as a clean CV-style document.

---

## Deploying

It's static, so anywhere works. Push the folder to a repo and enable **GitHub Pages**, or
drag it onto **Netlify** / **Vercel** / **Cloudflare Pages**. Nothing to build.

## Browser support

All current browsers. Uses `IntersectionObserver`, CSS custom properties, `clamp()` and
`backdrop-filter` — each degrades gracefully rather than breaking.
