import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import type { Album, Song } from '../../types/music';

const Container = styled.View`
  flex: 1;
  padding: 24px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
`;

const AlbumGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 -8px;
  margin-bottom: 32px;
`;

const AlbumCard = styled.TouchableOpacity`
  width: 25%;
  padding: 8px;
`;

const AlbumContent = styled.View`
  background-color: white;
  padding: 16px;
  border-radius: 8px;
`;

const AlbumCover = styled.Image`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const AlbumTitle = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
`;

const ChoreographerText = styled.Text`
  font-size: 12px;
  color: #4b5563;
  margin-bottom: 2px;
`;

const SubtitleText = styled.Text`
  font-size: 12px;
  color: #6b7280;
`;

const RecentlyPlayedList = styled.View`
  margin-top: 24px;
`;

const SongItem = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const SongInfo = styled.View`
  flex: 1;
  margin-right: 16px;
`;

const SongTitle = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
`;

const SongChoreographer = styled.Text`
  font-size: 12px;
  color: #4b5563;
  margin-bottom: 2px;
`;

const SongDetails = styled.Text`
  font-size: 12px;
  color: #6b7280;
`;

const Duration = styled.Text`
  font-size: 12px;
  color: #6b7280;
`;

interface Props {
  topAlbums: Album[];
  recentlyPlayed: Song[];
  onAlbumPress: (album: Album) => void;
  onSongPress: (song: Song) => void;
}

export function MainContent({
  topAlbums,
  recentlyPlayed,
  onAlbumPress,
  onSongPress,
}: Props) {
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SectionTitle>All Dances</SectionTitle>
        <AlbumGrid>
          {topAlbums.map((album) => (
            <AlbumCard key={album.id} onPress={() => onAlbumPress(album)}>
              <AlbumContent>
                <AlbumCover source={{ uri: album.cover }} />
                <AlbumTitle numberOfLines={1}>{album.title}</AlbumTitle>
                <ChoreographerText numberOfLines={1}>{album.artist}</ChoreographerText>
                <SubtitleText numberOfLines={1}>{album.subtitle}</SubtitleText>
              </AlbumContent>
            </AlbumCard>
          ))}
        </AlbumGrid>

        <SectionTitle>Recently Added</SectionTitle>
        <RecentlyPlayedList>
          {recentlyPlayed.map((song) => (
            <SongItem key={song.id} onPress={() => onSongPress(song)}>
              <SongInfo>
                <SongTitle numberOfLines={1}>{song.title}</SongTitle>
                <SongChoreographer numberOfLines={1}>{song.artist}</SongChoreographer>
                <SongDetails numberOfLines={1}>{song.album}</SongDetails>
              </SongInfo>
              <Duration>{song.duration}</Duration>
            </SongItem>
          ))}
        </RecentlyPlayedList>
      </ScrollView>
    </Container>
  );
} 