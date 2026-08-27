import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'siliconhubs';

if (!uri) {
  console.error('Missing MONGODB_URI in .env.local');
  process.exit(1);
}

async function seedDatabase() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  console.log('Connected to database:', dbName);

  console.log('Clearing existing data...');
  await Promise.all([
    db.collection('blogs').deleteMany({}),
    db.collection('projects').deleteMany({}),
    db.collection('services').deleteMany({}),
    db.collection('team').deleteMany({}),
    db.collection('testimonials').deleteMany({}),
    db.collection('pages').deleteMany({}),
    db.collection('content').deleteMany({}),
    db.collection('navigation').deleteMany({}),
    db.collection('settings').deleteMany({}),
    db.collection('seo').deleteMany({}),
    db.collection('design').deleteMany({}),
  ]);

  console.log('Seeding services...');
  const services = [
    { title: 'Web Design & Development', slug: 'web-design', description: 'Custom websites that convert visitors into customers with stunning designs and robust functionality.', shortDescription: 'Custom websites that convert visitors into customers with stunning designs and robust functionality.', icon: 'Globe', features: ['Responsive Design', 'Next.js / React', 'Custom CMS', 'Performance Optimization'], featured: true, status: 'active', createdAt: new Date(), updatedAt: new Date() },
    { title: 'AI Chatbot Development', slug: 'chatbot-development', description: 'Intelligent AI chatbots powered by Groq SDK that provide 24/7 customer support and lead generation.', shortDescription: 'Intelligent AI chatbots powered by Groq SDK that provide 24/7 customer support and lead generation.', icon: 'Bot', features: ['Natural Language Processing', 'Multi-platform Integration', 'Custom Training', 'Analytics Dashboard'], featured: true, status: 'active', createdAt: new Date(), updatedAt: new Date() },
    { title: 'N8N Automations', slug: 'n8n-automations', description: 'Streamline your business workflows with powerful N8N automation solutions that save time and reduce errors.', shortDescription: 'Streamline your business workflows with powerful N8N automation solutions that save time and reduce errors.', icon: 'Zap', features: ['Workflow Automation', 'Third-party Integrations', 'Custom Triggers', 'Real-time Monitoring'], featured: true, status: 'active', createdAt: new Date(), updatedAt: new Date() },
    { title: 'Digital Marketing', slug: 'digital-marketing', description: 'Data-driven digital marketing strategies that amplify your brand reach and drive measurable growth.', shortDescription: 'Data-driven digital marketing strategies that amplify your brand reach and drive measurable growth.', icon: 'TrendingUp', features: ['SEO Optimization', 'Social Media Marketing', 'PPC Campaigns', 'Content Strategy'], featured: true, status: 'active', createdAt: new Date(), updatedAt: new Date() },
    { title: 'WordPress Development', slug: 'wordpress', description: 'Custom WordPress solutions with blazing-fast performance, secure architecture, and easy content management.', shortDescription: 'Custom WordPress solutions with blazing-fast performance, secure architecture, and easy content management.', icon: 'FileCode', features: ['Custom Themes', 'Plugin Development', 'WooCommerce', 'Speed Optimization'], featured: false, status: 'active', createdAt: new Date(), updatedAt: new Date() },
    { title: 'Shopify Development', slug: 'shopify', description: 'High-converting Shopify stores with custom designs, seamless integrations, and optimized checkout flows.', shortDescription: 'High-converting Shopify stores with custom designs, seamless integrations, and optimized checkout flows.', icon: 'ShoppingCart', features: ['Custom Store Design', 'App Development', 'Payment Integration', 'SEO Optimization'], featured: false, status: 'active', createdAt: new Date(), updatedAt: new Date() },
    { title: 'SEO Optimization', slug: 'seo', description: 'Boost your search rankings with comprehensive SEO strategies including technical SEO, content, and link building.', shortDescription: 'Boost your search rankings with comprehensive SEO strategies including technical SEO, content, and link building.', icon: 'Search', features: ['Technical SEO', 'Keyword Research', 'Content Optimization', 'Link Building'], featured: false, status: 'active', createdAt: new Date(), updatedAt: new Date() },
  ];
  await db.collection('services').insertMany(services);
  console.log(`Seeded ${services.length} services`);

  console.log('Seeding projects...');
  const projects = [
    { title: 'E-Commerce Platform', slug: 'ecommerce-platform', description: 'A high-performance Shopify store with custom theme development and seamless checkout experience.', shortDescription: 'A high-performance Shopify store with custom theme development and seamless checkout experience.', coverImage: '/placeholder-project-1.jpg', images: [], client: 'TechMart Inc.', category: 'E-commerce', tags: ['Shopify', 'E-commerce', 'Web Design'], technologies: ['Shopify', 'Liquid', 'JavaScript'], featured: true, status: 'published', publishedAt: new Date(), createdAt: new Date(), updatedAt: new Date() },
    { title: 'AI Customer Support Bot', slug: 'ai-customer-support-bot', description: 'Intelligent chatbot solution handling 80% of customer queries automatically with 95% accuracy.', shortDescription: 'Intelligent chatbot solution handling 80% of customer queries automatically with 95% accuracy.', coverImage: '/placeholder-project-2.jpg', images: [], client: 'ServiceFirst', category: 'AI/ML', tags: ['AI', 'Chatbot', 'Automation'], technologies: ['Groq SDK', 'React', 'Node.js'], featured: true, status: 'published', publishedAt: new Date(), createdAt: new Date(), updatedAt: new Date() },
    { title: 'Corporate Website Redesign', slug: 'corporate-website-redesign', description: 'Complete website overhaul resulting in 300% increase in organic traffic and 150% more leads.', shortDescription: 'Complete website overhaul resulting in 300% increase in organic traffic and 150% more leads.', coverImage: '/placeholder-project-3.jpg', images: [], client: 'GlobalCorp', category: 'Web Design', tags: ['Web Design', 'SEO', 'Next.js'], technologies: ['Next.js', 'Tailwind CSS', 'Framer Motion'], featured: true, status: 'published', publishedAt: new Date(), createdAt: new Date(), updatedAt: new Date() },
  ];
  await db.collection('projects').insertMany(projects);
  console.log(`Seeded ${projects.length} projects`);

  console.log('Seeding blogs...');
  const blogs = [
    { title: 'The Future of AI in Web Development', slug: 'future-of-ai-in-web-development', excerpt: 'Explore how artificial intelligence is revolutionizing the way we build and interact with websites.', content: 'Artificial Intelligence is transforming web development...\n\nFrom automated code generation to intelligent user experiences, AI is reshaping how we build for the web.', author: 'Sarah Johnson', tags: ['AI', 'Web Development', 'Technology'], status: 'published', publishedAt: new Date('2024-01-15'), createdAt: new Date(), updatedAt: new Date() },
    { title: '10 SEO Strategies That Actually Work in 2024', slug: 'seo-strategies-2024', excerpt: 'Learn the most effective SEO techniques to boost your website rankings and drive organic traffic.', content: 'SEO continues to evolve...\n\nHere are the top 10 strategies that are delivering results in 2024.', author: 'Mike Chen', tags: ['SEO', 'Digital Marketing', 'Growth'], status: 'published', publishedAt: new Date('2024-01-10'), createdAt: new Date(), updatedAt: new Date() },
    { title: 'Why Every Business Needs Automation in 2024', slug: 'business-automation-2024', excerpt: 'Discover how N8N automations can transform your business operations and save hundreds of hours.', content: 'Automation is no longer optional...\n\nBusinesses that embrace automation are seeing dramatic improvements in efficiency.', author: 'Alex Rivera', tags: ['Automation', 'N8N', 'Productivity'], status: 'published', publishedAt: new Date('2024-01-05'), createdAt: new Date(), updatedAt: new Date() },
  ];
  await db.collection('blogs').insertMany(blogs);
  console.log(`Seeded ${blogs.length} blogs`);

  console.log('Seeding team...');
  const team = [
    { name: 'Rahul Sharma', role: 'CEO & Founder', bio: 'Visionary leader with 10+ years of experience in digital innovation and business strategy.', avatar: '/placeholder-avatar-1.jpg', socialLinks: { linkedin: 'https://linkedin.com/in/rahul', twitter: '', github: '' }, featured: true, status: 'active', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Priya Patel', role: 'Head of Technology', bio: 'Full-stack architect passionate about building scalable, high-performance applications.', avatar: '/placeholder-avatar-2.jpg', socialLinks: { linkedin: 'https://linkedin.com/in/priya', twitter: '', github: '' }, featured: true, status: 'active', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Arjun Singh', role: 'Creative Director', bio: 'Award-winning designer with a keen eye for creating stunning user experiences.', avatar: '/placeholder-avatar-3.jpg', socialLinks: { linkedin: 'https://linkedin.com/in/arjun', twitter: '', github: '' }, featured: true, status: 'active', createdAt: new Date(), updatedAt: new Date() },
  ];
  await db.collection('team').insertMany(team);
  console.log(`Seeded ${team.length} team members`);

  console.log('Seeding testimonials...');
  const testimonials = [
    { name: 'John Smith', role: 'CEO', company: 'TechMart Inc.', content: 'Silicon Hubs transformed our online presence. Their attention to detail and technical expertise is unmatched.', rating: 5, featured: true, status: 'active', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Sarah Johnson', role: 'Marketing Director', company: 'GlobalCorp', content: 'The team delivered beyond our expectations. Our website traffic increased by 300% within 3 months.', rating: 5, featured: true, status: 'active', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Michael Brown', role: 'Founder', company: 'StartupXYZ', content: 'Professional, responsive, and incredibly skilled. They built our entire platform in record time.', rating: 5, featured: true, status: 'active', createdAt: new Date(), updatedAt: new Date() },
  ];
  await db.collection('testimonials').insertMany(testimonials);
  console.log(`Seeded ${testimonials.length} testimonials`);

  console.log('Seeding pages...');
  const pages = [
    { title: 'Home', slug: 'home', content: 'Welcome to Silicon Hubs - your premium digital agency.', status: 'published', updatedAt: new Date() },
    { title: 'About', slug: 'about', content: 'We are a team of passionate technologists, designers, and strategists.', status: 'published', updatedAt: new Date() },
    { title: 'Contact', slug: 'contact', content: 'Get in touch with us for your digital needs.', status: 'published', updatedAt: new Date() },
  ];
  await db.collection('pages').insertMany(pages);
  console.log(`Seeded ${pages.length} pages`);

  console.log('Seeding navigation...');
  const navigation = [
    { label: 'Home', href: '/', order: 0, isExternal: false },
    { label: 'About', href: '/about', order: 1, isExternal: false },
    { label: 'Services', href: '/services', order: 2, isExternal: false },
    { label: 'Portfolio', href: '/portfolio', order: 3, isExternal: false },
    { label: 'Blog', href: '/blog', order: 4, isExternal: false },
    { label: 'Contact', href: '/contact', order: 5, isExternal: false },
  ];
  await db.collection('navigation').insertMany(navigation);
  console.log(`Seeded ${navigation.length} navigation items`);

  console.log('Seeding settings...');
  await db.collection('settings').insertOne({
    siteName: 'Silicon Hubs',
    siteDescription: 'Premium digital agency',
    contactEmail: 'hello@siliconhubs.com',
    contactPhone: '+91 98765 43210',
    address: '123 Tech Park, Sector 5, Bangalore, India 560001',
    socialLinks: { facebook: '', instagram: '', twitter: '', linkedin: '', youtube: '', github: '' },
    updatedAt: new Date(),
  });
  console.log('Seeded settings');

  console.log('Seeding SEO...');
  await db.collection('seo').insertOne({
    metaTitle: 'Silicon Hubs | Premium Digital Agency',
    metaDescription: 'Silicon Hubs delivers premium web design, AI chatbots, digital marketing, and automation solutions.',
    keywords: ['web design', 'AI chatbots', 'digital marketing', 'automation', 'SEO'],
    googleAnalyticsId: '',
    googleSearchConsoleId: '',
    updatedAt: new Date(),
  });
  console.log('Seeded SEO settings');

  console.log('Seeding design...');
  await db.collection('design').insertOne({
    primaryColor: '#fc4c00',
    secondaryColor: '#0a192f',
    backgroundColor: '#000000',
    fontHeading: 'Poppins',
    fontBody: 'Inter',
    borderRadius: '16px',
    updatedAt: new Date(),
  });
  console.log('Seeded design settings');

  console.log('\nDatabase seeding completed successfully!');
  await client.close();
}

seedDatabase().catch((error) => {
  console.error('Seed error:', error);
  process.exit(1);
});