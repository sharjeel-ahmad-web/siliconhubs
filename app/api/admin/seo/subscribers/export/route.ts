import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// GET - Export subscribers as CSV
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const subscribers = await db
      .collection('subscribers')
      .find({})
      .sort({ subscribedAt: -1 })
      .toArray();

    // Generate CSV
    const headers = [
      'Email',
      'Name',
      'Status',
      'Source',
      'Tags',
      'Subscribed Date',
    ];
    const rows = subscribers.map((sub) => [
      sub.email,
      sub.name || '',
      sub.status,
      sub.source,
      (sub.tags || []).join('; '),
      new Date(sub.subscribedAt).toISOString(),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="subscribers-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to export subscribers' },
      { status: 500 }
    );
  }
}
