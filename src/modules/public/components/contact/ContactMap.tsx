'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface MapMarker {
  id: string;
  x: number;
  y: number;
  label: string;
  description: string;
}

const markers: MapMarker[] = [
  {
    id: '1',
    x: 50,
    y: 50,
    label: 'Main Office',
    description: '123 Innovation Street, Tech District',
  },
  {
    id: '2',
    x: 30,
    y: 40,
    label: 'Parking',
    description: 'Underground parking available',
  },
  {
    id: '3',
    x: 70,
    y: 60,
    label: 'Entrance',
    description: 'Main entrance on Innovation Street',
  },
];

export default function ContactMap() {
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  return (
    <div className="relative h-[500px] overflow-hidden rounded-2xl border border-[#64748B]/20">
      {/* Map background with custom styling */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(#2563EB 1px, transparent 1px),
              linear-gradient(90deg, #2563EB 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Animated route visualization */}
        <svg className="absolute inset-0 h-full w-full">
          <motion.path
            d="M 100 100 Q 200 150, 300 200 T 500 300"
            stroke="#2563EB"
            strokeWidth="3"
            fill="none"
            strokeDasharray="10 5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </svg>

        {/* Markers */}
        {markers.map((marker) => (
          <motion.div
            key={marker.id}
            className="absolute cursor-pointer"
            style={{
              left: `${marker.x}%`,
              top: `${marker.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            onMouseEnter={() => setHoveredMarker(marker.id)}
            onMouseLeave={() => setHoveredMarker(null)}
            onClick={() =>
              setSelectedMarker(selectedMarker === marker.id ? null : marker.id)
            }
          >
            {/* Marker pin */}
            <motion.div
              className="relative"
              animate={{
                scale: hoveredMarker === marker.id ? 1.2 : 1,
              }}
            >
              {/* Pulsing animation */}
              <motion.div
                className="absolute inset-0 rounded-full bg-[#2563EB]"
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />

              {/* Pin icon */}
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#2563EB] text-xl text-white shadow-lg">
                📍
              </div>

              {/* Glow effect on hover */}
              {hoveredMarker === marker.id && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-[#2563EB]"
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ opacity: 0.3, scale: 1.5 }}
                  style={{ filter: 'blur(10px)' }}
                />
              )}
            </motion.div>

            {/* Tooltip */}
            {(hoveredMarker === marker.id || selectedMarker === marker.id) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-1/2 top-full z-10 mt-2 w-64 -translate-x-1/2 rounded-lg border border-[#2563EB]/30 bg-[#1E293B] p-4 shadow-xl"
              >
                <h4 className="mb-1 font-bold text-white">{marker.label}</h4>
                <p className="text-sm text-[#64748B]">{marker.description}</p>
              </motion.div>
            )}
          </motion.div>
        ))}

        {/* Center location indicator */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-6xl opacity-30">🏢</div>
        </motion.div>
      </div>

      {/* Map controls */}
      <div className="absolute right-4 top-4 z-20 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#64748B]/30 bg-[#1E293B] text-white transition-colors hover:bg-[#2563EB]"
        >
          +
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#64748B]/30 bg-[#1E293B] text-white transition-colors hover:bg-[#2563EB]"
        >
          −
        </motion.button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 rounded-lg border border-[#64748B]/30 bg-[#1E293B]/90 p-4 backdrop-blur-sm">
        <h4 className="mb-2 text-sm font-semibold text-white">Legend</h4>
        <div className="space-y-1 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#2563EB]" />
            <span>Office Locations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1 w-3 bg-[#2563EB]" />
            <span>Routes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
