'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ColorSwatch {
  name: string;
  color: string;
  image: string;
}

export interface ProductPreviewProps {
  colorSwatches?: ColorSwatch[];
  productLabel?: string;
  addToCartText?: string;
  dragHint?: string;
  scrollHint?: string;
}

const defaultColorSwatches: ColorSwatch[] = [
  { name: 'Midnight Black', color: '#1E293B', image: 'black' },
  { name: 'Ocean Blue', color: '#2563EB', image: 'blue' },
  { name: 'Sunset Orange', color: '#F97316', image: 'orange' },
  { name: 'Sky Blue', color: '#37AFE1', image: 'skyblue' },
];

/**
 * ProductPreview Component
 *
 * 3D product preview with rotate and zoom capabilities.
 * Color swatches animate transitions between product color options.
 * Add to cart emits particle burst animation with Success Green color.
 *
 * Validates: Requirements 13.4, 13.5, 13.6
 */
export function ProductPreview({
  colorSwatches: propColorSwatches,
  productLabel = 'SHOP',
  addToCartText = 'Add to Cart',
  dragHint = 'Drag to rotate',
  scrollHint = 'Scroll to zoom',
}: ProductPreviewProps) {
  const [selectedColor, setSelectedColor] = useState(0);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const colorSwatches =
    propColorSwatches && propColorSwatches.length > 0
      ? propColorSwatches
      : defaultColorSwatches;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    setRotation((prev) => ({
      x: prev.x + deltaY * 0.5,
      y: prev.y + deltaX * 0.5,
    }));

    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    setZoom((prev) => Math.max(0.5, Math.min(2, prev + delta)));
  };

  const handleAddToCart = () => {
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 2000);
  };

  return (
    <div className="relative mx-auto w-full max-w-4xl">
      {/* 3D Product Container */}
      <div
        ref={containerRef}
        className="relative h-[500px] cursor-grab overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Product Display */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})`,
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          {/* Product Box (simplified 3D representation) */}
          <motion.div
            className="relative h-64 w-64"
            animate={{
              backgroundColor: colorSwatches[selectedColor].color,
            }}
            transition={{ duration: 0.2 }}
          >
            {/* Front face */}
            <div
              className="absolute inset-0 flex items-center justify-center rounded-lg shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${colorSwatches[selectedColor].color}, ${colorSwatches[selectedColor].color}dd)`,
                boxShadow: `0 20px 60px ${colorSwatches[selectedColor].color}40`,
              }}
            >
              <div className="text-6xl font-bold text-white opacity-20">
                {productLabel}
              </div>
            </div>

            {/* Highlight effect */}
            <motion.div
              className="absolute inset-0 rounded-lg"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.3), transparent)',
              }}
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </motion.div>

        {/* Particle burst effect */}
        <AnimatePresence>
          {showParticles && (
            <div className="pointer-events-none absolute inset-0">
              {Array.from({ length: 15 }).map((_, i) => {
                const angle = (i / 15) * Math.PI * 2;
                const distance = 150 + Math.random() * 150;

                return (
                  <motion.div
                    key={i}
                    className="absolute h-3 w-3 rounded-full bg-[#F97316]"
                    style={{
                      left: '50%',
                      top: '50%',
                      boxShadow: '0 0 10px #F97316',
                    }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: Math.cos(angle) * distance,
                      y: Math.sin(angle) * distance,
                      opacity: 0,
                      scale: 0,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                  />
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* Controls hint */}
        <div className="absolute left-4 top-4 text-sm text-white/60">
          <div>{dragHint}</div>
          <div>{scrollHint}</div>
        </div>

        {/* Zoom indicator */}
        <div className="absolute right-4 top-4 text-sm text-white/60">
          Zoom: {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Color Swatches */}
      <div className="mt-8 flex justify-center gap-4">
        {colorSwatches.map((swatch, index) => (
          <motion.button
            key={swatch.name}
            className="group relative"
            onClick={() => setSelectedColor(index)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Swatch */}
            <div
              className="h-16 w-16 rounded-full border-4 transition-all duration-200"
              style={{
                backgroundColor: swatch.color,
                borderColor: selectedColor === index ? '#fff' : 'transparent',
                boxShadow:
                  selectedColor === index ? `0 0 20px ${swatch.color}` : 'none',
              }}
            />

            {/* Label */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 transform whitespace-nowrap text-sm text-white/80 opacity-0 transition-opacity group-hover:opacity-100">
              {swatch.name}
            </div>

            {/* Selection indicator */}
            {selectedColor === index && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white"
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: 1.3, opacity: 0 }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Add to Cart Button */}
      <div className="mt-12 flex justify-center">
        <motion.button
          className="relative overflow-hidden rounded-lg bg-gradient-to-r from-[#F97316] to-[#2563EB] px-8 py-4 font-bold text-white"
          onClick={handleAddToCart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          <span className="relative z-10">{addToCartText}</span>
        </motion.button>
      </div>
    </div>
  );
}
