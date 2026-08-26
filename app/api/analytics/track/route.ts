import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/db/mongodb';
import { headers } from 'next/headers';

// Generate a simple session ID from IP + User Agent
function generateSessionId(ip: string, userAgent: string): string {
  const data = `${ip}-${userAgent}-${new Date().toDateString()}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Track page view
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { page, referrer, scrollDepth, duration, event, eventData } = body;
    if (!event && page == null) {
      return NextResponse.json({ success: false });
    }

    const headersList = await headers();
    const ip =
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headersList.get('x-real-ip') ||
      'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    const sessionId = generateSessionId(ip, userAgent);
    const db = await getDatabase();
    const now = new Date();

    const isMobile = /mobile|android|iphone|ipad|tablet/i.test(userAgent);
    const isTablet = /tablet|ipad/i.test(userAgent);
    const deviceType = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';

    if (event) {
      await db.collection(COLLECTIONS.ANALYTICS_EVENTS).insertOne({
        sessionId,
        event,
        eventData,
        page: page ?? null,
        timestamp: now,
        deviceType,
      });
      return NextResponse.json({ success: true, type: 'event' });
    }

    const existingSession = await db
      .collection(COLLECTIONS.ANALYTICS_SESSIONS)
      .findOne({
        sessionId,
        createdAt: { $gte: new Date(now.getTime() - 30 * 60 * 1000) },
      });

    if (!existingSession) {
      await db.collection(COLLECTIONS.ANALYTICS_SESSIONS).insertOne({
        sessionId,
        ip: ip.substring(0, 20),
        userAgent: userAgent.substring(0, 200),
        deviceType,
        referrer: referrer || 'direct',
        pagesViewed: [page ?? ''],
        startTime: now,
        lastActivity: now,
        duration: 0,
        createdAt: now,
      });
    } else {
      const pagesViewed = existingSession.pagesViewed || [];
      if (page != null && !pagesViewed.includes(page)) {
        pagesViewed.push(page);
      }
      await db.collection(COLLECTIONS.ANALYTICS_SESSIONS).updateOne(
        { _id: existingSession._id },
        {
          $set: {
            pagesViewed,
            lastActivity: now,
            duration:
              duration ??
              Math.floor(
                (now.getTime() -
                  new Date(existingSession.startTime).getTime()) /
                  1000
              ),
            scrollDepth: Math.max(
              scrollDepth ?? 0,
              existingSession.scrollDepth ?? 0
            ),
          },
        }
      );
    }

    await db.collection(COLLECTIONS.ANALYTICS_PAGEVIEWS).insertOne({
      sessionId,
      page: page ?? '',
      referrer: referrer || 'direct',
      deviceType,
      scrollDepth: scrollDepth ?? 0,
      duration: duration ?? 0,
      timestamp: now,
    });

    return NextResponse.json({ success: true, sessionId });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    // Return 200 so clients don't retry and spam when DB/env is missing
    return NextResponse.json({ success: false });
  }
}
