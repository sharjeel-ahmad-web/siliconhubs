import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import clientPromise from '@/lib/db/mongodb';
import fs from 'fs';
import path from 'path';

// Files will be uploaded preserving the full folder structure from /public
// e.g., /public/media/home/team/alex.png -> rising-dot/media/home/team/alex

// Supported file extensions for upload
const SUPPORTED_EXTENSIONS = [
  // Images
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.svg',
  '.ico',
  '.bmp',
  '.tiff',
  // Videos
  '.mp4',
  '.webm',
  '.mov',
  '.avi',
  '.mkv',
  // Documents/Raw files
  '.pdf',
  '.json',
  '.xml',
  '.txt',
  '.md',
  // 3D/Special
  '.splinecode',
  '.glb',
  '.gltf',
];

// Helper to recursively get all files in a directory
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;

  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      // Skip hidden files and .gitkeep
      if (file.startsWith('.') || file === '.gitkeep') return;

      // Include all supported file types
      const ext = path.extname(file).toLowerCase();
      if (SUPPORTED_EXTENSIONS.includes(ext)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

// Map local path to Cloudinary folder and public ID - preserves full path structure
function getCloudinaryPath(localPath: string): {
  folder: string;
  publicId: string;
} {
  // Normalize path and remove the base public directory
  const normalizedPath = localPath
    .replace(/\\/g, '/')
    .replace(/.*\/public\//, ''); // Remove everything up to and including /public/

  // Split into parts
  const pathParts = normalizedPath.split('/');
  const fileName = pathParts[pathParts.length - 1].replace(/\.[^/.]+$/, ''); // Remove extension

  // Get the folder path (everything except the filename)
  const folderParts = pathParts.slice(0, -1);

  // Build the Cloudinary folder path - prefix with rising-dot
  const cloudinaryFolder =
    folderParts.length > 0
      ? `rising-dot/${folderParts.join('/')}`
      : 'rising-dot';

  return {
    folder: cloudinaryFolder,
    publicId: fileName,
  };
}

// Get resource type based on file extension
function getResourceType(filePath: string): 'image' | 'video' | 'raw' {
  const ext = path.extname(filePath).toLowerCase();
  if (['.mp4', '.webm', '.mov', '.avi'].includes(ext)) return 'video';
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext))
    return 'image';
  return 'raw';
}

export async function POST(request: Request) {
  try {
    const { action } = await request.json();

    if (action === 'scan') {
      // Scan for all media files
      const publicDir = path.join(process.cwd(), 'public');
      const allFiles = getAllFiles(publicDir);

      const mediaFiles = allFiles.map((file) => {
        const relativePath = file
          .replace(process.cwd(), '')
          .replace(/\\/g, '/');
        const { folder, publicId } = getCloudinaryPath(file);
        return {
          localPath: relativePath,
          cloudinaryFolder: folder,
          cloudinaryId: `${folder}/${publicId}`,
          type: getResourceType(file),
          size: fs.statSync(file).size,
        };
      });

      return NextResponse.json({
        success: true,
        totalFiles: mediaFiles.length,
        files: mediaFiles,
      });
    }

    if (action === 'migrate') {
      const publicDir = path.join(process.cwd(), 'public');
      const allFiles = getAllFiles(publicDir);

      const results = {
        success: [] as string[],
        failed: [] as { file: string; error: string }[],
        skipped: [] as string[],
      };

      const urlMapping: Record<string, string> = {};

      for (const file of allFiles) {
        try {
          const relativePath = file
            .replace(process.cwd(), '')
            .replace(/\\/g, '/')
            .replace('/public', '');
          const { folder, publicId } = getCloudinaryPath(file);
          const resourceType = getResourceType(file);

          // Read file as base64
          const fileBuffer = fs.readFileSync(file);
          const base64 = fileBuffer.toString('base64');
          const mimeType =
            resourceType === 'video' ? 'video/mp4' : 'image/jpeg';
          const dataUri = `data:${mimeType};base64,${base64}`;

          // Upload to Cloudinary with proper folder structure
          const result = await uploadToCloudinary(dataUri, {
            folder: folder,
            publicId: publicId,
            resourceType: resourceType,
          });

          urlMapping[relativePath] = result.secureUrl;
          results.success.push(`${relativePath} -> ${folder}/${publicId}`);

          console.log(`Uploaded: ${relativePath} -> ${folder}/${publicId}`);
        } catch (error: any) {
          results.failed.push({
            file: file.replace(process.cwd(), ''),
            error: error.message,
          });
          console.error(`Failed to upload ${file}:`, error.message);
        }
      }

      // Save URL mapping to database for reference
      const client = await clientPromise;
      const db = client.db('rising-dot');

      await db.collection('settings').updateOne(
        { key: 'cloudinary_migration' },
        {
          $set: {
            key: 'cloudinary_migration',
            value: {
              urlMapping,
              migratedAt: new Date(),
              stats: {
                total: allFiles.length,
                success: results.success.length,
                failed: results.failed.length,
              },
            },
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );

      return NextResponse.json({
        success: true,
        stats: {
          total: allFiles.length,
          uploaded: results.success.length,
          failed: results.failed.length,
        },
        urlMapping,
        failed: results.failed,
      });
    }

    if (action === 'update-database') {
      // Update all database records to use Cloudinary URLs
      const client = await clientPromise;
      const db = client.db('rising-dot');

      // Get the URL mapping
      const migrationData = await db
        .collection('settings')
        .findOne({ key: 'cloudinary_migration' });

      if (!migrationData?.value?.urlMapping) {
        return NextResponse.json(
          { error: 'No migration data found. Run migrate first.' },
          { status: 400 }
        );
      }

      const urlMapping = migrationData.value.urlMapping;
      const updates: string[] = [];

      // Helper to replace URLs in an object (excludes _id field)
      const replaceUrls = (obj: any, excludeId: boolean = false): any => {
        if (typeof obj === 'string') {
          // Check if this is a local path that needs replacing
          for (const [localPath, cloudinaryUrl] of Object.entries(urlMapping)) {
            if (obj === localPath || obj === `/public${localPath}`) {
              return cloudinaryUrl;
            }
          }
          return obj;
        }
        if (Array.isArray(obj)) {
          return obj.map((item) => replaceUrls(item, false));
        }
        if (obj && typeof obj === 'object') {
          const newObj: any = {};
          for (const [key, value] of Object.entries(obj)) {
            // Skip _id field when excludeId is true
            if (excludeId && key === '_id') continue;
            newObj[key] = replaceUrls(value, false);
          }
          return newObj;
        }
        return obj;
      };

      // Update team members
      const teamMembers = await db.collection('teamMembers').find({}).toArray();
      for (const member of teamMembers) {
        const updated = replaceUrls(member, true);
        const original = { ...member };
        delete (original as any)._id;
        if (JSON.stringify(updated) !== JSON.stringify(original)) {
          await db
            .collection('teamMembers')
            .updateOne({ _id: member._id }, { $set: updated });
          updates.push(`teamMembers: ${member.name}`);
        }
      }

      // Update blogs
      const blogs = await db.collection('blogs').find({}).toArray();
      for (const blog of blogs) {
        const updated = replaceUrls(blog, true);
        const original = { ...blog };
        delete (original as any)._id;
        if (JSON.stringify(updated) !== JSON.stringify(original)) {
          await db
            .collection('blogs')
            .updateOne({ _id: blog._id }, { $set: updated });
          updates.push(`blogs: ${blog.title}`);
        }
      }

      // Update projects
      const projects = await db.collection('projects').find({}).toArray();
      for (const project of projects) {
        const updated = replaceUrls(project, true);
        const original = { ...project };
        delete (original as any)._id;
        if (JSON.stringify(updated) !== JSON.stringify(original)) {
          await db
            .collection('projects')
            .updateOne({ _id: project._id }, { $set: updated });
          updates.push(`projects: ${project.title}`);
        }
      }

      // Update services
      const services = await db.collection('services').find({}).toArray();
      for (const service of services) {
        const updated = replaceUrls(service, true);
        const original = { ...service };
        delete (original as any)._id;
        if (JSON.stringify(updated) !== JSON.stringify(original)) {
          await db
            .collection('services')
            .updateOne({ _id: service._id }, { $set: updated });
          updates.push(`services: ${service.title}`);
        }
      }

      // Update content (CMS pages)
      const content = await db.collection('content').find({}).toArray();
      for (const item of content) {
        const updated = replaceUrls(item, true);
        const original = { ...item };
        delete (original as any)._id;
        if (JSON.stringify(updated) !== JSON.stringify(original)) {
          await db
            .collection('content')
            .updateOne({ _id: item._id }, { $set: updated });
          updates.push(`content: ${item.page}/${item.section}`);
        }
      }

      return NextResponse.json({
        success: true,
        updatedRecords: updates.length,
        updates,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET endpoint to check migration status
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const migrationData = await db
      .collection('settings')
      .findOne({ key: 'cloudinary_migration' });

    if (!migrationData) {
      return NextResponse.json({
        migrated: false,
        message: 'No migration has been performed yet',
      });
    }

    return NextResponse.json({
      migrated: true,
      migratedAt: migrationData.value.migratedAt,
      stats: migrationData.value.stats,
      urlMappingCount: Object.keys(migrationData.value.urlMapping || {}).length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
