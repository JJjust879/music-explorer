export interface LastfmTrack {
  name: string;
  artist: {
    name: string;
    url?: string;
  };
  url?: string;
  image?: Array<{
    '#text': string;
    size: string;
  }>;
  duration?: string;
}

export interface LastfmArtist {
  name: string;
  url?: string;
  image?: Array<{
    '#text': string;
    size: string;
  }>;
  playcount?: string;
  listeners?: string;
}

export interface DeezerTrack {
  id: number;
  preview?: string;
  album: {
    cover_medium?: string;
    cover_small?: string;
  };
}

export interface AudioPlayerState {
  currentTrack: any | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
}
