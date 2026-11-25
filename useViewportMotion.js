import { useEffect, useState } from 'react';
export default function useViewportMotion(ref) {
  const [running, setRunning] = useState(false);
  useEffect(() => {
    let visible = false;
    const update = () => setRunning(visible && !document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        update();
      },
      { rootMargin: '100px' },
    );
    if (ref.current) observer.observe(ref.current);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, [ref]);
  return running;
}
