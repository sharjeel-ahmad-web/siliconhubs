import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// POST - Scan for duplicate content
export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    // Simulated duplicate content detection
    // In production, you would compare actual page content using similarity algorithms
    const duplicates = [
      {
        id: 'dup-1',
        type: 'similar',
        pages: [
          {
            url: '/services/web-design',
            title: 'Web Design Services',
            similarity: 85,
          },
          {
            url: '/services/wordpress',
            title: 'WordPress Development',
            similarity: 78,
          },
        ],
        contentPreview:
          'We create stunning, responsive websites that drive results. Our team of expert designers and developers work together to deliver exceptional digital experiences...',
      },
      {
        id: 'dup-2',
        type: 'partial',
        pages: [
          { url: '/about', title: 'About Us', similarity: 65 },
          { url: '/', title: 'Homepage', similarity: 62 },
        ],
        contentPreview:
          'Rising Dot Agency is a full-service digital agency specializing in web development, automation, and AI solutions. We help businesses transform their digital presence...',
      },
    ];

    // Save results
    await db.collection('seoDuplicates').deleteMany({});
    if (duplicates.length > 0) {
      await db.collection('seoDuplicates').insertMany(duplicates);
    }

    return NextResponse.json(duplicates);
  } catch (error) {
    console.error('Error scanning for duplicates:', error);
    return NextResponse.json(
      { error: 'Failed to scan for duplicates' },
      { status: 500 }
    );
  }
}
