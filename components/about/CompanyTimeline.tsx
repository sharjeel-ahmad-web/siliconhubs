'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteContent } from '@/lib/hooks/useSiteContent';

interface Milestone {
  year: string;
  title: string;
  description: string;
  era: 'foundation' | 'growth' | 'expansion' | 'innovation';
  icon: string;
}

const defaultMilestones: Milestone[] = [
  {
    year: '2018',
    title: 'Company Founded',
    description:
      'Rising Dot Agency was born with a vision to revolutionize digital experiences.',
    era: 'foundation',
    icon: '🚀',
  },
  {
    year: '2019',
    title: 'First Major Client',
    description:
      'Landed our first enterprise client, delivering a complete digital transformation.',
    era: 'foundation',
    icon: '🎯',
  },
  {
    year: '2020',
    title: 'Team Expansion',
    description:
      'Grew from 3 to 15 team members, expanding our service offerings.',
    era: 'growth',
    icon: '👥',
  },
  {
    year: '2021',
    title: 'Award Recognition',
    description:
      'Won "Best Digital Agency" award for innovative web design and development.',
    era: 'growth',
    icon: '🏆',
  },
  {
    year: '2022',
    title: 'International Expansion',
    description:
      'Opened offices in three new countries, serving clients globally.',
    era: 'expansion',
    icon: '🌍',
  },
  {
    year: '2023',
    title: 'AI Integration',
    description: 'Launched AI-powered chatbot and automation services.',
    era: 'innovation',
    icon: '🤖',
  },
  {
    year: '2024',
    title: 'Industry Leader',
    description:
      'Recognized as a top 10 digital agency with 500+ successful projects.',
    era: 'innovation',
    icon: '⭐',
  },
];

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

const eraColors = {
  foundation: '#2563EB',
  growth: '#F97316',
  expansion: '#2563EB',
  innovation: '#F97316',
};

export default function CompanyTimeline() {
  const [activeMilestone, setActiveMilestone] = useState<number | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Fetch CMS content
  const { content } = useSiteContent<{
    milestones?: Milestone[];
  }>('about', 'timeline');

  const milestones = content?.milestones || defaultMilestones;

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
            vy: p.vy + 0.1, // gravity
            life: p.life - 0.015,
          }))
          .filter((p) => p.life > 0)
      );
    };

    const intervalId = setInterval(animate, 16);
    return () => clearInterval(intervalId);
  }, [particles.length]);

  const celebrateMilestone = (x: number, y: number, color: string) => {
    const newParticles: Particle[] = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;

      newParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3, // upward bias
        life: 1.0,
        color,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);
  };

  const handleMilestoneClick = (index: number, e: React.MouseEvent) => {
    setActiveMilestone(activeMilestone === index ? null : index);

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const color = eraColors[milestones[index].era];

    celebrateMilestone(x, y, color);
  };

  return (
    <div ref={timelineRef} className="relative">
      {/* Particle overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute h-2 w-2 rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              opacity: particle.life,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.life * 10}px ${particle.color}`,
            }}
          />
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute bottom-0 left-1/2 top-0 w-1 -translate-x-1/2 transform bg-gradient-to-b from-[#2563EB] via-[#F97316] to-[#2563EB]" />

        {/* Milestones */}
        <div className="space-y-16">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex items-center ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              {/* Content */}
              <div
                className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}
              >
                <motion.div
                  className="cursor-pointer"
                  onClick={(e) => handleMilestoneClick(index, e)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className="inline-block rounded-lg border-2 p-6 transition-all duration-300"
                    style={{
                      borderColor: eraColors[milestone.era],
                      backgroundColor:
                        activeMilestone === index
                          ? `${eraColors[milestone.era]}20`
                          : '#0F172A',
                    }}
                  >
                    <div
                      className="mb-2 flex items-center gap-3"
                      style={{
                        justifyContent:
                          index % 2 === 0 ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <span className="text-4xl">{milestone.icon}</span>
                      <h3
                        className="text-2xl font-bold"
                        style={{ color: eraColors[milestone.era] }}
                      >
                        {milestone.year}
                      </h3>
                    </div>
                    <h4 className="mb-2 text-xl font-semibold text-white">
                      {milestone.title}
                    </h4>
                    <p className="text-[#64748B]">{milestone.description}</p>
                  </div>
                </motion.div>
              </div>

              {/* Center dot */}
              <motion.div
                className="absolute left-1/2 z-10 h-6 w-6 -translate-x-1/2 transform rounded-full border-4 border-white"
                style={{ backgroundColor: eraColors[milestone.era] }}
                whileHover={{ scale: 1.5 }}
                animate={{
                  boxShadow:
                    activeMilestone === index
                      ? `0 0 20px ${eraColors[milestone.era]}`
                      : `0 0 0px ${eraColors[milestone.era]}`,
                }}
              />

              {/* Empty space on other side */}
              <div className="w-5/12" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Era legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 flex flex-wrap justify-center gap-6"
      >
        {Object.entries(eraColors).map(([era, color]) => (
          <div key={era} className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm capitalize text-[#64748B]">{era}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
