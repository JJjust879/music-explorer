import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, List, Monitor, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAudioPlayer } from "@/hooks/use-audio-player";

export function AudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlayPause,
    setVolume,
    toggleMute,
    seekTo
  } = useAudioPlayer();

  if (!currentTrack) return null;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number[]) => {
    seekTo((value[0] / 100) * duration);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-spotify-gray border-t border-gray-600 px-4 py-3">
      <div className="flex items-center justify-between">
        
        {/* Current Track Info */}
        <div className="flex items-center space-x-4 w-1/3">
          <img 
            src={currentTrack.imageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"} 
            alt="Current track artwork" 
            className="w-14 h-14 rounded object-cover" 
          />
          <div className="min-w-0">
            <h4 className="font-medium text-white truncate">{currentTrack.name}</h4>
            <p className="text-spotify-light text-sm truncate">{currentTrack.artist}</p>
          </div>
          <Button variant="ghost" size="sm" className="text-spotify-light hover:text-white">
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center w-1/3">
          <div className="flex items-center space-x-4 mb-2">
            <Button variant="ghost" size="sm" className="text-spotify-light hover:text-white">
              <Shuffle className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-spotify-light hover:text-white">
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              onClick={togglePlayPause}
              className="bg-white text-spotify-black rounded-full w-10 h-10 flex items-center justify-center hover:scale-105 transition-transform duration-200"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-1" />}
            </Button>
            <Button variant="ghost" size="sm" className="text-spotify-light hover:text-white">
              <SkipForward className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-spotify-light hover:text-white">
              <Repeat className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center space-x-2 w-full max-w-md">
            <span className="text-xs text-spotify-light">{formatTime(currentTime)}</span>
            <Slider
              value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
              onValueChange={handleSeek}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-spotify-light">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume and Options */}
        <div className="flex items-center space-x-4 w-1/3 justify-end">
          <Button variant="ghost" size="sm" className="text-spotify-light hover:text-white">
            <List className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-spotify-light hover:text-white">
            <Monitor className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={toggleMute} className="text-spotify-light hover:text-white">
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
