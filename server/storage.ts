import { type User, type InsertUser, type Playlist, type InsertPlaylist, type Track, type InsertTrack } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Playlist methods
  getPlaylist(id: number): Promise<Playlist | undefined>;
  getPlaylistsByUserId(userId: number): Promise<Playlist[]>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  updatePlaylist(id: number, updates: Partial<Playlist>): Promise<Playlist | undefined>;
  deletePlaylist(id: number): Promise<boolean>;
  addTrackToPlaylist(playlistId: number, track: InsertTrack): Promise<boolean>;
  removeTrackFromPlaylist(playlistId: number, trackIndex: number): Promise<boolean>;

  // Track methods
  getTrack(id: number): Promise<Track | undefined>;
  createTrack(track: InsertTrack): Promise<Track>;
  searchTracks(query: string): Promise<Track[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private playlists: Map<number, Playlist>;
  private tracks: Map<number, Track>;
  private currentUserId: number;
  private currentPlaylistId: number;
  private currentTrackId: number;

  constructor() {
    this.users = new Map();
    this.playlists = new Map();
    this.tracks = new Map();
    this.currentUserId = 1;
    this.currentPlaylistId = 1;
    this.currentTrackId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPlaylist(id: number): Promise<Playlist | undefined> {
    return this.playlists.get(id);
  }

  async getPlaylistsByUserId(userId: number): Promise<Playlist[]> {
    return Array.from(this.playlists.values()).filter(
      (playlist) => playlist.userId === userId,
    );
  }

  async createPlaylist(insertPlaylist: InsertPlaylist): Promise<Playlist> {
    const id = this.currentPlaylistId++;
    const playlist: Playlist = {
      ...insertPlaylist,
      id,
      tracks: [],
      createdAt: new Date(),
      description: insertPlaylist.description || undefined,
    };
    this.playlists.set(id, playlist);
    return playlist;
  }

  async updatePlaylist(id: number, updates: Partial<Playlist>): Promise<Playlist | undefined> {
    const playlist = this.playlists.get(id);
    if (!playlist) return undefined;

    const updatedPlaylist = { ...playlist, ...updates };
    this.playlists.set(id, updatedPlaylist);
    return updatedPlaylist;
  }

  async deletePlaylist(id: number): Promise<boolean> {
    return this.playlists.delete(id);
  }

  async addTrackToPlaylist(playlistId: number, track: InsertTrack): Promise<boolean> {
    const playlist = this.playlists.get(playlistId);
    if (!playlist) return false;

    const newTrack = await this.createTrack(track);
    const tracks = Array.isArray(playlist.tracks) ? playlist.tracks : [];
    tracks.push(newTrack);
    
    this.playlists.set(playlistId, { ...playlist, tracks });
    return true;
  }

  async removeTrackFromPlaylist(playlistId: number, trackIndex: number): Promise<boolean> {
    const playlist = this.playlists.get(playlistId);
    if (!playlist) return false;

    const tracks = Array.isArray(playlist.tracks) ? playlist.tracks : [];
    if (trackIndex < 0 || trackIndex >= tracks.length) return false;

    tracks.splice(trackIndex, 1);
    this.playlists.set(playlistId, { ...playlist, tracks });
    return true;
  }

  async getTrack(id: number): Promise<Track | undefined> {
    return this.tracks.get(id);
  }

  async createTrack(insertTrack: InsertTrack): Promise<Track> {
    const id = this.currentTrackId++;
    const track: Track = { 
      ...insertTrack, 
      id,
      album: insertTrack.album || undefined,
      duration: insertTrack.duration || undefined,
      previewUrl: insertTrack.previewUrl || undefined,
      imageUrl: insertTrack.imageUrl || undefined,
      lastfmUrl: insertTrack.lastfmUrl || undefined,
      deezerTrackId: insertTrack.deezerTrackId || undefined
    };
    this.tracks.set(id, track);
    return track;
  }

  async searchTracks(query: string): Promise<Track[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.tracks.values()).filter(
      (track) =>
        track.name.toLowerCase().includes(searchTerm) ||
        track.artist.toLowerCase().includes(searchTerm) ||
        (track.album && track.album.toLowerCase().includes(searchTerm))
    );
  }
}

export const storage = new MemStorage();

// MongoDB storage implementation
import { MongoDBStorage } from './mongodb-storage';

// Switch between storage implementations based on environment
export const getStorage = (): IStorage => {
  if (process.env.MONGODB_URI) {
    console.log('Using MongoDB storage');
    return new MongoDBStorage();
  }
  
  console.log('Using in-memory storage');
  return new MemStorage();
};
