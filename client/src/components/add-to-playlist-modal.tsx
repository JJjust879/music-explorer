import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Music } from "lucide-react";

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: any;
}

export function AddToPlaylistModal({ isOpen, onClose, track }: AddToPlaylistModalProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: playlists = [], isLoading } = useQuery({
    queryKey: ["/api/playlists"],
  });

  const addToPlaylistMutation = useMutation({
    mutationFn: async (playlistId: number) => {
      const response = await apiRequest("POST", `/api/playlists/${playlistId}/tracks`, track);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playlists"] });
      toast({
        title: "Success",
        description: "Track added to playlist!",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add track to playlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddToPlaylist = (playlistId: number) => {
    addToPlaylistMutation.mutate(playlistId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-spotify-gray text-white border-gray-600">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add to Playlist</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4">
          <p className="text-spotify-light text-sm mb-2">Adding:</p>
          <div className="flex items-center space-x-3 p-3 bg-spotify-dark rounded-lg">
            <img 
              src={track?.imageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"} 
              alt="Track artwork" 
              className="w-12 h-12 rounded object-cover" 
            />
            <div>
              <p className="font-medium text-white">{track?.name}</p>
              <p className="text-spotify-light text-sm">{track?.artist}</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 bg-spotify-dark rounded-lg animate-pulse" />
            ))}
          </div>
        ) : playlists.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {playlists.map((playlist: any) => (
              <Button
                key={playlist.id}
                variant="ghost"
                onClick={() => handleAddToPlaylist(playlist.id)}
                disabled={addToPlaylistMutation.isPending}
                className="w-full justify-start p-3 h-auto bg-spotify-dark hover:bg-gray-600 text-white"
              >
                <Music className="w-4 h-4 mr-3" />
                <div className="text-left">
                  <p className="font-medium">{playlist.name}</p>
                  <p className="text-spotify-light text-xs">
                    {Array.isArray(playlist.tracks) ? playlist.tracks.length : 0} tracks
                  </p>
                </div>
              </Button>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-spotify-light mb-4">No playlists found</p>
            <Button
              onClick={onClose}
              className="bg-spotify-green text-white hover:bg-green-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Playlist First
            </Button>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-spotify-light hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}