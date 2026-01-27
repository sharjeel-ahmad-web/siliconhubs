import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// Simulated page data for audit
const pageData: Record<string, any> = {
  '/': {
    title: 'Rising Dot Agency | Digital Excellence Delivered',
    description:
      'We craft stunning websites, powerful automations, and intelligent chatbots that transform your digital presence.',
    h1Count: 1,
    h1Values: ['Digital Excellence Delivered'],
    images: { total: 8, withAlt: 6 },
    internalLinks: 12,
    externalLinks: 3,
    wordCount: 850,
  },
  '/about': {
    title: 'About Us | Rising Dot Agency',
    description: 'Meet the team behind Rising Dot Agency.',
    h1Count: 1,
    h1Values: ['About Rising Dot Agency'],
    images: { total: 5, withAlt: 5 },
    internalLinks: 8,
    externalLinks: 0,
    wordCount: 620,
  },
  '/services': {
    title: 'Our Services | Rising Dot Agency',
    description:
      'Comprehensive digital solutions including web design, chatbot development, and more.',
    h1Count: 1,
    h1Values: ['Our Services'],
    images: { total: 7, withAlt: 7 },
    internalLinks: 15,
    externalLinks: 0,
    wordCount: 780,
  },
  '/portfolio': {
    title: 'Portfolio | Rising Dot Agency',
    description: 'Explore our portfolio of successful projects.',
    h1Count: 1,
    h1Values: ['Our Work'],
    images: { total: 12, withAlt: 10 },
    internalLinks: 6,
    externalLinks: 2,
    wordCount: 450,
  },
  '/contact': {
    title: 'Contact Us | Rising Dot Agency',
    description: 'Get in touch with Rising Dot Agency.',
    h1Count: 1,
    h1Values: ['Contact Us'],
    images: { total: 2, withAlt: 2 },
    internalLinks: 4,
    externalLinks: 1,
    wordCount: 280,
  },
  '/blog': {
    title: 'Blog | Rising Dot Agency',
    description:
      'Insights and tips about web development and digital marketing.',
    h1Count: 1,
    h1Values: ['Blog'],
    images: { total: 6, withAlt: 4 },
    internalLinks: 10,
    externalLinks: 0,
    wordCount: 520,
  },
};

function auditPage(path: string, data: any) {
  const issues: any[] = [];
  let score = 100;

  // Title checks
  const titleLength = data.title?.length || 0;
  if (!data.title) {
    issues.push({
      type: 'error',
      category: 'title',
      message: 'Missing page title',
    });
    score -= 15;
  } else if (titleLength < 30) {
    issues.push({
      type: 'warning',
      category: 'title',
      message: 'Title is too short',
      details: `${titleLength} characters (recommended: 50-60)`,
    });
    score -= 5;
  } else if (titleLength > 60) {
    issues.push({
      type: 'warning',
      category: 'title',
      message: 'Title is too long',
      details: `${titleLength} characters (recommended: 50-60)`,
    });
    score -= 5;
  } else {
    issues.push({
      type: 'success',
      category: 'title',
      message: 'Title length is optimal',
    });
  }

  // Description checks
  const descLength = data.description?.length || 0;
  if (!data.description) {
    issues.push({
      type: 'error',
      category: 'description',
      message: 'Missing meta description',
    });
    score -= 15;
  } else if (descLength < 120) {
    issues.push({
      type: 'warning',
      category: 'description',
      message: 'Description is too short',
      details: `${descLength} characters (recommended: 150-160)`,
    });
    score -= 5;
  } else if (descLength > 160) {
    issues.push({
      type: 'warning',
      category: 'description',
      message: 'Description is too long',
      details: `${descLength} characters (recommended: 150-160)`,
    });
    score -= 5;
  } else {
    issues.push({
      type: 'success',
      category: 'description',
      message: 'Description length is optimal',
    });
  }

  // H1 checks
  if (data.h1Count === 0) {
    issues.push({
      type: 'error',
      category: 'h1',
      message: 'Missing H1 heading',
    });
    score -= 10;
  } else if (data.h1Count > 1) {
    issues.push({
      type: 'warning',
      category: 'h1',
      message: 'Multiple H1 headings found',
      details: `Found ${data.h1Count} H1 tags (recommended: 1)`,
    });
    score -= 5;
  } else {
    issues.push({
      type: 'success',
      category: 'h1',
      message: 'Single H1 heading present',
    });
  }

  // Image alt checks
  const imagesWithoutAlt = data.images.total - data.images.withAlt;
  if (imagesWithoutAlt > 0) {
    issues.push({
      type: 'warning',
      category: 'images',
      message: `${imagesWithoutAlt} images missing alt text`,
      details: 'Alt text helps with accessibility and SEO',
    });
    score -= Math.min(imagesWithoutAlt * 2, 10);
  } else if (data.images.total > 0) {
    issues.push({
      type: 'success',
      category: 'images',
      message: 'All images have alt text',
    });
  }

  // Internal links check
  if (data.internalLinks < 3) {
    issues.push({
      type: 'warning',
      category: 'links',
      message: 'Few internal links',
      details: `Only ${data.internalLinks} internal links (recommended: 3+)`,
    });
    score -= 5;
  } else {
    issues.push({
      type: 'success',
      category: 'links',
      message: 'Good internal linking',
    });
  }

  // Word count check
  if (data.wordCount < 300) {
    issues.push({
      type: 'warning',
      category: 'content',
      message: 'Thin content',
      details: `Only ${data.wordCount} words (recommended: 300+)`,
    });
    score -= 10;
  } else {
    issues.push({
      type: 'success',
      category: 'content',
      message: 'Sufficient content length',
    });
  }

  return {
    page: path,
    score: Math.max(0, score),
    issues,
    checks: {
      title: {
        status: !data.title
          ? 'fail'
          : titleLength >= 30 && titleLength <= 60
            ? 'pass'
            : 'warning',
        value: data.title || '',
        length: titleLength,
      },
      description: {
        status: !data.description
          ? 'fail'
          : descLength >= 120 && descLength <= 160
            ? 'pass'
            : 'warning',
        value: data.description || '',
        length: descLength,
      },
      h1: {
        status:
          data.h1Count === 0 ? 'fail' : data.h1Count === 1 ? 'pass' : 'warning',
        count: data.h1Count,
        values: data.h1Values,
      },
      images: {
        total: data.images.total,
        withAlt: data.images.withAlt,
        withoutAlt: [],
      },
      internalLinks: data.internalLinks,
      externalLinks: data.externalLinks,
      wordCount: data.wordCount,
    },
  };
}

// GET - Fetch audit results
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const audits = await db.collection('seoAudit').find({}).toArray();
    return NextResponse.json(audits);
  } catch (error) {
    console.error('Error fetching audits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audits' },
      { status: 500 }
    );
  }
}

// POST - Run audit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page } = body;

    const client = await clientPromise;
    const db = client.db('rising-dot');

    const pagesToAudit = page ? [page] : Object.keys(pageData);
    const results = pagesToAudit.map((p) =>
      auditPage(p, pageData[p] || pageData['/'])
    );

    // Save results
    await db.collection('seoAudit').deleteMany({});
    await db.collection('seoAudit').insertMany(results);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error running audit:', error);
    return NextResponse.json({ error: 'Failed to run audit' }, { status: 500 });
  }
}
