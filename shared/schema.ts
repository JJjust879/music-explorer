import { z } from "zod";

// User types
export interface User {
  id: number;
  username: string;
  password: string;
  createdAt?: Date;
}

export interface InsertUser {
  username: string;
  password: string;
}

// Playlist types
export interface Playlist {
  id: number;
  name: string;
  description?: string;
  userId: number;
  tracks: any[];
  createdAt?: Date;
}

export interface InsertPlaylist {
  name: string;
  description?: string;
  userId: number;
  tracks?: any[];
}

// Track types
export interface Track {
  id: number;
  name: string;
  artist: string;
  album?: string;
  duration?: string;
  previewUrl?: string;
  imageUrl?: string;
  lastfmUrl?: string;
  deezerTrackId?: string;
  createdAt?: Date;
}

export interface InsertTrack {
  name: string;
  artist: string;
  album?: string;
  duration?: string;
  previewUrl?: string;
  imageUrl?: string;
  lastfmUrl?: string;
  deezerTrackId?: string;
}

// Zod schemas for validation
export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const insertPlaylistSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  userId: z.number(),
  tracks: z.array(z.any()).default([]),
});

export const insertTrackSchema = z.object({
  name: z.string().min(1),
  artist: z.string().min(1),
  album: z.string().optional(),
  duration: z.string().optional(),
  previewUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  lastfmUrl: z.string().optional(),
  deezerTrackId: z.string().optional(),
});
