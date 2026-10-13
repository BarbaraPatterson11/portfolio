import { useEffect, useRef, useState } from 'react';

type Slide = { src: string; alt: string };

/** Fixed clipping box and decoded layers prevent white flashes during scrolling. */
export function ProjectImageSlideshow({ images, label }: { images: readonly Slide[]; label: string }) {
  const holder = useRef<HTMLElement>(null);
  const ready = useRef(new Set<number>());
  const visible = useRef(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const element = holder.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
    }, { rootMargin: '240px 0px' });
    observer.observe(element);
    const timer = window.setInterval(() => {
      if (!visible.current || document.hidden) return;
      setActive(current => {
        const next = (current + 1) % images.length;
        return ready.current.has(next) ? next : current;
      });
    }, 7000);
    return () => { observer.disconnect(); window.clearInterval(timer); };
  }, [images]);

  return <figure ref={holder} className="project-image-slideshow" aria-label={label}>
    {images.map((image, index) => <img
      key={image.src}
      src={image.src}
      alt={image.alt}
      aria-hidden={index !== active}
      loading="lazy"
      decoding="async"
      width={1400}
      height={875}
      onLoad={event => {
        const element = event.currentTarget;
        void element.decode().then(() => ready.current.add(index)).catch(() => ready.current.add(index));
      }}
      className={index === active ? 'is-current' : ''}
    />)}
  </figure>;
}
