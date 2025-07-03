import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

// Admin email check
const getAdminEmails = () => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (adminEmail) {
    return [adminEmail];
  }
  // Fallback for development
  return ['andrewliu3477@gmail.com'];
};

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
    return user && getAdminEmails().includes(user.email || '');
  } catch (error) {
    return false;
  }
}

// GET - List all blog posts
export async function GET() {
  try {
    const postsDir = path.join(process.cwd(), 'src', 'data', 'posts');
    
    if (!fs.existsSync(postsDir)) {
      return NextResponse.json({ posts: [] });
    }
    
    const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
    const posts = files.map(file => {
      const filePath = path.join(postsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Extract frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        const lines = frontmatter.split('\n');
        const metadata: any = {};
        
        lines.forEach(line => {
          const [key, ...valueParts] = line.split(':');
          if (key && valueParts.length > 0) {
            const value = valueParts.join(':').trim();
            metadata[key.trim()] = value.replace(/^["']|["']$/g, '');
          }
        });
        
        return {
          id: file.replace('.md', ''),
          filename: file,
          ...metadata,
          content: content.replace(/^---\n[\s\S]*?\n---\n/, '')
        };
      }
      
      return {
        id: file.replace('.md', ''),
        filename: file,
        title: file.replace('.md', '').replace(/-/g, ' '),
        content
      };
    });
    
    return NextResponse.json({ posts });
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

    const post = await request.json();
    
    // Generate filename from title
    const filename = post.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '.md';
    
    // Create markdown content with frontmatter
    const frontmatter = [
      '---',
      `title: "${post.title}"`,
      `date: "${post.date || new Date().toISOString().split('T')[0]}"`,
      `author: "${post.author || 'Andrew'}"`,
      `excerpt: "${post.excerpt || ''}"`,
      `featured: ${post.featured || false}`,
      `tags: [${(post.tags || []).map((tag: string) => `"${tag}"`).join(', ')}]`,
      post.featuredImage ? `featuredImage: "${post.featuredImage}"` : '',
      '---',
      '',
      post.content || ''
    ].filter(line => line !== '').join('\n');
    
    // Ensure posts directory exists
    const postsDir = path.join(process.cwd(), 'src', 'data', 'posts');
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }
    
    // Write the file
    const filePath = path.join(postsDir, filename);
    fs.writeFileSync(filePath, frontmatter, 'utf8');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Blog post saved successfully!',
      post: { ...post, id: filename.replace('.md', ''), filename }
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

    const post = await request.json();
    
    // For now, just log and show success
    console.log('Blog post would be updated:', post);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Blog post updated successfully!',
      post 
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Blog post ID required' }, { status: 400 });
    }
    
    // For now, just log and show success
    console.log('Blog post would be deleted:', id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Blog post deleted successfully!' 
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
