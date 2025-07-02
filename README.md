# Andrew's Travel Blog

A modern, minimalistic travel blog website built with Next.js 14, TypeScript, and Tailwind CSS. This blog is fully static and optimized for GitHub Pages deployment, featuring a clean, professional design perfect for sharing travel experiences.

## 🚀 Features

- ✅ **Modern Tech Stack**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- ✅ **Static Site Generation**: Fully static with no server-side functionality
- ✅ **GitHub Pages Ready**: Optimized for easy deployment
- ✅ **Responsive Design**: Mobile-first approach for all screen sizes
- ✅ **SEO Optimized**: Proper meta tags and semantic HTML
- ✅ **Fast Performance**: Optimized images and minimal JavaScript
- ✅ **Markdown Support**: Blog posts written in Markdown
- ✅ **TypeScript Blog System**: Type-safe content management
- ✅ **Tag System**: Categorize posts with tags
- ✅ **Featured Posts**: Highlight your best content
- ✅ **Reading Time**: Automatic reading time estimation
- ✅ **Professional Design**: Clean, modern UI with smooth animations

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── blog/
│   │   ├── [slug]/
│   │   │   └── page.tsx   # Individual blog post page
│   │   └── page.tsx       # Blog listing page
│   ├── about/
│   │   └── page.tsx       # About page
│   ├── contact/
│   │   └── page.tsx       # Contact page
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── Navigation.tsx     # Site navigation
│   ├── Footer.tsx         # Site footer
│   ├── HeroSection.tsx    # Homepage hero
│   ├── BlogPreview.tsx    # Blog post preview cards
│   └── FeaturedPosts.tsx  # Featured posts section
├── lib/
│   └── staticBlog.ts      # Blog posts and helper functions
├── types/
│   └── blog.ts            # TypeScript type definitions
```

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   cd travelblog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## ✍️ Adding Blog Posts

Blog posts are managed through the `src/lib/staticBlog.ts` file. A sample post is included to demonstrate the functionality.

### To Add a New Post:

1. **Open** `src/lib/staticBlog.ts`

2. **Add a new post object** to the `blogPosts` array:

```typescript
{
  id: 'unique-post-id',
  title: 'Your Amazing Adventure Title',
  slug: 'your-amazing-adventure', // URL-friendly version
  excerpt: 'A compelling description that will appear in previews...',
  content: `# Your Amazing Adventure

This is where you write your full blog post content in **Markdown**.

## Section 1
Your content here...

### Subsection
More details...

![Alt text](https://images.unsplash.com/your-image-url)

## Section 2
Continue your story...
`,
  author: 'Andrew',
  date: '2024-03-15T10:00:00Z', // ISO date format
  tags: ['adventure', 'photography', 'culture'],
  featured: true, // Set to true for featured posts
  coverImage: 'https://images.unsplash.com/photo-example', // Unsplash URL
  readTime: 8 // Estimated reading time in minutes
}
```

3. **Save the file** and your new post will appear on the site!

### 📝 Sample Post Included

The project includes a sample "Welcome" post to demonstrate functionality. You can:
- **Edit it** to make it your first real post
- **Delete it** by removing it from the `blogPosts` array
- **Use it as a template** for creating new posts

### 📝 Blog Post Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique identifier for the post |
| `title` | string | Post title (appears in headers) |
| `slug` | string | URL-friendly version for routing |
| `excerpt` | string | Short description for previews |
| `content` | string | Full post content in Markdown |
| `author` | string | Author name |
| `date` | string | Publication date (ISO format) |
| `tags` | string[] | Array of category tags |
| `featured` | boolean | Whether to show in featured section |
| `coverImage` | string | Hero image URL (preferably Unsplash) |
| `readTime` | number | Estimated reading time in minutes |

### 🖼️ Using Images

For best results, use Unsplash images with optimized URLs:

```
https://images.unsplash.com/photo-ID?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80
```

Replace `photo-ID` with the actual Unsplash photo ID and adjust `w` (width) as needed.

## 🎨 Customization

### Colors & Branding

Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#2563eb',      // Main brand color
      'primary-dark': '#1d4ed8', // Darker variant
      'primary-light': '#3b82f6', // Lighter variant
    },
  },
}
```

### Site Information

Update the following files with your information:

- **Site title & description**: `src/app/layout.tsx`
- **Navigation brand**: `src/components/Navigation.tsx`
- **Footer content**: `src/components/Footer.tsx`
- **About page content**: `src/app/about/page.tsx`
- **Contact information**: `src/app/contact/page.tsx`

### Travel Stats & Information

Update your travel statistics in `src/app/about/page.tsx`:

```typescript
// Update these sections:
- Countries visited
- Years traveling  
- Photos taken
- Favorite destinations
- Current location
- Next destination
```

## 🚀 Deployment

### GitHub Pages Deployment

1. **Update next.config.js** with your repository name:
   ```javascript
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     images: { unoptimized: true },
     assetPrefix: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
     basePath: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
   }
   ```

2. **Build the static site**:
   ```bash
   npm run build
   ```

3. **Deploy the `out` folder** to GitHub Pages

### Alternative Deployment Options

- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `out` folder
- **Any static hosting**: Upload the `out` folder contents

## 📱 Pages Overview

### Homepage (`/`)
- Hero section with travel stats
- Featured posts (if any)
- Recent posts preview
- Call-to-action buttons

### Blog Listing (`/blog`)
- Grid layout of all posts
- Post previews with metadata
- Responsive design
- Empty state for no posts

### Individual Posts (`/blog/[slug]`)
- Full post content with Markdown rendering
- Hero image and metadata
- Tag display
- Navigation back to blog

### About Page (`/about`)
- Personal story and travel philosophy
- Travel statistics sidebar
- Favorite destinations
- Current status

### Contact Page (`/contact`)
- Contact form (static, for demo)
- Social media links
- Contact information
- Call-to-action sections

## 🔧 Development Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run export     # Build and export static site
```

## 🎯 Performance Features

- **Static Generation**: All pages pre-rendered at build time
- **Image Optimization**: Responsive images with proper sizing
- **Code Splitting**: Automatic code splitting with Next.js
- **CSS Optimization**: Tailwind CSS purging unused styles
- **Font Loading**: Optimized Google Fonts loading
- **SEO Ready**: Meta tags, Open Graph, and structured data

## 🛡️ TypeScript Benefits

- **Type Safety**: Catch errors during development
- **IntelliSense**: Better IDE support and autocomplete
- **Refactoring**: Safe code refactoring with confidence
- **Documentation**: Types serve as inline documentation

## 📦 Dependencies

### Core Dependencies
- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework

### Additional Packages
- **@tailwindcss/typography**: Enhanced prose styling
- **lucide-react**: Beautiful icons
- **date-fns**: Date formatting utilities
- **markdown-to-jsx**: Markdown rendering

## 🤝 Contributing

This is a personal travel blog template, but feel free to:

1. **Fork the repository**
2. **Create your feature branch**
3. **Make your changes**
4. **Submit a pull request**

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:

1. **Check the documentation** above
2. **Review the code comments** in the source files
3. **Create an issue** on GitHub
4. **Contact Andrew** at andrew@andrewstravelblog.com

## 🎉 Getting Started Tips

1. **Read the Quick Start Guide** - Check `QUICKSTART.md` for a 5-minute setup
2. **Start with the sample post** - Modify the included example post
3. **Customize your About page** - Make it uniquely yours
4. **Add your first real post** - Use the provided structure
5. **Test responsiveness** - Check on different screen sizes
6. **Deploy early** - Get your site live and iterate

## 📚 Additional Documentation

- **`QUICKSTART.md`** - 5-minute setup guide
- **`DEPLOYMENT.md`** - Comprehensive deployment guide
- **`README.md`** - This complete documentation

Happy traveling and blogging! 🌍✈️

---

**Built with ❤️ for travelers who love to share their adventures**
