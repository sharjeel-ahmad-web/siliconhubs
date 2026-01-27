import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// GET - Fetch subscriber stats
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [total, active, unsubscribed, thisMonth, lastMonth] =
      await Promise.all([
        db.collection('subscribers').countDocuments({}),
        db.collection('subscribers').countDocuments({ status: 'active' }),
        db.collection('subscribers').countDocuments({ status: 'unsubscribed' }),
        db.collection('subscribers').countDocuments({
          subscribedAt: { $gte: startOfMonth },
        }),
        db.collection('subscribers').countDocuments({
          subscribedAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
        }),
      ]);

    // Calculate growth percentage
    const growth =
      lastMonth > 0
        ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
        : thisMonth > 0
          ? 100
          : 0;

    return NextResponse.json({
      total,
      active,
      unsubscribed,
      thisMonth,
      growth,
    });
  } catch (error) {
    console.error('Error fetching subscriber stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
