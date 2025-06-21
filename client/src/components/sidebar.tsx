import { Link, useLocation } from "wouter";
import { Music, Home, Search, Library, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface SidebarProps {
  onCreatePlaylist: () => void;
}

export function Sidebar({ onCreatePlaylist }: SidebarProps) {
  const [location] = useLocation();

  const { data: playlists = [] } = useQuery({
    queryKey: ["/api/playlists"],
  });

  return (
    <div className="w-64 bg-spotify-dark p-6 flex flex-col h-full">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-spotify-green flex items-center">
          <Music className="mr-2" />
          Music Explorer
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-4 mb-8">
        <Link href="/">
          <a className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 hover:bg-spotify-gray ${
            location === "/" ? "text-white" : "text-spotify-light hover:text-spotify-green"
          }`}>
            <Home className="w-5 h-5" />
            <span>Home</span>
          </a>
        </Link>
        <Link href="/search">
          <a className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 hover:bg-spotify-gray ${
            location === "/search" ? "text-white" : "text-spotify-light hover:text-spotify-green"
          }`}>
            <Search className="w-5 h-5" />
            <span>Search</span>
          </a>
        </Link>
        <Link href="/library">
          <a className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 hover:bg-spotify-gray ${
            location === "/library" ? "text-white" : "text-spotify-light hover:text-spotify-green"
          }`}>
            <Library className="w-5 h-5" />
            <span>Your Library</span>
          </a>
        </Link>
      </nav>

      {/* Playlist Section */}
      <div className="mb-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-spotify-light font-semibold">Playlists</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCreatePlaylist}
            className="text-spotify-light hover:text-white p-1"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          {playlists.map((playlist: any) => (
            <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
              <a className="block text-spotify-light hover:text-white cursor-pointer p-2 rounded transition-colors duration-200 hover:bg-spotify-gray">
                <Music className="inline w-4 h-4 mr-2" />
                {playlist.name}
              </a>
            </Link>
          ))}
        </div>
      </div>

      {/* Create Playlist Button */}
      <Button
        onClick={onCreatePlaylist}
        className="bg-spotify-gray hover:bg-gray-600 text-white rounded-full transition-colors duration-200 w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create Playlist
      </Button>
    </div>
  );
}
