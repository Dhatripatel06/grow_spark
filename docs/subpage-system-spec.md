# Grow Spark — Premium Sub-Page System
### Reverse-engineering documentation for enterprise-consultancy sub-page UX, adapted to Grow Spark Consulting

**Status: documentation only. No implementation in this pass.**

---

## 0. How to read this document

This is a reverse-engineered **pattern language**, not a description of any specific competitor site. It documents the class of information architecture, layout, typography, motion, and conversion patterns used across premium enterprise digital-consultancy sub-pages (the "What We Do," "Solutions," "Case Studies," "About," and "Contact" page family common to firms like Deloitte Digital, Accenture Song, McKinsey Digital, etc.), abstracted to principles and re-expressed with 100% original Grow Spark structure, tokens, and copy direction. No text, imagery, layout markup, or brand asset from any reference site is reproduced here.

**Current repo state (checked before writing this doc, 2026-08-07):**

| Page | Status | Notes |
|---|---|---|
| Home (`pages/index.html`) | Built | Out of scope per this task |
| Services (`pages/services/index.html`) | Built | Sticky category nav, `services-hero/categories/process/cta` sections |
| Solutions hub (`pages/solutions/index.html`) | Built | Plus 5 challenge sub-pages already migrated into `pages/solutions/*/index.html` |
| Case Studies (`pages/case-studies/index.html`) | Built | Already uses the honest, methodology-first pattern this doc would have recommended — see §5 |
| About | **Not built** | No `pages/about/` yet |
| Contact | **Not built** | No `pages/contact/` yet |

This changes the practical scope of the deliverable: Services, Solutions, and Case Studies below are documented for completeness and as a **conformance spec** (to check the existing pages against, and to guide any polish pass), while About and Contact are documented as **net-new build specs**.

**Existing foundation this spec builds on (not replaces):**
- Tokens already registered in `assets/css/tokens.css`: paper/ink/accent color system (accent = `#0B5E45` deep green, `#4FCB9B` bright), Manrope (display) / Inter (body), fluid `--fs-*` clamp scale, `--ease-standard` / `--ease-out-expo` / `--ease-in-out-strong`, a 4-step shadow scale, two container widths.
- JS modules already wired in `assets/js/main.js`: `smooth-scroll.js` (Lenis), `nav.js`, `hero-carousel.js`, `anchor-links.js`, `service-tabs.js`, `animations/reveal.js`, `animations/counters.js`, `animations/framework-line.js`, `animations/parallax.js`.
- Partial/include system in `vite.config.js`: `pages/**/index.html` are routes; `components/` and `sections/*.html` are shared/composable partials.
- Section partials that already exist and are reusable across the remaining pages: `exec-summary.html`, `leadership.html`, `outcomes.html`, `trust-stats.html`, `value-strip.html`, `why-us.html`, `insights.html`, `case-study.html`, `framework.html`.

Everything below extends this system. New tokens are additive; no existing token is renamed or replaced.

---

## 1. The Enterprise Sub-Page Pattern Language (source analysis)

Before the page-by-page breakdown, the shared DNA observed across premium consultancy sub-pages, abstracted to principles:

1. **Editorial hero, not a poster.** Sub-page heroes are shorter and more restrained than homepage heroes — a left-aligned or left-weighted headline (2–4 lines), a one-sentence descriptor, breadcrumb/eyebrow context, and usually no video — because the visitor already chose this page intentionally and needs orientation, not persuasion.
2. **Problem-first, not feature-first framing.** Copy leads with the client's situation ("stalled growth," "fragmented operations") before the firm's capability. This is true even on Services pages, where each capability is framed by the business problem it resolves.
3. **Dense but scannable information architecture.** Sub-pages carry 2–4x the content of a homepage section but stay scannable through consistent card grids, sticky in-page navigation, and generous section-level whitespace rather than tight paragraphs.
4. **Sticky in-page wayfinding on long pages.** Services/Solutions-class pages use a sticky sub-nav or tab bar once the hero scrolls out, letting users jump between capability clusters without full page reloads.
5. **Proof is distributed, not concentrated.** Trust signals (stats, outcomes, client logos/quotes, methodology detail) are threaded through the page in small doses rather than dumped in one "testimonials" block at the bottom.
6. **One CTA family, repeated with escalating commitment.** A single primary action ("Book a strategy session," "Talk to us") reappears at 3–5 points down the page, each time with framing appropriate to how much trust has been built by that point in the scroll.
7. **Motion confirms hierarchy, it doesn't create it.** Reveal/stagger animation reinforces reading order (section → heading → supporting copy → cards, left-to-right or top-to-bottom) rather than being decorative. Nothing moves that wasn't already going to be read in that order.
8. **Consistent card anatomy site-wide.** Whatever the content — a service, a solution, a case study, a team bio — cards share the same anatomy: eyebrow/category tag → title → 1–2 line description → metadata row → arrow-link affordance. This is what makes a large page family feel like one system.

These eight principles are the checklist every page type below is evaluated and specified against.

---

## 2. Global Sub-Page System

Shared contract every sub-page must satisfy, regardless of type.

### 2.1 Shared hero pattern
- **Structure:** eyebrow (category label, e.g. "Solutions / Growth") → headline (2 lines max, `--fs-hero-headline` scaled down ~30–40% from homepage) → 1-sentence dek (`text-ink-soft`) → optional inline stat row or primary CTA.
- **Height:** intentionally shorter than the homepage hero — target 55–70vh, never a forced 100vh, so users see the first real content section on initial scroll on laptop viewports (≥900px tall).
- **Background:** flat `paper` or `paper-sunken`, never full-bleed video (video is a homepage-only device, per hero-carousel scope). A subtle static gradient or single soft accent shape is permitted, not a competing visual.
- **Breadcrumb:** small text trail (`Home / Solutions`) sits above the eyebrow on deeper pages (challenge sub-pages, individual case studies) for orientation; omitted on top-level hub pages (Services, Solutions, Case Studies, About, Contact).

### 2.2 Shared section spacing
- Vertical rhythm: `py-24` mobile → `py-32` desktop between major sections (matches existing section partial conventions); `py-16`/`py-20` for tightly related sub-sections within one topic.
- Section-to-section spacing is uniform down a page — no section "feels bigger" than another unless it's the hero or final CTA.
- Horizontal: content sits in `--container-page` (1180px) for text-dense sections, `--container-wide` (1400px) for card grids/galleries — same split already used by nav.

### 2.3 Shared typography scale
- Section headings: new `--fs-section-heading` tier (recommend `clamp(1.75rem, 1.4rem + 1.6vw, 3rem)`), always `font-display` (Manrope), weight 700–800.
- Card titles: `clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)`, Manrope 600–700.
- Body copy: Inter, `clamp(0.9375rem, 0.9rem + 0.15vw, 1.0625rem)`, `leading-relaxed`, `text-ink-soft`.
- Eyebrows: existing `--fs-eyebrow` token, reused everywhere — one eyebrow style for the whole site.

### 2.4 Shared card system
One base card anatomy, three visual weights:
- **Standard card** (service, solution, insight): `bg-paper-raised`, `shadow-card-sm` at rest → `shadow-card-md` on hover, `rounded-md`, 1px `hairline` border optional (prefer shadow over border per working agreement).
- **Feature card** (featured case study, framework phase): larger padding, `shadow-card-md` at rest, may include an image/graphic region.
- **Flush card** (FAQ row, timeline entry): no shadow, separated by whitespace or a single hairline, used inside accordions/lists.

### 2.5 Shared CTA system
- Primary CTA = existing `.btn` / `.btn-primary` classes, label always an action + implied low commitment ("Book a Strategy Session," not "Buy Now" or bare "Contact").
- CTA density rule: exactly one primary CTA in the hero (optional), one mid-page contextual CTA per 2–3 sections, and always the shared `final-cta.html` banner immediately before the footer.
- Every card with a detail page (service, solution, case study) ends in a text link with `btn-arrow` chevron, never a boxed button — reserves boxed buttons for the handful of true conversion actions.

### 2.6 Shared motion system
See §4 for full spec. Summary contract: every section uses the same `reveal.js` opt-in pattern (visible-by-default markup, JS adds the pre-animation hidden state), same stagger increment, same two easing curves.

### 2.7 Shared image ratios
- Card thumbnails: `4:3` (services/solutions category art) or `16:10` (case studies, wider narrative images).
- Portrait/bio imagery (About): `4:5`.
- Never crop a supplied asset to a ratio not in this list — pick the nearest and letterbox with `object-fit: cover` from a safe crop area instead of introducing a one-off ratio.

### 2.8 Shared background treatments
Three tokens only, reused site-wide: `paper` (default), `paper-sunken` (section differentiation, e.g. alternating bands), `ink` (rare, high-contrast close-out sections like final CTA or footer lead-in). No new background colors introduced per page.

### 2.9 Shared footer behavior
Existing `components/footer.html` is unchanged by this spec — every sub-page includes it identically via `@include`. No page-specific footer variants.

---

## 3. Motion System Specification

Expressed as an implementation-ready spec for the existing GSAP + Lenis + `reveal.js` stack — no new libraries.

| Parameter | Value | Notes |
|---|---|---|
| Reveal trigger offset | `top 85%` of viewport | Element starts animating slightly before fully in view |
| Reveal distance | `y: 24px → 0` | Subtle, never a large slide (no `y: 100`) |
| Reveal duration | `0.7s` single elements, `0.6s` per item in a stagger | Longer than a hover transition, shorter than a page transition |
| Reveal easing | `--ease-out-expo` | Fast start, soft landing — matches existing token |
| Stagger increment | `0.08s` between siblings | Card grids, nav lists, stat rows |
| Stagger cap | max 6 items get individual delay; 7th+ inherit the 6th's delay | Prevents long grids from feeling slow to finish |
| Hover transition (cards) | `0.3s`, `--ease-standard` | Shadow `sm → md`, optional `translateY(-4px)` |
| Hover transition (buttons) | `0.2s`, `--ease-standard` | Background/border color + `btn-arrow` translateX(2px) |
| Image zoom on card hover | `scale(1.04)`, `0.5s`, `--ease-standard`, `overflow: hidden` wrapper | Never zoom the card itself, only the inner image layer |
| Scroll-linked (parallax) | Existing `parallax.js` intensity retained: hero media only, ±40px max travel | Not applied to sub-page content sections — reserved for hero media per current `initHeroParallax` scope |
| Counters | Existing `counters.js` — trigger once at `top 80%`, ease `power2.out`, duration scales with value magnitude (already implemented) | Reuse as-is for new stat blocks (About, Contact trust strip) |
| Sticky sub-nav transition | Background/shadow fade `0.3s` on scroll-past-hero threshold | Matches header's existing `transition-[background-color,border-color,box-shadow] duration-[400ms]` pattern |
| Page-load feel | No full-page transition/loader — content is visible immediately, reveal animations run on first scroll | Consistent with the scroll-reveal contract: never block content behind JS |

**Reduced motion:** every rule above must respect `prefers-reduced-motion: reduce` — reveal shows elements at final state instantly, parallax/zoom disabled, hover transitions shortened to `0.01ms` per existing convention if already implemented in `reveal.js`/`parallax.js` (verify during Phase 8, §9).

---

## 4. Design Tokens — additions to `tokens.css`

Existing tokens (color, font, container, ease, shadow) are retained unchanged. This is the delta needed to cover everything referenced in this spec.

```css
@theme {
  /* --- spacing scale (section rhythm) --- */
  --space-section-y-mobile: 6rem;   /* py-24 */
  --space-section-y-desktop: 8rem;  /* py-32 */
  --space-section-y-tight: 4rem;    /* py-16, related sub-sections */

  /* --- radius scale --- */
  --radius-sm: 6px;    /* tags, pills */
  --radius-md: 12px;   /* cards, current default */
  --radius-lg: 20px;   /* feature cards, hero media frames */
  --radius-full: 999px; /* eyebrow pills, avatar */

  /* --- blur scale (glass/overlay treatments, used sparingly) --- */
  --blur-sm: 8px;   /* sticky sub-nav backdrop when over media */
  --blur-md: 16px;  /* modal/drawer backdrops */

  /* --- border scale --- */
  --border-hairline: 1px;
  --border-emphasis: 1.5px; /* active tab / focus-adjacent states */

  /* --- opacity scale --- */
  --opacity-disabled: 0.4;
  --opacity-muted-media: 0.85;  /* image over dark overlay */
  --opacity-scrim: 0.5;         /* drawer/modal backdrop, matches existing bg-ink/50 */

  /* --- z-index scale --- */
  --z-base: 0;
  --z-sticky-subnav: 30;
  --z-header: 50;        /* matches existing z-50 on #site-header */
  --z-drawer: 60;        /* matches existing z-[60] on #mobile-drawer */
  --z-skip-link: 200;    /* matches existing focus:z-[200] */
}

:root {
  /* --- typography scale additions --- */
  --fs-section-heading: clamp(1.75rem, 1.4rem + 1.6vw, 3rem);
  --fs-card-title: clamp(1.0625rem, 1rem + 0.3vw, 1.25rem);
  --fs-body: clamp(0.9375rem, 0.9rem + 0.15vw, 1.0625rem);
  --fs-stat-figure: clamp(2rem, 1.6rem + 1.8vw, 3.5rem);
}
```

No new color tokens are proposed — the existing paper/ink/accent system already covers every surface and state needed across Services, Solutions, Case Studies, About, and Contact.

---

## 5. Page-by-Page Analysis

Each page documents: objective, user intent, hero, typography, CTA strategy, section order (existing, if built — or specified, if net-new), content density, visual rhythm, motion, scroll choreography, conversion points, trust elements, enterprise UX patterns, and mobile adaptation.

### 5.1 Services — *conformance check* (already built)

| Dimension | Spec |
|---|---|
| Objective | Convert "what do you actually do" curiosity into a scoped conversation |
| User intent | Comparison shopping across capabilities; may arrive via a specific service anchor link from nav |
| Above-the-fold | Eyebrow + headline + dek only — no cards visible without scroll (confirmed by hero + sticky-nav-on-scroll pattern) |
| Hero | Short editorial hero, `services-hero.html` |
| Typography hierarchy | Category headers > service card titles > descriptions, per §2.3 |
| CTA strategy | Sticky category tab bar (`service-tabs.js`) doubles as navigation *and* engagement signal; `services-cta.html` closes the page |
| Section order | `services-hero → services-categories (sticky tab-scoped) → services-process → services-cta` |
| Content density | High — 13 services across 4 categories, mitigated by tab-scoped grouping |
| Visual rhythm | Alternating `paper`/`paper-sunken` bands per category cluster |
| Motion | Tab underline slides on scroll-spy change (`service-tabs.js`); cards reveal-stagger on entry |
| Scroll choreography | Scroll-spy updates active tab as user passes each category section — core interaction of this page |
| Conversion points | Sticky tab CTA button + `services-cta.html` |
| Trust-building | Process section demonstrates method, not just menu of services |
| Enterprise UX pattern | Sticky in-page nav over long content — textbook capability-page pattern |
| Mobile adaptation | Tab bar becomes horizontally scrollable chip row; category sections stack full-width |

**Original Grow Spark structure (target state):** `Hero → Sticky Category Tabs (AI & Automation / Software & Product / Enterprise Systems / Growth & Brand) → Process (how an engagement runs) → Final CTA`. This matches what's built; no structural change recommended, only a polish pass under Phase 8/9.

### 5.2 Solutions — *conformance check* (already built)

| Dimension | Spec |
|---|---|
| Objective | Let a visitor self-identify by business challenge or industry, then walk a problem → framework → outcome narrative |
| User intent | "This is my situation — do you understand it, and can you fix it?" |
| Above-the-fold | Eyebrow + headline framed as the *problem* ("Growth has stalled"), not the service |
| Hero | `solutions-hero.html`, challenge-specific headline on the 5 sub-pages |
| Typography hierarchy | Problem statement (largest) → framework phase labels → outcome stats |
| CTA strategy | `solutions-cta.html`; framework section itself acts as a soft-conversion trust device |
| Section order (hub) | `solutions-hero → industries → challenges → solutions-process → solutions-cta` |
| Section order (challenge sub-page) | `hero (problem-framed) → framework.html (phase walkthrough) → outcomes.html → solutions-cta` |
| Content density | Medium — narrative-driven, fewer but longer content blocks than Services |
| Visual rhythm | `framework-line.js` draws a connecting line/progress spine through phases — the signature Solutions-page device |
| Motion | Framework line animates in sync with scroll position (scroll-linked, not just reveal-on-enter) |
| Scroll choreography | Problem → framework phase 1..n → outcome is a linear narrative; no tab/jump navigation (unlike Services) — this is intentional per problem-first storytelling |
| Conversion points | End of framework walkthrough (peak trust) + final CTA |
| Trust-building | Outcome stats (`outcomes.html`, `counters.js`) tied directly to the specific challenge just described |
| Enterprise UX pattern | Challenge-to-solution narrative flow — the "problem-first storytelling" pattern from §1 |
| Mobile adaptation | Framework line collapses to a vertical spine; phases stack, still animate on scroll |

**Original Grow Spark structure (target state):** matches what's built — 5 challenge pages (`growth-has-stalled`, `modernise-your-business`, `launch-new-business`, `operations-are-inefficient`, `leadership-alignment`) each following `Hero → Framework → Outcomes → CTA`, plus a hub page that routes by industry and by challenge. No structural change recommended.

### 5.3 Case Studies — *already implements the honest, methodology-first approach requested*

The brief asked for an honest alternative given no real clients exist yet. The build already does this — confirmed via `pages/case-studies/index.html` meta description: *"How Grow Spark documents every engagement — the real starting point, the specific decisions made, the team who executed, and a verifiable result. Case studies published as engagements complete."*

| Dimension | Spec |
|---|---|
| Objective | Establish credibility through **documented methodology and standards**, not fabricated results |
| User intent | "Have they actually done this before, and how do they work?" |
| Above-the-fold | Hero frames the page as a *commitment* — what a case study will contain once published, not a promise of existing proof |
| Hero | `case-studies-hero.html` |
| Typography hierarchy | Commitment statement > standard/criteria list > (future) case study titles |
| CTA strategy | `case-studies-cta.html` — invites a direct conversation in lieu of browsing proof, appropriate to zero-case-study state |
| Section order | `case-studies-hero → case-study (template/example) → case-studies-standard (the documentation standard itself) → case-studies-cta` |
| Content density | Deliberately lower than Services/Solutions — this page's substance *is* its restraint |
| Visual rhythm | Single flush narrative rather than a dense grid, correct for the current zero-case-study state |
| Motion | Standard reveal only — no card grid, so no stagger-heavy grid choreography needed yet |
| Scroll choreography | Linear read: promise → standard → what's-next CTA |
| Conversion points | CTA only (no per-case-study links to click through, by necessity) |
| Trust-building | Radical transparency ("here is our standard, judge us by it") substitutes for social proof — the correct honest-alternative pattern |
| Enterprise UX pattern | This *is* the honest-methodology pattern the brief asked to design — already shipped |
| Mobile adaptation | Straightforward single-column flow, low risk |

**Recommendation:** no structural rebuild needed. When the first real engagement completes, extend `case-studies-standard.html` into a real grid (using the Standard/Feature card system from §2.4) rather than restructuring the page — the current shell is designed to absorb that growth.

### 5.4 About — **net-new build spec**

| Dimension | Spec |
|---|---|
| Objective | Convert "is this a real, credible operator" doubt into confidence for a small/founder-led consultancy — About pages carry disproportionate trust weight when there's no case-study proof yet |
| User intent | Vetting the people and standards behind the firm before a discovery call |
| Above-the-fold | Eyebrow ("About") + a direct positioning statement (who Grow Spark is and who it's for) — resist a generic "we believe" mission-statement opener |
| Hero | Standard sub-page hero (§2.1), no imagery required — this page earns trust through specificity of text and process, not a portrait wall |
| Typography hierarchy | Positioning statement (headline) → operating principles (section headings) → supporting proof |
| CTA strategy | One contextual CTA after the operating-principles section, one final CTA before footer |
| Section order | `about-hero → mission/positioning (reuse exec-summary.html pattern) → operating principles / values (3–4 cards) → how-we-work (reuse framework.html or why-us.html) → leadership (reuse leadership.html) → final-cta` |
| Content density | Medium — About pages should read fast; this is a confidence page, not a capability catalog |
| Visual rhythm | Alternate `paper`/`paper-sunken` per section, consistent with global system |
| Motion | Standard reveal + stagger on principle cards; reuse `counters.js` only if there's a genuine quantifiable stat (years operating, engagements run) — do not invent metrics |
| Scroll choreography | Positioning → principles → method → people → CTA; linear, trust-building narrative, similar shape to Solutions but about the firm rather than a client problem |
| Conversion points | Mid-page CTA + final CTA |
| Trust-building | `leadership.html` (already exists as a section partial) is the credibility anchor — real names/roles, no invented headcount or "global offices" framing appropriate to Deloitte-scale firms |
| Enterprise UX pattern | Mission → values → proof-of-expertise → people, the standard About shape, scaled honestly for a smaller/founder-led firm — avoid patterns that only work at enterprise scale (e.g., don't fabricate an "our history" timeline if the firm doesn't have one yet; a "how we operate" section is more honest and useful here) |
| Mobile adaptation | Principle cards stack 1-column; leadership cards stack with photo-left/text-right becoming stacked |

**Original Grow Spark structure:** `Hero → Positioning/Mission → Operating Principles (3–4 cards) → How We Work → Leadership → Final CTA`. Reuses `exec-summary.html`, `why-us.html`, `leadership.html`, `final-cta.html` almost entirely as-is — **no new section partials required**, only a new `about-hero.html` and possibly an `operating-principles.html` (or repurpose the card grid pattern from `services-categories.html`).

### 5.5 Contact — **net-new build spec**

| Dimension | Spec |
|---|---|
| Objective | Remove all friction between "convinced" and "booked" |
| User intent | Ready to act — this user has the highest intent of anyone on the site; the page must not introduce doubt or delay |
| Above-the-fold | Short hero + the form (or a clear path to it) visible without excessive scrolling — Contact is the one sub-page where hero height should be minimal |
| Hero | Minimal: eyebrow + one-line headline ("Let's talk about [outcome]"), no dek needed |
| Typography hierarchy | Form labels and the primary CTA button are the visual focus, not display type |
| CTA strategy | The form submit *is* the CTA — no competing secondary CTA above the fold |
| Section order | `contact-hero (minimal) → contact-form + contact-options (two-column: form left, direct-contact card right) → what-happens-next (response-time expectation, sets honest expectation) → trust-strip (reuse trust-stats.html or why-us.html, low-key) ` |
| Content density | Lowest of any sub-page by design — this page should feel fast and light |
| Visual rhythm | Two-column split (form / context card) on desktop, single column stacked on mobile |
| Motion | Minimal — form fields should not stagger-reveal (adds friction to task completion); reserve reveal animation for the supporting trust-strip only |
| Scroll choreography | Almost none — this page is largely one screen; avoid manufacturing scroll depth for its own sake |
| Conversion points | The form itself is the only conversion point — everything else on the page exists to reduce hesitation before submitting it |
| Trust-building | "What happens next" (e.g., response-time commitment, what the first call covers) does more trust work here than logos or stats — sets honest, specific expectations |
| Enterprise UX pattern | Conversion-first layout: form hierarchy (name/email/company → project type → message, in that order, shortest-path-to-submit), direct alternative contact (email/LinkedIn) beside the form for users who don't want to fill a form, no embedded map (Grow Spark is not location-dependent — omit the map pattern entirely rather than force a generic one in) |
| Mobile adaptation | Form first, direct-contact card follows below (not beside); sticky submit button optional if the form is long |

**Original Grow Spark structure:** `Hero (minimal) → Form + Direct Contact (2-col split) → What Happens Next (3-step expectation setter) → Light Trust Strip → Footer`. New section partials needed: `contact-hero.html`, `contact-form.html`, `contact-options.html`, `contact-next-steps.html`. Reuses `trust-stats.html` for the closing strip.

---

## 6. Component Inventory

| Component | Status | Where |
|---|---|---|
| Page Hero | Exists (per-page variant) | `services-hero.html`, `solutions-hero.html`, `case-studies-hero.html`; **new:** `about-hero.html`, `contact-hero.html` |
| Eyebrow | Exists | `.eyebrow` utility class, used everywhere |
| Section Header | Implicit in each section partial | Formalize as shared markup pattern, not a new file |
| Service Card | Exists | Inside `services-categories.html` |
| Solution Card | Exists | Inside `industries.html` / `challenges.html` |
| Case Study Card | Partial | `case-study.html` (single/template); grid variant deferred until real case studies exist |
| Stat Block | Exists | `trust-stats.html`, driven by `counters.js` |
| Timeline | **Missing** | Not currently needed (About recommends principles-over-timeline, §5.4) — build only if a real company history warrants it |
| Process Step | Exists | `services-process.html`, `solutions-process.html`, `framework.html` |
| Quote Block | **Missing** | Optional for About/leadership if a real quote exists; do not fabricate placeholder quotes |
| Leadership Card | Exists | `leadership.html` |
| Contact Card | **New** | `contact-options.html` |
| FAQ Accordion | **Missing** | Not currently used on Services despite brief mentioning it — evaluate need in Phase 3 polish; drawer accordion pattern (`.drawer-accordion` in `nav.html`) is the reusable base if added |
| CTA Banner | Exists | `final-cta.html`, `services-cta.html`, `solutions-cta.html`, `case-studies-cta.html`; **new:** none — `contact-next-steps.html` replaces the CTA-banner role on Contact since the form itself is the CTA |
| Footer CTA | Exists | Inside `components/footer.html` |
| Social Row | Exists | Footer (LinkedIn icon already imported in `main.js`) |
| Sticky Sub-Nav | Exists | `service-tabs.js` (Services only) |

Every "Missing/New" row above is the actual delta this project needs — everything else is reuse.

---

## 7. Project Architecture

The repo has already converged on the correct architecture for this system — this section documents it as the standard to build About/Contact against, not a proposal to change anything.

```
pages/
  index.html                                  (home — out of scope)
  services/index.html                         ✓ built
  solutions/index.html                        ✓ built (hub)
  solutions/growth-has-stalled/index.html      ✓ built
  solutions/launch-new-business/index.html     ✓ built
  solutions/leadership-alignment/index.html    ✓ built
  solutions/modernise-your-business/index.html ✓ built
  solutions/operations-are-inefficient/index.html ✓ built
  case-studies/index.html                      ✓ built
  about/index.html                             ← new (Phase 6)
  contact/index.html                           ← new (Phase 7)

components/
  nav.html            (shared, unchanged)
  footer.html          (shared, unchanged)

sections/
  # shared across pages
  final-cta.html, exec-summary.html, why-us.html, leadership.html,
  trust-stats.html, value-strip.html, insights.html, framework.html,
  outcomes.html

  # services-specific
  services-hero.html, services-categories.html, services-process.html, services-cta.html

  # solutions-specific
  solutions-hero.html, solutions-process.html, solutions-cta.html
  (industries.html, challenges.html, pillars.html — used on home/solutions hub)

  # case-studies-specific
  case-studies-hero.html, case-study.html, case-studies-standard.html, case-studies-cta.html

  # about-specific (new)
  about-hero.html, operating-principles.html   ← Phase 6

  # contact-specific (new)
  contact-hero.html, contact-form.html, contact-options.html, contact-next-steps.html ← Phase 7

assets/
  css/  (tokens.css + base.css — additive changes only, per §4)
  js/   (main.js + one init*() module per concern — no new libraries per working agreement)
  images/, icons/, videos/, fonts/  (unchanged — no asset renaming/moving)
```

**Shared vs. page-specific:** `components/*` and the "shared across pages" section group are used by every page including About/Contact. Everything else is scoped to exactly one page family, matching the existing convention — no section partial is currently over-shared or duplicated in a way this spec needs to fix.

---

## 8. SEO & Performance

| Concern | Approach |
|---|---|
| Semantic HTML | One `<h1>` per page (hero headline), section headings as `<h2>`, card titles as `<h3>` — audit About/Contact against this when built; existing pages already appear to follow it based on hero markup reviewed |
| Heading hierarchy | No skipped levels; sticky sub-nav labels are not headings (they're nav `<a>` text) |
| Meta strategy | Every page: unique `<title>`, `<meta description>`, canonical URL, OG + Twitter card tags — confirmed present on Case Studies; replicate exactly for About/Contact |
| Structured data | `Organization` schema site-wide (footer or home); Case Studies could add `Article`/`CreativeWork` per case study once real ones exist; Contact page benefits from `ContactPoint` schema; avoid `Review`/`AggregateRating` schema entirely until real reviews exist |
| Image strategy | Supplied assets only, correct ratio per §2.7, `loading="lazy"` below the fold, explicit `width`/`height` to prevent layout shift |
| Lazy loading | Below-fold images/video lazy by default; hero-carousel already scopes video `src` to active+next slide only — same discipline applies to any future About/Contact media |
| Font loading | Existing `<link rel="preconnect">` + Google Fonts `display=swap` pattern, reused as-is — no new fonts introduced |
| LCP | Hero headline text is the LCP element on every sub-page (no hero video/image blocking it) — this is actually an LCP *advantage* of the shorter, text-first sub-page hero pattern in §2.1 |
| CLS prevention | Reserve space for sticky-nav height shift, image aspect boxes, and font swap (fallback stack already matches metric-compatible system fonts) |
| Interaction performance | GSAP/Lenis work already isolated per-module with early-return no-ops when target elements are absent (per existing `main.js` pattern) — new About/Contact modules (if any) must follow the same contract |
| 60fps requirement | All motion in §3 uses `transform`/`opacity` only, no layout-triggering properties animated — verify this holds for any new component built in Phase 6/7 |

---

## 9. Implementation Phases

Per your instruction, implementation proceeds in exactly these phases, one at a time, stopping for approval after each. Status reflects what the codebase already satisfies vs. what remains.

| Phase | Scope | Status |
|---|---|---|
| 1 — Shared Design System | Add tokens from §4 to `tokens.css` (spacing/radius/blur/border/opacity/z-index scales) | **Remaining** — small, additive |
| 2 — Shared Components | Build missing components from §6: `contact-options.html` card, FAQ accordion (if adopted), formalized section-header pattern | **Remaining** |
| 3 — Services | Polish pass against §5.1 conformance table | **Mostly done** — verify only |
| 4 — Solutions | Polish pass against §5.2 conformance table | **Mostly done** — verify only |
| 5 — Case Studies | Polish pass against §5.3 conformance table | **Mostly done** — verify only |
| 6 — About | Build net-new per §5.4 | **Remaining** — full build |
| 7 — Contact | Build net-new per §5.5 | **Remaining** — full build |
| 8 — Motion & Polish | Apply §3 motion spec uniformly across all 6 sub-page types; desktop/tablet/mobile verification per working agreement | **Remaining** |
| 9 — Performance & Accessibility | Audit against §8; reduced-motion coverage; heading-hierarchy pass | **Remaining** |

Phases 3–5 are lighter-weight than a full build since the pages exist — they're a verification/conformance pass against this spec rather than new construction. Phases 1, 2, 6, 7, 8, 9 are the real remaining work.

---

**End of documentation. Waiting for approval before any implementation phase begins.**
