import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string  }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'siliconhubs');
    
    const item = await db.collection('navigation').findOne({ _id: id } as any);
    
    if (!item) {
      return NextResponse.json({ error: 'Navigation item not found' }, { status: 404 });
    }
    
    return NextResponse.json({ item: JSON.parse(JSON.stringify(item)) });
  } catch (error) {
    console.error('Error fetching navigation item:', error);
    return NextResponse.json({ error: 'Failed to fetch navigation item' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string  }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'siliconhubs');
    
    await db.collection('navigation').updateOne({ _id: id } as any, { $set: body });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating navigation item:', error);
    return NextResponse.json({ error: 'Failed to update navigation item' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string  }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'siliconhubs');
    
    await db.collection('navigation').deleteOne({ _id: id } as any);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting navigation item:', error);
    return NextResponse.json({ error: 'Failed to delete navigation item' }, { status: 500 });
  }
}