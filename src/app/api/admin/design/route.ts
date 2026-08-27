import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'siliconhubs');
    const design = await db.collection('design').findOne({});
    if (!design) {
      return NextResponse.json({ design: {} });
    }
    return NextResponse.json({ design: JSON.parse(JSON.stringify(design)) });
  } catch (error) {
    console.error('Error fetching design:', error);
    return NextResponse.json({ error: 'Failed to fetch design' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'siliconhubs');
    await db.collection('design').updateOne({}, { $set: { ...body, updatedAt: new Date() } }, { upsert: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating design:', error);
    return NextResponse.json({ error: 'Failed to update design' }, { status: 500 });
  }
}