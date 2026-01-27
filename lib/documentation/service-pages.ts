import { ServicePageDocumentation, SectionDocumentation } from './types';

/**
 * Complete documentation for all 5 service pages
 * Each service page follows a similar structure with Hero, Features, Process, CTA
 */

const createServicePageDocumentation = (
  slug: string,
  name: string,
  features: string[]
): ServicePageDocumentation => {
  const sections: SectionDocumentation[] = [
    {
      id: `${slug}-hero`,
      name: 'Service Hero Section',
      status: 'CMS Enabled',
      filePath: `app/(public)/services/${slug}/page.tsx`,
      lineNumbers: 'Lines 1-100',
      editableContent: [
        { name: 'Page title', line: '20-30', description: 'Service name and headline' },
        { name: 'Subtitle', line: '35-45', description: 'Service description' },
        { name: 'CTA buttons', line: '50-70', description: 'Primary and secondary CTAs' },
        { name: 'Hero image', line: '75-85', description: 'Hero background or featured image' },
      ],
      images: {
        folder: `public/media/services/${slug}`,
        files: [],
        requirements: {
          dimensions: '1920x1080px (16:9 ratio)',
          format: ['jpg', 'webp'],
          maxSize: '600KB',
        },
      },
      icons: {
        source: 'Lucide React',
        used: ['ArrowRight', 'CheckCircle', 'Sparkles'],
      },
      cmsPath: `/admin/pages/services-${slug}`,
      cmsEnabled: true,
      description: 'Service page hero with title, description, and CTA. Sets the tone for the service.',
    },
    {
      id: `${slug}-features`,
      name: 'Features Section',
      status: 'CMS Enabled',
      filePath: `app/(public)/services/${slug}/page.tsx`,
      lineNumbers: 'Lines 100-250',
      editableContent: [
        { name: 'Features array', line: '110-200', description: 'List of service features' },
        { name: 'Feature titles', line: '110-200', description: 'Feature headings' },
        { name: 'Feature descriptions', line: '110-200', description: 'Feature details' },
        { name: 'Feature icons', line: '110-200', description: 'Visual icons' },
      ],
      images: {
        folder: `public/media/services/${slug}/features`,
        files: [],
        requirements: {
          dimensions: '800x600px',
          format: ['jpg', 'webp', 'png'],
          maxSize: '300KB',
        },
      },
      icons: {
        source: 'Lucide React',
        used: ['Check', 'Star', 'Zap', 'Shield', 'Target'],
      },
      cmsPath: `/admin/pages/services-${slug}`,
      cmsEnabled: true,
      description: 'Grid or list of key features and benefits. Highlights service value propositions.',
    },
    {
      id: `${slug}-process`,
      name: 'Process Timeline',
      status: 'CMS Enabled',
      filePath: `app/(public)/services/${slug}/page.tsx`,
      lineNumbers: 'Lines 250-350',
      editableContent: [
        { name: 'Process steps array', line: '260-330', description: 'Step-by-step process' },
        { name: 'Step titles', line: '260-330', description: 'Process step names' },
        { name: 'Step descriptions', line: '260-330', description: 'What happens in each step' },
        { name: 'Step numbers', line: '260-330', description: 'Step ordering' },
      ],
      images: {
        folder: `public/media/services/${slug}/process`,
        files: [],
      },
      icons: {
        source: 'Lucide React',
        used: ['Circle', 'ArrowRight', 'CheckCircle'],
      },
      cmsPath: `/admin/pages/services-${slug}`,
      cmsEnabled: true,
      description: 'Visual timeline showing service delivery process. Builds transparency and trust.',
    },
    {
      id: `${slug}-case-studies`,
      name: 'Service Case Studies',
      status: 'CMS Enabled',
      filePath: `app/(public)/services/${slug}/page.tsx`,
      lineNumbers: 'Lines 350-450',
      editableContent: [
        { name: 'Case studies array', line: '360-430', description: 'Related case studies' },
        { name: 'Project names', line: '360-430', description: 'Project titles' },
        { name: 'Results', line: '360-430', description: 'Measurable outcomes' },
        { name: 'Client testimonials', line: '360-430', description: 'Client quotes' },
      ],
      images: {
        folder: `public/media/services/${slug}/case-studies`,
        files: [],
        requirements: {
          dimensions: '1200x800px',
          format: ['jpg', 'webp'],
          maxSize: '500KB',
        },
      },
      icons: {
        source: 'Lucide React',
        used: ['TrendingUp', 'Award', 'Star'],
      },
      cmsPath: `/admin/pages/services-${slug}`,
      cmsEnabled: true,
      description: 'Showcase of relevant projects and success stories. Demonstrates expertise.',
    },
    {
      id: `${slug}-pricing`,
      name: 'Pricing Section',
      status: 'CMS Enabled',
      filePath: `app/(public)/services/${slug}/page.tsx`,
      lineNumbers: 'Lines 450-550',
      editableContent: [
        { name: 'Pricing tiers', line: '460-530', description: 'Service packages' },
        { name: 'Package names', line: '460-530', description: 'Tier names (Basic, Pro, Enterprise)' },
        { name: 'Prices', line: '460-530', description: 'Pricing information' },
        { name: 'Features included', line: '460-530', description: 'What\'s included in each tier' },
      ],
      images: {
        folder: 'None',
        files: [],
      },
      icons: {
        source: 'Lucide React',
        used: ['Check', 'X', 'DollarSign'],
      },
      cmsPath: `/admin/pages/services-${slug}`,
      cmsEnabled: true,
      description: 'Pricing tiers and packages. Clear value communication and conversion opportunity.',
    },
    {
      id: `${slug}-faq`,
      name: 'FAQ Section',
      status: 'CMS Enabled',
      filePath: `app/(public)/services/${slug}/page.tsx`,
      lineNumbers: 'Lines 550-650',
      editableContent: [
        { name: 'FAQ items array', line: '560-630', description: 'Frequently asked questions' },
        { name: 'Questions', line: '560-630', description: 'FAQ questions' },
        { name: 'Answers', line: '560-630', description: 'FAQ answers' },
      ],
      images: {
        folder: 'None',
        files: [],
      },
      icons: {
        source: 'Lucide React',
        used: ['HelpCircle', 'ChevronDown', 'ChevronUp'],
      },
      cmsPath: `/admin/pages/services-${slug}`,
      cmsEnabled: true,
      description: 'Common questions and answers. Addresses objections and builds confidence.',
    },
    {
      id: `${slug}-cta`,
      name: 'Service CTA',
      status: 'CMS Enabled',
      filePath: `app/(public)/services/${slug}/page.tsx`,
      lineNumbers: 'Lines 650-750',
      editableContent: [
        { name: 'CTA heading', line: '660-670', description: 'Final call to action' },
        { name: 'CTA text', line: '675-685', description: 'Compelling message' },
        { name: 'CTA button', line: '690-700', description: 'Primary action button' },
        { name: 'Contact info', line: '710-730', description: 'Email, phone for inquiries' },
      ],
      images: {
        folder: 'None',
        files: [],
      },
      icons: {
        source: 'Lucide React',
        used: ['ArrowRight', 'Mail', 'Phone', 'Calendar'],
      },
      cmsPath: `/admin/pages/services-${slug}`,
      cmsEnabled: true,
      description: 'Final conversion opportunity. Encourages visitors to take action.',
    },
  ];

  return {
    id: slug,
    name,
    path: `/services/${slug}`,
    slug,
    sections,
    description: `Complete documentation for ${name} service page including all sections and editable content.`,
    features,
  };
};

export const servicePages: ServicePageDocumentation[] = [
  createServicePageDocumentation(
    'chatbot-development',
    'Chatbot Development',
    [
      'AI-powered conversational interfaces',
      'Natural language processing',
      'Multi-platform integration (Web, WhatsApp, Telegram)',
      'Custom training with business data',
      '24/7 automated customer support',
      'Lead generation and qualification',
      'Analytics and reporting',
    ]
  ),
  createServicePageDocumentation(
    'n8n-automations',
    'N8N Automations',
    [
      'Workflow automation',
      'API integrations',
      'Data synchronization',
      'Automated reporting',
      'Email automation',
      'Custom triggers and actions',
      'Visual workflow builder',
      'Error handling and monitoring',
    ]
  ),
  createServicePageDocumentation(
    'web-design',
    'Web Design',
    [
      'Custom website design',
      'Responsive layouts',
      'Modern UI/UX',
      'Performance optimization',
      'SEO-friendly structure',
      'Accessibility compliance',
      'Brand identity integration',
      'Content management system',
    ]
  ),
  createServicePageDocumentation(
    'seo',
    'SEO Services',
    [
      'Technical SEO audit',
      'Keyword research and strategy',
      'On-page optimization',
      'Off-page SEO',
      'Local SEO',
      'Content optimization',
      'Link building',
      'Performance tracking',
      'Competitor analysis',
    ]
  ),
  createServicePageDocumentation(
    'shopify',
    'Shopify Development',
    [
      'Custom Shopify stores',
      'Theme customization',
      'App integration',
      'Payment gateway setup',
      'Product catalog management',
      'Conversion optimization',
      'Mobile commerce',
      'Store migration',
    ]
  ),
];
