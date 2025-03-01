import { Track as SupabaseTrack, Album as SupabaseAlbum, Playlist as SupabasePlaylist } from '../lib/supabase';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  albumCover: string;
  created_at: string;
}

export interface Album extends Omit<SupabaseAlbum, 'cover_url'> {
  cover: string;
}

export interface Artist {
  id: string;
  name: string;
  image: string;
}

export interface Playlist {
  id: string;
  name: string;
  songCount: number;
  songs: Song[];
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
} 