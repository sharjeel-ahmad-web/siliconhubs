'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface CaseStudyProps {
  title?: string;
  client?: string;
  description?: string;
  metrics?: Metric[];
  beforeImage?: string;
  afterImage?: string;
}

interface Metric {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

const defaultMetrics: Metric[] = [
  { label: 'Performance Increase', value: 85, suffix: '%' },
  { label: 'Load Time Reduction', value: 2.3, suffix: 's' },
  { label: 'Conversion Rate', value: 12.5, suffix: '%', prefix: '+' },
  { label: 'User Engagement', value: 340, suffix: '%', prefix: '+' },
];

export default function CaseStudy({
  title = 'Featured Case Study',
  client = 'Premium Client',
  description = 'Transforming digital experiences with cutting-edge technology and innovative design solutions.',
  metrics = defaultMetrics,
  beforeImage = '/placeholder-before.jpg',
  afterImage = '/placeholder-after.jpg',
}: CaseStudyProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Handle slider drag
  const handleSliderMouseDown = () => {
    setIsDraggingSlider(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingSlider || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    };

    const handleMouseUp = () => {
      setIsDraggingSlider(false);
    };

    if (isDraggingSlider) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSlider]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden px-6 py-20"
      style={{ backgroundColor: '#0F172A' }}
    >
      {/* Animated gradient orbs background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '400px',
            height: '400px',
            background:
              'radial-gradient(circle, rgba(139, 92, 246, 0.35) 0%, rgba(99, 102, 241, 0.15) 40%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          animate={{ x: ['10%', '20%', '10%'], y: ['15%', '30%', '15%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '350px',
            height: '350px',
            background:
              'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(59, 130, 246, 0.12) 50%, transparent 70%)',
            filter: 'blur(35px)',
          }}
          animate={{ x: ['65%', '75%', '65%'], y: ['20%', '35%', '20%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '380px',
            height: '380px',
            background:
              'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(139, 92, 246, 0.12) 50%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          animate={{ x: ['45%', '55%', '45%'], y: ['55%', '70%', '55%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-montserrat text-4xl font-bold text-white md:text-5xl">
            {title}
          </h2>
          <p className="mx-auto max-w-3xl font-inter text-xl text-[#64748B]">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* 3D Project Viewer */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[500px] overflow-hidden rounded-2xl border-2 border-[#2563EB] bg-[#1E293B]"
          >
            <Canvas>
              <ProjectMockup3D />
            </Canvas>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div>
              <h3 className="mb-2 font-montserrat text-3xl font-bold text-white">
                {client}
              </h3>
              <p className="font-inter text-[#64748B]">
                Delivering exceptional results through innovative solutions
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-6">
              {metrics.map((metric, index) => (
                <MetricCard
                  key={metric.label}
                  metric={metric}
                  index={index}
                  isInView={isInView}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Before/After Slider */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20"
        >
          <h3 className="mb-8 text-center font-montserrat text-3xl font-bold text-white">
            Before & After
          </h3>

          <div
            ref={sliderRef}
            className="relative h-[400px] cursor-ew-resize overflow-hidden rounded-2xl border-2 border-[#2563EB]"
            onMouseDown={handleSliderMouseDown}
          >
            {/* Before Image */}
            <div className="absolute inset-0 flex items-center justify-center bg-[#1E293B]">
              <span className="font-montserrat text-2xl text-[#64748B]">
                Before
              </span>
            </div>

            {/* After Image with clip */}
            <div
              className="absolute inset-0 flex items-center justify-center bg-[#2563EB] transition-all duration-300"
              style={{
                clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
              }}
            >
              <span className="font-montserrat text-2xl text-white">After</span>
            </div>

            {/* Slider Handle */}
            <div
              className="absolute bottom-0 top-0 w-1 cursor-ew-resize bg-[#37AFE1]"
              style={{
                left: `${sliderPosition}%`,
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.6)',
              }}
            >
              <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#37AFE1] shadow-lg">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                  />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// 3D Project Mockup Component
function ProjectMockup3D() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, gl } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [momentum, setMomentum] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const autoRotateSpeed = useRef((Math.PI * 2) / 2); // 2 seconds per rotation

  // Auto-rotation when not dragging
  useFrame((state, delta) => {
    if (meshRef.current) {
      if (!isDragging) {
        // Apply auto-rotation
        meshRef.current.rotation.y += autoRotateSpeed.current * delta;

        // Apply momentum
        if (Math.abs(momentum.x) > 0.001 || Math.abs(momentum.y) > 0.001) {
          meshRef.current.rotation.x += momentum.y;
          meshRef.current.rotation.y += momentum.x;

          // Damping (0.95)
          setMomentum({
            x: momentum.x * 0.95,
            y: momentum.y * 0.95,
          });
        }
      }

      // Apply zoom
      meshRef.current.scale.setScalar(zoom);
    }
  });

  // Handle mouse drag
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;

      setRotation((prev) => ({
        x: prev.x + deltaY * 0.01,
        y: prev.y + deltaX * 0.01,
      }));

      setMomentum({
        x: deltaX * 0.001,
        y: deltaY * 0.001,
      });

      lastMousePos.current = { x: e.clientX, y: e.clientY };

      if (meshRef.current) {
        meshRef.current.rotation.x = rotation.x + deltaY * 0.01;
        meshRef.current.rotation.y = rotation.y + deltaX * 0.01;
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * -0.001;
      setZoom((prev) => Math.max(0.5, Math.min(2, prev + delta)));
    };

    const canvas = gl.domElement;
    canvas.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [isDragging, rotation, gl]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />

      {/* 3D Mockup - Simple box for now */}
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial color="#2563EB" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Subtle grid */}
      <gridHelper args={[10, 10, '#334155', '#1E293B']} />
    </>
  );
}

// Metric Card with counting animation
function MetricCard({
  metric,
  index,
  isInView,
}: {
  metric: Metric;
  index: number;
  isInView: boolean;
}) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const startValue = 0;
    const endValue = metric.value;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function: power2.out
      const easeProgress = 1 - Math.pow(1 - progress, 2);
      const currentValue = startValue + (endValue - startValue) * easeProgress;

      countRef.current = currentValue;
      setCount(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInView, metric.value]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      className="rounded-xl border-2 border-[#2563EB] bg-[#1E293B] p-6"
    >
      <div className="mb-2 font-montserrat text-4xl font-bold text-[#31A4DB]">
        {metric.prefix}
        {count.toFixed(metric.suffix === 's' ? 1 : 0)}
        {metric.suffix}
      </div>
      <div className="font-inter text-sm text-[#64748B]">{metric.label}</div>
    </motion.div>
  );
}
