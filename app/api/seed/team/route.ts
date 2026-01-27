import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

const initialTeamMembers = [
  {
    name: 'Alex Chen',
    role: 'Founder & CEO',
    image: '/team/alex.png',
    order: 1,
  },
  {
    name: 'Sarah Mitchell',
    role: 'Creative Director',
    image: '/team/sarah.png',
    order: 2,
  },
  {
    name: 'Marcus Johnson',
    role: 'Lead Developer',
    image: '/team/marcus.png',
    order: 3,
  },
  {
    name: 'Emily Rodriguez',
    role: 'UX Designer',
    image: '/team/emily.png',
    order: 4,
  },
  {
    name: 'David Kim',
    role: 'Backend Engineer',
    image: '/team/david.png',
    order: 5,
  },
  {
    name: 'Lisa Thompson',
    role: 'Project Manager',
    image: '/team/lisa.png',
    order: 6,
  },
];

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');
    const collection = db.collection('teamMembers');

    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json({
        message: 'Team members already seeded',
        count: existingCount,
      });
    }

    const now = new Date();
    const membersWithTimestamps = initialTeamMembers.map((member) => ({
      ...member,
      published: true,
      createdAt: now,
      updatedAt: now,
    }));

    const result = await collection.insertMany(membersWithTimestamps);

    return NextResponse.json({
      message: 'Team members seeded successfully',
      count: result.insertedCount,
    });
  } catch (error) {
    console.error('Error seeding team members:', error);
    return NextResponse.json(
      { error: 'Failed to seed team members' },
      { status: 500 }
    );
  }
}
