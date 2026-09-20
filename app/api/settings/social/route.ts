import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

const DB_NAME = 'siliconhubs';

const defaultLinks = {
  facebook: 'https://www.facebook.com/profile.php?id=61593591315934',
  twitter: 'https://x.com/Siliconhubs',
  instagram: 'https://www.instagram.com/siliconhubs/',
  linkedin: 'https://www.linkedin.com/in/sharjeel-ahmad-2646361b7/',
  youtube: 'https://www.youtube.com/@SiliconHubsAgency',
  github: 'https://github.com/siliconhubs',
  tiktok: 'https://www.tiktok.com/@siliconhubs',
  upwork: 'https://www.upwork.com/freelancers/~01ace30ba193ab9962',
  pinterest: 'https://pin.it/7aO5YxU8U',
  discord:
    'https://discord.com/channels/1551286828798320655/1551286830962319372',
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
