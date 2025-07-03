-- Additional schema to add missing tables for your travel blog
-- Run this in your Supabase SQL Editor AFTER your existing schema

-- Enable necessary extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create destinations table
CREATE TABLE destinations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    coordinates POINT NOT NULL, -- latitude, longitude (stored as PostGIS point)
    visited BOOLEAN DEFAULT false,
    visit_date DATE,
    description TEXT,
    photos TEXT[], -- Array of photo URLs
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    highlights TEXT[],
    travel_tips TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    author VARCHAR(255) DEFAULT 'Andrew',
    featured BOOLEAN DEFAULT false,
    featured_image VARCHAR(500),
    tags TEXT[],
    published BOOLEAN DEFAULT true,
    destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on new tables
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for destinations (public read, admin write)
CREATE POLICY "Destinations are viewable by everyone" ON destinations
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert destinations" ON destinations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update destinations" ON destinations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete destinations" ON destinations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create policies for blog_posts (public read, admin write)
CREATE POLICY "Published blog posts are viewable by everyone" ON blog_posts
  FOR SELECT USING (published = true OR EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  ));

CREATE POLICY "Only admins can insert blog posts" ON blog_posts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update blog posts" ON blog_posts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete blog posts" ON blog_posts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Update your existing comments table to work with blog_posts
-- Add a foreign key reference to blog_posts
ALTER TABLE comments ADD COLUMN blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_destinations_visited ON destinations(visited);
CREATE INDEX idx_comments_blog_post_id ON comments(blog_post_id);
