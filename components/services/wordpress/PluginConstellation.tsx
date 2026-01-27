'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * PluginConstellation Component
 *
 * Displays WordPress plugins as stars in a constellation with connection lines.
 * Implements magnetic hover effect for related plugins within 100px radius.
 *
 * Validates: Requirements 12.5, 12.6, 12.7
 */

export interface PluginItem {
  id: string;
  name: string;
  category: string;
  x: number;
  y: number;
  relatedTo: string[];
}

export interface CategoryColor {
  category: string;
  color: string;
}

export interface PluginConstellationProps {
  plugins?: PluginItem[];
  categoryColors?: CategoryColor[];
  legendTitle?: string;
  instructionText?: string;
}

const defaultPlugins: PluginItem[] = [
  // Security plugins - top left area
  {
    id: 'wordfence',
    name: 'Wordfence',
    category: 'security',
    x: 12,
    y: 15,
    relatedTo: ['jetpack', 'ithemes'],
  },
  {
    id: 'ithemes',
    name: 'iThemes Security',
    category: 'security',
    x: 8,
    y: 32,
    relatedTo: ['wordfence', 'sucuri'],
  },
  {
    id: 'sucuri',
    name: 'Sucuri',
    category: 'security',
    x: 18,
    y: 45,
    relatedTo: ['ithemes', 'wordfence'],
  },

  // Performance plugins - top center area
  {
    id: 'wp-rocket',
    name: 'WP Rocket',
    category: 'performance',
    x: 38,
    y: 12,
    relatedTo: ['autoptimize', 'smush'],
  },
  {
    id: 'autoptimize',
    name: 'Autoptimize',
    category: 'performance',
    x: 48,
    y: 25,
    relatedTo: ['wp-rocket', 'smush'],
  },
  {
    id: 'smush',
    name: 'Smush',
    category: 'performance',
    x: 58,
    y: 15,
    relatedTo: ['wp-rocket', 'autoptimize', 'imagify'],
  },
  {
    id: 'imagify',
    name: 'Imagify',
    category: 'performance',
    x: 68,
    y: 28,
    relatedTo: ['smush'],
  },

  // SEO plugins - top right area
  {
    id: 'yoast',
    name: 'Yoast SEO',
    category: 'seo',
    x: 78,
    y: 18,
    relatedTo: ['rank-math', 'aioseo'],
  },
  {
    id: 'rank-math',
    name: 'Rank Math',
    category: 'seo',
    x: 88,
    y: 32,
    relatedTo: ['yoast', 'aioseo'],
  },
  {
    id: 'aioseo',
    name: 'All in One SEO',
    category: 'seo',
    x: 82,
    y: 48,
    relatedTo: ['yoast', 'rank-math'],
  },

  // E-commerce plugins - bottom left area
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    category: 'ecommerce',
    x: 28,
    y: 62,
    relatedTo: ['stripe', 'paypal', 'mailchimp'],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'ecommerce',
    x: 38,
    y: 78,
    relatedTo: ['woocommerce', 'paypal'],
  },
  {
    id: 'paypal',
    name: 'PayPal',
    category: 'ecommerce',
    x: 22,
    y: 82,
    relatedTo: ['woocommerce', 'stripe'],
  },

  // Content plugins - center area
  {
    id: 'elementor',
    name: 'Elementor',
    category: 'content',
    x: 15,
    y: 68,
    relatedTo: ['acf', 'gutenberg'],
  },
  {
    id: 'acf',
    name: 'ACF',
    category: 'content',
    x: 8,
    y: 52,
    relatedTo: ['elementor', 'wpbakery'],
  },
  {
    id: 'gutenberg',
    name: 'Gutenberg',
    category: 'content',
    x: 32,
    y: 88,
    relatedTo: ['elementor'],
  },
  {
    id: 'wpbakery',
    name: 'WPBakery',
    category: 'content',
    x: 5,
    y: 75,
    relatedTo: ['acf', 'elementor'],
  },

  // Analytics plugins - right side
  {
    id: 'monsterinsights',
    name: 'MonsterInsights',
    category: 'analytics',
    x: 72,
    y: 62,
    relatedTo: ['google-analytics', 'jetpack'],
  },
  {
    id: 'google-analytics',
    name: 'GA Dashboard',
    category: 'analytics',
    x: 85,
    y: 72,
    relatedTo: ['monsterinsights'],
  },

  // Utility plugins - scattered
  {
    id: 'jetpack',
    name: 'Jetpack',
    category: 'utility',
    x: 55,
    y: 52,
    relatedTo: ['wordfence', 'mailchimp', 'monsterinsights'],
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    category: 'utility',
    x: 48,
    y: 42,
    relatedTo: ['woocommerce', 'jetpack'],
  },
  {
    id: 'contact-form-7',
    name: 'Contact Form 7',
    category: 'utility',
    x: 62,
    y: 38,
    relatedTo: ['mailchimp'],
  },
  {
    id: 'updraftplus',
    name: 'UpdraftPlus',
    category: 'backup',
    x: 75,
    y: 85,
    relatedTo: ['jetpack'],
  },
  {
    id: 'duplicator',
    name: 'Duplicator',
    category: 'backup',
    x: 88,
    y: 58,
    relatedTo: ['updraftplus'],
  },
];

const defaultCategoryColors: CategoryColor[] = [
  { category: 'security', color: '#EF4444' },
  { category: 'performance', color: '#2563EB' },
  { category: 'seo', color: '#31A4DB' },
  { category: 'ecommerce', color: '#F59E0B' },
  { category: 'content', color: '#F97316' },
  { category: 'analytics', color: '#37AFE1' },
  { category: 'utility', color: '#64748B' },
  { category: 'backup', color: '#22C55E' },
];

export function PluginConstellation({
  plugins: propPlugins,
  categoryColors: propCategoryColors,
  legendTitle = 'Plugin Categories',
  instructionText = 'over plugins to see related connections',
}: PluginConstellationProps) {
  const plugins =
    propPlugins && propPlugins.length > 0 ? propPlugins : defaultPlugins;
  const categoryColorsArray =
    propCategoryColors && propCategoryColors.length > 0
      ? propCategoryColors
      : defaultCategoryColors;

  // Convert array to record for easy lookup
  const categoryColorsMap: Record<string, string> = categoryColorsArray.reduce(
    (acc, item) => {
      acc[item.category] = item.color;
      return acc;
    },
    {} as Record<string, string>
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPlugin, setHoveredPlugin] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const isRelated = (pluginId: string) => {
    if (!hoveredPlugin) return false;
    const hovered = plugins.find((p) => p.id === hoveredPlugin);
    return hovered?.relatedTo.includes(pluginId) || pluginId === hoveredPlugin;
  };

  const isMagneticActive = (plugin: PluginItem) => {
    if (!hoveredPlugin) return false;
    const distance = getDistance(plugin.x, plugin.y, mousePos.x, mousePos.y);
    return distance < 15 && isRelated(plugin.id);
  };

  // Get unique categories from plugins
  const uniqueCategories = Array.from(new Set(plugins.map((p) => p.category)));
  const displayCategories = categoryColorsArray.filter((c) =>
    uniqueCategories.includes(c.category)
  );

  return (
    <div
      ref={containerRef}
      className="relative h-[600px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#0F172A] to-[#1E293B]"
    >
      {/* Connection lines */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full">
        {plugins.map((plugin) =>
          plugin.relatedTo.map((relatedId) => {
            const related = plugins.find((p) => p.id === relatedId);
            if (!related) return null;

            const isHighlighted =
              hoveredPlugin === plugin.id || hoveredPlugin === relatedId;
            const color = isHighlighted
              ? categoryColorsMap[plugin.category] || '#64748B'
              : '#64748B';
            const opacity = isHighlighted ? 0.6 : 0.15;

            return (
              <motion.line
                key={`${plugin.id}-${relatedId}`}
                x1={`${plugin.x}%`}
                y1={`${plugin.y}%`}
                x2={`${related.x}%`}
                y2={`${related.y}%`}
                stroke={color}
                strokeWidth={isHighlighted ? 2 : 1}
                strokeOpacity={opacity}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            );
          })
        )}
      </svg>

      {/* Plugin nodes */}
      {plugins.map((plugin, index) => {
        const isHovered = hoveredPlugin === plugin.id;
        const isRelatedNode = isRelated(plugin.id);
        const isMagnetic = isMagneticActive(plugin);

        return (
          <motion.div
            key={plugin.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: isHovered ? 1.5 : isRelatedNode ? 1.2 : 1,
              opacity: hoveredPlugin && !isRelatedNode ? 0.3 : 1,
            }}
            transition={{
              delay: index * 0.03,
              duration: 0.5,
              type: 'spring',
              stiffness: 250,
              damping: 30,
            }}
            style={{
              position: 'absolute',
              left: `${plugin.x}%`,
              top: `${plugin.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onMouseEnter={() => setHoveredPlugin(plugin.id)}
            onMouseLeave={() => setHoveredPlugin(null)}
            className="z-10 cursor-pointer"
          >
            {/* Glow effect */}
            {isRelatedNode && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full blur-xl"
                style={{
                  background: categoryColorsMap[plugin.category] || '#64748B',
                  opacity: 0.3,
                }}
              />
            )}

            {/* Plugin star */}
            <div
              className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 md:h-12 md:w-12"
              style={{
                backgroundColor: `${categoryColorsMap[plugin.category] || '#64748B'}20`,
                borderColor: categoryColorsMap[plugin.category] || '#64748B',
                boxShadow: isRelatedNode
                  ? `0 0 20px ${categoryColorsMap[plugin.category] || '#64748B'}80`
                  : 'none',
              }}
            >
              <div
                className="h-2.5 w-2.5 rounded-full md:h-3 md:w-3"
                style={{
                  backgroundColor:
                    categoryColorsMap[plugin.category] || '#64748B',
                }}
              />
            </div>

            {/* Plugin name tooltip */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg border bg-[#1E293B] px-3 py-2"
                style={{
                  borderColor: categoryColorsMap[plugin.category] || '#64748B',
                }}
              >
                <p className="text-sm font-semibold text-white">
                  {plugin.name}
                </p>
                <p
                  className="text-xs capitalize"
                  style={{
                    color: categoryColorsMap[plugin.category] || '#64748B',
                  }}
                >
                  {plugin.category}
                </p>
              </motion.div>
            )}

            {/* Magnetic indicator */}
            {isMagnetic && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#31A4DB]"
              >
                <span className="text-xs text-white">⚡</span>
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {/* Legend - with proper spacing */}
      <div className="absolute bottom-4 left-4 rounded-lg border border-slate-700 bg-[#1E293B]/95 p-4 backdrop-blur-sm">
        <p className="mb-3 text-sm font-semibold text-white">{legendTitle}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {displayCategories.map(({ category, color }) => (
            <div key={category} className="flex items-center gap-2">
              <div
                className="h-3 w-3 flex-shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="whitespace-nowrap text-xs capitalize text-slate-400">
                {category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute right-4 top-4 max-w-xs rounded-lg border border-slate-700 bg-[#1E293B]/95 p-4 backdrop-blur-sm">
        <p className="text-sm text-white">
          <span className="font-semibold text-[#37AFE1]">Hover</span>{' '}
          <span className="text-slate-400">{instructionText}</span>
        </p>
      </div>
    </div>
  );
}
