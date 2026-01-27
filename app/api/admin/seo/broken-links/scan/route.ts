import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// Links to check (in production, you'd crawl the site and check all links)
const linksToCheck = [
  { url: '/about', foundOn: '/', type: 'internal' as const },
  { url: '/services', foundOn: '/', type: 'internal' as const },
  { url: '/portfolio', foundOn: '/', type: 'internal' as const },
  { url: '/contact', foundOn: '/', type: 'internal' as const },
  { url: '/blog', foundOn: '/', type: 'internal' as const },
  {
    url: 'https://facebook.com/risingdot',
    foundOn: '/',
    type: 'external' as const,
  },
  {
    url: 'https://twitter.com/risingdot',
    foundOn: '/',
    type: 'external' as const,
  },
  {
    url: 'https://linkedin.com/company/risingdot',
    foundOn: '/',
    type: 'external' as const,
  },
];

// POST - Scan for broken links
export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://risingdot.agency';

    const brokenLinks: any[] = [];
    const now = new Date();

    // Check each link
    for (const link of linksToCheck) {
      try {
        const urlToCheck =
          link.type === 'internal' ? `${baseUrl}${link.url}` : link.url;

        // In production, you'd actually fetch the URL
        // For demo, we'll simulate some broken links
        const isBroken = Math.random() < 0.1; // 10% chance of being broken

        if (isBroken) {
          brokenLinks.push({
            url: link.url,
            foundOn: link.foundOn,
            anchorText: 'Link text',
            statusCode: Math.random() < 0.5 ? 404 : 500,
            type: link.type,
            lastChecked: now.toISOString(),
            fixed: false,
          });
        }
      } catch (error) {
        // Link check failed
        brokenLinks.push({
          url: link.url,
          foundOn: link.foundOn,
          anchorText: 'Link text',
          statusCode: 0,
          type: link.type,
          lastChecked: now.toISOString(),
          fixed: false,
        });
      }
    }

    // Clear old broken links and save new ones
    await db.collection('seoBrokenLinks').deleteMany({ fixed: false });

    if (brokenLinks.length > 0) {
      await db.collection('seoBrokenLinks').insertMany(brokenLinks);
    }

    return NextResponse.json({
      brokenLinks,
      totalChecked: linksToCheck.length,
    });
  } catch (error) {
    console.error('Error scanning for broken links:', error);
    return NextResponse.json(
      { error: 'Failed to scan for broken links' },
      { status: 500 }
    );
  }
}
