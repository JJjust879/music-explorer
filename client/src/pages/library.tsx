import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Play, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { CreatePlaylistModal } from "@/components/create-playlist-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { deezerService } from "@/services/deezer";

export default function Library() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { playTrack } = useAudioPlayer();

  const { data: playlists = [], isLoading } = useQuery({
    queryKey: ["/api/playlists"],
  });

  const deletePlaylistMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/playlists/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playlists"] });
      toast({
        title: "Success",
        description: "Playlist deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete playlist.",
        variant: "destructive",
      });
    },
  });

  const handleDeletePlaylist = (id: number) => {
    if (confirm("Are you sure you want to delete this playlist?")) {
      deletePlaylistMutation.mutate(id);
    }
  };

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

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-spotify-dark to-spotify-black p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">Your Library</h2>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-spotify-green text-white hover:bg-green-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Playlist
          </Button>
        </div>
        <p className="text-spotify-light mt-2">Manage your playlists and saved music</p>
      </div>

      {/* Playlists Grid */}
      <section className="mb-20">
        <h3 className="text-2xl font-bold mb-6 text-white">Your Playlists</h3>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-spotify-gray border-gray-600">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 bg-gray-700" />
                  <Skeleton className="h-4 w-1/2 bg-gray-700" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full bg-gray-700" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : playlists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map((playlist: any) => (
                <Card key={playlist.id} className="bg-spotify-gray border-gray-600 hover:bg-gray-600 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-white">{playlist.name}</h4>
                        <p className="text-spotify-light text-sm">
                          {Array.isArray(playlist.tracks) ? playlist.tracks.length : 0} tracks
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePlaylist(playlist.id)}
                          className="text-spotify-light hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {playlist.description && (
                      <p className="text-spotify-light text-sm mb-4">{playlist.description}</p>
                    )}
                    
                    {/* Track List */}
                    {Array.isArray(playlist.tracks) && playlist.tracks.length > 0 ? (
                      <div className="space-y-2">
                        {playlist.tracks.slice(0, 3).map((track: any, index: number) => (
                          <div key={index} className="flex items-center space-x-3 text-sm group">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePlayTrack(track)}
                              className="text-spotify-light hover:text-spotify-green p-1"
                            >
                              <Play className="w-3 h-3" />
                            </Button>
                            <div className="flex-1 min-w-0">
                              <p className="text-white truncate">{track.name}</p>
                              <p className="text-spotify-light text-xs truncate">{track.artist}</p>
                            </div>
                          </div>
                        ))}
                        {playlist.tracks.length > 3 && (
                          <p className="text-spotify-light text-xs">
                            +{playlist.tracks.length - 3} more tracks
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-spotify-light text-sm">No tracks added yet</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-spotify-light text-lg mb-4">You haven't created any playlists yet</p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-spotify-green text-white hover:bg-green-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Playlist
              </Button>
            </div>
          )}
      </section>

      <CreatePlaylistModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  );
}
