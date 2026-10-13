import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CraftParticleScene } from '../components/ui/CraftParticleScene';

const servicesData = [
  {
    num: '01',
    headline: 'STORE MANAGEMENT',
    desc: 'Store setup, theme updates, collections, inventory, merchandising, store maintenance, and quality assurance.',
    bullet: 'store setup, operations & maintenance',
  },
  {
    num: '02',
    headline: 'PRODUCT CATALOG',
    desc: 'Product uploads, descriptions, images, variants, SKUs, collections, CSV import/export, and bulk editing.',
    bullet: 'product listings, variants & bulk editing',
  },
  {
    num: '03',
    headline: 'STOREFRONT UI/UX',
    desc: 'Homepage, product pages, landing pages, mobile-first layouts, navigation, and theme customization.',
    bullet: 'mobile layouts, pdp design & navigation',
  },
  {
    num: '04',
    headline: 'CRO & CONVERSION',
    desc: 'PDP optimization, landing page optimization, A/B testing, offer testing, CTA optimization, cart UX, and purchase friction reduction.',
    bullet: 'a/b testing, cart ux & checkout flow',
  },
  {
    num: '05',
    headline: 'SEO & SPEED',
    desc: 'Product SEO, metadata, alt text, technical SEO basics, page speed, and mobile performance.',
    bullet: 'product seo, metadata & site performance',
  },
  {
    num: '06',
    headline: 'MARKETING AUTOMATION',
    desc: 'Klaviyo, Shopify Email, Shopify Flow, email campaigns, customer segmentation, abandoned checkout recovery, and retention automation.',
    bullet: 'klaviyo flows & abandoned cart recovery',
  },
];

export const Services: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const beatsRef = useRef<(HTMLElement | null)[]>([]);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const mobile = document.documentElement.dataset.canvas === 'mobile';
      const stageBottom = mobile ? Math.max(0, stickyRef.current?.getBoundingClientRect().bottom ?? 0) : 0;
      const focus = stageBottom + (window.innerHeight - stageBottom) * 0.5;
      let nearest = 0;
      let distance = Infinity;
      beatsRef.current.forEach((beat, index) => {
        if (!beat) return;
        const rect = beat.getBoundingClientRect();
        const nextDistance = Math.abs(rect.top + rect.height / 2 - focus);
        if (nextDistance < distance) { nearest = index; distance = nextDistance; }
      });
      setActiveStep(nearest);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    if (stickyRef.current) observer.observe(stickyRef.current);
    beatsRef.current.forEach(beat => { if (beat) observer.observe(beat); });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <section
      id="services"
      className="craft-services mobile-seamless-section relative z-10 w-full bg-black text-white"
      aria-labelledby="craft-heading"
      data-active-step={activeStep}
    >
      <div className="craft-services-grid">
        
        {/* LEFT COLUMN: Sticky pinned viewport stage matching jeffmilanes.com */}
        <div ref={stickyRef} className="craft-services-sticky">

          {/* Top: 3D Particle Canvas with Mouse Repulsion Interaction */}
          <div className="craft-services-visual">
            <CraftParticleScene activeStep={activeStep} />
          </div>

          {/* Bottom: AT THE MACHINE Kicker & Progressive Terminal */}
          <div className="craft-services-copy">
            <p className="font-mono text-[11px] font-normal uppercase tracking-[2.42px] text-[#aaa]">
              HOW THE WORK ACTUALLY HAPPENS
            </p>

            <h2
              id="craft-heading"
              className="mt-3 font-display font-extrabold text-[36px] sm:text-[40px] md:text-[44.8px] leading-[34.9px] tracking-[-3.14px] uppercase text-white"
            >
              MY SERVICES.
            </h2>

            {/* Progressive Terminal: ONLY displays unlocked lines one-by-one as you scroll */}
            <div
              className="craft-services-terminal mt-5 font-mono text-[11px] sm:text-[12px] md:text-[13px] leading-relaxed"
              role="status"
              aria-live="polite"
            >
              <AnimatePresence>
                {servicesData.slice(0, activeStep + 1).map((service, idx) => {
                  const isCurrent = activeStep === idx;

                  return (
                    <motion.div
                      key={service.num}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className={`flex items-center gap-2 transition-colors duration-300 ${
                        isCurrent
                          ? 'text-[#aaa] font-normal'
                          : 'text-[#777]'
                      }`}
                    >
                      <span className="text-white">›</span>
                      <span>{service.bullet}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Naturally scrolling sequential articles (.craft-beats) */}
        <div className="craft-services-beats">
          {servicesData.map((service, index) => {
            const isActive = activeStep === index;

            return (
              <article
                key={service.num}
                data-index={index}
                ref={(el) => {
                  beatsRef.current[index] = el;
                }}
                className={`craft-services-beat ${isActive ? 'is-active' : ''}`}
              >
                {/* Step Number: just 01, 02, etc. in Geist Mono */}
                <p className="font-mono text-[11px] font-normal uppercase tracking-[2.42px] text-[#aaa]">
                  {service.num}
                </p>

                {/* Big Step Headline: Archivo 800 with exact proportional scale */}
                <h3
                  className="craft-services-headline mt-4 font-display font-extrabold uppercase text-white"
                  style={{
                    fontSize: 'clamp(32px, calc(7 * var(--vw)), 83.2px)',
                    lineHeight: '0.78',
                    letterSpacing: '-0.07em',
                  }}
                >
                  {service.headline}
                </h3>

                {/* Description matching jeffmilanes.com body */}
                <p
                  className="mt-6 max-w-md font-body text-sm leading-relaxed text-[#aaa]"
                >
                  {service.desc}
                </p>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
};
