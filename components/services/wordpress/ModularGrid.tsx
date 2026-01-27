'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * ModularGrid Component
 *
 * Displays WordPress UI components sliding in and snapping together like puzzle pieces
 * with magnetic attraction and elastic bounce animation.
 *
 * Validates: Requirements 12.1, 12.2
 */

export interface ModuleItem {
  id: string;
  title: string;
  icon: string;
  color: string;
  position: { row: number; col: number };
}

export interface ModularGridProps {
  modules?: ModuleItem[];
  successMessage?: string;
}

const defaultModules: ModuleItem[] = [
  // Row 0
  {
    id: 'header',
    title: 'Header',
    icon: '📋',
    color: '#2563EB',
    position: { row: 0, col: 0 },
  },
  {
    id: 'hero',
    title: 'Hero Section',
    icon: '🎯',
    color: '#F97316',
    position: { row: 0, col: 1 },
  },
  {
    id: 'nav',
    title: 'Navigation',
    icon: '🧭',
    color: '#2563EB',
    position: { row: 0, col: 2 },
  },
  {
    id: 'search',
    title: 'Search',
    icon: '🔍',
    color: '#F97316',
    position: { row: 0, col: 3 },
  },
  // Row 1
  {
    id: 'content',
    title: 'Content Block',
    icon: '📝',
    color: '#F97316',
    position: { row: 1, col: 0 },
  },
  {
    id: 'sidebar',
    title: 'Sidebar',
    icon: '📊',
    color: '#2563EB',
    position: { row: 1, col: 1 },
  },
  {
    id: 'gallery',
    title: 'Gallery',
    icon: '🖼️',
    color: '#F97316',
    position: { row: 1, col: 2 },
  },
  {
    id: 'forms',
    title: 'Forms',
    icon: '📋',
    color: '#2563EB',
    position: { row: 1, col: 3 },
  },
  // Row 2
  {
    id: 'testimonials',
    title: 'Testimonials',
    icon: '💬',
    color: '#2563EB',
    position: { row: 2, col: 0 },
  },
  {
    id: 'cta',
    title: 'Call to Action',
    icon: '🎯',
    color: '#F97316',
    position: { row: 2, col: 1 },
  },
  {
    id: 'footer',
    title: 'Footer',
    icon: '📌',
    color: '#2563EB',
    position: { row: 2, col: 2 },
  },
  {
    id: 'social',
    title: 'Social Links',
    icon: '🔗',
    color: '#F97316',
    position: { row: 2, col: 3 },
  },
];

export function ModularGrid({
  modules: propModules,
  successMessage = '✨ Modular components assembled successfully!',
}: ModularGridProps) {
  const modules =
    propModules && propModules.length > 0 ? propModules : defaultModules;
  const [assembled, setAssembled] = useState(false);

  useEffect(() => {
    // Trigger assembly animation after mount
    const timer = setTimeout(() => {
      setAssembled(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-6xl p-8">
      <div className="grid grid-cols-4 gap-4">
        {modules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200,
              rotate: Math.random() * 360,
              opacity: 0,
              scale: 0.5,
            }}
            animate={
              assembled
                ? {
                    x: 0,
                    y: 0,
                    rotate: 0,
                    opacity: 1,
                    scale: 1,
                  }
                : {}
            }
            transition={{
              delay: index * 0.1,
              duration: 0.8,
              type: 'spring',
              stiffness: 170,
              damping: 26,
              mass: 1.0,
            }}
            className="relative aspect-square"
          >
            <div
              className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg p-6 text-center transition-transform duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${module.color}20, ${module.color}40)`,
                border: `2px solid ${module.color}`,
                boxShadow: `0 4px 20px ${module.color}40`,
              }}
            >
              <div className="mb-3 text-4xl">{module.icon}</div>
              <h3 className="text-sm font-semibold text-white">
                {module.title}
              </h3>
            </div>

            {/* Magnetic snap indicator */}
            {assembled && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: index * 0.1 + 0.6, duration: 0.3 }}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#F97316]"
              >
                <span className="text-xs text-white">✓</span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Assembly complete message */}
      {assembled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-lg font-semibold text-[#F97316]">
            {successMessage}
          </p>
        </motion.div>
      )}
    </div>
  );
}
