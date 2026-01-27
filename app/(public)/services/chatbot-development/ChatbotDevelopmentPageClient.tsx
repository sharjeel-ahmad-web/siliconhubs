'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import {
  ChatInterface,
  LearningAnimation,
  AccuracyChart,
} from '@/components/services/chatbot';
import {
  FloatingIconsHero,
  type FloatingIconsHeroProps,
} from '@/components/ui/floating-icons-hero';
import { SectionHeading } from '@/components/ui/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';
import { withDefaults } from '@/lib/cms-content';
import SectionWrapper from '@/components/sections/SectionWrapper';

const StackFeatureSection = dynamic(
  () => import('@/components/ui/stack-feature-section'),
  {
    ssr: false,
    loading: () => <div className="h-96" />,
  }
);

const ServiceVideoSection = dynamic(
  () => import('@/components/sections/ServiceVideoSection'),
  {
    ssr: false,
  }
);

// Custom SVG Icons for messaging/AI platforms
const IconWhatsApp = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
      fill="#25D366"
    />
  </svg>
);

const IconSlack = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
      fill="#E01E5A"
    />
  </svg>
);

const IconDiscord = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
      fill="#5865F2"
    />
  </svg>
);

const IconTelegram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
      fill="#0088cc"
    />
  </svg>
);

const IconMessenger = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"
      fill="url(#messenger-gradient)"
    />
    <defs>
      <linearGradient id="messenger-gradient" x1="0" y1="24" x2="24" y2="0">
        <stop stopColor="#0099FF" />
        <stop offset="1" stopColor="#A033FF" />
      </linearGradient>
    </defs>
  </svg>
);

const IconOpenAI = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"
      fill="#10A37F"
    />
  </svg>
);

const IconMicrosoft = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11.4 2H2v9.4h9.4V2Z" fill="#F25022" />
    <path d="M22 2h-9.4v9.4H22V2Z" fill="#7FBA00" />
    <path d="M11.4 12.6H2V22h9.4V12.6Z" fill="#00A4EF" />
    <path d="M22 12.6h-9.4V22H22V12.6Z" fill="#FFB900" />
  </svg>
);

const IconGoogle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const IconZendesk = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.088 3v13.092L1.2 3h9.888zm1.824 4.908V21L22.8 7.908h-9.888zM1.2 21c0-2.736 2.208-4.956 4.944-4.956S11.088 18.264 11.088 21H1.2zm11.712-13.092c0 2.736 2.208 4.956 4.944 4.956S22.8 10.644 22.8 7.908h-9.888z"
      fill="#03363D"
    />
  </svg>
);

const IconIntercom = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.5 6h3v9h-3V6zm-4.5 3h3v6h-3V9zm12 0h3v6h-3V9zm-3-1.5h3v7.5h-3V7.5z"
      fill="#1F8DED"
    />
  </svg>
);

const IconBot = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 011 1v3a1 1 0 01-1 1h-1v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1H2a1 1 0 01-1-1v-3a1 1 0 011-1h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zM7.5 13a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm9 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
      fill="#37AFE1"
    />
  </svg>
);

import ServiceCaseStudies from '@/components/sections/ServiceCaseStudies';
import ServiceCTA from '@/components/sections/ServiceCTA';

// Define interfaces for CMS content types
interface HeroContent {
  titleHighlight: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
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

interface ChatDemoContent extends SectionHeadingContent {
  initialMessage?: string;
  inputPlaceholder?: string;
  sendButtonText?: string;
  typingIndicatorText?: string;
  aiResponses?: string[];
  userMessageColor?: string;
  aiMessageColor?: string;
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
  titleHighlight: 'AI-Powered',
  title: 'Chatbots',
  subtitle:
    'Intelligent conversational AI that connects with your customers 24/7 across all platforms. From WhatsApp to Slack, we build chatbots that convert.',
  ctaText: 'Build Your Chatbot',
  ctaHref: '/contact',
};

const defaultVideoContent: VideoContent = {
  eyebrow: 'See AI In Action',
  title: 'Watch How We Build',
  titleHighlight: 'Intelligent Chatbots',
  subtitle:
    'Experience our AI development process and see the conversational bots we create for our clients.',
  videoSrc: '/media/services/chatbot-development/video/hero-video.mp4',
  ctaText: 'Build Your Chatbot',
  ctaHref: '/contact',
};

const defaultChatDemoContent: ChatDemoContent = {
  eyebrow: 'Interactive Demo',
  title: 'Live Chat',
  titleHighlight: 'Demo',
  subtitle:
    'Experience our AI chatbot in action with this interactive demonstration.',
  initialMessage: "Hello! I'm an AI assistant. How can I help you today?",
  inputPlaceholder: 'Type your message...',
  sendButtonText: 'Send',
  typingIndicatorText: 'AI is typing...',
  aiResponses: [
    "That's a great question! Let me help you with that.",
    "I understand. Here's what I can tell you...",
    'Interesting! Based on my analysis...',
    "I'd be happy to assist you with that.",
    'Let me process that information for you.',
  ],
  userMessageColor: '#2563EB',
  aiMessageColor: '#37AFE1',
};

const defaultLearningAnimationContent: SectionHeadingContent = {
  eyebrow: 'Neural Networks',
  title: 'AI Learning',
  titleHighlight: 'Process',
  subtitle:
    'See how our neural networks process and understand your conversations.',
};

interface MetricConfig {
  label: string;
  color: string;
  prefix?: string;
  suffix?: string;
  value?: string;
}

interface ChartConfig {
  xAxisLabel: string;
  yAxisLabel: string;
  lineColor: string;
  gridColor: string;
}

interface AccuracyChartContent extends SectionHeadingContent {
  metrics?: MetricConfig[];
  chartConfig?: ChartConfig;
}

const defaultAccuracyChartContent: AccuracyChartContent = {
  eyebrow: 'Analytics',
  title: 'Performance',
  titleHighlight: 'Improvement',
  subtitle: 'Track the continuous improvement of your AI chatbot over time.',
  metrics: [
    { label: 'Current Accuracy', color: '#37AFE1', suffix: '%' },
    { label: 'Improvement', color: '#F97316', prefix: '+', suffix: '%' },
    { label: 'Training Epochs', color: '#31A4DB', suffix: '' },
    { label: 'Response Time', color: '#2563EB', value: '<100ms' },
  ],
  chartConfig: {
    xAxisLabel: 'Training Epochs',
    yAxisLabel: 'Accuracy (%)',
    lineColor: '#37AFE1',
    gridColor: '#64748B',
  },
};

const defaultCaseStudiesContent: CaseStudiesContent = {
  eyebrow: 'AI Chatbot Success Stories',
  title: 'Chatbots That',
  titleHighlight: 'Engage',
  subtitle:
    "See how we've helped businesses automate conversations and delight customers 24/7.",
  studies: [
    {
      img: '/media/services/chatbot-development/case-studies/customer-support-bot.jpg',
      title: 'Customer Support Bot',
      desc: 'AI chatbot handling 5,000+ queries daily with 95% satisfaction rate and 80% faster response.',
      sliderName: 'support',
    },
    {
      img: '/media/services/chatbot-development/case-studies/sales-assistant.jpg',
      title: 'Sales Assistant',
      desc: 'Conversational AI that increased qualified leads by 150% and reduced sales cycle by 30%.',
      sliderName: 'sales',
    },
    {
      img: '/media/services/chatbot-development/case-studies/whatsapp-commerce.jpg',
      title: 'WhatsApp Commerce',
      desc: 'End-to-end shopping experience on WhatsApp with 40% conversion rate improvement.',
      sliderName: 'whatsapp',
    },
    {
      img: '/media/services/chatbot-development/case-studies/internal-knowledge-bot.jpg',
      title: 'Internal Knowledge Bot',
      desc: 'Enterprise chatbot reducing HR queries by 70% and improving employee onboarding.',
      sliderName: 'internal',
    },
  ],
};

const defaultCTAContent: CTAContent = {
  eyebrow: 'Ready to Automate?',
  title: 'Build Your AI',
  titleHighlight: 'Chatbot',
  subtitle:
    "Let's create an intelligent chatbot that engages your customers 24/7",
  ctaText: 'Start Your Project',
  ctaHref: '/contact',
};

// Define the icons with their unique positions (icons are defined in component as they require React components)
const chatbotIcons: FloatingIconsHeroProps['icons'] = [
  { id: 1, icon: IconWhatsApp, className: 'top-[12%] left-[8%]' },
  { id: 2, icon: IconSlack, className: 'top-[18%] right-[10%]' },
  { id: 3, icon: IconDiscord, className: 'top-[75%] left-[12%]' },
  { id: 4, icon: IconTelegram, className: 'bottom-[15%] right-[8%]' },
  { id: 5, icon: IconMessenger, className: 'top-[8%] left-[28%]' },
  { id: 6, icon: IconOpenAI, className: 'top-[10%] right-[28%]' },
  { id: 7, icon: IconMicrosoft, className: 'bottom-[12%] left-[25%]' },
  { id: 8, icon: IconGoogle, className: 'top-[38%] left-[5%]' },
  { id: 9, icon: IconZendesk, className: 'top-[70%] right-[20%]' },
  { id: 10, icon: IconIntercom, className: 'bottom-[8%] left-[55%]' },
  { id: 11, icon: IconBot, className: 'top-[45%] right-[6%]' },
  { id: 12, icon: IconBot, className: 'top-[55%] left-[8%]' },
];

export default function ChatbotDevelopmentPageClient() {
  // Fetch CMS content for all sections
  // Requirements: 1.2, 1.3, 1.4, 7.1
  const { content: heroContent } = useSiteContent<HeroContent>(
    'services-chatbot',
    'hero'
  );
  const { content: videoContent } = useSiteContent<VideoContent>(
    'services-chatbot',
    'video'
  );
  const { content: chatDemoContent } = useSiteContent<ChatDemoContent>(
    'services-chatbot',
    'chatDemo'
  );
  const { content: learningAnimationContent } =
    useSiteContent<SectionHeadingContent>(
      'services-chatbot',
      'learningAnimation'
    );
  const { content: accuracyChartContent } =
    useSiteContent<AccuracyChartContent>('services-chatbot', 'accuracyChart');
  const { content: caseStudiesContent } = useSiteContent<CaseStudiesContent>(
    'services-chatbot',
    'caseStudies'
  );
  const { content: ctaContent } = useSiteContent<CTAContent>(
    'services-chatbot',
    'cta'
  );

  // Safe merge: preserve defaults, allow partial CMS overrides, ensure ctaHref is NEVER undefined
  // Using withDefaults with explicit linkFieldKeys to guarantee href fields are always valid strings
  const hero = withDefaults(defaultHeroContent, heroContent ?? undefined, ['ctaHref']);
  const video = withDefaults(defaultVideoContent, videoContent ?? undefined, ['ctaHref']);
  const chatDemo = chatDemoContent ?? defaultChatDemoContent;
  const learningAnimation =
    learningAnimationContent ?? defaultLearningAnimationContent;
  const accuracyChart = accuracyChartContent ?? defaultAccuracyChartContent;
  const caseStudies = caseStudiesContent ?? defaultCaseStudiesContent;
  const cta = withDefaults(defaultCTAContent, ctaContent ?? undefined, ['ctaHref']);

  // Reset scroll position on mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-black">
      {/* Floating Icons Hero Section - Uses CMS content with fallback */}
      <SectionWrapper page="services-chatbot" section="hero">
        <FloatingIconsHero
          titleHighlight={hero.titleHighlight}
          title={hero.title}
          subtitle={hero.subtitle}
          ctaText={hero.ctaText}
          ctaHref={hero.ctaHref}
          icons={chatbotIcons}
        />
      </SectionWrapper>

      {/* Video Section - Uses CMS content with fallback */}
      <SectionWrapper page="services-chatbot" section="video">
        <ServiceVideoSection
          eyebrow={video.eyebrow}
          title={video.title}
          titleHighlight={video.titleHighlight}
          subtitle={video.subtitle}
          videoSrc={video.videoSrc}
          ctaText={video.ctaText}
          ctaHref={video.ctaHref}
        />
      </SectionWrapper>

      {/* Chat Demo Section - Uses CMS content with fallback */}
      <SectionWrapper page="services-chatbot" section="chatDemo">
        <section className="bg-black px-6 py-24">
          <div className="mx-auto max-w-4xl">
            <SectionHeading
              eyebrow={chatDemo.eyebrow}
              title={chatDemo.title}
              titleHighlight={chatDemo.titleHighlight}
              subtitle={chatDemo.subtitle}
            />
            <ChatInterface
              initialMessage={chatDemo.initialMessage}
              inputPlaceholder={chatDemo.inputPlaceholder}
              sendButtonText={chatDemo.sendButtonText}
              typingIndicatorText={chatDemo.typingIndicatorText}
              aiResponses={chatDemo.aiResponses}
              userMessageColor={chatDemo.userMessageColor}
              aiMessageColor={chatDemo.aiMessageColor}
            />
          </div>
        </section>
      </SectionWrapper>

      {/* Learning Animation Section - Uses CMS content with fallback */}
      <SectionWrapper page="services-chatbot" section="learningAnimation">
        <section className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow={learningAnimation.eyebrow}
              title={learningAnimation.title}
              titleHighlight={learningAnimation.titleHighlight}
              subtitle={learningAnimation.subtitle}
            />
            <LearningAnimation />
          </div>
        </section>
      </SectionWrapper>

      {/* Accuracy Chart Section - Uses CMS content with fallback */}
      <SectionWrapper page="services-chatbot" section="accuracyChart">
        <section className="bg-black px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow={accuracyChart.eyebrow}
              title={accuracyChart.title}
              titleHighlight={accuracyChart.titleHighlight}
              subtitle={accuracyChart.subtitle}
            />
            <AccuracyChart
              metrics={accuracyChart.metrics}
              chartConfig={accuracyChart.chartConfig}
            />
          </div>
        </section>
      </SectionWrapper>

      {/* Chatbot Case Studies - Uses CMS content with fallback */}
      <SectionWrapper page="services-chatbot" section="caseStudies">
        <ServiceCaseStudies
          eyebrow={caseStudies.eyebrow}
          title={caseStudies.title}
          titleHighlight={caseStudies.titleHighlight}
          subtitle={caseStudies.subtitle}
          caseStudies={caseStudies.studies}
        />
      </SectionWrapper>

      {/* Tech Stack Section - Uses CMS content with fallback */}
      <SectionWrapper page="services-chatbot" section="techStack">
        <StackFeatureSection page="services-chatbot" />
      </SectionWrapper>

      {/* CTA Section with Social Links - Uses CMS content with fallback */}
      <SectionWrapper page="services-chatbot" section="cta">
        <ServiceCTA
          eyebrow={cta.eyebrow}
          title={cta.title}
          titleHighlight={cta.titleHighlight}
          subtitle={cta.subtitle}
          ctaText={cta.ctaText}
          ctaLink={cta.ctaHref}
        />
      </SectionWrapper>
    </main>
  );
}
