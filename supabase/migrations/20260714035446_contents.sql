-- ## content 관련 테이블
-- (profiles 및 public.handle_updated_at() 은 이전 마이그레이션에서 생성됨)
create table public.content_categories (
    id bigint generated always as identity primary key,
    name text not null unique
);

create table public.contents (
    id uuid primary key default gen_random_uuid(),
    category_id bigint not null references public.content_categories (id) on delete restrict,
    author_id uuid references public.profiles (id) on delete set null,
    title text not null,
    thumbnail_url text,
    tuhmbnail_type smallint not null, -- 0: image, 1: youtube link
    description text, -- 제목 하단 상세
    content text not null, -- 내용
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- updated_at 자동 갱신
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger contents_set_updated_at
    before update on public.contents
    for each row execute function public.handle_updated_at();

-- #### RLS
grant select, insert, update, delete on public.content_categories to authenticated;
grant select, insert, update, delete on public.contents to authenticated;

alter table public.content_categories enable row level security;
alter table public.contents enable row level security;

-- 카테고리: 로그인 유저 전체 접근
create policy "authenticated full access"
    on public.content_categories for all to authenticated
    using (true)
    with check (true);

-- 조회: 로그인 유저 모두
create policy "authenticated can read contents"
    on public.contents for select to authenticated
    using (true);

-- 생성/수정/삭제: 로그인 관리자면 누구나
create policy "authenticated can insert contents"
    on public.contents for insert to authenticated
    with check (true);

create policy "authenticated can update contents"
    on public.contents for update to authenticated
    using (true)
    with check (true);

create policy "authenticated can delete contents"
    on public.contents for delete to authenticated
    using (true);
