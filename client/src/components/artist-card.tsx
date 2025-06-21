import { LastfmArtist } from "@/lib/types";

interface ArtistCardProps {
  artist: LastfmArtist;
  onClick?: () => void;
}

export function ArtistCard({ artist, onClick }: ArtistCardProps) {
  const getImageUrl = () => {
    return artist.image?.[2]?.['#text'] || artist.image?.[1]?.['#text'] || 
           "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200";
  };

  return (
    <div 
      className="text-center group cursor-pointer" 
      onClick={onClick}
    >
      <img 
        src={getImageUrl()} 
        alt="Artist photo" 
        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover group-hover:shadow-lg transition-shadow duration-200" 
      />
      <h4 className="font-semibold mb-1 text-white">{artist.name}</h4>
      <p className="text-spotify-light text-sm">
        {artist.listeners ? `${parseInt(artist.listeners).toLocaleString()} listeners` : 'Artist'}
      </p>
    </div>
  );
}
