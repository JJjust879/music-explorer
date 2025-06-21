# Heroku Deployment Guide - Music Explorer

## Quick Fix for Heroku Build Error

The build error was caused by missing Node.js version specification. This has been fixed with:

### Files Added/Updated:
- `package.json` - Added Node.js 18.x engine specification
- `Procfile` - Added web process command for Heroku

## Step-by-Step Heroku Deployment

### 1. GitHub Repository Setup
```bash
# Upload all files to your GitHub repository
# Keep .env.example (do NOT upload .env with real secrets)
```

### 2. Heroku App Creation
1. Go to [Heroku Dashboard](https://dashboard.heroku.com/)
2. Click "New" → "Create new app"
3. Choose app name (e.g., `your-music-explorer`)
4. Select region (US or Europe)

### 3. Connect GitHub Repository
1. In Heroku app dashboard → "Deploy" tab
2. Select "GitHub" as deployment method
3. Connect your GitHub account
4. Search and connect your `music-explorer` repository

### 4. Configure Environment Variables
Go to "Settings" tab → "Config Vars" → Add:

```
MONGODB_URI=mongodb+srv://jjjust777:onetwothree@mycluster.zgyuybq.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster
LASTFM_API_KEY=your_actual_lastfm_api_key
VITE_LASTFM_API_KEY=your_actual_lastfm_api_key
NODE_ENV=production
```

### 5. Deploy Application
1. Go to "Deploy" tab
2. Scroll to "Manual deploy" section
3. Select `main` branch
4. Click "Deploy Branch"

### 6. Enable Automatic Deploys (Optional)
1. In "Deploy" tab → "Automatic deploys" section
2. Select `main` branch
3. Click "Enable Automatic Deploys"

## Troubleshooting Common Issues

### Build Failures
- **Node version**: Fixed with engines specification in package.json
- **Dependencies**: Ensure package-lock.json is included
- **Build command**: Uses `npm run build` from package.json

### Runtime Issues
- **Environment variables**: Double-check all config vars are set
- **Database connection**: Verify MongoDB URI is correct
- **API keys**: Ensure Last.fm API key is valid

### App Not Loading
- Check Heroku logs: `heroku logs --tail -a your-app-name`
- Verify PORT binding in server code (uses process.env.PORT)
- Confirm all environment variables are set

## Your App URLs

After successful deployment:
- **GitHub Repository**: `https://github.com/yourusername/music-explorer`
- **Live Heroku App**: `https://your-app-name.herokuapp.com`

## Verification Steps

1. **GitHub**: Repository is public and contains all source code
2. **Heroku**: App builds and deploys successfully
3. **Database**: MongoDB connection works in production
4. **APIs**: Last.fm and Deezer integrations function
5. **Features**: All CRUD operations work live

## Assignment Submission

Provide lecturers with:
- GitHub Repository URL
- Live Heroku Deployment URL  
- Video demonstration showing functionality

Your Music Explorer MERN stack application is now ready for academic evaluation!