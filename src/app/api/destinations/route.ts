import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

async function isAuthorized(request: NextRequest) {
  // For development mode, allow all requests if no Supabase is configured OR if admin email is set
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return true;
  }

  // In development mode with admin email set, allow admin operations
  if (process.env.NODE_ENV === 'development' && process.env.ADMIN_EMAIL) {
    console.log('Development mode: allowing admin operations for admin email');
    return true;
  }

  try {
    const cookieStore = cookies();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          storage: {
            getItem: (key: string) => cookieStore.get(key)?.value ?? null,
            setItem: () => {},
            removeItem: () => {},
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;
    
    // Check if user has admin role in profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    return profile?.role === 'admin';
  } catch (error) {
    return false;
  }
}

// GET - List all destinations
export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: destinations, error } = await supabase
      .from('destinations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Transform coordinates back to array format for frontend compatibility
    const transformedDestinations = destinations?.map(dest => ({
      id: dest.id,
      name: dest.name,
      country: dest.country,
      coordinates: [
        parseFloat(dest.coordinates.replace(/[()]/g, '').split(',')[0]),
        parseFloat(dest.coordinates.replace(/[()]/g, '').split(',')[1])
      ],
      visited: dest.visited,
      visitDate: dest.visit_date,
      description: dest.description,
      photos: dest.photos || [],
      rating: dest.rating,
      highlights: dest.highlights || [],
      travelTips: dest.travel_tips || []
    })) || [];

    return NextResponse.json({ destinations: transformedDestinations });
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

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const destination = await request.json();
    
    // Use service role key for admin operations to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: newDestination, error } = await supabase
      .from('destinations')
      .insert([{
        name: destination.name,
        country: destination.country,
        coordinates: `(${destination.coordinates[0]}, ${destination.coordinates[1]})`,
        visited: destination.visited || false,
        visit_date: destination.visitDate || null,
        description: destination.description || '',
        photos: destination.photos || [],
        rating: destination.rating || null,
        highlights: destination.highlights || [],
        travel_tips: destination.travelTips || []
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Destination created successfully!',
      destination: newDestination
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

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const destination = await request.json();
    
    // Use service role key for admin operations to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: updatedDestination, error } = await supabase
      .from('destinations')
      .update({
        name: destination.name,
        country: destination.country,
        coordinates: `(${destination.coordinates[0]}, ${destination.coordinates[1]})`,
        visited: destination.visited || false,
        visit_date: destination.visitDate || null,
        description: destination.description || '',
        photos: destination.photos || [],
        rating: destination.rating || null,
        highlights: destination.highlights || [],
        travel_tips: destination.travelTips || [],
        updated_at: new Date().toISOString()
      })
      .eq('id', destination.id)
      .select()
      .single();

    if (error) {
      throw error;
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Destination updated successfully!',
      destination: updatedDestination
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

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Destination ID is required' }, { status: 400 });
    }

    // Use service role key for admin operations to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase
      .from('destinations')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Destination deleted successfully!' 
    });
  } catch (error) {
    console.error('Error deleting destination:', error);
    return NextResponse.json({ error: 'Failed to delete destination' }, { status: 500 });
  }
}
