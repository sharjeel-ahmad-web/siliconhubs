'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteContent } from '@/lib/hooks/useSiteContent';

interface Hotspot {
  id: string;
  x: number;
  y: number;
  title: string;
  description: string;
}

interface TourStop {
  id: string;
  name: string;
  description: string;
  image: string;
  hotspots: Hotspot[];
}

const defaultTourStops: TourStop[] = [
  {
    id: '1',
    name: 'Reception Area',
    description:
      'Welcome to Rising Dot! Our modern reception area sets the tone for innovation.',
    image: '🏢',
    hotspots: [
      {
        id: '1-1',
        x: 30,
        y: 40,
        title: 'Digital Display',
        description: 'Real-time project showcase',
      },
      {
        id: '1-2',
        x: 70,
        y: 50,
        title: 'Lounge',
        description: 'Comfortable waiting area',
      },
    ],
  },
  {
    id: '2',
    name: 'Open Workspace',
    description:
      'Collaborative environment where creativity flows and ideas come to life.',
    image: '💻',
    hotspots: [
      {
        id: '2-1',
        x: 25,
        y: 35,
        title: 'Dev Stations',
        description: 'Dual-monitor setups for developers',
      },
      {
        id: '2-2',
        x: 50,
        y: 60,
        title: 'Standing Desks',
        description: 'Ergonomic workstations',
      },
      {
        id: '2-3',
        x: 75,
        y: 45,
        title: 'Collaboration Zone',
        description: 'Whiteboard brainstorming area',
      },
    ],
  },
  {
    id: '3',
    name: 'Meeting Rooms',
    description:
      'State-of-the-art meeting spaces equipped with the latest technology.',
    image: '🎯',
    hotspots: [
      {
        id: '3-1',
        x: 40,
        y: 50,
        title: 'Video Conferencing',
        description: '4K cameras and audio',
      },
      {
        id: '3-2',
        x: 70,
        y: 40,
        title: 'Smart Board',
        description: 'Interactive presentation display',
      },
    ],
  },
  {
    id: '4',
    name: 'Break Room',
    description:
      'Recharge and connect with teammates in our fully-stocked break area.',
    image: '☕',
    hotspots: [
      {
        id: '4-1',
        x: 30,
        y: 45,
        title: 'Coffee Bar',
        description: 'Premium espresso machine',
      },
      {
        id: '4-2',
        x: 60,
        y: 55,
        title: 'Game Zone',
        description: 'Ping pong and arcade games',
      },
    ],
  },
];

export default function OfficeTour() {
  const [currentStop, setCurrentStop] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  // Fetch CMS content
  const { content } = useSiteContent<{
    tourStops?: TourStop[];
  }>('about', 'officeTour');

  const tourStops = content?.tourStops || defaultTourStops;

  const handleNext = () => {
    setCurrentStop((prev) => (prev + 1) % tourStops.length);
    setRotation((prev) => prev + 90);
    setSelectedHotspot(null);
  };

  const handlePrev = () => {
    setCurrentStop((prev) => (prev - 1 + tourStops.length) % tourStops.length);
    setRotation((prev) => prev - 90);
    setSelectedHotspot(null);
  };

  const currentTourStop = tourStops[currentStop];

  return (
    <div className="relative">
      {/* Main viewer */}
      <div className="relative h-[600px] overflow-hidden rounded-2xl border border-[#64748B]/20 bg-[#0F172A]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStop}
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 90 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* 360° view simulation */}
            <div className="relative h-full w-full">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/20 to-[#37AFE1]/20" />

              {/* Large emoji as placeholder */}
              <div className="absolute inset-0 flex items-center justify-center text-[200px] opacity-30">
                {currentTourStop.image}
              </div>

              {/* Hotspots */}
              {currentTourStop.hotspots.map((hotspot) => (
                <motion.div
                  key={hotspot.id}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setSelectedHotspot(hotspot.id)}
                >
                  <motion.div
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#2563EB] font-bold text-white shadow-lg"
                    animate={{
                      boxShadow: [
                        '0 0 0 0 rgba(37, 99, 235, 0.7)',
                        '0 0 0 20px rgba(37, 99, 235, 0)',
                        '0 0 0 0 rgba(37, 99, 235, 0)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                  >
                    +
                  </motion.div>

                  {/* Hotspot tooltip */}
                  <AnimatePresence>
                    {selectedHotspot === hotspot.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-1/2 top-full z-10 mt-2 w-64 -translate-x-1/2 rounded-lg border border-[#2563EB]/30 bg-[#1E293B] p-4 shadow-xl"
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

              {/* Info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0F172A] to-transparent p-8">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-2 text-3xl font-bold text-white"
                >
                  {currentTourStop.name}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-[#64748B]"
                >
                  {currentTourStop.description}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#1E293B] text-2xl text-white transition-colors hover:bg-[#2563EB]"
        >
          ←
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#1E293B] text-2xl text-white transition-colors hover:bg-[#2563EB]"
        >
          →
        </button>
      </div>

      {/* Tour navigation */}
      <div className="mt-8 flex justify-center gap-4">
        {tourStops.map((stop, index) => (
          <motion.button
            key={stop.id}
            onClick={() => {
              setCurrentStop(index);
              setSelectedHotspot(null);
            }}
            className={`rounded-lg px-6 py-3 font-semibold transition-all ${
              currentStop === index
                ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/50'
                : 'bg-[#1E293B] text-[#64748B] hover:bg-[#1E293B]/80'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {stop.name}
          </motion.button>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="mt-6 flex justify-center gap-2">
        {tourStops.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all ${
              currentStop === index ? 'w-8 bg-[#2563EB]' : 'w-2 bg-[#64748B]/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
