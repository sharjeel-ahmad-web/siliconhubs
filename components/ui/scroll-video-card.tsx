'use client';

import React, {
  CSSProperties,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
} from 'react';

type Source = { mp4?: string; webm?: string; ogg?: string };
type VideoLike = string | Source;

export type ScrollVideoCardProps = {
  media?: VideoLike;
  poster?: string;
  mediaType?: 'video' | 'image';
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  autoPlay?: boolean;
  overlay?: {
    caption?: ReactNode;
    heading?: ReactNode;
    paragraphs?: ReactNode[];
    extra?: ReactNode;
  };
  initialBoxSize?: number;
  targetSize?:
    | { widthVw: number; heightVh: number; borderRadius?: number }
    | 'fullscreen';
  scrollHeightVh?: number;
  sticky?: boolean;
  overlayBlur?: number;
  overlayRevealDelay?: number;
  smoothScroll?: boolean;
  className?: string;
  style?: CSSProperties;
};

function isSourceObject(m?: VideoLike): m is Source {
  return !!m && typeof m !== 'string';
}

export const ScrollVideoCard: React.FC<ScrollVideoCardProps> = ({
  media,
  poster,
  mediaType = 'video',
  muted = true,
  loop = true,
  playsInline = true,
  autoPlay = false,
  overlay,
  initialBoxSize = 360,
  targetSize = 'fullscreen',
  scrollHeightVh = 200,
  sticky = true,
  overlayBlur = 10,
  overlayRevealDelay = 0.35,
  smoothScroll = false,
  className,
  style,
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const overlayCaptionRef = useRef<HTMLDivElement | null>(null);
  const overlayContentRef = useRef<HTMLDivElement | null>(null);
  const isClient = typeof window !== 'undefined';

  const cssVars: CSSProperties = useMemo(
    () => ({
      ['--initial-size' as string]: `${initialBoxSize}px`,
      ['--overlay-blur' as string]: `${overlayBlur}px`,
    }),
    [initialBoxSize, overlayBlur]
  );

  useEffect(() => {
    if (!isClient) return;

    let gsap: any;
    let ScrollTrigger: any;
    let mainTl: any;
    let overlayDarkenEl: HTMLDivElement | null = null;
    let cancelled = false;

    (async () => {
      const gsapPkg = await import('gsap');
      gsap = gsapPkg.gsap || gsapPkg.default || gsapPkg;
      const ScrollTriggerPkg =
        (await import('gsap/ScrollTrigger').catch(
          () => import('gsap/dist/ScrollTrigger')
        )) || {};
      ScrollTrigger =
        ScrollTriggerPkg.default ||
        (ScrollTriggerPkg as any).ScrollTrigger ||
        ScrollTriggerPkg;

      gsap.registerPlugin(ScrollTrigger);

      if (cancelled) return;

      const container = containerRef.current!;
      const overlayEl = overlayRef.current;
      const overlayCaption = overlayCaptionRef.current;
      const overlayContent = overlayContentRef.current;

      if (container) {
        overlayDarkenEl = document.createElement('div');
        overlayDarkenEl.style.position = 'absolute';
        overlayDarkenEl.style.inset = '0';
        overlayDarkenEl.style.background = 'rgba(0,0,0,0)';
        overlayDarkenEl.style.pointerEvents = 'none';
        overlayDarkenEl.style.zIndex = '1';
        container.appendChild(overlayDarkenEl);
      }

      const triggerEl = rootRef.current?.querySelector(
        '[data-sticky-scroll]'
      ) as HTMLElement;
      if (!triggerEl || !container) return;

      mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerEl,
          start: 'top center',
          end: 'bottom bottom',
          scrub: 1.1,
        },
      });

      const target =
        targetSize === 'fullscreen'
          ? { width: '94vw', height: '90vh', borderRadius: 12 }
          : {
              width: `${targetSize.widthVw}vw`,
              height: `${targetSize.heightVh}vh`,
              borderRadius: targetSize.borderRadius ?? 0,
            };

      gsap.set(container, {
        width: initialBoxSize,
        height: initialBoxSize,
        borderRadius: 20,
      });

      if (overlayEl) gsap.set(overlayEl, { clipPath: 'inset(100% 0 0 0)' });
      if (overlayContent)
        gsap.set(overlayContent, {
          filter: `blur(${overlayBlur}px)`,
          scale: 1.05,
          y: 30,
        });

      mainTl.to(
        container,
        {
          width: target.width,
          height: target.height,
          borderRadius: target.borderRadius,
          ease: 'expo.out',
        },
        0
      );
      mainTl.to(
        overlayDarkenEl,
        { backgroundColor: 'rgba(0,0,0,0.4)', ease: 'power2.out' },
        0
      );

      if (overlayEl) {
        mainTl.to(
          overlayEl,
          {
            clipPath: 'inset(0% 0 0 0)',
            backdropFilter: `blur(${overlayBlur}px)`,
            ease: 'expo.out',
          },
          overlayRevealDelay
        );
      }
      if (overlayContent)
        mainTl.to(
          overlayContent,
          { y: 0, filter: 'blur(0px)', scale: 1, ease: 'expo.out' },
          overlayRevealDelay + 0.05
        );

      const videoEl = container.querySelector(
        'video'
      ) as HTMLVideoElement | null;
      if (videoEl) {
        const tryPlay = () => videoEl.play().catch(() => {});
        tryPlay();
        ScrollTrigger.create({
          trigger: triggerEl,
          start: 'top center',
          onEnter: tryPlay,
        });
      }
    })();

    return () => {
      cancelled = true;
      try {
        mainTl?.kill?.();
      } catch {}
      try {
        if (overlayDarkenEl?.parentElement)
          overlayDarkenEl.parentElement.removeChild(overlayDarkenEl);
      } catch {}
    };
  }, [
    isClient,
    initialBoxSize,
    targetSize,
    scrollHeightVh,
    overlayBlur,
    overlayRevealDelay,
    sticky,
    smoothScroll,
  ]);

  const renderMedia = () => {
    if (mediaType === 'image') {
      const src = typeof media === 'string' ? media : media?.mp4 || '';
      return <img src={src} alt="" className="h-full w-full object-cover" />;
    }
    const sources: JSX.Element[] = [];
    if (typeof media === 'string') {
      sources.push(<source key="mp4" src={media} type="video/mp4" />);
    } else if (isSourceObject(media)) {
      if (media.webm)
        sources.push(<source key="webm" src={media.webm} type="video/webm" />);
      if (media.mp4)
        sources.push(<source key="mp4" src={media.mp4} type="video/mp4" />);
      if (media.ogg)
        sources.push(<source key="ogg" src={media.ogg} type="video/ogg" />);
    }
    return (
      <video
        poster={poster}
        muted
        loop={loop}
        playsInline={playsInline}
        autoPlay
        className="h-full w-full object-cover"
      >
        {sources}
      </video>
    );
  };

  return (
    <div
      ref={rootRef}
      className={`relative overflow-x-clip bg-black ${className || ''}`}
      style={{ ...cssVars, ...style }}
    >
      <div
        data-sticky-scroll
        style={{ height: `${Math.max(100, scrollHeightVh)}vh` }}
      >
        <div
          className={`${sticky ? 'sticky top-0' : ''} flex h-screen items-center justify-center`}
        >
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-[20px] bg-black shadow-2xl"
            style={{ width: initialBoxSize, height: initialBoxSize }}
          >
            {renderMedia()}

            {overlay && (
              <div
                ref={overlayRef}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 p-8 text-center backdrop-blur-md"
                style={{ clipPath: 'inset(100% 0 0 0)' }}
              >
                <div ref={overlayContentRef} className="max-w-3xl space-y-6">
                  {overlay.caption && (
                    <div ref={overlayCaptionRef} className="mb-4">
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#F58122]/30 bg-[#F58122]/20 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#F58122]">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-[#F58122]" />
                        {overlay.caption}
                      </span>
                    </div>
                  )}
                  {overlay.heading && (
                    <h3
                      className="bg-clip-text text-3xl font-bold text-transparent md:text-4xl lg:text-5xl"
                      style={{
                        backgroundImage:
                          'linear-gradient(90deg, #ffffff, #37AFE1, #F58122, #37AFE1, #ffffff)',
                        backgroundSize: '300% 100%',
                        animation: 'gradient-shift 4s ease-in-out infinite',
                      }}
                    >
                      {overlay.heading}
                    </h3>
                  )}
                  <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-[#F58122] to-[#37AFE1]" />
                  {overlay.paragraphs?.map((p, i) => (
                    <p
                      key={i}
                      className="text-lg font-light leading-relaxed text-white/90 md:text-xl"
                    >
                      {p}
                    </p>
                  ))}
                  {overlay.extra}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollVideoCard;
