import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// POST - Refresh crawl budget data
export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const now = new Date();

    // Simulated crawl data (in production, this would come from Google Search Console API)
    const pages = [
      {
        page: '/',
        crawlCount: 1250,
        lastCrawled: now.toISOString(),
        avgCrawlTime: 320,
        status: 'healthy',
        priority: 'high',
      },
      {
        page: '/about',
        crawlCount: 450,
        lastCrawled: new Date(now.getTime() - 86400000).toISOString(),
        avgCrawlTime: 280,
        status: 'healthy',
        priority: 'medium',
      },
      {
        page: '/services',
        crawlCount: 890,
        lastCrawled: now.toISOString(),
        avgCrawlTime: 350,
        status: 'healthy',
        priority: 'high',
      },
      {
        page: '/portfolio',
        crawlCount: 320,
        lastCrawled: new Date(now.getTime() - 172800000).toISOString(),
        avgCrawlTime: 420,
        status: 'under-crawled',
        priority: 'medium',
      },
      {
        page: '/contact',
        crawlCount: 280,
        lastCrawled: new Date(now.getTime() - 259200000).toISOString(),
        avgCrawlTime: 250,
        status: 'under-crawled',
        priority: 'low',
      },
      {
        page: '/blog',
        crawlCount: 1100,
        lastCrawled: now.toISOString(),
        avgCrawlTime: 380,
        status: 'healthy',
        priority: 'high',
      },
      {
        page: '/services/chatbot-development',
        crawlCount: 420,
        lastCrawled: new Date(now.getTime() - 43200000).toISOString(),
        avgCrawlTime: 310,
        status: 'healthy',
        priority: 'medium',
      },
      {
        page: '/services/web-design',
        crawlCount: 380,
        lastCrawled: new Date(now.getTime() - 86400000).toISOString(),
        avgCrawlTime: 290,
        status: 'healthy',
        priority: 'medium',
      },
    ];

    const totalCrawls = pages.reduce((acc, p) => acc + p.crawlCount, 0);
    const stats = {
      totalCrawls,
      avgCrawlsPerDay: Math.round(totalCrawls / 30),
      mostCrawled: '/',
      leastCrawled: '/contact',
      crawlBudgetUsed: 68,
    };

    // Save data
    await db
      .collection('seoCrawlBudget')
      .updateOne(
        { type: 'data' },
        { $set: { pages, stats, updatedAt: now } },
        { upsert: true }
      );

    return NextResponse.json({ pages, stats });
  } catch (error) {
    console.error('Error refreshing crawl budget:', error);
    return NextResponse.json(
      { error: 'Failed to refresh crawl budget' },
      { status: 500 }
    );
  }
}
