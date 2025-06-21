# Music Explorer API - JavaScript Version

## Simple Deployment Package

Pure JavaScript implementation with no build step required.

## API Endpoints

- `GET /` - API status and documentation
- `GET /api/health` - Health check
- `GET /api/charts/top-tracks` - Last.fm top tracks
- `GET /api/charts/top-artists` - Last.fm top artists  
- `GET /api/playlists` - Get all playlists
- `POST /api/playlists` - Create playlist
- `GET /api/playlists/:id` - Get specific playlist

## Deployment

### Render/Heroku
- Start Command: `npm start`
- No build command needed

### Environment Variables
```
MONGODB_URI=your_mongodb_connection_string
LASTFM_API_KEY=your_lastfm_api_key
PORT=5000
```

## Features
- MongoDB integration with fallback to memory storage
- Last.fm API integration with sample data fallback
- CORS enabled for frontend connections
- Error handling and validation