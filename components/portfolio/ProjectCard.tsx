'use client';

import { useState, useRef, useEffect, useCallback, forwardRef } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ParticleWrapper } from '@/components/ui/particle-button';
import {
  getCloudinaryUrl,
  isExternalUrl,
} from '@/components/ui/cloudinary-image';

interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  thumbnailUrl: string;
  tags: string[];
  metrics: {
    label: string;
    value: string;
  }[];
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

function setRef<T>(el: T | null, ref: React.Ref<T> | undefined) {
  if (ref == null) return;
  if (typeof ref === 'function') ref(el);
  else (ref as React.MutableRefObject<T | null>).current = el;
}

const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(function ProjectCard(
  { project, onClick },
  ref
) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const particleIdRef = useRef(0);

  const mergedRef = useCallback(
    (el: HTMLDivElement | null) => {
      (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      setRef(el, ref);
    },
    [ref]
  );

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);

    // Emit particle burst during flip
    emitParticleBurst();
  };

  const emitParticleBurst = () => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const particleCount = 15;

    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = 2 + Math.random() * 3;

      newParticles.push({
        id: particleIdRef.current++,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);
  };

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;

    const animate = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.02,
          }))
          .filter((p) => p.life > 0)
      );
    };

    const intervalId = setInterval(animate, 16);
    return () => clearInterval(intervalId);
  }, [particles.length]);

  return (
    <div
      ref={mergedRef}
      className="group relative cursor-pointer"
      style={{ perspective: '1000px' }}
    >
      {/* Particle overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-lg">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute h-2 w-2 rounded-full bg-[#37AFE1]"
            style={{
              left: particle.x,
              top: particle.y,
              opacity: particle.life,
              boxShadow: `0 0 ${particle.life * 10}px rgba(55, 175, 225, ${particle.life})`,
            }}
          />
        ))}
      </div>

      {/* Card container with 3D flip */}
      <motion.div
        className="relative h-[400px] w-full"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s',
        }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
      >
        {/* Front side */}
        <div
          className="backface-hidden absolute inset-0 overflow-hidden rounded-lg border border-[#64748B]/20 bg-[#0F172A]"
          style={{ backfaceVisibility: 'hidden' }}
          onClick={onClick}
        >
          {/* Thumbnail */}
          <div className="relative h-48 bg-gradient-to-br from-[#37AFE1]/20 to-[#F58122]/20">
            <Image
              src={
                isExternalUrl(project.thumbnailUrl)
                  ? project.thumbnailUrl
                  : getCloudinaryUrl(project.thumbnailUrl, {
                      width: 400,
                      height: 300,
                    })
              }
              alt={project.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Content */}
          <div className="flex h-[calc(100%-192px)] flex-col p-4">
            <h3 className="mb-1 line-clamp-1 text-lg font-bold text-white transition-colors group-hover:text-[#37AFE1]">
              {project.title}
            </h3>
            <p className="mb-2 text-sm text-[#64748B]">{project.client}</p>
            <p className="mb-3 line-clamp-2 flex-shrink-0 text-sm text-[#64748B]">
              {project.description}
            </p>

            {/* Tags */}
            <div className="mb-3 flex flex-wrap gap-1.5">
              {project.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#37AFE1]/30 bg-[#37AFE1]/20 px-2 py-0.5 text-xs text-[#37AFE1]"
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="rounded-full bg-[#64748B]/20 px-2 py-0.5 text-xs text-[#64748B]">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>

            {/* Flip button */}
            <div className="mt-auto">
              <ParticleWrapper>
                <button
                  onClick={handleFlip}
                  className="text-sm text-[#37AFE1] transition-colors hover:text-[#F58122]"
                >
                  View Metrics →
                </button>
              </ParticleWrapper>
            </div>
          </div>

          {/* Hover effect */}
          <motion.div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#37AFE1]/0 to-[#F58122]/0"
            whileHover={{
              background: [
                'linear-gradient(to bottom right, rgba(55, 175, 225, 0) 0%, rgba(245, 129, 34, 0) 100%)',
                'linear-gradient(to bottom right, rgba(55, 175, 225, 0.1) 0%, rgba(245, 129, 34, 0.1) 100%)',
              ],
            }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Back side */}
        <div
          className="backface-hidden absolute inset-0 overflow-hidden rounded-lg border border-[#64748B]/20 bg-[#0F172A]"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="flex h-full flex-col justify-center p-6">
            <h3 className="mb-6 text-2xl font-bold text-white">
              Project Metrics
            </h3>

            {/* Metrics */}
            <div className="mb-6 space-y-4">
              {project.metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between rounded-lg bg-[#1E293B] p-3"
                >
                  <span className="text-[#64748B]">{metric.label}</span>
                  <span className="text-2xl font-bold text-[#F58122]">
                    {metric.value}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Flip back button */}
            <ParticleWrapper>
              <button
                onClick={handleFlip}
                className="text-sm text-[#37AFE1] transition-colors hover:text-[#F58122]"
              >
                ← Back to Details
              </button>
            </ParticleWrapper>
          </div>
        </div>
      </motion.div>

      {/* 3D hover effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-lg"
        whileHover={{
          boxShadow: '0 20px 40px rgba(55, 175, 225, 0.3)',
        }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
});

export default ProjectCard;
