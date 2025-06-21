# Music Explorer Frontend

React frontend for the Music Explorer MERN stack application.

## Features
- Display top tracks and artists from Last.fm API
- Create and view playlists stored in MongoDB
- Real-time API status monitoring
- Responsive design with modern UI

## Configuration

1. Create `.env` file:
```
VITE_API_URL=https://your-api-name.onrender.com
```

2. Replace `your-api-name` with your actual API deployment URL

## Local Development
```bash
npm install
npm run dev
```

## Deployment
```bash
npm run build
npm start
```

## Environment Variables
- `VITE_API_URL`: Your deployed API base URL
- `PORT`: Port for production preview (set by hosting platform)

## Technologies
- React 18
- Vite
- Axios for API calls
- Responsive CSS Grid layout