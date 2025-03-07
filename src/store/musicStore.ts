import { create } from 'zustand';
import { Dance, DanceCollection, fetchAllDancesWithCreators, fetchDanceWithCreators, supabase, updatePlayStats } from '../lib/supabase';
import { musicPlayer } from '../services/musicPlayer';

interface DanceStore {
  // Library state
  dances: Dance[];
  collections: DanceCollection[];
  isLoading: boolean;
  error: string | null;
  language: 'en' | 'he';
  currentView: 'home' | 'search';

  // Player state
  currentDance: Dance | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  volume: number;
  isShortVersion: boolean;

  // Actions
  setLanguage: (language: 'en' | 'he') => void;
  setView: (view: 'home' | 'search') => void;
  fetchDances: () => Promise<void>;
  fetchCollections: () => Promise<void>;
  playDance: (dance: Dance, isShort?: boolean) => Promise<void>;
  pauseDance: () => Promise<void>;
  toggleVersion: () => void;
  seekTo: (position: number) => Promise<void>;
  setVolume: (volume: number) => void;
  toggleLanguage: () => void;
  formatDuration: (milliseconds: number) => string;
}

export const useDanceStore = create<DanceStore>((set, get) => ({
  // Initial state
  dances: [],
  collections: [],
  isLoading: false,
  error: null,
  language: 'en',
  currentView: 'home',
  currentDance: null,
  isPlaying: false,
  position: 0,
  duration: 0,
  volume: 1,
  isShortVersion: false,

  // Actions
  setLanguage: (language) => set({ language }),
  setView: (view) => set({ currentView: view }),

  fetchDances: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await fetchAllDancesWithCreators();
      set({ dances: data as Dance[], isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchCollections: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('dance_collections')
        .select('*, dances(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ collections: data as DanceCollection[], isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  playDance: async (dance: Dance, isShort = false) => {
    try {
      const audioUrl = isShort ? dance.audio_short_url : dance.audio_url;
      if (!audioUrl) {
        throw new Error(`No ${isShort ? 'short version' : 'audio'} URL available for this dance`);
      }

      await musicPlayer.loadTrack({
        id: dance.id,
        audio_url: audioUrl,
        duration: dance.duration_ms
      });
      await musicPlayer.play();

      // Update play statistics in real-time
      try {
        const updatedDance = await updatePlayStats(dance.id);
        if (updatedDance) {
          // Update the dance in the local state
          set(state => ({
            dances: state.dances.map(d => 
              d.id === dance.id 
                ? { ...d, last_played: updatedDance.last_played, times_played: updatedDance.times_played }
                : d
            ),
            currentDance: state.currentDance?.id === dance.id 
              ? { ...state.currentDance, last_played: updatedDance.last_played, times_played: updatedDance.times_played }
              : state.currentDance
          }));
        }
      } catch (statsError) {
        console.error('Failed to update play statistics:', statsError);
        // Continue playing even if stats update fails
      }

      set({ 
        currentDance: dance,
        isShortVersion: isShort,
        isPlaying: true 
      });
    } catch (error: unknown) {
      console.error('Error playing dance:', error);
      alert(`Failed to play dance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  toggleVersion: () => {
    const state = get();
    set({ isShortVersion: !state.isShortVersion });
    if (state.currentDance && state.isPlaying) {
      state.playDance(state.currentDance, !state.isShortVersion);
    }
  },

  pauseDance: async () => {
    await musicPlayer.pause();
    set({ isPlaying: false });
  },

  seekTo: async (position: number) => {
    await musicPlayer.seekTo(position);
  },

  setVolume: (volume: number) => {
    musicPlayer.setVolume(volume);
    set({ volume });
  },

  toggleLanguage: () => {
    set(state => ({ language: state.language === 'en' ? 'he' : 'en' }));
  },

  formatDuration: (milliseconds: number): string => {
    if (!milliseconds) return '0:00';
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}));

// Set up player status listener
musicPlayer.addListener((status) => {
  useDanceStore.setState({
    isPlaying: status.isPlaying,
    position: status.position,
    duration: status.duration
  });
}); 