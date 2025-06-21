import { DeezerTrack } from "@/lib/types";

const API_BASE = "/api";

export const deezerService = {
  async getTrackPreview(artist: string, track: string): Promise<DeezerTrack | null> {
    const params = new URLSearchParams({
      artist,
      track
    });
    
    try {
      const response = await fetch(`${API_BASE}/deezer/search?${params}`);
      if (!response.ok) {
        return null;
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching Deezer preview:', error);
      return null;
    }
  }
};
