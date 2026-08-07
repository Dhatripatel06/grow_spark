import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STAGGER = 0.08;
const DURATION = 0.7;
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
    const animTargets = children.length > 1 ? children : el;

    gsap.fromTo(
      animTargets,
      { opacity: 0, y: DISTANCE },
      {
        opacity: 1,
        y: 0,
        duration: DURATION,
        ease: 'expo.out',
        stagger: children.length > 1 ? STAGGER : 0,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      }
    );
  });
}
