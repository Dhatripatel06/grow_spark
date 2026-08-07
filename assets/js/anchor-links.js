const HEADER_OFFSET = 96;

/**
 * Same-page hash links (mega menu, challenge cards, footer, etc.) need to
 * go through Lenis rather than the browser's native jump — otherwise
 * Lenis's own RAF loop fights the native scroll position on every frame.
 * Cross-page links (e.g. "contact.html#foo" from index.html) are left
 * alone so the browser navigates normally.
 */
export function initAnchorLinks(lenis) {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href*="#"]');
    if (!link) return;

    const url = new URL(link.href, window.location.href);
    const samePage = url.pathname === window.location.pathname;
    if (!samePage || !url.hash) return;

    const target = document.querySelector(url.hash);
    if (!target) return;

    event.preventDefault();

    if (lenis) {
      lenis.scrollTo(target, { offset: -HEADER_OFFSET, duration: 1.2 });
    } else {
      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top, behavior: 'auto' });
    }

    history.pushState(null, '', url.hash);
  });
}
