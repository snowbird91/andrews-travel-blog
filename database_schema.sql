-- Supabase Database Schema for Andrew's Travel Blog
-- Run these commands in the Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create destinations table
CREATE TABLE destinations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    coordinates POINT NOT NULL, -- latitude, longitude
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
    published_date DATE NOT NULL,
    category VARCHAR(100) DEFAULT 'Travel',
    tags TEXT[],
    featured BOOLEAN DEFAULT false,
    featured_image VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create comments table
CREATE TABLE comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    approved BOOLEAN DEFAULT true
);

-- Create admin_users table
CREATE TABLE admin_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_destinations_country ON destinations(country);
CREATE INDEX idx_destinations_visited ON destinations(visited);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published_date ON blog_posts(published_date);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX idx_comments_blog_post_id ON comments(blog_post_id);
CREATE INDEX idx_comments_approved ON comments(approved);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON destinations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for destinations" ON destinations FOR SELECT USING (true);
CREATE POLICY "Public read access for blog_posts" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Public read access for comments" ON comments FOR SELECT USING (approved = true);

-- Create policies for admin access (you'll need to modify these based on your auth setup)
CREATE POLICY "Admin full access to destinations" ON destinations FOR ALL USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
);
CREATE POLICY "Admin full access to blog_posts" ON blog_posts FOR ALL USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
);
CREATE POLICY "Admin full access to comments" ON comments FOR ALL USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
);
CREATE POLICY "Admin read access to admin_users" ON admin_users FOR SELECT USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
);

-- Insert your admin user (replace with your actual email)
INSERT INTO admin_users (email) VALUES ('andrewliu3477@gmail.com');
