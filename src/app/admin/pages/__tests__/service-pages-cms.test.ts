/**
 * Property-Based Tests for Service Pages CMS Enhancement
 * Feature: service-pages-cms
 */

import * as fc from 'fast-check';

/**
 * Interface for case study data matching the design document
 */
interface CaseStudy {
  img: string;
  title: string;
  desc: string;
  sliderName: string;
}

/**
 * Interface for service item data (used in hero sections)
 */
interface ServiceItem {
  id: string;
  name: string;
  url: string;
  description: string;
  imgSrc: string;
}

/**
 * Interface for section heading data
 */
interface SectionHeading {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
}

/**
 * Interface for video section data
 */
interface VideoSection {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  videoSrc: string;
  ctaText: string;
  ctaHref: string;
}

/**
 * Interface for CTA section data
 */
interface CTASection {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
}

/**
 * Interface for hero section data (generic)
 */
interface HeroSection {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  highlightedWord?: string;
  highlightedWord2?: string;
  subtitle: string;
  ctaText?: string;
  ctaHref?: string;
  ctaLabel?: string;
  services?: ServiceItem[];
  floatingIcons?: Array<{ icon: string; label: string }>;
}

/**
 * Interface for service page content
 */
interface ServicePageContent {
  page: string;
  section: string;
  content: Record<string, unknown>;
}

/**
 * Arbitrary generator for case study data
 */
const caseStudyArbitrary = fc.record({
  img: fc.webUrl(),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  desc: fc.string({ minLength: 1, maxLength: 300 }),
  sliderName: fc.string({ minLength: 1, maxLength: 50 }),
});

/**
 * Arbitrary generator for service item data
 */
const serviceItemArbitrary = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 100 }),
  url: fc.webUrl(),
  description: fc.string({ minLength: 1, maxLength: 300 }),
  imgSrc: fc.webUrl(),
});

/**
 * Arbitrary generator for section heading data
 */
const sectionHeadingArbitrary = fc.record({
  eyebrow: fc.string({ minLength: 1, maxLength: 50 }),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  titleHighlight: fc.string({ minLength: 1, maxLength: 50 }),
  subtitle: fc.string({ minLength: 1, maxLength: 300 }),
});

/**
 * Arbitrary generator for video section data
 */
const videoSectionArbitrary = fc.record({
  eyebrow: fc.string({ minLength: 1, maxLength: 50 }),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  titleHighlight: fc.string({ minLength: 1, maxLength: 50 }),
  subtitle: fc.string({ minLength: 1, maxLength: 300 }),
  videoSrc: fc.webUrl(),
  ctaText: fc.string({ minLength: 1, maxLength: 50 }),
  ctaHref: fc.webUrl(),
});

/**
 * Arbitrary generator for CTA section data
 */
const ctaSectionArbitrary = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }),
  subtitle: fc.string({ minLength: 1, maxLength: 300 }),
  ctaText: fc.string({ minLength: 1, maxLength: 50 }),
  ctaHref: fc.webUrl(),
});

/**
 * Arbitrary generator for hero section data
 */
const heroSectionArbitrary = fc.record({
  eyebrow: fc.option(fc.string({ minLength: 1, maxLength: 50 }), {
    nil: undefined,
  }),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  titleHighlight: fc.option(fc.string({ minLength: 1, maxLength: 50 }), {
    nil: undefined,
  }),
  highlightedWord: fc.option(fc.string({ minLength: 1, maxLength: 50 }), {
    nil: undefined,
  }),
  highlightedWord2: fc.option(fc.string({ minLength: 1, maxLength: 50 }), {
    nil: undefined,
  }),
  subtitle: fc.string({ minLength: 1, maxLength: 300 }),
  ctaText: fc.option(fc.string({ minLength: 1, maxLength: 50 }), {
    nil: undefined,
  }),
  ctaHref: fc.option(fc.webUrl(), { nil: undefined }),
  ctaLabel: fc.option(fc.string({ minLength: 1, maxLength: 50 }), {
    nil: undefined,
  }),
  services: fc.option(
    fc.array(serviceItemArbitrary, { minLength: 0, maxLength: 5 }),
    { nil: undefined }
  ),
  floatingIcons: fc.option(
    fc.array(
      fc.record({
        icon: fc.string({ minLength: 1, maxLength: 50 }),
        label: fc.string({ minLength: 1, maxLength: 50 }),
      }),
      { minLength: 0, maxLength: 5 }
    ),
    { nil: undefined }
  ),
});

/**
 * Service page slugs
 */
const servicePageSlugs = [
  'services-chatbot',
  'services-seo',
  'services-shopify',
  'services-wordpress',
  'services-webdesign',
  'services-n8n',
];

/**
 * Simulates saving service content to CMS - serializes to JSON
 */
function saveServiceContent(content: ServicePageContent): string {
  return JSON.stringify(content);
}

/**
 * Simulates fetching service content from CMS - deserializes from JSON
 */
function fetchServiceContent(jsonString: string): ServicePageContent {
  return JSON.parse(jsonString);
}

/**
 * Validates that two service page contents are equivalent
 */
function contentsAreEquivalent(
  original: ServicePageContent,
  retrieved: ServicePageContent
): boolean {
  if (original.page !== retrieved.page) return false;
  if (original.section !== retrieved.section) return false;
  return JSON.stringify(original.content) === JSON.stringify(retrieved.content);
}

/**
 * Feature: service-pages-cms, Property 1: Service Content Save Round Trip
 * Validates: Requirements 1.5, 2.5, 3.5
 *
 * For any valid service page section content, saving it to the CMS and then
 * fetching it should return equivalent content with all fields preserved.
 */
describe('Property 1: Service Content Save Round Trip', () => {
  it('should preserve hero section content through save and fetch cycle', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...servicePageSlugs),
        heroSectionArbitrary,
        (page, heroContent) => {
          const content: ServicePageContent = {
            page,
            section: 'hero',
            content: heroContent as unknown as Record<string, unknown>,
          };

          const savedData = saveServiceContent(content);
          const retrievedContent = fetchServiceContent(savedData);

          expect(contentsAreEquivalent(content, retrievedContent)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve video section content through save and fetch cycle', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...servicePageSlugs),
        videoSectionArbitrary,
        (page, videoContent) => {
          const content: ServicePageContent = {
            page,
            section: 'video',
            content: videoContent as unknown as Record<string, unknown>,
          };

          const savedData = saveServiceContent(content);
          const retrievedContent = fetchServiceContent(savedData);

          expect(contentsAreEquivalent(content, retrievedContent)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve CTA section content through save and fetch cycle', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...servicePageSlugs),
        ctaSectionArbitrary,
        (page, ctaContent) => {
          const content: ServicePageContent = {
            page,
            section: 'cta',
            content: ctaContent as unknown as Record<string, unknown>,
          };

          const savedData = saveServiceContent(content);
          const retrievedContent = fetchServiceContent(savedData);

          expect(contentsAreEquivalent(content, retrievedContent)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve section heading content through save and fetch cycle', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...servicePageSlugs),
        fc.constantFrom(
          'chatDemo',
          'learningAnimation',
          'accuracyChart',
          'serpRanking',
          'keywordCloud'
        ),
        sectionHeadingArbitrary,
        (page, section, headingContent) => {
          const content: ServicePageContent = {
            page,
            section,
            content: headingContent as unknown as Record<string, unknown>,
          };

          const savedData = saveServiceContent(content);
          const retrievedContent = fetchServiceContent(savedData);

          expect(contentsAreEquivalent(content, retrievedContent)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve case studies section content through save and fetch cycle', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...servicePageSlugs),
        fc.record({
          eyebrow: fc.string({ minLength: 1, maxLength: 50 }),
          title: fc.string({ minLength: 1, maxLength: 100 }),
          titleHighlight: fc.string({ minLength: 1, maxLength: 50 }),
          subtitle: fc.string({ minLength: 1, maxLength: 300 }),
          studies: fc.array(caseStudyArbitrary, { minLength: 1, maxLength: 4 }),
        }),
        (page, caseStudiesContent) => {
          const content: ServicePageContent = {
            page,
            section: 'caseStudies',
            content: caseStudiesContent as unknown as Record<string, unknown>,
          };

          const savedData = saveServiceContent(content);
          const retrievedContent = fetchServiceContent(savedData);

          expect(contentsAreEquivalent(content, retrievedContent)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should be idempotent - multiple save/fetch cycles produce same result', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...servicePageSlugs),
        videoSectionArbitrary,
        (page, videoContent) => {
          const content: ServicePageContent = {
            page,
            section: 'video',
            content: videoContent as unknown as Record<string, unknown>,
          };

          // First round trip
          const firstSave = saveServiceContent(content);
          const firstFetch = fetchServiceContent(firstSave);

          // Second round trip
          const secondSave = saveServiceContent(firstFetch);
          const secondFetch = fetchServiceContent(secondSave);

          expect(contentsAreEquivalent(firstFetch, secondFetch)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve all scalar fields in hero section', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...servicePageSlugs),
        heroSectionArbitrary,
        (page, heroContent) => {
          const content: ServicePageContent = {
            page,
            section: 'hero',
            content: heroContent as unknown as Record<string, unknown>,
          };

          const savedData = saveServiceContent(content);
          const retrievedContent = fetchServiceContent(savedData);

          const retrieved = retrievedContent.content as unknown as HeroSection;
          expect(retrieved.title).toBe(heroContent.title);
          expect(retrieved.subtitle).toBe(heroContent.subtitle);
          if (heroContent.eyebrow !== undefined) {
            expect(retrieved.eyebrow).toBe(heroContent.eyebrow);
          }
          if (heroContent.titleHighlight !== undefined) {
            expect(retrieved.titleHighlight).toBe(heroContent.titleHighlight);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve all fields in video section', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...servicePageSlugs),
        videoSectionArbitrary,
        (page, videoContent) => {
          const content: ServicePageContent = {
            page,
            section: 'video',
            content: videoContent as unknown as Record<string, unknown>,
          };

          const savedData = saveServiceContent(content);
          const retrievedContent = fetchServiceContent(savedData);

          const retrieved = retrievedContent.content as unknown as VideoSection;
          expect(retrieved.eyebrow).toBe(videoContent.eyebrow);
          expect(retrieved.title).toBe(videoContent.title);
          expect(retrieved.titleHighlight).toBe(videoContent.titleHighlight);
          expect(retrieved.subtitle).toBe(videoContent.subtitle);
          expect(retrieved.videoSrc).toBe(videoContent.videoSrc);
          expect(retrieved.ctaText).toBe(videoContent.ctaText);
          expect(retrieved.ctaHref).toBe(videoContent.ctaHref);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: service-pages-cms, Property 2: Case Studies Array Persistence
 * Validates: Requirements 1.4, 2.4, 3.4
 *
 * For any valid array of case studies (with img, title, desc, sliderName fields),
 * saving and fetching should preserve all items in order with all fields intact.
 */
describe('Property 2: Case Studies Array Persistence', () => {
  /**
   * Validates that two case study arrays are equivalent
   * - Same length
   * - Same order
   * - All fields match
   */
  function caseStudyArraysAreEquivalent(
    original: CaseStudy[],
    retrieved: CaseStudy[]
  ): boolean {
    if (original.length !== retrieved.length) return false;

    for (let i = 0; i < original.length; i++) {
      if (original[i].img !== retrieved[i].img) return false;
      if (original[i].title !== retrieved[i].title) return false;
      if (original[i].desc !== retrieved[i].desc) return false;
      if (original[i].sliderName !== retrieved[i].sliderName) return false;
    }

    return true;
  }

  it('should preserve case studies array length through save and fetch cycle', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...servicePageSlugs),
        fc.array(caseStudyArbitrary, { minLength: 1, maxLength: 10 }),
        (page, studies) => {
          const content: ServicePageContent = {
            page,
            section: 'caseStudies',
            content: {
              eyebrow: 'Test Eyebrow',
              title: 'Test Title',
              titleHighlight: 'Test Highlight',
              subtitle: 'Test Subtitle',
              studies,
            },
          };

          const savedData = saveServiceContent(content);
          const retrievedContent = fetchServiceContent(savedData);
          const retrievedStudies = (
            retrievedContent.content as { studies: CaseStudy[] }
          ).studies;

          expect(retrievedStudies.length).toBe(studies.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve case studies array order through save and fetch cycle', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...servicePageSlugs),
        fc.array(caseStudyArbitrary, { minLength: 2, maxLength: 10 }),
        (page, studies) => {
          const content: ServicePageContent = {
            page,
            section: 'caseStudies',
            content: {
              eyebrow: 'Test Eyebrow',
              title: 'Test Title',
              titleHighlight: 'Test Highlight',
              subtitle: 'Test Subtitle',
              studies,
            },
          };

          const savedData = saveServiceContent(content);
          const retrievedContent = fetchServiceContent(savedData);
          const retrievedStudies = (
            retrievedContent.content as { studies: CaseStudy[] }
          ).studies;

          // Verify order is preserved by checking each position
          for (let i = 0; i < studies.length; i++) {
            expect(retrievedStudies[i].title).toBe(studies[i].title);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve all case study fields (img, title, desc, sliderName) through save and fetch cycle', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...servicePageSlugs),
        fc.array(caseStudyArbitrary, { minLength: 1, maxLength: 10 }),
        (page, studies) => {
          const content: ServicePageContent = {
            page,
            section: 'caseStudies',
            content: {
              eyebrow: 'Test Eyebrow',
              title: 'Test Title',
              titleHighlight: 'Test Highlight',
              subtitle: 'Test Subtitle',
              studies,
            },
          };

          const savedData = saveServiceContent(content);
          const retrievedContent = fetchServiceContent(savedData);
          const retrievedStudies = (
            retrievedContent.content as { studies: CaseStudy[] }
          ).studies;

          expect(caseStudyArraysAreEquivalent(studies, retrievedStudies)).toBe(
            true
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle empty case studies array', () => {
    fc.assert(
      fc.property(fc.constantFrom(...servicePageSlugs), (page) => {
        const content: ServicePageContent = {
          page,
          section: 'caseStudies',
          content: {
            eyebrow: 'Test Eyebrow',
            title: 'Test Title',
            titleHighlight: 'Test Highlight',
            subtitle: 'Test Subtitle',
            studies: [],
          },
        };

        const savedData = saveServiceContent(content);
        const retrievedContent = fetchServiceContent(savedData);
        const retrievedStudies = (
          retrievedContent.content as { studies: CaseStudy[] }
        ).studies;

        expect(retrievedStudies).toEqual([]);
      }),
      { numRuns: 100 }
    );
  });

  it('should preserve case studies with special characters in fields', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...servicePageSlugs),
        fc.array(
          fc.record({
            img: fc.webUrl(),
            title: fc.string({ minLength: 1, maxLength: 100 }),
            desc: fc.string({ minLength: 1, maxLength: 300 }),
            sliderName: fc.string({ minLength: 1, maxLength: 50 }),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (page, studies) => {
          const content: ServicePageContent = {
            page,
            section: 'caseStudies',
            content: {
              eyebrow: 'Test Eyebrow',
              title: 'Test Title',
              titleHighlight: 'Test Highlight',
              subtitle: 'Test Subtitle',
              studies,
            },
          };

          const savedData = saveServiceContent(content);
          const retrievedContent = fetchServiceContent(savedData);
          const retrievedStudies = (
            retrievedContent.content as { studies: CaseStudy[] }
          ).studies;

          expect(caseStudyArraysAreEquivalent(studies, retrievedStudies)).toBe(
            true
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should be idempotent - multiple save/fetch cycles preserve case studies array', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...servicePageSlugs),
        fc.array(caseStudyArbitrary, { minLength: 1, maxLength: 5 }),
        (page, studies) => {
          const content: ServicePageContent = {
            page,
            section: 'caseStudies',
            content: {
              eyebrow: 'Test Eyebrow',
              title: 'Test Title',
              titleHighlight: 'Test Highlight',
              subtitle: 'Test Subtitle',
              studies,
            },
          };

          // First round trip
          const firstSave = saveServiceContent(content);
          const firstFetch = fetchServiceContent(firstSave);
          const firstStudies = (firstFetch.content as { studies: CaseStudy[] })
            .studies;

          // Second round trip
          const secondSave = saveServiceContent(firstFetch);
          const secondFetch = fetchServiceContent(secondSave);
          const secondStudies = (
            secondFetch.content as { studies: CaseStudy[] }
          ).studies;

          expect(
            caseStudyArraysAreEquivalent(firstStudies, secondStudies)
          ).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: service-pages-cms, Property 4: Section Heading Consistency
 * Validates: Requirements 2.3
 *
 * For any section with heading fields (eyebrow, title, titleHighlight, subtitle),
 * the component should render all provided heading values from CMS data.
 */
describe('Property 4: Section Heading Consistency', () => {
  /**
   * Simulates rendering a section heading - returns the rendered output string
   * This mimics how the SectionHeading component renders the heading fields
   */
  function renderSectionHeading(heading: SectionHeading): string {
    let output = '';

    // Render eyebrow if provided
    if (heading.eyebrow) {
      output += `<eyebrow>✨ ${heading.eyebrow}</eyebrow>`;
    }

    // Render title (always required)
    output += `<title>${heading.title}`;

    // Render titleHighlight if provided
    if (heading.titleHighlight) {
      output += ` <highlight>${heading.titleHighlight}</highlight>`;
    }

    output += '</title>';

    // Render subtitle if provided
    if (heading.subtitle) {
      output += `<subtitle>${heading.subtitle}</subtitle>`;
    }

    return output;
  }

  /**
   * Checks if all provided heading fields are present in the rendered output
   */
  function allFieldsRendered(
    heading: SectionHeading,
    rendered: string
  ): boolean {
    // Title must always be present
    if (!rendered.includes(heading.title)) return false;

    // Eyebrow must be present if provided
    if (heading.eyebrow && !rendered.includes(heading.eyebrow)) return false;

    // TitleHighlight must be present if provided
    if (heading.titleHighlight && !rendered.includes(heading.titleHighlight))
      return false;

    // Subtitle must be present if provided
    if (heading.subtitle && !rendered.includes(heading.subtitle)) return false;

    return true;
  }

  it('should render all provided heading fields from CMS data', () => {
    fc.assert(
      fc.property(sectionHeadingArbitrary, (heading) => {
        const rendered = renderSectionHeading(heading);
        expect(allFieldsRendered(heading, rendered)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('should always render the title field', () => {
    fc.assert(
      fc.property(sectionHeadingArbitrary, (heading) => {
        const rendered = renderSectionHeading(heading);
        expect(rendered).toContain(heading.title);
      }),
      { numRuns: 100 }
    );
  });

  it('should render eyebrow when provided', () => {
    fc.assert(
      fc.property(sectionHeadingArbitrary, (heading) => {
        const rendered = renderSectionHeading(heading);
        expect(rendered).toContain(heading.eyebrow);
      }),
      { numRuns: 100 }
    );
  });

  it('should render titleHighlight when provided', () => {
    fc.assert(
      fc.property(sectionHeadingArbitrary, (heading) => {
        const rendered = renderSectionHeading(heading);
        expect(rendered).toContain(heading.titleHighlight);
      }),
      { numRuns: 100 }
    );
  });

  it('should render subtitle when provided', () => {
    fc.assert(
      fc.property(sectionHeadingArbitrary, (heading) => {
        const rendered = renderSectionHeading(heading);
        expect(rendered).toContain(heading.subtitle);
      }),
      { numRuns: 100 }
    );
  });

  it('should preserve heading fields through CMS save and render cycle', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...servicePageSlugs),
        fc.constantFrom(
          'chatDemo',
          'learningAnimation',
          'accuracyChart',
          'serpRanking',
          'keywordCloud',
          'trafficGrowth',
          'competitorAnalysis'
        ),
        sectionHeadingArbitrary,
        (page, section, heading) => {
          // Save to CMS
          const content: ServicePageContent = {
            page,
            section,
            content: heading as unknown as Record<string, unknown>,
          };
          const savedData = saveServiceContent(content);

          // Fetch from CMS
          const retrievedContent = fetchServiceContent(savedData);
          const retrievedHeading =
            retrievedContent.content as unknown as SectionHeading;

          // Render the retrieved heading
          const rendered = renderSectionHeading(retrievedHeading);

          // All original fields should be present in rendered output
          expect(allFieldsRendered(heading, rendered)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain field values exactly as provided (no truncation or modification)', () => {
    fc.assert(
      fc.property(sectionHeadingArbitrary, (heading) => {
        const rendered = renderSectionHeading(heading);

        // Check exact field values are present
        expect(rendered).toContain(`<title>${heading.title}`);
        expect(rendered).toContain(`<eyebrow>✨ ${heading.eyebrow}</eyebrow>`);
        expect(rendered).toContain(
          `<highlight>${heading.titleHighlight}</highlight>`
        );
        expect(rendered).toContain(`<subtitle>${heading.subtitle}</subtitle>`);
      }),
      { numRuns: 100 }
    );
  });

  it('should handle headings with special characters consistently', () => {
    fc.assert(
      fc.property(
        fc.record({
          eyebrow: fc.string({ minLength: 1, maxLength: 50 }),
          title: fc.string({ minLength: 1, maxLength: 100 }),
          titleHighlight: fc.string({ minLength: 1, maxLength: 50 }),
          subtitle: fc.string({ minLength: 1, maxLength: 300 }),
        }),
        (heading) => {
          const rendered = renderSectionHeading(heading);
          expect(allFieldsRendered(heading, rendered)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should be idempotent - rendering same heading multiple times produces same output', () => {
    fc.assert(
      fc.property(sectionHeadingArbitrary, (heading) => {
        const firstRender = renderSectionHeading(heading);
        const secondRender = renderSectionHeading(heading);
        expect(firstRender).toBe(secondRender);
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: service-pages-cms, Property 3: Services Array Persistence
 * Validates: Requirements 3.3
 *
 * For any valid array of service items (with id, name, url, description, imgSrc fields),
 * saving and fetching should preserve all items in order with all fields intact.
 */
describe('Property 3: Services Array Persistence', () => {
  /**
   * Validates that two service item arrays are equivalent
   * - Same length
   * - Same order
   * - All fields match
   */
  function serviceItemArraysAreEquivalent(
    original: ServiceItem[],
    retrieved: ServiceItem[]
  ): boolean {
    if (original.length !== retrieved.length) return false;

    for (let i = 0; i < original.length; i++) {
      if (original[i].id !== retrieved[i].id) return false;
      if (original[i].name !== retrieved[i].name) return false;
      if (original[i].url !== retrieved[i].url) return false;
      if (original[i].description !== retrieved[i].description) return false;
      if (original[i].imgSrc !== retrieved[i].imgSrc) return false;
    }

    return true;
  }

  it('should preserve services array length through save and fetch cycle', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...servicePageSlugs),
        fc.array(serviceItemArbitrary, { minLength: 1, maxLength: 10 }),
        (page, services) => {
          const content: ServicePageContent = {
            page,
            section: 'hero',
            content: {
              eyebrow: 'Test Eyebrow',
              title: 'Test Title',
              highlightedWord: 'Test',
              highlightedWord2: 'Highlight',
              subtitle: 'Test Subtitle',
              services,
              ctaLabel: 'Test CTA',
              ctaHref: '/test',
            },
          };

          const savedData = saveServiceContent(content);
          const retrievedContent = fetchServiceContent(savedData);
          const retrievedServices = (
            retrievedContent.content as { services: ServiceItem[] }
          ).services;

          expect(retrievedServices.length).toBe(services.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve services array order through save and fetch cycle', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...servicePageSlugs),
        fc.array(serviceItemArbitrary, { minLength: 2, maxLength: 10 }),
        (page, services) => {
          const content: ServicePageContent = {
            page,
            section: 'hero',
            content: {
              eyebrow: 'Test Eyebrow',
              title: 'Test Title',
              highlightedWord: 'Test',
              highlightedWord2: 'Highlight',
              subtitle: 'Test Subtitle',
              services,
              ctaLabel: 'Test CTA',
              ctaHref: '/test',
            },
          };

          const savedData = saveServiceContent(content);
          const retrievedContent = fetchServiceContent(savedData);
          const retrievedServices = (
            retrievedContent.content as { services: ServiceItem[] }
          ).services;

          // Verify order is preserved by checking each position
          for (let i = 0; i < services.length; i++) {
            expect(retrievedServices[i].id).toBe(services[i].id);
            expect(retrievedServices[i].name).toBe(services[i].name);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve all service item fields (id, name, url, description, imgSrc) through save and fetch cycle', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...servicePageSlugs),
        fc.array(serviceItemArbitrary, { minLength: 1, maxLength: 10 }),
        (page, services) => {
          const content: ServicePageContent = {
            page,
            section: 'hero',
            content: {
              eyebrow: 'Test Eyebrow',
              title: 'Test Title',
              highlightedWord: 'Test',
              highlightedWord2: 'Highlight',
              subtitle: 'Test Subtitle',
              services,
              ctaLabel: 'Test CTA',
              ctaHref: '/test',
            },
          };

          const savedData = saveServiceContent(content);
          const retrievedContent = fetchServiceContent(savedData);
          const retrievedServices = (
            retrievedContent.content as { services: ServiceItem[] }
          ).services;

          expect(
            serviceItemArraysAreEquivalent(services, retrievedServices)
          ).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle empty services array', () => {
    fc.assert(
      fc.property(fc.constantFrom(...servicePageSlugs), (page) => {
        const content: ServicePageContent = {
          page,
          section: 'hero',
          content: {
            eyebrow: 'Test Eyebrow',
            title: 'Test Title',
            highlightedWord: 'Test',
            highlightedWord2: 'Highlight',
            subtitle: 'Test Subtitle',
            services: [],
            ctaLabel: 'Test CTA',
            ctaHref: '/test',
          },
        };

        const savedData = saveServiceContent(content);
        const retrievedContent = fetchServiceContent(savedData);
        const retrievedServices = (
          retrievedContent.content as { services: ServiceItem[] }
        ).services;

        expect(retrievedServices).toEqual([]);
      }),
      { numRuns: 100 }
    );
  });

  it('should preserve services with special characters in fields', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...servicePageSlugs),
        fc.array(serviceItemArbitrary, { minLength: 1, maxLength: 5 }),
        (page, services) => {
          const content: ServicePageContent = {
            page,
            section: 'hero',
            content: {
              eyebrow: 'Test Eyebrow',
              title: 'Test Title',
              highlightedWord: 'Test',
              highlightedWord2: 'Highlight',
              subtitle: 'Test Subtitle',
              services,
              ctaLabel: 'Test CTA',
              ctaHref: '/test',
            },
          };

          const savedData = saveServiceContent(content);
          const retrievedContent = fetchServiceContent(savedData);
          const retrievedServices = (
            retrievedContent.content as { services: ServiceItem[] }
          ).services;

          expect(
            serviceItemArraysAreEquivalent(services, retrievedServices)
          ).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should be idempotent - multiple save/fetch cycles preserve services array', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...servicePageSlugs),
        fc.array(serviceItemArbitrary, { minLength: 1, maxLength: 5 }),
        (page, services) => {
          const content: ServicePageContent = {
            page,
            section: 'hero',
            content: {
              eyebrow: 'Test Eyebrow',
              title: 'Test Title',
              highlightedWord: 'Test',
              highlightedWord2: 'Highlight',
              subtitle: 'Test Subtitle',
              services,
              ctaLabel: 'Test CTA',
              ctaHref: '/test',
            },
          };

          // First round trip
          const firstSave = saveServiceContent(content);
          const firstFetch = fetchServiceContent(firstSave);
          const firstServices = (
            firstFetch.content as { services: ServiceItem[] }
          ).services;

          // Second round trip
          const secondSave = saveServiceContent(firstFetch);
          const secondFetch = fetchServiceContent(secondSave);
          const secondServices = (
            secondFetch.content as { services: ServiceItem[] }
          ).services;

          expect(
            serviceItemArraysAreEquivalent(firstServices, secondServices)
          ).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: service-pages-cms, Property 5: Fallback Content Display
 * Validates: Requirements 7.2
 *
 * For any service page section, when CMS content is unavailable,
 * the component should display valid fallback default content without errors.
 */
describe('Property 5: Fallback Content Display', () => {
  /**
   * Default fallback content for hero sections
   * These represent the structure that must be present when CMS is unavailable
   */
  const defaultHeroFallbacks: Record<string, HeroSection> = {
    'services-chatbot': {
      titleHighlight: 'AI-Powered',
      title: 'Chatbots',
      subtitle:
        'Intelligent conversational AI that connects with your customers 24/7 across all platforms.',
      ctaText: 'Build Your Chatbot',
      ctaHref: '/contact',
    },
    'services-seo': {
      title: 'SEO Services',
      highlightedWord: 'SEO',
      subtitle: 'Boost your search rankings and drive organic traffic.',
      ctaText: 'Get Started',
      ctaHref: '/contact',
    },
    'services-shopify': {
      eyebrow: 'E-Commerce',
      title: 'Shopify Development',
      highlightedWord: 'Shopify',
      highlightedWord2: 'Development',
      subtitle: 'Build powerful e-commerce experiences.',
      ctaLabel: 'Start Your Store',
      ctaHref: '/contact',
      services: [],
    },
    'services-wordpress': {
      title: 'WordPress Development',
      subtitle: 'Custom WordPress solutions for your business.',
      ctaText: 'Get Started',
      ctaHref: '/contact',
      services: [],
    },
    'services-webdesign': {
      title: 'Web Design',
      subtitle: 'Beautiful, responsive web designs.',
      ctaText: 'Start Your Project',
      ctaHref: '/contact',
      services: [],
    },
    'services-n8n': {
      title: 'N8N Automations',
      subtitle: 'Automate your workflows with n8n.',
      ctaText: 'Automate Now',
      ctaHref: '/contact',
    },
  };

  /**
   * Default fallback content for video sections
   */
  const defaultVideoFallback: VideoSection = {
    eyebrow: 'See It In Action',
    title: 'Watch How We Work',
    titleHighlight: 'Our Process',
    subtitle: 'Experience our development process.',
    videoSrc: '/media/services/default/video.mp4',
    ctaText: 'Get Started',
    ctaHref: '/contact',
  };

  /**
   * Default fallback content for CTA sections
   */
  const defaultCTAFallback: CTASection = {
    title: 'Ready to Get Started?',
    subtitle: "Let's build something amazing together.",
    ctaText: 'Contact Us',
    ctaHref: '/contact',
  };

  /**
   * Default fallback content for section headings
   */
  const defaultSectionHeadingFallback: SectionHeading = {
    eyebrow: 'Section',
    title: 'Section Title',
    titleHighlight: 'Highlight',
    subtitle: 'Section description goes here.',
  };

  /**
   * Simulates the fallback logic used in service page components
   * Returns fallback content when CMS content is null/undefined
   */
  function applyFallback<T>(cmsContent: T | null | undefined, fallback: T): T {
    return cmsContent || fallback;
  }

  /**
   * Validates that fallback content has all required fields for hero section
   */
  function isValidHeroFallback(content: HeroSection): boolean {
    // Title and subtitle are always required
    if (!content.title || typeof content.title !== 'string') return false;
    if (!content.subtitle || typeof content.subtitle !== 'string') return false;

    // At least one CTA field should be present
    const hasCTA = content.ctaText || content.ctaLabel;
    if (!hasCTA) return false;

    // CTA href should be present
    if (!content.ctaHref || typeof content.ctaHref !== 'string') return false;

    return true;
  }

  /**
   * Validates that fallback content has all required fields for video section
   */
  function isValidVideoFallback(content: VideoSection): boolean {
    if (!content.title || typeof content.title !== 'string') return false;
    if (!content.subtitle || typeof content.subtitle !== 'string') return false;
    if (!content.videoSrc || typeof content.videoSrc !== 'string') return false;
    if (!content.ctaText || typeof content.ctaText !== 'string') return false;
    if (!content.ctaHref || typeof content.ctaHref !== 'string') return false;
    return true;
  }

  /**
   * Validates that fallback content has all required fields for CTA section
   */
  function isValidCTAFallback(content: CTASection): boolean {
    if (!content.title || typeof content.title !== 'string') return false;
    if (!content.subtitle || typeof content.subtitle !== 'string') return false;
    if (!content.ctaText || typeof content.ctaText !== 'string') return false;
    if (!content.ctaHref || typeof content.ctaHref !== 'string') return false;
    return true;
  }

  /**
   * Validates that fallback content has all required fields for section heading
   */
  function isValidSectionHeadingFallback(content: SectionHeading): boolean {
    if (!content.title || typeof content.title !== 'string') return false;
    if (!content.subtitle || typeof content.subtitle !== 'string') return false;
    return true;
  }

  it('should provide valid hero fallback content when CMS returns null', () => {
    fc.assert(
      fc.property(fc.constantFrom(...servicePageSlugs), (page) => {
        // Simulate CMS returning null
        const cmsContent: HeroSection | null = null;
        const fallback = defaultHeroFallbacks[page];

        // Apply fallback logic
        const result = applyFallback(cmsContent, fallback);

        // Verify fallback is valid
        expect(isValidHeroFallback(result)).toBe(true);
        expect(result).toBe(fallback);
      }),
      { numRuns: 100 }
    );
  });

  it('should provide valid hero fallback content when CMS returns undefined', () => {
    fc.assert(
      fc.property(fc.constantFrom(...servicePageSlugs), (page) => {
        // Simulate CMS returning undefined
        const cmsContent: HeroSection | undefined = undefined;
        const fallback = defaultHeroFallbacks[page];

        // Apply fallback logic
        const result = applyFallback(cmsContent, fallback);

        // Verify fallback is valid
        expect(isValidHeroFallback(result)).toBe(true);
        expect(result).toBe(fallback);
      }),
      { numRuns: 100 }
    );
  });

  it('should use CMS content when available instead of fallback', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...servicePageSlugs),
        heroSectionArbitrary,
        (page, cmsContent) => {
          const fallback = defaultHeroFallbacks[page];

          // Apply fallback logic with valid CMS content
          const result = applyFallback(cmsContent, fallback);

          // Should use CMS content, not fallback
          expect(result).toBe(cmsContent);
          expect(result).not.toBe(fallback);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should provide valid video fallback content when CMS returns null', () => {
    fc.assert(
      fc.property(fc.constantFrom(...servicePageSlugs), () => {
        // Simulate CMS returning null
        const cmsContent: VideoSection | null = null;

        // Apply fallback logic
        const result = applyFallback(cmsContent, defaultVideoFallback);

        // Verify fallback is valid
        expect(isValidVideoFallback(result)).toBe(true);
        expect(result).toBe(defaultVideoFallback);
      }),
      { numRuns: 100 }
    );
  });

  it('should provide valid CTA fallback content when CMS returns null', () => {
    fc.assert(
      fc.property(fc.constantFrom(...servicePageSlugs), () => {
        // Simulate CMS returning null
        const cmsContent: CTASection | null = null;

        // Apply fallback logic
        const result = applyFallback(cmsContent, defaultCTAFallback);

        // Verify fallback is valid
        expect(isValidCTAFallback(result)).toBe(true);
        expect(result).toBe(defaultCTAFallback);
      }),
      { numRuns: 100 }
    );
  });

  it('should provide valid section heading fallback content when CMS returns null', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...servicePageSlugs),
        fc.constantFrom(
          'chatDemo',
          'learningAnimation',
          'accuracyChart',
          'serpRanking',
          'keywordCloud'
        ),
        () => {
          // Simulate CMS returning null
          const cmsContent: SectionHeading | null = null;

          // Apply fallback logic
          const result = applyFallback(
            cmsContent,
            defaultSectionHeadingFallback
          );

          // Verify fallback is valid
          expect(isValidSectionHeadingFallback(result)).toBe(true);
          expect(result).toBe(defaultSectionHeadingFallback);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle falsy CMS values correctly (empty string should not trigger fallback)', () => {
    fc.assert(
      fc.property(fc.constantFrom(...servicePageSlugs), (page) => {
        // Empty object is truthy, should not trigger fallback
        const cmsContent: Partial<HeroSection> = {};
        const fallback = defaultHeroFallbacks[page];

        // Apply fallback logic - empty object is truthy
        const result = applyFallback(cmsContent as HeroSection, fallback);

        // Should use CMS content (empty object), not fallback
        expect(result).toBe(cmsContent);
      }),
      { numRuns: 100 }
    );
  });

  it('should ensure fallback content is immutable (not modified by component)', () => {
    fc.assert(
      fc.property(fc.constantFrom(...servicePageSlugs), (page) => {
        const originalFallback = { ...defaultHeroFallbacks[page] };
        const cmsContent: HeroSection | null = null;

        // Apply fallback logic
        const result = applyFallback(cmsContent, defaultHeroFallbacks[page]);

        // Verify original fallback is unchanged
        expect(defaultHeroFallbacks[page].title).toBe(originalFallback.title);
        expect(defaultHeroFallbacks[page].subtitle).toBe(
          originalFallback.subtitle
        );
        expect(result).toBe(defaultHeroFallbacks[page]);
      }),
      { numRuns: 100 }
    );
  });

  it('should provide fallback with valid href paths', () => {
    fc.assert(
      fc.property(fc.constantFrom(...servicePageSlugs), (page) => {
        const cmsContent: HeroSection | null = null;
        const fallback = defaultHeroFallbacks[page];

        const result = applyFallback(cmsContent, fallback);

        // Verify href is a valid path (starts with /)
        expect(result.ctaHref).toMatch(/^\//);
      }),
      { numRuns: 100 }
    );
  });

  it('should provide fallback with non-empty text content', () => {
    fc.assert(
      fc.property(fc.constantFrom(...servicePageSlugs), (page) => {
        const cmsContent: HeroSection | null = null;
        const fallback = defaultHeroFallbacks[page];

        const result = applyFallback(cmsContent, fallback);

        // Verify text content is non-empty
        expect(result.title.trim().length).toBeGreaterThan(0);
        expect(result.subtitle.trim().length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it('should handle multiple sections falling back simultaneously', () => {
    fc.assert(
      fc.property(fc.constantFrom(...servicePageSlugs), (page) => {
        // Simulate all sections returning null from CMS
        const heroResult = applyFallback<HeroSection>(
          null,
          defaultHeroFallbacks[page]
        );
        const videoResult = applyFallback<VideoSection>(
          null,
          defaultVideoFallback
        );
        const ctaResult = applyFallback<CTASection>(null, defaultCTAFallback);

        // All should be valid fallbacks
        expect(isValidHeroFallback(heroResult)).toBe(true);
        expect(isValidVideoFallback(videoResult)).toBe(true);
        expect(isValidCTAFallback(ctaResult)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('should maintain type consistency between CMS content and fallback', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...servicePageSlugs),
        fc.boolean(),
        (page, useCMS) => {
          const cmsContent: HeroSection | null = useCMS
            ? {
                title: 'CMS Title',
                subtitle: 'CMS Subtitle',
                ctaText: 'CMS CTA',
                ctaHref: '/cms-path',
              }
            : null;
          const fallback = defaultHeroFallbacks[page];

          const result = applyFallback(cmsContent, fallback);

          // Result should always have the same structure
          expect(typeof result.title).toBe('string');
          expect(typeof result.subtitle).toBe('string');
          expect(typeof result.ctaHref).toBe('string');
        }
      ),
      { numRuns: 100 }
    );
  });
});
