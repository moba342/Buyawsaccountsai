import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
let active = null;
export function scrollPageTo(target, { immediate = false } = {}) {
  if (target === null || target === undefined) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (active) {
    active.wake();
    active.engine.resize();
    active.engine.scrollTo(target, {
      immediate: immediate || reduced,
      duration: 0.85,
    });
    return;
  }
  const behavior = immediate || reduced ? 'instant' : 'smooth';
  if (typeof target === 'number') window.scrollTo({ top: target, behavior });
  else target.scrollIntoView({ behavior, block: 'start' });
}
export default function SmoothScrolling({ paused, routeKey }) {
  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)'),
      mouse = matchMedia('(hover: hover) and (pointer: fine)');
    let engine = null,
      frame = 0,
      unsubscribe = null;
    const cancel = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    function tick(time) {
      frame = 0;
      if (!engine) return;
      engine.raf(time);
      if (engine.isScrolling === 'smooth') frame = requestAnimationFrame(tick);
    }
    function wake() {
      if (frame || !engine) return;
      engine.raf(performance.now());
      frame = requestAnimationFrame(tick);
    }
    function destroy() {
      cancel();
      unsubscribe?.();
      unsubscribe = null;
      if (active?.engine === engine) active = null;
      engine?.destroy();
      engine = null;
    }
    function configure() {
      destroy();
      document.documentElement.dataset.motionHidden = String(document.hidden);
      if (paused || motion.matches || !mouse.matches || document.hidden) return;
      engine = new Lenis({
        autoRaf: false,
        smoothWheel: true,
        syncTouch: false,
        lerp: 0.14,
        wheelMultiplier: 1,
        overscroll: true,
        stopInertiaOnNavigate: true,
        virtualScroll: ({ event, deltaX, deltaY }) =>
          !event.ctrlKey &&
          !event.shiftKey &&
          Math.abs(deltaY) >= Math.abs(deltaX),
        prevent: (node) =>
          node.matches(
            'textarea,input,select,[contenteditable="true"],.modal,.modal-backdrop,.variant-options,.selection-grid,.table-scroll,.shot-table-wrap,.home-filter-row,#site-navigation',
          ),
      });
      unsubscribe = engine.on('virtual-scroll', wake);
      active = { engine, wake };
    }
    function interrupt(event) {
      if (
        !engine ||
        ![
          'ArrowUp',
          'ArrowDown',
          'PageUp',
          'PageDown',
          'Home',
          'End',
          ' ',
        ].includes(event.key) ||
        event.target.closest?.('input,textarea,select,[contenteditable="true"]')
      )
        return;
      cancel();
      engine.scrollTo(window.scrollY, { immediate: true, force: true });
    }
    configure();
    motion.addEventListener('change', configure);
    mouse.addEventListener('change', configure);
    document.addEventListener('visibilitychange', configure);
    window.addEventListener('keydown', interrupt, { capture: true });
    return () => {
      destroy();
      motion.removeEventListener('change', configure);
      mouse.removeEventListener('change', configure);
      document.removeEventListener('visibilitychange', configure);
      window.removeEventListener('keydown', interrupt, { capture: true });
    };
  }, [paused, routeKey]);
  return null;
}
