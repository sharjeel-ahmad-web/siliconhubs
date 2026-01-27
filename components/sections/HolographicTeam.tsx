'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useVelocity } from 'framer-motion';
import { SectionHeading } from '@/components/ui/section-heading';
import { useTeamMembers, useSiteContent } from '@/lib/hooks/useSiteContent';
import {
  getCloudinaryUrl,
  isExternalUrl,
} from '@/components/ui/cloudinary-image';

const defaultTeamMembers = [
  { id: 1, name: 'Alex Chen', role: 'Founder & CEO', image: '/team/alex.png' },
  {
    id: 2,
    name: 'Sarah Mitchell',
    role: 'Creative Director',
    image: '/team/sarah.png',
  },
  {
    id: 3,
    name: 'Marcus Johnson',
    role: 'Lead Developer',
    image: '/team/marcus.png',
  },
  {
    id: 4,
    name: 'Emily Rodriguez',
    role: 'UX Designer',
    image: '/team/emily.png',
  },
  {
    id: 5,
    name: 'David Kim',
    role: 'Backend Engineer',
    image: '/team/david.png',
  },
  {
    id: 6,
    name: 'Lisa Thompson',
    role: 'Project Manager',
    image: '/team/lisa.png',
  },
];

// Responsive breakpoints
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { isMobile, isTablet };
};

// Optimized text scramble effect with performance improvements
function useTextScramble(text: string, isActive: boolean) {
  const [displayText, setDisplayText] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) {
      setDisplayText(text);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    let iteration = 0;
    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      iteration += 1 / 3;

      if (iteration >= text.length) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setDisplayText(text);
      }
    }, 30);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [text, isActive]);

  return displayText;
}

// Smooth scroll hook for carousel
function useSmoothCarousel(totalItems: number) {
  const x = useMotionValue(0);
  const xSmooth = useSpring(x, { stiffness: 300, damping: 30 });
  const velocity = useVelocity(xSmooth);

  return { x, xSmooth, velocity };
}

interface TeamCardProps {
  member: (typeof defaultTeamMembers)[0];
  index: number;
  activeIndex: number;
  totalCards: number;
  scrollVelocity: number;
  isMobile: boolean;
  isTablet: boolean;
}

function TeamCard({
  member,
  index,
  activeIndex,
  totalCards,
  scrollVelocity,
  isMobile,
  isTablet,
}: TeamCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Calculate position relative to active card
  const relativePosition = index - activeIndex;
  const isActive = relativePosition === 0;
  const isVisible = Math.abs(relativePosition) <= (isMobile ? 1 : 2);

  // Scrambled text effect (disabled on mobile for performance)
  const scrambledName = useTextScramble(
    member.name,
    isActive && !isHovered && !isMobile
  );
  const scrambledRole = useTextScramble(
    member.role,
    isActive && !isHovered && !isMobile
  );

  // Responsive sizing (30% smaller)
  const cardWidth = isMobile ? 196 : isTablet ? 210 : 224;
  const cardHeight = isMobile ? 294 : isTablet ? 315 : 336;
  const spacing = isMobile ? 210 : isTablet ? 245 : 280;

  // Calculate scale and z-position based on distance from center
  const scale = isActive ? 1.0 : isMobile ? 0.85 : 0.8;
  const zPosition = isActive ? 0 : -2;
  const opacity = isActive ? 1 : isMobile ? 0.7 : 0.6;

  // Velocity skew effect (reduced on mobile)
  const skewX = isMobile ? scrollVelocity * 0.2 : scrollVelocity * 0.5;

  // Mouse parallax tilt (disabled on mobile)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || isMobile) return;
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      setMousePosition({ x: mouseX, y: mouseY });
    },
    [isMobile]
  );

  const handleMouseLeave = useCallback(() => {
    setMousePosition({ x: 0, y: 0 });
  }, []);

  // Calculate rotation based on mouse position (disabled on mobile)
  const rotateY = isMobile ? 0 : (mousePosition.x / 200) * 15;
  const rotateX = isMobile ? 0 : -(mousePosition.y / 200) * 15;

  if (!isVisible) return null;

  return (
    <motion.div
      ref={cardRef}
      className="absolute left-1/2 top-1/2 select-none"
      style={{
        x: `${relativePosition * spacing}px`,
        scale,
        z: zPosition,
        opacity,
        transformStyle: 'preserve-3d',
      }}
      animate={{
        x: relativePosition * spacing,
        scale,
        z: zPosition,
        opacity,
        skewX: isActive ? skewX : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: isMobile ? 200 : 300,
        damping: isMobile ? 25 : 30,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        handleMouseLeave();
      }}
    >
      <motion.div
        className="relative"
        style={{
          width: `${cardWidth}px`,
          height: `${cardHeight}px`,
          marginLeft: `-${cardWidth / 2}px`,
          marginTop: `-${cardHeight / 2}px`,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateY: isHovered ? rotateY : 0,
          rotateX: isHovered ? rotateX : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: isMobile ? 300 : 400,
          damping: 25,
        }}
      >
        {/* Glass card container */}
        <div
          className="relative h-full w-full overflow-hidden rounded-3xl"
          style={{
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(20px)',
            border: `2px solid ${isHovered ? '#F58122' : 'rgba(55, 175, 225, 0.5)'}`,
            boxShadow: isHovered
              ? '0 0 60px rgba(245, 129, 34, 0.6), inset 0 0 40px rgba(245, 129, 34, 0.1)'
              : '0 0 30px rgba(55, 175, 225, 0.3), inset 0 0 20px rgba(55, 175, 225, 0.05)',
            transition: 'all 0.4s ease',
          }}
        >
          {/* Holographic image */}
          <div className="relative h-full w-full">
            <Image
              src={
                isExternalUrl(member.image)
                  ? member.image
                  : getCloudinaryUrl(member.image, { width: 400, height: 600 })
              }
              alt={member.name}
              fill
              className="pointer-events-none select-none object-cover"
              draggable={false}
              style={{
                filter: isHovered
                  ? 'none'
                  : 'grayscale(100%) brightness(0.7) contrast(1.2)',
                mixBlendMode: isHovered ? 'normal' : 'screen',
                transition: 'all 0.5s ease',
              }}
              unoptimized
            />

            {/* Hologram effects (only when not hovered) */}
            {!isHovered && (
              <>
                {/* Scanlines */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `repeating-linear-gradient(
                      0deg,
                      transparent,
                      transparent 2px,
                      rgba(55, 175, 225, 0.1) 2px,
                      rgba(55, 175, 225, 0.1) 4px
                    )`,
                    animation: 'scanlines 8s linear infinite',
                  }}
                />

                {/* RGB shift */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `
                      linear-gradient(90deg, rgba(255,0,0,0.1) 0%, transparent 5%, transparent 95%, rgba(0,255,255,0.1) 100%),
                      linear-gradient(0deg, rgba(0,255,0,0.1) 0%, transparent 5%, transparent 95%, rgba(255,0,255,0.1) 100%)
                    `,
                  }}
                />

                {/* Cyan/Blue tint overlay */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: 'rgba(55, 175, 225, 0.2)',
                    mixBlendMode: 'color',
                  }}
                />

                {/* Glitch effect */}
                <motion.div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: 'rgba(245, 129, 34, 0.3)',
                    clipPath: 'inset(40% 0 50% 0)',
                  }}
                  animate={{
                    clipPath: [
                      'inset(40% 0 50% 0)',
                      'inset(20% 0 70% 0)',
                      'inset(60% 0 30% 0)',
                      'inset(40% 0 50% 0)',
                    ],
                    x: [0, -5, 5, 0],
                  }}
                  transition={{
                    duration: 0.2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />
              </>
            )}

            {/* Gradient overlay */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, transparent 50%)',
              }}
            />
          </div>

          {/* Electric cyan glow edge */}
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              boxShadow: `inset 0 0 20px ${isHovered ? 'rgba(245, 129, 34, 0.8)' : 'rgba(55, 175, 225, 0.4)'}`,
              transition: 'box-shadow 0.4s ease',
            }}
          />
        </div>

        {/* Text floating outside card */}
        <div
          className={`absolute left-0 right-0 text-center ${isMobile ? '-bottom-16' : '-bottom-20'}`}
        >
          <motion.h3
            className={`mb-2 font-bold text-white ${isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-2xl'}`}
            style={{
              textShadow: '0 0 20px rgba(55, 175, 225, 0.8)',
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
            }}
          >
            {member.name}
          </motion.h3>
          <motion.p
            className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}
            style={{
              background: 'linear-gradient(90deg, #37AFE1, #F58122)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'monospace',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {member.role}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HolographicTeam() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const lastPositionRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const velocityDecayRef = useRef<NodeJS.Timeout | null>(null);

  const { isMobile, isTablet } = useResponsive();

  // Fetch CMS content
  const { content: sectionContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
  }>('home', 'team');
  const { members: cmsMembers } = useTeamMembers();

  // Use CMS data or fallback to defaults
  const eyebrow = sectionContent?.eyebrow || 'Zero Gravity Talent';
  const title = sectionContent?.title || 'Agency &';
  const titleHighlight = sectionContent?.titleHighlight || 'Team';
  const teamMembers =
    cmsMembers.length > 0
      ? cmsMembers.map((m, i) => ({
          id: i + 1,
          name: m.name,
          role: m.role,
          image: m.image,
        }))
      : defaultTeamMembers;

  const { x, xSmooth, velocity } = useSmoothCarousel(teamMembers.length);

  // Touch/drag threshold based on device
  const dragThreshold = isMobile ? 50 : 100;

  // Handle drag/scroll with touch support
  const handleStart = useCallback((clientX: number) => {
    setIsDragging(true);
    setDragStart(clientX);
    lastPositionRef.current = clientX;
    lastTimeRef.current = Date.now();

    if (velocityDecayRef.current) {
      clearInterval(velocityDecayRef.current);
      velocityDecayRef.current = null;
    }
  }, []);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging) return;

      const currentTime = Date.now();
      const deltaTime = currentTime - lastTimeRef.current;
      const deltaX = clientX - lastPositionRef.current;

      if (deltaTime > 0) {
        const velocity = deltaX / deltaTime;
        setScrollVelocity(velocity * (isMobile ? 5 : 10));
      }

      lastPositionRef.current = clientX;
      lastTimeRef.current = currentTime;

      const delta = clientX - dragStart;
      if (Math.abs(delta) > dragThreshold) {
        if (delta > 0 && activeIndex > 0) {
          setActiveIndex(activeIndex - 1);
          setDragStart(clientX);
        } else if (delta < 0 && activeIndex < teamMembers.length - 1) {
          setActiveIndex(activeIndex + 1);
          setDragStart(clientX);
        }
      }
    },
    [isDragging, dragStart, activeIndex, dragThreshold, isMobile]
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    // Smooth velocity decay
    velocityDecayRef.current = setInterval(() => {
      setScrollVelocity((v) => {
        const newV = v * 0.92;
        if (Math.abs(newV) < 0.1) {
          if (velocityDecayRef.current) {
            clearInterval(velocityDecayRef.current);
            velocityDecayRef.current = null;
          }
          return 0;
        }
        return newV;
      });
    }, 16);
  }, []);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const handleMouseUp = () => handleEnd();

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) =>
    handleStart(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  };
  const handleTouchEnd = () => handleEnd();

  // Keyboard navigation and cleanup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
      } else if (
        e.key === 'ArrowRight' &&
        activeIndex < teamMembers.length - 1
      ) {
        setActiveIndex(activeIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (velocityDecayRef.current) {
        clearInterval(velocityDecayRef.current);
      }
    };
  }, [activeIndex]);

  // Auto-advance on mobile (optional)
  useEffect(() => {
    if (!isMobile) return;

    const autoAdvance = setInterval(() => {
      setActiveIndex((current) =>
        current >= teamMembers.length - 1 ? 0 : current + 1
      );
    }, 4000);

    return () => clearInterval(autoAdvance);
  }, [isMobile]);

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-black py-16"
    >
      {/* Background */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div
          className={`absolute inset-0 ${isMobile ? 'opacity-10' : 'opacity-20'}`}
          style={{
            backgroundImage: `
              linear-gradient(rgba(55, 175, 225, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(55, 175, 225, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: isMobile ? '30px 30px' : '50px 50px',
          }}
        />

        {/* Gradient orbs */}
        <motion.div
          className={`absolute rounded-full ${isMobile ? 'h-[300px] w-[300px]' : isTablet ? 'h-[400px] w-[400px]' : 'h-[600px] w-[600px]'}`}
          style={{
            top: '20%',
            left: isMobile ? '-20%' : '10%',
            background:
              'radial-gradient(circle, rgba(55, 175, 225, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className={`absolute rounded-full ${isMobile ? 'h-[250px] w-[250px]' : isTablet ? 'h-[350px] w-[350px]' : 'h-[500px] w-[500px]'}`}
          style={{
            bottom: '20%',
            right: isMobile ? '-20%' : '10%',
            background:
              'radial-gradient(circle, rgba(245, 129, 34, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Header */}
      <div className={`relative z-10 ${isMobile ? '-mb-8 px-4' : '-mb-12'}`}>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          titleHighlight={titleHighlight}
        />
      </div>

      {/* 3D Carousel */}
      <div
        ref={containerRef}
        className={`relative select-none ${isMobile ? 'h-[500px]' : isTablet ? 'h-[550px]' : 'h-[600px]'} ${isMobile ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
        style={{ perspective: isMobile ? '1000px' : '2000px' }}
        onMouseDown={!isMobile ? handleMouseDown : undefined}
        onMouseMove={!isMobile ? handleMouseMove : undefined}
        onMouseUp={!isMobile ? handleMouseUp : undefined}
        onMouseLeave={!isMobile ? handleMouseUp : undefined}
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onTouchMove={isMobile ? handleTouchMove : undefined}
        onTouchEnd={isMobile ? handleTouchEnd : undefined}
      >
        {teamMembers.map((member, index) => (
          <TeamCard
            key={member.id}
            member={member}
            index={index}
            activeIndex={activeIndex}
            totalCards={teamMembers.length}
            scrollVelocity={scrollVelocity}
            isMobile={isMobile}
            isTablet={isTablet}
          />
        ))}
      </div>

      {/* Navigation dots */}
      <div
        className={`relative z-10 flex justify-center gap-3 ${isMobile ? 'mt-4' : 'mt-6'}`}
      >
        {teamMembers.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`rounded-full transition-all duration-300 ${isMobile ? 'h-2 w-2' : 'h-3 w-3'}`}
            style={{
              background:
                index === activeIndex ? '#F58122' : 'rgba(55, 175, 225, 0.3)',
              boxShadow:
                index === activeIndex
                  ? '0 0 20px rgba(245, 129, 34, 0.8)'
                  : 'none',
            }}
            animate={{
              scale: index === activeIndex ? (isMobile ? 1.3 : 1.5) : 1,
            }}
            whileHover={{
              scale:
                index === activeIndex
                  ? isMobile
                    ? 1.3
                    : 1.5
                  : isMobile
                    ? 1.1
                    : 1.2,
            }}
            whileTap={{ scale: 0.9 }}
            aria-label={`View ${teamMembers[index].name}`}
          />
        ))}
      </div>

      {/* Instructions */}
      <div
        className={`relative z-10 text-center ${isMobile ? 'mt-8' : 'mt-12'}`}
      >
        <p
          className={`font-mono text-[#64748B] ${isMobile ? 'px-4 text-xs' : 'text-sm'}`}
        >
          {isMobile
            ? 'Swipe to navigate • Auto-advance enabled'
            : 'Drag to navigate • Arrow keys to move • Hover to stabilize'}
        </p>
      </div>

      <style jsx>{`
        @keyframes scanlines {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(4px);
          }
        }
      `}</style>
    </section>
  );
}
