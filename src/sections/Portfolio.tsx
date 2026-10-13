import React from 'react';
import { ScrollReveal } from '../components/animations/ScrollReveal';
import { MasonryProjectGrid } from '../components/ui/masonry-project-grid';
import { VideoText } from '../components/ui/video-text';

const TITLE_VIDEO_POSITION = {
  offsetX: -3,
  offsetY: -8,
  zoom: 2.45,
} as const;

export const Portfolio: React.FC = () => {
  const videoSrc = `${import.meta.env.BASE_URL}projects/ugc-ads/pin-on-dine-pins.mp4`;

  return (
    <section id="portfolio" className="mobile-seamless-section relative w-full overflow-hidden bg-black py-10 sm:py-14 md:py-16">
      <ScrollReveal blur={false} className="relative z-10 mx-auto mb-9 w-full max-w-6xl px-4 sm:mb-12 md:mb-16">
        <div className="relative h-[128px] w-full overflow-hidden sm:h-[150px] md:h-[250px]">
          <VideoText
            src={videoSrc}
            offsetX={TITLE_VIDEO_POSITION.offsetX}
            offsetY={TITLE_VIDEO_POSITION.offsetY}
            zoom={TITLE_VIDEO_POSITION.zoom}
          >
            My Project
          </VideoText>
        </div>

        <div className="mx-auto mt-2 flex max-w-3xl flex-col items-center text-center sm:mt-3">
          <p className="font-body text-sm font-normal leading-relaxed tracking-normal text-white/70 sm:text-base">
            A growing collection of e-commerce storefronts and customer-focused experiences.
          </p>
        </div>
      </ScrollReveal>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <MasonryProjectGrid />
      </div>
    </section>
  );
};
