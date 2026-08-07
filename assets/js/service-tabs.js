import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-spy for the sticky service-category tab bar: highlights whichever
 * category section currently sits under the tab bar as you scroll.
 */
export function initServiceTabs() {
  const categories = document.querySelectorAll('[data-service-category]');
  const tabs = document.querySelectorAll('[data-tab-for]');
  if (!categories.length || !tabs.length) return;

  const tabsById = new Map(
    Array.from(tabs).map((tab) => [tab.dataset.tabFor, tab])
  );

  const setActive = (id) => {
    tabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.tabFor === id));
  };

  categories.forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 140px',
      end: 'bottom 140px',
      onToggle: (self) => {
        if (self.isActive) setActive(section.id);
      },
    });
  });

  setActive(categories[0].id);
}
