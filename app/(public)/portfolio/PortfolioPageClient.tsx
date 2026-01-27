'use client';

/**
 * Portfolio page: single data owner (Option B).
 * - All data from static file @/data/portfolio only. No useSiteContent, fetch, or useEffect for content.
 * - Data is passed down to children as props. Layouts and providers do not own portfolio data.
 */
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import TagCloud from '@/components/portfolio/TagCloud';
import ProjectCard from '@/components/portfolio/ProjectCard';
import ProjectDetail from '@/components/portfolio/ProjectDetail';
import PortfolioFeatures from '@/components/sections/PortfolioFeatures';
import CaseStudiesCarousel from '@/components/sections/CaseStudiesCarousel';
import MiniCTA from '@/components/sections/MiniCTA';
import { ImageAccordionHero } from '@/components/ui/interactive-image-accordion';
import { SectionHeading } from '@/components/ui/section-heading';
import {
  portfolioProjects,
  portfolioHero,
  portfolioFilters,
  portfolioGrid,
  portfolioCta,
  portfolioCaseStudies,
  portfolioCaseStudiesSection,
  portfolioFeaturedWork,
  portfolioFeaturedSlides,
  portfolioAdvantages,
  type PortfolioProject,
} from '@/data/portfolio';

// Use dynamic import with ssr: false to completely skip server rendering of the carousel
// This avoids hydration mismatches because the server renders nothing (null)
// and the client renders the full component after JS loads
const FeaturedProjectsCarousel = dynamic(
  () => import('@/components/sections/FeaturedProjectsCarousel'),
  { ssr: false }
);

export default function PortfolioPageClient() {
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  return (
    <div className="min-h-screen bg-black text-white">
      <ImageAccordionHero
        title={portfolioHero.title}
        titleHighlight={portfolioHero.titleHighlight}
        subtitle={portfolioHero.subtitle}
        ctaButton={{
          label: portfolioHero.ctaLabel,
          href: portfolioHero.ctaHref,
        }}
        items={portfolioHero.heroItems}
      />

      {/* Dynamic import with ssr:false - renders nothing on server, full carousel on client */}
      <FeaturedProjectsCarousel
        content={portfolioFeaturedWork}
        slides={portfolioFeaturedSlides}
      />

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={portfolioFilters.eyebrow}
            title={portfolioFilters.title}
            titleHighlight={portfolioFilters.titleHighlight}
            subtitle={portfolioFilters.subtitle}
          />
          <TagCloud tags={portfolioFilters.tags} />
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={portfolioGrid.eyebrow}
            title={portfolioGrid.title}
            titleHighlight={portfolioGrid.titleHighlight}
            subtitle={portfolioGrid.subtitle}
          />
          <motion.div
            layout
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {portfolioProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                >
                  <div>
                    <ProjectCard
                      project={project}
                      onClick={() => setSelectedProject(project)}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <CaseStudiesCarousel
        page="portfolio"
        sectionContent={portfolioCaseStudiesSection}
        caseStudies={portfolioCaseStudies}
      />

      <PortfolioFeatures content={portfolioAdvantages} />

      <MiniCTA
        eyebrow={portfolioCta.eyebrow}
        title={portfolioCta.title}
        titleHighlight={portfolioCta.titleHighlight}
        subtitle={portfolioCta.subtitle}
        ctaText={portfolioCta.ctaText}
        ctaLink={portfolioCta.ctaLink}
      />

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            key={selectedProject.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProjectDetail
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
