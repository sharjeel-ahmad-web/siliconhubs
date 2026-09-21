import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { TeamMember } from '@/lib/db/models';

export const dynamic = 'force-dynamic';

// GET - Fetch published team members (public API)
export async function GET() {
  try {
    const db = await connectDB();

    const members = await db
      .collection<TeamMember>('teamMembers')
      .find({ published: { $in: [true, 'true'] } })
      .sort({ order: 1 })
      .toArray();

    const serializedMembers = members.map((member: any) => ({
      ...member,
      _id: member._id?.toString?.() || String(member._id),
    }));

    return NextResponse.json(serializedMembers, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('[api/team GET]', error);
    return NextResponse.json([]);
  }
}
