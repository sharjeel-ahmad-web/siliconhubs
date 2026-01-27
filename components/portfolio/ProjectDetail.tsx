'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticleWrapper } from '@/components/ui/particle-button';

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
  images: string[];
  hotspots: {
    x: number;
    y: number;
    title: string;
    description: string;
  }[];
}

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectDetail({
  project,
  onClose,
}: ProjectDetailProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedHotspot, setSelectedHotspot] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Parallax intensity for each layer (0.5 as specified)
  const parallaxIntensity = 0.5;
  const layers = [
    { depth: 0.1, opacity: 0.3 },
    { depth: 0.25, opacity: 0.5 },
    { depth: 0.4, opacity: 0.7 },
    { depth: 0.55, opacity: 0.85 },
    { depth: 0.7, opacity: 1.0 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        ref={containerRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-[#0F172A] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <ParticleWrapper className="absolute right-4 top-4 z-50">
          <button
            onClick={onClose}
            className="rounded-full bg-[#1E293B] p-2 text-2xl text-white transition-colors hover:bg-[#37AFE1]"
          >
            ✕
          </button>
        </ParticleWrapper>

        {/* Scrollable content */}
        <div className="custom-scrollbar max-h-[90vh] overflow-y-auto">
          {/* Hero section with parallax layers */}
          <div className="relative h-[500px] overflow-hidden">
            {/* Parallax layers */}
            {layers.map((layer, index) => (
              <motion.div
                key={index}
                className="absolute inset-0"
                style={{
                  transform: `translate(${mousePosition.x * layer.depth * parallaxIntensity * 100}px, ${
                    mousePosition.y * layer.depth * parallaxIntensity * 100
                  }px)`,
                  opacity: layer.opacity,
                  zIndex: index,
                }}
              >
                <div
                  className="h-full w-full bg-gradient-to-br"
                  style={{
                    backgroundImage: `linear-gradient(${45 + index * 20}deg, 
                      rgba(55, 175, 225, ${0.1 + index * 0.05}) 0%, 
                      rgba(245, 129, 34, ${0.1 + index * 0.05}) 100%)`,
                  }}
                />
              </motion.div>
            ))}

            {/* Main image with hotspots */}
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="relative h-4/5 w-4/5">
                {/* Main project image */}
                <img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  className="h-full w-full rounded-lg object-cover"
                />

                {/* Interactive hotspots */}
                {project.hotspots.map((hotspot, index) => (
                  <motion.div
                    key={index}
                    className="absolute cursor-pointer"
                    style={{
                      left: `${hotspot.x}%`,
                      top: `${hotspot.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1, type: 'spring' }}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => setSelectedHotspot(index)}
                  >
                    <motion.div
                      className="h-8 w-8 rounded-full border-2 border-white bg-[#F58122] shadow-lg"
                      animate={{
                        boxShadow: [
                          '0 0 0 0 rgba(245, 129, 34, 0.7)',
                          '0 0 0 20px rgba(245, 129, 34, 0)',
                          '0 0 0 0 rgba(245, 129, 34, 0)',
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeOut',
                      }}
                    />

                    {/* Hotspot tooltip */}
                    <AnimatePresence>
                      {selectedHotspot === index && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-1/2 top-full mt-2 w-64 -translate-x-1/2 rounded-lg border border-[#37AFE1]/30 bg-[#1E293B] p-4 shadow-xl"
                        >
                          <h4 className="mb-2 font-bold text-white">
                            {hotspot.title}
                          </h4>
                          <p className="text-sm text-[#64748B]">
                            {hotspot.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Project details */}
          <div className="p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="mb-2 text-4xl font-bold text-white">
                {project.title}
              </h2>
              <p className="mb-6 text-xl text-[#64748B]">{project.client}</p>

              {/* Tags */}
              <div className="mb-8 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#37AFE1]/30 bg-[#37AFE1]/20 px-4 py-2 text-[#37AFE1]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="mb-8 text-lg leading-relaxed text-[#64748B]">
                {project.description}
              </p>

              {/* Metrics grid */}
              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                {project.metrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="rounded-lg border border-[#64748B]/20 bg-[#1E293B] p-6"
                  >
                    <p className="mb-2 text-sm text-[#64748B]">
                      {metric.label}
                    </p>
                    <p className="text-3xl font-bold text-[#F58122]">
                      {metric.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Additional images - 2 on desktop, 1 on mobile */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {project.images.slice(1, 3).map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`aspect-video overflow-hidden rounded-lg ${index === 1 ? 'hidden md:block' : ''}`}
                  >
                    <img
                      src={image}
                      alt={`${project.title} - Image ${index + 2}`}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #37afe1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #f58122;
        }
      `}</style>
    </motion.div>
  );
}
