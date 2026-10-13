import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

const EMAIL_ADDRESS = 'frankglen62@gmail.com';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headlineVisible = useInView(headingRef, { amount: 0.8 });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <section
      id="contact"
      className="mobile-seamless-section relative flex min-h-[calc(100*var(--vh,1vh))] w-full flex-col justify-between overflow-hidden bg-black text-white px-6 py-[72px] pb-[76px] md:px-14"
      aria-labelledby="contact-heading"
    >
      {/* Top / Main Contact Copy Block */}
      <div className="contact-main-copy relative z-10 flex flex-1 flex-col items-center justify-center py-6 sm:py-8">
        <div className="flex flex-col items-center text-center">
          {/* Headline Stack */}
          <div className="inline-block text-left">
            <p className="font-mono text-[11px] font-normal uppercase tracking-[2.42px] text-[#aaa]">
              Contact
            </p>

            <h2
              id="contact-heading"
              ref={headingRef}
              aria-label="What should we build now?"
              className={`contact-build-next mt-4 font-display font-extrabold uppercase text-white${headlineVisible ? ' is-live' : ''}`}
              style={{
                fontSize: 'clamp(38px, 5.2vw, 83.2px)',
                lineHeight: 'clamp(32px, 4.4vw, 64.9px)',
                letterSpacing: '-0.07em',
              }}
            >
              WHAT SHOULD WE<br />
              BUILD{' '}
              <span className="contact-next-word select-none" aria-hidden="true">
                <span className="contact-next-old">NEXT</span>
                <span className="contact-next-line" />
              </span>
              <span className="contact-next-now" aria-hidden="true">{' NOW'}</span>?
            </h2>
          </div>

          {/* Email: Pure text link without any oval pill or extra button */}
          <div className={`contact-email-reveal relative mt-10${headlineVisible ? ' is-live' : ''}`}>
            <a
              id="contact-email"
              href={`mailto:${EMAIL_ADDRESS}`}
              onClick={handleCopy}
              className="group relative inline-block font-mono font-normal text-white transition-opacity duration-200 hover:opacity-75 focus:outline-none"
              style={{
                fontSize: 'clamp(18px, 1.6vw, 25.6px)',
                lineHeight: '38.4px',
                letterSpacing: '2.05px',
              }}
              aria-label={`Copy ${EMAIL_ADDRESS} to clipboard`}
            >
              {EMAIL_ADDRESS}

              {/* Minimal floating tooltip feedback on click */}
              <AnimatePresence>
                {copied && (
                  <motion.span
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-white px-2 py-0.5 font-mono text-[10px] font-medium tracking-[0.15em] text-black shadow"
                  >
                    COPIED ✓
                  </motion.span>
                )}
              </AnimatePresence>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Block: Frank Martin & Subtitle */}
      <footer className="contact-footer relative z-10 flex flex-col items-center justify-center text-center pb-2">
        <p
          className="font-display font-extrabold uppercase text-white"
          style={{
            fontSize: 'clamp(32px, 2.8vw, 44.8px)',
            lineHeight: 'clamp(28px, 2.2vw, 34.9px)',
            letterSpacing: '-0.07em',
          }}
        >
          FRANK<br />
          MARTIN
        </p>
        <p className="mt-4 font-mono text-[11px] font-normal uppercase tracking-[2.42px] text-[#aaa]">
          ECOMMERCE VIRTUAL ASSISTANT · SHOPIFY SPECIALIST
        </p>
      </footer>
    </section>
  );
};
