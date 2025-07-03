# Environment Variables Setup Guide

## Required Environment Variables

### For Vercel Deployment:

1. **Go to your Vercel project dashboard**
2. **Click Settings → Environment Variables**
3. **Add the following variables:**

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `ADMIN_EMAIL` | `andrewliu3477@gmail.com` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_URL` | `your-supabase-url` | Production, Preview, Development (optional) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-supabase-key` | Production, Preview, Development (optional) |

### Important Notes:

- **ADMIN_EMAIL**: Replace with your actual email address that should have admin access
- **Supabase variables**: Only needed if you want real authentication (optional for dev/demo)
- **Environment scope**: Set all variables for Production, Preview, and Development

### After adding variables:
1. Click **Save**
2. **Redeploy** your application (Vercel will auto-redeploy when you push to GitHub)

---

## For Local Development:

Create a `.env.local` file in your project root:

```bash
ADMIN_EMAIL=andrewliu3477@gmail.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Note**: Never commit `.env.local` to GitHub (it's already in `.gitignore`)

---

## Security:

- **ADMIN_EMAIL** is a server-side variable - safe to use
- **NEXT_PUBLIC_** variables are exposed to the client - only use for non-sensitive data
- **Supabase keys** shown here are "anon" keys - safe for client-side use
