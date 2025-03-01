import { Dance } from '../lib/supabase';

// Define shape types
export type DanceShape = 'circle' | 'line' | 'partner' | 'other';

// Color themes for different shapes
interface ShapeTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

// Color palette for each shape type
export const shapeThemes: Record<DanceShape, ShapeTheme> = {
  circle: {
    primary: '#FF6B6B',    // Warm red
    secondary: '#FFE66D',  // Soft yellow
    accent: '#4ECDC4',     // Turquoise
    background: '#FFE5E5'  // Light pink
  },
  line: {
    primary: '#6B88FF',    // Royal blue
    secondary: '#A5D8FF',  // Light blue
    accent: '#FFD93D',     // Gold
    background: '#E5F0FF'  // Very light blue
  },
  partner: {
    primary: '#4CAF50',    // Green
    secondary: '#98FB98',  // Pale green
    accent: '#FF7043',     // Coral
    background: '#E8F5E9'  // Light mint
  },
  other: {
    primary: '#9C27B0',    // Purple
    secondary: '#E1BEE7',  // Light purple
    accent: '#FFC107',     // Amber
    background: '#F3E5F5'  // Light lavender
  }
};

// Function to normalize shape names
export function normalizeShape(shape: string): DanceShape {
  const normalized = shape.toLowerCase().trim();
  
  if (normalized.includes('circle') || normalized.includes('מעגל')) {
    return 'circle';
  }
  if (normalized.includes('line') || normalized.includes('row') || normalized.includes('שורות')) {
    return 'line';
  }
  if (normalized.includes('partner') || normalized.includes('couple') || normalized.includes('זוגות')) {
    return 'partner';
  }
  
  return 'other';
}

// Function to get theme for a dance
export function getDanceTheme(dance: Dance, language: 'en' | 'he' = 'en'): ShapeTheme {
  const shape = language === 'en' ? dance.shapes_en : dance.shapes_he;
  return shapeThemes[normalizeShape(shape)];
}

// Function to get background style with opacity
export function getShapeBackgroundStyle(dance: Dance, language: 'en' | 'he' = 'en', opacity: number = 0.1): string {
  const theme = getDanceTheme(dance, language);
  return `${theme.background}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
}

// Function to get gradient style
export function getShapeGradientStyle(dance: Dance, language: 'en' | 'he' = 'en'): string {
  const theme = getDanceTheme(dance, language);
  return `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`;
} 