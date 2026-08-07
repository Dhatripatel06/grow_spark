import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Count-up for stat numbers ([data-count-to]). Counts once, the moment the
 * number scrolls into view.
 */
export function initCounters() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('[data-count-to]');

  targets.forEach((el) => {
    const endValue = Number(el.dataset.countTo);
    const suffix = el.dataset.countSuffix || '';

    if (reducedMotion || Number.isNaN(endValue)) {
      el.textContent = `${endValue}${suffix}`;
      return;
    }

    const counter = { value: 0 };
    gsap.to(counter, {
      value: endValue,
      duration: 1.4,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        once: true,
      },
      onUpdate: () => {
        el.textContent = `${Math.round(counter.value)}${suffix}`;
      },
    });
  });
}
