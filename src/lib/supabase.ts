import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log('Environment variables status:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

console.log('Initializing Supabase with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Test the connection
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('dances')
      .select('count', { count: 'exact' });

    if (error) {
      console.error('Supabase connection test failed:', error);
    } else {
      console.log('Supabase connection successful, dance count:', data);
    }
  } catch (error: unknown) {
    console.error('Failed to test Supabase connection:', 
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

async function verifyDatabaseSchema() {
  try {
    // Check if tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('dances')
      .select('id')
      .limit(1);

    if (tablesError) {
      console.error('Table check failed:', tablesError);
      return false;
    }

    console.log('Database schema verification successful');
    return true;
  } catch (error) {
    console.error('Schema verification failed:', error);
    return false;
  }
}

async function createTables() {
  try {
    // Check if tables exist by trying to select from dances table
    const { error: checkError } = await supabase
      .from('dances')
      .select('id')
      .limit(1);

    if (checkError?.code === '42P01') {
      console.error('Tables do not exist. Please run the migrations first.');
      return false;
    }

    console.log('Tables exist');
    return true;
  } catch (error) {
    console.error('Failed to check tables:', error);
    return false;
  }
}

export async function insertDances() {
  try {
    // First, insert creators
    const { data: choreographer, error: choreographerError } = await supabase
      .from('choreographers')
      .insert({
        name_en: 'Cherf Chaim',
        name_he: 'צ׳רף חיים',
        image_url: 'https://placehold.co/400'
      })
      .select()
      .single();
    if (choreographerError) throw choreographerError;

    const { data: performers, error: performersError } = await supabase
      .from('performers')
      .insert({
        name_en: 'Margi Yehonatan, Kirel Noa',
        name_he: 'מרגי יהונתן, קירל נועה',
        image_url: 'https://placehold.co/400'
      })
      .select()
      .single();
    if (performersError) throw performersError;

    const { data: composers, error: composersError } = await supabase
      .from('composers')
      .insert({
        name_en: 'Margi Yehonatan, Kirel Noa',
        name_he: 'מרגי יהונתן, קירל נועה',
        image_url: 'https://placehold.co/400'
      })
      .select()
      .single();
    if (composersError) throw composersError;

    const { data: lyricists, error: lyricistsError } = await supabase
      .from('lyricists')
      .insert({
        name_en: 'Margi Yehonatan, Kirel Noa',
        name_he: 'מרגי יהונתן, קירל נועה',
        image_url: 'https://placehold.co/400'
      })
      .select()
      .single();
    if (lyricistsError) throw lyricistsError;

    // Then insert dances with creator references
    const { data: dances, error: dancesError } = await supabase
      .from('dances')
      .insert([
        {
          name_en: 'Zikaron Yashan',
          name_he: 'זיכרון ישן',
          audio_url: 'https://rokdim.co.il/assets/audios_full/1737186003571__5aee7152-0474-49de-acf0-4ef6eeafafb8.mp3',
          audio_short_url: 'https://rokdim.co.il/assets/audios_short/1737186003571__306a8225-96da-49a0-a977-c44769e9a978.mp3',
          year: '2023',
          choreographers_id: choreographer.id,
          performers_id: performers.id,
          composers_id: composers.id,
          lyricists_id: lyricists.id,
          shapes_en: 'Circle',
          shapes_he: 'מעגל',
          cover_url: 'https://placehold.co/400',
          duration: 180000
        },
        {
          name_en: 'Ahava Ktana',
          name_he: 'אהבה קטנה',
          audio_url: 'https://example.com/ahava-ktana.mp3',
          audio_short_url: 'https://example.com/ahava-ktana-short.mp3',
          year: '2024',
          choreographers_id: choreographer.id,
          performers_id: performers.id,
          composers_id: composers.id,
          lyricists_id: lyricists.id,
          shapes_en: 'Line',
          shapes_he: 'שורות',
          cover_url: 'https://placehold.co/400',
          duration: 240000
        }
      ])
      .select();

    if (dancesError) throw dancesError;

    console.log('Successfully inserted dances:', dances.map(d => d.name_en));
    return dances;
  } catch (error) {
    console.error('Error inserting dances:', error);
    throw error;
  }
}

// Update verifyDataLoad to use insertDances
export async function verifyDataLoad() {
  try {
    console.log('Verifying data in database...');
    const { data, error } = await supabase
      .from('dances')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching dances:', error);
      return false;
    }

    if (!data || data.length === 0) {
      console.log('No dances found, inserting dances...');
      await insertDances();
      return verifyDataLoad(); // Retry verification
    }

    console.log('Found dances:', data.map(dance => ({
      id: dance.id,
      name_en: dance.name_en,
      name_he: dance.name_he,
      created_at: dance.created_at
    })));

    return true;
  } catch (error) {
    console.error('Verification failed:', error);
    return false;
  }
}

// Update initialization to include verification
async function initializeDatabase() {
  const isValid = await verifyDatabaseSchema();
  if (!isValid) {
    console.log('Attempting to create tables...');
    const created = await createTables();
    if (created) {
      console.log('Database initialized successfully');
      await verifyDataLoad();
    } else {
      console.error('Failed to initialize database');
    }
  } else {
    await verifyDataLoad();
  }
}

// Initialize database
initializeDatabase();

// Database types
export interface Creator {
  id: string;
  name_en: string;
  name_he: string;
  image_url?: string;
  created_at: string;
}

export interface Dance {
  id: string;
  name_en: string;
  name_he: string;
  audio_url: string;
  audio_short_url?: string;
  year: string;
  // Choreographer
  choreographers_id: string;
  choreographer_name_en?: string;
  choreographer_name_he?: string;
  choreographer_image_url?: string;
  // Other creators
  performers_id: string;
  composers_id: string;
  lyricists_id: string;
  // Other fields
  shapes_en: string;
  shapes_he: string;
  cover_url?: string;
  duration: number;
  last_played?: string;
  times_played: number;
  created_at: string;
}

// Helper function to get creator name based on language
export function getCreatorName(dance: Dance, creatorType: 'choreographer', language: 'en' | 'he'): string {
  if (creatorType === 'choreographer') {
    return language === 'en' 
      ? dance.choreographer_name_en || ''  // Will be populated from join
      : dance.choreographer_name_he || ''; // Will be populated from join
  }
  return '';
}

// Helper function to get creator image
export function getCreatorImage(dance: Dance, creatorType: 'choreographer'): string | undefined {
  if (creatorType === 'choreographer') {
    return dance.choreographer_image_url;
  }
  return undefined;
}

export async function fetchDanceWithCreators(danceId: string) {
  const { data, error } = await supabase
    .from('dances')
    .select(`
      *,
      choreographer:choreographers_id(id, name_en, name_he, image_url),
      performer:performers_id(id, name_en, name_he, image_url),
      composer:composers_id(id, name_en, name_he, image_url),
      lyricist:lyricists_id(id, name_en, name_he, image_url)
    `)
    .eq('id', danceId)
    .single();

  if (error) throw error;

  // Map creator data to dance fields
  if (data) {
    data.choreographer_name_en = data.choreographer?.name_en;
    data.choreographer_name_he = data.choreographer?.name_he;
    data.choreographer_image_url = data.choreographer?.image_url;
  }

  return data;
}

export async function fetchAllDancesWithCreators() {
  const { data, error } = await supabase
    .from('dances')
    .select(`
      *,
      choreographer:choreographers_id(id, name_en, name_he, image_url),
      performer:performers_id(id, name_en, name_he, image_url),
      composer:composers_id(id, name_en, name_he, image_url),
      lyricist:lyricists_id(id, name_en, name_he, image_url)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Map creator data to dance fields
  return data?.map(dance => ({
    ...dance,
    choreographer_name_en: dance.choreographer?.name_en,
    choreographer_name_he: dance.choreographer?.name_he,
    choreographer_image_url: dance.choreographer?.image_url
  }));
}

export interface DanceCollection {
  id: string;
  title_en: string;
  title_he: string;
  description_en?: string;
  description_he?: string;
  cover_url?: string;
  created_at: string;
  dances: Dance[];
}

export interface Playlist {
  id: string;
  title_en: string;
  title_he: string;
  user_id: string;
  dances: Dance[];
  created_at: string;
}

export interface CollectionDance {
  collection_id: string;
  dance_id: string;
  created_at: string;
}

export interface PlaylistDance {
  playlist_id: string;
  dance_id: string;
  created_at: string;
}

export async function insertTestDance() {
  const { data, error } = await supabase
    .from('dances')
    .insert([
      {
        name_en: 'Zikaron Yashan',
        name_he: 'זיכרון ישן',
        audio_url: 'https://rokdim.co.il/assets/audios_full/1737186003571__5aee7152-0474-49de-acf0-4ef6eeafafb8.mp3',
        audio_short_url: 'https://rokdim.co.il/assets/audios_short/1737186003571__306a8225-96da-49a0-a977-c44769e9a978.mp3',
        year: '2023',
        choreographers_en: 'Cherf Chaim',
        choreographers_he: 'צ׳רף חיים',
        performers_en: 'Margi Yehonatan, Kirel Noa',
        performers_he: 'מרגי יהונתן, קירל נועה',
        composers_en: 'Margi Yehonatan, Kirel Noa',
        composers_he: 'מרגי יהונתן, קירל נועה',
        lyricists_en: 'Margi Yehonatan, Kirel Noa',
        lyricists_he: 'מרגי יהונתן, קירל נועה',
        shapes_en: 'Circle',
        shapes_he: 'מעגל',
        cover_url: 'https://placehold.co/400',
        duration: 180000 // Will be updated with actual duration when audio loads
      }
    ])
    .select();

  if (error) {
    console.error('Error inserting test dance:', error);
    throw error;
  }

  return data;
}
