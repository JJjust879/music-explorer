# Render Deployment Guide - Music Explorer

## Why Render is Better
- More reliable builds than Heroku
- Better Node.js support
- Automatic HTTPS and custom domains
- Free tier with good performance

## Package Ready
**Download: `music-explorer-render-ready.tar.gz`**

## Render Deployment Steps

### 1. Upload to GitHub
- Extract package and upload all files to public GitHub repository
- Maintain exact folder structure

### 2. Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub account

### 3. Deploy Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Use these settings:
   - **Name**: music-explorer
   - **Environment**: Node
   - **Build Command**: `cd client && npm install && npm run build && cd .. && npm install && npm run build:server`
   - **Start Command**: `npm start`

### 4. Environment Variables
Add these in Render dashboard:
```
MONGODB_URI=mongodb+srv://jjjust777:onetwothree@mycluster.zgyuybq.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster
LASTFM_API_KEY=your_actual_lastfm_key
VITE_LASTFM_API_KEY=your_actual_lastfm_key
NODE_ENV=production
```

### 5. Deploy
- Click "Create Web Service"
- Render will automatically build and deploy
- You'll get a URL like: `https://music-explorer.onrender.com`

## Benefits Over Heroku
- No sleep mode on free tier
- Better build process handling
- Automatic deployments on GitHub push
- More reliable for Node.js applications

## Live API Testing
Your deployed application provides:
- `GET /api/charts/top-tracks` - Music discovery
- `GET /api/playlists` - MongoDB CRUD operations
- `POST /api/playlists` - Database persistence
- `GET /` - Complete React application

The MERN stack application demonstrates MongoDB persistence, Express RESTful API, React TypeScript frontend, and Node.js backend with external API integrations for academic evaluation.