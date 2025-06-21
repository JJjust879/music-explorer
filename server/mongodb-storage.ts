import { ObjectId } from 'mongodb';
import { getCollection } from './db';
import { IStorage } from './storage';
import { User, InsertUser, Playlist, InsertPlaylist, Track, InsertTrack } from '@shared/schema';

export class MongoDBStorage implements IStorage {
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const collection = await getCollection('users');
    const user = await collection.findOne({ id });
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const collection = await getCollection('users');
    const user = await collection.findOne({ username });
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const collection = await getCollection('users');
    
    // Get next ID
    const lastUser = await collection.findOne({}, { sort: { id: -1 } });
    const id = lastUser ? lastUser.id + 1 : 1;
    
    const user: User = {
      ...insertUser,
      id
    };

    await collection.insertOne(user);
    return user;
  }

  // Playlist methods
  async getPlaylist(id: number): Promise<Playlist | undefined> {
    const collection = await getCollection('playlists');
    const playlist = await collection.findOne({ id });
    return playlist || undefined;
  }

  async getPlaylistsByUserId(userId: number): Promise<Playlist[]> {
    const collection = await getCollection('playlists');
    const playlists = await collection.find({ userId }).toArray();
    return playlists;
  }

  async createPlaylist(insertPlaylist: InsertPlaylist): Promise<Playlist> {
    const collection = await getCollection('playlists');
    
    // Get next ID
    const lastPlaylist = await collection.findOne({}, { sort: { id: -1 } });
    const id = lastPlaylist ? lastPlaylist.id + 1 : 1;
    
    const playlist: Playlist = {
      ...insertPlaylist,
      id,
      tracks: [],
      createdAt: new Date(),
      description: insertPlaylist.description || null
    };

    await collection.insertOne(playlist);
    return playlist;
  }

  async updatePlaylist(id: number, updates: Partial<Playlist>): Promise<Playlist | undefined> {
    const collection = await getCollection('playlists');
    
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: updates },
      { returnDocument: 'after' }
    );

    return result || undefined;
  }

  async deletePlaylist(id: number): Promise<boolean> {
    const collection = await getCollection('playlists');
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }

  async addTrackToPlaylist(playlistId: number, track: InsertTrack): Promise<boolean> {
    const playlistCollection = await getCollection('playlists');
    const playlist = await playlistCollection.findOne({ id: playlistId });
    
    if (!playlist) return false;

    const newTrack = await this.createTrack(track);
    
    const result = await playlistCollection.updateOne(
      { id: playlistId },
      { $push: { tracks: newTrack } }
    );

    return result.modifiedCount > 0;
  }

  async removeTrackFromPlaylist(playlistId: number, trackIndex: number): Promise<boolean> {
    const collection = await getCollection('playlists');
    const playlist = await collection.findOne({ id: playlistId });
    
    if (!playlist || !Array.isArray(playlist.tracks) || trackIndex < 0 || trackIndex >= playlist.tracks.length) {
      return false;
    }

    // Remove track at specific index
    playlist.tracks.splice(trackIndex, 1);
    
    const result = await collection.updateOne(
      { id: playlistId },
      { $set: { tracks: playlist.tracks } }
    );

    return result.modifiedCount > 0;
  }

  // Track methods
  async getTrack(id: number): Promise<Track | undefined> {
    const collection = await getCollection('tracks');
    const track = await collection.findOne({ id });
    return track || undefined;
  }

  async createTrack(insertTrack: InsertTrack): Promise<Track> {
    const collection = await getCollection('tracks');
    
    // Get next ID
    const lastTrack = await collection.findOne({}, { sort: { id: -1 } });
    const id = lastTrack ? lastTrack.id + 1 : 1;
    
    const track: Track = {
      ...insertTrack,
      id,
      album: insertTrack.album || null,
      duration: insertTrack.duration || null,
      previewUrl: insertTrack.previewUrl || null,
      imageUrl: insertTrack.imageUrl || null,
      lastfmUrl: insertTrack.lastfmUrl || null,
      deezerTrackId: insertTrack.deezerTrackId || null
    };

    await collection.insertOne(track);
    return track;
  }

  async searchTracks(query: string): Promise<Track[]> {
    const collection = await getCollection('tracks');
    const searchTerm = query.toLowerCase();
    
    const tracks = await collection.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { artist: { $regex: searchTerm, $options: 'i' } },
        { album: { $regex: searchTerm, $options: 'i' } }
      ]
    }).toArray();
    
    return tracks;
  }
}