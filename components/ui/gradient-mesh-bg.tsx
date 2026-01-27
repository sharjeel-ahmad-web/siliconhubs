'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  vx: number; // Horizontal drift (small)
  vy: number; // Vertical speed (main movement)
}

export function GradientMeshBackground() {
  const shouldReduceMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  // Create particle function
  const createParticle = (
    canvasWidth: number,
    canvasHeight: number
  ): Particle => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * -canvasHeight, // Start above viewport
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.3, // Slight horizontal drift
    vy: Math.random() * 0.5 + 0.3, // Downward movement
  });

  // Initialize particles
  useEffect(() => {
    if (shouldReduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // Initialize particles if empty
      if (particlesRef.current.length === 0) {
        particlesRef.current = Array.from({ length: 50 }, () =>
          createParticle(canvas.width, canvas.height)
        );
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Move particle
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Reset particle when it goes below sphere (at ~70% of viewport height)
        if (particle.y > canvas.height * 0.7) {
          particlesRef.current[index] = createParticle(
            canvas.width,
            canvas.height
          );
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(55, 175, 225, ${particle.opacity})`;
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [shouldReduceMotion]);

  // Define animation variants based on reduced motion preference
  const getAnimationProps = (
    xRange: number[],
    yRange: number[],
    scale: number[],
    duration: number
  ) => {
    if (shouldReduceMotion) {
      // Static positioning when reduced motion is preferred
      return {
        animate: {},
        transition: {},
      };
    }

    return {
      animate: {
        x: xRange,
        y: yRange,
        scale: scale,
      },
      transition: {
        duration: duration,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    };
  };

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ zIndex: 1 }}
      />

      {/* First gradient orb - Blue */}
      <motion.div
        className="absolute h-[300px] w-[300px] rounded-full opacity-30 blur-3xl sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px]"
        style={{
          background:
            'radial-gradient(circle, rgba(55,175,225,0.8) 0%, transparent 70%)',
          top: '10%',
          left: '10%',
        }}
        {...getAnimationProps([0, 100, 0], [0, -100, 0], [1, 1.2, 1], 20)}
      />

      {/* Second gradient orb - Orange */}
      <motion.div
        className="absolute h-[350px] w-[350px] rounded-full opacity-25 blur-3xl sm:h-[500px] sm:w-[500px] md:h-[600px] md:w-[600px]"
        style={{
          background:
            'radial-gradient(circle, rgba(245,129,34,0.7) 0%, transparent 70%)',
          top: '40%',
          right: '10%',
        }}
        {...getAnimationProps([0, -80, 0], [0, 80, 0], [1, 1.1, 1], 25)}
      />

      {/* Third gradient orb - Light Blue */}
      <motion.div
        className="absolute h-[250px] w-[250px] rounded-full opacity-20 blur-3xl sm:h-[350px] sm:w-[350px] md:h-[450px] md:w-[450px]"
        style={{
          background:
            'radial-gradient(circle, rgba(49,164,219,0.6) 0%, transparent 70%)',
          bottom: '15%',
          left: '30%',
        }}
        {...getAnimationProps([0, 60, 0], [0, -60, 0], [1, 1.15, 1], 22)}
      />

      {/* Optional: Gradient lines for additional depth */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute left-0 top-1/4 h-px w-full"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(55,175,225,0.5), transparent)',
          }}
        />
        <div
          className="absolute left-0 top-3/4 h-px w-full"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(245,129,34,0.5), transparent)',
          }}
        />
      </div>
    </div>
  );
}
