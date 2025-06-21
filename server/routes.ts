import type { Express } from "express";
import { createServer, type Server } from "http";
import { getStorage } from "./storage";

const storage = getStorage();
import { insertPlaylistSchema, insertTrackSchema } from "@shared/schema";
import axios from "axios";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get top charts from Last.fm API
  app.get("/api/charts/top-tracks", async (req, res) => {
    try {
      const { country = "", genre = "", limit = 20 } = req.query;
      const apiKey = process.env.LASTFM_API_KEY || process.env.VITE_LASTFM_API_KEY || "demo_key";
      
      let url = `https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${apiKey}&format=json&limit=${limit}`;
      
      if (country) {
        url = `https://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=${country}&api_key=${apiKey}&format=json&limit=${limit}`;
      }

      const response = await axios.get(url);
      const tracks = response.data.tracks?.track || [];
      
      res.json(tracks);
    } catch (error) {
      console.error('Error fetching top tracks:', error);
      res.status(500).json({ message: "Failed to fetch top tracks" });
    }
  });

  // Get top artists from Last.fm API
  app.get("/api/charts/top-artists", async (req, res) => {
    try {
      const { country = "", limit = 20 } = req.query;
      const apiKey = process.env.LASTFM_API_KEY || process.env.VITE_LASTFM_API_KEY || "demo_key";
      
      let url = `https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${apiKey}&format=json&limit=${limit}`;
      
      if (country) {
        url = `https://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country=${country}&api_key=${apiKey}&format=json&limit=${limit}`;
      }

      const response = await axios.get(url);
      const artists = response.data.artists?.artist || [];
      
      res.json(artists);
    } catch (error) {
      console.error('Error fetching top artists:', error);
      res.status(500).json({ message: "Failed to fetch top artists" });
    }
  });

  // Search tracks from Last.fm API
  app.get("/api/search/tracks", async (req, res) => {
    try {
      const { q, limit = 20 } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Search query is required" });
      }

      const apiKey = process.env.LASTFM_API_KEY || process.env.VITE_LASTFM_API_KEY || "demo_key";
      const url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(q as string)}&api_key=${apiKey}&format=json&limit=${limit}`;

      const response = await axios.get(url);
      const tracks = response.data.results?.trackmatches?.track || [];
      
      res.json(tracks);
    } catch (error) {
      console.error('Error searching tracks:', error);
      res.status(500).json({ message: "Failed to search tracks" });
    }
  });

  // Get Deezer preview for a track
  app.get("/api/deezer/search", async (req, res) => {
    try {
      const { artist, track } = req.query;
      if (!artist || !track) {
        return res.status(400).json({ message: "Artist and track are required" });
      }

      const query = `${artist} ${track}`;
      const url = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=1`;

      const response = await axios.get(url);
      const data = response.data.data || [];
      
      if (data.length > 0) {
        const deezerTrack = data[0];
        res.json({
          id: deezerTrack.id,
          preview: deezerTrack.preview,
          album: {
            cover_medium: deezerTrack.album.cover_medium,
            cover_small: deezerTrack.album.cover_small
          }
        });
      } else {
        res.status(404).json({ message: "No preview found" });
      }
    } catch (error) {
      console.error('Error fetching Deezer preview:', error);
      res.status(500).json({ message: "Failed to fetch preview" });
    }
  });

  // Playlist CRUD operations
  app.get("/api/playlists", async (req, res) => {
    try {
      const userId = 1; // For demo purposes, using hardcoded user ID
      const playlists = await storage.getPlaylistsByUserId(userId);
      res.json(playlists);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      res.status(500).json({ message: "Failed to fetch playlists" });
    }
  });

  app.post("/api/playlists", async (req, res) => {
    try {
      const validatedData = insertPlaylistSchema.parse({ ...req.body, userId: 1 });
      const playlist = await storage.createPlaylist(validatedData);
      res.status(201).json(playlist);
    } catch (error) {
      console.error('Error creating playlist:', error);
      res.status(500).json({ message: "Failed to create playlist" });
    }
  });

  app.get("/api/playlists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const playlist = await storage.getPlaylist(id);
      if (!playlist) {
        return res.status(404).json({ message: "Playlist not found" });
      }
      res.json(playlist);
    } catch (error) {
      console.error('Error fetching playlist:', error);
      res.status(500).json({ message: "Failed to fetch playlist" });
    }
  });

  app.put("/api/playlists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const playlist = await storage.updatePlaylist(id, updates);
      if (!playlist) {
        return res.status(404).json({ message: "Playlist not found" });
      }
      res.json(playlist);
    } catch (error) {
      console.error('Error updating playlist:', error);
      res.status(500).json({ message: "Failed to update playlist" });
    }
  });

  app.delete("/api/playlists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePlaylist(id);
      if (!deleted) {
        return res.status(404).json({ message: "Playlist not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting playlist:', error);
      res.status(500).json({ message: "Failed to delete playlist" });
    }
  });

  app.post("/api/playlists/:id/tracks", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedTrack = insertTrackSchema.parse(req.body);
      const success = await storage.addTrackToPlaylist(id, validatedTrack);
      if (!success) {
        return res.status(404).json({ message: "Playlist not found" });
      }
      res.status(201).json({ message: "Track added to playlist" });
    } catch (error) {
      console.error('Error adding track to playlist:', error);
      res.status(500).json({ message: "Failed to add track to playlist" });
    }
  });

  app.delete("/api/playlists/:id/tracks/:trackIndex", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const trackIndex = parseInt(req.params.trackIndex);
      const success = await storage.removeTrackFromPlaylist(id, trackIndex);
      if (!success) {
        return res.status(404).json({ message: "Playlist or track not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error removing track from playlist:', error);
      res.status(500).json({ message: "Failed to remove track from playlist" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
