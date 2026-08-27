import { NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/db/mongodb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '30d';

  try {
    const db = await getDatabase();

    // Get settings to check if GA is connected
    const settings = await db
      .collection(COLLECTIONS.SETTINGS)
      .findOne({ key: 'google_analytics' });

    if (!settings?.value?.propertyId) {
      return NextResponse.json({ connected: false });
    }

    const propertyId = settings.value.propertyId;

    // For now, return demo data structure
    // In production, you would use the Google Analytics Data API
    // https://developers.google.com/analytics/devguides/reporting/data/v1

    const daysCount = range === '7d' ? 7 : range === '30d' ? 30 : 90;

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
        users: Math.floor(Math.random() * 500) + 100,
        sessions: Math.floor(Math.random() * 700) + 150,
        pageviews: Math.floor(Math.random() * 1500) + 300,
      });
    }

    // Calculate totals from daily data
    const totalUsers = dailyData.reduce((sum, d) => sum + d.users, 0);
    const totalSessions = dailyData.reduce((sum, d) => sum + d.sessions, 0);
    const totalPageviews = dailyData.reduce((sum, d) => sum + d.pageviews, 0);

    const analyticsData = {
      connected: true,
      propertyId,
      overview: {
        users: totalUsers,
        newUsers: Math.floor(totalUsers * 0.65),
        sessions: totalSessions,
        pageviews: totalPageviews,
        avgSessionDuration: 185, // seconds
        bounceRate: 42.5,
        usersChange: 12.3,
        sessionsChange: 8.7,
        pageviewsChange: 15.2,
      },
      realtime: {
        activeUsers: Math.floor(Math.random() * 20) + 1,
        pageviews: Math.floor(Math.random() * 100) + 20,
      },
      topPages: [
        { page: '/', views: Math.floor(totalPageviews * 0.35), avgTime: 120 },
        {
          page: '/services',
          views: Math.floor(totalPageviews * 0.15),
          avgTime: 95,
        },
        {
          page: '/about',
          views: Math.floor(totalPageviews * 0.12),
          avgTime: 85,
        },
        {
          page: '/contact',
          views: Math.floor(totalPageviews * 0.1),
          avgTime: 150,
        },
        {
          page: '/portfolio',
          views: Math.floor(totalPageviews * 0.08),
          avgTime: 110,
        },
        {
          page: '/blog',
          views: Math.floor(totalPageviews * 0.07),
          avgTime: 180,
        },
        {
          page: '/services/chatbot-development',
          views: Math.floor(totalPageviews * 0.05),
          avgTime: 200,
        },
        {
          page: '/services/web-design',
          views: Math.floor(totalPageviews * 0.04),
          avgTime: 165,
        },
      ],
      topSources: [
        {
          source: 'google',
          users: Math.floor(totalUsers * 0.45),
          sessions: Math.floor(totalSessions * 0.45),
        },
        {
          source: 'direct',
          users: Math.floor(totalUsers * 0.25),
          sessions: Math.floor(totalSessions * 0.25),
        },
        {
          source: 'facebook',
          users: Math.floor(totalUsers * 0.12),
          sessions: Math.floor(totalSessions * 0.12),
        },
        {
          source: 'linkedin',
          users: Math.floor(totalUsers * 0.08),
          sessions: Math.floor(totalSessions * 0.08),
        },
        {
          source: 'twitter',
          users: Math.floor(totalUsers * 0.05),
          sessions: Math.floor(totalSessions * 0.05),
        },
        {
          source: 'referral',
          users: Math.floor(totalUsers * 0.05),
          sessions: Math.floor(totalSessions * 0.05),
        },
      ],
      deviceBreakdown: [
        {
          device: 'desktop',
          users: Math.floor(totalUsers * 0.55),
          percentage: 55,
        },
        {
          device: 'mobile',
          users: Math.floor(totalUsers * 0.38),
          percentage: 38,
        },
        {
          device: 'tablet',
          users: Math.floor(totalUsers * 0.07),
          percentage: 7,
        },
      ],
      countryData: [
        {
          country: 'United States',
          users: Math.floor(totalUsers * 0.35),
          sessions: Math.floor(totalSessions * 0.35),
        },
        {
          country: 'United Kingdom',
          users: Math.floor(totalUsers * 0.15),
          sessions: Math.floor(totalSessions * 0.15),
        },
        {
          country: 'Canada',
          users: Math.floor(totalUsers * 0.1),
          sessions: Math.floor(totalSessions * 0.1),
        },
        {
          country: 'Germany',
          users: Math.floor(totalUsers * 0.08),
          sessions: Math.floor(totalSessions * 0.08),
        },
        {
          country: 'Australia',
          users: Math.floor(totalUsers * 0.07),
          sessions: Math.floor(totalSessions * 0.07),
        },
        {
          country: 'France',
          users: Math.floor(totalUsers * 0.05),
          sessions: Math.floor(totalSessions * 0.05),
        },
        {
          country: 'India',
          users: Math.floor(totalUsers * 0.05),
          sessions: Math.floor(totalSessions * 0.05),
        },
        {
          country: 'Netherlands',
          users: Math.floor(totalUsers * 0.04),
          sessions: Math.floor(totalSessions * 0.04),
        },
        {
          country: 'Spain',
          users: Math.floor(totalUsers * 0.03),
          sessions: Math.floor(totalSessions * 0.03),
        },
        {
          country: 'Italy',
          users: Math.floor(totalUsers * 0.03),
          sessions: Math.floor(totalSessions * 0.03),
        },
      ],
      dailyData,
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Google Analytics fetch error:', error);
    return NextResponse.json({
      connected: false,
      error: 'Failed to fetch data',
    });
  }
}
