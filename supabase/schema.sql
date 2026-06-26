-- ============================================
-- BACHECA SCOUT — schema database Supabase
-- Esegui questo file in: Supabase > SQL Editor > New query
-- ============================================

-- Tabella dei profili: nome persona, reparto e zona, compilati una volta sola
create table if not exists profili (
  id uuid primary key references auth.users(id) on delete cascade,
  nome_persona text not null,
  reparto_nome text not null,
  squadriglia text,
  tipo_reparto text not null check (tipo_reparto in ('normale', 'nautico')),
  zona text not null check (zona in ('nord', 'centro', 'sud')),
  regione text not null,
  creato_il timestamp with time zone default now()
);

alter table profili enable row level security;

drop policy if exists "Tutti possono leggere i profili" on profili;
create policy "Tutti possono leggere i profili"
  on profili for select
  using (true);

drop policy if exists "Ognuno crea solo il proprio profilo" on profili;
create policy "Ognuno crea solo il proprio profilo"
  on profili for insert
  with check (auth.uid() = id);

drop policy if exists "Ognuno modifica solo il proprio profilo" on profili;
create policy "Ognuno modifica solo il proprio profilo"
  on profili for update
  using (auth.uid() = id);

-- Tabella principale dei post della bacheca
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  autore_id uuid references auth.users(id) on delete cascade,
  autore_nome text not null,
  reparto_nome text not null,
  squadriglia text,
  tipo_reparto text not null check (tipo_reparto in ('normale', 'nautico')),
  zona text not null check (zona in ('nord', 'centro', 'sud')),
  regione text not null,
  testo text,
  media_url text,
  media_type text check (media_type in ('immagine', 'video', null))
);

alter table posts enable row level security;

drop policy if exists "Tutti possono leggere i post" on posts;
create policy "Tutti possono leggere i post"
  on posts for select
  using (true);

drop policy if exists "Solo utenti loggati possono pubblicare" on posts;
create policy "Solo utenti loggati possono pubblicare"
  on posts for insert
  with check (auth.uid() = autore_id);

drop policy if exists "L'autore puo' eliminare il proprio post" on posts;
create policy "L'autore puo' eliminare il proprio post"
  on posts for delete
  using (auth.uid() = autore_id);

-- ============================================
-- STORAGE: bucket per foto e video
-- ============================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "Lettura pubblica dei file media" on storage.objects;
create policy "Lettura pubblica dei file media"
  on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "Solo utenti loggati possono caricare media" on storage.objects;
create policy "Solo utenti loggati possono caricare media"
  on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

-- ============================================
-- SALVATI (segnalibro sui post)
-- ============================================
create table if not exists salvati (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  utente_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique (post_id, utente_id)
);

alter table salvati enable row level security;

drop policy if exists "Ognuno legge solo i propri salvati" on salvati;
create policy "Ognuno legge solo i propri salvati"
  on salvati for select
  using (auth.uid() = utente_id);

drop policy if exists "Solo utenti loggati possono salvare" on salvati;
create policy "Solo utenti loggati possono salvare"
  on salvati for insert
  with check (auth.uid() = utente_id);

drop policy if exists "Ognuno toglie solo il proprio salvato" on salvati;
create policy "Ognuno toglie solo il proprio salvato"
  on salvati for delete
  using (auth.uid() = utente_id);
create table if not exists mi_piace (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  utente_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique (post_id, utente_id)
);

alter table mi_piace enable row level security;

drop policy if exists "Tutti possono leggere i mi piace" on mi_piace;
create policy "Tutti possono leggere i mi piace"
  on mi_piace for select
  using (true);

drop policy if exists "Solo utenti loggati possono metter mi piace" on mi_piace;
create policy "Solo utenti loggati possono metter mi piace"
  on mi_piace for insert
  with check (auth.uid() = utente_id);

drop policy if exists "Ognuno toglie solo il proprio mi piace" on mi_piace;
create policy "Ognuno toglie solo il proprio mi piace"
  on mi_piace for delete
  using (auth.uid() = utente_id);

-- ============================================
-- COMMENTI
-- ============================================
create table if not exists commenti (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  autore_id uuid references auth.users(id) on delete cascade,
  autore_nome text not null,
  testo text not null,
  created_at timestamp with time zone default now()
);

alter table commenti enable row level security;

drop policy if exists "Tutti possono leggere i commenti" on commenti;
create policy "Tutti possono leggere i commenti"
  on commenti for select
  using (true);

drop policy if exists "Solo utenti loggati possono commentare" on commenti;
create policy "Solo utenti loggati possono commentare"
  on commenti for insert
  with check (auth.uid() = autore_id);

drop policy if exists "Ognuno elimina solo il proprio commento" on commenti;
create policy "Ognuno elimina solo il proprio commento"
  on commenti for delete
  using (auth.uid() = autore_id);
