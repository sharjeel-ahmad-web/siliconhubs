'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { WorkflowBuilder } from '@/modules/public/components/services/WorkflowBuilder';
import { BeforeAfterSlider } from '@/modules/public/components/services/BeforeAfterSlider';
import { PerformanceMetrics } from '@/modules/public/components/services/PerformanceMetrics';
import { FluxCardHero } from '@/modules/public/components/flux-card-hero';
import ServiceCaseStudies from '@/modules/public/sections/ServiceCaseStudies';
import ServiceCTA from '@/modules/public/sections/ServiceCTA';
import DatabaseWithRestApi from '@/modules/public/components/database-with-rest-api';
import { SectionHeading } from '@/modules/public/components/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';
import { withDefaults, ensureCtaButton } from '@/lib/cms-content';

const StackFeatureSection = dynamic(
  () => import('@/modules/public/components/stack-feature-section'),
  {
    ssr: false,
  }
);

const ServiceVideoSection = dynamic(
  () => import('@/modules/public/sections/ServiceVideoSection'),
  {
    ssr: false,
  }
);

// Define interfaces for CMS content types
interface CardConfig {
  bgColor: string;
  content: {
    type?: 'analytics' | 'projects' | 'chat-history';
    greeting?: string;
    subtitle?: string;
    title?: string;
  };
}

interface HeroContent {
  eyebrow: string;
  title: string;
  highlightedWord: string;
  highlightedWord2: string;
  subtitle: string;
  ctaButton: {
    label: string;
    href: string;
  };
  cards?: CardConfig[];
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

// WorkflowBuilder CMS content interface - Requirements: 2.3, 2.4
interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'output';
  label: string;
  x: number;
  y: number;
  connections: string[];
}

interface NodeTypeColors {
  trigger: string;
  action: string;
  condition: string;
  output: string;
}

interface WorkflowBuilderContent extends SectionHeadingContent {
  nodes?: WorkflowNode[];
  nodeColors?: NodeTypeColors;
}

// BeforeAfterSlider CMS content interface - Requirements: 3.1, 3.2, 3.3, 3.4
interface ProcessStep {
  step: number;
  text: string;
  time: string;
}

interface ProcessConfig {
  title: string;
  steps: ProcessStep[];
  totalTime: string;
  summary: string;
}

interface BeforeAfterContent extends SectionHeadingContent {
  manualProcess?: ProcessConfig;
  automatedProcess?: ProcessConfig;
}

interface PerformanceMetric {
  label: string;
  value: string;
  target: number;
  unit: string;
  color: string;
  icon: string;
}

interface PerformanceBenefit {
  title: string;
  description: string;
}

interface PerformanceMetricsContent extends SectionHeadingContent {
  metrics?: PerformanceMetric[];
  benefits?: PerformanceBenefit[];
  benefitsTitle?: string;
}

// ApiIntegration CMS content interface - Requirements: 4.1, 4.2, 4.3, 4.4
interface ApiIntegrationContent extends SectionHeadingContent {
  circleText?: string;
  badgeTexts?: {
    first: string;
    second: string;
    third: string;
    fourth: string;
  };
  buttonTexts?: {
    first: string;
    second: string;
  };
  boxTitle?: string;
  lightColor?: string;
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
  eyebrow: 'Workflow Automation',
  title: 'N8N Automation, Efficiency Amplified',
  highlightedWord: 'N8N',
  highlightedWord2: 'Efficiency',
  subtitle:
    'Transform manual workflows into intelligent automation systems. Connect apps, sync data, and automate repetitive tasks with powerful N8N workflows.',
  ctaButton: {
    label: 'Start Automating',
    href: '/contact',
  },
  // Default cards configuration - Requirements: 1.3
  cards: [
    {
      bgColor: 'bg-[#06b6d4]',
      content: {
        greeting: 'Automate your workflows with N8N',
        subtitle: 'Connect apps and services seamlessly',
      },
    },
    {
      bgColor: 'bg-[#06b6d4]',
      content: {
        type: 'analytics',
        greeting: 'Performance Analytics',
        subtitle: 'Automation Usage This Month',
      },
    },
    {
      bgColor: 'bg-[#fc4c00]',
      content: {
        type: 'projects',
        title: 'Active Workflows',
        subtitle: 'Your Automation Pipelines',
      },
    },
    {
      bgColor: 'bg-[#06b6d4]',
      content: {
        type: 'chat-history',
      },
    },
  ],
};

const defaultVideoContent: VideoContent = {
  eyebrow: 'See Automation In Action',
  title: 'Watch How We Build',
  titleHighlight: 'Powerful Workflows',
  subtitle:
    'Experience our automation process and see the intelligent N8N workflows we create for our clients.',
  videoSrc: '/media/services/n8n-automations/video/hero-video.mp4',
  ctaText: 'Start Automating',
  ctaHref: '/contact',
};

// Default workflow builder content with nodes and colors - Requirements: 2.3, 2.4
const defaultWorkflowBuilderContent: WorkflowBuilderContent = {
  eyebrow: 'Visual Builder',
  title: 'Interactive Workflow',
  titleHighlight: 'Builder',
  subtitle:
    'Design and visualize your automation workflows with our intuitive builder.',
  nodes: [
    {
      id: 'trigger-1',
      type: 'trigger',
      label: 'Webhook Trigger',
      x: 100,
      y: 200,
      connections: ['action-1'],
    },
    {
      id: 'action-1',
      type: 'action',
      label: 'Process Data',
      x: 300,
      y: 200,
      connections: ['condition-1'],
    },
    {
      id: 'condition-1',
      type: 'condition',
      label: 'Check Status',
      x: 500,
      y: 200,
      connections: ['output-1'],
    },
    {
      id: 'output-1',
      type: 'output',
      label: 'Send Email',
      x: 700,
      y: 200,
      connections: [],
    },
  ],
  nodeColors: {
    trigger: '#2563EB', // Primary Blue
    action: '#06b6d4', // Brand Blue
    condition: '#F59E0B', // Warning Amber
    output: '#06b6d4', // Brand Cyan
  },
};

// Default before/after content with process configs - Requirements: 3.1, 3.2, 3.3, 3.4
const defaultBeforeAfterContent: BeforeAfterContent = {
  eyebrow: 'Comparison',
  title: 'Manual vs',
  titleHighlight: 'Automated',
  subtitle:
    'See the dramatic difference between manual processes and automated workflows.',
  manualProcess: {
    title: 'Manual Process',
    steps: [
      { step: 1, text: 'Receive email notification', time: '5 min' },
      { step: 2, text: 'Copy data to spreadsheet', time: '10 min' },
      { step: 3, text: 'Validate information', time: '8 min' },
      { step: 4, text: 'Update CRM manually', time: '12 min' },
      { step: 5, text: 'Send confirmation email', time: '5 min' },
    ],
    totalTime: '40 minutes',
    summary: 'High error rate, manual effort',
  },
  automatedProcess: {
    title: 'Automated Process',
    steps: [
      { step: 1, text: 'Webhook receives data', time: '< 1 sec' },
      { step: 2, text: 'Auto-validate & parse', time: '< 1 sec' },
      { step: 3, text: 'Update CRM via API', time: '< 1 sec' },
      { step: 4, text: 'Send confirmation', time: '< 1 sec' },
      { step: 5, text: 'Log to analytics', time: '< 1 sec' },
    ],
    totalTime: '5 seconds',
    summary: 'Zero errors, fully automated',
  },
};

const defaultPerformanceMetricsContent: PerformanceMetricsContent = {
  eyebrow: 'Analytics',
  title: 'Performance',
  titleHighlight: 'Impact',
  subtitle:
    'Track the measurable impact of automation on your business operations.',
  metrics: [
    {
      label: 'Time Saved',
      value: '95',
      target: 95,
      unit: '%',
      color: '#fc4c00',
      icon: '⏱️',
    },
    {
      label: 'Cost Reduction',
      value: '80',
      target: 80,
      unit: '%',
      color: '#2563EB',
      icon: '💰',
    },
    {
      label: 'Error Reduction',
      value: '99',
      target: 99,
      unit: '%',
      color: '#06b6d4',
      icon: '✓',
    },
    {
      label: 'Scalability',
      value: '10',
      target: 10,
      unit: 'x',
      color: '#fc4c00',
      icon: '📈',
    },
  ],
  benefits: [
    {
      title: '24/7 Automation',
      description: 'Workflows run continuously without human intervention',
    },
    {
      title: 'Zero Human Error',
      description: 'Consistent execution eliminates manual mistakes',
    },
    {
      title: 'Instant Scalability',
      description: 'Handle 10x volume without additional resources',
    },
    {
      title: 'Real-time Monitoring',
      description: 'Track performance and identify issues instantly',
    },
  ],
  benefitsTitle: 'Key Benefits',
};

// Default API integration content with all props - Requirements: 4.1, 4.2, 4.3, 4.4
const defaultApiIntegrationContent: ApiIntegrationContent = {
  eyebrow: 'Connectivity',
  title: 'API',
  titleHighlight: 'Integration',
  subtitle: 'Connect any system with our powerful REST API integrations.',
  circleText: 'N8N',
  badgeTexts: {
    first: 'Trigger',
    second: 'Process',
    third: 'Transform',
    fourth: 'Deliver',
  },
  buttonTexts: {
    first: 'Silicon Hubs',
    second: 'Workflows',
  },
  boxTitle: 'Seamless data flow with REST API automation',
  lightColor: '#fc4c00',
};

const defaultCaseStudiesContent: CaseStudiesContent = {
  eyebrow: 'Automation Success Stories',
  title: 'Workflows That',
  titleHighlight: 'Scale',
  subtitle:
    "See how we've helped businesses automate repetitive tasks and boost efficiency.",
  studies: [
    {
      img: '/media/services/n8n-automations/case-studies/data-sync.jpg',
      title: 'Data Sync Automation',
      desc: 'Multi-system integration saving 200+ hours monthly with 95% error reduction.',
      sliderName: 'datasync',
    },
    {
      img: '/media/services/n8n-automations/case-studies/lead-processing.jpg',
      title: 'Lead Processing',
      desc: 'Automated lead qualification and routing with 450% ROI and instant response times.',
      sliderName: 'leads',
    },
    {
      img: '/media/services/n8n-automations/case-studies/report-generation.jpg',
      title: 'Report Generation',
      desc: 'Automated daily reports from 10+ data sources, saving 40 hours per week.',
      sliderName: 'reports',
    },
    {
      img: '/media/services/n8n-automations/case-studies/ecommerce-workflows.jpg',
      title: 'E-Commerce Workflows',
      desc: 'Order processing automation handling 1000+ orders daily with zero manual intervention.',
      sliderName: 'ecommerce',
    },
  ],
};

const defaultCTAContent: CTAContent = {
  eyebrow: 'Automate Everything',
  title: 'Start Your',
  titleHighlight: 'Automation',
  subtitle:
    "Let's build powerful N8N automations that save time and boost efficiency",
  ctaText: 'Start Automating',
  ctaHref: '/contact',
};

export default function N8NAutomationsPageClient() {
  // Fetch CMS content for all sections
  // Requirements: 6.1, 6.2, 6.3, 7.1
  const { content: heroContent } = useSiteContent<HeroContent>(
    'services-n8n',
    'hero'
  );
  const { content: videoContent } = useSiteContent<VideoContent>(
    'services-n8n',
    'video'
  );
  const { content: workflowBuilderContent } =
    useSiteContent<WorkflowBuilderContent>('services-n8n', 'workflowBuilder');
  const { content: beforeAfterContent } = useSiteContent<BeforeAfterContent>(
    'services-n8n',
    'beforeAfter'
  );
  const { content: performanceMetricsContent } =
    useSiteContent<PerformanceMetricsContent>(
      'services-n8n',
      'performanceMetrics'
    );
  // Requirements: 4.4 - Fetch API integration content from CMS
  const { content: apiIntegrationContent } =
    useSiteContent<ApiIntegrationContent>('services-n8n', 'apiIntegration');
  const { content: caseStudiesContent } = useSiteContent<CaseStudiesContent>(
    'services-n8n',
    'caseStudies'
  );
  const { content: ctaContent } = useSiteContent<CTAContent>(
    'services-n8n',
    'cta'
  );

  // Safe merge: preserve defaults, allow partial CMS; ensure ctaHref/ctaButton.href is always a string
  const heroMerged = withDefaults(defaultHeroContent, heroContent ?? undefined);
  const hero = {
    ...heroMerged,
    ctaButton: ensureCtaButton(defaultHeroContent.ctaButton, heroContent?.ctaButton),
  };
  const video = withDefaults(defaultVideoContent, videoContent ?? undefined, ['ctaHref']);
  const workflowBuilder =
    workflowBuilderContent ?? defaultWorkflowBuilderContent;
  const beforeAfter = beforeAfterContent ?? defaultBeforeAfterContent;
  const performanceMetrics =
    performanceMetricsContent ?? defaultPerformanceMetricsContent;
  const apiIntegration = apiIntegrationContent ?? defaultApiIntegrationContent;
  const caseStudies = caseStudiesContent ?? defaultCaseStudiesContent;
  const cta = withDefaults(defaultCTAContent, ctaContent ?? undefined, ['ctaHref']);

  return (
    <main className="min-h-screen bg-black">
      {/* Flux Card Hero Section - Uses CMS content with fallback */}
      {/* Requirements: 1.2, 1.3 - Pass cards from CMS to FluxCardHero */}
      <FluxCardHero
        title={
          <>
            <span className="text-[#06b6d4]">{hero.highlightedWord}</span>{' '}
            Automation,
            <br />
            {hero.highlightedWord2} Amplified
          </>
        }
        subtitle={hero.subtitle}
        ctaButton={{
          label: hero.ctaButton.label,
          href: hero.ctaButton.href,
        }}
        cards={hero.cards}
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

      {/* Workflow Builder Section - Uses CMS content with fallback */}
      {/* Requirements: 2.3, 2.4 - Pass nodes and colors from CMS to WorkflowBuilder */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={workflowBuilder.eyebrow}
            title={workflowBuilder.title}
            titleHighlight={workflowBuilder.titleHighlight}
            subtitle={workflowBuilder.subtitle}
          />
          <WorkflowBuilder
            initialNodes={workflowBuilder.nodes}
            nodeColors={workflowBuilder.nodeColors}
          />
        </div>
      </section>

      {/* Before/After Section - Uses CMS content with fallback */}
      {/* Requirements: 3.4 - Pass process configs from CMS to BeforeAfterSlider */}
      <section className="bg-black px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow={beforeAfter.eyebrow}
            title={beforeAfter.title}
            titleHighlight={beforeAfter.titleHighlight}
            subtitle={beforeAfter.subtitle}
          />
          <BeforeAfterSlider
            manualProcess={beforeAfter.manualProcess}
            automatedProcess={beforeAfter.automatedProcess}
          />
        </div>
      </section>

      {/* Performance Metrics Section - Uses CMS content with fallback */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow={performanceMetrics.eyebrow}
            title={performanceMetrics.title}
            titleHighlight={performanceMetrics.titleHighlight}
            subtitle={performanceMetrics.subtitle}
          />
          <PerformanceMetrics
            metrics={performanceMetrics.metrics}
            benefits={performanceMetrics.benefits}
            benefitsTitle={performanceMetrics.benefitsTitle}
          />
        </div>
      </section>

      {/* REST API Integration Section - Uses CMS content with fallback */}
      {/* Requirements: 4.1, 4.2, 4.3, 4.4 - Pass all props from CMS to DatabaseWithRestApi */}
      <section className="bg-black px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow={apiIntegration.eyebrow}
            title={apiIntegration.title}
            titleHighlight={apiIntegration.titleHighlight}
            subtitle={apiIntegration.subtitle}
          />
          <div className="flex justify-center">
            <DatabaseWithRestApi
              circleText={apiIntegration.circleText}
              title={apiIntegration.boxTitle}
              badgeTexts={apiIntegration.badgeTexts}
              buttonTexts={apiIntegration.buttonTexts}
              lightColor={apiIntegration.lightColor}
            />
          </div>
        </div>
      </section>

      {/* Automation Case Studies - Uses CMS content with fallback */}
      <ServiceCaseStudies
        eyebrow={caseStudies.eyebrow}
        title={caseStudies.title}
        titleHighlight={caseStudies.titleHighlight}
        subtitle={caseStudies.subtitle}
        caseStudies={caseStudies.studies}
      />

      {/* Tech Stack Section - Uses CMS content with fallback */}
      <StackFeatureSection page="services-n8n" />

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
