-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables in reverse order of dependencies
DROP TABLE IF EXISTS collection_dances;
DROP TABLE IF EXISTS dance_collections;
DROP TABLE IF EXISTS dances;
DROP TABLE IF EXISTS choreographers;
DROP TABLE IF EXISTS performers;
DROP TABLE IF EXISTS composers;
DROP TABLE IF EXISTS lyricists;

-- Create choreographers table
CREATE TABLE choreographers (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_en text NOT NULL,
  name_he text NOT NULL,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create performers table
CREATE TABLE performers (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_en text NOT NULL,
  name_he text NOT NULL,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create composers table
CREATE TABLE composers (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_en text NOT NULL,
  name_he text NOT NULL,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create lyricists table
CREATE TABLE lyricists (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_en text NOT NULL,
  name_he text NOT NULL,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create dances table
CREATE TABLE dances (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_en text NOT NULL,
  name_he text NOT NULL,
  audio_url text NOT NULL,
  audio_short_url text,
  year text NOT NULL,
  choreographers_id uuid REFERENCES choreographers(id) ON DELETE CASCADE NOT NULL,
  choreographer_name_en text,
  choreographer_name_he text,
  choreographer_image_url text,
  performers_id uuid REFERENCES performers(id) ON DELETE CASCADE NOT NULL,
  composers_id uuid REFERENCES composers(id) ON DELETE CASCADE NOT NULL,
  lyricists_id uuid REFERENCES lyricists(id) ON DELETE CASCADE NOT NULL,
  shapes_en text NOT NULL,
  shapes_he text NOT NULL,
  cover_url text,
  duration integer NOT NULL DEFAULT 0,
  last_played timestamp with time zone DEFAULT timezone('utc'::text, now()),
  times_played integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create collections tables
CREATE TABLE dance_collections (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_en text NOT NULL,
  title_he text NOT NULL,
  description_en text,
  description_he text,
  cover_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE collection_dances (
  collection_id uuid REFERENCES dance_collections(id) ON DELETE CASCADE,
  dance_id uuid REFERENCES dances(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (collection_id, dance_id)
);

-- Insert test data
-- First insert the creators
WITH choreographer_insert AS (
  INSERT INTO choreographers (name_en, name_he, image_url)
  VALUES ('Cherf Chaim', 'צ''רף חיים', 'https://placehold.co/400')
  RETURNING id
),
performers_insert AS (
  INSERT INTO performers (name_en, name_he, image_url)
  VALUES ('Margi Yehonatan, Kirel Noa', 'מרגי יהונתן, קירל נועה', 'https://placehold.co/400')
  RETURNING id
),
composers_insert AS (
  INSERT INTO composers (name_en, name_he, image_url)
  VALUES ('Margi Yehonatan, Kirel Noa', 'מרגי יהונתן, קירל נועה', 'https://placehold.co/400')
  RETURNING id
),
lyricists_insert AS (
  INSERT INTO lyricists (name_en, name_he, image_url)
  VALUES ('Margi Yehonatan, Kirel Noa', 'מרגי יהונתן, קירל נועה', 'https://placehold.co/400')
  RETURNING id
)
-- Then insert the dance using the returned IDs
INSERT INTO dances (
  name_en,
  name_he,
  audio_url,
  audio_short_url,
  year,
  choreographers_id,
  performers_id,
  composers_id,
  lyricists_id,
  shapes_en,
  shapes_he,
  cover_url,
  duration
)
SELECT
  'Zikaron Yashan',
  'זיכרון ישן',
  'https://rokdim.co.il/assets/audios_full/1737186003571__5aee7152-0474-49de-acf0-4ef6eeafafb8.mp3',
  'https://rokdim.co.il/assets/audios_short/1737186003571__306a8225-96da-49a0-a977-c44769e9a978.mp3',
  '2023',
  choreographer_insert.id,
  performers_insert.id,
  composers_insert.id,
  lyricists_insert.id,
  'Circle',
  'מעגל',
  'https://placehold.co/400',
  180000
FROM
  choreographer_insert,
  performers_insert,
  composers_insert,
  lyricists_insert;
