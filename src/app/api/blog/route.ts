import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Get admin emails from environment variable
function getAdminEmails(): string[] {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return [];
  return [adminEmail];
}

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

// GET - List all blog posts
export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: blogPosts, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        comments (
          id,
          user_name,
          content,
          created_at
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ posts: blogPosts || [] });
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return NextResponse.json({ error: 'Failed to load blog posts' }, { status: 500 });
  }
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthorized(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const post = await request.json();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Generate slug from title
    const slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const { data: newPost, error } = await supabase
      .from('blog_posts')
      .insert([{
        title: post.title,
        slug: slug,
        excerpt: post.excerpt || '',
        content: post.content || '',
        author: post.author || 'Andrew',
        featured: post.featured || false,
        featured_image: post.featuredImage || null,
        tags: post.tags || [],
        published: post.published || true,
        destination_id: post.destinationId || null
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Blog post created successfully!',
      post: newPost
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}

// PUT - Update blog post
export async function PUT(request: NextRequest) {
  try {
    if (!(await isAuthorized(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const post = await request.json();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Generate slug from title if it's changed
    const slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const { data: updatedPost, error } = await supabase
      .from('blog_posts')
      .update({
        title: post.title,
        slug: slug,
        excerpt: post.excerpt || '',
        content: post.content || '',
        author: post.author || 'Andrew',
        featured: post.featured || false,
        featured_image: post.featuredImage || null,
        tags: post.tags || [],
        published: post.published || true,
        destination_id: post.destinationId || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', post.id)
      .select()
      .single();

    if (error) {
      throw error;
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Blog post updated successfully!',
      post: updatedPost
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE - Delete blog post
export async function DELETE(request: NextRequest) {
  try {
    if (!(await isAuthorized(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Blog post ID is required' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Delete the blog post (comments will be deleted automatically due to CASCADE)
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Blog post deleted successfully!' 
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
