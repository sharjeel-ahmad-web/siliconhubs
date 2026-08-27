import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string  }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'siliconhubs');
    
    const logs = await db.collection('chatMessages')
      .find({ sessionId: id })
      .sort({ timestamp: 1 })
      .toArray();
    
    return NextResponse.json({ logs: JSON.parse(JSON.stringify(logs)) });
  } catch (error) {
    console.error('Error fetching chat logs:', error);
    return NextResponse.json({ error: 'Failed to fetch chat logs' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string  }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'siliconhubs');
    
    await db.collection('chatMessages').deleteMany({ sessionId: id });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat logs:', error);
    return NextResponse.json({ error: 'Failed to delete chat logs' }, { status: 500 });
  }
}