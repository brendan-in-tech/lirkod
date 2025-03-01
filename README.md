# Lirkod (לרקוד) - Israeli Folk Dance App

A modern, bilingual (English/Hebrew) mobile application for Israeli folk dance enthusiasts. Built with React Native, Expo, and Supabase.

## Features

- 🎵 Full and short versions of dance music
- 🔄 Seamless English/Hebrew language switching
- 🎼 Advanced music player with playback controls
- 🔍 Smart search across dances and choreographers
- 📊 Track play history and most played dances
- 👥 Comprehensive dance information including:
  - Choreographers
  - Dance formations
  - Year of creation
  - Play statistics

## Tech Stack

- **Frontend**: React Native + Expo
- **State Management**: Zustand
- **Styling**: styled-components/native
- **Backend**: Supabase
- **Language**: TypeScript
- **Navigation**: React Navigation

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- Supabase account

### Environment Setup

1. Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/lirkod.git
cd lirkod
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npx expo start
```

## Database Schema

### Main Tables

- `dances`: Core dance information
- `choreographers`: Choreographer details
- `performers`: Performer information
- `composers`: Music composer details
- `lyricists`: Lyrics writer information

### Dance Schema
```typescript
interface Dance {
  id: string;
  name_en: string;
  name_he: string;
  choreographers_id: string;
  year?: string;
  shapes_en?: string;
  shapes_he?: string;
  duration: number;        // Format: 3.45 = 3 minutes 45 seconds
  audio_url: string;
  audio_short_url?: string;
  cover_url?: string;
  last_played?: string;
  times_played?: number;
}
```

## Project Structure

```
src/
├── components/
│   ├── common/         # Shared components
│   ├── home/          # Home screen components
│   ├── layout/        # Layout components
│   ├── player/        # Music player components
│   └── search/        # Search components
├── hooks/             # Custom React hooks
├── lib/              # Library configurations
├── navigation/       # Navigation setup
├── services/         # External services
├── store/           # State management
├── types/           # TypeScript types
└── utils/           # Utility functions
```

## Key Features

### Bilingual Support
- Full Hebrew (RTL) and English (LTR) support
- Seamless language switching
- Proper RTL layout handling

### Music Player
- Play/pause controls
- Next/previous track
- Volume control
- Progress tracking
- Short/full version toggle

### Search and Discovery
- Search by dance name
- Filter by choreographer
- Sort by recently played
- Sort by most played
- Dance shape categorization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Israeli Folk Dance community
- All choreographers and performers
- Supabase team for the excellent backend service
- React Native and Expo teams 