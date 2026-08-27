import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SELECTOR = '.scroll-reveal';
const FROM = { y: 16, opacity: 0.65 };
const TWEEN = {
  duration: 0.5,
  ease: 'power2.out' as const,
};

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function fadeUp(el: Element): void {
  gsap.from(el, {
    ...FROM,
    ...TWEEN,
    immediateRender: true,
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      once: true,
      toggleActions: 'play none none none',
    },
  });
}

function fadeUpStagger(container: Element): void {
  const items = container.children;
  if (!items.length) {
    fadeUp(container);
    return;
  }

  gsap.from(items, {
    ...FROM,
    ...TWEEN,
    stagger: 0.08,
    immediateRender: true,
    scrollTrigger: {
      trigger: container,
      start: 'top 85%',
      once: true,
      toggleActions: 'play none none none',
    },
  });
}

function initScrollReveals(): void {
  if (prefersReducedMotion()) return;

  document.querySelectorAll(SELECTOR).forEach((el) => {
    if (el instanceof HTMLElement && el.dataset.reveal === 'stagger') {
      fadeUpStagger(el);
      return;
    }
    fadeUp(el);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollReveals, { once: true });
} else {
  initScrollReveals();
}
