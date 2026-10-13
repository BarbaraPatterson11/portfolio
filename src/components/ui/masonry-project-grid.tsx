import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  ProjectMediaViewer,
  type ProjectViewerData,
} from './project-media-viewer';

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const artazestImage = asset('projects/landscape-showcase/artazest-storefront.webp');
const velvetMarketImage = asset('projects/landscape-showcase/velvet-market.webp');
const myshopifyImage = asset('projects/landscape-showcase/myshopify-storefront.webp');
const analyticsImages = [
  { src: asset('projects/analytics-showcase/analytics-period-01.png'), alt: 'Shopify analytics report showing sales, orders, conversion, and revenue trend' },
  { src: asset('projects/analytics-showcase/analytics-period-02.png'), alt: 'Shopify analytics report for a second date range' },
  { src: asset('projects/analytics-showcase/analytics-daily-overview.png'), alt: 'Shopify daily sales and order performance analytics report' },
  { src: asset('projects/analytics-showcase/analytics-period-03.png'), alt: 'Shopify analytics report showing sales trend from September to October' },
  { src: asset('projects/analytics-showcase/analytics-period-04.png'), alt: 'Shopify analytics report showing sales trend from November to December' },
] as const;
const campaignImages = [
  { src: asset('projects/campaign-showcase/campaign-01.png'), alt: 'Campaign project image 1' },
  { src: asset('projects/campaign-showcase/campaign-02.png'), alt: 'Campaign project image 2' },
  { src: asset('projects/campaign-showcase/campaign-03.png'), alt: 'Campaign project image 3' },
  { src: asset('projects/campaign-showcase/campaign-04.png'), alt: 'Campaign project image 4' },
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

const revealOrder = [0, 1, 2, 3, 4, 5];

export function MasonryProjectGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [selectedProject, setSelectedProject] = useState<ProjectViewerData | null>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [landscapePreviewIndex, setLandscapePreviewIndex] = useState(0);
  const [analyticsPreviewIndex, setAnalyticsPreviewIndex] = useState(0);
  const [campaignPreviewIndex, setCampaignPreviewIndex] = useState(0);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setAnalyticsPreviewIndex((index) => (index + 1) % analyticsImages.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCampaignPreviewIndex((index) => (index + 1) % campaignImages.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const videos = Array.from(grid.querySelectorAll<HTMLVideoElement>('[data-portfolio-preview]'));
    if (!videos.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        const video = target as HTMLVideoElement;
        if (isIntersecting && !document.hidden) {
          video.preload = 'metadata';
          video.playbackRate = 0.8;
          video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      });
    }, { rootMargin: '120px 0px', threshold: 0.12 });

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

  const revealStyle = (index: number): React.CSSProperties => ({
    opacity: hasEntered ? 1 : 0,
    transform: hasEntered ? 'translateY(0)' : 'translateY(20px)',
    animation: hasEntered
      ? `project-masonry-appear 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${(revealOrder[index] / revealOrder.length).toFixed(3)}s both`
      : undefined,
  });

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
          style={revealStyle(0)}
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
              src={landscapePreview.src}
              alt={landscapePreview.alt}
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
                style={revealStyle(index + 1)}
                onClick={(event) => openProject(videoShowcase, index, event.currentTarget.getBoundingClientRect())}
                aria-label={`Play ${video.label}`}
              >
                <video
                  data-portfolio-preview
                  src={video.src}
                  muted
                  loop
                  playsInline
                  preload="none"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/video:scale-[1.035]"
                />
              </button>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-4 grid w-full grid-cols-1 gap-4 sm:mt-7 sm:grid-cols-2 sm:gap-5" aria-label="Additional project image showcases">
          {[
            { number: '01', images: analyticsImages, previewIndex: analyticsPreviewIndex },
            { number: '02', images: campaignImages, previewIndex: campaignPreviewIndex },
          ].map((holder) => (
            <figure
              key={holder.number}
              className="group relative flex aspect-[1.6/1] min-h-[190px] w-full items-center justify-center overflow-hidden rounded-2xl sm:min-h-0"
              aria-label={`Project image showcase ${holder.number}`}
            >
              <img
                key={holder.images[holder.previewIndex].src}
                src={holder.images[holder.previewIndex].src}
                alt={holder.images[holder.previewIndex].alt}
                className="absolute inset-0 h-full w-full animate-[analytics-image-fade_900ms_ease_both] object-cover"
              />
            </figure>
          ))}
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
        @keyframes project-masonry-appear {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes analytics-image-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

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
