import { NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/db/mongodb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '28d';

  try {
    const db = await getDatabase();

    // Get settings to check if Search Console is connected
    const settings = await db
      .collection(COLLECTIONS.SETTINGS)
      .findOne({ key: 'search_console' });

    if (!settings?.value?.siteUrl) {
      return NextResponse.json({ connected: false });
    }

    const siteUrl = settings.value.siteUrl;

    // For now, return demo data structure
    // In production, you would use the Google Search Console API
    // https://developers.google.com/webmaster-tools/v1/api_reference_index

    const daysCount = range === '7d' ? 7 : range === '28d' ? 28 : 90;

    // Generate demo daily data
    const dailyData = [];
    for (let i = daysCount - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dailyData.push({
        date: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        clicks: Math.floor(Math.random() * 200) + 50,
        impressions: Math.floor(Math.random() * 5000) + 1000,
      });
    }

    // Calculate totals
    const totalClicks = dailyData.reduce((sum, d) => sum + d.clicks, 0);
    const totalImpressions = dailyData.reduce(
      (sum, d) => sum + d.impressions,
      0
    );
    const avgCtr = (totalClicks / totalImpressions) * 100;

    const searchConsoleData = {
      connected: true,
      siteUrl,
      overview: {
        totalClicks,
        totalImpressions,
        avgCtr,
        avgPosition: 12.5 + Math.random() * 5,
        clicksChange: 8.5 + Math.random() * 10,
        impressionsChange: 12.3 + Math.random() * 8,
      },
      topQueries: [
        {
          query: 'web design agency',
          clicks: Math.floor(totalClicks * 0.12),
          impressions: Math.floor(totalImpressions * 0.08),
          ctr: 4.2,
          position: 8.3,
        },
        {
          query: 'chatbot development',
          clicks: Math.floor(totalClicks * 0.1),
          impressions: Math.floor(totalImpressions * 0.06),
          ctr: 5.1,
          position: 6.7,
        },
        {
          query: 'n8n automation services',
          clicks: Math.floor(totalClicks * 0.08),
          impressions: Math.floor(totalImpressions * 0.05),
          ctr: 4.8,
          position: 9.2,
        },
        {
          query: 'shopify development',
          clicks: Math.floor(totalClicks * 0.07),
          impressions: Math.floor(totalImpressions * 0.07),
          ctr: 3.2,
          position: 11.5,
        },
        {
          query: 'wordpress developer',
          clicks: Math.floor(totalClicks * 0.06),
          impressions: Math.floor(totalImpressions * 0.08),
          ctr: 2.4,
          position: 14.2,
        },
        {
          query: 'seo services',
          clicks: Math.floor(totalClicks * 0.05),
          impressions: Math.floor(totalImpressions * 0.09),
          ctr: 1.8,
          position: 18.6,
        },
        {
          query: 'digital agency',
          clicks: Math.floor(totalClicks * 0.05),
          impressions: Math.floor(totalImpressions * 0.06),
          ctr: 2.6,
          position: 15.3,
        },
        {
          query: 'ai chatbot',
          clicks: Math.floor(totalClicks * 0.04),
          impressions: Math.floor(totalImpressions * 0.04),
          ctr: 3.1,
          position: 12.8,
        },
        {
          query: 'workflow automation',
          clicks: Math.floor(totalClicks * 0.04),
          impressions: Math.floor(totalImpressions * 0.03),
          ctr: 4.0,
          position: 10.1,
        },
        {
          query: 'custom web development',
          clicks: Math.floor(totalClicks * 0.03),
          impressions: Math.floor(totalImpressions * 0.05),
          ctr: 1.9,
          position: 16.4,
        },
      ],
      topPages: [
        {
          page: '/',
          clicks: Math.floor(totalClicks * 0.25),
          impressions: Math.floor(totalImpressions * 0.2),
          ctr: 3.8,
          position: 9.5,
        },
        {
          page: '/services',
          clicks: Math.floor(totalClicks * 0.15),
          impressions: Math.floor(totalImpressions * 0.12),
          ctr: 3.9,
          position: 11.2,
        },
        {
          page: '/services/chatbot-development',
          clicks: Math.floor(totalClicks * 0.12),
          impressions: Math.floor(totalImpressions * 0.08),
          ctr: 4.6,
          position: 7.8,
        },
        {
          page: '/services/web-design',
          clicks: Math.floor(totalClicks * 0.1),
          impressions: Math.floor(totalImpressions * 0.09),
          ctr: 3.4,
          position: 12.3,
        },
        {
          page: '/about',
          clicks: Math.floor(totalClicks * 0.08),
          impressions: Math.floor(totalImpressions * 0.07),
          ctr: 3.5,
          position: 14.1,
        },
        {
          page: '/portfolio',
          clicks: Math.floor(totalClicks * 0.07),
          impressions: Math.floor(totalImpressions * 0.08),
          ctr: 2.7,
          position: 15.6,
        },
        {
          page: '/contact',
          clicks: Math.floor(totalClicks * 0.06),
          impressions: Math.floor(totalImpressions * 0.05),
          ctr: 3.7,
          position: 13.2,
        },
        {
          page: '/blog',
          clicks: Math.floor(totalClicks * 0.05),
          impressions: Math.floor(totalImpressions * 0.06),
          ctr: 2.6,
          position: 16.8,
        },
      ],
      devicePerformance: [
        {
          device: 'DESKTOP',
          clicks: Math.floor(totalClicks * 0.52),
          impressions: Math.floor(totalImpressions * 0.48),
          ctr: 3.4,
          position: 11.2,
        },
        {
          device: 'MOBILE',
          clicks: Math.floor(totalClicks * 0.42),
          impressions: Math.floor(totalImpressions * 0.46),
          ctr: 2.8,
          position: 13.5,
        },
        {
          device: 'TABLET',
          clicks: Math.floor(totalClicks * 0.06),
          impressions: Math.floor(totalImpressions * 0.06),
          ctr: 3.1,
          position: 12.8,
        },
      ],
      countryPerformance: [
        {
          country: 'United States',
          clicks: Math.floor(totalClicks * 0.4),
          impressions: Math.floor(totalImpressions * 0.35),
          ctr: 3.6,
        },
        {
          country: 'United Kingdom',
          clicks: Math.floor(totalClicks * 0.15),
          impressions: Math.floor(totalImpressions * 0.14),
          ctr: 3.4,
        },
        {
          country: 'Canada',
          clicks: Math.floor(totalClicks * 0.1),
          impressions: Math.floor(totalImpressions * 0.11),
          ctr: 2.9,
        },
        {
          country: 'Australia',
          clicks: Math.floor(totalClicks * 0.08),
          impressions: Math.floor(totalImpressions * 0.09),
          ctr: 2.8,
        },
        {
          country: 'Germany',
          clicks: Math.floor(totalClicks * 0.07),
          impressions: Math.floor(totalImpressions * 0.08),
          ctr: 2.7,
        },
      ],
      dailyData,
      indexingStatus: {
        indexed: 45 + Math.floor(Math.random() * 20),
        notIndexed: 5 + Math.floor(Math.random() * 5),
        errors: Math.floor(Math.random() * 3),
      },
      crawlErrors: [
        {
          type: 'Server error (5xx)',
          count: Math.floor(Math.random() * 3),
          severity: 'error' as const,
        },
        {
          type: 'Soft 404',
          count: Math.floor(Math.random() * 5),
          severity: 'warning' as const,
        },
        {
          type: 'Redirect error',
          count: Math.floor(Math.random() * 2),
          severity: 'warning' as const,
        },
      ].filter((e) => e.count > 0),
    };

    return NextResponse.json(searchConsoleData);
  } catch (error) {
    console.error('Search Console fetch error:', error);
    return NextResponse.json({
      connected: false,
      error: 'Failed to fetch data',
    });
  }
}
