'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

type CursorState = 'default' | 'hover' | 'click';

const LERP_FACTOR = 0.15;
const DOT_SIZE = 10; // Updated to 10px as per requirements
const RING_SIZE = 50;
const THROTTLE_MS = 16; // 60fps

export default function MagneticCursor() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  const mousePosition = useRef<CursorPosition>({ x: -100, y: -100 });
  const dotPosition = useRef<CursorPosition>({ x: -100, y: -100 });
  const ringPosition = useRef<CursorPosition>({ x: -100, y: -100 });

  const cursorState = useRef<CursorState>('default');
  const animationFrameId = useRef<number | null>(null);
  const isAnimating = useRef(false);
  const lastUpdate = useRef(0);

  // Linear interpolation
  const lerp = (start: number, end: number, factor: number): number => {
    return start + (end - start) * factor;
  };

  // Optimized animation loop - only updates when needed
  const animate = useCallback(() => {
    if (!isAnimating.current) return;

    const now = Date.now();
    const delta = now - lastUpdate.current;

    if (delta < THROTTLE_MS) {
      animationFrameId.current = requestAnimationFrame(animate);
      return;
    }

    lastUpdate.current = now;

    const targetX = mousePosition.current.x;
    const targetY = mousePosition.current.y;

    // Update dot position (faster)
    dotPosition.current.x = lerp(
      dotPosition.current.x,
      targetX,
      LERP_FACTOR * 1.5
    );
    dotPosition.current.y = lerp(
      dotPosition.current.y,
      targetY,
      LERP_FACTOR * 1.5
    );

    // Update ring position (slower, creates trailing effect)
    ringPosition.current.x = lerp(
      ringPosition.current.x,
      targetX,
      LERP_FACTOR * 0.5
    );
    ringPosition.current.y = lerp(
      ringPosition.current.y,
      targetY,
      LERP_FACTOR * 0.5
    );

    if (cursorDotRef.current) {
      cursorDotRef.current.style.transform = `translate(${dotPosition.current.x}px, ${dotPosition.current.y}px)`;
    }

    if (cursorRingRef.current) {
      cursorRingRef.current.style.transform = `translate(${ringPosition.current.x}px, ${ringPosition.current.y}px)`;
    }

    animationFrameId.current = requestAnimationFrame(animate);
  }, []);

  // Check if desktop on mount
  useEffect(() => {
    const hasMousePointer = window.matchMedia('(pointer: fine)').matches;
    setIsDesktop(hasMousePointer);

    if (hasMousePointer) {
      document.body.style.cursor = 'none';
    }

    return () => {
      document.body.style.cursor = '';
    };
  }, []);

  // Setup event listeners
  useEffect(() => {
    if (isDesktop !== true) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };

      if (dotPosition.current.x === -100) {
        dotPosition.current = { x: e.clientX, y: e.clientY };
        ringPosition.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseDown = () => {
      cursorState.current = 'click';
      if (cursorRingRef.current) {
        cursorRingRef.current.classList.add('cursor-click');
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.classList.add('cursor-click');
      }
    };

    const handleMouseUp = () => {
      cursorState.current = 'default';
      if (cursorRingRef.current) {
        cursorRingRef.current.classList.remove('cursor-click');
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.classList.remove('cursor-click');
      }
    };

    const isElement = (target: EventTarget | null): target is Element => {
      return target !== null && 'tagName' in target;
    };

    const isInteractiveElement = (element: Element): boolean => {
      const tagName = element.tagName;
      return (
        tagName === 'A' ||
        tagName === 'BUTTON' ||
        element.hasAttribute('data-magnetic') ||
        element.closest('a, button, [data-magnetic], [role="button"]') !== null
      );
    };

    const handleMouseEnter = (e: Event) => {
      const target = e.target;
      if (isElement(target)) {
        if (target.closest('[data-no-magnetic]')) return;

        if (isInteractiveElement(target)) {
          cursorState.current = 'hover';
          if (cursorRingRef.current) {
            cursorRingRef.current.classList.add('cursor-hover');
          }
          if (cursorDotRef.current) {
            cursorDotRef.current.classList.add('cursor-hover');
          }
        }
      }
    };

    const handleMouseLeave = () => {
      cursorState.current = 'default';
      if (cursorRingRef.current) {
        cursorRingRef.current.classList.remove('cursor-hover');
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.classList.remove('cursor-hover');
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, [isDesktop]);

  // Start animation loop
  useEffect(() => {
    if (isDesktop !== true) return;

    isAnimating.current = true;
    lastUpdate.current = Date.now();
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      isAnimating.current = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isDesktop, animate]);

  if (isDesktop !== true) return null;

  return (
    <>
      {/* Center dot - Orange from branding (#F58122) */}
      <div
        ref={cursorDotRef}
        className="pointer-events-none fixed left-0 top-0 z-[99999] will-change-transform"
        style={{
          width: `${DOT_SIZE}px`,
          height: `${DOT_SIZE}px`,
          marginLeft: `${-DOT_SIZE / 2}px`,
          marginTop: `${-DOT_SIZE / 2}px`,
          backgroundColor: '#F58122',
          borderRadius: '50%',
          boxShadow:
            '0 0 10px rgba(245, 129, 34, 0.8), 0 0 20px rgba(245, 129, 34, 0.4)',
        }}
      />

      {/* Outer ring with gradient border */}
      <div
        ref={cursorRingRef}
        className="pointer-events-none fixed left-0 top-0 z-[99998] will-change-transform"
        style={{
          width: `${RING_SIZE}px`,
          height: `${RING_SIZE}px`,
          marginLeft: `${-RING_SIZE / 2}px`,
          marginTop: `${-RING_SIZE / 2}px`,
        }}
      >
        <div className="relative h-full w-full">
          {/* Outer glow */}
          <div
            className="absolute -inset-2 rounded-full blur-lg"
            style={{
              background:
                'radial-gradient(circle, transparent 40%, rgba(59, 130, 246, 0.3) 100%)',
            }}
          />
          {/* Gradient ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'linear-gradient(135deg, rgba(59, 130, 246, 0.5), rgba(147, 197, 253, 0.5))',
              padding: '2.5px',
              WebkitMask:
                'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
          {/* Inner blur for depth */}
          <div
            className="absolute inset-[3px] rounded-full blur-sm"
            style={{
              background:
                'radial-gradient(circle, transparent 60%, rgba(59, 130, 246, 0.2))',
            }}
          />
          {/* Inner blur for depth */}
          <div
            className="absolute inset-[2px] rounded-full blur-sm"
            style={{
              background:
                'radial-gradient(circle, transparent 60%, rgba(59, 130, 246, 0.1) 100%)',
            }}
          />
        </div>
      </div>

      <style jsx>{`
        /* Hover state - ring expands, dot grows */
        .cursor-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cursor-hover > div > div:first-child {
          transform: scale(2);
          opacity: 0.6;
        }

        .cursor-hover + div > div > div:first-child {
          transform: scale(1.5);
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.5),
            rgba(147, 197, 253, 0.5)
          );
        }

        /* Click state - shrink both */
        .cursor-click {
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cursor-click > div {
          transform: scale(0.6);
        }

        .cursor-click + div > div {
          transform: scale(0.8);
        }
      `}</style>
    </>
  );
}
