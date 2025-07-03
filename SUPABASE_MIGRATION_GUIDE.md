# Supabase Migration Guide

## Step 1: Set up Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to be fully provisioned (this takes a few minutes)

## Step 2: Set up Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `database_schema.sql` and run it in the SQL Editor
3. This will create all the necessary tables for your travel blog

## Step 3: Get your API keys

1. Go to Settings → API in your Supabase dashboard
2. Copy these values:
   - Project URL
   - anon public key
   - service_role key (for migration only)

## Step 4: Configure Environment Variables

Create a `.env.local` file in your project root with:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Admin Configuration
ADMIN_EMAIL=andrewliu3477@gmail.com
```

## Step 5: Run Migration Script

Once you have the environment variables set up, run:

```bash
node migrate-to-database.js
```

This will migrate all your existing destinations and blog posts to the database.

## Step 6: Verify Migration

1. Check your Supabase dashboard to see if data was imported correctly
2. Test the admin dashboard at `/admin`
3. Verify that you can add, edit, and delete destinations and blog posts

## Next Steps

After migration is complete:
1. The app will automatically use the database instead of file-based storage
2. Your admin dashboard will work with real database persistence
3. You can remove the old `src/data/travelData.ts` file if desired

## Troubleshooting

- If migration fails, check that your Supabase credentials are correct
- Make sure your database schema was applied successfully
- Check the console output for specific error messages
