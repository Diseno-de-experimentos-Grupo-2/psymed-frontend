# 🚀 Quick Vercel Deployment Guide

## Step-by-Step Instructions

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```
   This will open your browser to authenticate.

3. **Navigate to your project directory**
   ```bash
   cd C:\Users\User\WebstormProjects\psymed-frontend
   ```

4. **Deploy to Vercel**
   ```bash
   vercel
   ```
   
   When prompted:
   - **Set up and deploy?** → Yes
   - **Which scope?** → Select your account
   - **Link to existing project?** → No (first time) or Yes (if updating)
   - **Project name?** → Press Enter (uses default) or type a name
   - **Directory?** → Press Enter (uses current directory)
   - **Override settings?** → No (first time)

5. **Production Deployment**
   ```bash
   vercel --prod
   ```
   This deploys to your production domain.

### Option 2: Deploy via Vercel Dashboard (Git Integration)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Go to [vercel.com](https://vercel.com)**
   - Sign in with your GitHub account

3. **Import Project**
   - Click "Add New..." → "Project"
   - Select your repository
   - Configure:
     - **Framework Preset:** Angular
     - **Root Directory:** `./` (or leave default)
     - **Build Command:** `npm run build:prod`
     - **Output Directory:** `dist/psymed-frontend`
     - **Install Command:** `npm install`

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy

### Configuration File (Optional but Recommended)

Create `vercel.json` in your project root:

```json
{
  "version": 2,
  "buildCommand": "npm run build:prod",
  "outputDirectory": "dist/psymed-frontend",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## ✅ Post-Deployment

1. **Get your deployment URL**
   - Vercel provides a URL like: `https://your-project.vercel.app`

2. **Update Backend CORS (if needed)**
   - Ensure your backend at `https://psymed-backend-new.onrender.com` allows requests from your Vercel domain

3. **Test your application**
   - Visit your Vercel URL
   - Test sign-in/sign-up
   - Verify API calls work

## 🔄 Updating Your Deployment

### Via CLI:
```bash
vercel --prod
```

### Via Git:
- Just push to your main branch
- Vercel automatically redeploys

## 📝 Notes

- Vercel automatically detects Angular and configures routing
- Each deployment gets a unique URL
- Production deployments use your custom domain (if configured)
- Preview deployments are created for each branch/PR

## 🎯 Quick Commands Reference

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (preview)
vercel

# Deploy (production)
vercel --prod

# View deployments
vercel ls

# View logs
vercel logs
```

