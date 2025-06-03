import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const photosDirectory = path.join(process.cwd(), 'public/photos');
    const filenames = fs.readdirSync(photosDirectory);
    
    // Filter for image and video files (exclude .heic files since they're not web-compatible)
    const mediaFiles = filenames.filter(file => {
      const lowercaseFile = file.toLowerCase();
      return (
        // Image formats
        lowercaseFile.endsWith('.jpeg') || 
        lowercaseFile.endsWith('.jpg') || 
        lowercaseFile.endsWith('.png') || 
        lowercaseFile.endsWith('.webp') ||
        // Video formats
        lowercaseFile.endsWith('.mp4') ||
        lowercaseFile.endsWith('.webm') ||
        lowercaseFile.endsWith('.mov')
      );
    });
    
    return NextResponse.json({ photos: mediaFiles });
  } catch (error) {
    console.error('Error reading photos directory:', error);
    return NextResponse.json({ photos: [] }, { status: 500 });
  }
}