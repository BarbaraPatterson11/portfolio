import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ScrollReveal } from '../components/animations/ScrollReveal';

import { CustomIcon } from '../components/CustomIcon';

const platforms = [
  { name: 'Facebook', id: 'facebook.svg', url: 'https://www.facebook.com/itsmeyow11/' },
  { name: 'Instagram', id: 'instagram.svg', url: 'https://www.instagram.com/fnkgln/?hl=en' },
  { name: 'TikTok', id: 'tiktok.svg', url: 'https://www.tiktok.com/@itzyearl' },
  { name: 'LinkedIn', id: 'linkedin.svg' },
  { name: 'Pinterest', id: 'pinterest.svg' },
  { name: 'Threads', id: 'threads.svg' },
  { name: 'YouTube', id: 'youtube.svg', url: 'https://www.youtube.com/@TunogTriviaPH' },
  { name: 'X (Twitter)', id: 'x.svg' },
];

export const SocialMediaPlatforms: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="social-platforms" ref={sectionRef} className="mobile-seamless-section relative overflow-hidden bg-black pb-12 pt-28 text-white md:pb-16 md:pt-40 max-sm:pb-10 max-sm:pt-20">
      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12 max-sm:px-4">
        {/* Section Header */}
        <ScrollReveal className="mb-16 text-center md:mb-20 max-sm:mb-8">
          <span className="mb-3 block font-mono text-[10px] md:text-[11px] font-medium uppercase tracking-[0.28em] text-white/50 max-sm:text-[9.5px]">
            Platforms I Manage
          </span>
          <h2 className="font-display text-[clamp(2.5rem,calc(5*var(--vw)),4.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.07em] text-white">
            Social Media Platforms
          </h2>
        </ScrollReveal>

        {/* Platforms Grid — branded circles (Staggered ScrollReveal) */}
        <ScrollReveal
          staggerChildren={0.06}
          className="mx-auto grid max-w-3xl grid-cols-2 gap-10 sm:grid-cols-4 max-sm:max-w-[22rem] max-sm:grid-cols-4 max-sm:gap-x-2 max-sm:gap-y-6"
        >
          {platforms.map((platform) => {
            const PlatformItem = platform.url ? motion.a : motion.div;

            return (
            <PlatformItem
              key={platform.name}
              {...(platform.url
                ? { href: platform.url, target: '_blank', rel: 'noreferrer' }
                : { 'aria-label': `${platform.name} profile coming soon` })}
              variants={{
                hidden: { opacity: 0, scale: 0.5, y: 50 },
                visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', bounce: 0.5, duration: 0.8 } },
              }}
              whileHover={{ y: -8, scale: 1.08 }}
              className={`group flex flex-col items-center gap-4 max-sm:gap-2 ${platform.url ? 'cursor-pointer' : 'cursor-default opacity-75'}`}
            >
              <div className="flex h-20 w-20 items-center justify-center transition-all duration-300 md:h-[88px] md:w-[88px] max-sm:h-12 max-sm:w-12">
                <CustomIcon src={`${import.meta.env.BASE_URL}icons/social/${platform.id}`} alt={platform.name} className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-125" />
              </div>
              <span className="text-center font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-white/40 transition-colors group-hover:text-white max-sm:text-[8px] max-sm:leading-tight max-sm:tracking-[0.1em]">
                {platform.name}
              </span>
            </PlatformItem>
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
};

