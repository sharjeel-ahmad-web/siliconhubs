import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { query } from '@/lib/db/connection';
import bcrypt from 'bcryptjs';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  two_factor_enabled: boolean;
  created_at: Date;
  updated_at: Date;
}

// GET /api/admin/users - List all users with search/filter
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build query
    let queryText =
      'SELECT id, email, name, role, two_factor_enabled, created_at, updated_at FROM users WHERE 1=1';
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (search) {
      queryText += ` AND (email ILIKE $${paramIndex} OR name ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    if (role) {
      queryText += ` AND role = $${paramIndex}`;
      queryParams.push(role);
      paramIndex++;
    }

    queryText += ' ORDER BY created_at DESC';
    queryText += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);

    const users = await query<User>(queryText, queryParams);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as count FROM users WHERE 1=1';
    const countParams: any[] = [];
    let countParamIndex = 1;

    if (search) {
      countQuery += ` AND (email ILIKE $${countParamIndex} OR name ILIKE $${countParamIndex})`;
      countParams.push(`%${search}%`);
      countParamIndex++;
    }

    if (role) {
      countQuery += ` AND role = $${countParamIndex}`;
      countParams.push(role);
    }

    const countResult = await query<{ count: string }>(countQuery, countParams);
    const total = parseInt(countResult[0].count);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, name, password, role } = body;

    // Validate input
    if (!email || !name || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['admin', 'editor', 'viewer'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Check if user already exists
    const existingUsers = await query<User>(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const newUsers = await query<User>(
      `INSERT INTO users (email, name, password_hash, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, email, name, role, two_factor_enabled, created_at, updated_at`,
      [email, name, passwordHash, role]
    );

    const newUser = newUsers[0];

    // Log activity
    await query(
      `INSERT INTO activity_log (user_id, action, resource_type, resource_id, details, created_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
      [
        (session.user as any).id,
        'create_user',
        'user',
        newUser.id,
        JSON.stringify({ email, name, role }),
      ]
    );

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
