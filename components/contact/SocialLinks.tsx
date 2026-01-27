'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSocialLinks } from '@/lib/hooks/useSocialLinks';

interface SocialLink {
  id: string;
  name: string;
  icon: string;
  url: string;
  color: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  life: number;
}

export default function SocialLinks() {
  const { socialLinks: settings } = useSocialLinks();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Build social links from settings
  const socialLinks: SocialLink[] = useMemo(() => {
    const links: SocialLink[] = [];

    if (settings.twitter) {
      links.push({
        id: 'twitter',
        name: 'Twitter',
        icon: '𝕏',
        url: settings.twitter,
        color: '#000000',
      });
    }
    if (settings.linkedin) {
      links.push({
        id: 'linkedin',
        name: 'LinkedIn',
        icon: '💼',
        url: settings.linkedin,
        color: '#0A66C2',
      });
    }
    if (settings.github) {
      links.push({
        id: 'github',
        name: 'GitHub',
        icon: '🐙',
        url: settings.github,
        color: '#181717',
      });
    }
    if (settings.instagram) {
      links.push({
        id: 'instagram',
        name: 'Instagram',
        icon: '📷',
        url: settings.instagram,
        color: '#E4405F',
      });
    }
    if (settings.youtube) {
      links.push({
        id: 'youtube',
        name: 'YouTube',
        icon: '▶️',
        url: settings.youtube,
        color: '#FF0000',
      });
    }
    if (settings.facebook) {
      links.push({
        id: 'facebook',
        name: 'Facebook',
        icon: 'f',
        url: settings.facebook,
        color: '#1877F2',
      });
    }

    return links;
  }, [settings]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;

    const animate = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + (p.targetX - p.x) * 0.1,
            y: p.y + (p.targetY - p.y) * 0.1,
            life: p.life - 0.02,
          }))
          .filter((p) => p.life > 0)
      );
    };

    const intervalId = setInterval(animate, 16);
    return () => clearInterval(intervalId);
  }, [particles.length]);

  // Create connection particles when hovering
  useEffect(() => {
    if (!hoveredLink) {
      setParticles([]);
      return;
    }

    const hoveredIndex = socialLinks.findIndex(
      (link) => link.id === hoveredLink
    );
    if (hoveredIndex === -1) return;

    // Create particles connecting to nearby links
    const newParticles: Particle[] = [];
    socialLinks.forEach((link, index) => {
      if (index === hoveredIndex) return;

      const distance = Math.abs(index - hoveredIndex);
      if (distance <= 2) {
        // Create connection particles
        for (let i = 0; i < 3; i++) {
          newParticles.push({
            id: particleIdRef.current++,
            x: (hoveredIndex % 3) * 200 + 100,
            y: Math.floor(hoveredIndex / 3) * 200 + 100,
            targetX: (index % 3) * 200 + 100,
            targetY: Math.floor(index / 3) * 200 + 100,
            life: 1.0,
          });
        }
      }
    });

    setParticles(newParticles);
  }, [hoveredLink]);

  return (
    <div ref={containerRef} className="relative">
      {/* Particle connections */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute h-2 w-2 rounded-full bg-[#2563EB]"
            style={{
              left: particle.x,
              top: particle.y,
              opacity: particle.life * 0.5,
              boxShadow: `0 0 ${particle.life * 10}px rgba(37, 99, 235, ${particle.life})`,
            }}
          />
        ))}
      </div>

      {/* Social links grid */}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
        {socialLinks.map((link, index) => (
          <SocialLinkCard
            key={link.id}
            link={link}
            index={index}
            isHovered={hoveredLink === link.id}
            onHover={() => setHoveredLink(link.id)}
            onLeave={() => setHoveredLink(null)}
            mousePosition={mousePosition}
          />
        ))}
      </div>
    </div>
  );
}

interface SocialLinkCardProps {
  link: SocialLink;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  mousePosition: { x: number; y: number };
}

function SocialLinkCard({
  link,
  index,
  isHovered,
  onHover,
  onLeave,
  mousePosition,
}: SocialLinkCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const cardCenterX =
      rect.left +
      rect.width / 2 -
      cardRef.current.offsetParent!.getBoundingClientRect().left;
    const cardCenterY =
      rect.top +
      rect.height / 2 -
      cardRef.current.offsetParent!.getBoundingClientRect().top;

    const dx = mousePosition.x - cardCenterX;
    const dy = mousePosition.y - cardCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Magnetic effect within 150px radius
    if (distance < 150) {
      const strength = (150 - distance) / 150;
      setMagneticOffset({
        x: (dx / distance) * strength * 20,
        y: (dy / distance) * strength * 20,
      });
    } else {
      setMagneticOffset({ x: 0, y: 0 });
    }
  }, [mousePosition]);

  return (
    <motion.a
      ref={cardRef}
      href={link?.url ?? '#'}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        x: magneticOffset.x,
        y: magneticOffset.y,
      }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="group relative"
    >
      <motion.div
        className="flex flex-col items-center justify-center rounded-lg border border-[#64748B]/20 bg-[#0F172A] p-8 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          borderColor: isHovered ? link.color : 'rgba(100, 116, 139, 0.2)',
          boxShadow: isHovered
            ? `0 0 30px ${link.color}40`
            : '0 0 0px transparent',
        }}
      >
        {/* Icon */}
        <div className="mb-3 text-5xl">{link.icon}</div>

        {/* Name */}
        <h3 className="font-semibold text-white">{link.name}</h3>

        {/* Hover glow */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.1 : 0 }}
          style={{ backgroundColor: link.color }}
        />
      </motion.div>
    </motion.a>
  );
}
