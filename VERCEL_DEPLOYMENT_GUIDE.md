# Vercel + Supabase Deployment Guide

This guide covers deploying your travel blog to Vercel with Supabase database.

## 🚀 Quick Deployment Steps

### Step 1: Set up Supabase Database

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create account and new project
   - Wait for project provisioning (few minutes)

2. **Apply Database Schema**
   - Go to Supabase dashboard → SQL Editor
   - Copy entire contents of `database_schema.sql`
   - Paste and execute in SQL Editor

3. **Get API Keys**
   - Go to Settings → API in Supabase dashboard
   - Copy: Project URL, anon key, service_role key

### Step 2: Configure Vercel Environment Variables

In your Vercel dashboard (vercel.com):

1. Go to your project → Settings → Environment Variables
2. Add these variables for **all environments** (Production, Preview, Development):

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
ADMIN_EMAIL=your_admin_email@gmail.com
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

**Important**: Replace `your-app-name.vercel.app` with your actual Vercel domain.

### Step 3: Update Local Environment (for migration)

Create `.env.local` for running migration locally:

```bash
# Copy from your Vercel environment variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
ADMIN_EMAIL=your_admin_email@gmail.com
```

### Step 4: Migrate Your Data

Run locally to migrate existing data to Supabase:

```bash
# Verify setup
npm run verify-db

# Migrate data
npm run migrate
```

### Step 5: Deploy to Vercel

Push your changes:

```bash
git add .
git commit -m "Add database migration and Supabase integration"
git push origin main
```

Vercel will automatically deploy your changes.

### Step 6: Test Production

1. **Visit your Vercel app** at `https://your-app-name.vercel.app`
2. **Test admin access** at `https://your-app-name.vercel.app/admin`
3. **Verify database operations**:
   - Add/edit/delete destinations
   - Add/edit/delete blog posts
   - Check that data persists

## 🔧 Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public API key for client-side | `eyJhbGciOiJIUzI1...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side key for admin operations | `eyJhbGciOiJIUzI1...` |
| `ADMIN_EMAIL` | Your email for admin access | `yourname@gmail.com` |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL | `https://myapp.vercel.app` |

## 🛠️ Features Available After Deployment

- ✅ **Dynamic Content Management**: Add/edit destinations and posts via admin panel
- ✅ **Database Persistence**: All data stored in PostgreSQL
- ✅ **Comments System**: Visitors can comment on blog posts
- ✅ **Admin Authentication**: Secure access using your Google account
- ✅ **Real-time Updates**: Changes appear immediately
- ✅ **Scalable**: Ready for growth and traffic

## 📊 API Endpoints (Production)

All available at `https://your-app-name.vercel.app/api/`:

- `GET/POST/PUT/DELETE /api/destinations` - Travel destinations
- `GET/POST/PUT/DELETE /api/blog` - Blog posts  
- `GET/POST/DELETE /api/comments` - Comments

## 🚨 Troubleshooting

### Build Errors:
- Ensure all environment variables are set in Vercel
- Check that variable names match exactly
- Verify Supabase credentials are correct

### Admin Access Issues:
- Make sure `ADMIN_EMAIL` matches your Google account email
- Check that you're signed in with the correct Google account
- Verify the environment variable is set in production

### Database Connection Issues:
- Verify Supabase project is active and not paused
- Check that database schema was applied correctly
- Ensure API keys are valid and not expired

### API Errors:
- Check Vercel function logs in dashboard
- Verify environment variables are available in production
- Test API endpoints directly in browser

## 🎯 Next Steps

After successful deployment:

1. **Custom Domain** (optional): Add your own domain in Vercel settings
2. **Analytics**: Add Vercel Analytics or Google Analytics
3. **SEO**: Optimize meta tags and add sitemap
4. **Backup**: Regular database backups via Supabase dashboard
5. **Monitoring**: Set up uptime monitoring

## 📞 Support

If you encounter issues:

1. Check Vercel build logs: Project → Functions → View Function Details
2. Check Supabase logs: Dashboard → Logs & Analytics
3. Test API endpoints directly: `curl https://your-app.vercel.app/api/blog`
4. Verify environment variables are set correctly

Your travel blog is now a fully dynamic, scalable web application! 🎉
