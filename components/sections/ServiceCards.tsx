'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { GlowCard } from '@/components/ui/glow-card';
import { SectionHeading } from '@/components/ui/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';
import { useAnalytics } from '@/components/analytics/AnalyticsTracker';

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

const defaultServiceCards: ServiceCard[] = [
  {
    id: 'n8n-automations',
    title: 'N8N Automations',
    description:
      'Streamline your workflows with powerful automation solutions that save time and reduce errors.',
    icon: '⚡',
    features: ['Workflow Design', 'API Integration', 'Process Automation'],
  },
  {
    id: 'chatbot-development',
    title: 'Chatbot Development',
    description:
      'AI-powered conversational interfaces that engage users and provide instant support 24/7.',
    icon: '🤖',
    features: ['Natural Language', 'AI Training', 'Multi-Platform'],
  },
  {
    id: 'web-design',
    title: 'Web Design',
    description:
      'Beautiful, responsive websites that captivate visitors and drive conversions.',
    icon: '🎨',
    features: ['UI/UX Design', 'Responsive', 'Brand Identity'],
  },
  {
    id: 'wordpress',
    title: 'WordPress',
    description:
      'Custom WordPress solutions that are scalable, secure, and easy to manage.',
    icon: '📝',
    features: ['Custom Themes', 'Plugin Development', 'Performance'],
  },
  {
    id: 'shopify',
    title: 'Shopify',
    description:
      'E-commerce solutions that maximize conversions and provide seamless shopping experiences.',
    icon: '🛒',
    features: ['Store Setup', 'Custom Apps', 'Conversion Optimization'],
  },
  {
    id: 'seo',
    title: 'SEO',
    description:
      'Data-driven SEO strategies that improve rankings and drive organic traffic growth.',
    icon: '📈',
    features: ['Keyword Research', 'Technical SEO', 'Content Strategy'],
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

export default function ServiceCards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const hasTrackedMagnetic = useRef(false);
  const { trackEvent } = useAnalytics();

  // Track magnetic cursor interaction (cards have data-magnetic attribute)
  const trackMagneticInteraction = useCallback(() => {
    if (!hasTrackedMagnetic.current) {
      hasTrackedMagnetic.current = true;
      trackEvent('magnetic_cursor', { section: 'serviceCards' });
    }
  }, [trackEvent]);

  // Fetch CMS content
  const { content: sectionContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    cards?: ServiceCard[];
    colors?: {
      cardBackground?: string;
      cardAccentColor?: string;
      cardHoverAccentColor?: string;
      particleColor?: string;
      featureDotColor?: string;
      linkColor?: string;
      linkHoverColor?: string;
      borderColor?: string;
    };
  }>('home', 'serviceCards');

  // Use CMS data or fallback to defaults
  const eyebrow = sectionContent?.eyebrow || 'Solutions';
  const title = sectionContent?.title || 'Our';
  const titleHighlight = sectionContent?.titleHighlight || 'Services';
  const subtitle =
    sectionContent?.subtitle ||
    'Comprehensive digital solutions tailored to your needs';
  const serviceCards = sectionContent?.cards || defaultServiceCards;

  // Color configuration from CMS
  const colors = {
    cardBackground: sectionContent?.colors?.cardBackground || '#1E293B',
    cardAccentColor: sectionContent?.colors?.cardAccentColor || '#37AFE1',
    cardHoverAccentColor:
      sectionContent?.colors?.cardHoverAccentColor || '#F58122',
    particleColor: sectionContent?.colors?.particleColor || '#37AFE1',
    featureDotColor: sectionContent?.colors?.featureDotColor || '#37AFE1',
    linkColor: sectionContent?.colors?.linkColor || '#37AFE1',
    linkHoverColor: sectionContent?.colors?.linkHoverColor || '#F58122',
    borderColor: sectionContent?.colors?.borderColor || '#334155',
  };

  // Emit particles from card edges
  const emitParticles = (cardId: string) => {
    const cardElement = cardRefs.current.get(cardId);
    if (!cardElement) return;

    const rect = cardElement.getBoundingClientRect();
    const newParticles: Particle[] = [];

    // Emit 8 particles from card edges
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const speed = 100 + Math.random() * 100; // 100-200 px/s

      // Position particles at card edges
      const edgeX =
        rect.left + rect.width / 2 + Math.cos(angle) * (rect.width / 2);
      const edgeY =
        rect.top + rect.height / 2 + Math.sin(angle) * (rect.height / 2);

      newParticles.push({
        id: particleIdRef.current++,
        x: edgeX,
        y: edgeY,
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
      const deltaTime = (currentTime - lastTime) / 1000;
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

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Convert hex to rgb for particles
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
  }, [particles]);

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
      className="relative min-h-screen overflow-hidden bg-transparent px-6 py-20"
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-10"
        style={{ mixBlendMode: 'screen' }}
      />

      <div className="relative z-20 mx-auto max-w-7xl">
        {/* Section heading */}
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          titleHighlight={titleHighlight}
          subtitle={subtitle}
        />

        {/* Service cards grid - responsive: 3 cols desktop, 2 tablet, 1 mobile */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {serviceCards.map((card, index) => (
            <ServiceCardItem
              key={card.id}
              card={card}
              index={index}
              isInView={isInView}
              isHovered={hoveredCard === card.id}
              onHover={(id) => {
                setHoveredCard(id);
                emitParticles(id);
                trackMagneticInteraction();
              }}
              onLeave={() => setHoveredCard(null)}
              cardRef={(el) => {
                if (el) cardRefs.current.set(card.id, el);
              }}
              colors={colors}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface ServiceCardItemProps {
  card: ServiceCard;
  index: number;
  isInView: boolean;
  isHovered: boolean;
  onHover: (id: string) => void;
  onLeave: () => void;
  cardRef: (el: HTMLDivElement | null) => void;
  colors: {
    cardBackground: string;
    cardAccentColor: string;
    cardHoverAccentColor: string;
    featureDotColor: string;
    linkColor: string;
    linkHoverColor: string;
    borderColor: string;
  };
}

function ServiceCardItem({
  card,
  index,
  isInView,
  isHovered,
  onHover,
  onLeave,
  cardRef,
  colors,
}: ServiceCardItemProps) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const cardElementRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardElementRef.current) return;

    const rect = cardElementRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation based on mouse position (±5 degrees)
    const rotateY = ((x - centerX) / centerX) * 5;
    const rotateX = -((y - centerY) / centerY) * 5;

    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    onLeave();
  };

  const setRefs = (el: HTMLDivElement | null) => {
    if (cardElementRef.current !== el) {
      (
        cardElementRef as React.MutableRefObject<HTMLDivElement | null>
      ).current = el;
    }
    cardRef(el);
  };

  return (
    <motion.div
      ref={setRefs}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => onHover(card.id)}
      onMouseLeave={handleMouseLeave}
      data-magnetic
      data-magnetic-strength="80"
      className="group relative cursor-pointer"
      style={{
        perspective: '1000px',
      }}
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.05 : 1,
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
        }}
        transition={{
          scale: {
            duration: 0.2,
            ease: [0.34, 1.56, 0.64, 1], // back.out(1.7)
          },
          rotateX: {
            duration: 0.2,
            ease: [0.16, 1, 0.3, 1],
          },
          rotateY: {
            duration: 0.2,
            ease: [0.16, 1, 0.3, 1],
          },
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        <GlowCard
          backgroundColor={colors.cardBackground}
          accentColor={
            isHovered ? colors.cardHoverAccentColor : colors.cardAccentColor
          }
          borderRadius="1rem"
          borderWidth="2px"
          className="h-full p-8"
        >
          {/* Icon */}
          <div className="mb-6 text-6xl">{card.icon}</div>

          {/* Title */}
          <h3 className="mb-4 font-montserrat text-2xl font-bold text-white">
            {card.title}
          </h3>

          {/* Description */}
          <p className="mb-6 font-inter leading-relaxed text-[#64748B]">
            {card.description}
          </p>

          {/* Features */}
          <ul className="space-y-2">
            {card.features.map((feature, idx) => (
              <li
                key={idx}
                className="flex items-center font-inter text-sm text-[#64748B]"
              >
                <span
                  className="mr-2 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: colors.featureDotColor }}
                />
                {feature}
              </li>
            ))}
          </ul>

          {/* Learn More Link */}
          <div
            className="mt-6 border-t pt-6"
            style={{ borderColor: colors.borderColor }}
          >
            <span
              className="cursor-pointer text-sm font-semibold transition-colors duration-200"
              style={{
                color: isHovered ? colors.linkHoverColor : colors.linkColor,
              }}
            >
              Learn More →
            </span>
          </div>
        </GlowCard>
      </motion.div>
    </motion.div>
  );
}
