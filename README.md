# Music Explorer API

## Overview
RESTful API for music discovery and playlist management using MongoDB and Last.fm integration.

## API Endpoints

### Music Discovery
- `GET /api/charts/top-tracks` - Get top tracks from Last.fm
- `GET /api/charts/top-artists` - Get top artists from Last.fm
- `GET /api/search/tracks?q=query` - Search tracks
- `GET /api/search/artists?q=query` - Search artists

### Playlist Management
- `GET /api/playlists` - Get all playlists
- `POST /api/playlists` - Create new playlist
- `GET /api/playlists/:id` - Get specific playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist
- `POST /api/playlists/:id/tracks` - Add track to playlist
- `DELETE /api/playlists/:id/tracks/:trackIndex` - Remove track from playlist

### Health Check
- `GET /api/health` - API health status
- `GET /` - API information and available endpoints

## Environment Variables
```
MONGODB_URI=your_mongodb_connection_string
LASTFM_API_KEY=your_lastfm_api_key
NODE_ENV=production
```

## Deployment

### Render
1. Upload to GitHub repository
2. Create Web Service on Render
3. Build Command: `npm run build`
4. Start Command: `npm start`
5. Add environment variables

### Heroku
1. Upload to GitHub repository  
2. Create Heroku app
3. Connect GitHub repository
4. Add environment variables
5. Deploy

## Database Schema
- **Users**: Authentication and user management
- **Playlists**: User-created playlists with track collections
- **Tracks**: Music track metadata and external service IDs

## Features
- MongoDB Atlas integration
- Last.fm API for music data
- CORS enabled for frontend integration
- Express session management
- RESTful API design
- Error handling and validation