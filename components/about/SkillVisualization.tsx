'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSiteContent } from '@/lib/hooks/useSiteContent';

interface Skill {
  name: string;
  level: number; // 0-100
  color: string;
}

const defaultSkills: Skill[] = [
  { name: 'Web Design', level: 95, color: '#0a192f' },
  { name: 'React/Next.js', level: 90, color: '#fc4c00' },
  { name: 'SEO', level: 88, color: '#0a192f' },
  { name: 'N8N Automation', level: 92, color: '#fc4c00' },
  { name: 'AI/Chatbots', level: 85, color: '#0a192f' },
  { name: 'WordPress', level: 87, color: '#fc4c00' },
  { name: 'Shopify', level: 89, color: '#0a192f' },
  { name: 'Animation', level: 93, color: '#fc4c00' },
];

export default function SkillVisualization() {
  // Fetch CMS content
  const { content } = useSiteContent<{
    skills?: Skill[];
  }>('about', 'skills');

  const skills = content?.skills || defaultSkills;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
      {skills.map((skill, index) => (
        <SkillChart key={skill.name} skill={skill} index={index} />
      ))}
    </div>
  );
}

interface SkillChartProps {
  skill: Skill;
  index: number;
}

function SkillChart({ skill, index }: SkillChartProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = skill.level / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setProgress(Math.min(currentStep * increment, skill.level));

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [isVisible, skill.level]);

  const radius = 80;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const r = Number(normalizedRadius) || 74;
  const safeR = Number.isFinite(r) ? r : 74;

  return (
    <motion.div
      ref={chartRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col items-center"
    >
      <div className="relative mb-4 h-40 w-40">
        {/* Background circle */}
        <svg className="h-full w-full -rotate-90 transform">
          <circle
            cx={radius}
            cy={radius}
            r={safeR}
            stroke="#0a192f"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <motion.circle
            cx={radius}
            cy={radius}
            r={safeR}
            stroke={skill.color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 10px ${skill.color})`,
            }}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: 'easeOut' }}
          />
        </svg>

        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-3xl font-bold"
            style={{ color: skill.color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(progress)}%
          </motion.span>
        </div>
      </div>

      {/* Skill name */}
      <h3 className="text-center text-lg font-semibold text-white">
        {skill.name}
      </h3>
    </motion.div>
  );
}
