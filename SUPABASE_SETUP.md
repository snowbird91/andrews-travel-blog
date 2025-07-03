# 🔐 Supabase Authentication & Comments Setup

This guide will help you set up Supabase for authentication and comments on your travel blog.

## 🚀 Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub (recommended)
4. Create a new project:
   - **Name**: `andrews-travel-blog`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your location

## 🔧 Step 2: Get Your Supabase Credentials

1. Go to your project dashboard
2. Click **Settings** → **API**
3. Copy these values:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **Anon/Public Key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 📝 Step 3: Configure Environment Variables

1. In your project folder, create a `.env.local` file:
   ```bash
   # Replace with your actual values
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. **Never commit this file to Git** (it's already in `.gitignore`)

## 🗄️ Step 4: Create Database Tables

1. Go to **SQL Editor** in your Supabase dashboard
2. Run this SQL to create the required tables:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create comments table
CREATE TABLE comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  blog_slug TEXT NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for comments
CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert comments" ON comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## 🔄 Step 5: Configure Authentication

1. Go to **Authentication** → **Settings**
2. Under **Site URL**, add:
   - Development: `http://localhost:3000`
   - Production: `https://your-username.github.io/andrews-travel-blog`

3. Under **Redirect URLs**, add the same URLs

## 🎯 Step 6: Test Your Setup

1. **Build locally**:
   ```bash
   npm run build
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Test features**:
   - Sign up with a new account
   - Login/logout
   - Leave a comment on a blog post
   - Check if comments appear in real-time

## 🔒 Step 7: GitHub Actions Setup

For GitHub Pages deployment, you'll need to add your Supabase credentials as **GitHub Secrets**:

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Add these secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

4. Update your GitHub Actions workflow to use these secrets:

```yaml
# In .github/workflows/deploy.yml
- name: Build with Next.js
  run: npm run build
  env:
    NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
    NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

## ✅ You're All Set!

Your travel blog now has:
- ✅ User authentication (signup/login)
- ✅ User profiles
- ✅ Real-time comments system
- ✅ Secure database with Row Level Security
- ✅ Automatic user profile creation

## 🔧 Next Steps (Optional)

- **Admin Panel**: Create an admin interface to manage users and comments
- **Email Notifications**: Set up email alerts for new comments
- **Social Auth**: Add Google/GitHub login options
- **Comment Moderation**: Add approval system for comments
- **Rich Text Comments**: Allow markdown in comments

---

**Need help?** Check the [Supabase documentation](https://supabase.com/docs) or open an issue in your repository.
