'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface TechItem {
  id: number;
  icon: string;
  title: string;
  description: string;
  gradient: string;
  particles: number;
}

const techStack: TechItem[] = [
  {
    id: 1,
    icon: '⚛️',
    title: 'React & Next.js',
    description:
      'Modern JavaScript frameworks for blazing-fast, SEO-friendly web applications',
    gradient: 'from-[#37AFE1] to-[#31A4DB]',
    particles: 50,
  },
  {
    id: 2,
    icon: '🎨',
    title: 'Tailwind CSS',
    description:
      'Utility-first CSS framework for rapidly building custom user interfaces',
    gradient: 'from-[#F58122] to-[#FF9E5C]',
    particles: 45,
  },
  {
    id: 3,
    icon: '🗄️',
    title: 'MongoDB',
    description:
      'Flexible NoSQL database for scalable, high-performance data storage',
    gradient: 'from-[#37AFE1] to-[#F58122]',
    particles: 40,
  },
  {
    id: 4,
    icon: '🔗',
    title: 'API Integration',
    description: 'Seamless connections between your tools and platforms',
    gradient: 'from-[#31A4DB] to-[#37AFE1]',
    particles: 55,
  },
  {
    id: 5,
    icon: '⚡',
    title: 'Edge Computing',
    description:
      'Lightning-fast performance with globally distributed infrastructure',
    gradient: 'from-[#F58122] to-[#37AFE1]',
    particles: 60,
  },
  {
    id: 6,
    icon: '🔒',
    title: 'Enterprise Security',
    description: 'Bank-level encryption and security protocols for your data',
    gradient: 'from-[#37AFE1] to-[#F58122]',
    particles: 50,
  },
];

interface TiltCardProps {
  tech: TechItem;
  index: number;
}

function TiltCard({ tech, index }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    ['7.5deg', '-7.5deg']
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    ['-7.5deg', '7.5deg']
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="group relative"
    >
      {/* Animated Glow */}
      <motion.div
        className={`absolute -inset-1 bg-gradient-to-r ${tech.gradient} rounded-2xl opacity-0 blur-xl transition duration-500 group-hover:opacity-75`}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />

      {/* Card */}
      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-8"
        style={{ transform: 'translateZ(50px)' }}
      >
        {/* Floating Particles Background */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          {[...Array(tech.particles)].map((_, i) => {
            // Use deterministic positioning based on index
            const xPos = (i * 37) % 100;
            const yPos = (i * 73) % 100;
            const duration = 2 + (i % 3) * 0.5;
            const delay = (i % 10) * 0.2;

            return (
              <motion.div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-white"
                initial={{
                  x: `${xPos}%`,
                  y: `${yPos}%`,
                }}
                animate={{
                  y: ['-100%', '200%'],
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  delay,
                }}
              />
            );
          })}
        </div>

        {/* Icon */}
        <motion.div
          className="relative z-10 mb-4 text-6xl"
          whileHover={{ scale: 1.2, rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          {tech.icon}
        </motion.div>

        {/* Title */}
        <h3
          className="relative z-10 mb-3 bg-clip-text text-2xl font-bold text-transparent"
          style={{
            backgroundImage: `linear-gradient(135deg, #37AFE1, #F58122)`,
          }}
        >
          {tech.title}
        </h3>

        {/* Description */}
        <p className="relative z-10 leading-relaxed text-gray-400">
          {tech.description}
        </p>

        {/* Shine Effect on Hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </motion.div>
  );
}

export default function TechStackShowcase() {
  return (
    <section className="bg-black py-20">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Animated Badge - Matches testimonials/case studies pattern */}
        <motion.div
          className="mb-6 flex justify-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-3 rounded-full border border-white/[0.15] bg-white/[0.08] px-5 py-2 backdrop-blur-sm"
            whileHover={{
              scale: 1.05,
              borderColor: 'rgba(255, 255, 255, 0.3)',
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="h-4 w-4 text-[#37AFE1]" />
            </motion.div>
            <span className="text-sm font-medium text-white/80">
              Technology
            </span>
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          </motion.div>
        </motion.div>

        {/* Heading with Gradient Animation */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            <span className="text-white">Powered By </span>
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #37AFE1, #F58122, #37AFE1, #F58122)',
                backgroundSize: '300% 100%',
                animation: 'gradient-shift 4s ease-in-out infinite',
              }}
            >
              Cutting-Edge Tech
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-400">
            We leverage the latest technologies to build scalable, secure, and
            high-performance solutions
          </p>
        </motion.div>

        {/* 3D Tilt Cards Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {techStack.map((tech, index) => (
            <TiltCard key={tech.id} tech={tech} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
