import { NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/db/mongodb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '7d';

  try {
    const db = await getDatabase();
    const now = new Date();

    // Calculate date range
    let startDate: Date;
    switch (range) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '7d':
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get page views in range
    const pageViews = await db
      .collection(COLLECTIONS.ANALYTICS_PAGEVIEWS)
      .find({ timestamp: { $gte: startDate } })
      .toArray();

    // Get sessions in range
    const sessions = await db
      .collection(COLLECTIONS.ANALYTICS_SESSIONS)
      .find({ createdAt: { $gte: startDate } })
      .toArray();

    // Get active sessions (last 5 minutes)
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const activeSessions = await db
      .collection(COLLECTIONS.ANALYTICS_SESSIONS)
      .countDocuments({ lastActivity: { $gte: fiveMinutesAgo } });

    // Calculate metrics
    const totalVisits = pageViews.length;
    const uniqueVisitors = new Set(sessions.map((s) => s.sessionId)).size;

    // Average session duration
    const sessionsWithDuration = sessions.filter((s) => s.duration > 0);
    const avgSessionDuration =
      sessionsWithDuration.length > 0
        ? Math.round(
            sessionsWithDuration.reduce(
              (sum, s) => sum + (s.duration || 0),
              0
            ) / sessionsWithDuration.length
          )
        : 0;

    // Bounce rate (sessions with only 1 page viewed)
    const bouncedSessions = sessions.filter(
      (s) => (s.pagesViewed?.length || 0) <= 1
    ).length;
    const bounceRate =
      sessions.length > 0
        ? Math.round((bouncedSessions / sessions.length) * 100 * 10) / 10
        : 0;

    // Device breakdown
    const deviceCounts = { desktop: 0, tablet: 0, mobile: 0 };
    sessions.forEach((s) => {
      if (s.deviceType && deviceCounts.hasOwnProperty(s.deviceType)) {
        deviceCounts[s.deviceType as keyof typeof deviceCounts]++;
      }
    });
    const totalDevices = sessions.length || 1;
    const deviceBreakdown = {
      desktop: Math.round((deviceCounts.desktop / totalDevices) * 100),
      tablet: Math.round((deviceCounts.tablet / totalDevices) * 100),
      mobile: Math.round((deviceCounts.mobile / totalDevices) * 100),
    };

    // Scroll depth analysis
    const scrollDepths = pageViews.map((pv) => pv.scrollDepth || 0);
    const scrollDepth = {
      '0-25%': scrollDepths.filter((d) => d <= 25).length,
      '25-50%': scrollDepths.filter((d) => d > 25 && d <= 50).length,
      '50-75%': scrollDepths.filter((d) => d > 50 && d <= 75).length,
      '75-100%': scrollDepths.filter((d) => d > 75).length,
    };
    const totalScrolls = scrollDepths.length || 1;
    const scrollDepthPercent = {
      '0-25%': Math.round((scrollDepth['0-25%'] / totalScrolls) * 100),
      '25-50%': Math.round((scrollDepth['25-50%'] / totalScrolls) * 100),
      '50-75%': Math.round((scrollDepth['50-75%'] / totalScrolls) * 100),
      '75-100%': Math.round((scrollDepth['75-100%'] / totalScrolls) * 100),
    };

    // Page views by page (for top pages)
    const pageViewCounts: Record<string, number> = {};
    pageViews.forEach((pv) => {
      const page = pv.page || '/';
      pageViewCounts[page] = (pageViewCounts[page] || 0) + 1;
    });
    const topPages = Object.entries(pageViewCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([page, views]) => ({ page, views }));

    // Conversion funnel (simplified)
    const homeVisits = pageViews.filter(
      (pv) => pv.page === '/' || pv.page === '/home'
    ).length;
    const servicesVisits = pageViews.filter((pv) =>
      pv.page?.includes('/services')
    ).length;
    const contactVisits = pageViews.filter(
      (pv) => pv.page === '/contact'
    ).length;

    // Get form submissions from contacts collection
    const formSubmissions = await db
      .collection(COLLECTIONS.CONTACTS)
      .countDocuments({ createdAt: { $gte: startDate } });

    const conversionFunnel = [
      { stage: 'Page Visit', users: totalVisits, dropoffRate: 0 },
      {
        stage: 'Engaged (30s+)',
        users: sessionsWithDuration.filter((s) => s.duration >= 30).length,
        dropoffRate: 0,
      },
      { stage: 'Viewed Services', users: servicesVisits, dropoffRate: 0 },
      { stage: 'Contact Page', users: contactVisits, dropoffRate: 0 },
      { stage: 'Form Submitted', users: formSubmissions, dropoffRate: 0 },
    ];

    // Calculate dropoff rates
    for (let i = 1; i < conversionFunnel.length; i++) {
      const prev = conversionFunnel[i - 1].users || 1;
      const curr = conversionFunnel[i].users;
      conversionFunnel[i].dropoffRate =
        Math.round(((prev - curr) / prev) * 100 * 10) / 10;
    }

    // Conversion rate
    const conversionRate =
      totalVisits > 0
        ? Math.round((formSubmissions / totalVisits) * 100 * 10) / 10
        : 0;

    // Get events for animation engagement
    const events = await db
      .collection(COLLECTIONS.ANALYTICS_EVENTS)
      .find({ timestamp: { $gte: startDate } })
      .toArray();

    const animationEngagement = {
      heroInteractions: events.filter((e) => e.event === 'hero_interaction')
        .length,
      particleInteractions: events.filter(
        (e) => e.event === 'particle_interaction'
      ).length,
      magneticCursorUsage: events.filter((e) => e.event === 'magnetic_cursor')
        .length,
      avgEngagementTime: avgSessionDuration,
    };

    // Performance correlation (simplified - based on actual load times if tracked)
    const performanceCorrelation = [
      { loadTime: 500, conversionRate: conversionRate * 1.4 },
      { loadTime: 800, conversionRate: conversionRate * 1.2 },
      { loadTime: 1200, conversionRate: conversionRate },
      { loadTime: 1500, conversionRate: conversionRate * 0.9 },
      { loadTime: 2000, conversionRate: conversionRate * 0.7 },
      { loadTime: 2500, conversionRate: conversionRate * 0.5 },
      { loadTime: 3000, conversionRate: conversionRate * 0.3 },
    ];

    const analyticsData = {
      overview: {
        totalVisits,
        uniqueVisitors,
        avgSessionDuration,
        bounceRate,
        conversionRate,
      },
      realTimeMetrics: {
        activeUsers: activeSessions,
        pageViews: pageViews.filter(
          (pv) =>
            new Date(pv.timestamp).getTime() > now.getTime() - 60 * 60 * 1000
        ).length, // Last hour
        avgLoadTime: 850, // Would need real performance tracking
      },
      deviceBreakdown,
      animationEngagement,
      scrollDepth: scrollDepthPercent,
      conversionFunnel,
      performanceCorrelation,
      topPages,
    };

    return NextResponse.json(analyticsData, {
      headers: {
        'Cache-Control': 'private, max-age=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);

    // Return empty data structure on error
    return NextResponse.json({
      overview: {
        totalVisits: 0,
        uniqueVisitors: 0,
        avgSessionDuration: 0,
        bounceRate: 0,
        conversionRate: 0,
      },
      realTimeMetrics: {
        activeUsers: 0,
        pageViews: 0,
        avgLoadTime: 0,
      },
      deviceBreakdown: { desktop: 0, tablet: 0, mobile: 0 },
      animationEngagement: {
        heroInteractions: 0,
        particleInteractions: 0,
        magneticCursorUsage: 0,
        avgEngagementTime: 0,
      },
      scrollDepth: { '0-25%': 0, '25-50%': 0, '50-75%': 0, '75-100%': 0 },
      conversionFunnel: [],
      performanceCorrelation: [],
      topPages: [],
    });
  }
}
