'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { GlowCard } from '@/components/ui/glow-card';
import { SectionHeading } from '@/components/ui/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';
import { useAnalytics } from '@/components/analytics/AnalyticsTracker';

interface ServiceIcon {
  id: string;
  name: string;
  icon: string;
  description: string;
  relatedServices?: string[]; // IDs of related services for particle connections
}

const defaultServices: ServiceIcon[] = [
  {
    id: 'n8n',
    name: 'N8N Automations',
    icon: '⚡',
    description: 'Workflow automation',
    relatedServices: ['chatbot', 'shopify'],
  },
  {
    id: 'chatbot',
    name: 'Chatbot Development',
    icon: '🤖',
    description: 'AI-powered conversations',
    relatedServices: ['n8n', 'web-design'],
  },
  {
    id: 'web-design',
    name: 'Web Design',
    icon: '🎨',
    description: 'Beautiful interfaces',
    relatedServices: ['chatbot', 'wordpress'],
  },
  {
    id: 'wordpress',
    name: 'WordPress',
    icon: '📝',
    description: 'Content management',
    relatedServices: ['web-design', 'seo'],
  },
  {
    id: 'shopify',
    name: 'Shopify',
    icon: '🛒',
    description: 'E-commerce solutions',
    relatedServices: ['n8n', 'seo'],
  },
  {
    id: 'seo',
    name: 'SEO',
    icon: '📈',
    description: 'Search optimization',
    relatedServices: ['wordpress', 'shopify'],
  },
];

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export default function ValueProposition() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const iconRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const hasTrackedParticle = useRef(false);
  const { trackEvent } = useAnalytics();

  // Track particle interaction
  const trackParticleInteraction = useCallback(() => {
    if (!hasTrackedParticle.current) {
      hasTrackedParticle.current = true;
      trackEvent('particle_interaction', { section: 'valueProposition' });
    }
  }, [trackEvent]);

  // Fetch CMS content
  const { content: sectionContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    services?: ServiceIcon[];
    colors?: {
      cardBackground?: string;
      cardAccentColor?: string;
      cardHoverAccentColor?: string;
      particleColor?: string;
      connectionLineStart?: string;
      connectionLineEnd?: string;
    };
  }>('home', 'valueProposition');

  // Use CMS data or fallback to defaults
  const eyebrow = sectionContent?.eyebrow || 'Digital Excellence';
  const title = sectionContent?.title || 'Transform Your';
  const titleHighlight = sectionContent?.titleHighlight || 'Digital Presence';
  const subtitle =
    sectionContent?.subtitle ||
    'Premium digital solutions powered by cutting-edge technology';
  const services = sectionContent?.services || defaultServices;

  // Color configuration from CMS
  const colors = {
    cardBackground: sectionContent?.colors?.cardBackground || '#1E293B',
    cardAccentColor: sectionContent?.colors?.cardAccentColor || '#37AFE1',
    cardHoverAccentColor:
      sectionContent?.colors?.cardHoverAccentColor || '#F58122',
    particleColor: sectionContent?.colors?.particleColor || '#37AFE1',
    connectionLineStart:
      sectionContent?.colors?.connectionLineStart || '#37AFE1',
    connectionLineEnd: sectionContent?.colors?.connectionLineEnd || '#F58122',
  };

  // Emit particles on hover
  const emitParticles = (serviceId: string) => {
    const iconElement = iconRefs.current.get(serviceId);
    if (!iconElement) return;

    const rect = iconElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const particleCount = Math.floor(Math.random() * 6) + 5; // 5-10 particles
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 100 + Math.random() * 100; // 100-200 px/s

      newParticles.push({
        id: particleIdRef.current++,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.5, // 1.5 seconds lifetime
        maxLife: 1.5,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);
  };

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      setParticles((prevParticles) => {
        return prevParticles
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx * deltaTime,
            y: particle.y + particle.vy * deltaTime,
            life: particle.life - deltaTime,
          }))
          .filter((particle) => particle.life > 0);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [particles.length > 0]);

  // Draw particles on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw particles - convert hex to rgba
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 55, g: 175, b: 225 };
    };
    const particleRgb = hexToRgb(colors.particleColor);

    particles.forEach((particle) => {
      const opacity = particle.life / particle.maxLife;
      ctx.fillStyle = `rgba(${particleRgb.r}, ${particleRgb.g}, ${particleRgb.b}, ${opacity * 0.8})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw connections between related services
    if (hoveredService) {
      const hoveredIcon = iconRefs.current.get(hoveredService);
      if (hoveredIcon) {
        const hoveredRect = hoveredIcon.getBoundingClientRect();
        const hoveredCenterX = hoveredRect.left + hoveredRect.width / 2;
        const hoveredCenterY = hoveredRect.top + hoveredRect.height / 2;

        const service = services.find((s) => s.id === hoveredService);
        if (service) {
          service.relatedServices?.forEach((relatedId) => {
            const relatedIcon = iconRefs.current.get(relatedId);
            if (relatedIcon) {
              const relatedRect = relatedIcon.getBoundingClientRect();
              const relatedCenterX = relatedRect.left + relatedRect.width / 2;
              const relatedCenterY = relatedRect.top + relatedRect.height / 2;

              // Draw gradient line - convert hex to rgba
              const startRgb = hexToRgb(colors.connectionLineStart);
              const endRgb = hexToRgb(colors.connectionLineEnd);

              const gradient = ctx.createLinearGradient(
                hoveredCenterX,
                hoveredCenterY,
                relatedCenterX,
                relatedCenterY
              );
              gradient.addColorStop(
                0,
                `rgba(${startRgb.r}, ${startRgb.g}, ${startRgb.b}, 0.9)`
              );
              gradient.addColorStop(
                1,
                `rgba(${endRgb.r}, ${endRgb.g}, ${endRgb.b}, 0.9)`
              );

              ctx.strokeStyle = gradient;
              ctx.lineWidth = 2;
              ctx.shadowBlur = 10;
              ctx.shadowColor = colors.connectionLineStart;
              ctx.beginPath();
              ctx.moveTo(hoveredCenterX, hoveredCenterY);
              ctx.lineTo(relatedCenterX, relatedCenterY);
              ctx.stroke();
              ctx.shadowBlur = 0;
            }
          });
        }
      }
    }
  }, [particles, hoveredService]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-transparent px-6 pb-44 pt-20"
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-10"
        style={{ mixBlendMode: 'screen' }}
      />

      <div className="relative z-20 mx-auto max-w-7xl">
        {/* Headline */}
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          titleHighlight={titleHighlight}
          subtitle={subtitle}
        />

        {/* Service icons grid */}
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              ref={(el) => {
                if (el) iconRefs.current.set(service.id, el);
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={
                isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
              }
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: [0.34, 1.56, 0.64, 1], // back.out easing
              }}
              onMouseEnter={() => {
                setHoveredService(service.id);
                emitParticles(service.id);
                trackParticleInteraction();
              }}
              onMouseLeave={() => setHoveredService(null)}
              className="group relative"
            >
              {/* Icon container - no blinking animations */}
              <GlowCard
                backgroundColor={colors.cardBackground}
                accentColor={
                  hoveredService === service.id
                    ? colors.cardHoverAccentColor
                    : colors.cardAccentColor
                }
                borderRadius="1rem"
                borderWidth="2px"
                className={`cursor-pointer p-10 transition-all duration-200
                           ${hoveredService === service.id ? 'scale-105 shadow-[0_0_20px_rgba(55,175,225,0.3)]' : 'shadow-lg'}`}
              >
                <div className="flex flex-col items-center">
                  <div className="mb-5 text-7xl">{service.icon}</div>
                  <h3 className="text-center font-montserrat text-2xl font-semibold text-white">
                    {service.name}
                  </h3>
                  <p className="mt-3 text-center font-inter text-base text-[#64748B]">
                    {service.description}
                  </p>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
