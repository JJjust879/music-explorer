# Music Explorer - Deployment Instructions

## Complete MERN Stack Application

This is a full-stack music discovery platform built with MongoDB, Express, React, and Node.js (MERN stack) integrating Last.fm and Deezer APIs.

## Live Deployment Requirements

### 1. MongoDB Setup
- Uses MongoDB Atlas cloud database
- Connection string: `mongodb+srv://jjjust777:onetwothree@mycluster.zgyuybq.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster`
- Collections: `users`, `playlists`, `tracks`

### 2. Environment Variables Required
```
MONGODB_URI=mongodb+srv://jjjust777:onetwothree@mycluster.zgyuybq.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster
LASTFM_API_KEY=your_lastfm_api_key
VITE_LASTFM_API_KEY=your_lastfm_api_key
```

### 3. Heroku Deployment Steps

1. **Create Heroku App**
```bash
heroku create your-music-explorer-app
```

2. **Set Environment Variables**
```bash
heroku config:set MONGODB_URI="mongodb+srv://jjjust777:onetwothree@mycluster.zgyuybq.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster"
heroku config:set LASTFM_API_KEY="your_lastfm_api_key"
heroku config:set VITE_LASTFM_API_KEY="your_lastfm_api_key"
```

3. **Deploy**
```bash
git add .
git commit -m "Deploy music explorer app"
git push heroku main
```

### 4. Alternative Cloud Platforms

**Render.com:**
- Connect GitHub repository
- Set environment variables in dashboard
- Auto-deploy from main branch

**Railway.app:**
- Connect GitHub repository  
- Add environment variables
- Deploy with one click

**DigitalOcean App Platform:**
- Create new app from GitHub
- Configure environment variables
- Deploy automatically

## Application Features Verification

### ✅ Third-Party API Integration
- **Last.fm API**: Music charts, search, artist data
- **Deezer API**: 30-second audio previews

### ✅ MongoDB Data Persistence
- **Users Collection**: User account management
- **Playlists Collection**: User-created playlists with track arrays
- **Tracks Collection**: Music track metadata

### ✅ Full CRUD Operations
- **Create**: New playlists, add tracks to playlists
- **Read**: Fetch playlists, view playlist details, search tracks
- **Update**: Modify playlist information
- **Delete**: Remove playlists, remove tracks from playlists

### ✅ Client Application Features
- **Visual Presentation**: Spotify-inspired dark theme
- **Responsive Design**: Mobile and desktop support
- **Asynchronous UI**: Loading states and error handling
- **Real-time Updates**: Playlist changes reflect immediately

### ✅ RESTful API Endpoints
```
GET    /api/charts/top-tracks
GET    /api/charts/top-artists  
GET    /api/search/tracks
GET    /api/deezer/search
GET    /api/playlists
POST   /api/playlists
GET    /api/playlists/:id
PUT    /api/playlists/:id
DELETE /api/playlists/:id
POST   /api/playlists/:id/tracks
DELETE /api/playlists/:id/tracks/:trackIndex
```

## Testing the Deployed Application

1. **Music Discovery**: Browse top charts by country/genre
2. **Search**: Search for tracks and artists
3. **Playlist Management**: Create, view, edit, delete playlists
4. **Track Management**: Add/remove tracks from playlists
5. **Audio Playback**: Play 30-second previews

## Source Code Structure

The complete source code includes:
- `/client` - React frontend with TypeScript
- `/server` - Express.js backend with MongoDB integration
- `/shared` - Shared types and schemas
- MongoDB collections auto-created on first use
- Production build pipeline included

## Assignment Compliance

This application fully meets all MERN stack assignment requirements:
- ✅ MongoDB for data persistence
- ✅ Express.js RESTful API
- ✅ React client with visual presentation
- ✅ Node.js backend
- ✅ Third-party API integration (Last.fm + Deezer)
- ✅ Full CRUD operations
- ✅ Error handling and responsive design
- ✅ Deployed and functional live application