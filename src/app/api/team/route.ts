import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { TeamMember } from '@/lib/db/models';

// GET - Fetch published team members (public API)
export async function GET() {
  try {
    const db = await connectDB();

    const members = await db
      .collection<TeamMember>('teamMembers')
      .find({ published: true })
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(Array.isArray(members) ? members : []);
  } catch (error) {
    console.error('[api/team GET]', error);
    return NextResponse.json([]);
  }
}
