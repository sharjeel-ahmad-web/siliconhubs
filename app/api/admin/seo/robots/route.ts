import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');

// GET - Fetch robots.txt content
export async function GET() {
  try {
    const content = await readFile(robotsPath, 'utf-8');
    return NextResponse.json({ content });
  } catch (error) {
    // Return default if file doesn't exist
    return NextResponse.json({ content: '' });
  }
}

// POST - Save robots.txt content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    if (content === undefined) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    await writeFile(robotsPath, content, 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving robots.txt:', error);
    return NextResponse.json(
      { error: 'Failed to save robots.txt' },
      { status: 500 }
    );
  }
}
