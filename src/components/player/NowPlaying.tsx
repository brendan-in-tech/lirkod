import React, { useState } from 'react';
import { View, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import type { Song } from '../../types/music';
import Slider from '@react-native-community/slider';
import { getDanceTheme } from '../../utils/shapeUtils';
import { Dance } from '../../lib/supabase';

interface ThemeProps {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

interface ContainerProps {
  $theme: ThemeProps;
}

const Container = styled.View<ContainerProps>`
  padding: 16px;
  background-color: ${(props: ContainerProps) => props.$theme.background};
  border-radius: 12px;
  margin-bottom: 16px;
`;

const SongInfo = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const CoverImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 8px;
`;

const TextContainer = styled.View`
  margin-left: 12px;
  flex: 1;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
`;

const Artist = styled.Text`
  font-size: 14px;
  color: #4b5563;
  margin-top: 4px;
`;

const Controls = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
`;

const ControlButton = styled.TouchableOpacity`
  padding: 8px;
`;

interface PlayButtonProps {
  $theme: ThemeProps;
}

const PlayButton = styled.TouchableOpacity<PlayButtonProps>`
  padding: 8px;
  margin: 0 16px;
  background-color: ${(props: PlayButtonProps) => props.$theme.primary};
  border-radius: 24px;
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
`;

const ProgressContainer = styled.View`
  margin-bottom: 8px;
`;

const TimeContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 4px;
`;

const TimeText = styled.Text`
  font-size: 12px;
  color: #6b7280;
`;

const VolumeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
  padding: 0 8px;
`;

const VolumeButton = styled.TouchableOpacity`
  padding: 4px;
`;

const AdditionalControls = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
`;

interface VersionToggleProps {
  $isActive: boolean;
  $theme: ThemeProps;
}

const VersionToggle = styled.TouchableOpacity<VersionToggleProps>`
  padding: 8px 16px;
  background-color: ${(props: VersionToggleProps) => props.$isActive ? props.$theme.primary : '#f3f4f6'};
  border-radius: 20px;
  margin: 0 8px;
`;

const VersionText = styled.Text<VersionToggleProps>`
  font-size: 14px;
  color: ${(props: VersionToggleProps) => props.$isActive ? '#ffffff' : props.$theme.primary};
  text-align: center;
`;

interface Props {
  song: Song | null;
  dance: Dance | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (position: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleVersion: () => void;
  isShortVersion: boolean;
  formatTime: (milliseconds: number) => string;
  duration: number;
  language: 'en' | 'he';
}

export function NowPlaying({
  song,
  dance,
  isPlaying,
  progress,
  volume,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleVersion,
  isShortVersion,
  formatTime,
  duration,
  language,
}: Props) {
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const previousVolume = React.useRef(volume);

  const theme = dance ? getDanceTheme(dance, language) : {
    primary: '#3b82f6',
    secondary: '#60a5fa',
    accent: '#2563eb',
    background: '#ffffff'
  };

  const handleVolumePress = () => {
    if (isMuted) {
      onVolumeChange(previousVolume.current);
    } else {
      previousVolume.current = volume;
      onVolumeChange(0);
    }
    setIsMuted(!isMuted);
  };

  const getVolumeIcon = () => {
    if (volume === 0 || isMuted) return 'volume-off';
    if (volume < 0.3) return 'volume-mute';
    if (volume < 0.7) return 'volume-down';
    return 'volume-up';
  };

  if (!song) return null;

  return (
    <Container $theme={theme}>
      <SongInfo>
        <CoverImage source={{ uri: song.albumCover }} />
        <TextContainer>
          <Title>{song.title}</Title>
          <Artist>{song.artist}</Artist>
        </TextContainer>
      </SongInfo>

      <ProgressContainer>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={1}
          value={isSeeking ? seekValue : progress}
          onValueChange={(value: number) => {
            setIsSeeking(true);
            setSeekValue(value);
          }}
          onSlidingComplete={(value: number) => {
            setIsSeeking(false);
            onSeek(value * duration);
          }}
          minimumTrackTintColor={theme.primary}
          maximumTrackTintColor="#e5e7eb"
          thumbTintColor={theme.accent}
        />
        <TimeContainer>
          <TimeText>{formatTime(progress * duration)}</TimeText>
          <TimeText>{formatTime(duration)}</TimeText>
        </TimeContainer>
      </ProgressContainer>

      <Controls>
        <ControlButton onPress={onPrevious}>
          <MaterialIcons name="skip-previous" size={32} color={theme.primary} />
        </ControlButton>
        <PlayButton onPress={onPlayPause} $theme={theme}>
          <MaterialIcons 
            name={isPlaying ? "pause" : "play-arrow"} 
            size={32} 
            color="#ffffff" 
          />
        </PlayButton>
        <ControlButton onPress={onNext}>
          <MaterialIcons name="skip-next" size={32} color={theme.primary} />
        </ControlButton>
      </Controls>

      <VolumeContainer>
        <VolumeButton onPress={handleVolumePress}>
          <MaterialIcons name={getVolumeIcon()} size={24} color={theme.primary} />
        </VolumeButton>
        <Slider
          style={{ flex: 1, marginHorizontal: 8 }}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={onVolumeChange}
          minimumTrackTintColor={theme.primary}
          maximumTrackTintColor="#e5e7eb"
          thumbTintColor={theme.accent}
        />
      </VolumeContainer>

      <AdditionalControls>
        <VersionToggle $isActive={!isShortVersion} onPress={onToggleVersion} $theme={theme}>
          <VersionText $isActive={!isShortVersion} $theme={theme}>Full</VersionText>
        </VersionToggle>
        <VersionToggle $isActive={isShortVersion} onPress={onToggleVersion} $theme={theme}>
          <VersionText $isActive={isShortVersion} $theme={theme}>Short</VersionText>
        </VersionToggle>
      </AdditionalControls>
    </Container>
  );
} 