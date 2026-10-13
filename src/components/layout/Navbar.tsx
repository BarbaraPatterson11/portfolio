import React, { useState } from 'react';
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

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex h-[64px] items-center justify-between px-5 sm:h-[72px] sm:px-10 md:px-14 pointer-events-none text-white transition-opacity duration-300 ${
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
            className="h-7 sm:h-9 md:h-11 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24 px-8 flex flex-col justify-between pb-10"
          >
            <nav className="flex flex-col gap-3 mt-6">
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
                  className="font-display font-extrabold text-3xl uppercase tracking-[-0.05em] text-white hover:text-white/70 py-2 border-b border-white/5 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <a
              href={`mailto:${EMAIL_ADDRESS}`}
              className="font-mono text-xs tracking-[0.16em] text-white/70 hover:text-white uppercase text-center py-3 transition-opacity duration-200"
            >
              {EMAIL_ADDRESS}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
