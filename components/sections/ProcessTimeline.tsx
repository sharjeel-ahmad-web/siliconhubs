'use client';

import { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Lightbulb,
  Code,
  TestTube,
  Rocket,
  HeartHandshake,
} from 'lucide-react';
import RadialOrbitalTimeline from '@/components/ui/radial-orbital-timeline';

// Process timeline data for Rising Dot Agency
const processData = [
  {
    id: 1,
    title: 'Discovery',
    date: 'Step 1',
    content:
      'We start by understanding your business, goals, and challenges through in-depth consultation.',
    category: 'Planning',
    icon: MessageSquare,
    relatedIds: [2],
    status: 'completed' as const,
    energy: 100,
  },
  {
    id: 2,
    title: 'Strategy',
    date: 'Step 2',
    content:
      'We craft a tailored digital strategy that aligns with your objectives and target audience.',
    category: 'Planning',
    icon: Lightbulb,
    relatedIds: [1, 3],
    status: 'completed' as const,
    energy: 90,
  },
  {
    id: 3,
    title: 'Development',
    date: 'Step 3',
    content:
      'Our team brings your vision to life with cutting-edge technology and best practices.',
    category: 'Development',
    icon: Code,
    relatedIds: [2, 4],
    status: 'in-progress' as const,
    energy: 70,
  },
  {
    id: 4,
    title: 'Testing',
    date: 'Step 4',
    content:
      'Rigorous quality assurance ensures everything works flawlessly across all devices.',
    category: 'Testing',
    icon: TestTube,
    relatedIds: [3, 5],
    status: 'in-progress' as const,
    energy: 50,
  },
  {
    id: 5,
    title: 'Launch',
    date: 'Step 5',
    content:
      'We deploy your solution and ensure a smooth transition to production.',
    category: 'Release',
    icon: Rocket,
    relatedIds: [4, 6],
    status: 'pending' as const,
    energy: 30,
  },
  {
    id: 6,
    title: 'Support',
    date: 'Step 6',
    content:
      'Ongoing maintenance and support to keep your digital presence running at peak performance.',
    category: 'Support',
    icon: HeartHandshake,
    relatedIds: [5],
    status: 'pending' as const,
    energy: 20,
  },
];

// Custom Hook for Scroll Animation
const useScrollAnimation = () => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, inView] as const;
};

export default function ProcessTimeline() {
  const [headerRef, headerInView] = useScrollAnimation();
  const [pRef, pInView] = useScrollAnimation();

  return (
    <section className="bg-black py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <h2
            ref={headerRef as React.RefObject<HTMLHeadingElement>}
            className={`font-montserrat text-4xl font-bold transition-all duration-700 ease-out md:text-5xl ${
              headerInView
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <span className="text-[#37AFE1]">Our</span>{' '}
            <span className="text-white">Process</span>
          </h2>
          <p
            ref={pRef as React.RefObject<HTMLParagraphElement>}
            className={`mt-4 font-inter text-lg text-gray-400 transition-all delay-200 duration-700 ease-out ${
              pInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            A proven methodology that delivers results every time
          </p>
        </div>

        {/* Timeline */}
        <RadialOrbitalTimeline timelineData={processData} />

        {/* Instructions */}
        <p className="mt-4 text-center text-sm text-white/50">
          Click on any node to explore • Click outside to reset
        </p>
      </div>
    </section>
  );
}
