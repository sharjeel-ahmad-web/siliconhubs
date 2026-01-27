import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    // Test 1: Get account usage to verify credentials work
    const usage = await cloudinary.api.usage();

    // Test 2: List root folders
    let folders: any[] = [];
    try {
      const foldersResult = await cloudinary.api.root_folders();
      folders = foldersResult.folders || [];
    } catch (e) {
      console.error('Folders error:', e);
    }

    // Test 3: Try basic resources API (no folder filter)
    let allImages: any[] = [];
    try {
      const imagesResult = await cloudinary.api.resources({
        type: 'upload',
        resource_type: 'image',
        max_results: 50,
      });
      allImages = imagesResult.resources || [];
    } catch (e) {
      console.error('Images error:', e);
    }

    // Test 4: Try search API
    let searchResults: any[] = [];
    try {
      const searchResult = await cloudinary.search
        .expression('resource_type:image')
        .max_results(50)
        .execute();
      searchResults = searchResult.resources || [];
    } catch (e) {
      console.error('Search error:', e);
    }

    // Test 5: Try with rising-dot prefix
    let prefixResults: any[] = [];
    try {
      const prefixResult = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'rising-dot',
        resource_type: 'image',
        max_results: 50,
      });
      prefixResults = prefixResult.resources || [];
    } catch (e) {
      console.error('Prefix error:', e);
    }

    return NextResponse.json({
      success: true,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      usage: {
        plan: usage.plan,
        credits: usage.credits,
        storage: usage.storage,
        bandwidth: usage.bandwidth,
      },
      folders,
      allImagesCount: allImages.length,
      allImages: allImages.slice(0, 5).map((img: any) => ({
        public_id: img.public_id,
        folder: img.folder,
        url: img.secure_url,
      })),
      searchResultsCount: searchResults.length,
      searchResults: searchResults.slice(0, 5).map((img: any) => ({
        public_id: img.public_id,
        folder: img.folder,
        url: img.secure_url,
      })),
      prefixResultsCount: prefixResults.length,
      prefixResults: prefixResults.slice(0, 5).map((img: any) => ({
        public_id: img.public_id,
        folder: img.folder,
        url: img.secure_url,
      })),
    });
  } catch (error: any) {
    console.error('Test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.error || error,
      },
      { status: 500 }
    );
  }
}
