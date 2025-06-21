import { Play, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { deezerService } from "@/services/deezer";
import { LastfmTrack } from "@/lib/types";
import { useState } from "react";
import { AddToPlaylistModal } from "@/components/add-to-playlist-modal";

interface TrackCardProps {
  track: LastfmTrack;
  onAddToPlaylist?: (track: any) => void;
}

export function TrackCard({ track, onAddToPlaylist }: TrackCardProps) {
  const { playTrack } = useAudioPlayer();
  const [isLoading, setIsLoading] = useState(false);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);

  const handlePlay = async () => {
    setIsLoading(true);
    try {
      const artistName = typeof track.artist === 'string' ? track.artist : track.artist.name;
      const deezerData = await deezerService.getTrackPreview(artistName, track.name);
      
      if (deezerData?.preview) {
        const trackData = {
          name: track.name,
          artist: artistName,
          imageUrl: deezerData.album.cover_medium || track.image?.[2]?.['#text'],
          previewUrl: deezerData.preview,
        };
        playTrack(trackData, deezerData.preview);
      }
    } catch (error) {
      console.error('Error playing track:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = () => {
    return track.image?.[2]?.['#text'] || track.image?.[1]?.['#text'] || 
           "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300";
  };

  const artistName = typeof track.artist === 'string' ? track.artist : track.artist.name;

  return (
    <div className="bg-spotify-gray p-4 rounded-lg hover:bg-gray-600 transition-colors duration-200 cursor-pointer group">
      <img 
        src={getImageUrl()} 
        alt="Album cover" 
        className="w-full h-32 object-cover rounded-lg mb-3" 
      />
      <h4 className="font-semibold text-sm mb-1 truncate text-white">{track.name}</h4>
      <p className="text-spotify-light text-xs truncate">{artistName}</p>
      <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-2">
        <Button
          onClick={handlePlay}
          disabled={isLoading}
          variant="ghost"
          size="sm"
          className="text-spotify-green hover:text-white p-1"
        >
          <Play className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => setShowAddToPlaylist(true)}
          variant="ghost"
          size="sm"
          className="text-spotify-light hover:text-white p-1"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <AddToPlaylistModal
        isOpen={showAddToPlaylist}
        onClose={() => setShowAddToPlaylist(false)}
        track={{
          name: track.name,
          artist: artistName,
          imageUrl: getImageUrl(),
          lastfmUrl: track.url,
        }}
      />
    </div>
  );
}
