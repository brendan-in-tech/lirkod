import { useState, useEffect } from 'react';
import { supabase, Dance, insertTestDance } from '../lib/supabase';

interface UseSupabaseDances {
  dances: Dance[];
  choreographers: string[];
  performers: string[];
  shapes: string[];
  isLoading: boolean;
  error: string | null;
  language: 'en' | 'he';
  refetch: () => Promise<void>;
}

export function useSupabaseDances(lang: 'en' | 'he'): UseSupabaseDances {
  const [dances, setDances] = useState<Dance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDances = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Starting dance fetch...');
      
      // First, check if we can connect to Supabase
      const { error: testError } = await supabase
        .from('dances')
        .select('count', { count: 'exact' });

      if (testError) {
        console.error('Connection test failed:', testError);
        throw new Error(`Connection test failed: ${testError.message}`);
      }

      console.log('Connection test successful, fetching dances...');
      
      // Now fetch the actual dances with their relationships
      const { data, error: fetchError } = await supabase
        .from('dances')
        .select(`
          *,
          choreographer:choreographers_id(id, name_en, name_he, image_url),
          performer:performers_id(id, name_en, name_he, image_url),
          composer:composers_id(id, name_en, name_he, image_url),
          lyricist:lyricists_id(id, name_en, name_he, image_url)
        `);

      if (fetchError) {
        console.error('Failed to fetch dances:', fetchError);
        throw fetchError;
      }

      if (!data || data.length === 0) {
        console.log('No dances found, attempting to insert test data...');
        try {
          const testData = await insertTestDance();
          console.log('Test data inserted:', testData);
          setDances(testData || []);
        } catch (insertError) {
          console.error('Failed to insert test data:', insertError);
        }
      } else {
        // Transform the data to include creator names directly on the dance object
        const transformedDances = data.map(dance => ({
          ...dance,
          choreographer_name_en: dance.choreographer?.name_en,
          choreographer_name_he: dance.choreographer?.name_he,
          choreographer_image_url: dance.choreographer?.image_url,
          performer_name_en: dance.performer?.name_en,
          performer_name_he: dance.performer?.name_he,
          composer_name_en: dance.composer?.name_en,
          composer_name_he: dance.composer?.name_he,
          lyricist_name_en: dance.lyricist?.name_en,
          lyricist_name_he: dance.lyricist?.name_he
        }));
        
        console.log('Setting dances:', transformedDances.length);
        setDances(transformedDances);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error in fetchDances:', errorMessage);
      setError(errorMessage);
      setDances([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered, fetching dances...');
    fetchDances();
  }, []);

  const getUniqueCreators = (type: 'choreographer' | 'performer' | 'composer' | 'lyricist'): string[] => {
    if (!dances.length) {
      console.log(`No dances available for ${type}`);
      return [];
    }
    
    const nameField = lang === 'en' ? `${type}_name_en` : `${type}_name_he`;
    const values = dances
      .map(dance => dance[nameField as keyof Dance] as string)
      .filter(Boolean);
    
    return [...new Set(values)].sort();
  };

  const choreographers = getUniqueCreators('choreographer');
  const performers = getUniqueCreators('performer');
  const shapes = dances
    .map(dance => lang === 'en' ? dance.shapes_en : dance.shapes_he)
    .filter(Boolean);

  console.log('Hook state:', {
    dancesCount: dances.length,
    choreographersCount: choreographers.length,
    performersCount: performers.length,
    shapesCount: shapes.length,
    isLoading,
    hasError: !!error
  });

  return {
    dances,
    choreographers,
    performers,
    shapes: [...new Set(shapes)].sort(),
    isLoading,
    error,
    language: lang,
    refetch: fetchDances
  };
} 