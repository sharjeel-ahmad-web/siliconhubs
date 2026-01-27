'use client';

import { useRef, useState, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Services data - 8 cards with branding colors and images from public/Projects folder
const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    image: '/Projects/1.jpeg',
    color: '#2563EB',
    description: 'High-converting Shopify e-commerce stores that drive sales.',
    link: '/services/shopify',
  },
  {
    id: 2,
    title: 'Analytics Dashboard',
    image: '/Projects/2.jpeg',
    color: '#37AFE1',
    description: 'Workflow automation to streamline your business operations.',
    link: '/services/n8n-automations',
  },
  {
    id: 3,
    title: 'Automation System',
    image: '/Projects/3.jpeg',
    color: '#F97316',
    description: 'Intelligent chatbots powered by advanced AI technology.',
    link: '/services/chatbot-development',
  },
  {
    id: 4,
    title: 'Web Design',
    image: '/Projects/4.jpeg',
    color: '#31A4DB',
    description: 'Custom WordPress development with modern design.',
    link: '/services/wordpress',
  },
  {
    id: 5,
    title: 'AI Chatbot',
    image: '/Projects/5.jpeg',
    color: '#31A4DB',
    description: 'Comprehensive SEO strategy for organic growth.',
    link: '/services/seo',
  },
  {
    id: 6,
    title: 'Shopify Store',
    image: '/Projects/6.jpeg',
    color: '#F59E0B',
    description: 'Creative web design with stunning visuals.',
    link: '/services/web-design',
  },
  {
    id: 7,
    title: 'WordPress Site',
    image: '/Projects/7.jpeg',
    color: '#EF4444',
    description: 'Custom SaaS applications for your business needs.',
    link: '/services/saas',
  },
  {
    id: 8,
    title: 'SEO Campaign',
    image: '/Projects/8.jpeg',
    color: '#2563EB',
    description: 'Native and cross-platform mobile app development.',
    link: '/services/shopify',
  },
];

// Grid positions for 8 cards - pyramid pattern: 1-2-2-2-1 (increased gaps)
const gridPositions = [
  { x: 0, y: -360 }, // Row 1: 1 card (top center)
  { x: -340, y: -180 }, // Row 2: 2 cards (wider spread)
  { x: 340, y: -180 }, // Row 2: right
  { x: -420, y: 50 }, // Row 3: 2 cards (even wider)
  { x: 420, y: 50 }, // Row 3: right
  { x: -340, y: 280 }, // Row 4: 2 cards (same as row 2)
  { x: 340, y: 280 }, // Row 4: right
  { x: 0, y: 460 }, // Row 5: 1 card (bottom center)
];

interface OrbitCardProps {
  project: (typeof projects)[0];
  index: number;
  total: number;
  scrollYProgress: any;
  onCardClick: (project: (typeof projects)[0]) => void;
}

function OrbitCard({
  project,
  index,
  total,
  scrollYProgress,
  onCardClick,
}: OrbitCardProps) {
  const cardDuration = 0.08;
  const cardStart = 0.08 + (index / total) * 0.75;
  const cardEnd = cardStart + cardDuration;

  // Use grid positions instead of circular orbit
  const position = gridPositions[index] || { x: 0, y: 0 };
  const finalX = position.x;
  const finalY = position.y;

  const scale = useTransform(scrollYProgress, [cardStart, cardEnd], [0, 1]);
  const opacity = useTransform(
    scrollYProgress,
    [cardStart, cardStart + cardDuration * 0.3, cardEnd],
    [0, 0.5, 1]
  );
  const x = useTransform(scrollYProgress, [cardStart, cardEnd], [0, finalX]);
  const y = useTransform(scrollYProgress, [cardStart, cardEnd], [0, finalY]);
  const rotate = useTransform(scrollYProgress, [cardStart, cardEnd], [-180, 0]);

  return (
    <motion.div
      className="group absolute cursor-pointer"
      style={{
        left: '50%',
        top: '55%',
        x,
        y,
        scale,
        opacity,
        rotate,
        zIndex: index + 1,
      }}
      onClick={() => onCardClick(project)}
    >
      {/* Card: Larger sizes - w-88 (352px) x h-56 (224px) on large screens */}
      <div
        className="relative h-48 w-72 transform-gpu overflow-hidden rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-105 md:h-52 md:w-80 lg:h-56 lg:w-[22rem]"
        style={{
          marginLeft: '-176px',
          marginTop: '-112px',
          boxShadow: `0 20px 60px -15px ${project.color}60, 0 0 40px ${project.color}30`,
        }}
      >
        {/* Project image */}
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
        />

        {/* Color overlay with opacity */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `linear-gradient(135deg, ${project.color}, ${project.color}80)`,
          }}
        />

        {/* Bottom gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Project info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
          <h3 className="text-base font-bold text-white md:text-lg lg:text-xl">
            {project.title}
          </h3>
          <div
            className="mt-2 h-1 w-10 rounded-full transition-all duration-300 group-hover:w-16"
            style={{ backgroundColor: project.color }}
          />
        </div>

        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-30"
          style={{ backgroundColor: project.color }}
        />
      </div>
    </motion.div>
  );
}

// Progress Dot Component - extracted to follow React Hooks rules
function ProgressDot({
  index,
  total,
  scrollYProgress,
}: {
  index: number;
  total: number;
  scrollYProgress: any;
}) {
  const backgroundColor = useTransform(
    scrollYProgress,
    [0.08 + (index / total) * 0.75, 0.08 + ((index + 0.5) / total) * 0.75],
    ['#64748B', '#F97316']
  );

  return (
    <motion.div className="h-2 w-2 rounded-full" style={{ backgroundColor }} />
  );
}

// Popup Modal Component
function ProjectPopup({
  project,
  onClose,
  onViewService,
}: {
  project: (typeof projects)[0];
  onClose: () => void;
  onViewService: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-[#1E293B] shadow-2xl"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: `0 25px 80px -20px ${project.color}50` }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Image */}
        <div className="relative h-64 md:h-80 lg:h-96">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
          />
          {/* Brand color overlay */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              background: `linear-gradient(135deg, ${project.color}, transparent)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div
            className="mb-4 h-1 w-16 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl lg:text-4xl">
            {project.title}
          </h2>
          <p className="mb-6 text-base leading-relaxed text-[#94A3B8] md:text-lg">
            {project.description}
          </p>
          <button
            onClick={onViewService}
            className="rounded-full px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: project.color }}
          >
            View Service →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function RisingVortex() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<
    (typeof projects)[0] | null
  >(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const fallbackProgress = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only use useScroll after mount to prevent position warning
  const { scrollYProgress: actualProgress } = useScroll({
    target: mounted ? containerRef : undefined,
    offset: ['start start', 'end end'],
  });

  const scrollYProgress = mounted ? actualProgress : fallbackProgress;

  const handleViewService = () => {
    if (selectedProject?.link) {
      router.push(selectedProject.link);
    }
  };

  return (
    <>
      <section
        ref={containerRef}
        className="relative bg-[#0F172A]"
        style={{ height: `${200 + projects.length * 60}vh` }}
      >
        <div className="sticky top-0" style={{ height: '140vh' }}>
          <div className="absolute inset-0 bg-[#0F172A]" />

          {/* Gradient orbs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute rounded-full"
              style={{
                left: '50%',
                top: '50%',
                width: '800px',
                height: '800px',
                background:
                  'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
                filter: 'blur(80px)',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>

          {/* Header */}
          <div className="absolute left-0 right-0 top-0 z-30 pb-4 pt-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-[#F97316]">
                Portfolio
              </span>
              <h2 className="mb-2 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                Our Work
              </h2>
              <p className="mx-auto max-w-lg px-4 text-sm text-[#64748B] md:text-base">
                Scroll to explore our projects one by one
              </p>
            </motion.div>
          </div>

          {/* Cards container */}
          <div className="absolute inset-0">
            {/* No orbit rings for grid layout - cleaner look */}

            {/* Center dot */}
            <motion.div
              className="absolute h-5 w-5 rounded-full bg-[#F97316]"
              style={{
                left: '50%',
                top: '55%',
                transform: 'translate(-50%, -50%)',
                opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]),
                scale: useTransform(scrollYProgress, [0, 0.1], [0, 1]),
              }}
            />

            {/* Cards */}
            {projects.map((project, index) => (
              <OrbitCard
                key={project.id}
                project={project}
                index={index}
                total={projects.length}
                scrollYProgress={scrollYProgress}
                onCardClick={setSelectedProject}
              />
            ))}
          </div>

          {/* Progress indicator */}
          <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2">
            <motion.div
              className="flex items-center gap-2"
              style={{
                opacity: useTransform(
                  scrollYProgress,
                  [0, 0.1, 0.9, 1],
                  [0, 1, 1, 0]
                ),
              }}
            >
              {projects.map((_, index) => (
                <ProgressDot
                  key={index}
                  index={index}
                  total={projects.length}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </motion.div>
          </div>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-8 right-8 z-30 text-sm text-[#64748B]"
            style={{
              opacity: useTransform(
                scrollYProgress,
                [0, 0.1, 0.8, 0.9],
                [1, 0.5, 0.5, 0]
              ),
            }}
          >
            <div className="flex items-center gap-2">
              <span>Scroll</span>
              <div className="flex h-8 w-5 justify-center rounded-full border border-[#64748B] pt-1">
                <motion.div
                  className="h-2 w-1 rounded-full bg-[#F97316]"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popup Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectPopup
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onViewService={handleViewService}
          />
        )}
      </AnimatePresence>
    </>
  );
}
