import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { TeamMember } from '@/lib/db/models';

// GET - Fetch all team members
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const members = await db
      .collection<TeamMember>('teamMembers')
      .find({})
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

// POST - Create new team member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, role, image, order, published } = body;

    if (!name || !role) {
      return NextResponse.json(
        { error: 'Name and role are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('rising-dot');

    const now = new Date();
    const newMember: Omit<TeamMember, '_id'> = {
      name,
      role,
      image: image || '/team/placeholder.png',
      order: order || 0,
      published: published ?? true,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection('teamMembers').insertOne(newMember);

    return NextResponse.json(
      {
        _id: result.insertedId,
        ...newMember,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    );
  }
}
