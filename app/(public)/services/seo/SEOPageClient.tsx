'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import {
  SERPRanking,
  KeywordCloud,
  TrafficGrowth,
  CompetitorAnalysis,
} from '@/components/services/seo';
import { Web3MediaHero } from '@/components/ui/web3media-hero';
import { Search, TrendingUp, Target, BarChart3 } from 'lucide-react';
import ServiceCaseStudies from '@/components/sections/ServiceCaseStudies';
import ServiceCTA from '@/components/sections/ServiceCTA';
import { SectionHeading } from '@/components/ui/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';
import { withDefaults, ensureCtaButton } from '@/lib/cms-content';

const StackFeatureSection = dynamic(
  () => import('@/components/ui/stack-feature-section'),
  {
    ssr: false,
  }
);

const ServiceVideoSection = dynamic(
  () => import('@/components/sections/ServiceVideoSection'),
  {
    ssr: false,
  }
);

// Define interfaces for CMS content types
interface HeroContent {
  title: string;
  highlightedText: string;
  subtitle: string;
  ctaButton: {
    label: string;
    href: string;
  };
}

interface VideoContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  videoSrc: string;
  ctaText: string;
  ctaHref: string;
}

interface SectionHeadingContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
}

// SEO component content types
interface KeywordRanking {
  keyword: string;
  startPosition: number;
  endPosition: number;
  color: string;
}

interface CompetitorPosition {
  position: number;
  name: string;
}

interface SERPRankingContent extends SectionHeadingContent {
  keywords?: KeywordRanking[];
  competitors?: CompetitorPosition[];
  yourRankingsLabel?: string;
  competitorsLabel?: string;
  siteDomain?: string;
}

interface KeywordItem {
  text: string;
  importance: number;
  category: string;
}

interface KeywordCategory {
  id: string;
  name: string;
  color: string;
}

interface KeywordCloudContent extends SectionHeadingContent {
  keywords?: KeywordItem[];
  categories?: KeywordCategory[];
  totalKeywordsLabel?: string;
  avgImportanceLabel?: string;
  categoriesLabel?: string;
}

interface DataPoint {
  month: string;
  traffic: number;
  conversions: number;
}

interface Milestone {
  index: number;
  label: string;
  icon: string;
}

interface TrafficGrowthContent extends SectionHeadingContent {
  data?: DataPoint[];
  milestones?: Milestone[];
  totalGrowthLabel?: string;
  monthlyVisitorsLabel?: string;
  conversionsLabel?: string;
  conversionRateLabel?: string;
}

interface Competitor {
  name: string;
  rank: number;
  traffic: number;
  keywords: number;
  backlinks: number;
  color: string;
}

interface CompetitorAnalysisContent extends SectionHeadingContent {
  yourSite?: Competitor;
  competitors?: Competitor[];
  monthlyTrafficLabel?: string;
  rankingKeywordsLabel?: string;
  qualityBacklinksLabel?: string;
}

interface CaseStudy {
  img: string;
  title: string;
  desc: string;
  sliderName: string;
}

interface CaseStudiesContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  studies: CaseStudy[];
}

interface CTAContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
}

// Default fallback content
const defaultHeroContent: HeroContent = {
  title: 'Dominate Search',
  highlightedText: 'Drive Organic Growth',
  subtitle:
    'Strategic SEO solutions that boost your rankings, increase organic traffic, and convert visitors into customers. Data-driven optimization for measurable results.',
  ctaButton: {
    label: 'Get SEO Audit',
    href: '/contact',
  },
};

const defaultVideoContent: VideoContent = {
  eyebrow: 'See SEO In Action',
  title: 'Watch How We Drive',
  titleHighlight: 'Organic Growth',
  subtitle:
    'Experience our SEO process and see the ranking improvements we achieve for our clients.',
  videoSrc: '/media/services/seo/video/hero-video.mp4',
  ctaText: 'Start Your SEO Journey',
  ctaHref: '/contact',
};

const defaultSerpRankingContent: SERPRankingContent = {
  eyebrow: 'SERP Tracking',
  title: 'Search Engine',
  titleHighlight: 'Rankings',
  subtitle:
    'Watch your keywords climb from page 2 to the top of search results.',
  keywords: [
    {
      keyword: 'Web Design Agency',
      startPosition: 10,
      endPosition: 1,
      color: '#31A4DB',
    },
    {
      keyword: 'Custom Chatbots',
      startPosition: 8,
      endPosition: 2,
      color: '#31A4DB',
    },
    {
      keyword: 'N8N Automation',
      startPosition: 12,
      endPosition: 3,
      color: '#31A4DB',
    },
    {
      keyword: 'Shopify Development',
      startPosition: 15,
      endPosition: 4,
      color: '#31A4DB',
    },
    {
      keyword: 'WordPress Solutions',
      startPosition: 9,
      endPosition: 5,
      color: '#31A4DB',
    },
  ],
  competitors: [
    { position: 6, name: 'Competitor A' },
    { position: 7, name: 'Competitor B' },
    { position: 8, name: 'Competitor C' },
  ],
  yourRankingsLabel: 'Your Rankings',
  competitorsLabel: 'Competitors',
  siteDomain: 'risingdot.agency',
};

const defaultKeywordCloudContent: KeywordCloudContent = {
  eyebrow: 'Keyword Strategy',
  title: 'Strategic Keyword',
  titleHighlight: 'Targeting',
  subtitle:
    'Explore our comprehensive keyword strategy tailored to your business.',
  keywords: [
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
  ],
  categories: [
    { id: 'all', name: 'All Keywords', color: '#2563EB' },
    { id: 'design', name: 'Design', color: '#F97316' },
    { id: 'marketing', name: 'Marketing', color: '#31A4DB' },
    { id: 'ai', name: 'AI', color: '#2563EB' },
    { id: 'automation', name: 'Automation', color: '#F97316' },
    { id: 'ecommerce', name: 'E-commerce', color: '#F59E0B' },
    { id: 'cms', name: 'CMS', color: '#EF4444' },
    { id: 'technical', name: 'Technical', color: '#64748B' },
  ],
  totalKeywordsLabel: 'Total Keywords',
  avgImportanceLabel: 'Avg Importance',
  categoriesLabel: 'Categories',
};

const defaultTrafficGrowthContent: TrafficGrowthContent = {
  eyebrow: 'Growth Metrics',
  title: 'Organic Traffic',
  titleHighlight: 'Growth',
  subtitle: 'See the exponential growth in organic traffic and conversions.',
  data: [
    { month: 'Jan', traffic: 1200, conversions: 24 },
    { month: 'Feb', traffic: 1800, conversions: 36 },
    { month: 'Mar', traffic: 2500, conversions: 50 },
    { month: 'Apr', traffic: 3200, conversions: 64 },
    { month: 'May', traffic: 4100, conversions: 82 },
    { month: 'Jun', traffic: 5300, conversions: 106 },
    { month: 'Jul', traffic: 6800, conversions: 136 },
    { month: 'Aug', traffic: 8500, conversions: 170 },
    { month: 'Sep', traffic: 10200, conversions: 204 },
    { month: 'Oct', traffic: 12500, conversions: 250 },
    { month: 'Nov', traffic: 15000, conversions: 300 },
    { month: 'Dec', traffic: 18000, conversions: 360 },
  ],
  milestones: [
    { index: 2, label: '2.5K Visitors', icon: '🎯' },
    { index: 5, label: '5K Visitors', icon: '🚀' },
    { index: 8, label: '10K Visitors', icon: '⭐' },
    { index: 11, label: '18K Visitors', icon: '🎉' },
  ],
  totalGrowthLabel: 'Total Growth',
  monthlyVisitorsLabel: 'Monthly Visitors',
  conversionsLabel: 'Conversions',
  conversionRateLabel: 'Conversion Rate',
};

const defaultCompetitorAnalysisContent: CompetitorAnalysisContent = {
  eyebrow: 'Market Analysis',
  title: 'Competitive',
  titleHighlight: 'Advantage',
  subtitle: 'Outrank your competitors and capture more market share.',
  yourSite: {
    name: 'Rising Dot',
    rank: 1,
    traffic: 18000,
    keywords: 250,
    backlinks: 1200,
    color: '#31A4DB',
  },
  competitors: [
    {
      name: 'Competitor A',
      rank: 2,
      traffic: 15000,
      keywords: 220,
      backlinks: 980,
      color: '#F59E0B',
    },
    {
      name: 'Competitor B',
      rank: 3,
      traffic: 12000,
      keywords: 180,
      backlinks: 850,
      color: '#F59E0B',
    },
    {
      name: 'Competitor C',
      rank: 4,
      traffic: 9500,
      keywords: 150,
      backlinks: 720,
      color: '#F59E0B',
    },
    {
      name: 'Competitor D',
      rank: 5,
      traffic: 7200,
      keywords: 120,
      backlinks: 580,
      color: '#F59E0B',
    },
  ],
  monthlyTrafficLabel: 'Monthly Traffic',
  rankingKeywordsLabel: 'Ranking Keywords',
  qualityBacklinksLabel: 'Quality Backlinks',
};

const defaultCaseStudiesContent: CaseStudiesContent = {
  eyebrow: 'SEO Success Stories',
  title: 'Rankings That',
  titleHighlight: 'Dominate',
  subtitle:
    "See how we've helped businesses climb to the top of search results and drive organic growth.",
  studies: [
    {
      img: '/media/services/seo/case-studies/local-business.jpg',
      title: 'Local Business SEO',
      desc: 'From page 5 to #1 rankings with 250% increase in organic traffic and 180% more leads.',
      sliderName: 'local',
    },
    {
      img: '/media/services/seo/case-studies/ecommerce-seo.jpg',
      title: 'E-Commerce SEO',
      desc: 'Product page optimization resulting in 300% revenue growth from organic search.',
      sliderName: 'ecommerce',
    },
    {
      img: '/media/services/seo/case-studies/technical-seo.jpg',
      title: 'Technical SEO Audit',
      desc: 'Site-wide technical fixes improving Core Web Vitals and 40% faster indexing.',
      sliderName: 'technical',
    },
    {
      img: '/media/services/seo/case-studies/content-strategy.jpg',
      title: 'Content Strategy',
      desc: 'Topic cluster approach generating 500+ ranking keywords and 10x organic visibility.',
      sliderName: 'content',
    },
  ],
};

const defaultCTAContent: CTAContent = {
  eyebrow: 'Dominate Search',
  title: 'Boost Your',
  titleHighlight: 'Rankings',
  subtitle: "Let's create an SEO strategy that drives real business results",
  ctaText: 'Start Your SEO Journey',
  ctaHref: '/contact',
};

export default function SEOPageClient() {
  // Fetch CMS content for all sections
  const { content: heroContent } = useSiteContent<HeroContent>(
    'services-seo',
    'hero'
  );
  const { content: videoContent } = useSiteContent<VideoContent>(
    'services-seo',
    'video'
  );
  const { content: serpRankingContent } = useSiteContent<SERPRankingContent>(
    'services-seo',
    'serpRanking'
  );
  const { content: keywordCloudContent } = useSiteContent<KeywordCloudContent>(
    'services-seo',
    'keywordCloud'
  );
  const { content: trafficGrowthContent } =
    useSiteContent<TrafficGrowthContent>('services-seo', 'trafficGrowth');
  const { content: competitorAnalysisContent } =
    useSiteContent<CompetitorAnalysisContent>(
      'services-seo',
      'competitorAnalysis'
    );
  const { content: caseStudiesContent } = useSiteContent<CaseStudiesContent>(
    'services-seo',
    'caseStudies'
  );
  const { content: ctaContent } = useSiteContent<CTAContent>(
    'services-seo',
    'cta'
  );

  // Safe merge: preserve defaults, allow partial CMS; ensure ctaButton.href and ctaHref are always strings
  const heroMerged = withDefaults(defaultHeroContent, heroContent ?? undefined);
  const hero = {
    ...heroMerged,
    ctaButton: ensureCtaButton(defaultHeroContent.ctaButton, heroContent?.ctaButton),
  };
  const video = withDefaults(defaultVideoContent, videoContent ?? undefined, ['ctaHref']);
  const serpRanking = serpRankingContent ?? defaultSerpRankingContent;
  const keywordCloud = keywordCloudContent ?? defaultKeywordCloudContent;
  const trafficGrowth = trafficGrowthContent ?? defaultTrafficGrowthContent;
  const competitorAnalysis =
    competitorAnalysisContent ?? defaultCompetitorAnalysisContent;
  const caseStudies = caseStudiesContent ?? defaultCaseStudiesContent;
  const cta = withDefaults(defaultCTAContent, ctaContent ?? undefined, ['ctaHref']);

  return (
    <main className="min-h-screen bg-black">
      {/* SEO Hero Section - Uses CMS content with fallback */}
      <Web3MediaHero
        title={hero.title}
        highlightedText={hero.highlightedText}
        subtitle={hero.subtitle}
        ctaButton={{
          label: hero.ctaButton.label,
          href: hero.ctaButton.href,
        }}
        floatingIcons={[
          {
            icon: <Search className="h-8 w-8 text-[#37AFE1]" />,
            label: 'Keywords',
            position: { x: '8%', y: '25%' },
          },
          {
            icon: <TrendingUp className="h-8 w-8 text-[#37AFE1]" />,
            label: 'Rankings',
            position: { x: '12%', y: '60%' },
          },
          {
            icon: <Target className="h-8 w-8 text-[#F58122]" />,
            label: 'Traffic',
            position: { x: '82%', y: '20%' },
          },
          {
            icon: <BarChart3 className="h-8 w-8 text-[#F58122]" />,
            label: 'Analytics',
            position: { x: '78%', y: '55%' },
          },
        ]}
      />

      {/* Video Section - Uses CMS content with fallback */}
      <ServiceVideoSection
        eyebrow={video.eyebrow}
        title={video.title}
        titleHighlight={video.titleHighlight}
        subtitle={video.subtitle}
        videoSrc={video.videoSrc}
        ctaText={video.ctaText}
        ctaHref={video.ctaHref}
      />

      {/* SERP Ranking Section - Uses CMS content with fallback */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={serpRanking.eyebrow}
            title={serpRanking.title}
            titleHighlight={serpRanking.titleHighlight}
            subtitle={serpRanking.subtitle}
          />
          <SERPRanking
            keywords={serpRanking.keywords}
            competitors={serpRanking.competitors}
            yourRankingsLabel={serpRanking.yourRankingsLabel}
            competitorsLabel={serpRanking.competitorsLabel}
            siteDomain={serpRanking.siteDomain}
          />
        </div>
      </section>

      {/* Keyword Cloud Section - Uses CMS content with fallback */}
      <section className="bg-black px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={keywordCloud.eyebrow}
            title={keywordCloud.title}
            titleHighlight={keywordCloud.titleHighlight}
            subtitle={keywordCloud.subtitle}
          />
          <KeywordCloud
            keywords={keywordCloud.keywords}
            categories={keywordCloud.categories}
            totalKeywordsLabel={keywordCloud.totalKeywordsLabel}
            avgImportanceLabel={keywordCloud.avgImportanceLabel}
            categoriesLabel={keywordCloud.categoriesLabel}
          />
        </div>
      </section>

      {/* Traffic Growth Section - Uses CMS content with fallback */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={trafficGrowth.eyebrow}
            title={trafficGrowth.title}
            titleHighlight={trafficGrowth.titleHighlight}
            subtitle={trafficGrowth.subtitle}
          />
          <TrafficGrowth
            data={trafficGrowth.data}
            milestones={trafficGrowth.milestones}
            totalGrowthLabel={trafficGrowth.totalGrowthLabel}
            monthlyVisitorsLabel={trafficGrowth.monthlyVisitorsLabel}
            conversionsLabel={trafficGrowth.conversionsLabel}
            conversionRateLabel={trafficGrowth.conversionRateLabel}
          />
        </div>
      </section>

      {/* Competitor Analysis Section - Uses CMS content with fallback */}
      <section className="bg-black px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={competitorAnalysis.eyebrow}
            title={competitorAnalysis.title}
            titleHighlight={competitorAnalysis.titleHighlight}
            subtitle={competitorAnalysis.subtitle}
          />
          <CompetitorAnalysis
            yourSite={competitorAnalysis.yourSite}
            competitors={competitorAnalysis.competitors}
            monthlyTrafficLabel={competitorAnalysis.monthlyTrafficLabel}
            rankingKeywordsLabel={competitorAnalysis.rankingKeywordsLabel}
            qualityBacklinksLabel={competitorAnalysis.qualityBacklinksLabel}
          />
        </div>
      </section>

      {/* SEO Case Studies - Uses CMS content with fallback */}
      <ServiceCaseStudies
        eyebrow={caseStudies.eyebrow}
        title={caseStudies.title}
        titleHighlight={caseStudies.titleHighlight}
        subtitle={caseStudies.subtitle}
        caseStudies={caseStudies.studies}
      />

      {/* Tech Stack Section - Uses CMS content with fallback */}
      <StackFeatureSection page="services-seo" />

      {/* CTA Section with Social Links - Uses CMS content with fallback */}
      <ServiceCTA
        eyebrow={cta.eyebrow}
        title={cta.title}
        titleHighlight={cta.titleHighlight}
        subtitle={cta.subtitle}
        ctaText={cta.ctaText}
        ctaLink={cta.ctaHref}
      />
    </main>
  );
}

