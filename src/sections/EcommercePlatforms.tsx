import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { CustomIcon } from '../components/CustomIcon';
import { ScrollReveal } from '../components/animations/ScrollReveal';

const platforms = [
  { name: 'Amazon', id: 'amazon.png' },
  { name: 'eBay', id: 'ebay.webp' },
  { name: 'Shopify', id: 'shopify.svg' },
  { name: 'Etsy', id: 'etsy.webp' },
];


export const EcommercePlatforms: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  // Duplicate platforms to ensure a seamless infinite loop that spans ultra-wide screens
  const marqueeItems = [...platforms, ...platforms, ...platforms, ...platforms];

  return (
    <section id="ecommerce-platforms" ref={sectionRef} className="relative overflow-hidden bg-black">
      {/* Gradient transition from previous section (#080808 to black) */}
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-[#080808] to-black pointer-events-none z-0" />
      <div className="relative z-10 w-full mx-auto">

        {/* Infinite Marquee Section */}
        <div className="relative flex w-full flex-col items-center overflow-hidden py-8 md:py-12">
          
          <ScrollReveal direction="up" duration={0.55} blur={false}>
            <span className="font-mono text-[10px] md:text-[11px] font-medium uppercase tracking-[0.28em] text-white/50 mb-4 z-20 relative block">
              E-Commerce Experience
            </span>
          </ScrollReveal>
          
          <div className="relative w-full flex items-center">
            {/* Edge Gradients for SaaS look */}
            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="hidden md:block absolute right-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
              repeat: Infinity, 
              ease: "linear", 
              duration: 35 
            }}
            className="flex items-center gap-10 md:gap-20 px-4 w-max"
          >
            {marqueeItems.map((platform, idx) => (
              <div 
                key={`${platform.name}-${idx}`} 
                className="flex flex-col items-center gap-2 cursor-default group min-w-[100px]"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center transition-all duration-500">
                  <CustomIcon 
                    src={`${import.meta.env.BASE_URL}icons/ecommerce/${platform.id}`}
                    alt={platform.name} 
                    className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110 drop-shadow-sm grayscale group-hover:grayscale-0"
                  />
                </div>
                <span className="font-mono text-xs uppercase tracking-wider text-white/50 group-hover:text-white transition-colors duration-300">
                  {platform.name}
                </span>
              </div>
            ))}
          </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
