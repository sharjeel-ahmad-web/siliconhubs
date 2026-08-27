import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getDatabase, COLLECTIONS } from '@/lib/db/mongodb';

// GET - Dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();

    // Get counts
    const [projectsCount, contactsCount, newContactsCount, servicesCount] =
      await Promise.all([
        db.collection(COLLECTIONS.PROJECTS).countDocuments(),
        db.collection(COLLECTIONS.CONTACTS).countDocuments(),
        db.collection(COLLECTIONS.CONTACTS).countDocuments({ status: 'new' }),
        db.collection(COLLECTIONS.SERVICES).countDocuments(),
      ]);

    // Get recent contacts
    const recentContacts = await db
      .collection(COLLECTIONS.CONTACTS)
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    // Get recent projects
    const recentProjects = await db
      .collection(COLLECTIONS.PROJECTS)
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    return NextResponse.json(
      {
        stats: {
          projects: projectsCount,
          contacts: contactsCount,
          newContacts: newContactsCount,
          services: servicesCount,
        },
        recentContacts,
        recentProjects,
      },
      {
        headers: {
          'Cache-Control': 'private, max-age=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
