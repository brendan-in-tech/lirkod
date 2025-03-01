import React, { useEffect } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sidebar } from './Sidebar';
import { MainContent } from '../home/MainContent';
import { RightSidebar } from './RightSidebar';
import { Search } from '../search/Search';
import { useDanceStore } from '../../store/musicStore';
import type { Album as UIAlbum, Song as UISong, Artist } from '../../types/music';
import type { Dance } from '../../lib/supabase';
import { getCreatorName, getCreatorImage } from '../../lib/supabase';

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #f9fafb;
`;

const Content = styled.View`
  flex: 1;
  flex-direction: row;
`;

function convertDanceToSong(dance: Dance, language: 'en' | 'he' = 'en'): UISong {
  const coverImage = dance.cover_url || dance.choreographer_image_url || 'https://placehold.co/100x100';
  return {
    id: dance.id,
    title: language === 'en' ? dance.name_en : dance.name_he,
    artist: getCreatorName(dance, 'choreographer', language),
    album: `${dance.year || ''} • ${language === 'en' ? dance.shapes_en : dance.shapes_he}`,
    duration: formatDuration(dance.duration || 0),
    albumCover: coverImage,
    coverUrl: coverImage,
    created_at: dance.created_at,
    last_played: dance.last_played,
    times_played: dance.times_played || 0
  };
}

function convertDanceToAlbum(dance: Dance, language: 'en' | 'he' = 'en'): UIAlbum {
  return {
    id: dance.id,
    title: language === 'en' ? dance.name_en : dance.name_he,
    artist: getCreatorName(dance, 'choreographer', language),
    subtitle: `${dance.year} • ${language === 'en' ? dance.shapes_en : dance.shapes_he}`,
    cover: dance.cover_url || dance.choreographer_image_url || 'https://placehold.co/100x100',
    tracks: [],
    created_at: dance.created_at,
  };
}

function formatDuration(duration: number): string {
  if (!duration || isNaN(duration)) return '0:00';
  
  // Convert float duration (e.g., 2.32) to minutes and seconds
  const minutes = Math.floor(duration);
  const seconds = Math.round((duration % 1) * 100); // Get decimal part and convert to seconds
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function MainLayout() {
  const {
    dances,
    collections,
    currentDance,
    isPlaying,
    position,
    duration,
    volume,
    language,
    isShortVersion,
    currentView,
    fetchDances,
    fetchCollections,
    playDance,
    pauseDance,
    seekTo,
    setVolume,
    toggleLanguage,
    toggleVersion,
    formatDuration,
  } = useDanceStore();

  useEffect(() => {
    async function initializeData() {
      try {
        await fetchDances();
        await fetchCollections();
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    }

    initializeData();
  }, []);

  const handleAlbumPress = (album: UIAlbum) => {
    const dance = dances.find(d => d.id === album.id);
    if (dance) {
      playDance(dance, isShortVersion);
    }
  };

  const handleSongPress = (song: UISong) => {
    const dance = dances.find(d => d.id === song.id);
    if (dance) {
      playDance(dance, isShortVersion);
    }
  };

  const handleArtistPress = (artist: Artist) => {
    const artistDances = dances.filter(dance => 
      getCreatorName(dance, 'choreographer', language) === artist.name
    );
    if (artistDances.length > 0) {
      playDance(artistDances[0], isShortVersion);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseDance();
    } else if (currentDance) {
      playDance(currentDance, isShortVersion);
    }
  };

  const handleNext = () => {
    if (!currentDance) return;
    
    const currentIndex = dances.findIndex(d => d.id === currentDance.id);
    if (currentIndex < dances.length - 1) {
      playDance(dances[currentIndex + 1], isShortVersion);
    }
  };

  const handlePrevious = () => {
    if (!currentDance) return;
    
    const currentIndex = dances.findIndex(d => d.id === currentDance.id);
    if (currentIndex > 0) {
      playDance(dances[currentIndex - 1], isShortVersion);
    }
  };

  return (
    <Container>
      <Content>
        <Sidebar onLanguageToggle={toggleLanguage} language={language} />
        {currentView === 'search' ? (
          <Search />
        ) : (
          <MainContent
            language={language}
            recentlyPlayed={[...dances]
              .filter(d => d.last_played)
              .sort((a, b) => {
                const dateA = a.last_played ? new Date(a.last_played).getTime() : 0;
                const dateB = b.last_played ? new Date(b.last_played).getTime() : 0;
                return dateB - dateA;
              })
              .slice(0, 5)
              .map(d => convertDanceToSong(d, language))
            }
            mostPlayed={[...dances]
              .filter(d => d.times_played && d.times_played > 0)
              .sort((a, b) => (b.times_played || 0) - (a.times_played || 0))
              .slice(0, 5)
              .map(d => convertDanceToSong(d, language))
            }
            onSongSelect={handleSongPress}
          />
        )}
        <RightSidebar
          notifications={[]}
          topArtists={dances
            .map(dance => ({
              id: dance.choreographers_id,
              name: getCreatorName(dance, 'choreographer', language),
              image: getCreatorImage(dance, 'choreographer') || 'https://placehold.co/100x100'
            }))
            .filter((artist, index, self) => 
              index === self.findIndex(a => a.id === artist.id)
            )
          }
          onArtistPress={handleArtistPress}
          currentSong={currentDance ? {
            ...convertDanceToSong(currentDance, language),
            duration: formatDuration(duration)
          } : null}
          dance={currentDance}
          language={language}
          isPlaying={isPlaying}
          progress={duration > 0 ? position / duration : 0}
          volume={volume}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSeek={seekTo}
          onVolumeChange={setVolume}
          onToggleVersion={toggleVersion}
          isShortVersion={isShortVersion}
          formatTime={formatDuration}
          duration={duration}
        />
      </Content>
    </Container>
  );
} 