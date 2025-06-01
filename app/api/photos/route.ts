import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const photosDirectory = path.join(process.cwd(), 'public/photos');
    const filenames = fs.readdirSync(photosDirectory);
    
    // Filter for image files only (exclude .heic files since they're not web-compatible)
    const imageFiles = filenames.filter(file => 
      file.toLowerCase().endsWith('.jpeg') || 
      file.toLowerCase().endsWith('.jpg') || 
      file.toLowerCase().endsWith('.png') || 
      file.toLowerCase().endsWith('.webp')
    );
    
    return NextResponse.json({ photos: imageFiles });
  } catch (error) {
    console.error('Error reading photos directory:', error);
    return NextResponse.json({ photos: [] }, { status: 500 });
  }
}