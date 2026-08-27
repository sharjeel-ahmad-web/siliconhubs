import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { query } from '@/lib/db/connection';

interface ActivityLog {
  id: number;
  user_id: number | null;
  user_name: string | null;
  user_email: string | null;
  action: string;
  resource_type: string | null;
  resource_id: number | null;
  details: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: Date;
}

// GET /api/admin/activity-log - Get activity logs with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');
    const resourceType = searchParams.get('resourceType');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Build query
    let queryText = `
      SELECT 
        al.id,
        al.user_id,
        u.name as user_name,
        u.email as user_email,
        al.action,
        al.resource_type,
        al.resource_id,
        al.details,
        al.ip_address,
        al.user_agent,
        al.created_at
      FROM activity_log al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `;
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (userId) {
      queryText += ` AND al.user_id = $${paramIndex}`;
      queryParams.push(parseInt(userId));
      paramIndex++;
    }

    if (action) {
      queryText += ` AND al.action = $${paramIndex}`;
      queryParams.push(action);
      paramIndex++;
    }

    if (resourceType) {
      queryText += ` AND al.resource_type = $${paramIndex}`;
      queryParams.push(resourceType);
      paramIndex++;
    }

    if (startDate) {
      queryText += ` AND al.created_at >= $${paramIndex}`;
      queryParams.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      queryText += ` AND al.created_at <= $${paramIndex}`;
      queryParams.push(endDate);
      paramIndex++;
    }

    queryText += ' ORDER BY al.created_at DESC';
    queryText += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);

    const logs = await query<ActivityLog>(queryText, queryParams);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as count FROM activity_log al WHERE 1=1';
    const countParams: any[] = [];
    let countParamIndex = 1;

    if (userId) {
      countQuery += ` AND al.user_id = $${countParamIndex}`;
      countParams.push(parseInt(userId));
      countParamIndex++;
    }

    if (action) {
      countQuery += ` AND al.action = $${countParamIndex}`;
      countParams.push(action);
      countParamIndex++;
    }

    if (resourceType) {
      countQuery += ` AND al.resource_type = $${countParamIndex}`;
      countParams.push(resourceType);
      countParamIndex++;
    }

    if (startDate) {
      countQuery += ` AND al.created_at >= $${countParamIndex}`;
      countParams.push(startDate);
      countParamIndex++;
    }

    if (endDate) {
      countQuery += ` AND al.created_at <= $${countParamIndex}`;
      countParams.push(endDate);
      countParamIndex++;
    }

    const countResult = await query<{ count: string }>(countQuery, countParams);
    const total = parseInt(countResult[0].count);

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity logs' },
      { status: 500 }
    );
  }
}
