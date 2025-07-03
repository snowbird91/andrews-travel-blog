#!/usr/bin/env node

/**
 * Migration script to transfer existing data to Supabase database
 * Run this after setting up your Supabase database schema
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// You'll need to set these environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role key for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials!');
  console.log('Please set these environment variables:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY (from Supabase Settings > API > service_role key)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateDestinations() {
  console.log('🗺️ Migrating travel destinations...');
  
  try {
    // Read existing destinations
    const travelDataPath = path.join(__dirname, 'src', 'data', 'travelData.ts');
    const travelDataContent = fs.readFileSync(travelDataPath, 'utf8');
    
    // Extract destinations array (this is a simple approach)
    const match = travelDataContent.match(/export const travelDestinations.*?=\s*(\[[\s\S]*?\]);/);
    if (!match) {
      console.log('⚠️ No destinations found in travelData.ts');
      return;
    }
    
    const destinations = eval(match[1]);
    
    // Transform data for database
    const dbDestinations = destinations.map(dest => ({
      name: dest.name,
      country: dest.country,
      coordinates: `(${dest.coordinates[0]}, ${dest.coordinates[1]})`, // Convert to PostGIS point
      visited: dest.visited || false,
      visit_date: dest.visitDate || null,
      description: dest.description || '',
      photos: dest.photos || [],
      rating: dest.rating || null,
      highlights: dest.highlights || [],
      travel_tips: dest.travelTips || []
    }));
    
    // Insert into database
    const { data, error } = await supabase
      .from('destinations')
      .insert(dbDestinations);
    
    if (error) {
      console.error('❌ Error inserting destinations:', error);
    } else {
      console.log(`✅ Successfully migrated ${dbDestinations.length} destinations`);
    }
  } catch (error) {
    console.error('❌ Error migrating destinations:', error);
  }
}

async function migrateBlogPosts() {
  console.log('📝 Migrating blog posts...');
  
  try {
    // First, try to migrate from static blog posts file
    const staticBlogPath = path.join(__dirname, 'src', 'lib', 'staticBlog.ts');
    let blogPosts = [];
    
    if (fs.existsSync(staticBlogPath)) {
      console.log('📄 Found static blog posts file, parsing...');
      const staticContent = fs.readFileSync(staticBlogPath, 'utf8');
      
      // Extract the blogPosts array (this is a simple approach)
      const match = staticContent.match(/export const blogPosts.*?=\s*(\[[\s\S]*?\]);/);
      if (match) {
        try {
          const staticPosts = eval(match[1]);
          blogPosts = staticPosts.map(post => ({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || '',
            content: post.content || '',
            author: post.author || 'Andrew',
            featured: post.featured || false,
            featured_image: post.coverImage || null,
            tags: post.tags || [],
            published: true,
            destination_id: null
          }));
          console.log(`✅ Found ${blogPosts.length} static blog posts`);
        } catch (e) {
          console.log('⚠️ Could not parse static blog posts, skipping...');
        }
      }
    }
    
    // Also check for markdown files in posts directory
    const postsDir = path.join(__dirname, 'src', 'data', 'posts');
    
    if (fs.existsSync(postsDir)) {
      console.log('📁 Found posts directory, parsing markdown files...');
      const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
      
      for (const file of files) {
        const filePath = path.join(postsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Parse frontmatter and content
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        if (!frontmatterMatch) {
          console.log(`⚠️ Skipping ${file} - no frontmatter found`);
          continue;
        }
        
        const [, frontmatterStr, postContent] = frontmatterMatch;
        const metadata = {};
        
        // Parse frontmatter
        frontmatterStr.split('\n').forEach(line => {
          const [key, ...valueParts] = line.split(':');
          if (key && valueParts.length > 0) {
            const value = valueParts.join(':').trim();
            metadata[key.trim()] = value.replace(/^["']|["']$/g, '');
          }
        });
        
        // Generate slug from filename
        const slug = file.replace('.md', '');
        
        blogPosts.push({
          title: metadata.title || file.replace('.md', '').replace(/-/g, ' '),
          slug: slug,
          excerpt: metadata.excerpt || '',
          content: postContent.trim(),
          author: metadata.author || 'Andrew',
          featured: metadata.featured === 'true',
          featured_image: metadata.featuredImage || null,
          tags: metadata.tags ? metadata.tags.split(',').map(tag => tag.trim()) : [],
          published: true,
          destination_id: null
        });
      }
    }
    
    if (blogPosts.length === 0) {
      console.log('⚠️ No blog posts found to migrate');
      return;
    }
    
    // Insert blog posts into database
    const { data: insertedPosts, error: postsError } = await supabase
      .from('blog_posts')
      .insert(blogPosts)
      .select();
    
    if (postsError) {
      console.error('❌ Error inserting blog posts:', postsError);
      return;
    }
    
    console.log(`✅ Successfully migrated ${blogPosts.length} blog posts`);
    
  } catch (error) {
    console.error('❌ Error migrating blog posts:', error);
  }
}

async function main() {
  console.log('🚀 Starting data migration to Supabase...\n');
  
  await migrateDestinations();
  console.log('');
  await migrateBlogPosts();
  
  console.log('\n🎉 Migration complete!');
  console.log('Next steps:');
  console.log('1. Verify data in your Supabase dashboard');
  console.log('2. Update API routes to use database');
  console.log('3. Test admin functionality');
}

main().catch(console.error);
