import React, { useState } from 'react';
import { View, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import type { Song } from '../../types/music';
import Slider from '@react-native-community/slider';

const Container = styled.View`
  padding: 16px;
  background-color: #fff;
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

const PlayButton = styled.TouchableOpacity`
  padding: 8px;
  margin: 0 16px;
  background-color: #3b82f6;
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
}

const VersionToggle = styled.TouchableOpacity<VersionToggleProps>`
  padding: 8px 16px;
  background-color: ${props => props.$isActive ? '#3b82f6' : '#f3f4f6'};
  border-radius: 20px;
  margin: 0 8px;
`;

const VersionText = styled.Text<VersionToggleProps>`
  font-size: 14px;
  color: ${props => props.$isActive ? '#ffffff' : '#4b5563'};
  text-align: center;
`;

interface Props {
  song: Song | null;
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
}

export function NowPlaying({
  song,
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
}: Props) {
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const previousVolume = React.useRef(volume);

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
    <Container>
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
          minimumTrackTintColor="#3b82f6"
          maximumTrackTintColor="#e5e7eb"
          thumbTintColor="#3b82f6"
        />
        <TimeContainer>
          <TimeText>{formatTime(progress * duration)}</TimeText>
          <TimeText>{formatTime(duration)}</TimeText>
        </TimeContainer>
      </ProgressContainer>

      <Controls>
        <ControlButton onPress={onPrevious}>
          <MaterialIcons name="skip-previous" size={32} color="#4b5563" />
        </ControlButton>
        <PlayButton onPress={onPlayPause}>
          <MaterialIcons 
            name={isPlaying ? "pause" : "play-arrow"} 
            size={32} 
            color="#ffffff" 
          />
        </PlayButton>
        <ControlButton onPress={onNext}>
          <MaterialIcons name="skip-next" size={32} color="#4b5563" />
        </ControlButton>
      </Controls>

      <VolumeContainer>
        <VolumeButton onPress={handleVolumePress}>
          <MaterialIcons name={getVolumeIcon()} size={24} color="#4b5563" />
        </VolumeButton>
        <Slider
          style={{ flex: 1, marginHorizontal: 8 }}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={onVolumeChange}
          minimumTrackTintColor="#3b82f6"
          maximumTrackTintColor="#e5e7eb"
          thumbTintColor="#3b82f6"
        />
      </VolumeContainer>

      <AdditionalControls>
        <VersionToggle $isActive={!isShortVersion} onPress={onToggleVersion}>
          <VersionText $isActive={!isShortVersion}>Full</VersionText>
        </VersionToggle>
        <VersionToggle $isActive={isShortVersion} onPress={onToggleVersion}>
          <VersionText $isActive={isShortVersion}>Short</VersionText>
        </VersionToggle>
      </AdditionalControls>
    </Container>
  );
} 