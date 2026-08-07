# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Grow Spark Consulting — marketing site for an AI & digital transformation consultancy. Static, multi-page HTML built with Vite, styled with Tailwind CSS v4, animated with GSAP/Lenis/Swiper. No backend, no framework (no React/Vue) — pages are plain HTML composed at build time from partials.

## Commands

- `npm run dev` — start Vite dev server (port 5173)
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build

There is no test suite, linter, or type checker configured in this repo.

## Working agreement

This project is in an active visual-refresh phase. Ground rules for any change:

- Preserve existing content, copy, videos, and images — do not rewrite marketing copy, and do not rename or move asset files.
- Scope changes to layout, spacing, typography, and interactions unless a change is explicitly requested beyond that. This is a visual-quality pass, not an architecture refactor.
- Use the existing stack for interactions/animation — Tailwind CSS, GSAP, Lenis, Swiper — don't introduce new libraries.
- Prefer whitespace over borders/dividers for visual separation.
- Typography should stay fluid (`clamp()`-based), matching the existing `--fs-*` pattern in `tokens.css`.
- Hero slides must keep identical composition across all slides (same element positions/structure, only content differs).
- Verify changes at desktop, tablet, and mobile breakpoints before considering a page done.
- Work one page at a time and stop after each page for approval before moving to the next.

## Architecture

**Partial/include system (`vite.config.js`)**: Vite auto-discovers every top-level `*.html` file as a build entry (no manual entry list to maintain — dropping a new `foo.html` in the root makes it a page automatically). A custom `htmlIncludes` plugin implements SSI-style composition: `<!--@include: path/to/file.html-->` is replaced with that file's contents at build time, recursively. This is how every page shares `components/nav.html` and `components/footer.html`, and how `index.html` assembles its section partials from `sections/*.html`. When editing shared chrome (nav, footer) or a section used on multiple pages, edit the partial — not a page that includes it.

**Two page generations coexist**:
- Current pattern (`index.html`, `services.html`): minimal shell with `<!--@include: ...-->` tags pulling in `components/` and `sections/` partials, styled entirely via Tailwind utilities + `assets/css/`.
- Older standalone pages (`growth-has-stalled.html`, `launch-new-business.html`, `leadership-alignment.html`, `modernise-your-business.html`, `operations-are-inefficient.html`): self-contained files with their own inline `<style>` block and hand-rolled CSS variables, *not* wired into the include system. `_legacy-content/` holds a prior full version of the homepage kept for reference. Don't assume shared partials or Tailwind tokens apply to these standalone pages unless you migrate them.

**Design tokens (`assets/css/tokens.css`)**: colors, fonts, container widths, easing curves, and shadows are registered via Tailwind's `@theme` block, which generates matching utilities (`bg-ink`, `text-accent`, `font-display`, etc.). Fluid type scale (`--fs-*`) lives in a plain `:root` block below it since those are consumed by component CSS via `clamp()`, not Tailwind utilities. `assets/css/base.css` imports tokens and layers base element styles + reusable component classes (`.btn`, etc.) via `@layer`. Always add new design values to `tokens.css` rather than hardcoding colors/sizes in markup or component CSS.

**JS module boundaries (`assets/js/main.js`)**: the single entry point imports and calls one `init*()` function per concern — `smooth-scroll.js` (Lenis + GSAP ScrollTrigger sync), `nav.js` (sticky header, mega menu, mobile drawer, current-page highlighting), `hero-carousel.js` (Swiper video hero with buffering/play-pause), `anchor-links.js`, `service-tabs.js` (scroll-spy tab bar), and `animations/*.js` (`reveal.js` scroll-reveal, `counters.js`, `framework-line.js`, `parallax.js`). Each module is self-contained, no-ops via early return if its target elements aren't on the page, and is invoked once from `main.js`. Follow this pattern for new interactive behavior rather than adding inline `<script>` blocks.

**Scroll-reveal contract**: elements are visible by default in markup/CSS. `reveal.js` opts an element into the hidden pre-animation state immediately before animating it back in, so if JS fails to load, content never gets stuck invisible. Preserve this ordering if you touch reveal logic.

**Navigation data duplication**: the services/solutions link lists appear three times in `components/nav.html` — desktop mega-menu, mobile drawer accordion, and (for services) the JSON-LD `hasOfferCatalog` in `services.html`. When adding/removing a service or industry link, update all relevant copies, including the `#anchor` targets on `services.html` and `index.html` sections they point to.

**Assets**: `assetsInlineLimit: 0` in `vite.config.js` — videos/images are never base64-inlined, always emitted as separate files. Hero background videos live in `assets/videos/` and are lazy-loaded per-slide by `hero-carousel.js` (only the active + next slide's video gets a real `src`).
