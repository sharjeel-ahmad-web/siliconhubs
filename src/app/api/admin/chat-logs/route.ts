import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'siliconhubs');
    const logs = await db.collection('chatMessages')
      .find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();
    
    const grouped = logs.reduce((acc, msg) => {
      const sessionId = msg.sessionId || 'unknown';
      if (!acc[sessionId]) {
        acc[sessionId] = {
          _id: sessionId,
          sessionId,
          messages: [],
          startedAt: msg.timestamp,
        };
      }
      acc[sessionId].messages.push(msg);
      return acc;
    }, {} as any);

    return NextResponse.json({ logs: Object.values(grouped) });
  } catch (error) {
    console.error('Error fetching chat logs:', error);
    return NextResponse.json({ error: 'Failed to fetch chat logs' }, { status: 500 });
  }
}