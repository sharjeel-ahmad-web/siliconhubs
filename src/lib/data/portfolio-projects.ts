/**
 * @deprecated This file is deprecated and kept for reference only.
 *
 * Portfolio projects are now managed via the CMS (MongoDB).
 *
 * To edit portfolio projects:
 * 1. Go to /admin/pages
 * 2. Select "Portfolio Page"
 * 3. Edit the "All Projects" section
 *
 * The data in this file has been migrated to the seed content at:
 * app/api/seed/content/route.ts (portfolio/projects section)
 *
 * This file is preserved as a backup/reference for the original data structure.
 * DO NOT import from this file - use useSiteContent('portfolio', 'projects') instead.
 *
 * @see app/(public)/portfolio/page.tsx for CMS integration example
 */

export interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  thumbnailUrl: string;
  tags: string[];
  metrics: {
    label: string;
    value: string;
  }[];
  images: string[];
  hotspots: {
    x: number;
    y: number;
    title: string;
    description: string;
  }[];
}

/**
 * Each project has its own folder: public/media/portfolio/all-projects/project-{id}/
 *
 * Folder structure for each project:
 * - thumbnail.jpg (main card image)
 * - detail-1.jpg (popup image 1)
 * - detail-2.jpg (popup image 2)
 */
export const projects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform Redesign',
    client: 'TechStore Inc.',
    description:
      'Complete redesign of e-commerce platform with focus on conversion optimization and mobile experience.',
    thumbnailUrl: '/media/portfolio/all-projects/project-1/thumbnail.jpg',
    tags: ['Web Design', 'Shopify', 'SEO'],
    metrics: [
      { label: 'Conversion Rate', value: '+45%' },
      { label: 'Page Speed', value: '95/100' },
      { label: 'Mobile Traffic', value: '+60%' },
    ],
    images: [
      '/media/portfolio/all-projects/project-1/thumbnail.jpg',
      '/media/portfolio/all-projects/project-1/detail-1.jpg',
      '/media/portfolio/all-projects/project-1/detail-2.jpg',
    ],
    hotspots: [
      {
        x: 30,
        y: 40,
        title: 'Navigation',
        description: 'Simplified mega menu with visual categories',
      },
      {
        x: 70,
        y: 60,
        title: 'Product Grid',
        description: 'Optimized product cards with quick view',
      },
    ],
  },
  {
    id: '2',
    title: 'AI Chatbot Integration',
    client: 'Support Solutions',
    description:
      'Custom AI chatbot with natural language processing for customer support automation.',
    thumbnailUrl: '/media/portfolio/all-projects/project-2/thumbnail.jpg',
    tags: ['Chatbot Development', 'N8N Automations'],
    metrics: [
      { label: 'Response Time', value: '-80%' },
      { label: 'Customer Satisfaction', value: '4.8/5' },
      { label: 'Cost Savings', value: '$50K/year' },
    ],
    images: [
      '/media/portfolio/all-projects/project-2/thumbnail.jpg',
      '/media/portfolio/all-projects/project-2/detail-1.jpg',
      '/media/portfolio/all-projects/project-2/detail-2.jpg',
    ],
    hotspots: [
      {
        x: 50,
        y: 30,
        title: 'Chat Interface',
        description: 'Clean, intuitive chat UI',
      },
      {
        x: 50,
        y: 70,
        title: 'AI Engine',
        description: 'GPT-4 powered responses',
      },
    ],
  },
  {
    id: '3',
    title: 'WordPress Blog Platform',
    client: 'Content Creators Co.',
    description:
      'High-performance WordPress blog with custom theme and advanced SEO optimization.',
    thumbnailUrl: '/media/portfolio/all-projects/project-3/thumbnail.jpg',
    tags: ['WordPress', 'SEO', 'Web Design'],
    metrics: [
      { label: 'Organic Traffic', value: '+120%' },
      { label: 'Load Time', value: '1.2s' },
      { label: 'SEO Score', value: '98/100' },
    ],
    images: [
      '/media/portfolio/all-projects/project-3/thumbnail.jpg',
      '/media/portfolio/all-projects/project-3/detail-1.jpg',
      '/media/portfolio/all-projects/project-3/detail-2.jpg',
    ],
    hotspots: [
      {
        x: 40,
        y: 50,
        title: 'Article Layout',
        description: 'Optimized reading experience',
      },
      {
        x: 80,
        y: 30,
        title: 'Sidebar',
        description: 'Dynamic content recommendations',
      },
    ],
  },
  {
    id: '4',
    title: 'Automation Workflow System',
    client: 'Enterprise Corp',
    description:
      'Complex N8N automation workflows connecting multiple business systems.',
    thumbnailUrl: '/media/portfolio/all-projects/project-4/thumbnail.jpg',
    tags: ['N8N Automations'],
    metrics: [
      { label: 'Time Saved', value: '200hrs/month' },
      { label: 'Error Reduction', value: '-95%' },
      { label: 'ROI', value: '450%' },
    ],
    images: [
      '/media/portfolio/all-projects/project-4/thumbnail.jpg',
      '/media/portfolio/all-projects/project-4/detail-1.jpg',
      '/media/portfolio/all-projects/project-4/detail-2.jpg',
    ],
    hotspots: [
      {
        x: 25,
        y: 40,
        title: 'Trigger Nodes',
        description: 'Event-based workflow triggers',
      },
      {
        x: 75,
        y: 60,
        title: 'Integration',
        description: 'Multi-system data sync',
      },
    ],
  },
  {
    id: '5',
    title: 'SEO Campaign Success',
    client: 'Local Business Hub',
    description:
      'Comprehensive SEO strategy with technical optimization and content marketing.',
    thumbnailUrl: '/media/portfolio/all-projects/project-5/thumbnail.jpg',
    tags: ['SEO'],
    metrics: [
      { label: 'Keyword Rankings', value: '#1-3' },
      { label: 'Organic Traffic', value: '+250%' },
      { label: 'Lead Generation', value: '+180%' },
    ],
    images: [
      '/media/portfolio/all-projects/project-5/thumbnail.jpg',
      '/media/portfolio/all-projects/project-5/detail-1.jpg',
      '/media/portfolio/all-projects/project-5/detail-2.jpg',
    ],
    hotspots: [
      {
        x: 50,
        y: 40,
        title: 'Keyword Strategy',
        description: 'Targeted keyword clusters',
      },
      {
        x: 50,
        y: 70,
        title: 'Content Hub',
        description: 'Topic authority building',
      },
    ],
  },
  {
    id: '6',
    title: 'Shopify Store Launch',
    client: 'Fashion Boutique',
    description:
      'Custom Shopify store with advanced product filtering and checkout optimization.',
    thumbnailUrl: '/media/portfolio/all-projects/project-6/thumbnail.jpg',
    tags: ['Shopify', 'Web Design'],
    metrics: [
      { label: 'Conversion Rate', value: '3.8%' },
      { label: 'Average Order', value: '+35%' },
      { label: 'Cart Abandonment', value: '-40%' },
    ],
    images: [
      '/media/portfolio/all-projects/project-6/thumbnail.jpg',
      '/media/portfolio/all-projects/project-6/detail-1.jpg',
      '/media/portfolio/all-projects/project-6/detail-2.jpg',
    ],
    hotspots: [
      {
        x: 30,
        y: 50,
        title: 'Product Page',
        description: 'Enhanced product visualization',
      },
      {
        x: 70,
        y: 50,
        title: 'Checkout',
        description: 'Streamlined checkout flow',
      },
    ],
  },
  {
    id: '7',
    title: 'SaaS Dashboard Design',
    client: 'Analytics Pro',
    description:
      'Modern SaaS dashboard with real-time data visualization and user management.',
    thumbnailUrl: '/media/portfolio/all-projects/project-7/thumbnail.jpg',
    tags: ['Web Design', 'SaaS', 'React'],
    metrics: [
      { label: 'User Engagement', value: '+65%' },
      { label: 'Task Completion', value: '92%' },
      { label: 'Support Tickets', value: '-50%' },
    ],
    images: [
      '/media/portfolio/all-projects/project-7/thumbnail.jpg',
      '/media/portfolio/all-projects/project-7/detail-1.jpg',
      '/media/portfolio/all-projects/project-7/detail-2.jpg',
    ],
    hotspots: [
      {
        x: 20,
        y: 30,
        title: 'Navigation',
        description: 'Intuitive sidebar navigation',
      },
      {
        x: 60,
        y: 50,
        title: 'Analytics',
        description: 'Real-time data charts',
      },
    ],
  },
  {
    id: '8',
    title: 'Mobile App Landing Page',
    client: 'StartupX',
    description:
      'High-converting landing page for mobile app launch with A/B tested elements.',
    thumbnailUrl: '/media/portfolio/all-projects/project-8/thumbnail.jpg',
    tags: ['Web Design', 'SEO'],
    metrics: [
      { label: 'Conversion Rate', value: '12%' },
      { label: 'Bounce Rate', value: '-35%' },
      { label: 'App Downloads', value: '10K+' },
    ],
    images: [
      '/media/portfolio/all-projects/project-8/thumbnail.jpg',
      '/media/portfolio/all-projects/project-8/detail-1.jpg',
      '/media/portfolio/all-projects/project-8/detail-2.jpg',
    ],
    hotspots: [
      {
        x: 50,
        y: 25,
        title: 'Hero Section',
        description: 'Compelling value proposition',
      },
      {
        x: 50,
        y: 75,
        title: 'CTA',
        description: 'Optimized call-to-action buttons',
      },
    ],
  },
];

// All available tags for filtering
export const allTags = [
  'Web Design',
  'Shopify',
  'WordPress',
  'SEO',
  'Chatbot Development',
  'N8N Automations',
  'React',
  'Next.js',
  'Tailwind',
  'TypeScript',
  'Figma',
  'Stripe',
  'OpenAI',
  'Analytics',
  'SaaS',
  'AI/ML',
];
