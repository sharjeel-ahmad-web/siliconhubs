'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export interface Keyword {
  text: string;
  importance: number;
  category: string;
}

export interface KeywordCategory {
  id: string;
  name: string;
  color: string;
}

export interface KeywordCloudProps {
  keywords?: Keyword[];
  categories?: KeywordCategory[];
  title?: string;
  subtitle?: string;
  totalKeywordsLabel?: string;
  avgImportanceLabel?: string;
  categoriesLabel?: string;
}

const defaultKeywords: Keyword[] = [
  { text: 'Web Design', importance: 10, category: 'design' },
  { text: 'SEO', importance: 9, category: 'marketing' },
  { text: 'Chatbot', importance: 8, category: 'ai' },
  { text: 'Automation', importance: 8, category: 'automation' },
  { text: 'E-commerce', importance: 7, category: 'ecommerce' },
  { text: 'WordPress', importance: 7, category: 'cms' },
  { text: 'Shopify', importance: 7, category: 'ecommerce' },
  { text: 'N8N', importance: 6, category: 'automation' },
  { text: 'AI', importance: 6, category: 'ai' },
  { text: 'Conversion', importance: 6, category: 'marketing' },
  { text: 'UX Design', importance: 5, category: 'design' },
  { text: 'Analytics', importance: 5, category: 'marketing' },
  { text: 'Performance', importance: 5, category: 'technical' },
  { text: 'Responsive', importance: 4, category: 'design' },
  { text: 'Mobile', importance: 4, category: 'design' },
  { text: 'API', importance: 4, category: 'technical' },
  { text: 'Integration', importance: 4, category: 'automation' },
  { text: 'Custom', importance: 3, category: 'design' },
  { text: 'Scalable', importance: 3, category: 'technical' },
  { text: 'Secure', importance: 3, category: 'technical' },
];

const defaultCategories: KeywordCategory[] = [
  { id: 'all', name: 'All Keywords', color: '#2563EB' },
  { id: 'design', name: 'Design', color: '#F97316' },
  { id: 'marketing', name: 'Marketing', color: '#2563EB' },
  { id: 'ai', name: 'AI', color: '#F97316' },
  { id: 'automation', name: 'Automation', color: '#2563EB' },
  { id: 'ecommerce', name: 'E-commerce', color: '#F97316' },
  { id: 'cms', name: 'CMS', color: '#2563EB' },
  { id: 'technical', name: 'Technical', color: '#F97316' },
];

/**
 * KeywordCloud Component
 *
 * Interactive keyword word cloud with size based on importance scores.
 * Supports category filtering with smooth fade transitions.
 *
 * Validates: Requirements 14.5, 14.6
 */
export function KeywordCloud({
  keywords: propKeywords,
  categories: propCategories,
  title = 'Keyword Strategy',
  subtitle = 'Interactive keyword cloud sized by importance',
  totalKeywordsLabel = 'Total Keywords',
  avgImportanceLabel = 'Avg Importance',
  categoriesLabel = 'Categories',
}: KeywordCloudProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredKeyword, setHoveredKeyword] = useState<string | null>(null);

  const keywords =
    propKeywords && propKeywords.length > 0 ? propKeywords : defaultKeywords;
  const categories =
    propCategories && propCategories.length > 0
      ? propCategories
      : defaultCategories;

  const filteredKeywords =
    selectedCategory === 'all'
      ? keywords
      : keywords.filter((k) => k.category === selectedCategory);

  // Calculate font size based on importance
  const getFontSize = (importance: number) => {
    return 12 + importance * 3; // 15px to 42px
  };

  // Get color based on category
  const getColor = (category: string) => {
    return categories.find((c) => c.id === category)?.color || '#2563EB';
  };

  return (
    <div className="relative min-h-[600px] w-full overflow-hidden rounded-2xl bg-[#0F172A] p-8">
      {/* Background effect */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, #2563EB, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 mb-6">
        <h3 className="mb-2 text-3xl font-bold text-white">{title}</h3>
        <p className="text-[#64748B]">{subtitle}</p>
      </div>

      {/* Category filters */}
      <div className="relative z-10 mb-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`
              rounded-lg px-4 py-2 font-medium transition-all duration-300
              ${
                selectedCategory === category.id
                  ? 'text-white shadow-lg'
                  : 'text-[#64748B] hover:text-white'
              }
            `}
            style={{
              background:
                selectedCategory === category.id
                  ? category.color
                  : 'rgba(100, 116, 139, 0.1)',
              boxShadow:
                selectedCategory === category.id
                  ? `0 0 20px ${category.color}40`
                  : 'none',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.name}
          </motion.button>
        ))}
      </div>

      {/* Keyword cloud */}
      <motion.div
        className="relative z-10 flex min-h-[400px] flex-wrap items-center justify-center gap-4"
        layout
      >
        {filteredKeywords.map((keyword, index) => {
          const fontSize = getFontSize(keyword.importance);
          const color = getColor(keyword.category);

          return (
            <motion.div
              key={keyword.text}
              layout
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.03,
                layout: { duration: 0.4 },
              }}
              onHoverStart={() => setHoveredKeyword(keyword.text)}
              onHoverEnd={() => setHoveredKeyword(null)}
              className="cursor-pointer"
            >
              <motion.span
                className="inline-block font-bold"
                style={{
                  fontSize: `${fontSize}px`,
                  color: color,
                  textShadow:
                    hoveredKeyword === keyword.text
                      ? `0 0 20px ${color}80`
                      : 'none',
                }}
                animate={{
                  scale: hoveredKeyword === keyword.text ? 1.2 : 1,
                  y: hoveredKeyword === keyword.text ? -5 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                {keyword.text}
              </motion.span>

              {/* Importance indicator */}
              {hoveredKeyword === keyword.text && (
                <motion.div
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 transform whitespace-nowrap"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="rounded-lg border border-[#64748B]/30 bg-[#1E293B] px-3 py-1">
                    <span className="text-sm text-white">
                      Importance: {keyword.importance}/10
                    </span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Stats */}
      <div className="relative z-10 mt-8 grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-[#64748B]/30 bg-[#1E293B]/50 p-4">
          <div className="mb-1 text-sm text-[#64748B]">
            {totalKeywordsLabel}
          </div>
          <div className="text-2xl font-bold text-white">
            {filteredKeywords.length}
          </div>
        </div>
        <div className="rounded-lg border border-[#64748B]/30 bg-[#1E293B]/50 p-4">
          <div className="mb-1 text-sm text-[#64748B]">
            {avgImportanceLabel}
          </div>
          <div className="text-2xl font-bold text-white">
            {(
              filteredKeywords.reduce((sum, k) => sum + k.importance, 0) /
              filteredKeywords.length
            ).toFixed(1)}
          </div>
        </div>
        <div className="rounded-lg border border-[#64748B]/30 bg-[#1E293B]/50 p-4">
          <div className="mb-1 text-sm text-[#64748B]">{categoriesLabel}</div>
          <div className="text-2xl font-bold text-white">
            {new Set(filteredKeywords.map((k) => k.category)).size}
          </div>
        </div>
      </div>
    </div>
  );
}
