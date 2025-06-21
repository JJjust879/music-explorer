import { LastfmTrack, LastfmArtist } from "@/lib/types";

const API_BASE = "/api";

export const lastfmService = {
  async getTopTracks(country?: string, genre?: string, limit = 20): Promise<LastfmTrack[]> {
    const params = new URLSearchParams();
    if (country) params.append('country', country);
    if (genre) params.append('genre', genre);
    params.append('limit', limit.toString());
    
    const response = await fetch(`${API_BASE}/charts/top-tracks?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch top tracks');
    }
    return response.json();
  },

  async getTopArtists(country?: string, limit = 20): Promise<LastfmArtist[]> {
    const params = new URLSearchParams();
    if (country) params.append('country', country);
    params.append('limit', limit.toString());
    
    const response = await fetch(`${API_BASE}/charts/top-artists?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch top artists');
    }
    return response.json();
  },

  async searchTracks(query: string, limit = 20): Promise<LastfmTrack[]> {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString()
    });
    
    const response = await fetch(`${API_BASE}/search/tracks?${params}`);
    if (!response.ok) {
      throw new Error('Failed to search tracks');
    }
    return response.json();
  }
};
