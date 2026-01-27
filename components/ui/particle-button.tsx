'use client';

import * as React from 'react';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ParticleEffectProps {
  elementRef: React.RefObject<HTMLElement>;
}

function ParticleEffect({ elementRef }: ParticleEffectProps) {
  const rect = elementRef.current?.getBoundingClientRect();
  if (!rect) return null;

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  return (
    <AnimatePresence>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="pointer-events-none fixed z-[9999] h-1 w-1 rounded-full bg-[#F58122]"
          style={{ left: centerX, top: centerY }}
          initial={{
            scale: 0,
            x: 0,
            y: 0,
          }}
          animate={{
            scale: [0, 1, 0],
            x: [0, (i % 2 ? 1 : -1) * (Math.random() * 50 + 20)],
            y: [0, -Math.random() * 50 - 20],
          }}
          transition={{
            duration: 0.6,
            delay: i * 0.1,
            ease: 'easeOut',
          }}
        />
      ))}
    </AnimatePresence>
  );
}

// Hook to add particle effect to any element
export function useParticleEffect(duration = 1000) {
  const [showParticles, setShowParticles] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  const triggerParticles = () => {
    setShowParticles(true);
    setTimeout(() => {
      setShowParticles(false);
    }, duration);
  };

  const ParticlePortal = () =>
    showParticles ? <ParticleEffect elementRef={elementRef} /> : null;

  return { elementRef, triggerParticles, ParticlePortal, showParticles };
}

// Wrapper component for any clickable element
interface ParticleWrapperProps {
  children: React.ReactNode;
  className?: string;
  successDuration?: number;
}

export function ParticleWrapper({
  children,
  className,
  successDuration = 1000,
}: ParticleWrapperProps) {
  const [showParticles, setShowParticles] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setShowParticles(true);
    setTimeout(() => {
      setShowParticles(false);
    }, successDuration);
  };

  return (
    <>
      {showParticles && (
        <ParticleEffect
          elementRef={wrapperRef as React.RefObject<HTMLElement>}
        />
      )}
      <div
        ref={wrapperRef}
        onClick={handleClick}
        className={cn(
          'inline-block',
          showParticles && 'scale-95',
          'transition-transform duration-100',
          className
        )}
      >
        {children}
      </div>
    </>
  );
}

export { ParticleEffect };
