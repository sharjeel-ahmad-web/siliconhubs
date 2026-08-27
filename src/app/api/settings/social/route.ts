import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

const DB_NAME = 'silicon-hubs';

const defaultLinks = {
  facebook: 'https://facebook.com/siliconhubs',
  twitter: 'https://twitter.com/siliconhubs',
  instagram: 'https://instagram.com/siliconhubs',
  linkedin: 'https://linkedin.com/company/siliconhubs',
  youtube: '',
  github: 'https://github.com/siliconhubs',
};

// GET - Fetch social links
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const settings = await db
      .collection('settings')
      .findOne({ type: 'social' });
    return NextResponse.json(settings?.data || defaultLinks);
  } catch (error) {
    // MongoDB missing, connection failed, or env not set: return defaults so the site still works
    console.error('Error fetching social links:', error);
    return NextResponse.json(defaultLinks);
  }
}

// POST - Save social links
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    await db.collection('settings').updateOne(
      { type: 'social' },
      {
        $set: {
          type: 'social',
          data: body,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving social links:', error);
    return NextResponse.json(
      { error: 'Failed to save social links' },
      { status: 500 }
    );
  }
}
