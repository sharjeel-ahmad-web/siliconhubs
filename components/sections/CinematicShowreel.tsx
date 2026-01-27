'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { MovingBorder } from '@/components/ui/moving-border';

gsap.registerPlugin(ScrollTrigger);

export default function CinematicShowreel() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userStarted, setUserStarted] = useState(false);

  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const volumeAnimationRef = useRef<gsap.core.Tween | null>(null);

  // Responsive video source selection
  useEffect(() => {
    const updateVideoSource = () => {
      const width = window.innerWidth;
      if (width > 768) {
        setVideoSrc('/videos/showreel_desktop_16-9.mp4');
      } else {
        setVideoSrc('/videos/showreel_mobile_9-16.mp4');
      }
    };

    updateVideoSource();

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateVideoSource, 250);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // GSAP ScrollTrigger for parallax - optimized with will-change
  useEffect(() => {
    if (!sectionRef.current || !cardRef.current) return;

    const section = sectionRef.current;
    const card = cardRef.current;

    // Add will-change for GPU optimization
    card.style.willChange = 'transform';

    // Parallax effect with optimized settings
    const tween = gsap.to(card, {
      y: -30, // Use fixed pixels instead of percent for smoother animation
      ease: 'none',
      force3D: true, // Force GPU acceleration
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5, // Slight smoothing for buttery scroll
        invalidateOnRefresh: true,
      },
    });

    return () => {
      card.style.willChange = 'auto';
      tween.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === section) {
          trigger.kill();
        }
      });
    };
  }, [isVideoLoaded]);

  // Play/Pause on hover effect
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideoLoaded) return;

    const doPlay = async () => {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    };

    const doPause = () => {
      video.pause();
      setIsPlaying(false);
    };

    if (isHovering && !userStarted) {
      void doPlay();
    } else if (!isHovering && !userStarted) {
      doPause();
    }
  }, [isHovering, userStarted, isVideoLoaded]);

  // Sync play state with video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setUserStarted(false);
    };

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
    };
  }, []);

  // Toggle play/pause on click
  const togglePlayPause = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isPlaying) {
      setUserStarted(true);
      try {
        await video.play();
        setIsPlaying(true);
      } catch (err) {
        console.error('Play failed:', err);
        setIsPlaying(false);
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isPlaying]);

  // Volume fade animation
  const toggleMute = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!videoRef.current) return;

      const video = videoRef.current;

      if (volumeAnimationRef.current) {
        volumeAnimationRef.current.kill();
      }

      if (isMuted) {
        video.muted = false;
        video.volume = 0;
        volumeAnimationRef.current = gsap.to(video, {
          volume: 1,
          duration: 0.8,
          ease: 'power2.out',
        });
      } else {
        volumeAnimationRef.current = gsap.to(video, {
          volume: 0,
          duration: 0.5,
          ease: 'power2.in',
          onComplete: () => {
            video.muted = true;
          },
        });
      }

      setIsMuted(!isMuted);
    },
    [isMuted]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  const handleVideoLoaded = useCallback(() => {
    setIsVideoLoaded(true);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-transparent px-6 pb-6 pt-16"
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Monitor/Card Frame */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="gpu-accelerated relative"
          style={{ transform: 'translateZ(0)' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={togglePlayPause}
        >
          {/* Simple Rounded Card with Moving Border */}
          <div
            className="group relative overflow-hidden rounded-xl p-[2px] shadow-lg"
            style={{
              willChange: 'transform',
              transform: 'translateZ(0)',
              background: '#0A0F1E',
            }}
          >
            {/* Moving border animation */}
            <div
              className="absolute inset-0"
              style={{ borderRadius: '0.75rem' }}
            >
              <MovingBorder duration={4000} rx="12" ry="12">
                <div
                  className="h-24 w-24 opacity-[0.9]"
                  style={{
                    background:
                      'radial-gradient(#37AFE1 30%, #F58122 50%, transparent 70%)',
                    filter: 'blur(2px)',
                  }}
                />
              </MovingBorder>
            </div>

            {/* Static border glow */}
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                border: '1px solid rgba(55, 175, 225, 0.3)',
              }}
            />

            {/* Inner card container */}
            <div className="relative overflow-hidden rounded-xl bg-black">
              {/* Video Container */}
              <div className="relative aspect-video bg-[#0A0F1E]">
                {videoSrc && (
                  <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    src={videoSrc}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    onLoadedData={handleVideoLoaded}
                    style={{ transform: 'translateZ(0)' }}
                  />
                )}

                {/* Gradient overlay - static, no animations */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(10, 15, 30, 0.4), transparent, transparent)',
                  }}
                />

                {/* Play/Pause Button Overlay */}
                <AnimatePresence>
                  {(isHovering || !isPlaying) && isVideoLoaded && (
                    <motion.div
                      key="play-overlay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlayPause();
                        }}
                        className="pointer-events-auto flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
                        style={{
                          background: 'rgba(245, 129, 34, 0.9)',
                          boxShadow:
                            '0 0 40px rgba(245, 129, 34, 0.5), 0 0 80px rgba(245, 129, 34, 0.3)',
                        }}
                        aria-label={isPlaying ? 'Pause video' : 'Play video'}
                      >
                        {isPlaying ? (
                          <Pause className="h-10 w-10 text-white" />
                        ) : (
                          <Play className="ml-1 h-10 w-10 text-white" />
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Status badge */}
                <div className="absolute bottom-4 left-4 z-10 rounded-full bg-black/40 px-3 py-1.5 text-xs text-white/80 backdrop-blur-sm">
                  {isPlaying ? 'Playing' : 'Paused'}
                </div>

                {/* Sound toggle button */}
                <button
                  onClick={toggleMute}
                  className="absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-xs text-white/80 backdrop-blur-sm transition-colors hover:bg-black/60"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">
                    {isMuted ? 'Sound Off' : 'Sound On'}
                  </span>
                </button>

                {/* Loading state */}
                {!isVideoLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0A0F1E]">
                    <div className="flex flex-col items-center gap-4">
                      <div
                        className="h-12 w-12 animate-spin rounded-full"
                        style={{
                          border: '2px solid rgba(55, 175, 225, 0.3)',
                          borderTopColor: '#37AFE1',
                        }}
                      />
                      <span className="text-sm text-[#64748B]">
                        Loading showreel...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mobile sound button */}
        <div className="mt-6 flex justify-center md:hidden">
          <button
            className="flex items-center gap-2 rounded-full px-6 py-3 transition-transform duration-200 active:scale-95"
            style={{
              background:
                'linear-gradient(135deg, rgba(55, 175, 225, 0.2) 0%, rgba(49, 164, 219, 0.2) 100%)',
              border: '1px solid rgba(55, 175, 225, 0.3)',
            }}
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 text-white" />
            ) : (
              <Volume2 className="h-5 w-5 text-white" />
            )}
            <span className="text-sm font-medium text-white/80">
              {isMuted ? 'Tap for Sound' : 'Mute'}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
