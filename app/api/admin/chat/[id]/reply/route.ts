import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/db/mongodb';

const DB_NAME = 'rising-dot';

// POST - Admin sends a reply
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const adminMessage = {
      role: 'assistant',
      content: message,
      timestamp: new Date(),
      isHuman: true, // Flag to indicate this is from a human agent
    };

    await db.collection('conversations').updateOne(
      { _id: new ObjectId(id) },
      {
        $push: { messages: adminMessage } as any,
        $set: {
          status: 'human',
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: adminMessage,
    });
  } catch (error) {
    console.error('Error sending admin reply:', error);
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 }
    );
  }
}
