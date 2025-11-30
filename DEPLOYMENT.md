# 🚀 PSYMED Frontend - Deployment Guide

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Angular CLI installed globally (optional): `npm install -g @angular/cli`

## 🔧 Build Configuration

### Environment Files

The application uses environment-specific configuration:

- **Development**: `src/environments/environment.development.ts`
- **Production**: `src/environments/environment.ts`

Both are configured to use the deployed backend:
```
https://psymed-backend-new.onrender.com/api/v1
```

### Build Commands

1. **Development Build** (with source maps, no optimization):
   ```bash
   npm run build
   # or
   ng build --configuration development
   ```

2. **Production Build** (optimized, minified):
   ```bash
   npm run build:prod
   # or
   ng build --configuration production
   ```

The production build will:
- Optimize and minify code
- Enable output hashing for cache busting
- Use the production environment configuration
- Output to `dist/psymed-frontend/`

## 📦 Deployment Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Build for Production
```bash
npm run build:prod
```

### 3. Deploy the `dist/psymed-frontend` folder

The built files will be in the `dist/psymed-frontend` directory. Deploy this entire folder to your hosting service.

## 🌐 Deployment Platforms

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root
3. Follow the prompts

**Note**: Vercel automatically detects Angular and configures routing.

### Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Build: `npm run build:prod`
3. Deploy: `netlify deploy --prod --dir=dist/psymed-frontend`

**Create `_redirects` file** in `dist/psymed-frontend`:
```
/*    /index.html   200
```

### GitHub Pages

1. Install angular-cli-ghpages: `npm i -g angular-cli-ghpages`
2. Build: `npm run build:prod`
3. Deploy: `ngh --dir=dist/psymed-frontend`

### Firebase Hosting

1. Install Firebase CLI: `npm i -g firebase-tools`
2. Initialize: `firebase init hosting`
3. Set public directory to: `dist/psymed-frontend`
4. Build: `npm run build:prod`
5. Deploy: `firebase deploy`

### Apache Server

1. Build: `npm run build:prod`
2. Copy `dist/psymed-frontend/*` to your Apache `htdocs` directory
3. Create `.htaccess` file with:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Nginx

1. Build: `npm run build:prod`
2. Configure Nginx:
```nginx
server {
  listen 80;
  server_name your-domain.com;
  root /path/to/dist/psymed-frontend;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## ✅ Post-Deployment Checklist

- [ ] Verify the application loads correctly
- [ ] Test authentication (sign-in/sign-up)
- [ ] Verify API calls are going to the correct backend URL
- [ ] Check browser console for errors
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices
- [ ] Verify HTTPS is enabled (if applicable)
- [ ] Check CORS configuration on backend if needed

## 🔗 Backend Configuration

The frontend is configured to connect to:
```
https://psymed-backend-new.onrender.com/api/v1
```

**Important**: Ensure your backend CORS configuration allows requests from your frontend domain.

## 🐛 Troubleshooting

### CORS Errors
If you see CORS errors, ensure your backend allows requests from your frontend domain.

### 404 Errors on Refresh
This is a common issue with SPAs. Ensure your hosting service is configured to serve `index.html` for all routes (see platform-specific instructions above).

### Environment Variables Not Working
Ensure you're using the production build (`npm run build:prod`) and that `src/environments/environment.ts` has the correct configuration.

## 📝 Notes

- The production build uses environment file replacement automatically
- All API calls use the environment configuration, so no hardcoded URLs
- The build output is optimized for production with minification and tree-shaking

