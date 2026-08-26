'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLenis } from './LenisProvider';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const { stop, start } = useLenis();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoStateRef = useRef<{ currentTime: number; src: string } | null>(
    null
  );
  const prevPathname = useRef(pathname);

  // Mark first load complete
  useEffect(() => {
    setIsFirstLoad(false);
  }, []);

  // Store video state before transition
  useEffect(() => {
    if (pathname !== prevPathname.current) {
      const videos = document.querySelectorAll('video');
      if (videos.length > 0) {
        const video = videos[0] as HTMLVideoElement;
        videoStateRef.current = {
          currentTime: video.currentTime,
          src: video.src,
        };
      }
      prevPathname.current = pathname;
    }
  }, [pathname]);

  // Restore video state after transition
  useEffect(() => {
    if (videoStateRef.current && !isTransitioning) {
      const videos = document.querySelectorAll('video');
      videos.forEach((video) => {
        if (video.src === videoStateRef.current?.src) {
          video.currentTime = videoStateRef.current.currentTime;
          video.play().catch(() => {
            // Autoplay might be blocked
          });
        }
      });
    }
  }, [pathname, isTransitioning]);

  // On first load, just render children without animation
  if (isFirstLoad) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        start();
        setIsTransitioning(false);
      }}
    >
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        onAnimationStart={() => {
          if (!isFirstLoad) {
            stop();
            setIsTransitioning(true);
          }
        }}
        onAnimationComplete={() => {
          start();
          setIsTransitioning(false);
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
