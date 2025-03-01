import React from 'react';
import styled from 'styled-components/native';
import type { Song } from '../../types/music';
import { MaterialIcons } from '@expo/vector-icons';

interface ContainerProps {
  $isRTL: boolean;
}

interface StyledProps {
  $isRTL: boolean;
  $flex?: number;
}

const Container = styled.View<ContainerProps>`
  flex: 1;
  background-color: #f9fafb;
  direction: ${(props: ContainerProps) => props.$isRTL ? 'rtl' : 'ltr'};
  margin-bottom: 16px;
`;

const SectionHeader = styled.View<ContainerProps>`
  flex-direction: ${(props: ContainerProps) => props.$isRTL ? 'row-reverse' : 'row'};
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  margin-bottom: 4px;
  margin-top: 24px;

  &:first-child {
    margin-top: 16px;
  }
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;

const TableHeader = styled.View<ContainerProps>`
  flex-direction: ${(props: ContainerProps) => props.$isRTL ? 'row-reverse' : 'row'};
  padding: 6px 16px;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
  background-color: #ffffff;
`;

const HeaderCell = styled.View<StyledProps>`
  flex: ${(props: StyledProps) => props.$flex || 1};
  align-items: ${(props: StyledProps) => props.$isRTL ? 'flex-end' : 'flex-start'};
  padding: ${(props: StyledProps) => props.$isRTL ? '0 0 0 8px' : '0 8px 0 0'};
`;

const HeaderText = styled.Text`
  font-size: 11px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const Row = styled.TouchableOpacity<ContainerProps>`
  flex-direction: ${(props: ContainerProps) => props.$isRTL ? 'row-reverse' : 'row'};
  align-items: center;
  padding: 6px 16px;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #f3f4f6;

  &:hover {
    background-color: #f9fafb;
  }
`;

const Cell = styled.View<StyledProps>`
  flex: ${(props: StyledProps) => props.$flex || 1};
  flex-direction: ${(props: StyledProps) => props.$isRTL ? 'row-reverse' : 'row'};
  align-items: center;
  padding: ${(props: StyledProps) => props.$isRTL ? '0 0 0 8px' : '0 8px 0 0'};
`;

const CoverImage = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  margin: ${(props: ContainerProps) => props.$isRTL ? '0 0 0 8px' : '0 8px 0 0'};
`;

const TextContainer = styled.View`
  flex: 1;
  justify-content: center;
`;

const Title = styled.Text`
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 1px;
`;

const Artist = styled.Text`
  font-size: 11px;
  color: #6b7280;
`;

const Duration = styled.Text`
  font-size: 11px;
  color: #6b7280;
  text-align: ${(props: ContainerProps) => props.$isRTL ? 'left' : 'right'};
`;

const LastPlayed = styled.Text`
  font-size: 11px;
  color: #6b7280;
`;

const TimesPlayed = styled.Text`
  font-size: 11px;
  color: #6b7280;
  text-align: center;
`;

interface Props {
  songs: Song[];
  language: 'en' | 'he';
  onSongSelect: (song: Song) => void;
  title?: string;
}

function formatLastPlayed(date: string | undefined, language: 'en' | 'he'): string {
  if (!date) return language === 'he' ? 'לא נוגן' : 'Never played';
  
  const lastPlayed = new Date(date);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - lastPlayed.getTime()) / (1000 * 60));
  
  // If less than an hour ago
  if (diffInMinutes < 60) {
    return language === 'he' 
      ? `לפני ${diffInMinutes} דקות`
      : `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  // If less than 24 hours ago
  if (diffInHours < 24) {
    return language === 'he' 
      ? `לפני ${diffInHours} שעות`
      : `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  // If less than 7 days ago
  if (diffInDays < 7) {
    return language === 'he'
      ? `לפני ${diffInDays} ימים`
      : `${diffInDays}d ago`;
  }
  
  // For older dates, use localized date format
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return lastPlayed.toLocaleDateString(
    language === 'he' ? 'he-IL' : 'en-US',
    options
  );
}

export function SearchResults({ songs, language, onSongSelect, title }: Props) {
  const isRTL = language === 'he';

  return (
    <Container $isRTL={isRTL}>
      {title && (
        <SectionHeader $isRTL={isRTL}>
          <SectionTitle>{title}</SectionTitle>
        </SectionHeader>
      )}
      
      <TableHeader $isRTL={isRTL}>
        <HeaderCell $isRTL={isRTL} $flex={3}>
          <HeaderText>{isRTL ? 'שיר' : 'SONG'}</HeaderText>
        </HeaderCell>
        <HeaderCell $isRTL={isRTL} $flex={2}>
          <HeaderText>{isRTL ? 'כוריאוגרף' : 'CHOREOGRAPHER'}</HeaderText>
        </HeaderCell>
        <HeaderCell $isRTL={isRTL}>
          <HeaderText>{isRTL ? 'צורה' : 'SHAPE'}</HeaderText>
        </HeaderCell>
        <HeaderCell $isRTL={isRTL}>
          <HeaderText>{isRTL ? 'נוגן לאחרונה' : 'LAST PLAYED'}</HeaderText>
        </HeaderCell>
        <HeaderCell $isRTL={isRTL}>
          <HeaderText>{isRTL ? 'מספר ניגונים' : 'PLAYS'}</HeaderText>
        </HeaderCell>
        <HeaderCell $isRTL={isRTL}>
          <HeaderText>{isRTL ? 'משך' : 'DURATION'}</HeaderText>
        </HeaderCell>
      </TableHeader>

      {songs.map((song) => (
        <Row key={song.id} onPress={() => onSongSelect(song)} $isRTL={isRTL}>
          <Cell $isRTL={isRTL} $flex={3}>
            <CoverImage source={{ uri: song.albumCover }} $isRTL={isRTL} />
            <TextContainer>
              <Title>{song.title}</Title>
              <Artist>{song.artist}</Artist>
            </TextContainer>
          </Cell>
          <Cell $isRTL={isRTL} $flex={2}>
            <Title>{song.artist}</Title>
          </Cell>
          <Cell $isRTL={isRTL}>
            <Title>{song.album}</Title>
          </Cell>
          <Cell $isRTL={isRTL}>
            <LastPlayed>{formatLastPlayed(song.last_played, language)}</LastPlayed>
          </Cell>
          <Cell $isRTL={isRTL}>
            <TimesPlayed>{song.times_played || 0}</TimesPlayed>
          </Cell>
          <Cell $isRTL={isRTL}>
            <Duration $isRTL={isRTL}>{song.duration}</Duration>
          </Cell>
        </Row>
      ))}
    </Container>
  );
} 