import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

// Admin email check
const ADMIN_EMAILS = [
  'andrewliu3477@gmail.com', // Replace with your actual email
];

async function isAuthorized(request: NextRequest) {
  // For development mode, allow all requests
  if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return true;
  }

  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    return user && ADMIN_EMAILS.includes(user.email || '');
  } catch (error) {
    return false;
  }
}

// GET - List all destinations
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'travelData.ts');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Extract the destinations array from the TypeScript file
    const match = fileContent.match(/export const travelDestinations.*?=\s*(\[[\s\S]*?\]);/);
    if (match) {
      const destinationsStr = match[1];
      // This is a simple approach - in production, you'd want to parse this more carefully
      const destinations = eval(destinationsStr);
      return NextResponse.json({ destinations });
    }
    
    return NextResponse.json({ destinations: [] });
  } catch (error) {
    console.error('Error reading destinations:', error);
    return NextResponse.json({ error: 'Failed to load destinations' }, { status: 500 });
  }
}

// POST - Create new destination
export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthorized(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const destination = await request.json();
    
    // Generate ID
    destination.id = `dest_${Date.now()}`;
    destination.dateAdded = new Date().toISOString();
    
    // For now, we'll store in memory and show success
    // In a real app, you'd save to a database
    console.log('New destination would be saved:', destination);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Destination saved successfully!',
      destination 
    });
  } catch (error) {
    console.error('Error creating destination:', error);
    return NextResponse.json({ error: 'Failed to create destination' }, { status: 500 });
  }
}

// PUT - Update destination
export async function PUT(request: NextRequest) {
  try {
    if (!(await isAuthorized(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const destination = await request.json();
    destination.dateUpdated = new Date().toISOString();
    
    // For now, we'll just log and show success
    console.log('Destination would be updated:', destination);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Destination updated successfully!',
      destination 
    });
  } catch (error) {
    console.error('Error updating destination:', error);
    return NextResponse.json({ error: 'Failed to update destination' }, { status: 500 });
  }
}

// DELETE - Delete destination
export async function DELETE(request: NextRequest) {
  try {
    if (!(await isAuthorized(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Destination ID required' }, { status: 400 });
    }
    
    // For now, we'll just log and show success
    console.log('Destination would be deleted:', id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Destination deleted successfully!' 
    });
  } catch (error) {
    console.error('Error deleting destination:', error);
    return NextResponse.json({ error: 'Failed to delete destination' }, { status: 500 });
  }
}
