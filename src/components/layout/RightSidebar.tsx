import React from 'react';
import { View, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import type { Notification, Artist, Song } from '../../types/music';
import { NowPlaying } from '../player/NowPlaying';

const Container = styled.View`
  width: 320px;
  background-color: white;
  padding: 24px;
`;

const MainContent = styled.ScrollView`
  margin-bottom: 24px;
`;

const Section = styled.View`
  margin-bottom: 32px;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;

const SeeAllButton = styled.TouchableOpacity``;

const SeeAllText = styled.Text`
  font-size: 14px;
  color: #6B7280;
`;

const NotificationItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const NotificationContent = styled.View`
  flex: 1;
  margin-right: 16px;
`;

const NotificationTitle = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
`;

const NotificationDescription = styled.Text`
  font-size: 12px;
  color: #6B7280;
`;

const TimeAgo = styled.Text`
  font-size: 12px;
  color: #6B7280;
`;

const ArtistGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 -4px;
`;

const ArtistItem = styled.TouchableOpacity`
  width: 33.33%;
  padding: 4px;
`;

const ArtistImage = styled.Image`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  background-color: #E5E7EB;
`;

interface Props {
  notifications: Notification[];
  topArtists: Artist[];
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (position: number) => void;
  onVolumeChange: (volume: number) => void;
  onArtistPress: (artist: Artist) => void;
  onToggleVersion: () => void;
  isShortVersion: boolean;
  formatTime: (milliseconds: number) => string;
  duration: number;
}

export function RightSidebar({
  notifications,
  topArtists,
  currentSong,
  isPlaying,
  progress,
  volume,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onArtistPress,
  onToggleVersion,
  isShortVersion,
  formatTime,
  duration,
}: Props) {
  return (
    <Container>
      <MainContent showsVerticalScrollIndicator={false}>
        <Section>
          <SectionHeader>
            <SectionTitle>Notifications</SectionTitle>
          </SectionHeader>
          {notifications.map((notification) => (
            <NotificationItem key={notification.id}>
              <NotificationContent>
                <NotificationTitle>{notification.title}</NotificationTitle>
                <NotificationDescription>
                  {notification.description}
                </NotificationDescription>
              </NotificationContent>
              <TimeAgo>{notification.timeAgo}</TimeAgo>
            </NotificationItem>
          ))}
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>Top Artists</SectionTitle>
            <SeeAllButton>
              <SeeAllText>See all</SeeAllText>
            </SeeAllButton>
          </SectionHeader>
          <ArtistGrid>
            {topArtists.map((artist) => (
              <ArtistItem
                key={artist.id}
                onPress={() => onArtistPress(artist)}
              >
                <ArtistImage source={{ uri: artist.image }} resizeMode="contain" />
              </ArtistItem>
            ))}
          </ArtistGrid>
        </Section>
      </MainContent>

      {currentSong && (
        <NowPlaying
          song={currentSong}
          isPlaying={isPlaying}
          progress={progress}
          volume={volume}
          onPlayPause={onPlayPause}
          onNext={onNext}
          onPrevious={onPrevious}
          onSeek={onSeek}
          onVolumeChange={onVolumeChange}
          onToggleVersion={onToggleVersion}
          isShortVersion={isShortVersion}
          formatTime={formatTime}
          duration={duration}
        />
      )}
    </Container>
  );
} 