import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scrollToPosition } from '../../lib/smoothScroll';

const EMAIL_ADDRESS = 'frankglen62@gmail.com';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'My Project', href: '#portfolio' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export interface NavbarProps {
  isVisible?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isVisible = true }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const logoSrc = `${import.meta.env.BASE_URL}logo.png`;
  useEffect(() => {
    if (!mobileOpen) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`site-navbar fixed top-0 left-0 right-0 z-50 flex h-[72px] items-center justify-between px-5 sm:px-10 md:px-14 pointer-events-none text-white transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-100'
        }`}
      >
        {/* Top-Left: Signature Logo PNG matching jeffmilanes.com */}
        <a
          href="#home"
          className="pointer-events-auto flex items-center gap-2.5 transition-opacity hover:opacity-80 focus:outline-none"
          aria-label="Frank Martin Home"
        >
          <img
            src={logoSrc}
            alt="Frank"
            className="site-brand-image h-[32.8px] sm:h-9 md:h-11 w-auto object-contain"
          />
        </a>

        {/* Top-Right: Email matching jeffmilanes.com */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <a
            href={`mailto:${EMAIL_ADDRESS}`}
            className="hidden sm:inline-block font-mono text-[10px] md:text-[10.5px] font-normal uppercase tracking-[0.14em] text-white transition-opacity duration-200 hover:opacity-100 focus:outline-none"
            style={{ opacity: 0.72 }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.72')}
            aria-label={`Send email to ${EMAIL_ADDRESS}`}
          >
            {EMAIL_ADDRESS}
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden flex h-10 w-10 flex-col items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/70"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="h-[1.5px] w-5 block bg-white"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="h-[1.5px] w-5 block bg-white"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="h-[1.5px] w-5 block bg-white"
            />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="mobile-nav-drawer fixed inset-0 z-40 bg-black pt-24 px-5 flex flex-col justify-between pb-10 overflow-y-auto"
          >
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1 mt-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(event) => {
                    event.preventDefault();
                    setMobileOpen(false);
                    const target = document.querySelector(link.href);
                    if (target) scrollToPosition(target.getBoundingClientRect().top + window.scrollY);
                  }}
                  className="font-display font-extrabold text-[24px] leading-[1.1] uppercase tracking-[-0.055em] text-white hover:text-white/70 py-3 border-b border-white/10 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <a
              href={`mailto:${EMAIL_ADDRESS}`}
              className="font-mono text-[10px] leading-normal tracking-[0.14em] text-[#aaa] hover:text-white uppercase text-left py-3 transition-opacity duration-200"
            >
              {EMAIL_ADDRESS}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
