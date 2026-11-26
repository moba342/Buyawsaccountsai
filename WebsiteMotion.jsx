import { useEffect } from 'react';

const surfaces =
  '.account-card,.provider-showcase-card,.account-purchase-panel,.page-intro-panel,.home-hero,.footer-callout,.public-seller-card,.seller-details-panel';
const entrances = `${surfaces
  .split(',')
  .filter((s) => s !== '.home-hero')
  .join(
    ',',
  )},.account-process>ol>li,.account-workloads>*,.home-section-heading,.process-item,.page-intro-copy>*,.home-hero-content>*,.account-page-hero-copy>*,.guide-card,.faq-page>details,.account-faq>details`;
const motionButtons =
  'a.primary,button.primary,a.secondary,button.secondary,.header-button,.header-pricing,.provider-showcase-action,.account-card-actions>button';
const heroParts =
  '.home-hero-content>*,.page-intro-copy>*,.account-page-hero-copy>*';

// Event-driven lighting: one layer and at most one frame, with no idle render loop.
export default function WebsiteMotion({ routeKey, paused }) {
  useEffect(() => {
    if (paused) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    const seen = new WeakSet();
    const animations = new Set();
    const sheenNodes = new Set();
    const activeSheens = new WeakMap();
    let observer,
      ambientObserver,
      mutations,
      frame = 0,
      target = null,
      bounds = null,
      point = null;
    const light = document.createElement('span');
    light.className = 'cursor-surface-light';
    light.setAttribute('aria-hidden', 'true');

    function clearLight() {
      cancelAnimationFrame(frame);
      frame = 0;
      target?.classList.remove('motion-lit');
      target?.style.removeProperty('--pointer-depth-x');
      target?.style.removeProperty('--pointer-depth-y');
      target?.style.removeProperty('--card-pitch');
      target?.style.removeProperty('--card-yaw');
      target = bounds = point = null;
      light.remove();
    }
    function draw() {
      frame = 0;
      if (!target?.isConnected || !bounds || !point) return clearLight();
      if (target.matches('.home-hero,.account-card,.provider-showcase-card')) {
        const x = Math.max(
          -1,
          Math.min(1, ((point.x - bounds.left) / bounds.width) * 2 - 1),
        );
        const y = Math.max(
          -1,
          Math.min(1, ((point.y - bounds.top) / bounds.height) * 2 - 1),
        );
        target.style.setProperty('--card-pitch', `${-y * 1.1}deg`);
        target.style.setProperty('--card-yaw', `${x * 1.1}deg`);
        target.style.setProperty('--pointer-depth-x', `${x * 7}px`);
        target.style.setProperty('--pointer-depth-y', `${y * 5}px`);
      }
      light.style.transform = `translate3d(${point.x - bounds.left - 180}px,${point.y - bounds.top - 180}px,0)`;
    }
    function move(event) {
      if (
        !finePointer.matches ||
        reduced.matches ||
        document.hidden ||
        event.pointerType === 'touch' ||
        document.documentElement.dataset.scrollActive === 'true'
      )
        return clearLight();
      const surface = event.target.closest?.(surfaces);
      if (!surface || surface.closest('[role="dialog"]')) return clearLight();
      if (target !== surface) {
        clearLight();
        target = surface;
        bounds = surface.getBoundingClientRect();
        surface.classList.add('motion-surface', 'motion-lit');
        surface.appendChild(light);
      }
      point = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(draw);
    }
    function sweep(event) {
      if (
        reduced.matches ||
        !finePointer.matches ||
        document.hidden ||
        document.documentElement.dataset.scrollActive === 'true'
      )
        return;
      const button = event.target.closest?.(motionButtons);
      if (
        !button ||
        button.contains(event.relatedTarget) ||
        button.disabled ||
        button.getAttribute('aria-disabled') === 'true' ||
        activeSheens.has(button)
      )
        return;
      const sheen = document.createElement('span');
      sheen.className = 'button-motion-sheen';
      sheen.setAttribute('aria-hidden', 'true');
      button.classList.add('motion-button');
      button.appendChild(sheen);
      sheenNodes.add(sheen);
      const animation = sheen.animate(
        [
          { transform: 'translateX(-140%) skewX(-18deg)', opacity: 0 },
          { opacity: 0.7, offset: 0.3 },
          { transform: 'translateX(420%) skewX(-18deg)', opacity: 0 },
        ],
        { duration: 650, easing: 'cubic-bezier(.2,.6,.3,1)' },
      );
      activeSheens.set(button, animation);
      animations.add(animation);
      animation.finished
        .catch(() => {})
        .finally(() => {
          sheen.remove();
          sheenNodes.delete(sheen);
          animations.delete(animation);
          activeSheens.delete(button);
        });
    }
    function discover(root) {
      if (!(root instanceof Element)) return;
      const nodes = [
        ...(root.matches(entrances) ? [root] : []),
        ...root.querySelectorAll(entrances),
      ];
      for (const node of nodes) {
        if (seen.has(node)) continue;
        seen.add(node);
        observer?.observe(node);
        if (
          node.matches('.home-hero-content>*') &&
          node.parentElement?.parentElement
        ) {
          ambientObserver?.observe(node.parentElement.parentElement);
        }
      }
    }
    function configure() {
      observer?.disconnect();
      ambientObserver?.disconnect();
      mutations?.disconnect();
      clearLight();
      for (const animation of animations) animation.cancel();
      animations.clear();
      if (reduced.matches) return;
      ambientObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries)
            entry.target.dataset.ambientVisible = String(entry.isIntersecting);
        },
        { threshold: 0.05 },
      );
      observer = new IntersectionObserver(
        (entries) => {
          let order = 0;
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            observer.unobserve(entry.target);
            if (document.hidden) continue;
            const headingPart = entry.target.matches(heroParts);
            const siblingIndex = headingPart
              ? [...entry.target.parentElement.children].indexOf(entry.target)
              : order++;
            const animation = entry.target.animate(
              [
                {
                  opacity: 0.18,
                  transform: `translateY(${headingPart ? 20 : 26}px)`,
                },
                { opacity: 1, transform: 'translateY(0)' },
              ],
              {
                duration: headingPart ? 640 : 580,
                delay: Math.min(siblingIndex * 75, headingPart ? 300 : 225),
                easing: 'cubic-bezier(.16,1,.3,1)',
              },
            );
            animations.add(animation);
            animation.finished
              .catch(() => {})
              .finally(() => animations.delete(animation));
          }
        },
        { threshold: 0.08 },
      );
      discover(document.getElementById('page-content'));
      mutations = new MutationObserver((records) => {
        for (const record of records)
          for (const node of record.addedNodes) {
            if (
              node !== light &&
              !node.classList?.contains('button-motion-sheen')
            )
              discover(node);
          }
      });
      const main = document.getElementById('page-content');
      if (main) mutations.observe(main, { childList: true, subtree: true });
    }
    function visibility() {
      clearLight();
      if (document.hidden)
        for (const animation of animations) animation.cancel();
    }
    configure();
    reduced.addEventListener('change', configure);
    finePointer.addEventListener('change', clearLight);
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', sweep, { passive: true });
    document.addEventListener('pointerleave', clearLight);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('scroll', clearLight, { passive: true });
    window.addEventListener('resize', clearLight, { passive: true });
    window.addEventListener('blur', clearLight);
    return () => {
      observer?.disconnect();
      ambientObserver?.disconnect();
      mutations?.disconnect();
      clearLight();
      for (const animation of animations) animation.cancel();
      reduced.removeEventListener('change', configure);
      finePointer.removeEventListener('change', clearLight);
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', sweep);
      for (const node of sheenNodes) node.remove();
      document.removeEventListener('pointerleave', clearLight);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('scroll', clearLight);
      window.removeEventListener('resize', clearLight);
      window.removeEventListener('blur', clearLight);
    };
  }, [routeKey, paused]);
  return null;
}
