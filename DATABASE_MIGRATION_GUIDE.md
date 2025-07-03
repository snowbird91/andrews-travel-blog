# Database Migration Guide

This guide will walk you through migrating your travel blog from file-based storage to Supabase database.

## ✅ What's Done

- ✅ Supabase is installed and configured
- ✅ Database schema is ready (`database_schema.sql`)
- ✅ Migration script is prepared (`migrate-to-database.js`)
- ✅ API routes are updated to use Supabase
- ✅ Admin dashboard is ready for database operations

## 🚀 Quick Start

### Step 1: Set up Supabase Database

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a free account and new project
   - Wait for project to be fully provisioned (takes a few minutes)

2. **Run Setup Script**
   ```bash
   npm run setup-db
   ```
   This interactive script will ask for your Supabase credentials and create the `.env.local` file.

3. **Create Database Schema**
   - Go to your Supabase dashboard → SQL Editor
   - Copy the entire contents of `database_schema.sql`
   - Paste and run it in the SQL Editor
   - This creates all the tables (destinations, blog_posts, comments)

### Step 2: Migrate Your Data

Run the migration script to transfer your existing data:

```bash
npm run migrate
```

This will:
- Migrate all destinations from `src/data/travelData.ts`
- Migrate the sample blog post from `src/lib/staticBlog.ts`
- Create proper database relationships
- Preserve any comments (if they exist)

### Step 3: Verify Migration

1. **Check Supabase Dashboard**
   - Go to your Supabase dashboard → Table Editor
   - Verify that `destinations` and `blog_posts` tables have data
   - Check that the data looks correct

2. **Test Your App**
   ```bash
   npm run dev
   ```
   - Go to http://localhost:3000/admin
   - Log in with your admin email
   - Try adding, editing, and deleting destinations and blog posts
   - Verify everything works as expected

## 🎯 What You Get

### Features Now Working:
- ✅ **Real Database Storage**: All data persisted in PostgreSQL via Supabase
- ✅ **Admin Dashboard**: Full CRUD operations for destinations and blog posts
- ✅ **Comments System**: Database-backed comments for blog posts
- ✅ **Authentication**: Admin-only access to management features
- ✅ **API Routes**: RESTful endpoints for all operations
- ✅ **Data Relationships**: Foreign keys linking posts to destinations

### API Endpoints Available:
- `GET/POST/PUT/DELETE /api/destinations` - Manage travel destinations
- `GET/POST/PUT/DELETE /api/blog` - Manage blog posts
- `GET/POST/DELETE /api/comments` - Manage comments

## 🔧 Configuration

### Environment Variables (`.env.local`):
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
ADMIN_EMAIL=your@email.com
```

### Database Tables Created:
- **destinations**: Travel destinations with coordinates, photos, ratings
- **blog_posts**: Blog articles with content, metadata, and tags
- **comments**: User comments linked to blog posts

## 🛠️ Troubleshooting

### Migration Issues:
- Ensure your Supabase credentials are correct in `.env.local`
- Make sure the database schema was applied successfully
- Check console output for specific error messages

### API Issues:
- Verify environment variables are set correctly
- Check that your admin email matches the one in `.env.local`
- Make sure you're logged in with the correct Google account

### Database Issues:
- Use the Supabase dashboard to verify data was inserted
- Check the logs in Supabase for any database errors
- Ensure your Supabase project is fully provisioned

## 🚀 Next Steps

After successful migration:

1. **Remove Old Files** (optional):
   ```bash
   # These are no longer needed:
   rm src/data/travelData.ts
   rm src/lib/staticBlog.ts
   ```

2. **Deploy to Vercel**:
   - Add environment variables to Vercel dashboard
   - Push your changes to GitHub
   - Vercel will automatically redeploy

3. **Test Production**:
   - Verify admin functionality works in production
   - Test the public blog and travel map pages
   - Ensure comments system works

## 📞 Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify your Supabase project status and credentials
3. Make sure all environment variables are set correctly
4. Test API endpoints individually if needed

The migration preserves all your existing data while adding powerful database capabilities!
