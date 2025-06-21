# Music Explorer - Full Stack Music Discovery Platform

A modern music streaming web application built with React, Node.js, and integrating with Last.fm and Deezer APIs for music discovery and preview playback.

## Features

- **Music Discovery**: Browse top charts by country and genre using Last.fm API
- **Search Functionality**: Search for tracks and artists with real-time results
- **Audio Previews**: Play 30-second track previews using Deezer API
- **Playlist Management**: Create, edit, and delete custom playlists
- **Track Management**: Add and remove tracks from playlists
- **Responsive Design**: Spotify-inspired dark theme with mobile support
- **Real-time Audio Player**: Full playback controls with volume and progress

## Tech Stack

### Frontend
- React 18 with TypeScript
- Wouter for client-side routing
- TanStack Query for server state management
- Shadcn/ui components with Tailwind CSS
- Vite for development and build

### Backend
- Node.js with Express.js
- MongoDB for persistent data storage
- RESTful API architecture
- CORS enabled for client-server communication

### External APIs
- **Last.fm API**: Music metadata, charts, and search
- **Deezer API**: Audio preview URLs and track streaming

## Setup Instructions

### Prerequisites
- Node.js 20+ installed
- MongoDB Atlas account or local MongoDB instance
- Last.fm API key (get from https://www.last.fm/api/account/create)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd music-explorer
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Create .env file
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/music-explorer
LASTFM_API_KEY=your_lastfm_api_key_here
VITE_LASTFM_API_KEY=your_lastfm_api_key_here
```

4. Run development server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Deployment

### For Heroku

1. Create a new Heroku app
```bash
heroku create your-app-name
```

2. Set environment variables
```bash
heroku config:set MONGODB_URI=your_mongodb_connection_string
heroku config:set LASTFM_API_KEY=your_lastfm_api_key_here
heroku config:set VITE_LASTFM_API_KEY=your_lastfm_api_key_here
```

3. Deploy
```bash
git push heroku main
```

### For Other Cloud Services

1. Build the application
```bash
npm run build
```

2. Start production server
```bash
npm start
```

The built application will serve from `dist/public` with the API running on the same port.

## API Endpoints

### Music Discovery
- `GET /api/charts/top-tracks` - Get top tracks (with optional country/genre filters)
- `GET /api/charts/top-artists` - Get top artists (with optional country filter)
- `GET /api/search/tracks` - Search for tracks
- `GET /api/deezer/search` - Get Deezer preview for a track

### Playlist Management
- `GET /api/playlists` - Get all playlists
- `POST /api/playlists` - Create new playlist
- `GET /api/playlists/:id` - Get specific playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist
- `POST /api/playlists/:id/tracks` - Add track to playlist
- `DELETE /api/playlists/:id/tracks/:trackIndex` - Remove track from playlist

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and types
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # In-memory data storage
│   └── vite.ts            # Vite development setup
├── shared/                 # Shared types and schemas
└── dist/                  # Built application (production)
```

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

