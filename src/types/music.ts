import type { Dance } from '../lib/supabase';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  albumCover: string;
  created_at?: string;
  coverUrl: string;
  last_played?: string;
  times_played?: number;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  subtitle: string;
  cover: string;
  tracks: Song[];
  created_at: string;
}

export interface Artist {
  id: string;
  name: string;
}

export interface Playlist {
  id: string;
  name: string;
  songCount: number;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
} 