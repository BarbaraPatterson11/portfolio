import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProjectImageSlideshow } from './ProjectImageSlideshow';
import {
  ProjectMediaViewer,
  type ProjectViewerData,
} from './project-media-viewer';

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const artazestImage = asset('projects/landscape-showcase/artazest-storefront.webp');
const velvetMarketImage = asset('projects/landscape-showcase/velvet-market.webp');
const myshopifyImage = asset('projects/landscape-showcase/myshopify-storefront.webp');
const analyticsImages = [
  { src: asset('projects/analytics-showcase/analytics-period-01.webp'), alt: 'Shopify analytics report showing sales, orders, conversion, and revenue trend' },
  { src: asset('projects/analytics-showcase/analytics-period-02.webp'), alt: 'Shopify analytics report for a second date range' },
  { src: asset('projects/analytics-showcase/analytics-daily-overview.webp'), alt: 'Shopify daily sales and order performance analytics report' },
  { src: asset('projects/analytics-showcase/analytics-period-03.webp'), alt: 'Shopify analytics report showing sales trend from September to October' },
  { src: asset('projects/analytics-showcase/analytics-period-04.webp'), alt: 'Shopify analytics report showing sales trend from November to December' },
] as const;
const campaignImages = [
  { src: asset('projects/campaign-showcase/campaign-01.webp'), alt: 'Campaign project image 1' },
  { src: asset('projects/campaign-showcase/campaign-02.webp'), alt: 'Campaign project image 2' },
  { src: asset('projects/campaign-showcase/campaign-03.webp'), alt: 'Campaign project image 3' },
  { src: asset('projects/campaign-showcase/campaign-04.webp'), alt: 'Campaign project image 4' },
] as const;
const videoCreatives = [
  { id: 'ugc-ad-01', src: asset('projects/marketplace-operations/project-video-01.mp4'), label: 'Beauty UGC', alt: 'Beauty product e-commerce video creative' },
  { id: 'ugc-ad-02', src: asset('projects/ugc-ads/ugc-ad-02.mp4'), label: 'Product Demo', alt: 'E-commerce product demonstration video creative' },
  { id: 'ugc-ad-03', src: asset('projects/ugc-ads/ugc-ad-03.mp4'), label: 'Creative Cut 03', alt: 'E-commerce short-form video creative 3' },
  { id: 'ugc-ad-04', src: asset('projects/ugc-ads/ugc-ad-04.mp4'), label: 'Creative Cut 04', alt: 'E-commerce short-form video creative 4' },
  { id: 'ugc-ad-05', src: asset('projects/ugc-ads/ugc-ad-05.mp4'), label: 'Creative Cut 05', alt: 'E-commerce short-form video creative 5' },
] as const;

const videoShowcase: ProjectViewerData = {
  id: 1,
  title: 'E-commerce Video Projects',
  category: 'E-commerce Video Creative',
  description: 'Short-form product videos created for e-commerce storefronts and campaigns.',
  image: videoCreatives[0].src,
  gradient: 'from-white/10 to-black',
  media: videoCreatives.map((video) => ({
    id: video.id,
    type: 'video' as const,
    src: video.src,
    alt: video.alt,
    label: video.label,
    orientation: 'portrait' as const,
  })),
};

// Project gallery: keep new storefront screenshots in this shared media list so
// both carousel previews and the focused viewer stay in sync.
const landscapeShowcase: ProjectViewerData = {
  id: 9,
  title: 'Veloura Store Showcase',
  category: 'Ecommerce Storefront Design',
  description: 'A scrollable storefront showcase presented inside the project viewer.',
  image: velvetMarketImage,
  gradient: 'from-white/10 to-black',
  media: [
    {
      id: 'landscape-01',
      type: 'image',
      src: velvetMarketImage,
      alt: 'Veloura ecommerce storefront homepage and product sections',
      orientation: 'landscape',
      name: 'Veloura Store',
      link: velvetMarketImage,
      linkLabel: 'Open full screenshot',
    },
    {
      id: 'landscape-02',
      type: 'image',
      src: artazestImage,
      alt: 'Aztazest ecommerce storefront homepage and product sections',
      orientation: 'landscape',
      name: 'Aztazest Store',
      link: 'https://artazest.com/',
      linkLabel: 'Explore live store',
    },
    {
      id: 'landscape-03',
      type: 'image',
      src: myshopifyImage,
      alt: 'Vault ecommerce storefront homepage and product sections',
      orientation: 'landscape',
      name: 'Vault Store',
      link: 'https://xjg1wp-as.myshopify.com/',
      linkLabel: 'Explore live store',
    },
  ],
};

export function MasonryProjectGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectViewerData | null>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [landscapePreviewIndex, setLandscapePreviewIndex] = useState(0);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const videos = Array.from(grid.querySelectorAll<HTMLVideoElement>('[data-portfolio-preview]'));
    if (!videos.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        const video = target as HTMLVideoElement;
        if (isIntersecting && !document.hidden) {
          video.preload = 'auto';
          video.playbackRate = 0.8;
          video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      });
    }, { rootMargin: '320px 0px', threshold: 0.01 });

    videos.forEach(video => observer.observe(video));
    const onVisibilityChange = () => {
      if (document.hidden) videos.forEach(video => video.pause());
      else videos.forEach(video => {
        const bounds = video.getBoundingClientRect();
        if (bounds.bottom > -120 && bounds.top < window.innerHeight + 120) {
          video.playbackRate = 0.8;
          video.play().catch(() => undefined);
        }
      });
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      videos.forEach(video => video.pause());
    };
  }, []);

  const landscapePreview = landscapeShowcase.media[landscapePreviewIndex];
  const projectTitle = (
    <>
                <span className="inline-flex max-w-[22ch] items-center gap-2 font-display text-xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-3xl">
                  <span>{landscapePreview.name ?? 'Veloura Store'}</span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover/project-title:translate-x-0.5 group-hover/project-title:-translate-y-0.5 sm:h-5 sm:w-5" aria-hidden="true" />
                </span>
                <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-white/75 transition-colors group-hover/project-title:text-white sm:text-[9px]">
                  View full project
                </span>
    </>
  );
  const openProject = (project: ProjectViewerData, mediaIndex = 0, origin?: DOMRect) => {
    if (origin) setOriginRect(origin);
    setSelectedMediaIndex(mediaIndex);
    setSelectedProject(project);
  };

  return (
    <>
      <div
        ref={gridRef}
        className="project-masonry mx-auto w-full max-w-5xl"
        aria-label="Selected ecommerce storefront projects"
      >
        <div className="project-masonry-item group relative mx-auto aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#090909] text-left shadow-[0_18px_50px_rgba(0,0,0,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:h-[430px] sm:aspect-auto lg:h-[480px]"
          role="button" tabIndex={0}
          onClick={(event) => {
            if ((event.target as HTMLElement).closest('button, a')) return;
            openProject(landscapeShowcase, landscapePreviewIndex, event.currentTarget.getBoundingClientRect());
          }}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return;
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openProject(landscapeShowcase, landscapePreviewIndex, event.currentTarget.getBoundingClientRect());
            }
          }}
          aria-label={`Open ${landscapePreview.name ?? 'Veloura Store'} project panel`}
        >
            <img
              key={landscapePreview.id}
              src={asset(`projects/previews/${landscapePreview.id}.webp`)}
              alt={landscapePreview.alt}
              loading="lazy"
              decoding="async"
              width={960}
              height={600}
              className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.035]"
            />
            <span className="pointer-events-none absolute inset-0 bg-black/10" />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setLandscapePreviewIndex((current) => (
                  current - 1 + landscapeShowcase.media.length
                ) % landscapeShowcase.media.length);
              }}
              className="group/prev absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/75 text-white shadow-[0_6px_24px_rgba(0,0,0,.55)] backdrop-blur-md transition-[transform,background-color,color,border-color] duration-200 hover:scale-105 hover:border-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-5 sm:h-12 sm:w-12"
              aria-label="Previous storefront project"
            >
              <ChevronLeft className="h-5 w-5 transition-transform group-hover/prev:-translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setLandscapePreviewIndex((current) => (
                  current + 1
                ) % landscapeShowcase.media.length);
              }}
              className="group/next absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/75 text-white shadow-[0_6px_24px_rgba(0,0,0,.55)] backdrop-blur-md transition-[transform,background-color,color,border-color] duration-200 hover:scale-105 hover:border-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-5 sm:h-12 sm:w-12"
              aria-label="Next storefront project"
            >
              <ChevronRight className="h-5 w-5 transition-transform group-hover/next:translate-x-0.5" />
            </button>
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-16 pb-4 pt-8 text-center sm:px-20 sm:pb-6 sm:pt-20">
              {landscapePreview.id === 'landscape-03' ? (
                <a
                  href={landscapePreview.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={event => event.stopPropagation()}
                  className="group/project-title flex max-w-full flex-col items-center gap-2 rounded-lg px-3 py-1 text-white outline-none transition-colors hover:text-white/80 focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Explore Vault Store live store"
                >
                  {projectTitle}
                </a>
              ) : (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  openProject(landscapeShowcase, landscapePreviewIndex, event.currentTarget.getBoundingClientRect());
                }}
                className="group/project-title flex max-w-full flex-col items-center gap-2 rounded-lg px-3 py-1 text-white outline-none transition-colors hover:text-white/80 focus-visible:ring-2 focus-visible:ring-white"
                aria-label={`View full ${landscapePreview.name ?? 'Veloura Store'} project`}
              >
                {projectTitle}
              </button>
              )}
            </div>
        </div>

        <section className="mt-9 sm:mt-12" aria-labelledby="video-projects-heading">
          <h3 id="video-projects-heading" className="mb-5 text-center font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-white/55 sm:mb-6 sm:text-xs">
            Video Projects
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {videoCreatives.map((video, index) => (
              <button
                key={video.id}
                type="button"
                className="project-masonry-item group/video relative aspect-[9/14] w-full overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0b] text-left shadow-[0_14px_40px_rgba(0,0,0,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                onClick={(event) => openProject(videoShowcase, index, event.currentTarget.getBoundingClientRect())}
                aria-label={`Play ${video.label}`}
              >
                <video
                  data-portfolio-preview
                  src={asset(`projects/previews/video-${String(index + 1).padStart(2, '0')}.mp4`)}
                  poster={asset(`projects/previews/video-${String(index + 1).padStart(2, '0')}.webp`)}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/video:scale-[1.035]"
                />
              </button>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-4 grid w-full grid-cols-1 gap-4 sm:mt-7 sm:grid-cols-2 sm:gap-5" aria-label="Additional project image showcases">
          <ProjectImageSlideshow images={analyticsImages} label="Project image showcase 01" />
          <ProjectImageSlideshow images={campaignImages} label="Project image showcase 02" />
        </section>

      </div>

      <ProjectMediaViewer
        key={selectedProject ? `${selectedProject.id}-${selectedMediaIndex}` : 'closed'}
        project={selectedProject}
        initialIndex={selectedMediaIndex}
        originRect={originRect}
        onClose={() => {
          setSelectedProject(null);
          setSelectedMediaIndex(0);
          setOriginRect(null);
        }}
      />

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .project-masonry-item {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }

          .project-masonry-item video {
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}
