'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

export interface KeywordRanking {
  keyword: string;
  startPosition: number;
  endPosition: number;
  color: string;
}

export interface CompetitorPosition {
  position: number;
  name: string;
}

export interface SERPRankingProps {
  keywords?: KeywordRanking[];
  competitors?: CompetitorPosition[];
  title?: string;
  subtitle?: string;
  yourRankingsLabel?: string;
  competitorsLabel?: string;
  siteDomain?: string;
}

const defaultKeywords: KeywordRanking[] = [
  {
    keyword: 'Web Design Agency',
    startPosition: 10,
    endPosition: 1,
    color: '#F97316',
  },
  {
    keyword: 'Custom Chatbots',
    startPosition: 8,
    endPosition: 2,
    color: '#F97316',
  },
  {
    keyword: 'N8N Automation',
    startPosition: 12,
    endPosition: 3,
    color: '#F97316',
  },
  {
    keyword: 'Shopify Development',
    startPosition: 15,
    endPosition: 4,
    color: '#F97316',
  },
  {
    keyword: 'WordPress Solutions',
    startPosition: 9,
    endPosition: 5,
    color: '#F97316',
  },
];

const defaultCompetitors: CompetitorPosition[] = [
  { position: 6, name: 'Competitor A' },
  { position: 7, name: 'Competitor B' },
  { position: 8, name: 'Competitor C' },
];

/**
 * SERPRanking Component
 *
 * Visualizes search engine ranking positions with animated keyword movement.
 * Shows keywords moving from position #10 to #1 with Success Green color.
 * Competitor positions shown with Warning Amber markers.
 *
 * Validates: Requirements 14.1, 14.2, 14.3
 */
export function SERPRanking({
  keywords: propKeywords,
  competitors: propCompetitors,
  title = 'Search Engine Rankings',
  subtitle = 'Watch your keywords climb to the top of search results',
  yourRankingsLabel = 'Your Rankings',
  competitorsLabel = 'Competitors',
  siteDomain = 'risingdot.agency',
}: SERPRankingProps) {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [hoveredKeyword, setHoveredKeyword] = useState<string | null>(null);

  const keywords =
    propKeywords && propKeywords.length > 0 ? propKeywords : defaultKeywords;
  const competitors =
    propCompetitors && propCompetitors.length > 0
      ? propCompetitors
      : defaultCompetitors;

  useEffect(() => {
    // Start animation after component mounts
    const timer = setTimeout(() => setAnimationStarted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-[550px] w-full overflow-hidden rounded-2xl bg-[#0F172A] p-8">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(#2563EB 1px, transparent 1px), linear-gradient(90deg, #2563EB 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 mb-8">
        <h3 className="mb-2 text-3xl font-bold text-white">{title}</h3>
        <p className="text-[#64748B]">{subtitle}</p>
      </div>

      {/* SERP Visualization */}
      <div className="relative z-10 space-y-3">
        {[...Array(10)].map((_, index) => {
          const position = index + 1;
          const keyword = keywords.find((k) =>
            animationStarted
              ? k.endPosition === position
              : k.startPosition === position
          );
          const competitor = competitors.find((c) => c.position === position);
          const isTopThree = position <= 3;

          return (
            <motion.div
              key={position}
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: position * 0.05, duration: 0.5 }}
            >
              <div
                className={`
                flex items-center gap-4 rounded-lg border-2 p-4 transition-all duration-300
                ${isTopThree ? 'border-[#F97316] bg-[#F97316]/10' : 'border-[#64748B]/30 bg-[#1E293B]/50'}
                ${hoveredKeyword === keyword?.keyword ? 'scale-105 shadow-lg' : ''}
              `}
              >
                {/* Position number */}
                <div
                  className={`
                  flex h-12 w-12 items-center justify-center rounded-lg text-xl font-bold
                  ${isTopThree ? 'bg-[#F97316] text-white' : 'bg-[#64748B]/30 text-[#64748B]'}
                `}
                >
                  #{position}
                </div>

                {/* Content */}
                <div className="flex-1">
                  {keyword && (
                    <motion.div
                      initial={
                        animationStarted
                          ? {
                              y:
                                (keyword.startPosition - keyword.endPosition) *
                                60,
                            }
                          : {}
                      }
                      animate={{ y: 0 }}
                      transition={{
                        duration: 2,
                        delay: 1,
                        ease: [0.34, 1.56, 0.64, 1],
                      }}
                      onHoverStart={() => setHoveredKeyword(keyword.keyword)}
                      onHoverEnd={() => setHoveredKeyword(null)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-semibold text-white">
                          {keyword.keyword}
                        </div>
                        <motion.div
                          className="flex items-center gap-1 text-sm font-medium text-[#F97316]"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 3, duration: 0.5 }}
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 10l7-7m0 0l7 7m-7-7v18"
                            />
                          </svg>
                          <span>
                            +{keyword.startPosition - keyword.endPosition}{' '}
                            positions
                          </span>
                        </motion.div>
                      </div>
                      <div className="mt-1 text-sm text-[#64748B]">
                        {siteDomain} › services ›{' '}
                        {keyword.keyword.toLowerCase().replace(/\s+/g, '-')}
                      </div>
                    </motion.div>
                  )}

                  {competitor && !keyword && (
                    <div className="flex items-center gap-3">
                      <div className="font-medium text-[#F59E0B]">
                        {competitor.name}
                      </div>
                      <div className="text-sm text-[#64748B]">
                        competitor-site.com
                      </div>
                    </div>
                  )}

                  {!keyword && !competitor && (
                    <div className="text-[#64748B]">Other search result</div>
                  )}
                </div>

                {/* Ranking indicator */}
                {keyword && (
                  <motion.div
                    className="h-12 w-2 rounded-full bg-gradient-to-b from-[#F97316] to-[#2563EB]"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 2.5, duration: 0.5 }}
                  />
                )}

                {competitor && (
                  <div className="h-12 w-2 rounded-full bg-[#F59E0B]/50" />
                )}
              </div>

              {/* Glow effect for top positions */}
              {isTopThree && keyword && (
                <motion.div
                  className="pointer-events-none absolute inset-0 rounded-lg"
                  style={{
                    boxShadow: '0 0 30px rgba(249, 115, 22, 0.3)',
                  }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="relative z-10 mt-8 flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#F97316]" />
          <span className="text-white/80">{yourRankingsLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#F59E0B]" />
          <span className="text-white/80">{competitorsLabel}</span>
        </div>
      </div>
    </div>
  );
}
