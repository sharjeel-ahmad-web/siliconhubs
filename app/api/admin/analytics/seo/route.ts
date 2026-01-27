import { NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/db/mongodb';

/**
 * SEO Metrics API
 * Tracks SEO performance metrics for dashboard
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '30d';
  const compare = searchParams.get('compare') === 'true';

  try {
    const db = await getDatabase();
    const now = new Date();

    // Calculate date ranges
    let startDate: Date;
    let previousStartDate: Date;
    
    switch (range) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    }

    // Get page views (filter for organic traffic if referrer data available)
    const pageViews = await db
      .collection(COLLECTIONS.ANALYTICS_PAGEVIEWS)
      .find({ timestamp: { $gte: startDate } })
      .toArray();

    // Filter organic traffic (direct or from search engines)
    const organicPageViews = pageViews.filter(
      (pv) =>
        !pv.referrer ||
        pv.referrer === 'direct' ||
        /google|bing|yahoo|duckduckgo/i.test(pv.referrer || '')
    );

    // Get previous period for comparison
    let previousOrganicPageViews: any[] = [];
    if (compare) {
      previousOrganicPageViews = await db
        .collection(COLLECTIONS.ANALYTICS_PAGEVIEWS)
        .find({
          timestamp: {
            $gte: previousStartDate,
            $lt: startDate,
          },
        })
        .toArray();

      previousOrganicPageViews = previousOrganicPageViews.filter(
        (pv) =>
          !pv.referrer ||
          pv.referrer === 'direct' ||
          /google|bing|yahoo|duckduckgo/i.test(pv.referrer || '')
      );
    }

    // Calculate metrics
    const totalOrganicSessions = organicPageViews.length;
    const previousOrganicSessions = previousOrganicPageViews.length;
    const organicTrafficChange = previousOrganicSessions > 0
      ? ((totalOrganicSessions - previousOrganicSessions) / previousOrganicSessions) * 100
      : 0;

    // Get unique organic visitors
    const organicSessionIds = new Set(organicPageViews.map((pv) => pv.sessionId));
    const uniqueOrganicVisitors = organicSessionIds.size;

    // Get top organic pages
    const pageCounts: Record<string, number> = {};
    organicPageViews.forEach((pv) => {
      pageCounts[pv.page] = (pageCounts[pv.page] || 0) + 1;
    });

    const topOrganicPages = Object.entries(pageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([page, count]) => ({ page, sessions: count }));

    // Calculate average session duration for organic traffic
    const organicSessions = await db
      .collection(COLLECTIONS.ANALYTICS_SESSIONS)
      .find({
        sessionId: { $in: Array.from(organicSessionIds) },
        createdAt: { $gte: startDate },
      })
      .toArray();

    const sessionsWithDuration = organicSessions.filter((s) => s.duration > 0);
    const avgSessionDuration =
      sessionsWithDuration.length > 0
        ? Math.round(
            sessionsWithDuration.reduce((sum, s) => sum + s.duration, 0) /
              sessionsWithDuration.length
          )
        : 0;

    // Calculate average scroll depth
    const avgScrollDepth =
      organicPageViews.length > 0
        ? Math.round(
            organicPageViews.reduce((sum, pv) => sum + (pv.scrollDepth || 0), 0) /
              organicPageViews.length
          )
        : 0;

    // Get indexing status (from sitemap)
    const sitemapPages = await db
      .collection('blogs')
      .countDocuments({ published: true });
    const projects = await db
      .collection('projects')
      .countDocuments({ published: true });
    const totalIndexablePages = 13 + sitemapPages + projects; // 13 static pages + dynamic

    // Calculate SEO score (0-100)
    const seoScore = calculateSEOScore({
      organicTraffic: totalOrganicSessions > 0 ? Math.min(100, (totalOrganicSessions / 1000) * 100) : 0,
      indexing: (totalIndexablePages / Math.max(totalIndexablePages, 50)) * 100,
      engagement: Math.min(100, (avgSessionDuration / 120) * 100),
      scrollDepth: avgScrollDepth,
    });

    return NextResponse.json({
      range,
      period: {
        start: startDate.toISOString(),
        end: now.toISOString(),
      },
      metrics: {
        organicTraffic: {
          totalSessions: totalOrganicSessions,
          uniqueVisitors: uniqueOrganicVisitors,
          change: compare ? organicTrafficChange : null,
          trend: organicTrafficChange > 0 ? 'up' : organicTrafficChange < 0 ? 'down' : 'stable',
        },
        engagement: {
          avgSessionDuration,
          avgScrollDepth,
        },
        indexing: {
          totalIndexablePages,
          blogPosts: sitemapPages,
          projects,
        },
        topPages: topOrganicPages,
        seoScore: {
          score: Math.round(seoScore),
          grade: getSEOGrade(seoScore),
        },
      },
      comparison: compare
        ? {
            previousPeriod: {
              start: previousStartDate.toISOString(),
              end: startDate.toISOString(),
            },
            previousOrganicSessions,
          }
        : null,
    });
  } catch (error) {
    console.error('SEO metrics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SEO metrics' },
      { status: 500 }
    );
  }
}

function calculateSEOScore(metrics: {
  organicTraffic: number;
  indexing: number;
  engagement: number;
  scrollDepth: number;
}): number {
  // Weighted scoring (0-100 scale)
  const trafficScore = metrics.organicTraffic * 0.30; // 30% weight
  const indexingScore = metrics.indexing * 0.20; // 20% weight
  const engagementScore = metrics.engagement * 0.30; // 30% weight
  const scrollScore = (metrics.scrollDepth / 100) * 100 * 0.20; // 20% weight

  return Math.min(100, trafficScore + indexingScore + engagementScore + scrollScore);
}

function getSEOGrade(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Very Good';
  if (score >= 50) return 'Good';
  if (score >= 30) return 'Needs Improvement';
  return 'Poor';
}

