# 🗄️ Database Setup Guide - Supabase Migration

## **Step 1: Create Supabase Project**

1. **Go to [supabase.com](https://supabase.com)**
2. **Click "Start your project"**
3. **Sign up with GitHub (recommended)**
4. **Create a new project:**
   - Organization: Your GitHub username
   - Project name: `andrews-travel-blog`
   - Database password: Generate a strong password (save it!)
   - Region: Choose closest to your users

## **Step 2: Get Your Credentials**

After project creation:
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **Project API Key** (anon public key)

## **Step 3: Set Environment Variables**

Add these to your Vercel project:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## **Step 4: Database Schema**

We'll create these tables:
- `destinations` - Travel destinations
- `blog_posts` - Blog posts with metadata
- `comments` - Blog post comments
- `admin_users` - Admin user permissions

## **Step 5: Data Migration**

We'll migrate:
- ✅ All existing destinations from `travelData.ts`
- ✅ All existing blog posts from markdown files
- ✅ All existing comments from each blog post
- ✅ Admin user configuration

---

**Ready to proceed?** Let me know when you have your Supabase project created!
