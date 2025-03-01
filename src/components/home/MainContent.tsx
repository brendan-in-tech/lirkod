import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import type { Album, Song } from '../../types/music';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { SearchResults } from '../search/SearchResults';

interface ContainerProps {
  $isRTL: boolean;
}

interface SongItemProps {
  $isRTL: boolean;
}

const Container = styled.View<ContainerProps>`
  flex: 1;
  background-color: #f9fafb;
  direction: ${(props: ContainerProps) => props.$isRTL ? 'rtl' : 'ltr'};
`;

const ScrollContainer = styled.ScrollView`
  flex: 1;
`;

const ContentContainer = styled.View`
  flex: 1;
  padding-bottom: 24px;
`;

const Section = styled.View`
  margin-bottom: 32px;
`;

const SectionHeader = styled.View<ContainerProps>`
  flex-direction: ${(props: ContainerProps) => props.$isRTL ? 'row-reverse' : 'row'};
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #111827;
`;

const AlbumGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 -8px;
`;

const AlbumItem = styled.TouchableOpacity`
  width: 33.33%;
  padding: 8px;
`;

const AlbumCover = styled.Image`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const AlbumInfo = styled.View<ContainerProps>`
  align-items: ${(props: ContainerProps) => props.$isRTL ? 'flex-end' : 'flex-start'};
`;

const AlbumTitle = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
`;

const AlbumArtist = styled.Text`
  font-size: 12px;
  color: #6b7280;
`;

const RecentlyPlayedList = styled.View``;

const SongItem = styled.TouchableOpacity<SongItemProps>`
  flex-direction: ${(props: SongItemProps) => props.$isRTL ? 'row-reverse' : 'row'};
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const SongCover = styled.Image<SongItemProps>`
  width: 48px;
  height: 48px;
  border-radius: 4px;
  margin: ${(props: SongItemProps) => props.$isRTL ? '0 0 0 12px' : '0 12px 0 0'};
`;

const SongInfo = styled.View<SongItemProps>`
  flex: 1;
  align-items: ${(props: SongItemProps) => props.$isRTL ? 'flex-end' : 'flex-start'};
`;

const SongTitle = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
`;

const SongArtist = styled.Text`
  font-size: 12px;
  color: #6b7280;
`;

const SongDuration = styled.Text<SongItemProps>`
  font-size: 12px;
  color: #6b7280;
  margin: ${(props: SongItemProps) => props.$isRTL ? '0 auto 0 0' : '0 0 0 auto'};
`;

interface MainContentProps {
  language: 'en' | 'he';
  recentlyPlayed: Song[];
  mostPlayed: Song[];
  onSongSelect: (song: Song) => void;
}

export function MainContent({ 
  language, 
  recentlyPlayed = [], 
  mostPlayed = [], 
  onSongSelect 
}: MainContentProps) {
  const isRTL = language === 'he';

  return (
    <Container $isRTL={isRTL}>
      <ScrollContainer showsVerticalScrollIndicator={false}>
        <ContentContainer>
          {recentlyPlayed?.length > 0 && (
            <SearchResults
              songs={recentlyPlayed}
              language={language}
              onSongSelect={onSongSelect}
              title={isRTL ? 'נוגן לאחרונה' : 'Recently Played'}
            />
          )}

          {mostPlayed?.length > 0 && (
            <SearchResults
              songs={mostPlayed}
              language={language}
              onSongSelect={onSongSelect}
              title={isRTL ? 'הכי מנוגן' : 'Most Played'}
            />
          )}
        </ContentContainer>
      </ScrollContainer>
    </Container>
  );
} 