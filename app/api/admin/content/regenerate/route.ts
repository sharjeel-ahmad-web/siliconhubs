import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { SiteContent } from '@/lib/db/models';
import * as fs from 'fs';
import * as path from 'path';

interface PageContent {
  [section: string]: any;
}

// POST - Regenerate all static content files from MongoDB
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    // Fetch all site content
    const content = await db
      .collection<SiteContent>('siteContent')
      .find({})
      .toArray();

    // Group content by page
    const pageMap: Record<string, PageContent> = {};

    content.forEach((item) => {
      if (!pageMap[item.page]) {
        pageMap[item.page] = {};
      }

      // Include content with visibility flag
      pageMap[item.page][item.section] = {
        ...item.content,
        _visible: item.visible !== false,
        _updatedAt: item.updatedAt,
      };
    });

    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'public', 'content');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write each page's content to a JSON file
    const regeneratedFiles: string[] = [];

    for (const [page, pageContent] of Object.entries(pageMap)) {
      const filename = `${page}.json`;
      const filepath = path.join(outputDir, filename);

      fs.writeFileSync(filepath, JSON.stringify(pageContent, null, 2), 'utf-8');

      regeneratedFiles.push(filename);
    }

    // Generate manifest
    const manifest = {
      generatedAt: new Date().toISOString(),
      pages: Object.keys(pageMap).map((page) => ({
        name: page,
        file: `${page}.json`,
        sections: Object.keys(pageMap[page]).length,
      })),
      totalSections: content.length,
    };

    fs.writeFileSync(
      path.join(outputDir, '_manifest.json'),
      JSON.stringify(manifest, null, 2),
      'utf-8'
    );

    return NextResponse.json({
      success: true,
      message: 'Static content regenerated successfully',
      filesGenerated: regeneratedFiles,
      totalPages: regeneratedFiles.length,
      totalSections: content.length,
      generatedAt: manifest.generatedAt,
    });
  } catch (error) {
    console.error('Error regenerating content:', error);
    return NextResponse.json(
      { error: 'Failed to regenerate content' },
      { status: 500 }
    );
  }
}
