import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { lastfmService } from "@/services/lastfm";
import { TrackCard } from "@/components/track-card";
import { ArtistCard } from "@/components/artist-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("global");
  const [activeSearch, setActiveSearch] = useState("");

  const { data: searchResults = [], isLoading: searchLoading } = useQuery({
    queryKey: ["/api/search/tracks", activeSearch],
    queryFn: () => lastfmService.searchTracks(activeSearch),
    enabled: !!activeSearch,
  });

  const { data: topTracks = [], isLoading: chartsLoading } = useQuery({
    queryKey: ["/api/charts/top-tracks", selectedCountry, selectedGenre],
    queryFn: () => lastfmService.getTopTracks(
      selectedCountry === "global" ? "" : selectedCountry, 
      selectedGenre === "all" ? "" : selectedGenre
    ),
  });

  const { data: topArtists = [], isLoading: artistsLoading } = useQuery({
    queryKey: ["/api/charts/top-artists", selectedCountry],
    queryFn: () => lastfmService.getTopArtists(selectedCountry === "global" ? "" : selectedCountry),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveSearch(searchQuery.trim());
    }
  };

  const displayTracks = activeSearch ? searchResults : topTracks;
  const isLoading = activeSearch ? searchLoading : chartsLoading;

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-spotify-dark to-spotify-black p-6">
      {/* Search Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-6 text-white">Search Music</h2>
        
        {/* Search Bar and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-spotify-light w-4 h-4" />
              <Input
                type="text"
                placeholder="Search for artists, songs, or albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-spotify-gray text-white placeholder-spotify-light pl-10 pr-4 py-2 rounded-full border-0 focus:ring-2 focus:ring-spotify-green"
              />
            </div>
          </form>
          
          <div className="flex gap-4">
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="bg-spotify-gray text-white border-0 rounded-full min-w-[140px]">
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent className="bg-spotify-gray text-white border-gray-600">
                <SelectItem value="all">All Genres</SelectItem>
                <SelectItem value="pop">Pop</SelectItem>
                <SelectItem value="rock">Rock</SelectItem>
                <SelectItem value="hip-hop">Hip Hop</SelectItem>
                <SelectItem value="electronic">Electronic</SelectItem>
                <SelectItem value="indie">Indie</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="bg-spotify-gray text-white border-0 rounded-full min-w-[140px]">
                <SelectValue placeholder="Global" />
              </SelectTrigger>
              <SelectContent className="bg-spotify-gray text-white border-gray-600">
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Search Results or Charts */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">
            {activeSearch ? `Search Results for "${activeSearch}"` : "Top Tracks"}
          </h3>
          {activeSearch && (
            <Button 
              onClick={() => { setActiveSearch(""); setSearchQuery(""); }}
              variant="outline"
              className="text-spotify-light border-spotify-light hover:text-white hover:border-white"
            >
              Clear Search
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {isLoading ? (
            Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-spotify-gray p-4 rounded-lg">
                <Skeleton className="w-full h-32 rounded-lg mb-3 bg-gray-700" />
                <Skeleton className="h-4 w-3/4 mb-1 bg-gray-700" />
                <Skeleton className="h-3 w-1/2 bg-gray-700" />
              </div>
            ))
          ) : displayTracks.length > 0 ? (
            displayTracks.map((track: any, index: number) => (
              <TrackCard key={index} track={track} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-spotify-light text-lg">
                {activeSearch ? "No results found. Try a different search term." : "No tracks available."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Top Artists Section (only show when not searching) */}
      {!activeSearch && (
        <section className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Top Artists</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {artistsLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-700" />
                  <Skeleton className="h-4 w-20 mx-auto mb-1 bg-gray-700" />
                  <Skeleton className="h-3 w-16 mx-auto bg-gray-700" />
                </div>
              ))
            ) : (
              topArtists.slice(0, 10).map((artist: any, index: number) => (
                <ArtistCard key={index} artist={artist} />
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
}
