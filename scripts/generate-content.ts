#!/usr/bin/env tsx
/**
 * Static Content Generation Script
 *
 * Fetches all non-blog content from MongoDB and generates static JSON files
 * grouped by page for ultra-fast page loading.
 *
 * Usage: npm run generate:content
 */

import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';

interface SiteContent {
  _id?: any;
  page: string;
  section: string;
  content: Record<string, any>;
  visible?: boolean;
  updatedAt: Date;
  createdAt: Date;
}

interface PageContent {
  [section: string]: any;
}

const MONGODB_URI = process.env.MONGODB_URI || '';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'content');

async function generateStaticContent() {
  console.log('🚀 Starting static content generation...\n');

  if (!MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI environment variable is not set');
    console.warn(
      '⚠️  Skipping content generation. Using existing static files if available.\n'
    );

    // Check if static files exist
    if (fs.existsSync(OUTPUT_DIR) && fs.readdirSync(OUTPUT_DIR).length > 1) {
      console.log(
        '✅ Existing static content files found. Build can continue.\n'
      );
      process.exit(0);
    } else {
      console.error('❌ No existing static content files found.');
      console.error(
        '❌ Please set MONGODB_URI or manually create content files.\n'
      );
      process.exit(1);
    }
  }

  let client: MongoClient | null = null;

  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db('rising-dot');
    console.log('✅ Connected to MongoDB\n');

    // Fetch all site content (exclude blogs - they remain dynamic)
    console.log('📦 Fetching site content from database...');
    const content = await db
      .collection<SiteContent>('siteContent')
      .find({})
      .toArray();

    console.log(`✅ Fetched ${content.length} content sections\n`);

    // Group content by page
    const pageMap: Record<string, PageContent> = {};

    content.forEach((item) => {
      if (!pageMap[item.page]) {
        pageMap[item.page] = {};
      }

      // Include content with visibility flag
      pageMap[item.page][item.section] = {
        ...item.content,
        _visible: item.visible !== false, // Default to true if not set
        _updatedAt: item.updatedAt,
      };
    });

    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      console.log('📁 Creating output directory:', OUTPUT_DIR);
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Write each page's content to a JSON file
    console.log('📝 Generating static JSON files...\n');
    const generatedFiles: string[] = [];

    for (const [page, pageContent] of Object.entries(pageMap)) {
      const filename = `${page}.json`;
      const filepath = path.join(OUTPUT_DIR, filename);

      // Write with pretty formatting for easier debugging
      fs.writeFileSync(filepath, JSON.stringify(pageContent, null, 2), 'utf-8');

      const sectionCount = Object.keys(pageContent).length;
      console.log(`  ✅ ${filename} (${sectionCount} sections)`);
      generatedFiles.push(filename);
    }

    // Generate a manifest file with metadata
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
      path.join(OUTPUT_DIR, '_manifest.json'),
      JSON.stringify(manifest, null, 2),
      'utf-8'
    );

    console.log('\n✨ Static content generation complete!');
    console.log(`📊 Generated ${generatedFiles.length} page files`);
    console.log(`📍 Location: ${OUTPUT_DIR}`);
    console.log(`🕐 Generated at: ${manifest.generatedAt}\n`);
  } catch (error) {
    console.error('❌ Error generating static content:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the script
generateStaticContent();
