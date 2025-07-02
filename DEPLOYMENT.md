# Deployment Guide for Andrew's Travel Blog

This guide covers various deployment options for your static travel blog.

## 🚀 GitHub Pages Deployment (Recommended)

### Step 1: Update Configuration
1. **Edit `next.config.js`** and replace `'travelblog'` with your actual repository name:
   ```javascript
   assetPrefix: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
   basePath: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
   ```

### Step 2: Build and Deploy
1. **Build the static site**:
   ```bash
   npm run build
   ```

2. **The build creates an `out` folder** with all static files

3. **Deploy via GitHub Actions** (Recommended):
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         
         - name: Setup Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '18'
             
         - name: Install dependencies
           run: npm install
           
         - name: Build
           run: npm run build
           
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./out
   ```

4. **Or deploy manually**:
   - Go to your GitHub repository settings
   - Enable GitHub Pages
   - Upload the contents of the `out` folder

### Step 3: Configure GitHub Pages
1. Go to **Settings > Pages** in your GitHub repository
2. Select **Deploy from a branch**
3. Choose **gh-pages** branch (if using GitHub Actions) or upload the `out` folder contents

## 🔧 Alternative Deployment Options

### Vercel (Easiest)
1. **Connect your GitHub repository** to Vercel
2. **Set build command**: `npm run build`
3. **Set output directory**: `out`
4. **Deploy automatically** on every push

### Netlify
1. **Drag and drop** the `out` folder to Netlify
2. **Or connect your GitHub repository**
3. **Set build command**: `npm run build`
4. **Set publish directory**: `out`

### Any Static Hosting Provider
1. **Build the project**: `npm run build`
2. **Upload the `out` folder contents** to your hosting provider
3. **Configure your domain** (if needed)

## 🔄 Local Development

### Development Server
```bash
npm run dev
```
- Starts the development server at `http://localhost:3000`
- Hot reloading enabled
- Perfect for testing changes

### Production Build (Local Testing)
```bash
npm run build
npm run start
```
- Tests the production build locally
- Useful for debugging build issues

## 📁 What Gets Deployed

The `out` folder contains:
- **Static HTML files** for all pages
- **Optimized CSS and JavaScript**
- **Image assets**
- **All necessary static files**

## 🛠️ Troubleshooting

### Common Issues

1. **Images not loading in production**:
   - Make sure all images use absolute URLs (Unsplash URLs work great)
   - Check that `images.unoptimized: true` is set in `next.config.js`

2. **Routing issues on GitHub Pages**:
   - Ensure `basePath` and `assetPrefix` are correctly set
   - Make sure `trailingSlash: true` is enabled

3. **Build fails**:
   - Check that all blog posts have valid slugs
   - Ensure no undefined values in blog post data
   - Run `npm run lint` to check for errors

### Environment Variables

For different environments, you can use:
```javascript
// next.config.js
const isProd = process.env.NODE_ENV === 'production'
const isGitHubPages = process.env.GITHUB_PAGES === 'true'

const nextConfig = {
  // ... other config
  assetPrefix: isProd && isGitHubPages ? '/your-repo-name' : '',
  basePath: isProd && isGitHubPages ? '/your-repo-name' : '',
}
```

## 🎯 Pre-Deployment Checklist

- [ ] Update site title and metadata in `src/app/layout.tsx`
- [ ] Customize About page with your information
- [ ] Add your contact information
- [ ] Replace sample blog post with your content
- [ ] Test all pages locally with `npm run dev`
- [ ] Run `npm run build` to test static generation
- [ ] Update repository name in `next.config.js`
- [ ] Add custom domain (if applicable)

## 🌐 Custom Domain Setup

### GitHub Pages Custom Domain
1. **Add a `CNAME` file** to your repository root with your domain name
2. **Update GitHub Pages settings** to use your custom domain
3. **Configure DNS** with your domain provider:
   - Add a CNAME record pointing to `username.github.io`
   - Or A records pointing to GitHub Pages IP addresses

### Update Configuration for Custom Domain
```javascript
// next.config.js for custom domain
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // Remove assetPrefix and basePath for custom domains
}
```

## 📈 Performance Tips

1. **Optimize Images**:
   - Use Unsplash with proper sizing parameters
   - Consider WebP format for better compression

2. **Minify Content**:
   - Keep blog post content reasonable in size
   - Use appropriate image dimensions

3. **Monitor Bundle Size**:
   - Check the build output for bundle sizes
   - Remove unused dependencies

## 🔒 Security Considerations

1. **No sensitive data** in the repository (it's all public)
2. **Use HTTPS** (automatically enabled on GitHub Pages)
3. **Keep dependencies updated** with `npm audit`

## 🆘 Getting Help

If you encounter issues:
1. **Check the build logs** for specific error messages
2. **Verify your configuration** matches the examples
3. **Test locally first** before deploying
4. **Check GitHub Pages status** if using GitHub Pages

---

**Happy deploying! 🚀**
