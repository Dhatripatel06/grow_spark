const SCROLL_THRESHOLD = 48;

const PANEL_CLOSED = ['opacity-0', 'invisible', '-translate-y-2'];
const PANEL_OPEN = ['opacity-100', 'visible', 'translate-y-0'];

function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  let ticking = false;
  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
    ticking = false;
  };
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function openPanel(panel, trigger, chevron) {
  panel.classList.remove(...PANEL_CLOSED);
  panel.classList.add(...PANEL_OPEN);
  trigger?.setAttribute('aria-expanded', 'true');
  chevron?.classList.add('rotate-180');
}

function closePanel(panel, trigger, chevron) {
  panel.classList.remove(...PANEL_OPEN);
  panel.classList.add(...PANEL_CLOSED);
  trigger?.setAttribute('aria-expanded', 'false');
  chevron?.classList.remove('rotate-180');
}

function initMegaMenu() {
  const groups = Array.from(document.querySelectorAll('[data-mega-group]'));
  if (!groups.length) return;

  const entries = groups.map((group) => {
    const trigger = group.querySelector('[data-mega-trigger]');
    const chevron = trigger?.querySelector('[data-mega-chevron]');
    const name = trigger?.dataset.megaTrigger;
    const panel = document.querySelector(`[data-mega-panel="${name}"]`);
    return { group, trigger, chevron, panel };
  });

  let closeTimer = null;
  const closeAll = (except) => {
    entries.forEach((entry) => {
      if (entry.panel !== except) closePanel(entry.panel, entry.trigger, entry.chevron);
    });
  };

  entries.forEach(({ group, trigger, chevron, panel }) => {
    if (!trigger || !panel) return;

    const show = () => {
      clearTimeout(closeTimer);
      closeAll(panel);
      openPanel(panel, trigger, chevron);
    };
    const scheduleHide = () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => closePanel(panel, trigger, chevron), 150);
    };

    group.addEventListener('mouseenter', show);
    group.addEventListener('mouseleave', scheduleHide);
    panel.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    panel.addEventListener('mouseleave', scheduleHide);

    // Clicking a link inside the panel navigates (or scrolls, for same-page
    // anchors) — either way the panel shouldn't stay open over the result.
    panel.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => closePanel(panel, trigger, chevron));
    });

    // Trigger is a real link to the overview page. If hover already opened
    // the panel (mouse users), let the click navigate through normally. If
    // it's still closed (keyboard users tabbing in), the first activation
    // opens the panel instead of navigating away immediately.
    trigger.addEventListener('click', (event) => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      if (!isOpen) {
        event.preventDefault();
        show();
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAll(null);
  });
  document.addEventListener('click', (event) => {
    const insideAnyGroup = entries.some(({ group, panel }) => group.contains(event.target) || panel.contains(event.target));
    if (!insideAnyGroup) closeAll(null);
  });
}

function initMobileDrawer() {
  const toggle = document.getElementById('nav-toggle');
  const closeBtn = document.getElementById('drawer-close');
  const drawer = document.querySelector('[data-drawer]');
  const backdrop = document.querySelector('[data-drawer-backdrop]');
  const panel = document.querySelector('[data-drawer-panel]');
  if (!toggle || !drawer || !backdrop || !panel) return;

  const open = () => {
    drawer.classList.remove('invisible');
    requestAnimationFrame(() => {
      backdrop.classList.remove('opacity-0');
      backdrop.classList.add('opacity-100');
      panel.classList.remove('translate-x-full');
      panel.classList.add('translate-x-0');
    });
    document.documentElement.classList.add('overflow-hidden');
    toggle.setAttribute('aria-expanded', 'true');
    closeBtn?.focus();
  };

  const close = () => {
    backdrop.classList.remove('opacity-100');
    backdrop.classList.add('opacity-0');
    panel.classList.remove('translate-x-0');
    panel.classList.add('translate-x-full');
    document.documentElement.classList.remove('overflow-hidden');
    toggle.setAttribute('aria-expanded', 'false');
    setTimeout(() => drawer.classList.add('invisible'), 450);
    toggle.focus();
  };

  toggle.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (event) => {
    if (drawer.classList.contains('invisible')) return;
    if (event.key === 'Escape') {
      close();
      return;
    }
    // Trap focus inside the open drawer — without this, tabbing past the
    // last link lands on the page content the drawer is visually covering.
    if (event.key !== 'Tab') return;
    const focusable = Array.from(panel.querySelectorAll('a[href], button:not([disabled])'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  drawer.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
}

// Directory-style routes (/services/) rather than filenames, so comparison
// is by normalized pathname, not by trailing path segment.
const normalizePath = (pathname) => pathname.replace(/index\.html$/, '').replace(/\/+$/, '') || '/';

function markCurrentPage() {
  const currentPath = normalizePath(location.pathname);
  document.querySelectorAll('.site-nav__link, .drawer-link').forEach((link) => {
    const linkPath = normalizePath(new URL(link.href, location.href).pathname);
    link.classList.toggle('is-current', linkPath === currentPath);
  });
}

export function initNav() {
  initStickyHeader();
  initMegaMenu();
  initMobileDrawer();
  markCurrentPage();
}
