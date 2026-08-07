import Swiper from 'swiper';
import { EffectFade, Autoplay, Pagination, A11y, Keyboard } from 'swiper/modules';
import gsap from 'gsap';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const AUTOPLAY_DELAY = 7000;
const CROSSFADE_SPEED = 800;

function loadVideo(slideEl) {
  const video = slideEl.querySelector('[data-hero-video]');
  const src = slideEl.dataset.videoSrc;
  // Explicit flag rather than reading back video.src — the flag records
  // intent ("have we told this element to load") instead of relying on
  // the browser's resolved-URL readback, which is a side effect, not a
  // signal we control.
  if (!video || !src || video.dataset.loaded === 'true') return video;
  video.src = src;
  video.dataset.loaded = 'true';
  video.load();
  return video;
}

function playVideo(video) {
  if (!video) return;
  const playPromise = video.play();
  if (playPromise?.catch) playPromise.catch(() => {});
}

function pauseVideo(video) {
  video?.pause();
}

function animateSlideText(slideEl) {
  const text = slideEl?.querySelector('.hero-text');
  if (!text) return;
  const targets = text.children; // eyebrow, headline, CTA
  gsap.fromTo(
    targets,
    { opacity: 0, y: 26 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.12, overwrite: true }
  );
}

export function initHeroCarousel() {
  const container = document.querySelector('[data-hero-swiper]');
  if (!container) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const swiper = new Swiper(container, {
    // Touch/swipe navigation is on by default (allowTouchMove is not
    // disabled) — Keyboard adds left/right arrow support to match.
    modules: [EffectFade, Autoplay, Pagination, A11y, Keyboard],
    effect: 'fade',
    fadeEffect: { crossFade: true },
    speed: CROSSFADE_SPEED,
    rewind: true,
    autoplay: reducedMotion
      ? false
      : { delay: AUTOPLAY_DELAY, disableOnInteraction: false, pauseOnMouseEnter: false },
    pagination: {
      el: '[data-hero-pagination]',
      clickable: true,
      renderBullet: (index, className) =>
        `<span class="${className}"><span class="hero-pagination-fill"></span></span>`,
    },
    keyboard: { enabled: true, onlyInViewport: true },
    a11y: { enabled: true },
  });

  // First slide's video already has its real src in the markup; start it
  // (unless the visitor prefers reduced motion) and begin buffering slide two.
  const firstVideo = swiper.slides[0]?.querySelector('[data-hero-video]');
  if (!reducedMotion) {
    playVideo(firstVideo);
    animateSlideText(swiper.slides[0]);
  }
  if (swiper.slides[1]) loadVideo(swiper.slides[1]);

  const resetFills = () => {
    swiper.pagination.bullets.forEach((bullet) => {
      const fill = bullet.querySelector('.hero-pagination-fill');
      if (fill) fill.style.width = '0%';
    });
  };

  swiper.on('slideChangeTransitionStart', () => {
    const activeSlide = swiper.slides[swiper.activeIndex];
    const activeVideo = loadVideo(activeSlide);
    playVideo(activeVideo);
    animateSlideText(activeSlide);
    resetFills();

    swiper.slides.forEach((slide, index) => {
      if (index !== swiper.activeIndex) pauseVideo(slide.querySelector('[data-hero-video]'));
    });

    // Keep one slide ahead buffered so the next crossfade never shows a blank frame.
    const nextSlide = swiper.slides[(swiper.activeIndex + 1) % swiper.slides.length];
    if (nextSlide) loadVideo(nextSlide);
  });

  // Drives the per-bullet progress fill directly off Swiper's own autoplay
  // countdown, so it's always in sync — including after manual interaction.
  swiper.on('autoplayTimeLeft', (_s, _timeLeft, progress) => {
    const activeBullet = swiper.pagination.bullets[swiper.realIndex];
    const fill = activeBullet?.querySelector('.hero-pagination-fill');
    if (fill) fill.style.width = `${(1 - progress) * 100}%`;
  });

  document.addEventListener('visibilitychange', () => {
    const activeVideo = swiper.slides[swiper.activeIndex]?.querySelector('[data-hero-video]');
    if (document.hidden) {
      pauseVideo(activeVideo);
      swiper.autoplay?.stop();
    } else {
      playVideo(activeVideo);
      if (!reducedMotion) swiper.autoplay?.start();
    }
  });

  const toggle = document.querySelector('[data-hero-play-toggle]');
  const iconPause = toggle?.querySelector('[data-icon-pause]');
  const iconPlay = toggle?.querySelector('[data-icon-play]');
  let isPaused = reducedMotion;

  const applyToggleState = () => {
    const activeVideo = swiper.slides[swiper.activeIndex]?.querySelector('[data-hero-video]');
    if (isPaused) {
      pauseVideo(activeVideo);
      swiper.autoplay?.stop();
      iconPause?.classList.add('hidden');
      iconPlay?.classList.remove('hidden');
      toggle?.setAttribute('aria-pressed', 'true');
      toggle?.setAttribute('aria-label', 'Play background video slideshow');
    } else {
      playVideo(activeVideo);
      swiper.autoplay?.start();
      iconPause?.classList.remove('hidden');
      iconPlay?.classList.add('hidden');
      toggle?.setAttribute('aria-pressed', 'false');
      toggle?.setAttribute('aria-label', 'Pause background video slideshow');
    }
  };

  toggle?.addEventListener('click', () => {
    isPaused = !isPaused;
    applyToggleState();
  });

  if (reducedMotion) {
    applyToggleState();
  }
}
