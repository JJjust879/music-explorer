import { useState, useRef, useCallback, useEffect } from "react";
import { AudioPlayerState } from "@/lib/types";

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioPlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isMuted: false
  });

  const playTrack = useCallback((track: any, previewUrl?: string) => {
    if (!previewUrl) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    audioRef.current = new Audio(previewUrl);
    audioRef.current.volume = state.isMuted ? 0 : state.volume;

    audioRef.current.addEventListener('loadedmetadata', () => {
      setState(prev => ({
        ...prev,
        currentTrack: track,
        duration: audioRef.current?.duration || 0
      }));
    });

    audioRef.current.addEventListener('timeupdate', () => {
      setState(prev => ({
        ...prev,
        currentTime: audioRef.current?.currentTime || 0
      }));
    });

    audioRef.current.addEventListener('ended', () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    });

    audioRef.current.play();
    setState(prev => ({ ...prev, isPlaying: true }));
  }, [state.volume, state.isMuted]);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;

    if (state.isPlaying) {
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    } else {
      audioRef.current.play();
      setState(prev => ({ ...prev, isPlaying: true }));
    }
  }, [state.isPlaying]);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = state.isMuted ? 0 : volume;
    }
    setState(prev => ({ ...prev, volume }));
  }, [state.isMuted]);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.isMuted ? state.volume : 0;
    }
    setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  }, [state.isMuted, state.volume]);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState(prev => ({ ...prev, currentTime: time }));
    }
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return {
    ...state,
    playTrack,
    togglePlayPause,
    setVolume,
    toggleMute,
    seekTo
  };
}
