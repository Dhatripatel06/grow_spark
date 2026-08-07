import {
  createIcons,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Play,
  Pause,
  Linkedin,
  Workflow,
  Bot,
  MessageCircle,
  TrendingUp,
  Code2,
  Layers,
  Smartphone,
  Users,
  Boxes,
  Cloud,
  Megaphone,
  Palette,
  Compass,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
} from 'lucide';

import { initSmoothScroll } from './smooth-scroll.js';
import { initNav } from './nav.js';
import { initHeroCarousel } from './hero-carousel.js';
import { initAnchorLinks } from './anchor-links.js';
import { initServiceTabs } from './service-tabs.js';
import { initScrollReveal } from '../animations/reveal.js';
import { initCounters } from '../animations/counters.js';
import { initFrameworkLine } from '../animations/framework-line.js';
import { initHeroParallax } from '../animations/parallax.js';

// Every icon referenced anywhere on the site via data-lucide must be
// registered here — createIcons only renders the names it's given.
createIcons({
  icons: {
    Menu,
    X,
    ChevronDown,
    ArrowRight,
    Play,
    Pause,
    Linkedin,
    Workflow,
    Bot,
    MessageCircle,
    TrendingUp,
    Code2,
    Layers,
    Smartphone,
    Users,
    Boxes,
    Cloud,
    Megaphone,
    Palette,
    Compass,
    RefreshCw,
    Mail,
    Phone,
    MapPin,
  },
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
