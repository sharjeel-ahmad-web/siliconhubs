'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export interface FunnelStage {
  name: string;
  percentage: number;
  color: string;
}

export interface ConversionFunnelProps {
  stages?: FunnelStage[];
  conversionLabel?: string;
  abandonmentLabel?: string;
}

const defaultStages: FunnelStage[] = [
  { name: 'Visitors', percentage: 100, color: '#2563EB' },
  { name: 'Product Views', percentage: 65, color: '#F97316' },
  { name: 'Add to Cart', percentage: 35, color: '#2563EB' },
  { name: 'Checkout', percentage: 20, color: '#F97316' },
  { name: 'Purchase', percentage: 15, color: '#31A4DB' },
];

/**
 * ConversionFunnel Component
 *
 * Visualizes e-commerce conversion funnel with particle flow showing customer journey.
 * Particles flow through funnel stages with Success Green for conversions and Warning Amber for abandonment.
 *
 * Validates: Requirements 13.1, 13.2, 13.3
 */
export function ConversionFunnel({
  stages: propStages,
  conversionLabel = 'Conversions',
  abandonmentLabel = 'Abandonment',
}: ConversionFunnelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeStage, setActiveStage] = useState<number | null>(null);

  const stages =
    propStages && propStages.length > 0 ? propStages : defaultStages;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Particle system
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      stage: number;
      color: string;
      life: number;
      maxLife: number;
    }

    const particles: Particle[] = [];
    const maxParticles = 100;

    // Create particles
    const createParticle = () => {
      const stage = Math.floor(Math.random() * stages.length);
      const stageData = stages[stage];

      // Determine if this particle converts or abandons
      const converts =
        Math.random() <
        (stages[stage + 1]?.percentage || 0) / stageData.percentage;

      particles.push({
        x: canvas.offsetWidth / 2 + (Math.random() - 0.5) * 100,
        y: 50 + stage * 100,
        vx: (Math.random() - 0.5) * 2,
        vy: converts ? 2 : 1,
        stage,
        color: converts ? '#31A4DB' : '#F59E0B',
        life: 0,
        maxLife: 100,
      });
    };

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Create new particles
      if (particles.length < maxParticles && Math.random() < 0.3) {
        createParticle();
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        // Remove dead particles
        if (p.life > p.maxLife || p.y > canvas.offsetHeight) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle
        const alpha = 1 - p.life / p.maxLife;
        ctx.fillStyle =
          p.color +
          Math.floor(alpha * 255)
            .toString(16)
            .padStart(2, '0');
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 10);
        gradient.addColorStop(0, p.color + '40');
        gradient.addColorStop(1, p.color + '00');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-2xl bg-[#0F172A]">
      {/* Canvas for particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Funnel stages */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-8">
        {stages.map((stage, index) => {
          const width = (stage.percentage / 100) * 600;

          return (
            <motion.div
              key={stage.name}
              className="relative mb-4 cursor-pointer"
              style={{ width: `${width}px` }}
              onHoverStart={() => setActiveStage(index)}
              onHoverEnd={() => setActiveStage(null)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              {/* Stage bar */}
              <motion.div
                className="relative flex h-16 items-center justify-center overflow-hidden rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${stage.color}40, ${stage.color}80)`,
                  border: `2px solid ${stage.color}`,
                  boxShadow:
                    activeStage === index
                      ? `0 0 30px ${stage.color}80`
                      : 'none',
                }}
                animate={{
                  scale: activeStage === index ? 1.05 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${stage.color}40, transparent)`,
                  }}
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />

                {/* Content */}
                <div className="relative z-10 text-center">
                  <div className="text-lg font-bold text-white">
                    {stage.name}
                  </div>
                  <div className="text-sm text-white/80">
                    {stage.percentage}%
                  </div>
                </div>
              </motion.div>

              {/* Conversion point glow */}
              {index < stages.length - 1 && (
                <motion.div
                  className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 transform rounded-full"
                  style={{
                    background: stage.color,
                    boxShadow: `0 0 20px ${stage.color}`,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#31A4DB]" />
          <span className="text-white/80">{conversionLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#F59E0B]" />
          <span className="text-white/80">{abandonmentLabel}</span>
        </div>
      </div>
    </div>
  );
}
