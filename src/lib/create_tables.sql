-- Function to create dances table
create or replace function create_dances_table()
returns void as $$
begin
  create table if not exists dances (
    id uuid default uuid_generate_v4() primary key,
    name_en text not null,
    name_he text not null,
    audio_url text not null,
    audio_short_url text not null,
    year text not null,
    choreographers_en text not null,
    choreographers_he text not null,
    performers_en text not null,
    performers_he text not null,
    composers_en text not null,
    composers_he text not null,
    lyricists_en text not null,
    lyricists_he text not null,
    shapes_en text not null,
    shapes_he text not null,
    cover_url text,
    duration integer not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
  );
end;
$$ language plpgsql;

-- Function to create collections table
create or replace function create_collections_table()
returns void as $$
begin
  create table if not exists dance_collections (
    id uuid default uuid_generate_v4() primary key,
    title_en text not null,
    title_he text not null,
    description_en text,
    description_he text,
    cover_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
  );

  create table if not exists collection_dances (
    collection_id uuid references dance_collections(id) on delete cascade,
    dance_id uuid references dances(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (collection_id, dance_id)
  );
end;
$$ language plpgsql; 