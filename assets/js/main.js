import { createIcons, Menu, X, ChevronDown, ArrowRight, Play, Pause, Linkedin } from 'lucide';

import { initSmoothScroll } from './smooth-scroll.js';
import { initNav } from './nav.js';
import { initHeroCarousel } from './hero-carousel.js';
import { initAnchorLinks } from './anchor-links.js';
import { initServiceTabs } from './service-tabs.js';
import { initScrollReveal } from '../animations/reveal.js';
import { initCounters } from '../animations/counters.js';
import { initFrameworkLine } from '../animations/framework-line.js';
import { initHeroParallax } from '../animations/parallax.js';

createIcons({
  icons: { Menu, X, ChevronDown, ArrowRight, Play, Pause, Linkedin },
});

const lenis = initSmoothScroll();
initNav();
initHeroCarousel();
initAnchorLinks(lenis);
initServiceTabs();
initScrollReveal();
initCounters();
initFrameworkLine();
initHeroParallax();
