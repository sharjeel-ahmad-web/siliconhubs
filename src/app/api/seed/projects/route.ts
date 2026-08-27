import { NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/db/mongodb';

const projectsData = [
  {
    title: 'E-Commerce Platform Redesign',
    slug: 'ecommerce-platform-redesign',
    client: 'TechStore Inc.',
    description:
      'Complete redesign of e-commerce platform with focus on conversion optimization and mobile experience.',
    thumbnailUrl: '/media/portfolio/all-projects/project-1/thumbnail.jpg',
    category: 'Web Design',
    tags: ['Web Design', 'Shopify', 'SEO'],
    metrics: [
      { label: 'Conversion Rate', value: '+45%' },
      { label: 'Page Speed', value: '2.1s' },
      { label: 'Mobile Traffic', value: '+60%' },
    ],
    images: [
      '/media/portfolio/all-projects/project-1/thumbnail.jpg',
      '/media/portfolio/all-projects/project-1/detail-1.jpg',
      '/media/portfolio/all-projects/project-1/detail-2.jpg',
    ],
    featured: true,
    status: 'published',
    completedAt: new Date('2024-06-15'),
  },
  {
    title: 'AI Customer Support Chatbot',
    slug: 'ai-customer-support-chatbot',
    client: 'Support Solutions',
    description:
      'Custom AI chatbot with natural language processing for customer support automation.',
    thumbnailUrl: '/media/portfolio/all-projects/project-2/thumbnail.jpg',
    category: 'Chatbot Development',
    tags: ['Chatbot Development', 'N8N Automations'],
    metrics: [
      { label: 'Response Time', value: '-80%' },
      { label: 'Resolution Rate', value: '92%' },
      { label: 'Cost Savings', value: '$50K/yr' },
    ],
    images: [
      '/media/portfolio/all-projects/project-2/thumbnail.jpg',
      '/media/portfolio/all-projects/project-2/detail-1.jpg',
      '/media/portfolio/all-projects/project-2/detail-2.jpg',
    ],
    featured: true,
    status: 'published',
    completedAt: new Date('2024-05-20'),
  },
  {
    title: 'WordPress Blog Platform',
    slug: 'wordpress-blog-platform',
    client: 'Content Creators Co.',
    description:
      'High-performance WordPress blog with custom theme and advanced SEO optimization.',
    thumbnailUrl: '/media/portfolio/all-projects/project-3/thumbnail.jpg',
    category: 'WordPress',
    tags: ['WordPress', 'SEO', 'Web Design'],
    metrics: [
      { label: 'Organic Traffic', value: '+200%' },
      { label: 'Load Time', value: '1.8s' },
      { label: 'Bounce Rate', value: '-35%' },
    ],
    images: [
      '/media/portfolio/all-projects/project-3/thumbnail.jpg',
      '/media/portfolio/all-projects/project-3/detail-1.jpg',
      '/media/portfolio/all-projects/project-3/detail-2.jpg',
    ],
    featured: false,
    status: 'published',
    completedAt: new Date('2024-04-10'),
  },
  {
    title: 'Business Automation Suite',
    slug: 'business-automation-suite',
    client: 'Enterprise Corp',
    description:
      'Complex N8N automation workflows connecting multiple business systems.',
    thumbnailUrl: '/media/portfolio/all-projects/project-4/thumbnail.jpg',
    category: 'N8N Automations',
    tags: ['N8N Automations'],
    metrics: [
      { label: 'Time Saved', value: '40hrs/wk' },
      { label: 'Error Rate', value: '-95%' },
      { label: 'ROI', value: '300%' },
    ],
    images: [
      '/media/portfolio/all-projects/project-4/thumbnail.jpg',
      '/media/portfolio/all-projects/project-4/detail-1.jpg',
      '/media/portfolio/all-projects/project-4/detail-2.jpg',
    ],
    featured: true,
    status: 'published',
    completedAt: new Date('2024-03-25'),
  },
  {
    title: 'Local SEO Campaign',
    slug: 'local-seo-campaign',
    client: 'Local Business Hub',
    description:
      'Comprehensive SEO strategy with technical optimization and content marketing.',
    thumbnailUrl: '/media/portfolio/all-projects/project-5/thumbnail.jpg',
    category: 'SEO',
    tags: ['SEO'],
    metrics: [
      { label: 'Rankings', value: 'Top 3' },
      { label: 'Local Traffic', value: '+150%' },
      { label: 'Leads', value: '+85%' },
    ],
    images: [
      '/media/portfolio/all-projects/project-5/thumbnail.jpg',
      '/media/portfolio/all-projects/project-5/detail-1.jpg',
      '/media/portfolio/all-projects/project-5/detail-2.jpg',
    ],
    featured: false,
    status: 'published',
    completedAt: new Date('2024-02-18'),
  },
  {
    title: 'Fashion E-Commerce Store',
    slug: 'fashion-ecommerce-store',
    client: 'Fashion Boutique',
    description:
      'Custom Shopify store with advanced product filtering and checkout optimization.',
    thumbnailUrl: '/media/portfolio/all-projects/project-6/thumbnail.jpg',
    category: 'Shopify',
    tags: ['Shopify', 'Web Design'],
    metrics: [
      { label: 'Sales', value: '+120%' },
      { label: 'Cart Abandonment', value: '-40%' },
      { label: 'AOV', value: '+25%' },
    ],
    images: [
      '/media/portfolio/all-projects/project-6/thumbnail.jpg',
      '/media/portfolio/all-projects/project-6/detail-1.jpg',
      '/media/portfolio/all-projects/project-6/detail-2.jpg',
    ],
    featured: true,
    status: 'published',
    completedAt: new Date('2024-01-30'),
  },
  {
    title: 'SaaS Analytics Dashboard',
    slug: 'saas-analytics-dashboard',
    client: 'Analytics Pro',
    description:
      'Modern SaaS dashboard with real-time data visualization and user management.',
    thumbnailUrl: '/media/portfolio/all-projects/project-7/thumbnail.jpg',
    category: 'SaaS',
    tags: ['Web Design', 'SaaS', 'React'],
    metrics: [
      { label: 'User Engagement', value: '+75%' },
      { label: 'Data Processing', value: '10x faster' },
      { label: 'User Satisfaction', value: '4.8/5' },
    ],
    images: [
      '/media/portfolio/all-projects/project-7/thumbnail.jpg',
      '/media/portfolio/all-projects/project-7/detail-1.jpg',
      '/media/portfolio/all-projects/project-7/detail-2.jpg',
    ],
    featured: false,
    status: 'published',
    completedAt: new Date('2023-12-15'),
  },
  {
    title: 'Mobile App Landing Page',
    slug: 'mobile-app-landing-page',
    client: 'StartupX',
    description:
      'High-converting landing page for mobile app launch with A/B tested elements.',
    thumbnailUrl: '/media/portfolio/all-projects/project-8/thumbnail.jpg',
    category: 'Web Design',
    tags: ['Web Design', 'SEO'],
    metrics: [
      { label: 'Conversion Rate', value: '12%' },
      { label: 'App Downloads', value: '50K+' },
      { label: 'Cost per Install', value: '-60%' },
    ],
    images: [
      '/media/portfolio/all-projects/project-8/thumbnail.jpg',
      '/media/portfolio/all-projects/project-8/detail-1.jpg',
      '/media/portfolio/all-projects/project-8/detail-2.jpg',
    ],
    featured: false,
    status: 'published',
    completedAt: new Date('2023-11-20'),
  },
];

export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection(COLLECTIONS.PROJECTS);

    // Clear existing projects
    await collection.deleteMany({});

    // Insert new projects with timestamps
    const projectsWithTimestamps = projectsData.map((project) => ({
      ...project,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await collection.insertMany(projectsWithTimestamps);

    return NextResponse.json({
      success: true,
      message: `Seeded ${projectsData.length} projects`,
      count: projectsData.length,
    });
  } catch (error) {
    console.error('Error seeding projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed projects' },
      { status: 500 }
    );
  }
}
