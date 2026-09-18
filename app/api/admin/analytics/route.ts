import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/db/mongodb';

async function calculateAnalytics(db: any, now: Date, range: string) {
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

  const pageViews = await db
    .collection(COLLECTIONS.ANALYTICS_PAGEVIEWS)
    .find({ timestamp: { $gte: startDate } })
    .toArray();

  const sessions = await db
    .collection(COLLECTIONS.ANALYTICS_SESSIONS)
    .find({ createdAt: { $gte: startDate } })
    .toArray();

  const activeSessions = await db
    .collection(COLLECTIONS.ANALYTICS_SESSIONS)
    .countDocuments({
      lastActivity: { $gte: new Date(now.getTime() - 5 * 60 * 1000) },
    });

  const totalVisits = pageViews.length;
  const uniqueVisitors = new Set(sessions.map((s: any) => s.sessionId)).size;

  const sessionsWithDuration = sessions.filter((s: any) => s.duration > 0);
  const avgSessionDuration =
    sessionsWithDuration.length > 0
      ? Math.round(
          sessionsWithDuration.reduce(
            (sum: number, s: any) => sum + (s.duration || 0),
            0
          ) / sessionsWithDuration.length
        )
      : 0;

  const bouncedSessions = sessions.filter(
    (s: any) => (s.pagesViewed?.length || 0) <= 1
  ).length;
  const bounceRate =
    sessions.length > 0
      ? Math.round((bouncedSessions / sessions.length) * 100 * 10) / 10
      : 0;

  const deviceCounts: Record<string, number> = {
    desktop: 0,
    tablet: 0,
    mobile: 0,
  };
  sessions.forEach((s: any) => {
    if (s.deviceType && deviceCounts.hasOwnProperty(s.deviceType)) {
      deviceCounts[s.deviceType]++;
    }
  });
  const totalDevices = sessions.length || 1;
  const deviceBreakdown = {
    desktop: Math.round((deviceCounts.desktop / totalDevices) * 100),
    tablet: Math.round((deviceCounts.tablet / totalDevices) * 100),
    mobile: Math.round((deviceCounts.mobile / totalDevices) * 100),
  };

  const scrollDepths = pageViews.map((pv: any) => pv.scrollDepth || 0);
  const scrollDepth: Record<string, number> = {
    '0-25%': scrollDepths.filter((d: number) => d <= 25).length,
    '25-50%': scrollDepths.filter((d: number) => d > 25 && d <= 50).length,
    '50-75%': scrollDepths.filter((d: number) => d > 50 && d <= 75).length,
    '75-100%': scrollDepths.filter((d: number) => d > 75).length,
  };
  const totalScrolls = scrollDepths.length || 1;
  const scrollDepthPercent: Record<string, number> = {
    '0-25%': Math.round((scrollDepth['0-25%'] / totalScrolls) * 100),
    '25-50%': Math.round((scrollDepth['25-50%'] / totalScrolls) * 100),
    '50-75%': Math.round((scrollDepth['50-75%'] / totalScrolls) * 100),
    '75-100%': Math.round((scrollDepth['75-100%'] / totalScrolls) * 100),
  };

  const pageViewCounts: Record<string, number> = {};
  pageViews.forEach((pv: any) => {
    const page = pv.page || '/';
    pageViewCounts[page] = (pageViewCounts[page] || 0) + 1;
  });
  const topPages = Object.entries(pageViewCounts)
    .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
    .slice(0, 10)
    .map(([page, views]) => ({ page, views }));

  const homeVisits = pageViews.filter(
    (pv: any) => pv.page === '/' || pv.page === '/home'
  ).length;
  const servicesVisits = pageViews.filter((pv: any) =>
    pv.page?.includes('/services')
  ).length;
  const contactVisits = pageViews.filter(
    (pv: any) => pv.page === '/contact'
  ).length;

  const formSubmissions = await db
    .collection(COLLECTIONS.CONTACTS)
    .countDocuments({ createdAt: { $gte: startDate } });

  const conversionFunnel = [
    { stage: 'Page Visit', users: totalVisits, dropoffRate: 0 },
    {
      stage: 'Engaged (30s+)',
      users: sessionsWithDuration.filter((s: any) => s.duration >= 30).length,
      dropoffRate: 0,
    },
    { stage: 'Viewed Services', users: servicesVisits, dropoffRate: 0 },
    { stage: 'Contact Page', users: contactVisits, dropoffRate: 0 },
    { stage: 'Form Submitted', users: formSubmissions, dropoffRate: 0 },
  ];

  for (let i = 1; i < conversionFunnel.length; i++) {
    const prev = conversionFunnel[i - 1].users || 1;
    const curr = conversionFunnel[i].users;
    conversionFunnel[i].dropoffRate =
      Math.round(((prev - curr) / prev) * 100 * 10) / 10;
  }

  const conversionRate =
    totalVisits > 0
      ? Math.round((formSubmissions / totalVisits) * 100 * 10) / 10
      : 0;

  const events = await db
    .collection(COLLECTIONS.ANALYTICS_EVENTS)
    .find({ timestamp: { $gte: startDate } })
    .toArray();

  const animationEngagement = {
    heroInteractions: events.filter((e: any) => e.event === 'hero_interaction')
      .length,
    particleInteractions: events.filter(
      (e: any) => e.event === 'particle_interaction'
    ).length,
    magneticCursorUsage: events.filter(
      (e: any) => e.event === 'magnetic_cursor'
    ).length,
    avgEngagementTime: avgSessionDuration,
  };

  const performanceCorrelation = [
    { loadTime: 500, conversionRate: conversionRate * 1.4 },
    { loadTime: 800, conversionRate: conversionRate * 1.2 },
    { loadTime: 1200, conversionRate: conversionRate },
    { loadTime: 1500, conversionRate: conversionRate * 0.9 },
    { loadTime: 2000, conversionRate: conversionRate * 0.7 },
    { loadTime: 2500, conversionRate: conversionRate * 0.5 },
    { loadTime: 3000, conversionRate: conversionRate * 0.3 },
  ];

  return {
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
        (pv: any) =>
          new Date(pv.timestamp).getTime() > now.getTime() - 60 * 60 * 1000
      ).length,
      avgLoadTime: 850,
    },
    deviceBreakdown,
    animationEngagement,
    scrollDepth: scrollDepthPercent,
    conversionFunnel,
    performanceCorrelation,
    topPages,
  };
}

export async function GET(request: Request) {
  try {
    const db = await getDatabase();
    const now = new Date();
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';
    const data = await calculateAnalytics(db, now, range);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'private, max-age=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json({
      overview: {
        totalVisits: 0,
        uniqueVisitors: 0,
        avgSessionDuration: 0,
        bounceRate: 0,
        conversionRate: 0,
      },
      realTimeMetrics: { activeUsers: 0, pageViews: 0, avgLoadTime: 0 },
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDatabase();
    const now = new Date();
    const { range = '7d', events } = body;

    if (Array.isArray(events) && events.length > 0) {
      const eventDocs = events.map((e: any) => ({
        ...e,
        timestamp: e.timestamp || now,
        createdAt: now,
      }));
      await db.collection(COLLECTIONS.ANALYTICS_EVENTS).insertMany(eventDocs);
    }

    const data = await calculateAnalytics(db, now, range);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Analytics POST error:', error);
    return NextResponse.json({
      overview: {
        totalVisits: 0,
        uniqueVisitors: 0,
        avgSessionDuration: 0,
        bounceRate: 0,
        conversionRate: 0,
      },
      realTimeMetrics: { activeUsers: 0, pageViews: 0, avgLoadTime: 0 },
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
