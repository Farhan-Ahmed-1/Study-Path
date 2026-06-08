# Prime' New Generation — System Design

> **What this is:** Prime' New Generation is a web app that helps students plan studying abroad. It lets them
> take a readiness **assessment**, compare **countries**, read a community **forum**, and **contact**
> advisors — in **5 languages** (English, Arabic, French, Spanish, Hindi) with light/dark themes.
>
> This document explains the system **as it is today** (a static front-end), then lays out a **phased
> roadmap** to grow it into a full production product. Every step is explained plainly.

---

## Table of contents

1. [The big picture (1-minute version)](#1-the-big-picture)
2. [Current architecture (what exists today)](#2-current-architecture)
3. [How each part works, step by step](#3-how-each-part-works)
4. [Data model](#4-data-model)
5. [Key user flows (diagrams)](#5-key-user-flows)
6. [Phased roadmap](#6-phased-roadmap)
7. [Non-functional requirements](#7-non-functional-requirements)
8. [Risks & decisions](#8-risks-and-decisions)

---

## 1. The big picture

Today Prime' New Generation is a **100% client-side static website**. There is **no backend, no database, no
server code**. Everything runs in the visitor's browser. Data (countries, forum threads, translations)
is hard-coded in JavaScript files. The assessment result is delivered by opening a **WhatsApp link**,
and the contact form opens the user's email client (`mailto`).

```
            ┌─────────────────────────────────────────────┐
            │                 BROWSER                      │
            │                                              │
   User ──▶ │  HTML pages  →  JS modules  →  rendered UI   │
            │   (index,        (i18n,                      │
            │    countries,     components,                │
            │    assessment,    countries,                 │
            │    forum,         assessment,                │
            │    contact)       forum, contact)            │
            │                                              │
            │  localStorage: theme + language preference   │
            └───────────────┬──────────────────────────────┘
                            │  (only outbound action today)
                            ▼
                  WhatsApp link  /  mailto email
```

**Why this design?** It is cheap, fast, and needs zero servers — perfect for a launch/MVP. The
trade-off: no accounts, no saved data, no real forum, and content edits require a developer. The
[roadmap](#6-phased-roadmap) addresses each of those.

---

## 2. Current architecture

### 2.1 Technology stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Markup | Plain HTML5, one file per page | No framework |
| Styling | Hand-written CSS (`css/styles.css`, `css/rtl.css`) | CSS variables for theming; RTL file for Arabic |
| Logic | Vanilla JavaScript (IIFE modules on `window.*`) | No build step, no bundler |
| Fonts | Google Fonts (Plus Jakarta Sans) | Loaded via CDN |
| State | `localStorage` | Stores theme + chosen language only |
| Hosting | Static file host (any) | e.g. GitHub Pages, Netlify, Vercel, S3 |

### 2.2 File / folder map

```
younus/
├── index.html             # Home / landing page
├── countries.html         # Grid of all destinations
├── country-details.html   # Single-country detail view
├── assessment.html        # 13-step readiness wizard
├── forum.html             # Community threads (mock, display-only)
├── contact.html           # Contact form (mailto)
├── travel video.mp4       # Hero background video
│
├── css/
│   ├── styles.css         # All component + layout styles, theme variables
│   └── rtl.css            # Right-to-left overrides for Arabic
│
├── i18n/                  # Translation dictionaries (one file per language)
│   ├── en.js  ar.js  fr.js  es.js  hi.js
│
└── js/
    ├── i18n.js            # Translation ENGINE (reads dictionaries, swaps text)
    ├── components.js      # Shared navbar + footer + theme + menu (every page)
    ├── countries.js       # Country DATA + rendering
    ├── assessment.js      # 13-step wizard + scoring + WhatsApp result
    ├── forum.js           # Mock threads + category filter
    └── contact.js         # Contact form handling (mailto)
```

### 2.3 How the pieces talk to each other

The app uses a **simple global-object pattern** instead of imports. Each JS file wraps itself in an
IIFE (`(function(){ ... })()`) and exposes one object on `window` — e.g. `window.I18N`,
`window.Countries`, `window.SITE`. Pages load scripts in a fixed order so dependencies exist before
they're used:

```html
<!-- order matters: dictionaries → engine → shared UI → page logic -->
<script src="i18n/en.js"></script> ... <script src="i18n/hi.js"></script>
<script src="js/i18n.js"></script>        <!-- needs the dictionaries -->
<script src="js/countries.js"></script>   <!-- needs I18N -->
<script src="js/components.js"></script>   <!-- builds navbar/footer, fires "components:ready" -->
```

Coordination happens through **custom DOM events**:

- `components:ready` — fired after the navbar/footer are injected. Pages wait for this before rendering
  their own content (see [index.html:182](index.html#L182)).
- `languagechange` — fired when the user switches language. Every module that shows text re-renders.

---

## 3. How each part works

### 3.1 Internationalization (i18n) — the heart of the app

**Goal:** the same page shows in 5 languages and flips to right-to-left for Arabic, without reloading.

**Step by step:**

1. **Dictionaries** live in `i18n/*.js`. Each is a nested object of keys → translated strings, e.g.
   `home.hero.title`. There is one file per language.
2. On page load, **`js/i18n.js` (the engine)** reads the saved language from `localStorage`
   (default English), or guesses from the browser.
3. The engine scans the DOM for any element with a **`data-i18n="some.key"`** attribute and fills in
   its text from the active dictionary. (Look at any HTML — almost every visible string is a
   `data-i18n` placeholder, e.g. [index.html:32](index.html#L32).)
4. It sets `<html lang="..">` and `dir="ltr|rtl"`. For Arabic, `dir="rtl"` activates `css/rtl.css`.
5. When the user picks a new language from the navbar switcher, the engine updates `localStorage`,
   re-translates the DOM, and **fires `languagechange`** so data-driven sections (countries, forum)
   re-render in the new language.

**Localized data fields** use a per-language map instead of a flat string. Country and forum content
do this — e.g. a region is `{ en: "Southern Europe", ar: "جنوب أوروبا", fr: ... }`. A tiny helper
`L(field)` picks the current language and falls back to English (see [countries.js:9](js/countries.js#L9)).

### 3.2 Shared components (navbar, footer, theme) — `components.js`

So we don't copy-paste the navbar into 6 HTML files, `components.js` **injects** it into placeholder
`<div id="nav-root">` and `<div id="footer-root">` on every page. It also:

- Holds **site config** in one place — brand name, WhatsApp number, email, social links
  (see [components.js:9](js/components.js#L9)). **This is the one spot to edit contact details.**
- Wires the **light/dark theme** toggle, persisted in `localStorage` under `Prime' New Generation_theme`. Note
  the tiny inline script in each page `<head>` ([index.html:6](index.html#L6)) applies the saved theme
  *before* paint to avoid a flash of the wrong theme.
- Builds the **mobile menu** and **scroll-reveal** animations.
- Fires **`components:ready`** when done.

### 3.3 Countries — `countries.js`

- A hard-coded `DATA` array; each entry has an `id`, flag emoji, tuition/living costs, proof-of-funds
  amount, intakes, work rules, a list of universities, and localized `desc`/`notes`
  (see [countries.js:16](js/countries.js#L16)).
- Three render functions: `renderHome(...)` (3 cards on the landing page), the full grid on
  `countries.html`, and the detail view on `country-details.html` (which reads `?id=spain` from the URL).
- Re-renders on `languagechange`.

### 3.4 Assessment — `assessment.js` (the most complex feature)

A **13-step wizard** that produces a "readiness score" and sends it to an advisor over WhatsApp.

**Step by step:**

1. `STEPS` is an array describing each question ([assessment.js:12](js/assessment.js#L12)). Types:
   `basic` (name/age/phone), `year`, and `options` (multiple choice).
2. Each option carries a **score `s` from 0 to 1**, and each question carries a **weight `w`**
   (e.g. "Can you prove the funds?" has `w: 3` — it matters most; cosmetic questions have `w: 0.5`).
3. Answers are kept **in memory** in an `answers` object (id → value). Nothing is persisted, so a
   refresh loses progress.
4. The wizard renders one step at a time with a progress bar; Back/Next navigate.
5. At the end it computes a **weighted average**: `score = Σ(s × w) / Σ(w)`, scaled to a percentage,
   and shows it in a circular ring (the same ring previewed on the home hero).
6. The result + the user's answers are formatted into a message and opened as a **WhatsApp link** to
   the configured number, so an advisor can follow up. (Re-renders on language change while keeping
   answers.)

### 3.5 Forum — `forum.js`

A **display-only mock**: a hard-coded `THREADS` array with author, category, reply/view counts, and
localized title/excerpt, plus a category filter (`all / visa / money / spain / france / life`). There
is **no posting, no persistence, no real users** yet — this is a visual preview of a future feature.

### 3.6 Contact — `contact.js`

A form that validates input and opens the user's email client via `mailto` (no server receives it).

---

## 4. Data model

Today "data" = JavaScript objects in source files. As we add a backend (Phase 2+), these become
database tables. Here is the conceptual model that both the current objects and the future DB share:

```
Country            Assessment (a submission)        ForumThread
─────────          ──────────────────────────       ─────────────
id (PK)            id (PK)                           id (PK)
flag               fullName, age, phone             author / userId (FK)
name               answers (JSON: q2..q13)          category
region {lang}      score (0–100)                    title {lang}
tuition            createdAt                         excerpt {lang}
living                                                replies, views
proof              User (Phase 2)                    createdAt
langs              ──────────────                    │
intake {lang}      id (PK)                           └─< ForumReply
work {lang}        email, name                            id, body, userId, createdAt
unis []            locale, role
desc {lang}        createdAt
notes {lang}
```

`{lang}` marks a field stored per-language (`{en, ar, fr, es, hi}`).

---

## 5. Key user flows

**A) Loading any page**

```
Browser requests page.html
   └─▶ <head> inline script applies saved theme (no flash)
   └─▶ dictionaries load → i18n.js translates all [data-i18n] elements
   └─▶ countries.js loads data
   └─▶ components.js injects navbar+footer → fires "components:ready"
   └─▶ page script renders its dynamic content (e.g. 3 country cards)
```

**B) Switching language**

```
User clicks language in navbar
   └─▶ i18n.js saves choice to localStorage
   └─▶ re-translates every [data-i18n] element
   └─▶ sets <html dir> (rtl for Arabic → rtl.css applies)
   └─▶ fires "languagechange" → countries/forum/assessment re-render
```

**C) Taking the assessment**

```
Start → Q1 (basic info) → Q2..Q13 (scored options)
   └─▶ each answer stored in memory
   └─▶ on finish: score = Σ(s·w)/Σ(w) × 100  → shown in ring
   └─▶ "Send to advisor" → opens WhatsApp with score + answers
```

---

## 6. Phased roadmap

This is the recommended path from today's static MVP to a robust product. Each phase is **shippable on
its own** and adds one layer of capability. Don't skip ahead — each phase assumes the previous one.

### Phase 0 — Hardening the current static site *(quick wins, days)*

Goal: make what exists solid, maintainable, and findable on Google.

- **SEO & sharing:** add per-page `<title>`/meta descriptions (partly done), Open Graph tags, a
  `sitemap.xml`, `robots.txt`, and favicons.
- **Performance:** compress `travel video.mp4` (large autoplay video hurts mobile), add `loading="lazy"`
  to offscreen images, self-host the font or `preconnect` (already partly done).
- **Accessibility:** alt text, focus states, color-contrast check, keyboard navigation through the
  wizard.
- **Analytics & consent:** add privacy-friendly analytics (e.g. Plausible) + a cookie/consent notice.
- **Quality gates:** add Prettier + ESLint and a simple GitHub Action that lints on every push.

**Exit criteria:** Lighthouse ≥ 90 across the board; site indexed; deploys are one click.

---

### Phase 1 — Build tooling & content structure *(1–2 weeks)*

Goal: make the codebase scale without changing the hosting model (still static).

- **Introduce a build step / framework.** Move from hand-wired `<script>` tags to a modern setup.
  Two good options:
  - *Lighter:* Vite + the existing vanilla JS (adds bundling, hot reload, env vars).
  - *Fuller:* a framework like **Astro** or **SvelteKit** (great for content sites, can stay static).
- **Externalize content to data files.** Move country/forum/translation data out of `.js` into
  JSON/Markdown so non-developers can edit them, ideally via a Git-based CMS (e.g. **Decap/Netlify
  CMS** or **Sanity**).
- **Componentize** the navbar/footer/cards as real components instead of string injection.

**Exit criteria:** content editors can change a country's tuition without touching code; one command
builds and deploys.

---

### Phase 2 — Backend, accounts & persistence *(3–5 weeks)*

Goal: stop losing data. Real users, saved assessments, a real contact pipeline.

- **Pick a backend.** For speed, a **Backend-as-a-Service** (Supabase or Firebase) gives you database
  + auth + storage + APIs with little server code. For more control, a small **Node/Express** or
  **Next.js API routes** service on top of **PostgreSQL**.
- **Authentication:** email magic-link / Google sign-in. Store `User` (see data model).
- **Persist assessments:** save each submission server-side (the `Assessment` table) instead of only
  firing a WhatsApp link. Users can revisit their score; advisors get a dashboard.
- **Contact → real inbox:** replace `mailto` with a server endpoint that stores the message and emails
  the team (e.g. via Resend/SendGrid), with spam protection (rate limit + captcha).
- **Security baseline:** input validation, HTTPS only, secrets in env vars, least-privilege DB access,
  row-level security if using Supabase.

**Exit criteria:** a user can create an account, take the assessment, and see it saved next visit; the
team receives contact submissions reliably.

---

### Phase 3 — Real community forum *(3–4 weeks)*

Goal: turn the mock forum into a living community.

- **CRUD threads & replies** backed by the DB (`ForumThread`, `ForumReply`).
- **Moderation:** report button, admin queue, banned-word filter, rate limiting.
- **Engagement:** likes, sorting (new/top), search, email notifications on replies.
- **Trust & safety:** spam detection, profanity filtering, GDPR-compliant data handling.

**Exit criteria:** authenticated users can post, reply, and search; moderators can act on reports.

---

### Phase 4 — Advisor workflow & CRM *(parallel, 2–4 weeks)*

Goal: convert assessments into guided journeys.

- **Advisor dashboard:** list of submissions sorted by score/recency, with status (new → contacted →
  enrolled).
- **Lead routing & WhatsApp Business API** (instead of a plain link) for templated, trackable replies.
- **Document checklist per country** so a student can track their application (passport, proof of
  funds, acceptance letter…).

**Exit criteria:** every assessment becomes a trackable lead an advisor can work end-to-end.

---

### Phase 5 — Scale, observability, automation *(ongoing)*

Goal: production-grade reliability.

- **CI/CD:** automated tests (unit for scoring, end-to-end with Playwright), preview deploys per PR.
- **Observability:** error tracking (Sentry), uptime monitoring, structured logs, dashboards.
- **Caching/CDN:** serve static assets and country pages from a CDN; cache API responses.
- **Internationalization at scale:** translation management platform (e.g. Locize/Crowdin) instead of
  hand-edited dictionaries; automated checks for missing keys.
- **Data & ML (optional):** use accumulated assessments to refine the scoring weights and recommend
  best-fit countries per profile.

**Exit criteria:** confident, frequent releases; you can see and fix problems before users report them.

---

### Roadmap at a glance

| Phase | Theme | Adds | Still static? |
|-------|-------|------|---------------|
| 0 | Hardening | SEO, perf, a11y, analytics | ✅ |
| 1 | Tooling & content | Build step, CMS, components | ✅ |
| 2 | Backend & accounts | DB, auth, saved assessments, real contact | ❌ server added |
| 3 | Forum | Real threads, moderation | ❌ |
| 4 | Advisor/CRM | Dashboard, lead tracking, WhatsApp API | ❌ |
| 5 | Scale | CI/CD, monitoring, CDN, ML | ❌ |

---

## 7. Non-functional requirements

| Area | Target |
|------|--------|
| **Performance** | First load < 2.5s on 4G; Lighthouse ≥ 90. Biggest current risk: the hero video size. |
| **Accessibility** | WCAG 2.1 AA; full keyboard support; RTL parity for Arabic. |
| **i18n** | 5 languages must stay in sync; no missing keys; numbers/dates localized. |
| **Security** | (Phase 2+) HTTPS only, validated inputs, secrets in env, rate limiting, GDPR consent. |
| **Privacy** | Assessment collects name/age/phone — needs a privacy policy and consent before storing. |
| **SEO** | Indexable pages, sitemap, structured data for country pages. |
| **Reliability** | (Phase 5) 99.9% uptime target; error budget tracked. |

---

## 8. Risks & decisions

- **No persistence today.** Assessment progress and results vanish on refresh. *Accepted for MVP;
  fixed in Phase 2.*
- **Hard-coded content.** Every country/translation edit needs a developer. *Fixed in Phase 1 (CMS).*
- **WhatsApp link as the "backend."** Works for a small team but isn't trackable or reliable at scale.
  *Upgraded to WhatsApp Business API in Phase 4.*
- **Sensitive data over `mailto`/WhatsApp.** Collecting phone numbers without a stored consent record
  is a privacy risk. *Address with a consent checkbox now and a real, secured store in Phase 2.*
- **Script-order fragility.** The global-`window` + ordered-`<script>` approach breaks easily if a file
  is reordered. *Removed by the build step in Phase 1.*
- **Large autoplay video.** Hurts mobile load and data usage. *Compress/poster-image in Phase 0.*

---

*Document owner: Prime' New Generation team. Keep this file updated as phases ship — move completed items into a
"Done" note and adjust the roadmap table.*
