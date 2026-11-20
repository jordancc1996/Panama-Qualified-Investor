const SELECTOR = '.scroll-reveal';
const DURATION_MS = 500;
const DISTANCE_PX = 12;
const THRESHOLD = 0.15;
const STAGGER_MS = 80;
const EASING = 'ease-out';

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function visibleRatio(el: Element): number {
  const rect = el.getBoundingClientRect();
  if (rect.height <= 0) return 0;
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
  return Math.max(0, visible) / rect.height;
}

function isAlreadyVisible(el: Element): boolean {
  return visibleRatio(el) >= THRESHOLD;
}

function clearMotion(el: HTMLElement): void {
  el.style.opacity = '1';
  el.style.transform = 'none';
  el.style.transition = 'none';
  el.style.willChange = 'auto';
}

function prepareHidden(el: HTMLElement): void {
  el.style.opacity = '0';
  el.style.transform = `translateY(${DISTANCE_PX}px)`;
  el.style.transition = 'none';
  el.style.willChange = 'opacity, transform';
}

function animateIn(el: HTMLElement, delayMs = 0): void {
  el.style.transition = [
    `opacity ${DURATION_MS}ms ${EASING} ${delayMs}ms`,
    `transform ${DURATION_MS}ms ${EASING} ${delayMs}ms`,
  ].join(', ');
  void el.offsetWidth;
  el.style.opacity = '1';
  el.style.transform = 'translateY(0)';
  const cleanup = () => {
    el.style.willChange = 'auto';
    el.removeEventListener('transitionend', cleanup);
  };
  el.addEventListener('transitionend', cleanup);
}

function revealElement(el: HTMLElement): void {
  if (el.dataset.reveal === 'stagger') {
    const items = Array.from(el.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement
    );
    if (!items.length) {
      animateIn(el);
      return;
    }
    items.forEach((item, index) => {
      animateIn(item, index * STAGGER_MS);
    });
    return;
  }

  animateIn(el);
}

function showImmediately(el: HTMLElement): void {
  clearMotion(el);
  if (el.dataset.reveal === 'stagger') {
    Array.from(el.children).forEach((child) => {
      if (child instanceof HTMLElement) clearMotion(child);
    });
  }
}

function prepareElement(el: HTMLElement): void {
  if (el.dataset.reveal === 'stagger') {
    Array.from(el.children).forEach((child) => {
      if (child instanceof HTMLElement) prepareHidden(child);
    });
    clearMotion(el);
    return;
  }
  prepareHidden(el);
}

function initScrollReveals(): void {
  const elements = Array.from(document.querySelectorAll(SELECTOR)).filter(
    (el): el is HTMLElement => el instanceof HTMLElement
  );

  if (!elements.length) return;

  if (prefersReducedMotion()) {
    elements.forEach(showImmediately);
    return;
  }

  const pending: HTMLElement[] = [];

  elements.forEach((el) => {
    // Above-the-fold content must render immediately (protects LCP / first paint).
    if (isAlreadyVisible(el)) {
      showImmediately(el);
      return;
    }
    prepareElement(el);
    pending.push(el);
  });

  if (!pending.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.intersectionRatio < THRESHOLD) return;
        const el = entry.target;
        if (!(el instanceof HTMLElement)) return;
        revealElement(el);
        observer.unobserve(el);
      });
    },
    { threshold: THRESHOLD }
  );

  pending.forEach((el) => observer.observe(el));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollReveals, { once: true });
} else {
  initScrollReveals();
}
