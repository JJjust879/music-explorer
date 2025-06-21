import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import axios from 'axios';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
let db;
if (process.env.MONGODB_URI) {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db();
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }
}

// In-memory storage fallback
let playlists = [];
let playlistId = 1;

// API status endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'Music Explorer API Running',
    version: '1.0.0',
    endpoints: {
      charts: '/api/charts/top-tracks',
      playlists: '/api/playlists',
      health: '/api/health'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    database: db ? 'connected' : 'memory',
    timestamp: new Date().toISOString()
  });
});

// Last.fm charts
app.get('/api/charts/top-tracks', async (req, res) => {
  try {
    const apiKey = process.env.LASTFM_API_KEY;
    if (!apiKey) {
      return res.json([
        { name: "Sample Track 1", artist: { name: "Sample Artist 1" }, url: "#" },
        { name: "Sample Track 2", artist: { name: "Sample Artist 2" }, url: "#" }
      ]);
    }

    const response = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${apiKey}&format=json&limit=10`);
    const tracks = response.data.tracks?.track || [];
    
    res.json(tracks.map(track => ({
      name: track.name,
      artist: { name: track.artist?.name || 'Unknown' },
      url: track.url,
      playcount: track.playcount,
      listeners: track.listeners
    })));
  } catch (error) {
    console.error('Last.fm API error:', error.message);
    res.json([]);
  }
});

app.get('/api/charts/top-artists', async (req, res) => {
  try {
    const apiKey = process.env.LASTFM_API_KEY;
    if (!apiKey) {
      return res.json([
        { name: "Sample Artist 1", url: "#", playcount: "1000000" },
        { name: "Sample Artist 2", url: "#", playcount: "900000" }
      ]);
    }

    const response = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${apiKey}&format=json&limit=10`);
    const artists = response.data.artists?.artist || [];
    
    res.json(artists.map(artist => ({
      name: artist.name,
      url: artist.url,
      playcount: artist.playcount,
      listeners: artist.listeners
    })));
  } catch (error) {
    console.error('Last.fm API error:', error.message);
    res.json([]);
  }
});

// Search endpoints
app.get('/api/search/tracks', async (req, res) => {
  try {
    const query = req.query.q;
    const apiKey = process.env.LASTFM_API_KEY;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    if (!apiKey) {
      return res.json([
        { name: `Sample Result for "${query}"`, artist: "Sample Artist", url: "#" }
      ]);
    }

    const response = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(query)}&api_key=${apiKey}&format=json&limit=20`);
    const tracks = response.data.results?.trackmatches?.track || [];
    
    const results = Array.isArray(tracks) ? tracks : [tracks];
    
    res.json(results.map(track => ({
      name: track.name,
      artist: track.artist,
      url: track.url,
      listeners: track.listeners,
      image: track.image
    })));
  } catch (error) {
    console.error('Track search error:', error.message);
    res.json([]);
  }
});

app.get('/api/search/artists', async (req, res) => {
  try {
    const query = req.query.q;
    const apiKey = process.env.LASTFM_API_KEY;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    if (!apiKey) {
      return res.json([
        { name: `Sample Artist for "${query}"`, url: "#", listeners: "1000000" }
      ]);
    }

    const response = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${encodeURIComponent(query)}&api_key=${apiKey}&format=json&limit=20`);
    const artists = response.data.results?.artistmatches?.artist || [];
    
    const results = Array.isArray(artists) ? artists : [artists];
    
    res.json(results.map(artist => ({
      name: artist.name,
      url: artist.url,
      listeners: artist.listeners,
      image: artist.image
    })));
  } catch (error) {
    console.error('Artist search error:', error.message);
    res.json([]);
  }
});

// Playlist CRUD operations
app.get('/api/playlists', async (req, res) => {
  try {
    if (db) {
      const collection = db.collection('playlists');
      const result = await collection.find({}).toArray();
      res.json(result);
    } else {
      res.json(playlists);
    }
  } catch (error) {
    console.error('Get playlists error:', error);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

app.post('/api/playlists', async (req, res) => {
  try {
    const { name, description, tracks = [] } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Playlist name is required' });
    }

    const playlist = {
      id: playlistId++,
      name,
      description: description || '',
      tracks,
      createdAt: new Date()
    };

    if (db) {
      const collection = db.collection('playlists');
      await collection.insertOne(playlist);
    } else {
      playlists.push(playlist);
    }

    res.status(201).json(playlist);
  } catch (error) {
    console.error('Create playlist error:', error);
    res.status(500).json({ error: 'Failed to create playlist' });
  }
});

app.get('/api/playlists/:id', async (req, res) => {
  try {
    const playlistId = req.params.id;
    
    if (db) {
      const collection = db.collection('playlists');
      // Try to find by MongoDB ObjectId first, then by numeric id
      let playlist;
      try {
        playlist = await collection.findOne({ _id: playlistId });
      } catch (e) {
        playlist = await collection.findOne({ id: parseInt(playlistId) });
      }
      
      if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
      }
      res.json(playlist);
    } else {
      const playlist = playlists.find(p => p.id == playlistId);
      if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
      }
      res.json(playlist);
    }
  } catch (error) {
    console.error('Get playlist error:', error);
    res.status(500).json({ error: 'Failed to fetch playlist' });
  }
});

// Delete track from playlist
app.delete('/api/playlists/:id/tracks/:trackIndex', async (req, res) => {
  try {
    const playlistId = req.params.id;
    const trackIndex = parseInt(req.params.trackIndex);
    
    if (db) {
      const collection = db.collection('playlists');
      let playlist;
      try {
        playlist = await collection.findOne({ _id: playlistId });
      } catch (e) {
        playlist = await collection.findOne({ id: parseInt(playlistId) });
      }
      
      if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
      }

      const tracks = playlist.tracks || [];
      if (trackIndex < 0 || trackIndex >= tracks.length) {
        return res.status(400).json({ error: 'Invalid track index' });
      }

      tracks.splice(trackIndex, 1);
      
      await collection.updateOne(
        { _id: playlist._id },
        { $set: { tracks } }
      );
      
      const updatedPlaylist = await collection.findOne({ _id: playlist._id });
      res.json(updatedPlaylist);
    } else {
      const playlist = playlists.find(p => p.id == playlistId);
      if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
      }
      
      const tracks = playlist.tracks || [];
      if (trackIndex < 0 || trackIndex >= tracks.length) {
        return res.status(400).json({ error: 'Invalid track index' });
      }
      
      tracks.splice(trackIndex, 1);
      playlist.tracks = tracks;
      res.json(playlist);
    }
  } catch (error) {
    console.error('Remove track error:', error);
    res.status(500).json({ error: 'Failed to remove track from playlist' });
  }
});

// Add track to playlist
app.post('/api/playlists/:id/tracks', async (req, res) => {
  try {
    const playlistId = req.params.id;
    const trackData = req.body;
    
    console.log('Adding track to playlist:', { playlistId, trackData });
    
    if (!trackData.name || !trackData.artist) {
      return res.status(400).json({ error: 'Track name and artist are required' });
    }

    if (db) {
      const collection = db.collection('playlists');
      let playlist;
      
      // Try to find playlist by MongoDB ObjectId first, then by numeric id
      try {
        playlist = await collection.findOne({ _id: playlistId });
      } catch (e) {
        playlist = await collection.findOne({ id: parseInt(playlistId) });
      }
      
      if (!playlist) {
        console.log('Playlist not found:', playlistId);
        return res.status(404).json({ error: 'Playlist not found' });
      }

      const updatedTracks = [...(playlist.tracks || []), trackData];
      
      await collection.updateOne(
        { _id: playlist._id },
        { $set: { tracks: updatedTracks } }
      );
      
      const updatedPlaylist = await collection.findOne({ _id: playlist._id });
      console.log('Track added successfully:', updatedPlaylist);
      res.json(updatedPlaylist);
    } else {
      const playlist = playlists.find(p => p.id == playlistId);
      if (!playlist) {
        console.log('Playlist not found in memory:', playlistId);
        return res.status(404).json({ error: 'Playlist not found' });
      }
      
      playlist.tracks = playlist.tracks || [];
      playlist.tracks.push(trackData);
      console.log('Track added to memory playlist:', playlist);
      res.json(playlist);
    }
  } catch (error) {
    console.error('Add track error:', error);
    res.status(500).json({ error: 'Failed to add track to playlist' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`API server running on port ${port}`);
});