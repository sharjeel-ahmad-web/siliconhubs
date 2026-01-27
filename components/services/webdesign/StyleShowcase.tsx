'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * StyleShowcase Component
 *
 * Interactive color picker with real-time theming and smooth font transitions.
 * Color schemes are editable from the CMS dashboard.
 *
 * Validates: Requirements 11.6, 11.7
 */

export interface ColorScheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

export interface FeatureCard {
  title: string;
  description: string;
}

export interface FontOption {
  name: string;
  family: string;
}

export interface StyleShowcaseProps {
  featureCards?: FeatureCard[];
  brandTitle?: string;
  brandDescription?: string;
  ctaText?: string;
  colorSchemes?: ColorScheme[];
  fonts?: FontOption[];
}

const defaultFeatureCards: FeatureCard[] = [
  { title: 'Feature 1', description: 'Description text' },
  { title: 'Feature 2', description: 'Description text' },
  { title: 'Feature 3', description: 'Description text' },
];

const defaultColorSchemes: ColorScheme[] = [
  {
    name: 'Ocean',
    primary: '#2563EB',
    secondary: '#37AFE1',
    accent: '#31A4DB',
  },
  {
    name: 'Sunset',
    primary: '#F97316',
    secondary: '#F58122',
    accent: '#F59E0B',
  },
  { name: 'Sky', primary: '#37AFE1', secondary: '#31A4DB', accent: '#2563EB' },
  { name: 'Fire', primary: '#F58122', secondary: '#F97316', accent: '#F59E0B' },
  {
    name: 'Midnight',
    primary: '#1E3A8A',
    secondary: '#3B82F6',
    accent: '#60A5FA',
  },
  {
    name: 'Coral',
    primary: '#F97316',
    secondary: '#FB923C',
    accent: '#FDBA74',
  },
  {
    name: 'Electric',
    primary: '#37AFE1',
    secondary: '#06B6D4',
    accent: '#22D3EE',
  },
  {
    name: 'Amber',
    primary: '#F59E0B',
    secondary: '#FBBF24',
    accent: '#FCD34D',
  },
];

const defaultFonts: FontOption[] = [
  { name: 'Modern', family: 'Inter, sans-serif' },
  { name: 'Classic', family: 'Georgia, serif' },
  { name: 'Tech', family: 'Fira Code, monospace' },
  { name: 'Elegant', family: 'Montserrat, sans-serif' },
];

export const StyleShowcase: React.FC<StyleShowcaseProps> = ({
  featureCards,
  brandTitle = 'Your Brand Title',
  brandDescription = 'This is how your content will look with the selected style. The typography and colors update in real-time to give you an instant preview of your design choices.',
  ctaText = 'Call to Action',
  colorSchemes: propColorSchemes,
  fonts: propFonts,
}) => {
  const cards =
    featureCards && featureCards.length > 0
      ? featureCards
      : defaultFeatureCards;
  const colorSchemes =
    propColorSchemes && propColorSchemes.length > 0
      ? propColorSchemes
      : defaultColorSchemes;
  const fonts = propFonts && propFonts.length > 0 ? propFonts : defaultFonts;

  const [activeScheme, setActiveScheme] = useState(0);
  const [activeFont, setActiveFont] = useState(0);

  const currentScheme = colorSchemes[activeScheme] || colorSchemes[0];
  const currentFont = fonts[activeFont] || fonts[0];

  return (
    <div className="w-full">
      {/* Color Scheme Picker */}
      <div className="mb-8">
        <h3 className="mb-4 text-xl font-bold text-white">Color Scheme</h3>
        <div className="flex flex-wrap gap-4">
          {colorSchemes.map((scheme, index) => (
            <motion.button
              key={scheme.name}
              onClick={() => setActiveScheme(index)}
              className="group relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className="flex gap-2 rounded-lg border-2 bg-[#0F172A] p-4 transition-all duration-300"
                style={{
                  borderColor:
                    index === activeScheme ? scheme.primary : '#1E293B',
                  boxShadow:
                    index === activeScheme
                      ? `0 0 20px ${scheme.primary}40`
                      : 'none',
                }}
              >
                <motion.div
                  className="h-8 w-8 rounded-full"
                  style={{ backgroundColor: scheme.primary }}
                  animate={{
                    scale: index === activeScheme ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: index === activeScheme ? Infinity : 0,
                    repeatDelay: 1,
                  }}
                />
                <motion.div
                  className="h-8 w-8 rounded-full"
                  style={{ backgroundColor: scheme.secondary }}
                  animate={{
                    scale: index === activeScheme ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1,
                    repeat: index === activeScheme ? Infinity : 0,
                    repeatDelay: 1,
                  }}
                />
                <motion.div
                  className="h-8 w-8 rounded-full"
                  style={{ backgroundColor: scheme.accent }}
                  animate={{
                    scale: index === activeScheme ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2,
                    repeat: index === activeScheme ? Infinity : 0,
                    repeatDelay: 1,
                  }}
                />
              </div>
              <div
                className="mt-2 text-center text-sm transition-colors duration-300"
                style={{
                  color: index === activeScheme ? scheme.primary : '#64748B',
                }}
              >
                {scheme.name}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Font Picker */}
      <div className="mb-8">
        <h3 className="mb-4 text-xl font-bold text-white">Typography</h3>
        <div className="flex flex-wrap gap-4">
          {fonts.map((font, index) => (
            <motion.button
              key={font.name}
              onClick={() => setActiveFont(index)}
              className="rounded-lg border-2 bg-[#0F172A] px-6 py-3 transition-all duration-300"
              style={{
                borderColor:
                  index === activeFont ? currentScheme.primary : '#1E293B',
                fontFamily: font.family,
                color: index === activeFont ? '#FFFFFF' : '#94A3B8',
                boxShadow:
                  index === activeFont
                    ? `0 0 15px ${currentScheme.primary}30`
                    : 'none',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {font.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Live Preview */}
      <motion.div
        className="rounded-xl border border-slate-800 bg-[#0F172A] p-8"
        key={`${activeScheme}-${activeFont}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          boxShadow: `0 0 40px ${currentScheme.primary}15`,
        }}
      >
        {/* Preview Header */}
        <div className="mb-6 flex items-center gap-2 border-b border-slate-700 pb-4">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 text-center text-xs text-slate-500">
            Live Preview
          </div>
        </div>

        <motion.h2
          className="mb-4 text-4xl font-bold"
          style={{
            color: currentScheme.primary,
            fontFamily: currentFont.family,
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {brandTitle}
        </motion.h2>

        <motion.p
          className="mb-6 text-lg"
          style={{
            color: '#94A3B8',
            fontFamily: currentFont.family,
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {brandDescription}
        </motion.p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              className="relative overflow-hidden rounded-lg p-6"
              style={{
                background: `linear-gradient(135deg, ${currentScheme.primary}20, ${currentScheme.secondary}20)`,
                border: `1px solid ${currentScheme.accent}40`,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
              whileHover={{
                scale: 1.02,
                boxShadow: `0 10px 30px ${currentScheme.primary}30`,
              }}
            >
              {/* Gradient overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  background: `radial-gradient(circle at top right, ${currentScheme.accent}, transparent 70%)`,
                }}
              />

              <motion.div
                className="relative z-10 mb-4 h-12 w-12 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${currentScheme.primary}, ${currentScheme.accent})`,
                }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              />
              <h4
                className="relative z-10 mb-2 font-bold"
                style={{
                  color: currentScheme.primary,
                  fontFamily: currentFont.family,
                }}
              >
                {card.title}
              </h4>
              <p
                className="relative z-10 text-sm"
                style={{
                  color: '#94A3B8',
                  fontFamily: currentFont.family,
                }}
              >
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.button
          className="relative mt-6 overflow-hidden rounded-lg px-8 py-3 font-bold text-white"
          style={{
            background: `linear-gradient(135deg, ${currentScheme.primary}, ${currentScheme.secondary})`,
            fontFamily: currentFont.family,
          }}
          whileHover={{
            scale: 1.05,
            boxShadow: `0 10px 30px ${currentScheme.primary}50`,
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <span className="relative z-10">{ctaText}</span>
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${currentScheme.secondary}, ${currentScheme.accent})`,
            }}
            initial={{ x: '-100%' }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>

        {/* Color Info Display */}
        <div className="mt-8 border-t border-slate-700 pt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Current Scheme:</span>
            <div className="flex items-center gap-3">
              <span
                style={{ color: currentScheme.primary }}
                className="font-medium"
              >
                {currentScheme.name}
              </span>
              <div className="flex gap-1">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: currentScheme.primary }}
                  title={`Primary: ${currentScheme.primary}`}
                />
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: currentScheme.secondary }}
                  title={`Secondary: ${currentScheme.secondary}`}
                />
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: currentScheme.accent }}
                  title={`Accent: ${currentScheme.accent}`}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
