import React, { useState } from 'react';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { SearchResults } from './SearchResults';
import { useDanceStore } from '../../store/musicStore';
import { convertDanceToSong } from '../../utils/songUtils';
import type { Song } from '../../types/music';

interface ContainerProps {
  $isRTL: boolean;
}

const Container = styled.View<ContainerProps>`
  flex: 1;
  background-color: #f9fafb;
  direction: ${(props: ContainerProps) => props.$isRTL ? 'rtl' : 'ltr'};
`;

const SearchContainer = styled.View<ContainerProps>`
  flex-direction: ${(props: ContainerProps) => props.$isRTL ? 'row-reverse' : 'row'};
  align-items: center;
  padding: 12px 16px;
  background-color: white;
  border-radius: 8px;
  margin: 16px;
  border: 1px solid #e5e7eb;
`;

const SearchInput = styled.TextInput<ContainerProps>`
  flex: 1;
  font-size: 16px;
  color: #111827;
  text-align: ${(props: ContainerProps) => props.$isRTL ? 'right' : 'left'};
  margin: ${(props: ContainerProps) => props.$isRTL ? '0 0 0 12px' : '0 12px 0 0'};
`;

const SearchIcon = styled(MaterialIcons)`
  color: #6b7280;
`;

const ScrollView = styled.ScrollView`
  flex: 1;
`;

const ContentContainer = styled.View`
  flex: 1;
`;

export function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const { dances, language, playDance, isShortVersion } = useDanceStore();
  const isRTL = language === 'he';

  const filteredSongs = dances
    .filter(dance => {
      if (!searchQuery) return false;
      const query = searchQuery.toLowerCase();
      const searchableFields = [
        dance.name_en,
        dance.name_he,
        dance.choreographer_name_en || '',
        dance.choreographer_name_he || '',
      ];
      return searchableFields.some(field => field.toLowerCase().includes(query));
    })
    .map(dance => convertDanceToSong(dance, language));

  const handleSongSelect = (song: Song) => {
    const dance = dances.find(d => d.id === song.id);
    if (dance) {
      playDance(dance, isShortVersion);
    }
  };

  return (
    <Container $isRTL={isRTL}>
      <SearchContainer $isRTL={isRTL}>
        <SearchIcon name="search" size={24} />
        <SearchInput
          $isRTL={isRTL}
          placeholder={isRTL ? 'חפש שירים, כוריאוגרפים...' : 'Search songs, choreographers...'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
          autoFocus
        />
      </SearchContainer>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ContentContainer>
          {searchQuery && (
            <SearchResults
              songs={filteredSongs}
              language={language}
              onSongSelect={handleSongSelect}
              title={isRTL ? 'תוצאות חיפוש' : 'Search Results'}
            />
          )}
        </ContentContainer>
      </ScrollView>
    </Container>
  );
} 