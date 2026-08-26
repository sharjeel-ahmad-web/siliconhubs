import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

interface ContentSection {
  page: string;
  section: string;
  content: any;
  lastUpdated: string;
  contentPath: string;
  mediaPath?: string;
}

// Map pages to their media folders
const mediaFolderMap: Record<string, string> = {
  home: '/media/home/',
  about: '/media/about/',
  portfolio: '/media/portfolio/',
  contact: '/media/contact/',
  'services-webdesign': '/media/services/',
  'services-seo': '/media/services/',
  'services-wordpress': '/media/services/',
  'services-shopify': '/media/services/',
  'services-chatbot': '/media/services/',
  'services-n8n': '/media/services/',
  'services-saas': '/media/services/',
  blog: '/media/blog/',
};

// GET - Read all static JSON files from /public/content/
export async function GET(request: NextRequest) {
  try {
    const contentDir = path.join(process.cwd(), 'public', 'content');

    // Check if directory exists
    if (!fs.existsSync(contentDir)) {
      return NextResponse.json(
        {
          error:
            'Content directory not found. Run npm run generate:content first.',
        },
        { status: 404 }
      );
    }

    // Read all JSON files (except manifest)
    const files = fs
      .readdirSync(contentDir)
      .filter((file) => file.endsWith('.json') && file !== '_manifest.json');

    const contentSections: ContentSection[] = [];

    // Read each file and extract sections
    for (const file of files) {
      const page = file.replace('.json', '');
      const filepath = path.join(contentDir, file);
      const fileContent = fs.readFileSync(filepath, 'utf-8');
      const pageData = JSON.parse(fileContent);

      // Extract each section
      for (const [section, content] of Object.entries(pageData)) {
        contentSections.push({
          page,
          section,
          content,
          lastUpdated: (content as any)?._updatedAt || new Date().toISOString(),
          contentPath: `/public/content/${file}`,
          mediaPath: mediaFolderMap[page],
        });
      }
    }

    return NextResponse.json(contentSections);
  } catch (error) {
    console.error('Error reading static content:', error);
    return NextResponse.json(
      { error: 'Failed to read static content' },
      { status: 500 }
    );
  }
}
