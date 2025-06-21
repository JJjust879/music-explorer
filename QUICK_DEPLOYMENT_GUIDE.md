# Quick Heroku Deployment - Music Explorer

## Immediate Deployment Steps

### 1. GitHub Upload (5 minutes)
1. Download: `music-explorer-heroku-fixed.tar.gz`
2. Extract and upload ALL files to GitHub repository
3. Repository must be **PUBLIC** for lecturer access

### 2. Heroku Deployment (10 minutes)
1. Go to [heroku.com](https://heroku.com) → Create account
2. Create new app with unique name
3. Connect GitHub repository
4. Set these Config Vars in Settings:

```
MONGODB_URI=mongodb+srv://jjjust777:onetwothree@mycluster.zgyuybq.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster
LASTFM_API_KEY=your_lastfm_key
VITE_LASTFM_API_KEY=your_lastfm_key
NODE_ENV=production
```

5. Deploy from main branch

### 3. Verify Live API
Test these endpoints work:
- `https://your-app.herokuapp.com/api/charts/top-tracks`
- `https://your-app.herokuapp.com/api/playlists`
- `https://your-app.herokuapp.com/` (frontend)

## Submit to Lecturers
- GitHub: `https://github.com/yourusername/music-explorer`
- Live API: `https://your-app.herokuapp.com`
- Video Demo: Record functionality walkthrough

## API Endpoints for Testing
```
GET /api/charts/top-tracks - Music charts
GET /api/charts/top-artists - Artist data
GET /api/search/tracks?q=query - Search functionality
GET /api/playlists - Playlist operations
POST /api/playlists - Create playlist
```

Your MERN stack application will be live and testable for academic evaluation.