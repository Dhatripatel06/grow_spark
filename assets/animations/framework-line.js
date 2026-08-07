import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * The framework diagram's signature moment: the connecting line draws left
 * to right, with each phase node popping in roughly as the line reaches it.
 */
export function initFrameworkLine() {
  const diagram = document.querySelector('[data-fw-diagram]');
  if (!diagram) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const line = diagram.querySelector('[data-fw-line]');
  const steps = diagram.querySelectorAll('[data-fw-step]');
  const nodes = diagram.querySelectorAll('[data-fw-node]');

  gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });
  gsap.set(steps, { opacity: 0, y: 16 });
  gsap.set(nodes, { scale: 0.55, opacity: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: diagram,
      start: 'top 75%',
      once: true,
    },
  });

  tl.to(line, { scaleX: 1, duration: 1, ease: 'power2.inOut' })
    .to(nodes, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)', stagger: 0.14 }, 0.1)
    .to(steps, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.14 }, 0.1);
}
