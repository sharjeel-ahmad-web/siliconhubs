'use server';

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { Settings } from '@/lib/db/models';

// GET - Retrieve settings
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    const client = await clientPromise;
    const db = client.db('risingdot');
    const collection = db.collection<Settings>('settings');

    if (key) {
      // Get specific setting
      const setting = await collection.findOne({ key });
      return NextResponse.json(setting?.value || null);
    }

    // Get all settings
    const settings = await collection.find({}).toArray();
    const settingsMap: Record<string, any> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// POST - Save settings
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('risingdot');
    const collection = db.collection<Settings>('settings');

    await collection.updateOne(
      { key },
      { $set: { key, value, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, key, value });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}

// PUT - Bulk update settings
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const settings = body.settings as Record<string, any>;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Settings object is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('risingdot');
    const collection = db.collection<Settings>('settings');

    const operations = Object.entries(settings).map(([key, value]) => ({
      updateOne: {
        filter: { key },
        update: { $set: { key, value, updatedAt: new Date() } },
        upsert: true,
      },
    }));

    await collection.bulkWrite(operations);

    return NextResponse.json({
      success: true,
      updated: Object.keys(settings).length,
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
