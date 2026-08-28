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
  const hasStatic =
    sectionContentProp !== undefined && caseStudiesProp !== undefined;

  const contentPage = page === 'portfolio' ? 'home' : page;

  const { content: apiContent } = useSiteContent<CaseStudiesSectionContent>(
    hasStatic ? 'home' : contentPage,
    'caseStudies'
  );

  const defaultCaseStudies =
    page === 'portfolio'
      ? defaultPortfolioCaseStudies
      : defaultHomeCaseStudies;

  const sectionContent = sectionContentProp ?? apiContent;

  const caseStudies =
    caseStudiesProp ?? sectionContent?.studies ?? defaultCaseStudies;

  // Text content remains exactly the same
  const eyebrow = sectionContent?.eyebrow ?? 'Case Studies';

  const title = sectionContent?.title ?? 'Results That';

  const titleHighlight = sectionContent?.titleHighlight ?? 'Speak';

  const subtitle =
    sectionContent?.subtitle ??
    "Real projects, real impact. See how we've helped businesses transform their digital presence.";

  return (
    <section className="relative overflow-hidden bg-[#fff3e8] px-4 pb-16 pt-14 sm:px-6 md:pb-24 md:pt-20 lg:px-8">
      {/* ================= Background Effects ================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top Left Orange Glow */}
        <div className="absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-[#fc4c00]/10 blur-[140px]" />

        {/* Bottom Right Peach Glow */}
        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-[#ff9e5c]/20 blur-[160px]" />

        {/* Center White Glow */}
        <div className="absolute left-1/2 top-1/3 h-[350px] w-[550px] -translate-x-1/2 rounded-full bg-white/70 blur-[150px]" />

        {/* Premium Subtle Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(#0a192f 1px, transparent 1px), linear-gradient(90deg, #0a192f 1px, transparent 1px)',
            backgroundSize: '55px 55px',
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl">
        {/* ================= Section Header ================= */}
        <motion.div
          className="mb-10 text-center sm:mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {/* Badge */}
          <motion.div
            className="mb-5 flex justify-center sm:mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center gap-3 rounded-full border border-[#fc4c00]/15 bg-white/80 px-5 py-2.5 text-xs shadow-lg shadow-[#fc4c00]/5 backdrop-blur-xl sm:text-sm"
              whileHover={{
                scale: 1.04,
                borderColor: 'rgba(252, 76, 0, 0.35)',
              }}
            >
              <span className="font-semibold tracking-wide text-[#0a192f]/80">
                {eyebrow}
              </span>

              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-70" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b981]" />
              </span>
            </motion.div>
          </motion.div>

          {/* Heading */}
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl md:mb-5 md:text-5xl">
            <span className="text-[#0a192f]">{title} </span>

            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #fc4c00, #ff9e5c, #fc4c00)',
                backgroundSize: '300% 100%',
                animation: 'gradient-shift 4s ease-in-out infinite',
              }}
            >
              {titleHighlight}
            </span>
          </h2>

          {/* Decorative Line */}
          <div className="mx-auto mb-5 h-1 w-20 rounded-full bg-gradient-to-r from-[#fc4c00] to-[#ff9e5c]" />

          {/* Description */}
          <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-[#0a192f]/65 sm:text-lg md:text-xl">
            {subtitle}
          </p>
        </motion.div>

        {/* ================= Carousel ================= */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Outer Premium Glow */}
          <div className="absolute -inset-3 rounded-[30px] bg-gradient-to-br from-[#fc4c00]/10 via-transparent to-[#ff9e5c]/15 blur-2xl" />

          {/* Carousel Card */}
          <div className="relative overflow-hidden rounded-[26px] border border-white/80 bg-white/70 p-2 shadow-[0_20px_60px_rgba(10,25,47,0.12)] backdrop-blur-xl sm:p-3">
            <ProgressSlider
              vertical={false}
              activeSlider={caseStudies[0]?.sliderName || 'ecommerce'}
              duration={5000}
            >
              <SliderContent>
                {caseStudies.map((item, index) => (
                  <SliderWrapper key={index} value={item.sliderName}>
                    <div className="group relative overflow-hidden rounded-[20px] bg-[#0a192f]">
                      {/* Image */}
                      <Image
                        className="h-[380px] w-full rounded-[20px] object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[430px] md:h-[500px]"
                        src={item.img}
                        width={1200}
                        height={600}
                        alt={item.title}
                        priority={index === 0}
                      />

                      {/* Premium Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/90 via-[#0a192f]/30 to-transparent" />

                      {/* Warm Orange Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#fc4c00]/25 via-transparent to-transparent opacity-60" />

                      {/* Subtle Top Shine */}
                      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/10 to-transparent" />
                    </div>
                  </SliderWrapper>
                ))}
              </SliderContent>

              {/* ================= Slider Buttons ================= */}
              <SliderBtnGroup className="relative mt-2 grid grid-cols-1 overflow-hidden rounded-[18px] border border-[#0a192f]/5 bg-[#fffaf6]/90 shadow-inner backdrop-blur-xl sm:grid-cols-2 md:grid-cols-4">
                {caseStudies.map((item, index) => (
                  <SliderBtn
                    key={index}
                    value={item.sliderName}
                    className="group relative cursor-pointer border-b border-[#0a192f]/5 p-5 text-left transition-all duration-300 last:border-b-0 hover:bg-white md:border-b-0 md:border-r md:p-5 md:last:border-r-0"
                    progressBarClass="h-1 bg-gradient-to-r from-[#fc4c00] via-[#ff9e5c] to-[#fc4c00]"
                  >
                    {/* Hover Glow */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#fc4c00]/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="relative z-10">
                      {/* Project Title */}
                      <h3 className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#fc4c00]/10 bg-[#fc4c00] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-transform duration-300 group-hover:scale-[1.03]">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />

                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="line-clamp-2 text-sm font-medium leading-relaxed text-[#0a192f]/65 transition-colors duration-300 group-hover:text-[#0a192f]/80">
                        {item.desc}
                      </p>
                    </div>
                  </SliderBtn>
                ))}
              </SliderBtnGroup>
            </ProgressSlider>
          </div>
        </motion.div>
      </div>

      {/* Gradient Animation */}
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
