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
      
      // Now fetch the actual dances
      const { data, error: fetchError } = await supabase
        .from('dances')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Failed to fetch dances:', fetchError);
        throw fetchError;
      }

      console.log('Fetch response:', { dataExists: !!data, length: data?.length || 0 });

      // If no dances found, try to insert test data
      if (!data || data.length === 0) {
        console.log('No dances found, attempting to insert test data...');
        try {
          const testData = await insertTestDance();
          console.log('Test data inserted:', testData);
          setDances(testData || []);
        } catch (insertError) {
          console.error('Failed to insert test data:', insertError);
          throw insertError;
        }
      } else {
        console.log('Setting dances:', data.length);
        setDances(data);
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

  const getUniqueValues = (field: string): string[] => {
    if (!dances.length) {
      console.log(`No dances available for field: ${field}`);
      return [];
    }
    const values = dances
      .map(dance => dance[field as keyof Dance] as string)
      .filter(Boolean)
      .flatMap(value => value.split(',').map(v => v.trim()))
      .filter(Boolean);
    
    return [...new Set(values)].sort();
  };

  const choreographers = getUniqueValues(lang === 'en' ? 'choreographers_en' : 'choreographers_he');
  const performers = getUniqueValues(lang === 'en' ? 'performers_en' : 'performers_he');
  const shapes = getUniqueValues(lang === 'en' ? 'shapes_en' : 'shapes_he');

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
    shapes,
    isLoading,
    error,
    language: lang,
    refetch: fetchDances
  };
} 