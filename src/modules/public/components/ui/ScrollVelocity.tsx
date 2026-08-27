'use client';

import React, { useRef, useLayoutEffect, useState, useCallback } from 'react';
import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
  useAnimationFrame,
} from 'framer-motion';

interface ScrollVelocityProps {
  children: React.ReactNode;
  baseVelocity?: number;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: { input: [number, number]; output: [number, number] };
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
}

function ScrollVelocity({
  children,
  baseVelocity = 100,
  scrollContainerRef,
  className = '',
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName = '',
  scrollerClassName = '',
  parallaxStyle,
  scrollerStyle,
}: ScrollVelocityProps) {
  const baseX = useRef(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [copyWidth, setCopyWidth] = useState(0);

  const { scrollY } = useScroll({
    container: scrollContainerRef,
  });

  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping,
    stiffness,
  });

  const velocityFactor = useTransform(
    smoothVelocity,
    velocityMapping.input,
    velocityMapping.output
  );

  const xMotion = useSpring(0, { damping: 50, stiffness: 400 });
  const x = useTransform(xMotion, (v: number) => `${v}px`);

  const measureWidth = useCallback(() => {
    if (scrollerRef.current) {
      const children = scrollerRef.current.children;
      if (children.length > 0) {
        const firstChild = children[0] as HTMLElement;
        setCopyWidth(firstChild.offsetWidth);
      }
    }
  }, []);

  useLayoutEffect(() => {
    measureWidth();
    window.addEventListener('resize', measureWidth);
    return () => window.removeEventListener('resize', measureWidth);
  }, [measureWidth]);

  useAnimationFrame((_, delta) => {
    const moveBy = baseVelocity * (delta / 1000);
    const velocityAdjust = velocityFactor.get();

    baseX.current += moveBy + moveBy * velocityAdjust;

    if (copyWidth > 0) {
      if (baseX.current < -copyWidth) {
        baseX.current += copyWidth;
      } else if (baseX.current > 0) {
        baseX.current -= copyWidth;
      }
    }

    xMotion.set(baseX.current);
  });

  return (
    <div
      className={`overflow-hidden whitespace-nowrap ${parallaxClassName} ${className}`}
      style={parallaxStyle}
    >
      <motion.div
        ref={scrollerRef}
        className={`inline-flex ${scrollerClassName}`}
        style={{ x, ...scrollerStyle }}
      >
        {Array.from({ length: numCopies }).map((_, i) => (
          <div key={i} className="flex-shrink-0">
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default ScrollVelocity;
