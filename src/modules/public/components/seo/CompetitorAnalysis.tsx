'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface Competitor {
  name: string;
  rank: number;
  traffic: number;
  keywords: number;
  backlinks: number;
  color: string;
}

export interface CompetitorAnalysisProps {
  yourSite?: Competitor;
  competitors?: Competitor[];
  title?: string;
  subtitle?: string;
  monthlyTrafficLabel?: string;
  rankingKeywordsLabel?: string;
  qualityBacklinksLabel?: string;
}

const defaultYourSite: Competitor = {
  name: 'Silicon Hubs',
  rank: 1,
  traffic: 18000,
  keywords: 250,
  backlinks: 1200,
  color: '#fc4c00',
};

const defaultCompetitors: Competitor[] = [
  {
    name: 'Competitor A',
    rank: 2,
    traffic: 15000,
    keywords: 220,
    backlinks: 980,
    color: '#2563EB',
  },
  {
    name: 'Competitor B',
    rank: 3,
    traffic: 12000,
    keywords: 180,
    backlinks: 850,
    color: '#2563EB',
  },
  {
    name: 'Competitor C',
    rank: 4,
    traffic: 9500,
    keywords: 150,
    backlinks: 720,
    color: '#2563EB',
  },
  {
    name: 'Competitor D',
    rank: 5,
    traffic: 7200,
    keywords: 120,
    backlinks: 580,
    color: '#2563EB',
  },
];

/**
 * CompetitorAnalysis Component
 *
 * Visualizes competitor positions with Warning Amber color-coded markers.
 * Shows comparative metrics with animated radial charts.
 *
 * Validates: Requirements 14.3, 14.7
 */
export function CompetitorAnalysis({
  yourSite: propYourSite,
  competitors: propCompetitors,
  title = 'Competitive Analysis',
  subtitle = 'See how you stack up against the competition',
  monthlyTrafficLabel = 'Monthly Traffic',
  rankingKeywordsLabel = 'Ranking Keywords',
  qualityBacklinksLabel = 'Quality Backlinks',
}: CompetitorAnalysisProps) {
  const [selectedMetric, setSelectedMetric] = useState<
    'traffic' | 'keywords' | 'backlinks'
  >('traffic');

  const yourSite = propYourSite || defaultYourSite;
  const competitors =
    propCompetitors && propCompetitors.length > 0
      ? propCompetitors
      : defaultCompetitors;

  const allSites = [yourSite, ...competitors];
  const maxValue = Math.max(...allSites.map((s) => s[selectedMetric]));

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'traffic':
        return monthlyTrafficLabel;
      case 'keywords':
        return rankingKeywordsLabel;
      case 'backlinks':
        return qualityBacklinksLabel;
      default:
        return '';
    }
  };

  const formatValue = (value: number, metric: string) => {
    if (metric === 'traffic') {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  return (
    <div className="relative min-h-[700px] w-full overflow-hidden rounded-2xl bg-[#0F172A] p-8">
      {/* Background effect */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              'conic-gradient(from 0deg, #fc4c00, #2563EB, #fc4c00, #2563EB)',
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 mb-6">
        <h3 className="mb-2 text-3xl font-bold text-white">{title}</h3>
        <p className="text-[#64748B]">{subtitle}</p>
      </div>

      {/* Metric selector */}
      <div className="relative z-10 mb-8 flex gap-2">
        {(['traffic', 'keywords', 'backlinks'] as const).map((metric) => (
          <motion.button
            key={metric}
            onClick={() => setSelectedMetric(metric)}
            className={`
              rounded-lg px-6 py-3 font-medium transition-all duration-300
              ${
                selectedMetric === metric
                  ? 'bg-[#2563EB] text-white shadow-lg'
                  : 'bg-[#1E293B]/50 text-[#64748B] hover:text-white'
              }
            `}
            style={{
              boxShadow:
                selectedMetric === metric ? '0 0 20px #2563EB40' : 'none',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {getMetricLabel(metric)}
          </motion.button>
        ))}
      </div>

      {/* Comparison bars */}
      <div className="relative z-10 mb-8 space-y-4">
        {allSites.map((site, index) => {
          const percentage = (site[selectedMetric] / maxValue) * 100;
          const isYourSite = site.name === 'Silicon Hubs';

          return (
            <motion.div
              key={site.name}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative"
            >
              <div className="mb-2 flex items-center gap-4">
                <div
                  className={`
                  flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold
                  ${isYourSite ? 'bg-[#fc4c00] text-white' : 'bg-[#2563EB] text-white'}
                `}
                >
                  #{site.rank}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">{site.name}</div>
                </div>
                <div className="font-bold text-white">
                  {formatValue(site[selectedMetric], selectedMetric)}
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative h-12 overflow-hidden rounded-lg border border-[#64748B]/30 bg-[#1E293B]/50">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-lg"
                  style={{
                    background: `linear-gradient(90deg, ${site.color}80, ${site.color})`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{
                    delay: index * 0.1 + 0.3,
                    duration: 1,
                    ease: 'easeOut',
                  }}
                >
                  {/* Animated shine effect */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${site.color}40, transparent)`,
                    }}
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: index * 0.1 + 1,
                    }}
                  />
                </motion.div>

                {/* Glow effect for your site */}
                {isYourSite && (
                  <motion.div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      boxShadow: `inset 0 0 20px ${site.color}40`,
                    }}
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Radial comparison chart */}
      <div className="relative z-10 grid grid-cols-3 gap-6">
        {(['traffic', 'keywords', 'backlinks'] as const).map(
          (metric, index) => {
            const yourValue = yourSite[metric];
            const avgCompetitor =
              competitors.reduce((sum, c) => sum + c[metric], 0) /
              competitors.length;
            const advantage = ((yourValue / avgCompetitor - 1) * 100).toFixed(
              0
            );

            return (
              <motion.div
                key={metric}
                className="rounded-lg border border-[#64748B]/30 bg-[#1E293B]/50 p-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
              >
                <div className="text-center">
                  <div className="mb-2 text-sm text-[#64748B]">
                    {getMetricLabel(metric)}
                  </div>

                  {/* Radial progress */}
                  <div className="relative mx-auto mb-4 h-32 w-32">
                    <svg className="h-full w-full -rotate-90 transform">
                      {/* Background circle */}
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke="#64748B20"
                        strokeWidth="8"
                      />
                      {/* Progress circle */}
                      <motion.circle
                        cx="64"
                        cy="64"
                        r={56}
                        fill="none"
                        stroke="#fc4c00"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                        animate={{
                          strokeDashoffset:
                            2 * Math.PI * 56 * (1 - (Number(maxValue) > 0 ? yourValue / maxValue : 0)),
                        }}
                        transition={{
                          delay: 1.5 + index * 0.1,
                          duration: 1,
                          ease: 'easeOut',
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-xl font-bold text-white">
                        {formatValue(yourValue, metric)}
                      </div>
                    </div>
                  </div>

                  {/* Advantage indicator */}
                  <div
                    className={`
                  inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium
                  ${parseFloat(advantage) > 0 ? 'bg-[#fc4c00]/20 text-[#fc4c00]' : 'bg-[#2563EB]/20 text-[#2563EB]'}
                `}
                  >
                    {parseFloat(advantage) > 0 ? '↑' : '↓'}{' '}
                    {Math.abs(parseFloat(advantage))}% vs avg
                  </div>
                </div>
              </motion.div>
            );
          }
        )}
      </div>
    </div>
  );
}
