import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';

export interface PlayerState {
  isPlaying: boolean;
  position: number;
  duration: number;
  volume: number;
}

export interface SimplifiedTrack {
  id: string;
  audio_url: string;
  duration: number;
}

export class MusicPlayerService {
  private sound: Sound | null = null;
  private currentTrack: SimplifiedTrack | null = null;
  private isPlaying = false;
  private volume = 1.0;
  private position = 0;
  private duration = 0;
  private listeners: Set<(state: PlayerState) => void> = new Set();

  async loadTrack(track: SimplifiedTrack): Promise<void> {
    try {
      if (!track.audio_url) {
        throw new Error('Audio URL is missing');
      }

      if (this.sound) {
        await this.sound.unloadAsync();
      }

      const { sound, status } = await Audio.Sound.createAsync(
        { uri: track.audio_url },
        { shouldPlay: false, volume: this.volume },
        this.onPlaybackStatusUpdate
      );

      if (!status.isLoaded) {
        throw new Error('Failed to load audio file');
      }

      this.sound = sound;
      this.currentTrack = track;
      this.position = 0;
      this.duration = status.durationMillis || track.duration;
      this.notifyListeners();
    } catch (error) {
      console.error('Error loading track:', error);
      throw error;
    }
  }

  private onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      this.isPlaying = status.isPlaying;
      this.position = status.positionMillis;
      this.duration = status.durationMillis || (this.currentTrack?.duration || 0);
      this.notifyListeners();
    } else if (status.error) {
      console.error('Playback error:', status.error);
      this.cleanup();
    }
  };

  async play(): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.playAsync();
        this.isPlaying = true;
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Error playing track:', error);
      throw error;
    }
  }

  async pause(): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.pauseAsync();
        this.isPlaying = false;
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Error pausing track:', error);
      throw error;
    }
  }

  async seekTo(position: number): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.setPositionAsync(position);
        this.position = position;
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Error seeking track:', error);
      throw error;
    }
  }

  async setVolume(volume: number): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.setVolumeAsync(volume);
        this.volume = volume;
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Error setting volume:', error);
      throw error;
    }
  }

  addListener(listener: (state: PlayerState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach(listener => listener(state));
  }

  private getState(): PlayerState {
    return {
      isPlaying: this.isPlaying,
      position: this.position,
      duration: this.duration,
      volume: this.volume,
    };
  }

  async cleanup(): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
        this.currentTrack = null;
        this.position = 0;
        this.duration = 0;
        this.isPlaying = false;
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Error cleaning up player:', error);
    }
  }
}

// Create a single instance to be used throughout the app
export const musicPlayer = new MusicPlayerService(); 