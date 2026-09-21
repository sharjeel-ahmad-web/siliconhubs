'use server';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '@/lib/db/mongodb';
import { Settings } from '@/lib/db/models';
import { authOptions } from '@/lib/auth/authOptions';

const SENSITIVE_KEY = /(password|secret|api.?key|private.?key|token)/i;

function redact(value: unknown, key = ''): unknown {
  if (SENSITIVE_KEY.test(key)) return value ? '••••••••' : '';
  if (Array.isArray(value)) return value.map((item) => redact(item));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([childKey, childValue]) => [
        childKey,
        redact(childValue, childKey),
      ])
    );
  }
  return value;
}

function mergeSecrets(existing: any, incoming: any): any {
  if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
    return incoming;
  }
  const result = { ...(existing || {}) };
  for (const [key, value] of Object.entries(incoming)) {
    if (SENSITIVE_KEY.test(key) && (!value || value === '••••••••')) continue;
    result[key] =
      value && typeof value === 'object' && !Array.isArray(value)
        ? mergeSecrets(existing?.[key], value)
        : value;
  }
  return result;
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return Boolean(session);
}

// GET - Retrieve settings
export async function GET(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    const client = await clientPromise;
    const db = client.db('siliconhubs');
    const collection = db.collection<Settings>('settings');

    if (key) {
      // Get specific setting
      const setting = await collection.findOne({ key });
      return NextResponse.json(redact(setting?.value || null));
    }

    // Get all settings
    const settings = await collection.find({}).toArray();
    const settingsMap: Record<string, any> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = redact(s.value);
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
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('siliconhubs');
    const collection = db.collection<Settings>('settings');

    const existing = await collection.findOne({ key });
    const safeValue = mergeSecrets(existing?.value, value);

    await collection.updateOne(
      { key },
      { $set: { key, value: safeValue, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, key });
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
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const settings = body.settings as Record<string, any>;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Settings object is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('siliconhubs');
    const collection = db.collection<Settings>('settings');

    const operations = await Promise.all(
      Object.entries(settings).map(async ([key, value]) => {
        const existing = await collection.findOne({ key });
        return {
          updateOne: {
            filter: { key },
            update: {
              $set: {
                key,
                value: mergeSecrets(existing?.value, value),
                updatedAt: new Date(),
              },
            },
            upsert: true,
          },
        };
      })
    );

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
