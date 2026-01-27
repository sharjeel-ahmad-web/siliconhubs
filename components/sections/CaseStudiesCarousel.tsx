'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  SliderBtnGroup,
  ProgressSlider,
  SliderBtn,
  SliderContent,
  SliderWrapper,
} from '@/components/ui/progressive-carousel';
import { SectionHeading } from '@/components/ui/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';

// Case study interface
interface CaseStudy {
  img: string;
  title: string;
  desc: string;
  sliderName: string;
}

// Default case studies for home page
const defaultHomeCaseStudies: CaseStudy[] = [
  {
    img: '/media/home/case-studies/ecommerce.jpg',
    title: 'E-Commerce Success',
    desc: 'Increased conversion rates by 45% through strategic UX redesign and performance optimization.',
    sliderName: 'ecommerce',
  },
  {
    img: '/media/home/case-studies/saas-dashboard.jpg',
    title: 'SaaS Dashboard',
    desc: 'Built a real-time analytics platform serving 10,000+ daily active users with 99.9% uptime.',
    sliderName: 'saas',
  },
  {
    img: '/media/home/case-studies/workflow-automation.jpg',
    title: 'Workflow Automation',
    desc: 'Automated 200+ hours of manual work monthly using N8N workflows and custom integrations.',
    sliderName: 'automation',
  },
  {
    img: '/media/home/case-studies/ai-chatbot.jpg',
    title: 'AI Chatbot',
    desc: 'Deployed intelligent chatbot handling 5,000+ customer queries daily with 95% satisfaction rate.',
    sliderName: 'chatbot',
  },
];

// Default case studies for portfolio page
const defaultPortfolioCaseStudies: CaseStudy[] = [
  {
    img: '/media/portfolio/case-studies/enterprise-platform.jpg',
    title: 'Enterprise Platform',
    desc: 'Built a scalable enterprise platform handling 1M+ daily transactions with 99.99% uptime.',
    sliderName: 'enterprise',
  },
  {
    img: '/media/portfolio/case-studies/mobile-app.jpg',
    title: 'Mobile App Launch',
    desc: 'Launched a mobile app achieving 100K+ downloads in the first month with 4.8 star rating.',
    sliderName: 'mobile',
  },
  {
    img: '/media/portfolio/case-studies/ai-integration.jpg',
    title: 'AI Integration',
    desc: 'Integrated AI-powered features reducing manual processing time by 85% across operations.',
    sliderName: 'ai',
  },
  {
    img: '/media/portfolio/case-studies/digital-transformation.jpg',
    title: 'Digital Transformation',
    desc: 'Led complete digital transformation resulting in 200% increase in online engagement.',
    sliderName: 'digital',
  },
];

interface CaseStudiesSectionContent {
  eyebrow?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  studies?: CaseStudy[];
}

interface CaseStudiesCarouselProps {
  page?: 'home' | 'portfolio';
  /** When provided (e.g. portfolio static data), no useSiteContent fetch is made. */
  sectionContent?: CaseStudiesSectionContent | null;
  /** When provided with sectionContent, used as the case studies list. */
  caseStudies?: CaseStudy[];
}

export default function CaseStudiesCarousel({
  page = 'home',
  sectionContent: sectionContentProp,
  caseStudies: caseStudiesProp,
}: CaseStudiesCarouselProps) {
  const hasStatic = sectionContentProp !== undefined && caseStudiesProp !== undefined;
  const contentPage = page === 'portfolio' ? 'home' : page;
  const { content: apiContent } = useSiteContent<CaseStudiesSectionContent>(
    hasStatic ? 'home' : contentPage,
    'caseStudies'
  );

  const defaultCaseStudies =
    page === 'portfolio' ? defaultPortfolioCaseStudies : defaultHomeCaseStudies;

  const sectionContent = sectionContentProp ?? apiContent;
  const caseStudies = caseStudiesProp ?? sectionContent?.studies ?? defaultCaseStudies;

  const eyebrow = sectionContent?.eyebrow ?? 'Case Studies';
  const title = sectionContent?.title ?? 'Results That';
  const titleHighlight = sectionContent?.titleHighlight ?? 'Speak';
  const subtitle =
    sectionContent?.subtitle ??
    "Real projects, real impact. See how we've helped businesses transform their digital presence.";

  return (
    <section className="relative overflow-hidden bg-black px-4 pb-16 pt-12 sm:px-6 md:pb-24 md:pt-16 lg:px-8">
      <div className="container relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          {/* Badge - responsive */}
          <motion.div
            className="mb-4 flex justify-center sm:mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.15] bg-white/[0.08] px-4 py-2 text-xs backdrop-blur-sm sm:gap-3 sm:px-5 sm:text-sm"
              whileHover={{
                scale: 1.05,
                borderColor: 'rgba(255, 255, 255, 0.3)',
              }}
            >
              <span className="font-medium text-white/80">{eyebrow}</span>
            </motion.div>
          </motion.div>

          {/* Heading - responsive */}
          <h2 className="mb-3 text-center text-3xl font-bold sm:mb-4 sm:text-4xl md:mb-6 md:text-5xl">
            <span className="text-white">{title} </span>
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #37AFE1, #F58122, #37AFE1, #F58122)',
                backgroundSize: '300% 100%',
                animation: 'gradient-shift 4s ease-in-out infinite',
              }}
            >
              {titleHighlight}
            </span>
          </h2>

          {/* Description - responsive */}
          <p className="mx-auto mb-8 max-w-3xl text-center text-base text-gray-400 sm:mb-10 sm:text-lg md:mb-12 md:text-xl">
            {subtitle}
          </p>
        </div>

        {/* Carousel */}
        <ProgressSlider
          vertical={false}
          activeSlider={caseStudies[0]?.sliderName || 'ecommerce'}
          duration={5000}
        >
          <SliderContent>
            {caseStudies.map((item, index) => (
              <SliderWrapper key={index} value={item.sliderName}>
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    className="h-[400px] w-full rounded-2xl object-cover md:h-[500px]"
                    src={item.img}
                    width={1200}
                    height={600}
                    alt={item.title}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
              </SliderWrapper>
            ))}
          </SliderContent>

          <SliderBtnGroup className="absolute bottom-0 left-0 right-0 grid grid-cols-2 overflow-hidden rounded-b-2xl border-t border-white/10 bg-black/60 backdrop-blur-xl md:grid-cols-4">
            {caseStudies.map((item, index) => (
              <SliderBtn
                key={index}
                value={item.sliderName}
                className="cursor-pointer border-r border-white/10 p-4 text-left transition-all last:border-r-0 hover:bg-white/5 md:p-5"
                progressBarClass="bg-gradient-to-r from-[#F58122] to-[#37AFE1] h-full"
              >
                <h3 className="relative mb-2 inline-flex items-center gap-2 rounded-full bg-[#F58122] px-3 py-1 text-xs font-semibold text-white">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  {item.title}
                </h3>
                <p className="line-clamp-2 text-sm font-medium text-white/80">
                  {item.desc}
                </p>
              </SliderBtn>
            ))}
          </SliderBtnGroup>
        </ProgressSlider>
      </div>

      {/* Add gradient-shift animation */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </section>
  );
}
