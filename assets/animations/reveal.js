import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STAGGER = 0.08;
const STAGGER_CAP = 6;
const DURATION_SINGLE = 0.7;
const DURATION_STAGGER = 0.6;
const DISTANCE = 24;

/**
 * Scroll-reveal for section-level blocks. When a [data-reveal] element has
 * more than one direct child (a card grid, a row of stat blocks, an
 * eyebrow/heading/paragraph stack), the children stagger in individually
 * instead of the whole block moving as one flat unit — that's what actually
 * reads as "card reveal" / "staggered text" rather than a single fade.
 * Framework steps are excluded — they get their own timeline in
 * framework-line.js.
 *
 * Elements are visible by default in markup/CSS; we only push them into the
 * hidden pre-animation state here, immediately before animating them back
 * in, so a JS failure never leaves content stuck invisible.
 */
export function initScrollReveal() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('[data-reveal]:not([data-fw-step])');
  if (reducedMotion) return;

  targets.forEach((el) => {
    const children = Array.from(el.children);
    const isStaggered = children.length > 1;
    const animTargets = isStaggered ? children : el;

    gsap.fromTo(
      animTargets,
      { opacity: 0, y: DISTANCE },
      {
        opacity: 1,
        y: 0,
        duration: isStaggered ? DURATION_STAGGER : DURATION_SINGLE,
        ease: 'expo.out',
        // Capped rather than a flat per-item stagger: past the 6th item the
        // remaining ones join at the 6th's delay, so long grids (e.g. a
        // 9-card outcomes list) finish revealing in a consistent window
        // instead of trailing further out the more items are added.
        stagger: isStaggered
          ? (index) => Math.min(index, STAGGER_CAP - 1) * STAGGER
          : 0,
        // Without this, GSAP leaves an inline transform/opacity on every
        // target once the tween finishes — which permanently outranks any
        // CSS :hover/:active transform on that same element (buttons,
        // .pillar-card, etc.), silently killing their hover-lift after the
        // reveal completes. Clearing hands the property back to the
        // stylesheet the moment the animation is done.
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      }
    );
  });
}
