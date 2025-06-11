# 🚀 Vercel Deployment Guide

This guide will help you deploy both the frontend and backend to Vercel in a single project.

## 📋 Prerequisites

1. **GitHub Account**: Your code needs to be in a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **S3 Credentials** (optional): For real file storage

## 🔧 Step 1: Prepare Your Repository

### Push to GitHub
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: File uploader with queue management"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/yourusername/file-uploader-challenge.git

# Push to GitHub
git push -u origin main
```

## 🌐 Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration
5. Click "Deploy"

### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: file-uploader-challenge
# - Directory: ./
# - Override settings? N
```

## 🔑 Step 3: Configure Environment Variables

### In Vercel Dashboard:
1. Go to your project dashboard
2. Click "Settings" tab
3. Click "Environment Variables"
4. Add the following variables:

```env
# Required for production
NODE_ENV=production

# S3 Configuration (optional - for real file storage)
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name

# For Digital Ocean Spaces (alternative to AWS)
# AWS_ENDPOINT=https://nyc3.digitaloceanspaces.com
```

### Via Vercel CLI:
```bash
# Add environment variables
vercel env add AWS_ACCESS_KEY_ID
vercel env add AWS_SECRET_ACCESS_KEY
vercel env add AWS_REGION
vercel env add S3_BUCKET_NAME
```

## 🎯 Step 4: Test Your Deployment

1. **Visit your deployed URL** (provided by Vercel)
2. **Test file upload functionality**:
   - Drag and drop multiple files
   - Verify queue management (max 3 concurrent)
   - Check progress tracking
   - Test retry functionality

## 🔧 Project Structure for Vercel

```
├── src/                    # Frontend React app
├── server/                 # Backend Express server
├── dist/                   # Built frontend (auto-generated)
├── vercel.json            # Vercel configuration
├── package.json           # Frontend dependencies
└── server/package.json    # Backend dependencies
```

## 📝 Vercel Configuration Explained

The `vercel.json` file configures:

- **Frontend Build**: Uses `@vercel/static-build` for React app
- **Backend Build**: Uses `@vercel/node` for Express server
- **Routing**:
  - `/api/*` routes to backend server
  - All other routes serve the React app
- **Environment**: Sets production mode

## 🚨 Troubleshooting

### Build Errors
```bash
# Check build locally
npm run build

# Check server build
cd server && npm run build
```

### API Not Working
- Verify environment variables are set
- Check Vercel function logs in dashboard
- Ensure `/api` routes are working

### S3 Upload Issues
- Verify AWS credentials
- Check bucket permissions
- Ensure bucket allows public read access

## 🔄 Continuous Deployment

Once connected to GitHub:
1. **Push changes** to your repository
2. **Vercel automatically deploys** new versions
3. **Preview deployments** for pull requests
4. **Production deployment** for main branch

## 📊 Monitoring

### Vercel Dashboard provides:
- **Function logs** for backend debugging
- **Analytics** for usage tracking
- **Performance metrics**
- **Error tracking**

## 🎉 Success!

Your file uploader is now live with:
- ✅ **Frontend**: React app with Shopify Polaris UI
- ✅ **Backend**: Express server with file upload handling
- ✅ **Queue Management**: Max 3 concurrent uploads
- ✅ **Retry Logic**: Automatic retry on failures
- ✅ **S3 Integration**: Real file storage (if configured)

## 🔗 Example URLs

After deployment, you'll have:
- **Frontend**: `https://your-project.vercel.app`
- **API**: `https://your-project.vercel.app/api/upload`
- **Health Check**: `https://your-project.vercel.app/api/health`

---

**Need help?** Check the [Vercel documentation](https://vercel.com/docs) or create an issue in your repository.
