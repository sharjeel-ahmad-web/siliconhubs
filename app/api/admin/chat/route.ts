import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

const DB_NAME = 'rising-dot';

// GET - Fetch all conversations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const conversations = await db
      .collection('conversations')
      .find(query)
      .sort({ updatedAt: -1 })
      .toArray();

    // Transform for frontend
    const transformed = conversations.map((conv) => ({
      id: conv._id.toString(),
      visitorName: conv.visitorName,
      visitorEmail: conv.visitorEmail,
      status: conv.status,
      messageCount: conv.messages?.length || 0,
      lastMessage: conv.messages?.[conv.messages.length - 1]?.content || '',
      lastMessageTime:
        conv.messages?.[conv.messages.length - 1]?.timestamp || conv.updatedAt,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}
