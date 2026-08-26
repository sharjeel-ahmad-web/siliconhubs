/**
 * Static portfolio data. No fetch, no CMS.
 * Import directly into PortfolioPageClient and related components.
 */

export interface PortfolioProject {
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

export const portfolioProjects: PortfolioProject[] = [
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
];

export const portfolioTags = [
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

export const portfolioHero = {
  title: 'Our Creative',
  titleHighlight: 'Portfolio',
  subtitle:
    'Explore our work across web design, e-commerce, automation, chatbots, and SEO. Each project showcases our commitment to excellence and innovation.',
  ctaLabel: 'Start Your Project',
  ctaHref: '/contact',
  heroItems: [
    {
      id: 1,
      title: 'E-Commerce',
      imageUrl: '/media/portfolio/hero/ecommerce.jpg',
    },
    {
      id: 2,
      title: 'Web Design',
      imageUrl: '/media/portfolio/hero/web-design.jpg',
    },
    {
      id: 3,
      title: 'AI Chatbots',
      imageUrl: '/media/portfolio/hero/ai-chatbots.jpg',
    },
    {
      id: 4,
      title: 'Automation',
      imageUrl: '/media/portfolio/hero/automation.jpg',
    },
    { id: 5, title: 'SEO', imageUrl: '/media/portfolio/hero/seo.jpg' },
  ],
};

export const portfolioFilters = {
  eyebrow: 'Our Expertise',
  title: 'Skills &',
  titleHighlight: 'Technologies',
  subtitle:
    'Drag and explore the technologies we master to bring your vision to life',
  tags: portfolioTags,
};

export const portfolioGrid = {
  eyebrow: 'Our Work',
  title: 'All',
  titleHighlight: 'Projects',
  subtitle: 'Explore our complete collection of successful client projects',
};

export const portfolioCta = {
  eyebrow: 'Like What You See?',
  title: 'Start Your',
  titleHighlight: 'Project',
  subtitle:
    "Let's create something extraordinary together. Get in touch today.",
  ctaText: 'Contact Us',
  ctaLink: '/contact',
};

export interface PortfolioCaseStudy {
  img: string;
  title: string;
  desc: string;
  sliderName: string;
}

export const portfolioCaseStudies: PortfolioCaseStudy[] = [
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

export const portfolioCaseStudiesSection = {
  eyebrow: 'Case Studies',
  title: 'Success',
  titleHighlight: 'Stories',
  subtitle:
    'Deep dives into our most impactful projects and the results we achieved',
  studies: portfolioCaseStudies,
};

export const portfolioFeaturedWork = {
  eyebrow: 'Featured Work',
  title: 'Projects That',
  titleHighlight: 'Deliver Results',
  subtitle:
    'Scroll to explore our latest projects and see how we help businesses grow.',
};

export interface FeaturedSlide {
  id: string;
  title: string;
  description: string;
  services: string[];
  type: string;
  imageUrl: string;
}

export const portfolioFeaturedSlides: FeaturedSlide[] = portfolioProjects
  .slice(0, 4)
  .map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    services: p.tags,
    type: p.tags[0] || 'Project',
    imageUrl: p.thumbnailUrl,
  }));

export interface PortfolioAdvantagesContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  stats: { value: string; label: string }[];
  features: {
    title: string;
    description: string;
    icon: string;
    color: string;
  }[];
}

export const portfolioAdvantages: PortfolioAdvantagesContent = {
  eyebrow: 'Our Advantage',
  title: 'Why Clients',
  titleHighlight: 'Choose Us',
  subtitle:
    'We deliver exceptional results through innovative solutions, cutting-edge technology, and a commitment to excellence in every project.',
  stats: [
    { value: '50+', label: 'Projects Delivered' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: '24/7', label: 'Support Available' },
  ],
  features: [
    {
      title: 'Lightning Fast',
      description:
        'Optimized performance with sub-second load times and smooth interactions.',
      icon: 'Zap',
      color: '#06b6d4',
    },
    {
      title: 'Powerful Tech',
      description:
        'Built with cutting-edge technologies for scalability and reliability.',
      icon: 'Cpu',
      color: '#fc4c00',
    },
    {
      title: 'Secure & Safe',
      description:
        'Enterprise-grade security with best practices and regular audits.',
      icon: 'Lock',
      color: '#06b6d4',
    },
    {
      title: 'AI Powered',
      description:
        'Intelligent automation and AI integration for smarter solutions.',
      icon: 'Sparkles',
      color: '#fc4c00',
    },
  ],
};
