import { useEffect, useRef } from 'react';

/** Reference-style white ring, rendered outside the zoomed page canvas. */
export function SiteCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let x = 0;
    let y = 0;
    let visible = false;
    let text = false;
    const paint = () => {
      frame = 0;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      cursor.classList.toggle('is-visible', visible && finePointer.matches);
      cursor.classList.toggle('is-text', text);
      cursor.classList.toggle('is-reduced', reducedMotion.matches);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      visible = event.pointerType === 'mouse' && finePointer.matches;
      const target = event.target instanceof Element ? event.target : null;
      const nativeInput = target?.closest('input, textarea, select, [contenteditable="true"]');
      document.documentElement.classList.toggle('has-site-cursor', visible && !nativeInput);
      if (nativeInput) visible = false;
      text = !!target?.closest('a, button, h1, h2, h3, p, [role="button"]');
      schedule();
    };
    const leave = () => {
      visible = false;
      document.documentElement.classList.remove('has-site-cursor');
      schedule();
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    window.addEventListener('blur', leave);
    finePointer.addEventListener('change', leave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
      window.removeEventListener('blur', leave);
      finePointer.removeEventListener('change', leave);
      document.documentElement.classList.remove('has-site-cursor');
    };
  }, []);
  return <div ref={cursorRef} className="site-cursor" aria-hidden="true"><span className="site-cursor-core" /><span className="site-cursor-ghost" /></div>;
}
