'use client';

import Image from 'next/image';
import {
  SliderBtnGroup,
  ProgressSlider,
  SliderBtn,
  SliderContent,
  SliderWrapper,
} from '@/components/ui/progressive-carousel';
import { SectionHeading } from '@/components/ui/section-heading';

export interface CaseStudy {
  img: string;
  title: string;
  desc: string;
  sliderName: string;
}

interface ServiceCaseStudiesProps {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  subtitle: string;
  caseStudies: CaseStudy[];
  duration?: number;
}

export default function ServiceCaseStudies({
  eyebrow = 'Case Studies',
  title = 'Results That',
  titleHighlight = 'Speak',
  subtitle,
  caseStudies,
  duration = 5000,
}: ServiceCaseStudiesProps) {
  if (!caseStudies || caseStudies.length === 0) return null;

  return (
    <section className="bg-black py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          titleHighlight={titleHighlight}
          subtitle={subtitle}
        />

        {/* Carousel */}
        <ProgressSlider
          vertical={false}
          activeSlider={caseStudies[0].sliderName}
          duration={duration}
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
    </section>
  );
}
