'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  skills: string[];
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Chen',
    role: 'CEO & Founder',
    bio: 'Visionary leader with 15+ years in digital innovation. Passionate about creating transformative digital experiences.',
    avatar: '👨‍💼',
    skills: ['Strategy', 'Leadership', 'Innovation'],
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    role: 'Lead Designer',
    bio: 'Award-winning designer specializing in UI/UX and motion design. Creates beautiful, functional interfaces.',
    avatar: '👩‍🎨',
    skills: ['UI/UX', 'Motion Design', 'Branding'],
  },
  {
    id: '3',
    name: 'Marcus Rodriguez',
    role: 'Senior Developer',
    bio: 'Full-stack wizard with expertise in React, Node.js, and cloud architecture. Builds scalable solutions.',
    avatar: '👨‍💻',
    skills: ['React', 'Node.js', 'AWS'],
  },
  {
    id: '4',
    name: 'Emily Watson',
    role: 'SEO Specialist',
    bio: 'Data-driven SEO expert who consistently delivers top rankings. Passionate about organic growth.',
    avatar: '👩‍💼',
    skills: ['SEO', 'Analytics', 'Content Strategy'],
  },
  {
    id: '5',
    name: 'David Kim',
    role: 'Automation Engineer',
    bio: 'N8N and workflow automation specialist. Streamlines processes and saves countless hours.',
    avatar: '👨‍🔧',
    skills: ['N8N', 'Automation', 'Integration'],
  },
  {
    id: '6',
    name: 'Lisa Martinez',
    role: 'AI/ML Engineer',
    bio: 'Chatbot and AI specialist. Creates intelligent conversational experiences that delight users.',
    avatar: '👩‍🔬',
    skills: ['AI/ML', 'NLP', 'Chatbots'],
  },
];

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export default function TeamGrid() {
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
            life: p.life - 0.02,
          }))
          .filter((p) => p.life > 0)
      );
    };

    const intervalId = setInterval(animate, 16);
    return () => clearInterval(intervalId);
  }, [particles.length]);

  const emitParticles = (x: number, y: number) => {
    const newParticles: Particle[] = [];
    const particleCount = 8;

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = 1 + Math.random() * 2;

      newParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);
  };

  const handleCardClick = (id: string, e: React.MouseEvent) => {
    setFlippedCard(flippedCard === id ? null : id);

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    emitParticles(x, y);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Particle overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute h-2 w-2 rounded-full bg-[#2563EB]"
            style={{
              left: particle.x,
              top: particle.y,
              opacity: particle.life,
              boxShadow: `0 0 ${particle.life * 10}px rgba(37, 99, 235, ${particle.life})`,
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member, index) => (
          <TeamCard
            key={member.id}
            member={member}
            isFlipped={flippedCard === member.id}
            onClick={(e) => handleCardClick(member.id, e)}
            mousePosition={mousePosition}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

interface TeamCardProps {
  member: TeamMember;
  isFlipped: boolean;
  onClick: (e: React.MouseEvent) => void;
  mousePosition: { x: number; y: number };
  index: number;
}

function TeamCard({
  member,
  isFlipped,
  onClick,
  mousePosition,
  index,
}: TeamCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;

    // Calculate distance from mouse to card center
    const dx =
      mousePosition.x -
      (rect.left - cardRef.current.offsetParent!.getBoundingClientRect().left);
    const dy =
      mousePosition.y -
      (rect.top - cardRef.current.offsetParent!.getBoundingClientRect().top);
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Apply magnetic rotation toward cursor
    if (distance < 200) {
      const angle = Math.atan2(dy, dx);
      const strength = (200 - distance) / 200;
      setTilt({
        x: Math.sin(angle) * strength * 5,
        y: -Math.cos(angle) * strength * 5,
      });
    } else {
      setTilt({ x: 0, y: 0 });
    }
  }, [mousePosition]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={onClick}
    >
      <motion.div
        className="relative h-[400px] w-full"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s',
        }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
          rotateX: tilt.x,
          rotateZ: tilt.y,
        }}
      >
        {/* Front side */}
        <div
          className="backface-hidden absolute inset-0 overflow-hidden rounded-lg border border-[#64748B]/20 bg-[#0F172A]"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 text-8xl">{member.avatar}</div>
            <h3 className="mb-2 text-2xl font-bold text-white">
              {member.name}
            </h3>
            <p className="mb-4 text-[#2563EB]">{member.role}</p>
            <p className="text-sm text-[#64748B]">Click to view bio</p>
          </div>

          {/* Hover glow */}
          <motion.div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#2563EB]/0 to-[#37AFE1]/0"
            whileHover={{
              background:
                'linear-gradient(to bottom right, rgba(37, 99, 235, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
            }}
          />
        </div>

        {/* Back side */}
        <div
          className="backface-hidden absolute inset-0 overflow-hidden rounded-lg border border-[#2563EB]/30 bg-[#0F172A]"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="flex h-full flex-col justify-center p-8">
            <h3 className="mb-2 text-2xl font-bold text-white">
              {member.name}
            </h3>
            <p className="mb-4 text-[#2563EB]">{member.role}</p>
            <p className="mb-6 leading-relaxed text-[#64748B]">{member.bio}</p>

            {/* Skills */}
            <div className="space-y-2">
              <p className="mb-2 text-sm text-[#64748B]">Key Skills:</p>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-[#2563EB]/30 bg-[#2563EB]/20 px-3 py-1 text-xs text-[#2563EB]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
