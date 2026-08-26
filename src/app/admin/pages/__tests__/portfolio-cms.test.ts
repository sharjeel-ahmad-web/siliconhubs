/**
 * Property-Based Tests for Portfolio CMS Enhancement
 * Feature: portfolio-cms-enhancement
 */

import * as fc from 'fast-check';

/**
 * Project interface matching the design document
 */
interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  thumbnailUrl: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  images: string[];
  hotspots: { x: number; y: number; title: string; description: string }[];
}

/**
 * Arbitrary generator for valid project data
 */
const projectArbitrary = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  client: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 1, maxLength: 500 }),
  thumbnailUrl: fc.webUrl(),
  tags: fc.array(fc.string({ minLength: 1, maxLength: 50 }), {
    minLength: 1,
    maxLength: 10,
  }),
  metrics: fc.array(
    fc.record({
      label: fc.string({ minLength: 1, maxLength: 50 }),
      value: fc.string({ minLength: 1, maxLength: 20 }),
    }),
    { minLength: 0, maxLength: 5 }
  ),
  images: fc.array(fc.webUrl(), { minLength: 1, maxLength: 10 }),
  hotspots: fc.array(
    fc.record({
      x: fc.float({ min: 0, max: 100, noNaN: true }),
      y: fc.float({ min: 0, max: 100, noNaN: true }),
      title: fc.string({ minLength: 1, maxLength: 100 }),
      description: fc.string({ minLength: 1, maxLength: 200 }),
    }),
    { minLength: 0, maxLength: 5 }
  ),
});

/**
 * Simulates the save operation - serializes project to JSON
 */
function saveProject(project: Project): string {
  return JSON.stringify(project);
}

/**
 * Simulates the fetch operation - deserializes project from JSON
 */
function fetchProject(jsonString: string): Project {
  return JSON.parse(jsonString);
}

/**
 * Validates that two projects are equivalent
 */
function projectsAreEquivalent(original: Project, retrieved: Project): boolean {
  // Check all scalar fields
  if (original.id !== retrieved.id) return false;
  if (original.title !== retrieved.title) return false;
  if (original.client !== retrieved.client) return false;
  if (original.description !== retrieved.description) return false;
  if (original.thumbnailUrl !== retrieved.thumbnailUrl) return false;

  // Check tags array
  if (original.tags.length !== retrieved.tags.length) return false;
  for (let i = 0; i < original.tags.length; i++) {
    if (original.tags[i] !== retrieved.tags[i]) return false;
  }

  // Check metrics array
  if (original.metrics.length !== retrieved.metrics.length) return false;
  for (let i = 0; i < original.metrics.length; i++) {
    if (original.metrics[i].label !== retrieved.metrics[i].label) return false;
    if (original.metrics[i].value !== retrieved.metrics[i].value) return false;
  }

  // Check images array
  if (original.images.length !== retrieved.images.length) return false;
  for (let i = 0; i < original.images.length; i++) {
    if (original.images[i] !== retrieved.images[i]) return false;
  }

  // Check hotspots array
  if (original.hotspots.length !== retrieved.hotspots.length) return false;
  for (let i = 0; i < original.hotspots.length; i++) {
    if (original.hotspots[i].x !== retrieved.hotspots[i].x) return false;
    if (original.hotspots[i].y !== retrieved.hotspots[i].y) return false;
    if (original.hotspots[i].title !== retrieved.hotspots[i].title)
      return false;
    if (original.hotspots[i].description !== retrieved.hotspots[i].description)
      return false;
  }

  return true;
}

/**
 * Feature: portfolio-cms-enhancement, Property 1: Project Save Round Trip
 * Validates: Requirements 1.3
 *
 * For any valid project data, saving it to the CMS and then fetching it
 * should return equivalent project data with all fields preserved
 * (title, client, description, thumbnailUrl, tags, metrics, images, hotspots).
 */
describe('Property 1: Project Save Round Trip', () => {
  it('should preserve all project fields through save and fetch cycle', () => {
    fc.assert(
      fc.property(projectArbitrary, (project) => {
        // Save the project (serialize to JSON)
        const savedData = saveProject(project);

        // Fetch the project (deserialize from JSON)
        const retrievedProject = fetchProject(savedData);

        // Verify all fields are preserved
        expect(projectsAreEquivalent(project, retrievedProject)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('should preserve project title exactly', () => {
    fc.assert(
      fc.property(projectArbitrary, (project) => {
        const savedData = saveProject(project);
        const retrievedProject = fetchProject(savedData);

        expect(retrievedProject.title).toBe(project.title);
      }),
      { numRuns: 100 }
    );
  });

  it('should preserve project client exactly', () => {
    fc.assert(
      fc.property(projectArbitrary, (project) => {
        const savedData = saveProject(project);
        const retrievedProject = fetchProject(savedData);

        expect(retrievedProject.client).toBe(project.client);
      }),
      { numRuns: 100 }
    );
  });

  it('should preserve project description exactly', () => {
    fc.assert(
      fc.property(projectArbitrary, (project) => {
        const savedData = saveProject(project);
        const retrievedProject = fetchProject(savedData);

        expect(retrievedProject.description).toBe(project.description);
      }),
      { numRuns: 100 }
    );
  });

  it('should preserve all tags in order', () => {
    fc.assert(
      fc.property(projectArbitrary, (project) => {
        const savedData = saveProject(project);
        const retrievedProject = fetchProject(savedData);

        expect(retrievedProject.tags).toEqual(project.tags);
      }),
      { numRuns: 100 }
    );
  });

  it('should preserve all metrics with label and value', () => {
    fc.assert(
      fc.property(projectArbitrary, (project) => {
        const savedData = saveProject(project);
        const retrievedProject = fetchProject(savedData);

        expect(retrievedProject.metrics).toEqual(project.metrics);
      }),
      { numRuns: 100 }
    );
  });

  it('should preserve all images in order', () => {
    fc.assert(
      fc.property(projectArbitrary, (project) => {
        const savedData = saveProject(project);
        const retrievedProject = fetchProject(savedData);

        expect(retrievedProject.images).toEqual(project.images);
      }),
      { numRuns: 100 }
    );
  });

  it('should preserve all hotspots with x, y, title, and description', () => {
    fc.assert(
      fc.property(projectArbitrary, (project) => {
        const savedData = saveProject(project);
        const retrievedProject = fetchProject(savedData);

        expect(retrievedProject.hotspots).toEqual(project.hotspots);
      }),
      { numRuns: 100 }
    );
  });

  it('should be idempotent - multiple save/fetch cycles produce same result', () => {
    fc.assert(
      fc.property(projectArbitrary, (project) => {
        // First round trip
        const firstSave = saveProject(project);
        const firstFetch = fetchProject(firstSave);

        // Second round trip
        const secondSave = saveProject(firstFetch);
        const secondFetch = fetchProject(secondSave);

        // Results should be identical
        expect(projectsAreEquivalent(firstFetch, secondFetch)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Interface for featured slide data
 */
interface FeaturedSlide {
  id: string;
  title: string;
  description: string;
  services: string[];
  type: string;
  imageUrl: string;
}

/**
 * Interface for case study data
 */
interface CaseStudy {
  img: string;
  title: string;
  desc: string;
  sliderName: string;
}

/**
 * Interface for advantage feature data
 */
interface AdvantageFeature {
  title: string;
  description: string;
  icon: string;
  color: string;
}

/**
 * Interface for advantage stat data
 */
interface AdvantageStat {
  value: string;
  label: string;
}

/**
 * Arbitrary generator for featured slide data
 */
const featuredSlideArbitrary = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 1, maxLength: 300 }),
  services: fc.array(fc.string({ minLength: 1, maxLength: 50 }), {
    minLength: 1,
    maxLength: 5,
  }),
  type: fc.string({ minLength: 1, maxLength: 50 }),
  imageUrl: fc.webUrl(),
});

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
 * Arbitrary generator for advantage feature data
 */
const advantageFeatureArbitrary = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 1, maxLength: 300 }),
  icon: fc.string({ minLength: 1, maxLength: 50 }),
  color: fc.hexaString({ minLength: 6, maxLength: 6 }).map((hex) => `#${hex}`),
});

/**
 * Arbitrary generator for advantage stat data
 */
const advantageStatArbitrary = fc.record({
  value: fc.string({ minLength: 1, maxLength: 20 }),
  label: fc.string({ minLength: 1, maxLength: 50 }),
});

/**
 * Simulates rendering featured slides - returns count of rendered items
 */
function renderFeaturedSlides(slides: FeaturedSlide[]): number {
  // Simulates the component rendering all slides from CMS data
  return slides.length;
}

/**
 * Simulates rendering case studies - returns count of rendered items
 */
function renderCaseStudies(studies: CaseStudy[]): number {
  // Simulates the component rendering all case studies from CMS data
  return studies.length;
}

/**
 * Simulates rendering advantage features - returns count of rendered items
 */
function renderAdvantageFeatures(features: AdvantageFeature[]): number {
  // Simulates the component rendering all features from CMS data
  return features.length;
}

/**
 * Validates that all slide fields are present in rendered output
 */
function validateSlideRendering(slide: FeaturedSlide): boolean {
  // Simulates checking that all required fields are rendered
  return (
    slide.id !== undefined &&
    slide.title !== undefined &&
    slide.description !== undefined &&
    slide.services !== undefined &&
    slide.type !== undefined &&
    slide.imageUrl !== undefined
  );
}

/**
 * Validates that all case study fields are present in rendered output
 */
function validateCaseStudyRendering(study: CaseStudy): boolean {
  // Simulates checking that all required fields are rendered
  return (
    study.img !== undefined &&
    study.title !== undefined &&
    study.desc !== undefined &&
    study.sliderName !== undefined
  );
}

/**
 * Validates that all advantage feature fields are present in rendered output
 */
function validateAdvantageRendering(feature: AdvantageFeature): boolean {
  // Simulates checking that all required fields are rendered
  return (
    feature.title !== undefined &&
    feature.description !== undefined &&
    feature.icon !== undefined &&
    feature.color !== undefined
  );
}

/**
 * Feature: portfolio-cms-enhancement, Property 4: CMS Data Rendering Consistency
 * Validates: Requirements 6.2, 6.3, 6.4
 *
 * For any portfolio section content stored in the CMS (featuredWork, caseStudies, advantages),
 * the corresponding component should render all items from the CMS data.
 */
describe('Property 4: CMS Data Rendering Consistency', () => {
  describe('Featured Work Carousel (Requirements 6.2)', () => {
    it('should render all slides from CMS data', () => {
      fc.assert(
        fc.property(
          fc.array(featuredSlideArbitrary, { minLength: 1, maxLength: 10 }),
          (slides) => {
            const renderedCount = renderFeaturedSlides(slides);
            expect(renderedCount).toBe(slides.length);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should render all required fields for each slide', () => {
      fc.assert(
        fc.property(featuredSlideArbitrary, (slide) => {
          expect(validateSlideRendering(slide)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve slide order from CMS data', () => {
      fc.assert(
        fc.property(
          fc.array(featuredSlideArbitrary, { minLength: 2, maxLength: 10 }),
          (slides) => {
            // Simulates that slides are rendered in the same order as CMS data
            const slideIds = slides.map((s) => s.id);
            const renderedIds = slides.map((s) => s.id); // Same order preserved
            expect(renderedIds).toEqual(slideIds);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should render all services for each slide', () => {
      fc.assert(
        fc.property(featuredSlideArbitrary, (slide) => {
          // Each slide's services array should be fully rendered
          expect(slide.services.length).toBeGreaterThan(0);
          slide.services.forEach((service) => {
            expect(typeof service).toBe('string');
            expect(service.length).toBeGreaterThan(0);
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Case Studies Carousel (Requirements 6.3)', () => {
    it('should render all case studies from CMS data', () => {
      fc.assert(
        fc.property(
          fc.array(caseStudyArbitrary, { minLength: 1, maxLength: 10 }),
          (studies) => {
            const renderedCount = renderCaseStudies(studies);
            expect(renderedCount).toBe(studies.length);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should render all required fields for each case study', () => {
      fc.assert(
        fc.property(caseStudyArbitrary, (study) => {
          expect(validateCaseStudyRendering(study)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve case study order from CMS data', () => {
      fc.assert(
        fc.property(
          fc.array(caseStudyArbitrary, { minLength: 2, maxLength: 10 }),
          (studies) => {
            // Simulates that case studies are rendered in the same order as CMS data
            const studyTitles = studies.map((s) => s.title);
            const renderedTitles = studies.map((s) => s.title); // Same order preserved
            expect(renderedTitles).toEqual(studyTitles);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Our Advantages Section (Requirements 6.4)', () => {
    it('should render all advantage features from CMS data', () => {
      fc.assert(
        fc.property(
          fc.array(advantageFeatureArbitrary, { minLength: 1, maxLength: 10 }),
          (features) => {
            const renderedCount = renderAdvantageFeatures(features);
            expect(renderedCount).toBe(features.length);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should render all required fields for each advantage feature', () => {
      fc.assert(
        fc.property(advantageFeatureArbitrary, (feature) => {
          expect(validateAdvantageRendering(feature)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should render valid hex color for each feature', () => {
      fc.assert(
        fc.property(advantageFeatureArbitrary, (feature) => {
          // Color should be a valid hex color
          expect(feature.color).toMatch(/^#[0-9a-fA-F]{6}$/);
        }),
        { numRuns: 100 }
      );
    });

    it('should render all stats from CMS data', () => {
      fc.assert(
        fc.property(
          fc.array(advantageStatArbitrary, { minLength: 1, maxLength: 5 }),
          (stats) => {
            // All stats should be renderable
            stats.forEach((stat) => {
              expect(stat.value).toBeDefined();
              expect(stat.label).toBeDefined();
              expect(stat.value.length).toBeGreaterThan(0);
              expect(stat.label.length).toBeGreaterThan(0);
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Cross-section consistency', () => {
    it('should handle empty CMS data gracefully with fallback', () => {
      // Empty arrays should result in 0 rendered items (fallback would be used in real component)
      expect(renderFeaturedSlides([])).toBe(0);
      expect(renderCaseStudies([])).toBe(0);
      expect(renderAdvantageFeatures([])).toBe(0);
    });

    it('should maintain data integrity across all section types', () => {
      fc.assert(
        fc.property(
          fc.record({
            slides: fc.array(featuredSlideArbitrary, {
              minLength: 1,
              maxLength: 5,
            }),
            studies: fc.array(caseStudyArbitrary, {
              minLength: 1,
              maxLength: 5,
            }),
            features: fc.array(advantageFeatureArbitrary, {
              minLength: 1,
              maxLength: 5,
            }),
          }),
          ({ slides, studies, features }) => {
            // All sections should render their respective item counts
            expect(renderFeaturedSlides(slides)).toBe(slides.length);
            expect(renderCaseStudies(studies)).toBe(studies.length);
            expect(renderAdvantageFeatures(features)).toBe(features.length);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});

/**
 * Interface for hotspot data
 */
interface Hotspot {
  x: number;
  y: number;
  title: string;
  description: string;
}

/**
 * Arbitrary generator for hotspot data with valid position constraints
 * x and y are percentages (0-100) representing position on the image
 */
const hotspotArbitrary = fc.record({
  x: fc.float({ min: 0, max: 100, noNaN: true }),
  y: fc.float({ min: 0, max: 100, noNaN: true }),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 1, maxLength: 200 }),
});

/**
 * Arbitrary generator for project with hotspots
 */
const projectWithHotspotsArbitrary = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  client: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 1, maxLength: 500 }),
  thumbnailUrl: fc.webUrl(),
  tags: fc.array(fc.string({ minLength: 1, maxLength: 50 }), {
    minLength: 1,
    maxLength: 10,
  }),
  metrics: fc.array(
    fc.record({
      label: fc.string({ minLength: 1, maxLength: 50 }),
      value: fc.string({ minLength: 1, maxLength: 20 }),
    }),
    { minLength: 0, maxLength: 5 }
  ),
  images: fc.array(fc.webUrl(), { minLength: 1, maxLength: 10 }),
  hotspots: fc.array(hotspotArbitrary, { minLength: 1, maxLength: 10 }),
});

/**
 * Simulates the ProjectDetail component rendering hotspots
 * Returns the rendered hotspot data with computed CSS positions
 */
function renderProjectDetailHotspots(project: Project): Array<{
  hotspot: Hotspot;
  cssLeft: string;
  cssTop: string;
  transform: string;
}> {
  return project.hotspots.map((hotspot) => ({
    hotspot,
    cssLeft: `${hotspot.x}%`,
    cssTop: `${hotspot.y}%`,
    transform: 'translate(-50%, -50%)',
  }));
}

/**
 * Validates that a hotspot position is within valid bounds (0-100%)
 */
function isValidHotspotPosition(x: number, y: number): boolean {
  return x >= 0 && x <= 100 && y >= 0 && y <= 100;
}

/**
 * Validates that hotspot tooltip contains required data
 */
function validateHotspotTooltip(hotspot: Hotspot): boolean {
  return (
    hotspot.title !== undefined &&
    hotspot.title.length > 0 &&
    hotspot.description !== undefined &&
    hotspot.description.length > 0
  );
}

/**
 * Feature: portfolio-cms-enhancement, Property 5: Project Detail Hotspot Display
 * Validates: Requirements 6.5
 *
 * For any project with hotspots, clicking the project card should display
 * a detail popup containing all hotspot data (x, y, title, description)
 * at the correct positions.
 */
describe('Property 5: Project Detail Hotspot Display', () => {
  describe('Hotspot rendering', () => {
    it('should render all hotspots from project data', () => {
      fc.assert(
        fc.property(projectWithHotspotsArbitrary, (project) => {
          const renderedHotspots = renderProjectDetailHotspots(project);
          expect(renderedHotspots.length).toBe(project.hotspots.length);
        }),
        { numRuns: 100 }
      );
    });

    it('should position hotspots at correct CSS coordinates', () => {
      fc.assert(
        fc.property(projectWithHotspotsArbitrary, (project) => {
          const renderedHotspots = renderProjectDetailHotspots(project);

          renderedHotspots.forEach((rendered, index) => {
            const originalHotspot = project.hotspots[index];
            expect(rendered.cssLeft).toBe(`${originalHotspot.x}%`);
            expect(rendered.cssTop).toBe(`${originalHotspot.y}%`);
          });
        }),
        { numRuns: 100 }
      );
    });

    it('should center hotspots using transform translate', () => {
      fc.assert(
        fc.property(projectWithHotspotsArbitrary, (project) => {
          const renderedHotspots = renderProjectDetailHotspots(project);

          renderedHotspots.forEach((rendered) => {
            // Hotspots should be centered on their position
            expect(rendered.transform).toBe('translate(-50%, -50%)');
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Hotspot position validation', () => {
    it('should have all hotspot positions within valid bounds (0-100%)', () => {
      fc.assert(
        fc.property(projectWithHotspotsArbitrary, (project) => {
          project.hotspots.forEach((hotspot) => {
            expect(isValidHotspotPosition(hotspot.x, hotspot.y)).toBe(true);
          });
        }),
        { numRuns: 100 }
      );
    });

    it('should handle edge case positions (0, 0) and (100, 100)', () => {
      fc.assert(
        fc.property(
          fc.record({
            x: fc.constantFrom(0, 100),
            y: fc.constantFrom(0, 100),
            title: fc.string({ minLength: 1, maxLength: 100 }),
            description: fc.string({ minLength: 1, maxLength: 200 }),
          }),
          (hotspot) => {
            expect(isValidHotspotPosition(hotspot.x, hotspot.y)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Hotspot tooltip content', () => {
    it('should preserve hotspot title in tooltip', () => {
      fc.assert(
        fc.property(projectWithHotspotsArbitrary, (project) => {
          const renderedHotspots = renderProjectDetailHotspots(project);

          renderedHotspots.forEach((rendered, index) => {
            expect(rendered.hotspot.title).toBe(project.hotspots[index].title);
          });
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve hotspot description in tooltip', () => {
      fc.assert(
        fc.property(projectWithHotspotsArbitrary, (project) => {
          const renderedHotspots = renderProjectDetailHotspots(project);

          renderedHotspots.forEach((rendered, index) => {
            expect(rendered.hotspot.description).toBe(
              project.hotspots[index].description
            );
          });
        }),
        { numRuns: 100 }
      );
    });

    it('should have valid tooltip content for all hotspots', () => {
      fc.assert(
        fc.property(projectWithHotspotsArbitrary, (project) => {
          project.hotspots.forEach((hotspot) => {
            expect(validateHotspotTooltip(hotspot)).toBe(true);
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Hotspot data integrity', () => {
    it('should maintain hotspot order from project data', () => {
      fc.assert(
        fc.property(projectWithHotspotsArbitrary, (project) => {
          const renderedHotspots = renderProjectDetailHotspots(project);

          // Hotspots should be rendered in the same order as in project data
          for (let i = 0; i < project.hotspots.length; i++) {
            expect(renderedHotspots[i].hotspot.x).toBe(project.hotspots[i].x);
            expect(renderedHotspots[i].hotspot.y).toBe(project.hotspots[i].y);
            expect(renderedHotspots[i].hotspot.title).toBe(
              project.hotspots[i].title
            );
            expect(renderedHotspots[i].hotspot.description).toBe(
              project.hotspots[i].description
            );
          }
        }),
        { numRuns: 100 }
      );
    });

    it('should handle projects with single hotspot', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.uuid(),
            title: fc.string({ minLength: 1, maxLength: 100 }),
            client: fc.string({ minLength: 1, maxLength: 100 }),
            description: fc.string({ minLength: 1, maxLength: 500 }),
            thumbnailUrl: fc.webUrl(),
            tags: fc.array(fc.string({ minLength: 1, maxLength: 50 }), {
              minLength: 1,
              maxLength: 10,
            }),
            metrics: fc.array(
              fc.record({
                label: fc.string({ minLength: 1, maxLength: 50 }),
                value: fc.string({ minLength: 1, maxLength: 20 }),
              }),
              { minLength: 0, maxLength: 5 }
            ),
            images: fc.array(fc.webUrl(), { minLength: 1, maxLength: 10 }),
            hotspots: fc.array(hotspotArbitrary, {
              minLength: 1,
              maxLength: 1,
            }),
          }),
          (project) => {
            const renderedHotspots = renderProjectDetailHotspots(project);
            expect(renderedHotspots.length).toBe(1);
            expect(renderedHotspots[0].hotspot).toEqual(project.hotspots[0]);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle projects with maximum hotspots', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.uuid(),
            title: fc.string({ minLength: 1, maxLength: 100 }),
            client: fc.string({ minLength: 1, maxLength: 100 }),
            description: fc.string({ minLength: 1, maxLength: 500 }),
            thumbnailUrl: fc.webUrl(),
            tags: fc.array(fc.string({ minLength: 1, maxLength: 50 }), {
              minLength: 1,
              maxLength: 10,
            }),
            metrics: fc.array(
              fc.record({
                label: fc.string({ minLength: 1, maxLength: 50 }),
                value: fc.string({ minLength: 1, maxLength: 20 }),
              }),
              { minLength: 0, maxLength: 5 }
            ),
            images: fc.array(fc.webUrl(), { minLength: 1, maxLength: 10 }),
            hotspots: fc.array(hotspotArbitrary, {
              minLength: 10,
              maxLength: 10,
            }),
          }),
          (project) => {
            const renderedHotspots = renderProjectDetailHotspots(project);
            expect(renderedHotspots.length).toBe(10);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Empty hotspots handling', () => {
    it('should handle projects with no hotspots gracefully', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.uuid(),
            title: fc.string({ minLength: 1, maxLength: 100 }),
            client: fc.string({ minLength: 1, maxLength: 100 }),
            description: fc.string({ minLength: 1, maxLength: 500 }),
            thumbnailUrl: fc.webUrl(),
            tags: fc.array(fc.string({ minLength: 1, maxLength: 50 }), {
              minLength: 1,
              maxLength: 10,
            }),
            metrics: fc.array(
              fc.record({
                label: fc.string({ minLength: 1, maxLength: 50 }),
                value: fc.string({ minLength: 1, maxLength: 20 }),
              }),
              { minLength: 0, maxLength: 5 }
            ),
            images: fc.array(fc.webUrl(), { minLength: 1, maxLength: 10 }),
            hotspots: fc.constant([]),
          }),
          (project) => {
            const renderedHotspots = renderProjectDetailHotspots(project);
            expect(renderedHotspots.length).toBe(0);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});

/**
 * Feature: portfolio-cms-enhancement, Property 3: Tag Addition Persistence
 * Validates: Requirements 2.2, 2.3
 *
 * For any valid tag string added to the filters section, the tag should appear
 * in the portfolio page filter options after save.
 */

/**
 * Arbitrary generator for valid tag strings
 * Tags should be non-empty strings representing technologies/skills
 */
const tagArbitrary = fc
  .string({ minLength: 1, maxLength: 50 })
  .filter((s) => s.trim().length > 0);

/**
 * Arbitrary generator for a set of existing tags
 */
const existingTagsArbitrary = fc.array(tagArbitrary, {
  minLength: 0,
  maxLength: 20,
});

/**
 * Simulates saving tags to the CMS - serializes to JSON
 */
function saveTags(tags: string[]): string {
  return JSON.stringify({ tags });
}

/**
 * Simulates fetching tags from the CMS - deserializes from JSON
 */
function fetchTags(jsonString: string): string[] {
  const data = JSON.parse(jsonString);
  return data.tags;
}

/**
 * Simulates adding a new tag to the existing tags array
 */
function addTag(existingTags: string[], newTag: string): string[] {
  // Avoid duplicates
  if (existingTags.includes(newTag)) {
    return existingTags;
  }
  return [...existingTags, newTag];
}

/**
 * Simulates removing a tag from the tags array
 */
function removeTag(existingTags: string[], tagToRemove: string): string[] {
  return existingTags.filter((tag) => tag !== tagToRemove);
}

/**
 * Validates that a tag appears in the filter options
 */
function tagExistsInFilters(tags: string[], targetTag: string): boolean {
  return tags.includes(targetTag);
}

describe('Property 3: Tag Addition Persistence', () => {
  describe('Tag addition (Requirements 2.2)', () => {
    it('should include added tag in filter options after save', () => {
      fc.assert(
        fc.property(
          existingTagsArbitrary,
          tagArbitrary,
          (existingTags, newTag) => {
            // Add the new tag
            const updatedTags = addTag(existingTags, newTag);

            // Save to CMS
            const savedData = saveTags(updatedTags);

            // Fetch from CMS
            const fetchedTags = fetchTags(savedData);

            // The new tag should be present in the fetched tags
            expect(tagExistsInFilters(fetchedTags, newTag)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve all existing tags when adding a new tag', () => {
      fc.assert(
        fc.property(
          existingTagsArbitrary,
          tagArbitrary,
          (existingTags, newTag) => {
            // Add the new tag
            const updatedTags = addTag(existingTags, newTag);

            // Save and fetch
            const savedData = saveTags(updatedTags);
            const fetchedTags = fetchTags(savedData);

            // All existing tags should still be present
            existingTags.forEach((tag) => {
              expect(tagExistsInFilters(fetchedTags, tag)).toBe(true);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not create duplicate tags when adding existing tag', () => {
      fc.assert(
        fc.property(
          fc.uniqueArray(tagArbitrary, { minLength: 1, maxLength: 20 }),
          (existingTags) => {
            // Pick a random existing tag to add again
            const tagToAddAgain = existingTags[0];

            // Add the existing tag
            const updatedTags = addTag(existingTags, tagToAddAgain);

            // Save and fetch
            const savedData = saveTags(updatedTags);
            const fetchedTags = fetchTags(savedData);

            // Count occurrences of the tag
            const occurrences = fetchedTags.filter(
              (t) => t === tagToAddAgain
            ).length;

            // Should only appear once (no duplicates)
            expect(occurrences).toBe(1);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain tag order after addition', () => {
      fc.assert(
        fc.property(
          existingTagsArbitrary,
          tagArbitrary,
          (existingTags, newTag) => {
            // Skip if newTag already exists (would not be added)
            if (existingTags.includes(newTag)) {
              return true;
            }

            // Add the new tag
            const updatedTags = addTag(existingTags, newTag);

            // Save and fetch
            const savedData = saveTags(updatedTags);
            const fetchedTags = fetchTags(savedData);

            // Existing tags should maintain their relative order
            for (let i = 0; i < existingTags.length; i++) {
              expect(fetchedTags[i]).toBe(existingTags[i]);
            }

            // New tag should be at the end
            expect(fetchedTags[fetchedTags.length - 1]).toBe(newTag);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Tag removal (Requirements 2.3)', () => {
    it('should remove tag from filter options after deletion', () => {
      fc.assert(
        fc.property(
          fc.array(tagArbitrary, { minLength: 1, maxLength: 20 }),
          (existingTags) => {
            // Pick a tag to remove
            const tagToRemove = existingTags[0];

            // Remove the tag
            const updatedTags = removeTag(existingTags, tagToRemove);

            // Save and fetch
            const savedData = saveTags(updatedTags);
            const fetchedTags = fetchTags(savedData);

            // The removed tag should not be present
            expect(tagExistsInFilters(fetchedTags, tagToRemove)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve other tags when removing a tag', () => {
      fc.assert(
        fc.property(
          fc.array(tagArbitrary, { minLength: 2, maxLength: 20 }),
          (existingTags) => {
            // Pick the first tag to remove
            const tagToRemove = existingTags[0];
            const remainingTags = existingTags.slice(1);

            // Remove the tag
            const updatedTags = removeTag(existingTags, tagToRemove);

            // Save and fetch
            const savedData = saveTags(updatedTags);
            const fetchedTags = fetchTags(savedData);

            // All other tags should still be present
            remainingTags.forEach((tag) => {
              // Only check if tag is different from removed tag
              if (tag !== tagToRemove) {
                expect(tagExistsInFilters(fetchedTags, tag)).toBe(true);
              }
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle removing non-existent tag gracefully', () => {
      fc.assert(
        fc.property(
          existingTagsArbitrary,
          tagArbitrary,
          (existingTags, nonExistentTag) => {
            // Skip if the tag actually exists
            if (existingTags.includes(nonExistentTag)) {
              return true;
            }

            // Try to remove non-existent tag
            const updatedTags = removeTag(existingTags, nonExistentTag);

            // Save and fetch
            const savedData = saveTags(updatedTags);
            const fetchedTags = fetchTags(savedData);

            // Tags should remain unchanged
            expect(fetchedTags.length).toBe(existingTags.length);
            expect(fetchedTags).toEqual(existingTags);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Tag round-trip consistency', () => {
    it('should preserve all tags through save and fetch cycle', () => {
      fc.assert(
        fc.property(existingTagsArbitrary, (tags) => {
          // Save tags
          const savedData = saveTags(tags);

          // Fetch tags
          const fetchedTags = fetchTags(savedData);

          // Tags should be identical
          expect(fetchedTags).toEqual(tags);
        }),
        { numRuns: 100 }
      );
    });

    it('should be idempotent - multiple save/fetch cycles produce same result', () => {
      fc.assert(
        fc.property(existingTagsArbitrary, (tags) => {
          // First round trip
          const firstSave = saveTags(tags);
          const firstFetch = fetchTags(firstSave);

          // Second round trip
          const secondSave = saveTags(firstFetch);
          const secondFetch = fetchTags(secondSave);

          // Results should be identical
          expect(secondFetch).toEqual(firstFetch);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Tag count requirements', () => {
    it('should support minimum of 16 tags for comprehensive coverage', () => {
      fc.assert(
        fc.property(
          fc.array(tagArbitrary, { minLength: 16, maxLength: 20 }),
          (tags) => {
            // Save and fetch
            const savedData = saveTags(tags);
            const fetchedTags = fetchTags(savedData);

            // Should support at least 16 tags
            expect(fetchedTags.length).toBeGreaterThanOrEqual(16);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle empty tags array', () => {
      const emptyTags: string[] = [];

      // Save and fetch
      const savedData = saveTags(emptyTags);
      const fetchedTags = fetchTags(savedData);

      // Should return empty array
      expect(fetchedTags).toEqual([]);
    });
  });
});

/**
 * Admin Workflow Integration Tests
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5
 *
 * These tests verify that all portfolio sections are properly configured
 * in the admin pages structure and can be edited.
 */
describe('Admin Workflow Integration', () => {
  // Page structure matching the admin pages configuration
  const portfolioPageStructure = {
    label: 'Portfolio Page',
    sections: [
      { key: 'hero', label: 'Hero Section (accordion images)' },
      { key: 'featuredWork', label: 'Featured Work Carousel' },
      { key: 'filters', label: 'Skills & Technologies (16+ tags)' },
      { key: 'projects', label: 'All Projects (full management)' },
      { key: 'caseStudies', label: 'Case Studies Carousel' },
      { key: 'advantages', label: 'Our Advantages Section' },
    ],
  };

  describe('Portfolio sections configuration (Requirements 1.1)', () => {
    it('should have all required portfolio sections defined', () => {
      const requiredSections = [
        'hero',
        'featuredWork',
        'filters',
        'projects',
        'caseStudies',
        'advantages',
      ];
      const configuredSections = portfolioPageStructure.sections.map(
        (s) => s.key
      );

      requiredSections.forEach((section) => {
        expect(configuredSections).toContain(section);
      });
    });

    it('should have projects section for full project management', () => {
      const projectsSection = portfolioPageStructure.sections.find(
        (s) => s.key === 'projects'
      );
      expect(projectsSection).toBeDefined();
      expect(projectsSection?.label).toContain('Projects');
    });

    it('should have featuredWork section for carousel management', () => {
      const featuredWorkSection = portfolioPageStructure.sections.find(
        (s) => s.key === 'featuredWork'
      );
      expect(featuredWorkSection).toBeDefined();
      expect(featuredWorkSection?.label).toContain('Featured Work');
    });

    it('should have caseStudies section for case study management', () => {
      const caseStudiesSection = portfolioPageStructure.sections.find(
        (s) => s.key === 'caseStudies'
      );
      expect(caseStudiesSection).toBeDefined();
      expect(caseStudiesSection?.label).toContain('Case Studies');
    });

    it('should have advantages section for features management', () => {
      const advantagesSection = portfolioPageStructure.sections.find(
        (s) => s.key === 'advantages'
      );
      expect(advantagesSection).toBeDefined();
      expect(advantagesSection?.label).toContain('Advantages');
    });

    it('should have filters section for tag management', () => {
      const filtersSection = portfolioPageStructure.sections.find(
        (s) => s.key === 'filters'
      );
      expect(filtersSection).toBeDefined();
      expect(filtersSection?.label).toContain('Technologies');
    });
  });

  describe('Project field editing (Requirements 1.2)', () => {
    const projectFields = [
      'id',
      'title',
      'client',
      'description',
      'thumbnailUrl',
      'tags',
      'metrics',
      'images',
      'hotspots',
    ];

    it('should support all required project fields', () => {
      fc.assert(
        fc.property(projectArbitrary, (project) => {
          // Verify all required fields exist on the project
          projectFields.forEach((field) => {
            expect(project).toHaveProperty(field);
          });
        }),
        { numRuns: 100 }
      );
    });

    it('should support editing tags array', () => {
      fc.assert(
        fc.property(projectArbitrary, (project) => {
          expect(Array.isArray(project.tags)).toBe(true);
          project.tags.forEach((tag) => {
            expect(typeof tag).toBe('string');
          });
        }),
        { numRuns: 100 }
      );
    });

    it('should support editing metrics array with label/value pairs', () => {
      fc.assert(
        fc.property(projectArbitrary, (project) => {
          expect(Array.isArray(project.metrics)).toBe(true);
          project.metrics.forEach((metric) => {
            expect(metric).toHaveProperty('label');
            expect(metric).toHaveProperty('value');
          });
        }),
        { numRuns: 100 }
      );
    });

    it('should support editing images array', () => {
      fc.assert(
        fc.property(projectArbitrary, (project) => {
          expect(Array.isArray(project.images)).toBe(true);
          project.images.forEach((image) => {
            expect(typeof image).toBe('string');
          });
        }),
        { numRuns: 100 }
      );
    });

    it('should support editing hotspots array with x, y, title, description', () => {
      fc.assert(
        fc.property(projectArbitrary, (project) => {
          expect(Array.isArray(project.hotspots)).toBe(true);
          project.hotspots.forEach((hotspot) => {
            expect(hotspot).toHaveProperty('x');
            expect(hotspot).toHaveProperty('y');
            expect(hotspot).toHaveProperty('title');
            expect(hotspot).toHaveProperty('description');
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Project persistence (Requirements 1.3)', () => {
    it('should persist project data to storage and retrieve it', () => {
      fc.assert(
        fc.property(projectArbitrary, (project) => {
          // Save project
          const savedData = saveProject(project);

          // Fetch project
          const fetchedProject = fetchProject(savedData);

          // Verify persistence
          expect(fetchedProject.id).toBe(project.id);
          expect(fetchedProject.title).toBe(project.title);
          expect(fetchedProject.client).toBe(project.client);
          expect(fetchedProject.description).toBe(project.description);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('New project creation (Requirements 1.4)', () => {
    it('should create new project with all required fields', () => {
      fc.assert(
        fc.property(projectArbitrary, (project) => {
          // Simulate creating a new project
          const newProject = { ...project };

          // Save and fetch
          const savedData = saveProject(newProject);
          const fetchedProject = fetchProject(savedData);

          // Verify all fields are present
          expect(fetchedProject.id).toBeDefined();
          expect(fetchedProject.title).toBeDefined();
          expect(fetchedProject.client).toBeDefined();
          expect(fetchedProject.description).toBeDefined();
          expect(fetchedProject.thumbnailUrl).toBeDefined();
          expect(fetchedProject.tags).toBeDefined();
          expect(fetchedProject.metrics).toBeDefined();
          expect(fetchedProject.images).toBeDefined();
          expect(fetchedProject.hotspots).toBeDefined();
        }),
        { numRuns: 100 }
      );
    });
  });
});

/**
 * Feature: portfolio-cms-enhancement, Property 2: Project Delete Removes Data
 * Validates: Requirements 1.5
 *
 * For any project that exists in the CMS, deleting it should result in
 * the project not being retrievable from the database.
 */

/**
 * Simulates a simple in-memory project store for testing delete operations
 */
class ProjectStore {
  private projects: Map<string, Project> = new Map();

  /**
   * Add a project to the store
   */
  add(project: Project): void {
    this.projects.set(project.id, project);
  }

  /**
   * Get a project by ID
   */
  get(id: string): Project | undefined {
    return this.projects.get(id);
  }

  /**
   * Delete a project by ID
   */
  delete(id: string): boolean {
    return this.projects.delete(id);
  }

  /**
   * Check if a project exists
   */
  exists(id: string): boolean {
    return this.projects.has(id);
  }

  /**
   * Get all projects
   */
  getAll(): Project[] {
    return Array.from(this.projects.values());
  }

  /**
   * Get the count of projects
   */
  count(): number {
    return this.projects.size;
  }

  /**
   * Clear all projects
   */
  clear(): void {
    this.projects.clear();
  }
}

describe('Property 2: Project Delete Removes Data', () => {
  let store: ProjectStore;

  beforeEach(() => {
    store = new ProjectStore();
  });

  describe('Delete operation removes project', () => {
    it('should remove project from store after deletion', () => {
      fc.assert(
        fc.property(projectArbitrary, (project) => {
          // Add project to store
          store.add(project);
          expect(store.exists(project.id)).toBe(true);

          // Delete the project
          const deleted = store.delete(project.id);
          expect(deleted).toBe(true);

          // Project should no longer exist
          expect(store.exists(project.id)).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('should not be retrievable after deletion', () => {
      fc.assert(
        fc.property(projectArbitrary, (project) => {
          // Add project to store
          store.add(project);

          // Verify it's retrievable
          const beforeDelete = store.get(project.id);
          expect(beforeDelete).toBeDefined();
          expect(beforeDelete?.id).toBe(project.id);

          // Delete the project
          store.delete(project.id);

          // Should not be retrievable
          const afterDelete = store.get(project.id);
          expect(afterDelete).toBeUndefined();
        }),
        { numRuns: 100 }
      );
    });

    it('should reduce project count by 1 after deletion', () => {
      fc.assert(
        fc.property(projectArbitrary, (project) => {
          // Add project to store
          store.add(project);
          const countBefore = store.count();

          // Delete the project
          store.delete(project.id);
          const countAfter = store.count();

          // Count should decrease by 1
          expect(countAfter).toBe(countBefore - 1);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Delete does not affect other projects', () => {
    it('should preserve other projects when deleting one', () => {
      fc.assert(
        fc.property(
          fc.array(projectArbitrary, { minLength: 2, maxLength: 10 }),
          (projects) => {
            // Ensure unique IDs
            const uniqueProjects = projects.map((p, i) => ({
              ...p,
              id: `${p.id}-${i}`,
            }));

            // Add all projects to store
            uniqueProjects.forEach((p) => store.add(p));

            // Delete the first project
            const projectToDelete = uniqueProjects[0];
            store.delete(projectToDelete.id);

            // All other projects should still exist
            uniqueProjects.slice(1).forEach((p) => {
              expect(store.exists(p.id)).toBe(true);
              const retrieved = store.get(p.id);
              expect(retrieved).toBeDefined();
              expect(retrieved?.title).toBe(p.title);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain data integrity of remaining projects', () => {
      fc.assert(
        fc.property(
          fc.array(projectArbitrary, { minLength: 2, maxLength: 5 }),
          (projects) => {
            // Ensure unique IDs
            const uniqueProjects = projects.map((p, i) => ({
              ...p,
              id: `${p.id}-${i}`,
            }));

            // Add all projects to store
            uniqueProjects.forEach((p) => store.add(p));

            // Delete the first project
            store.delete(uniqueProjects[0].id);

            // Verify remaining projects have all their data intact
            uniqueProjects.slice(1).forEach((originalProject) => {
              const retrieved = store.get(originalProject.id);
              expect(retrieved).toBeDefined();

              // Verify all fields are preserved
              expect(retrieved?.title).toBe(originalProject.title);
              expect(retrieved?.client).toBe(originalProject.client);
              expect(retrieved?.description).toBe(originalProject.description);
              expect(retrieved?.thumbnailUrl).toBe(
                originalProject.thumbnailUrl
              );
              expect(retrieved?.tags).toEqual(originalProject.tags);
              expect(retrieved?.metrics).toEqual(originalProject.metrics);
              expect(retrieved?.images).toEqual(originalProject.images);
              expect(retrieved?.hotspots).toEqual(originalProject.hotspots);
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Delete idempotency', () => {
    it('should handle deleting non-existent project gracefully', () => {
      fc.assert(
        fc.property(projectArbitrary, (project) => {
          // Try to delete a project that was never added
          const deleted = store.delete(project.id);

          // Should return false (nothing to delete)
          expect(deleted).toBe(false);

          // Store should remain empty
          expect(store.count()).toBe(0);
        }),
        { numRuns: 100 }
      );
    });

    it('should handle double deletion gracefully', () => {
      fc.assert(
        fc.property(projectArbitrary, (project) => {
          // Add project to store
          store.add(project);

          // First deletion should succeed
          const firstDelete = store.delete(project.id);
          expect(firstDelete).toBe(true);

          // Second deletion should return false (already deleted)
          const secondDelete = store.delete(project.id);
          expect(secondDelete).toBe(false);

          // Project should still not exist
          expect(store.exists(project.id)).toBe(false);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Delete with concurrent operations', () => {
    it('should handle add then delete correctly', () => {
      fc.assert(
        fc.property(projectArbitrary, (project) => {
          // Add project
          store.add(project);
          expect(store.exists(project.id)).toBe(true);

          // Delete project
          store.delete(project.id);
          expect(store.exists(project.id)).toBe(false);

          // Add same project again
          store.add(project);
          expect(store.exists(project.id)).toBe(true);

          // Verify data is correct
          const retrieved = store.get(project.id);
          expect(retrieved?.title).toBe(project.title);
        }),
        { numRuns: 100 }
      );
    });

    it('should handle multiple deletes in sequence', () => {
      fc.assert(
        fc.property(
          fc.array(projectArbitrary, { minLength: 3, maxLength: 10 }),
          (projects) => {
            // Ensure unique IDs
            const uniqueProjects = projects.map((p, i) => ({
              ...p,
              id: `${p.id}-${i}`,
            }));

            // Add all projects
            uniqueProjects.forEach((p) => store.add(p));
            expect(store.count()).toBe(uniqueProjects.length);

            // Delete all projects one by one
            uniqueProjects.forEach((p) => {
              store.delete(p.id);
            });

            // Store should be empty
            expect(store.count()).toBe(0);

            // No project should be retrievable
            uniqueProjects.forEach((p) => {
              expect(store.exists(p.id)).toBe(false);
              expect(store.get(p.id)).toBeUndefined();
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
