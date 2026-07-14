create table public.artists (
    id uuid primary key default gen_random_uuid(),
    name text not null, -- 아티스트 이름
    english_name text not null, -- 영어 이름
    description text not null,
    occupation text not null
);

create table public.artist_links (
    id bigint primary key generated always as identity,
    artist_id uuid not null references public.artists (id) on delete cascade,
    label text not null, -- ???
    url text not null, -- 관련 url
    created_at timestamptz not null default now()
);

-- 작품활동 연혁 (연.월당 설명 하나)
create table public.artist_careers (
    id bigint primary key generated always as identity,
    artist_id uuid not null references public.artists (id) on delete cascade,
    label text not null, -- 활동 라벨 (2001.12 .. )
    description text not null, -- 활동 내용
    created_at timestamptz not null default now()
);

-- ## FK 인덱스 (artist_id로 항상 조회)
create index artist_links_artist_id_idx on public.artist_links (artist_id);
create index artist_careers_artist_id_idx on public.artist_careers (artist_id);

-- ## RLS
-- 조회는 누구나(비로그인 포함), 생성/수정/삭제는 통합 관리자만.
grant select on public.artists to anon, authenticated;
grant select on public.artist_links to anon, authenticated;
grant select on public.artist_careers to anon, authenticated;
grant insert, update, delete on public.artists to authenticated;
grant insert, update, delete on public.artist_links to authenticated;
grant insert, update, delete on public.artist_careers to authenticated;

alter table public.artists enable row level security;
alter table public.artist_links enable row level security;
alter table public.artist_careers enable row level security;

-- 조회: 비로그인 포함 전체 공개
create policy "public can read artists"
    on public.artists for select to anon, authenticated
    using (true);

create policy "public can read artist_links"
    on public.artist_links for select to anon, authenticated
    using (true);

create policy "public can read artist_careers"
    on public.artist_careers for select to anon, authenticated
    using (true);

-- 생성/수정/삭제: 로그인 관리자면 누구나
create policy "authenticated can write artists"
    on public.artists for all to authenticated
    using (true)
    with check (true);

create policy "authenticated can write artist_links"
    on public.artist_links for all to authenticated
    using (true)
    with check (true);

create policy "authenticated can write artist_careers"
    on public.artist_careers for all to authenticated
    using (true)
    with check (true);
