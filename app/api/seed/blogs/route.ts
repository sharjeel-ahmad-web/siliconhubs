import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

const placeholderBlogs = [
  {
    title: 'Building Modern Web Applications with Next.js 14',
    slug: 'building-modern-web-applications-nextjs-14',
    excerpt:
      'Discover the latest features in Next.js 14 and how to leverage them for building fast, scalable web applications.',
    content: `# Introduction to Next.js 14

Next.js 14 brings exciting new features that make building web applications faster and more efficient than ever before.

## Key Features

- Server Components by default
- Improved App Router
- Turbopack for faster builds
- Enhanced Image Optimization

## Getting Started

To create a new Next.js 14 project, simply run:

- npx create-next-app@latest my-app
- cd my-app
- npm run dev

## Why Choose Next.js?

Next.js provides the best developer experience with all the features you need for production: hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and more.

## Conclusion

Next.js 14 is a game-changer for web development. Start building your next project with it today!`,
    thumbnail:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
    coverImage:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop',
    author: 'Rising Dot Team',
    category: 'Development',
    tags: ['nextjs', 'react', 'web development'],
    featured: true,
    published: true,
    publishedAt: new Date('2025-12-15'),
    readTime: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'The Ultimate Guide to UI/UX Design in 2025',
    slug: 'ultimate-guide-ui-ux-design-2025',
    excerpt:
      'Learn the latest trends and best practices in UI/UX design that will dominate the digital landscape in 2025.',
    content: `# UI/UX Design Trends for 2025

The world of design is constantly evolving. Here's what you need to know about the latest trends.

## Top Design Trends

- Glassmorphism and Neumorphism
- Dark Mode Everything
- Micro-interactions
- 3D Elements and Illustrations
- AI-Powered Personalization

## Best Practices

### User Research
Always start with understanding your users. Conduct surveys, interviews, and usability tests.

### Accessibility
Design for everyone. Ensure your designs meet WCAG guidelines.

### Mobile First
With mobile traffic dominating, always design for mobile first.

## Tools We Recommend

- Figma for collaborative design
- Framer for prototyping
- Adobe XD for enterprise projects

## Conclusion

Great design is about solving problems while delighting users. Keep learning and experimenting!`,
    thumbnail:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
    coverImage:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop',
    author: 'Rising Dot Team',
    category: 'Design',
    tags: ['ui design', 'ux design', 'trends'],
    featured: false,
    published: true,
    publishedAt: new Date('2025-12-14'),
    readTime: 7,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'How to Automate Your Business with n8n Workflows',
    slug: 'automate-business-n8n-workflows',
    excerpt:
      'Discover how n8n can help you automate repetitive tasks and streamline your business operations.',
    content: `# Business Automation with n8n

n8n is a powerful workflow automation tool that can transform how you work.

## What is n8n?

n8n is an open-source workflow automation tool that allows you to connect different services and automate tasks without writing code.

## Common Use Cases

- Automated email responses
- Social media scheduling
- Data synchronization
- Lead generation workflows
- Customer onboarding

## Getting Started

### Step 1: Install n8n
You can run n8n locally or use their cloud service.

### Step 2: Create Your First Workflow
Start with a simple trigger and action to understand the basics.

### Step 3: Connect Your Apps
n8n supports hundreds of integrations including Slack, Google Sheets, and more.

## Benefits

- Save hours of manual work
- Reduce human errors
- Scale your operations
- Focus on what matters

## Conclusion

Automation is no longer optional. Start automating today with n8n!`,
    thumbnail:
      'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&h=600&fit=crop',
    coverImage:
      'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=1200&h=600&fit=crop',
    author: 'Rising Dot Team',
    category: 'Technology',
    tags: ['automation', 'n8n', 'productivity'],
    featured: false,
    published: true,
    publishedAt: new Date('2025-12-13'),
    readTime: 6,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'SEO Strategies That Actually Work in 2025',
    slug: 'seo-strategies-that-work-2025',
    excerpt:
      'Cut through the noise and learn SEO strategies that deliver real results for your website.',
    content: `# SEO Strategies for 2025

SEO continues to evolve. Here are strategies that actually work.

## Core Web Vitals Matter

Google prioritizes user experience. Focus on:

- Loading speed (LCP)
- Interactivity (FID)
- Visual stability (CLS)

## Content is Still King

### Quality Over Quantity
One comprehensive article beats ten thin posts.

### E-E-A-T
Experience, Expertise, Authoritativeness, and Trustworthiness are crucial.

## Technical SEO Checklist

- Mobile-friendly design
- Fast loading times
- Secure HTTPS connection
- Clean URL structure
- XML sitemap
- Schema markup

## Link Building

- Guest posting on relevant sites
- Creating linkable assets
- Building relationships in your industry

## Local SEO

If you have a local business:
- Claim your Google Business Profile
- Get reviews from customers
- Use local keywords

## Conclusion

SEO is a marathon, not a sprint. Stay consistent and focus on providing value.`,
    thumbnail:
      'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&h=600&fit=crop',
    coverImage:
      'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200&h=600&fit=crop',
    author: 'Rising Dot Team',
    category: 'Marketing',
    tags: ['seo', 'digital marketing', 'google'],
    featured: false,
    published: true,
    publishedAt: new Date('2025-12-12'),
    readTime: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    // Check if blogs already exist
    const existingCount = await db.collection('blogs').countDocuments();

    if (existingCount > 0) {
      return NextResponse.json({
        message: 'Blogs already exist',
        count: existingCount,
      });
    }

    // Insert placeholder blogs
    const result = await db.collection('blogs').insertMany(placeholderBlogs);

    return NextResponse.json({
      message: 'Placeholder blogs created successfully',
      count: result.insertedCount,
    });
  } catch (error) {
    console.error('Error seeding blogs:', error);
    return NextResponse.json(
      { error: 'Failed to seed blogs' },
      { status: 500 }
    );
  }
}
