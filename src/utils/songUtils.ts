import type { Dance } from '../lib/supabase';
import type { Song } from '../types/music';
import { getCreatorName } from '../lib/supabase';

export function convertDanceToSong(dance: Dance, language: 'en' | 'he'): Song {
  const shape = language === 'he' ? dance.shapes_he : dance.shapes_en;
  const coverImage = dance.cover_url || dance.choreographer_image_url || 'https://placehold.co/400x400/e5e7eb/a3a3a3?text=?';
  
  return {
    id: dance.id,
    title: language === 'he' ? dance.name_he : dance.name_en,
    artist: getCreatorName(dance, 'choreographer', language),
    album: shape || '',
    duration: formatDuration(dance.duration),
    albumCover: coverImage,
    coverUrl: coverImage,
    created_at: dance.created_at,
    last_played: dance.last_played,
    times_played: dance.times_played || 0
  };
}

function formatDuration(duration: number | undefined): string {
  if (!duration || isNaN(duration)) return '0:00';
  
  // Convert float duration (e.g., 2.32) to minutes and seconds
  const minutes = Math.floor(duration);
  const seconds = Math.round((duration % 1) * 100); // Get decimal part and convert to seconds
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
} 