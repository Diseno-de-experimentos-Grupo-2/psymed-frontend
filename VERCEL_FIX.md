# 🔧 Vercel 404 Fix

## Issue
Getting 404 error after deployment to Vercel.

## Solution

Angular 18's new application builder outputs files to `dist/psymed-frontend/browser/` instead of `dist/psymed-frontend/`.

## Fix Applied

Updated `vercel.json` to use the correct output directory:
```json
"outputDirectory": "dist/psymed-frontend/browser"
```

## Next Steps

1. **Commit and push the updated vercel.json:**
   ```bash
   git add vercel.json
   git commit -m "Fix Vercel output directory for Angular 18"
   git push
   ```

2. **Redeploy on Vercel:**
   - Vercel will automatically redeploy when you push, OR
   - Run `vercel --prod` to manually redeploy

## Alternative: If browser subdirectory doesn't exist

If your build outputs directly to `dist/psymed-frontend/` (without browser subdirectory), change vercel.json back to:
```json
"outputDirectory": "dist/psymed-frontend"
```

## Verify Build Output Locally

To check where your build outputs:
```bash
npm run build:prod
ls dist/psymed-frontend/
```

If you see a `browser` folder, use `dist/psymed-frontend/browser`
If files are directly in `dist/psymed-frontend/`, use `dist/psymed-frontend`

