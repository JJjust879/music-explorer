# MERN Stack Music Explorer

## Project Overview
A full-stack music discovery and playlist management application built with MongoDB, Express.js, React (vanilla JS), and Node.js. Features Last.fm API integration for music discovery and complete CRUD operations for playlist management.

## Features
- **Music Discovery**: Browse top charts and search tracks using Last.fm API
- **Playlist Management**: Create, view, and delete playlists
- **Track Management**: Add and remove tracks from playlists
- **Data Persistence**: MongoDB integration for storing user playlists
- **Responsive Design**: Clean, Spotify-inspired interface

## Live Demo
- **API**: https://music-explorer-k1tk.onrender.com
- **Frontend**: Open `music-app-simple.html` in any modern web browser

## Local Development

### Prerequisites
- Node.js (v14 or higher)
- MongoDB connection string
- Last.fm API key

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set environment variables:
   ```bash
   MONGODB_URI=your_mongodb_connection_string
   LASTFM_API_KEY=your_lastfm_api_key
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open `music-app-simple.html` in your browser

## API Endpoints

### Playlists
- `GET /api/playlists` - Get all playlists
- `POST /api/playlists` - Create new playlist

- `DELETE /api/playlists/:id` - Delete playlist

### Tracks
- `POST /api/playlists/:id/tracks` - Add track to playlist
- `DELETE /api/playlists/:id/tracks/:index` - Remove track from playlist

### Music Discovery
- `GET /api/charts/top-tracks` - Get top tracks
- `GET /api/search/tracks?q=query` - Search tracks

## Technology Stack
- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **APIs**: Last.fm API for music data
- **Database**: MongoDB with Mongoose ODM
- **Deployment**: Render (API), Static hosting (Frontend)

## Project Structure
```
├── api-only/           # Backend API server
│   └── index.js       # Main server file
├── music-app-simple.html  # Frontend application
├── package.json       # Dependencies
└── README.md          # Documentation
```

## Academic Requirements Met
- ✅ MERN Stack implementation
- ✅ External API integration (Last.fm)
- ✅ Database CRUD operations
- ✅ Interactive frontend
- ✅ Data persistence
- ✅ Complete functionality demonstration

## Deployment
The application is deployed and ready for evaluation:
- Backend API hosted on Render
- Frontend can be opened directly in browser
- All CRUD operations functional
- Live music data from Last.fm API

## Author
[Your Name]
Course: [Course Name]
Date: June 2025