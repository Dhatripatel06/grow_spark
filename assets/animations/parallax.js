import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * One deliberate parallax moment, not scattered everywhere: as the hero
 * scrolls out of view, its text layer recedes slightly slower than the
 * scroll — a classic, subtle cinematic depth cue. Scoped to the text only
 * (not the video) so it can't disturb the video's own sizing/crossfade.
 */
export function initHeroParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.to('.hero-text', {
    yPercent: 18,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
}
