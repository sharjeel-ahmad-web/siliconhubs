import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// Simulated heading structure for pages
const pageHeadings: Record<string, any> = {
  '/': {
    title: 'Homepage',
    headings: [
      { tag: 'H1', text: 'Digital Excellence Delivered', level: 1 },
      { tag: 'H2', text: 'Our Services', level: 2 },
      { tag: 'H3', text: 'Web Development', level: 3 },
      { tag: 'H3', text: 'Chatbot Development', level: 3 },
      { tag: 'H3', text: 'Automation', level: 3 },
      { tag: 'H2', text: 'Why Choose Us', level: 2 },
      { tag: 'H2', text: 'Testimonials', level: 2 },
    ],
  },
  '/about': {
    title: 'About',
    headings: [
      { tag: 'H1', text: 'About Rising Dot Agency', level: 1 },
      { tag: 'H2', text: 'Our Story', level: 2 },
      { tag: 'H2', text: 'Our Mission', level: 2 },
      { tag: 'H2', text: 'Meet the Team', level: 2 },
      { tag: 'H3', text: 'Leadership', level: 3 },
      { tag: 'H3', text: 'Developers', level: 3 },
    ],
  },
  '/services': {
    title: 'Services',
    headings: [
      { tag: 'H1', text: 'Our Services', level: 1 },
      { tag: 'H2', text: 'Web Development', level: 2 },
      { tag: 'H2', text: 'Chatbot Development', level: 2 },
      { tag: 'H2', text: 'N8N Automations', level: 2 },
      { tag: 'H2', text: 'SEO Services', level: 2 },
    ],
  },
  '/portfolio': {
    title: 'Portfolio',
    headings: [
      { tag: 'H1', text: 'Our Work', level: 1 },
      { tag: 'H1', text: 'Featured Projects', level: 1 }, // Issue: Multiple H1s
      { tag: 'H2', text: 'E-commerce', level: 2 },
      { tag: 'H2', text: 'Web Applications', level: 2 },
    ],
  },
  '/contact': {
    title: 'Contact',
    headings: [
      { tag: 'H1', text: 'Contact Us', level: 1 },
      { tag: 'H2', text: 'Get in Touch', level: 2 },
      { tag: 'H4', text: 'Office Hours', level: 4 }, // Issue: Skipped H3
      { tag: 'H2', text: 'Location', level: 2 },
    ],
  },
  '/blog': {
    title: 'Blog',
    headings: [
      { tag: 'H1', text: 'Blog', level: 1 },
      { tag: 'H2', text: 'Latest Posts', level: 2 },
      { tag: 'H3', text: 'Development', level: 3 },
      { tag: 'H3', text: 'Design', level: 3 },
      { tag: 'H3', text: 'Marketing', level: 3 },
    ],
  },
};

function analyzeHeadings(page: string, data: any) {
  const issues: { type: 'error' | 'warning'; message: string }[] = [];
  let score = 100;

  const h1Count = data.headings.filter((h: any) => h.tag === 'H1').length;

  // Check for H1
  if (h1Count === 0) {
    issues.push({ type: 'error', message: 'Missing H1 heading' });
    score -= 20;
  } else if (h1Count > 1) {
    issues.push({
      type: 'error',
      message: `Multiple H1 headings found (${h1Count})`,
    });
    score -= 15;
  }

  // Check for skipped levels
  let prevLevel = 0;
  for (const heading of data.headings) {
    if (heading.level > prevLevel + 1 && prevLevel > 0) {
      issues.push({
        type: 'warning',
        message: `Skipped heading level: ${heading.tag} after H${prevLevel}`,
      });
      score -= 5;
    }
    prevLevel = heading.level;
  }

  // Check heading count
  if (data.headings.length < 3) {
    issues.push({
      type: 'warning',
      message: 'Few headings - consider adding more structure',
    });
    score -= 5;
  }

  return {
    page,
    title: data.title,
    headings: data.headings,
    issues,
    score: Math.max(0, score),
  };
}

// POST - Analyze headings
export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const results = Object.entries(pageHeadings).map(([page, data]) =>
      analyzeHeadings(page, data)
    );

    // Save results
    await db.collection('seoHeadings').deleteMany({});
    await db.collection('seoHeadings').insertMany(results);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error analyzing headings:', error);
    return NextResponse.json(
      { error: 'Failed to analyze headings' },
      { status: 500 }
    );
  }
}
