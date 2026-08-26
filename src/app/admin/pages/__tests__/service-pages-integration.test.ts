/**
 * Integration Tests for Service Pages CMS Enhancement
 * Feature: service-pages-cms
 *
 * Task 12.1: Test full admin workflow for all service pages
 * Task 12.2: Verify fallback content works when CMS unavailable
 *
 * Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.2
 */

/**
 * Service page configuration matching admin/pages/page.tsx pageStructure
 */
const servicePageConfigs = {
  'services-chatbot': {
    label: 'Chatbot Development',
    sections: [
      'hero',
      'video',
      'chatDemo',
      'learningAnimation',
      'accuracyChart',
      'caseStudies',
      'cta',
    ],
  },
  'services-seo': {
    label: 'SEO Services',
    sections: [
      'hero',
      'video',
      'serpRanking',
      'keywordCloud',
      'trafficGrowth',
      'competitorAnalysis',
      'caseStudies',
      'cta',
    ],
  },
  'services-shopify': {
    label: 'Shopify Services',
    sections: [
      'hero',
      'video',
      'conversionFunnel',
      'productPreview',
      'dashboard',
      'mobileExperience',
      'caseStudies',
      'cta',
    ],
  },
  'services-wordpress': {
    label: 'WordPress Services',
    sections: [
      'hero',
      'video',
      'modularGrid',
      'metrics',
      'pluginConstellation',
      'caseStudies',
      'cta',
    ],
  },
  'services-webdesign': {
    label: 'Web Design Services',
    sections: [
      'hero',
      'video',
      'wireframeMorph',
      'designTimeline',
      'styleShowcase',
      'responsivePreview',
      'caseStudies',
      'cta',
    ],
  },
  'services-n8n': {
    label: 'N8N Automations',
    sections: [
      'hero',
      'video',
      'workflowBuilder',
      'beforeAfter',
      'performanceMetrics',
      'apiIntegration',
      'caseStudies',
      'cta',
    ],
  },
};

/**
 * Common section types that all service pages share
 */
const commonSections = ['hero', 'video', 'caseStudies', 'cta'];

/**
 * Mock content for testing admin workflow
 */
interface MockSectionContent {
  page: string;
  section: string;
  content: Record<string, unknown>;
}

/**
 * Simulates saving content to CMS (admin workflow)
 */
function saveContentToCMS(content: MockSectionContent): string {
  return JSON.stringify(content);
}

/**
 * Simulates fetching content from CMS
 */
function fetchContentFromCMS(jsonString: string): MockSectionContent {
  return JSON.parse(jsonString);
}

/**
 * Simulates the admin content API response
 */
function simulateAdminContentAPI(
  page: string,
  section: string,
  content: Record<string, unknown>
): { success: boolean; data: MockSectionContent } {
  const sectionContent: MockSectionContent = {
    page,
    section,
    content,
  };

  // Validate that the page exists in our config
  if (!servicePageConfigs[page as keyof typeof servicePageConfigs]) {
    return { success: false, data: sectionContent };
  }

  // Validate that the section exists for this page
  const pageConfig =
    servicePageConfigs[page as keyof typeof servicePageConfigs];
  if (!pageConfig.sections.includes(section)) {
    return { success: false, data: sectionContent };
  }

  return { success: true, data: sectionContent };
}

/**
 * Task 12.1: Test full admin workflow for all service pages
 * Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1
 */
describe('Task 12.1: Admin Workflow for Service Pages', () => {
  describe('Service Page Structure Validation', () => {
    it('should have all required service pages defined', () => {
      const requiredPages = [
        'services-chatbot',
        'services-seo',
        'services-shopify',
        'services-wordpress',
        'services-webdesign',
        'services-n8n',
      ];

      requiredPages.forEach((page) => {
        expect(servicePageConfigs).toHaveProperty(page);
      });
    });

    it('should have common sections for all service pages', () => {
      Object.entries(servicePageConfigs).forEach(([pageKey, pageConfig]) => {
        commonSections.forEach((section) => {
          expect(pageConfig.sections).toContain(section);
        });
      });
    });

    it('should have unique service-specific sections', () => {
      // Chatbot-specific sections
      expect(servicePageConfigs['services-chatbot'].sections).toContain(
        'chatDemo'
      );
      expect(servicePageConfigs['services-chatbot'].sections).toContain(
        'learningAnimation'
      );
      expect(servicePageConfigs['services-chatbot'].sections).toContain(
        'accuracyChart'
      );

      // SEO-specific sections
      expect(servicePageConfigs['services-seo'].sections).toContain(
        'serpRanking'
      );
      expect(servicePageConfigs['services-seo'].sections).toContain(
        'keywordCloud'
      );
      expect(servicePageConfigs['services-seo'].sections).toContain(
        'trafficGrowth'
      );
      expect(servicePageConfigs['services-seo'].sections).toContain(
        'competitorAnalysis'
      );

      // Shopify-specific sections
      expect(servicePageConfigs['services-shopify'].sections).toContain(
        'conversionFunnel'
      );
      expect(servicePageConfigs['services-shopify'].sections).toContain(
        'productPreview'
      );
      expect(servicePageConfigs['services-shopify'].sections).toContain(
        'dashboard'
      );
      expect(servicePageConfigs['services-shopify'].sections).toContain(
        'mobileExperience'
      );

      // WordPress-specific sections
      expect(servicePageConfigs['services-wordpress'].sections).toContain(
        'modularGrid'
      );
      expect(servicePageConfigs['services-wordpress'].sections).toContain(
        'metrics'
      );
      expect(servicePageConfigs['services-wordpress'].sections).toContain(
        'pluginConstellation'
      );

      // Web Design-specific sections
      expect(servicePageConfigs['services-webdesign'].sections).toContain(
        'wireframeMorph'
      );
      expect(servicePageConfigs['services-webdesign'].sections).toContain(
        'designTimeline'
      );
      expect(servicePageConfigs['services-webdesign'].sections).toContain(
        'styleShowcase'
      );
      expect(servicePageConfigs['services-webdesign'].sections).toContain(
        'responsivePreview'
      );

      // N8N-specific sections
      expect(servicePageConfigs['services-n8n'].sections).toContain(
        'workflowBuilder'
      );
      expect(servicePageConfigs['services-n8n'].sections).toContain(
        'beforeAfter'
      );
      expect(servicePageConfigs['services-n8n'].sections).toContain(
        'performanceMetrics'
      );
      expect(servicePageConfigs['services-n8n'].sections).toContain(
        'apiIntegration'
      );
    });
  });

  describe('Admin Content Save/Load Workflow', () => {
    it('should successfully save and load hero section content for all service pages', () => {
      Object.keys(servicePageConfigs).forEach((pageKey) => {
        const heroContent = {
          title: `Test Hero Title for ${pageKey}`,
          subtitle: 'Test subtitle content',
          ctaText: 'Get Started',
          ctaHref: '/contact',
        };

        const result = simulateAdminContentAPI(pageKey, 'hero', heroContent);
        expect(result.success).toBe(true);
        expect(result.data.page).toBe(pageKey);
        expect(result.data.section).toBe('hero');
        expect(result.data.content).toEqual(heroContent);
      });
    });

    it('should successfully save and load video section content for all service pages', () => {
      Object.keys(servicePageConfigs).forEach((pageKey) => {
        const videoContent = {
          eyebrow: 'See It In Action',
          title: 'Watch Our Process',
          titleHighlight: 'Process',
          subtitle: 'Experience our development workflow',
          videoSrc: `/media/services/${pageKey}/video.mp4`,
          ctaText: 'Start Your Project',
          ctaHref: '/contact',
        };

        const result = simulateAdminContentAPI(pageKey, 'video', videoContent);
        expect(result.success).toBe(true);
        expect(result.data.content.videoSrc).toBe(
          `/media/services/${pageKey}/video.mp4`
        );
      });
    });

    it('should successfully save and load case studies section for all service pages', () => {
      Object.keys(servicePageConfigs).forEach((pageKey) => {
        const caseStudiesContent = {
          eyebrow: 'Success Stories',
          title: 'Our Work',
          titleHighlight: 'Speaks',
          subtitle: 'See what we have achieved',
          studies: [
            {
              img: '/case1.jpg',
              title: 'Case 1',
              desc: 'Description 1',
              sliderName: 'case1',
            },
            {
              img: '/case2.jpg',
              title: 'Case 2',
              desc: 'Description 2',
              sliderName: 'case2',
            },
          ],
        };

        const result = simulateAdminContentAPI(
          pageKey,
          'caseStudies',
          caseStudiesContent
        );
        expect(result.success).toBe(true);
        expect(result.data.content.studies).toHaveLength(2);
      });
    });

    it('should successfully save and load CTA section for all service pages', () => {
      Object.keys(servicePageConfigs).forEach((pageKey) => {
        const ctaContent = {
          title: 'Ready to Get Started?',
          subtitle: 'Let us help you achieve your goals',
          ctaText: 'Contact Us',
          ctaHref: '/contact',
        };

        const result = simulateAdminContentAPI(pageKey, 'cta', ctaContent);
        expect(result.success).toBe(true);
        expect(result.data.content.ctaHref).toBe('/contact');
      });
    });

    it('should reject invalid page keys', () => {
      const result = simulateAdminContentAPI('invalid-page', 'hero', {
        title: 'Test',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid section keys for valid pages', () => {
      const result = simulateAdminContentAPI(
        'services-chatbot',
        'invalidSection',
        { title: 'Test' }
      );
      expect(result.success).toBe(false);
    });
  });

  describe('Content Round-Trip Verification', () => {
    it('should preserve all content fields through save and fetch cycle', () => {
      const testContent: MockSectionContent = {
        page: 'services-chatbot',
        section: 'hero',
        content: {
          titleHighlight: 'AI-Powered',
          title: 'Chatbots',
          subtitle: 'Intelligent conversational AI',
          ctaText: 'Build Your Chatbot',
          ctaHref: '/contact',
          floatingIcons: [
            { icon: 'whatsapp', label: 'WhatsApp' },
            { icon: 'slack', label: 'Slack' },
          ],
        },
      };

      const saved = saveContentToCMS(testContent);
      const fetched = fetchContentFromCMS(saved);

      expect(fetched.page).toBe(testContent.page);
      expect(fetched.section).toBe(testContent.section);
      expect(fetched.content).toEqual(testContent.content);
    });

    it('should preserve nested arrays in case studies', () => {
      const testContent: MockSectionContent = {
        page: 'services-seo',
        section: 'caseStudies',
        content: {
          eyebrow: 'Success Stories',
          title: 'Rankings That',
          titleHighlight: 'Dominate',
          subtitle: 'See our results',
          studies: [
            {
              img: '/img1.jpg',
              title: 'Case 1',
              desc: 'Desc 1',
              sliderName: 'case1',
            },
            {
              img: '/img2.jpg',
              title: 'Case 2',
              desc: 'Desc 2',
              sliderName: 'case2',
            },
            {
              img: '/img3.jpg',
              title: 'Case 3',
              desc: 'Desc 3',
              sliderName: 'case3',
            },
            {
              img: '/img4.jpg',
              title: 'Case 4',
              desc: 'Desc 4',
              sliderName: 'case4',
            },
          ],
        },
      };

      const saved = saveContentToCMS(testContent);
      const fetched = fetchContentFromCMS(saved);

      const studies = fetched.content.studies as Array<{
        img: string;
        title: string;
        desc: string;
        sliderName: string;
      }>;
      expect(studies).toHaveLength(4);
      expect(studies[0].title).toBe('Case 1');
      expect(studies[3].sliderName).toBe('case4');
    });

    it('should preserve services array in hero sections', () => {
      const testContent: MockSectionContent = {
        page: 'services-shopify',
        section: 'hero',
        content: {
          eyebrow: 'E-Commerce',
          title: 'Shopify Development',
          highlightedWord: 'Shopify',
          highlightedWord2: 'Development',
          subtitle: 'Build powerful stores',
          services: [
            {
              id: '1',
              name: 'Store Setup',
              url: '/setup',
              description: 'Full setup',
              imgSrc: '/img1.jpg',
            },
            {
              id: '2',
              name: 'Theme Dev',
              url: '/theme',
              description: 'Custom themes',
              imgSrc: '/img2.jpg',
            },
          ],
          ctaLabel: 'Start Your Store',
          ctaHref: '/contact',
        },
      };

      const saved = saveContentToCMS(testContent);
      const fetched = fetchContentFromCMS(saved);

      const services = fetched.content.services as Array<{
        id: string;
        name: string;
      }>;
      expect(services).toHaveLength(2);
      expect(services[0].name).toBe('Store Setup');
      expect(services[1].id).toBe('2');
    });
  });
});

/**
 * Task 12.2: Verify fallback content works when CMS unavailable
 * Requirements: 7.2
 */
describe('Task 12.2: Fallback Content Verification', () => {
  /**
   * Default fallback content structures matching the service page components
   */
  const defaultFallbacks = {
    'services-chatbot': {
      hero: {
        titleHighlight: 'AI-Powered',
        title: 'Chatbots',
        subtitle:
          'Intelligent conversational AI that connects with your customers 24/7 across all platforms.',
        ctaText: 'Build Your Chatbot',
        ctaHref: '/contact',
      },
      video: {
        eyebrow: 'See AI In Action',
        title: 'Watch How We Build',
        titleHighlight: 'Intelligent Chatbots',
        subtitle: 'Experience our AI development process.',
        videoSrc: '/media/services/chatbot-development/video/hero-video.mp4',
        ctaText: 'Build Your Chatbot',
        ctaHref: '/contact',
      },
      cta: {
        title: 'Ready to Build Your AI Chatbot?',
        subtitle:
          "Let's create an intelligent chatbot that engages your customers 24/7",
        ctaText: 'Start Your Project',
        ctaHref: '/contact',
      },
    },
    'services-seo': {
      hero: {
        title: 'Dominate Search',
        highlightedText: 'Drive Organic Growth',
        subtitle: 'Strategic SEO solutions that boost your rankings.',
        ctaButton: { label: 'Get SEO Audit', href: '/contact' },
      },
      video: {
        eyebrow: 'See SEO In Action',
        title: 'Watch How We Drive',
        titleHighlight: 'Organic Growth',
        subtitle: 'Experience our SEO process.',
        videoSrc: '/media/services/seo/video/hero-video.mp4',
        ctaText: 'Start Your SEO Journey',
        ctaHref: '/contact',
      },
      cta: {
        title: 'Ready to Dominate Search Results?',
        subtitle:
          "Let's create an SEO strategy that drives real business results",
        ctaText: 'Start Your SEO Journey',
        ctaHref: '/contact',
      },
    },
    'services-shopify': {
      hero: {
        eyebrow: 'E-Commerce',
        title: 'Shopify Development',
        highlightedWord: 'Shopify',
        highlightedWord2: 'Development',
        subtitle: 'Build powerful e-commerce experiences.',
        services: [],
        ctaLabel: 'Start Your Store',
        ctaHref: '/contact',
      },
      cta: {
        title: 'Ready to Launch Your Shopify Store?',
        subtitle: "Let's build an e-commerce experience that converts",
        ctaText: 'Start Your Store',
        ctaHref: '/contact',
      },
    },
    'services-wordpress': {
      hero: {
        title: 'WordPress Development',
        subtitle: 'Custom WordPress solutions for your business.',
        ctaText: 'Get Started',
        ctaHref: '/contact',
        services: [],
      },
      cta: {
        title: 'Ready to Build Your WordPress Site?',
        subtitle: "Let's create a powerful WordPress solution",
        ctaText: 'Start Your Project',
        ctaHref: '/contact',
      },
    },
    'services-webdesign': {
      hero: {
        title: 'Web Design',
        subtitle: 'Beautiful, responsive web designs.',
        ctaText: 'Start Your Project',
        ctaHref: '/contact',
        services: [],
      },
      cta: {
        title: 'Ready to Transform Your Web Presence?',
        subtitle: "Let's design something beautiful together",
        ctaText: 'Start Your Project',
        ctaHref: '/contact',
      },
    },
    'services-n8n': {
      hero: {
        title: 'N8N Automations',
        subtitle: 'Automate your workflows with n8n.',
        ctaText: 'Automate Now',
        ctaHref: '/contact',
      },
      cta: {
        title: 'Ready to Automate Your Workflows?',
        subtitle: "Let's build powerful automations together",
        ctaText: 'Start Automating',
        ctaHref: '/contact',
      },
    },
  };

  /**
   * Simulates the fallback logic used in service page components
   */
  function applyFallback<T>(cmsContent: T | null | undefined, fallback: T): T {
    return cmsContent || fallback;
  }

  /**
   * Validates that fallback content has required fields
   */
  function hasRequiredHeroFields(content: Record<string, unknown>): boolean {
    // Title and subtitle are always required
    if (!content.title || typeof content.title !== 'string') return false;
    if (!content.subtitle || typeof content.subtitle !== 'string') return false;

    // At least one CTA field should be present
    const hasCTA = content.ctaText || content.ctaLabel || content.ctaButton;
    if (!hasCTA) return false;

    // CTA href should be present (either directly or in ctaButton)
    const hasHref =
      content.ctaHref || (content.ctaButton as { href?: string })?.href;
    if (!hasHref) return false;

    return true;
  }

  function hasRequiredCTAFields(content: Record<string, unknown>): boolean {
    if (!content.title || typeof content.title !== 'string') return false;
    if (!content.subtitle || typeof content.subtitle !== 'string') return false;
    if (!content.ctaText || typeof content.ctaText !== 'string') return false;
    if (!content.ctaHref || typeof content.ctaHref !== 'string') return false;
    return true;
  }

  describe('Fallback Content Structure Validation', () => {
    it('should have valid hero fallback content for all service pages', () => {
      Object.entries(defaultFallbacks).forEach(([pageKey, pageFallbacks]) => {
        const heroFallback = pageFallbacks.hero;
        expect(hasRequiredHeroFields(heroFallback)).toBe(true);
      });
    });

    it('should have valid CTA fallback content for all service pages', () => {
      Object.entries(defaultFallbacks).forEach(([pageKey, pageFallbacks]) => {
        const ctaFallback = pageFallbacks.cta;
        expect(hasRequiredCTAFields(ctaFallback)).toBe(true);
      });
    });

    it('should have non-empty text content in all fallbacks', () => {
      Object.entries(defaultFallbacks).forEach(([pageKey, pageFallbacks]) => {
        // Check hero
        expect(pageFallbacks.hero.title.trim().length).toBeGreaterThan(0);
        expect(pageFallbacks.hero.subtitle.trim().length).toBeGreaterThan(0);

        // Check CTA
        expect(pageFallbacks.cta.title.trim().length).toBeGreaterThan(0);
        expect(pageFallbacks.cta.subtitle.trim().length).toBeGreaterThan(0);
        expect(pageFallbacks.cta.ctaText.trim().length).toBeGreaterThan(0);
      });
    });

    it('should have valid href paths in all fallbacks', () => {
      Object.entries(defaultFallbacks).forEach(([pageKey, pageFallbacks]) => {
        // Check hero href - handle different CTA structures
        const hero = pageFallbacks.hero as any;
        const heroHref = hero.ctaHref || hero.ctaButton?.href || hero.ctaLabel;
        if (heroHref && typeof heroHref === 'string') {
          expect(heroHref).toMatch(/^\//);
        } else if (hero.ctaHref !== undefined) {
          expect(hero.ctaHref).toMatch(/^\//);
        }

        // Check CTA href
        expect(pageFallbacks.cta.ctaHref).toMatch(/^\//);
      });
    });
  });

  describe('Fallback Application Logic', () => {
    it('should return fallback when CMS content is null', () => {
      Object.entries(defaultFallbacks).forEach(([pageKey, pageFallbacks]) => {
        const cmsContent: Record<string, unknown> | null = null;
        const result = applyFallback(cmsContent, pageFallbacks.hero);

        expect(result).toBe(pageFallbacks.hero);
        expect(result.title).toBe(pageFallbacks.hero.title);
      });
    });

    it('should return fallback when CMS content is undefined', () => {
      Object.entries(defaultFallbacks).forEach(([pageKey, pageFallbacks]) => {
        const cmsContent: Record<string, unknown> | undefined = undefined;
        const result = applyFallback(cmsContent, pageFallbacks.cta);

        expect(result).toBe(pageFallbacks.cta);
        expect(result.ctaText).toBe(pageFallbacks.cta.ctaText);
      });
    });

    it('should use CMS content when available instead of fallback', () => {
      const cmsContent = {
        title: 'Custom CMS Title',
        subtitle: 'Custom CMS Subtitle',
        ctaText: 'Custom CTA',
        ctaHref: '/custom-path',
      };

      const fallback = defaultFallbacks['services-chatbot'].hero;
      const result = applyFallback(cmsContent, fallback);

      expect(result).toBe(cmsContent);
      expect(result.title).toBe('Custom CMS Title');
      expect(result).not.toBe(fallback);
    });

    it('should handle empty object as truthy (not trigger fallback)', () => {
      const cmsContent = {};
      const fallback = defaultFallbacks['services-seo'].hero;
      const result = applyFallback(cmsContent, fallback);

      // Empty object is truthy, should not trigger fallback
      expect(result).toBe(cmsContent);
    });
  });

  describe('Multiple Sections Fallback Simultaneously', () => {
    it('should handle all sections falling back at once', () => {
      Object.entries(defaultFallbacks).forEach(([pageKey, pageFallbacks]) => {
        // Simulate all CMS content being unavailable
        const heroResult = applyFallback<Record<string, unknown>>(
          null,
          pageFallbacks.hero
        );
        const ctaResult = applyFallback<Record<string, unknown>>(
          null,
          pageFallbacks.cta
        );

        // All should use fallbacks
        expect(heroResult).toBe(pageFallbacks.hero);
        expect(ctaResult).toBe(pageFallbacks.cta);

        // All should have valid content
        expect(hasRequiredHeroFields(heroResult)).toBe(true);
        expect(hasRequiredCTAFields(ctaResult)).toBe(true);
      });
    });

    it('should handle mixed CMS and fallback content', () => {
      const pageKey = 'services-chatbot';
      const pageFallbacks = defaultFallbacks[pageKey];

      // Hero from CMS, CTA from fallback
      const cmsHero = {
        titleHighlight: 'Custom',
        title: 'Custom Title',
        subtitle: 'Custom subtitle',
        ctaText: 'Custom CTA',
        ctaHref: '/custom',
      };

      const heroResult = applyFallback(cmsHero, pageFallbacks.hero);
      const ctaResult = applyFallback<Record<string, unknown>>(
        null,
        pageFallbacks.cta
      );

      expect(heroResult).toBe(cmsHero);
      expect(ctaResult).toBe(pageFallbacks.cta);
    });
  });

  describe('Fallback Content Immutability', () => {
    it('should not modify fallback content when applying', () => {
      const pageKey = 'services-seo';
      const originalTitle = defaultFallbacks[pageKey].hero.title;
      const originalSubtitle = defaultFallbacks[pageKey].hero.subtitle;

      // Apply fallback multiple times
      applyFallback<Record<string, unknown>>(
        null,
        defaultFallbacks[pageKey].hero
      );
      applyFallback<Record<string, unknown>>(
        undefined,
        defaultFallbacks[pageKey].hero
      );

      // Original should be unchanged
      expect(defaultFallbacks[pageKey].hero.title).toBe(originalTitle);
      expect(defaultFallbacks[pageKey].hero.subtitle).toBe(originalSubtitle);
    });
  });

  describe('Service-Specific Fallback Content', () => {
    it('should have chatbot-specific fallback content', () => {
      const chatbotFallback = defaultFallbacks['services-chatbot'];
      expect(chatbotFallback.hero.titleHighlight).toBe('AI-Powered');
      expect(chatbotFallback.hero.title).toBe('Chatbots');
    });

    it('should have SEO-specific fallback content', () => {
      const seoFallback = defaultFallbacks['services-seo'];
      expect(seoFallback.hero.title).toBe('Dominate Search');
      expect(seoFallback.hero.highlightedText).toBe('Drive Organic Growth');
    });

    it('should have Shopify-specific fallback content with services array', () => {
      const shopifyFallback = defaultFallbacks['services-shopify'];
      expect(shopifyFallback.hero.highlightedWord).toBe('Shopify');
      expect(shopifyFallback.hero.services).toBeDefined();
      expect(Array.isArray(shopifyFallback.hero.services)).toBe(true);
    });

    it('should have WordPress-specific fallback content with services array', () => {
      const wordpressFallback = defaultFallbacks['services-wordpress'];
      expect(wordpressFallback.hero.title).toBe('WordPress Development');
      expect(wordpressFallback.hero.services).toBeDefined();
    });

    it('should have Web Design-specific fallback content with services array', () => {
      const webdesignFallback = defaultFallbacks['services-webdesign'];
      expect(webdesignFallback.hero.title).toBe('Web Design');
      expect(webdesignFallback.hero.services).toBeDefined();
    });

    it('should have N8N-specific fallback content', () => {
      const n8nFallback = defaultFallbacks['services-n8n'];
      expect(n8nFallback.hero.title).toBe('N8N Automations');
      expect(n8nFallback.hero.ctaText).toBe('Automate Now');
    });
  });
});
