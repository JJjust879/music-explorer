import { useQuery } from "@tanstack/react-query";
import { lastfmService } from "@/services/lastfm";
import { TrackCard } from "@/components/track-card";
import { ArtistCard } from "@/components/artist-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: topTracks = [], isLoading: tracksLoading } = useQuery({
    queryKey: ["/api/charts/top-tracks"],
    queryFn: () => lastfmService.getTopTracks(),
  });

  const { data: topArtists = [], isLoading: artistsLoading } = useQuery({
    queryKey: ["/api/charts/top-artists"],
    queryFn: () => lastfmService.getTopArtists(),
  });

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-spotify-dark to-spotify-black p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-white">Good evening, Music Lover!</h2>
        <p className="text-spotify-light">Discover new music and create amazing playlists</p>
      </div>

      {/* Top Charts Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Top Charts</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tracksLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-spotify-gray p-4 rounded-lg">
                <Skeleton className="w-full h-32 rounded-lg mb-3 bg-gray-700" />
                <Skeleton className="h-4 w-3/4 mb-1 bg-gray-700" />
                <Skeleton className="h-3 w-1/2 bg-gray-700" />
              </div>
            ))
          ) : (
            topTracks.slice(0, 6).map((track: any, index: number) => (
              <TrackCard key={index} track={track} />
            ))
          )}
        </div>
      </section>

      {/* Featured Artists Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Featured Artists</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {artistsLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-700" />
                <Skeleton className="h-4 w-20 mx-auto mb-1 bg-gray-700" />
                <Skeleton className="h-3 w-16 mx-auto bg-gray-700" />
              </div>
            ))
          ) : (
            topArtists.slice(0, 5).map((artist: any, index: number) => (
              <ArtistCard key={index} artist={artist} />
            ))
          )}
        </div>
      </section>

      {/* Recently Played Section */}
      <section className="mb-20">
        <h3 className="text-2xl font-bold mb-6 text-white">More Top Tracks</h3>
        <div className="space-y-2">
          {tracksLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 rounded-lg">
                <Skeleton className="w-12 h-12 rounded bg-gray-700" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-40 mb-1 bg-gray-700" />
                  <Skeleton className="h-3 w-32 bg-gray-700" />
                </div>
                <Skeleton className="h-3 w-8 bg-gray-700" />
              </div>
            ))
          ) : (
            topTracks.slice(6, 11).map((track: any, index: number) => {
              const artistName = typeof track.artist === 'string' ? track.artist : track.artist.name;
              const imageUrl = track.image?.[1]?.['#text'] || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60";
              
              return (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-spotify-gray transition-colors duration-200 group">
                  <img 
                    src={imageUrl} 
                    alt="Track artwork" 
                    className="w-12 h-12 rounded object-cover" 
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate text-white">{track.name}</h4>
                    <p className="text-spotify-light text-sm truncate">{artistName}</p>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <TrackCard track={track} />
                  </div>
                  <span className="text-spotify-light text-sm">
                    {track.duration ? Math.floor(parseInt(track.duration) / 60) + ':' + 
                     (parseInt(track.duration) % 60).toString().padStart(2, '0') : '3:20'}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
