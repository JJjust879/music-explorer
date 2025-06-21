import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Play, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { deezerService } from "@/services/deezer";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

export default function PlaylistDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { playTrack } = useAudioPlayer();

  const { data: playlist, isLoading, error } = useQuery({
    queryKey: ["/api/playlists", id],
    queryFn: async () => {
      const response = await fetch(`/api/playlists/${id}`);
      if (!response.ok) {
        throw new Error('Playlist not found');
      }
      return response.json();
    },
  });

  const removeTrackMutation = useMutation({
    mutationFn: async (trackIndex: number) => {
      await apiRequest("DELETE", `/api/playlists/${id}/tracks/${trackIndex}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playlists", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/playlists"] });
      toast({
        title: "Success",
        description: "Track removed from playlist!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove track from playlist.",
        variant: "destructive",
      });
    },
  });

  const handlePlayTrack = async (track: any) => {
    try {
      const deezerData = await deezerService.getTrackPreview(track.artist, track.name);
      if (deezerData?.preview) {
        playTrack(track, deezerData.preview);
      }
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const handleRemoveTrack = (trackIndex: number) => {
    if (confirm("Are you sure you want to remove this track from the playlist?")) {
      removeTrackMutation.mutate(trackIndex);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-spotify-dark to-spotify-black p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-spotify-dark to-spotify-black p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-white mb-4">Playlist Not Found</h2>
          <p className="text-spotify-light mb-4">The playlist you're looking for doesn't exist.</p>
          <Link href="/library">
            <a>
              <Button className="bg-spotify-green text-white hover:bg-green-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Library
              </Button>
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const tracks = Array.isArray(playlist.tracks) ? playlist.tracks : [];

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-spotify-dark to-spotify-black p-6">
      {/* Header */}
      <div className="mb-8">
        <Link href="/library">
          <a className="inline-flex items-center text-spotify-light hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </a>
        </Link>
        
        <div className="flex items-end space-x-6">
          <div className="w-60 h-60 bg-spotify-gray rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-spotify-green rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-spotify-black">♪</span>
              </div>
              <p className="text-spotify-light text-sm">Playlist</p>
            </div>
          </div>
          
          <div className="flex-1 pb-6">
            <p className="text-spotify-light text-sm mb-2">Playlist</p>
            <h1 className="text-5xl font-bold text-white mb-4">{playlist.name}</h1>
            {playlist.description && (
              <p className="text-spotify-light mb-4">{playlist.description}</p>
            )}
            <p className="text-spotify-light text-sm">
              {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
            </p>
          </div>
        </div>
      </div>

      {/* Playlist Actions */}
      {tracks.length > 0 && (
        <div className="mb-8">
          <Button
            onClick={() => tracks.length > 0 && handlePlayTrack(tracks[0])}
            className="bg-spotify-green text-black hover:bg-green-400 rounded-full w-14 h-14 flex items-center justify-center mr-4"
          >
            <Play className="w-6 h-6 ml-1" />
          </Button>
        </div>
      )}

      {/* Track List */}
      <div className="mb-20">
        {tracks.length > 0 ? (
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-[40px_1fr_1fr_80px_40px] gap-4 px-4 py-2 text-spotify-light text-sm border-b border-gray-600 mb-4">
              <span>#</span>
              <span>Title</span>
              <span>Artist</span>
              <span>Duration</span>
              <span></span>
            </div>
            
            {/* Tracks */}
            {tracks.map((track: any, index: number) => (
              <div
                key={index}
                className="grid grid-cols-[40px_1fr_1fr_80px_40px] gap-4 px-4 py-2 rounded-lg hover:bg-spotify-gray transition-colors group"
              >
                <div className="flex items-center">
                  <span className="text-spotify-light group-hover:hidden">{index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePlayTrack(track)}
                    className="text-spotify-light hover:text-white p-1 hidden group-hover:flex"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <img 
                    src={track.imageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"} 
                    alt="Track artwork" 
                    className="w-10 h-10 rounded object-cover" 
                  />
                  <div>
                    <p className="font-medium text-white">{track.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <p className="text-spotify-light">{track.artist}</p>
                </div>
                
                <div className="flex items-center">
                  <span className="text-spotify-light text-sm">3:20</span>
                </div>
                
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTrack(index)}
                    disabled={removeTrackMutation.isPending}
                    className="text-spotify-light hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-white mb-2">No tracks in this playlist</h3>
            <p className="text-spotify-light mb-6">Add some tracks to get started</p>
            <Link href="/search">
              <a>
                <Button className="bg-spotify-green text-white hover:bg-green-600">
                  Find Music
                </Button>
              </a>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}