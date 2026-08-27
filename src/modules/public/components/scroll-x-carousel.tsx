'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  type HTMLMotionProps,
  type MotionValue,
  motion,
  useScroll,
  useTransform,
  useMotionValue,
} from 'framer-motion';

interface ScrollXCarouselContextValue {
  scrollYProgress: MotionValue<number>;
}

const ScrollXCarouselContext =
  React.createContext<ScrollXCarouselContextValue | null>(null);

function useScrollXCarousel() {
  const context = React.useContext(ScrollXCarouselContext);
  if (!context) {
    throw new Error('useScrollXCarousel must be used within a ScrollXCarousel');
  }
  return context;
}

/**
 * Inner component that uses useScroll - only rendered after mount
 * This prevents the "non-static position" warning from Framer Motion
 */
function ScrollXCarouselInner({
  children,
  className,
  carouselRef,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  carouselRef: React.RefObject<HTMLDivElement>;
}) {
  const { scrollYProgress } = useScroll({
    target: carouselRef,
    offset: ['start start', 'end end'],
  });

  return (
    <ScrollXCarouselContext.Provider value={{ scrollYProgress }}>
      <div
        ref={carouselRef}
        className={cn('relative w-screen max-w-full', className)}
        {...props}
      >
        {children}
      </div>
    </ScrollXCarouselContext.Provider>
  );
}

export function ScrollXCarousel({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);
  const fallback = useMotionValue(0);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Before mount, render a placeholder with fallback context value
  if (!mounted) {
    return (
      <ScrollXCarouselContext.Provider value={{ scrollYProgress: fallback }}>
        <div
          ref={carouselRef}
          className={cn('relative w-screen max-w-full', className)}
          {...props}
        >
          {children}
        </div>
      </ScrollXCarouselContext.Provider>
    );
  }

  // After mount, render with actual scroll tracking
  return (
    <ScrollXCarouselInner
      carouselRef={carouselRef}
      className={className}
      {...props}
    >
      {children}
    </ScrollXCarouselInner>
  );
}

export function ScrollXCarouselContainer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('sticky left-0 top-0 w-full overflow-hidden', className)}
      {...props}
    />
  );
}

export function ScrollXCarouselWrap({
  className,
  style,
  xRagnge = ['-0%', '-80%'],
  ...props
}: HTMLMotionProps<'div'> & { xRagnge?: string[] }) {
  const { scrollYProgress } = useScrollXCarousel();
  const x = useTransform(scrollYProgress, [0, 1], xRagnge);

  return (
    <motion.div
      className={cn('w-fit', className)}
      style={{ x, ...style }}
      {...props}
    />
  );
}

export function ScrollXCarouselProgress({
  className,
  style,
  progressStyle,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { progressStyle?: string }) {
  const { scrollYProgress } = useScrollXCarousel();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className={cn('max-w-screen overflow-hidden', className)} {...props}>
      <motion.div
        className={cn('origin-left', progressStyle)}
        style={{ scaleX, ...style }}
      />
    </div>
  );
}
