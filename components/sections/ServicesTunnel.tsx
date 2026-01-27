'use client';

import { useRef, useEffect, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Services data
const services = [
  {
    id: 1,
    title: 'N8N Automation',
    description: 'Workflow automation that scales your business operations',
    icon: '⚡',
    color: '#2563EB',
  },
  {
    id: 2,
    title: 'Shopify Development',
    description: 'E-commerce solutions that convert visitors to customers',
    icon: '🛒',
    color: '#31A4DB',
  },
  {
    id: 3,
    title: 'WordPress Sites',
    description: 'Custom CMS experiences built for performance',
    icon: '📝',
    color: '#F97316',
  },
  {
    id: 4,
    title: 'SEO Optimization',
    description: 'Rank higher and grow your organic traffic',
    icon: '📈',
    color: '#F59E0B',
  },
  {
    id: 5,
    title: 'Web Design',
    description: 'Stunning visual experiences that captivate',
    icon: '🎨',
    color: '#37AFE1',
  },
  {
    id: 6,
    title: 'AI Chatbots',
    description: 'Intelligent conversations that engage users',
    icon: '🤖',
    color: '#F58122',
  },
  {
    id: 7,
    title: 'SaaS Development',
    description: 'Scalable cloud solutions for modern businesses',
    icon: '☁️',
    color: '#EC4899',
  },
  {
    id: 8,
    title: 'E-commerce',
    description: 'Online stores that drive sales and growth',
    icon: '💳',
    color: '#06B6D4',
  },
];

// Warp particles
function WarpParticles({ speed }: { speed: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 400;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 12;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = Math.random() * -80;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      const posArray = pointsRef.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < count; i++) {
        posArray[i * 3 + 2] += (40 + speed * 20) * delta;
        if (posArray[i * 3 + 2] > 5) {
          posArray[i * 3 + 2] = -80;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#37AFE1"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Tunnel rings
function TunnelRings() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current)
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.04;
  });

  return (
    <group ref={groupRef}>
      {[...Array(10)].map((_, i) => (
        <mesh key={i} position={[0, 0, -i * 8]}>
          <torusGeometry args={[10, 0.015, 4, 64]} />
          <meshBasicMaterial
            color="#2563EB"
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function BackgroundScene({ speed }: { speed: number }) {
  return (
    <>
      <WarpParticles speed={speed} />
      <TunnelRings />
    </>
  );
}

// Service Card - FIXED sizing and visibility
function ServiceCard({
  service,
  isActive,
  position, // -1 = previous, 0 = current, 1 = next, etc.
  index,
  total,
}: {
  service: (typeof services)[0];
  isActive: boolean;
  position: number;
  index: number;
  total: number;
}) {
  // Cards in view: current (0), next few positive, previous few negative
  const absPos = Math.abs(position);
  if (absPos > 3) return null; // Only show nearby cards

  // Scale: current = 1, others smaller based on distance
  const scale = isActive ? 1 : Math.max(0.6, 1 - absPos * 0.15);

  // Opacity: current = 1, fade others
  const opacity = isActive ? 1 : Math.max(0.3, 1 - absPos * 0.25);

  // Y offset: stack cards vertically with current in center
  const yOffset = position * 120;

  // Z-index: current on top
  const zIndex = 100 - absPos;

  return (
    <div
      className="absolute left-1/2 top-1/2 w-[480px] max-w-[90vw]"
      style={{
        transform: `translate(-50%, -50%) translateY(${yOffset}px) scale(${scale})`,
        opacity,
        zIndex,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      <div
        className="relative overflow-hidden rounded-2xl p-10"
        style={{
          background:
            'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
          border: `1px solid ${isActive ? service.color + '60' : 'rgba(139, 92, 246, 0.25)'}`,
          boxShadow: isActive
            ? `0 0 80px ${service.color}30, 0 25px 50px -12px rgba(0, 0, 0, 0.5)`
            : '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Scanlines */}
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 92, 246, 0.1) 2px, rgba(139, 92, 246, 0.1) 4px)`,
          }}
        />

        {/* Glow */}
        <div
          className="absolute -right-20 -top-20 h-40 w-40 rounded-full blur-3xl"
          style={{ background: service.color, opacity: isActive ? 0.3 : 0.15 }}
        />

        {/* Icon */}
        <div
          className="mb-6 flex items-center justify-center rounded-xl text-4xl"
          style={{
            width: '72px',
            height: '72px',
            background: `linear-gradient(135deg, ${service.color}30 0%, ${service.color}50 100%)`,
            border: `1px solid ${service.color}50`,
            boxShadow: `0 0 30px ${service.color}25`,
          }}
        >
          {service.icon}
        </div>

        {/* Title */}
        <h3
          className="mb-4 text-3xl font-bold"
          style={{
            background: `linear-gradient(135deg, #ffffff 0%, ${service.color} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {service.title}
        </h3>

        {/* Description */}
        <p className="mb-8 text-lg leading-relaxed text-[#94A3B8]">
          {service.description}
        </p>

        {/* Button */}
        <button
          className="flex items-center gap-3 rounded-lg px-6 py-3 text-base font-medium transition-all hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${service.color}25 0%, ${service.color}40 100%)`,
            border: `1px solid ${service.color}50`,
            color: service.color,
          }}
        >
          Learn More
          <span className="text-lg">→</span>
        </button>

        {/* Card number */}
        <div
          className="absolute right-4 top-4 font-mono text-xs opacity-50"
          style={{ color: service.color }}
        >
          0{index + 1}/0{total}
        </div>
      </div>
    </div>
  );
}

// Main component
export default function ServicesTunnel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const scrollAccumulator = useRef(0);
  const lastScrollTime = useRef(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Scroll handling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Check if section is visible
      const isInView =
        rect.top < viewportHeight * 0.4 && rect.bottom > viewportHeight * 0.6;

      if (!isInView) {
        setIsLocked(false);
        return;
      }

      // Lock when scrolling into section
      if (!isLocked && e.deltaY > 0 && rect.top < viewportHeight * 0.3) {
        setIsLocked(true);
        scrollAccumulator.current = 0;
      }

      if (!isLocked) return;

      e.preventDefault();

      // Accumulate scroll
      const now = Date.now();
      if (now - lastScrollTime.current > 300) {
        scrollAccumulator.current = 0;
      }
      lastScrollTime.current = now;

      scrollAccumulator.current += e.deltaY;

      // Change card when accumulated enough scroll
      const threshold = 80;

      if (scrollAccumulator.current > threshold) {
        // Next card
        if (currentIndex < services.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          // At last card, release scroll
          setIsLocked(false);
        }
        scrollAccumulator.current = 0;
      } else if (scrollAccumulator.current < -threshold) {
        // Previous card
        if (currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
        } else {
          // At first card, release scroll
          setIsLocked(false);
        }
        scrollAccumulator.current = 0;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isLocked, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isLocked) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        if (currentIndex < services.length - 1)
          setCurrentIndex((prev) => prev + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
      } else if (e.key === 'Escape') {
        setIsLocked(false);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isLocked, currentIndex]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen overflow-hidden bg-[#0F172A]"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#0F172A]" />

      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.08) 0%, transparent 60%)',
        }}
      />

      {/* Header */}
      <div className="pointer-events-none absolute left-0 right-0 top-12 z-30 text-center">
        <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-[#37AFE1]">
          Our Services
        </span>
        <h2 className="text-3xl font-bold text-white md:text-4xl">
          Explore Our Solutions
        </h2>
      </div>

      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        {isClient && (
          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 5], fov: 75 }}
              gl={{ antialias: true, alpha: true }}
              dpr={[1, 1.5]}
            >
              <BackgroundScene speed={isLocked ? 1 : 0.3} />
            </Canvas>
          </Suspense>
        )}
      </div>

      {/* Cards */}
      <div className="absolute inset-0 z-10">
        {services.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            isActive={index === currentIndex}
            position={index - currentIndex}
            index={index}
            total={services.length}
          />
        ))}
      </div>

      {/* Navigation dots */}
      <div className="absolute right-6 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2">
        {services.map((service, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsLocked(true);
            }}
            className="h-2.5 w-2.5 rounded-full transition-all duration-300"
            style={{
              background: index === currentIndex ? service.color : '#334155',
              boxShadow:
                index === currentIndex ? `0 0 10px ${service.color}` : 'none',
              transform: index === currentIndex ? 'scale(1.3)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* Progress */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3">
        <div className="flex gap-1">
          {services.map((_, i) => (
            <div
              key={i}
              className="h-1 w-8 rounded-full transition-all duration-300"
              style={{
                background: i <= currentIndex ? '#37AFE1' : '#334155',
              }}
            />
          ))}
        </div>
        <p className="text-xs text-[#64748B]">
          {isLocked
            ? `${currentIndex + 1} of ${services.length} • Scroll to navigate`
            : 'Scroll to explore'}
        </p>
      </div>

      {/* Vignette */}
      <div
        className="z-5 pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(15, 23, 42, 0.6) 100%)',
        }}
      />
    </section>
  );
}
