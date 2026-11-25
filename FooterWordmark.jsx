import useViewportMotion from './useViewportMotion';
import React, { useEffect, useRef } from 'react';
export default function FooterWordmark() {
  const element = useRef(null),
    frame = useRef(0),
    point = useRef({ x: 0, y: 0 }),
    running = useViewportMotion(element);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  function move(event) {
    if (
      event.pointerType !== 'mouse' ||
      document.documentElement.dataset.scrollActive === 'true'
    )
      return;
    point.current = { x: event.clientX, y: event.clientY };
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const node = element.current;
      if (!node || document.documentElement.dataset.scrollActive === 'true')
        return;
      const bounds = node.getBoundingClientRect();
      node.style.setProperty(
        '--pointer-x',
        point.current.x - bounds.left + 'px',
      );
      node.style.setProperty(
        '--pointer-y',
        point.current.y - bounds.top + 'px',
      );
      node.dataset.hover = 'true';
    });
  }
  function leave() {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    if (element.current) element.current.dataset.hover = 'false';
  }
  return (
    <div
      ref={element}
      className="footer-wordmark"
      data-running={running}
      aria-hidden="true"
      onPointerMove={move}
      onPointerLeave={leave}
    >
      <span className="footer-wordmark-text">Buy AWS Accounts AI</span>
    </div>
  );
}
