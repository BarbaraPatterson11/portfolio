import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let activeScroll: Lenis | null = null;

export function startSmoothScroll(): () => void {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = window.matchMedia('(pointer: coarse)');
  let dispose = () => {};
  const sync = () => {
    dispose();
    if (motion.matches || pointer.matches) return;
    const scroll = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 0.78,
      touchMultiplier: 1,
      allowNestedScroll: true,
      virtualScroll: data => {
        const services = document.getElementById('services')?.getBoundingClientRect();
        const readingServices = !!services && services.top <= window.innerHeight * 0.25 && services.bottom >= window.innerHeight * 0.75;
        scroll.options.duration = readingServices ? 0.75 : 1.2;
        if (readingServices) data.deltaY *= 0.65;
        return true;
      },
    });
    activeScroll = scroll;
    scroll.on('scroll', ScrollTrigger.update);
    const tick = (seconds: number) => scroll.raf(seconds * 1000);
    gsap.ticker.add(tick);
    dispose = () => {
      gsap.ticker.remove(tick);
      scroll.destroy();
      if (activeScroll === scroll) activeScroll = null;
      dispose = () => {};
    };
  };
  sync();
  motion.addEventListener('change', sync);
  pointer.addEventListener('change', sync);
  return () => {
    dispose();
    motion.removeEventListener('change', sync);
    pointer.removeEventListener('change', sync);
  };
}

export function scrollToPosition(top: number): void {
  if (activeScroll) activeScroll.scrollTo(top, { duration: 1.4 });
  else window.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}
