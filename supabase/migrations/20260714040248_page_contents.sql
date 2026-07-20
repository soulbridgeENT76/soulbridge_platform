-- ## 페이지 공통 메타 (about, contents, news 등 페이지별 title/subtitle/description)
-- (public.handle_updated_at() 은 이전 마이그레이션에서 생성됨)
create table public.page_contents (
    id bigint generated always as identity primary key,
    slug text not null unique,        -- 페이지 식별자: 'about', 'contents', 'news' ...
    title text not null,
    subtitle text not null,
    description text,
    is_active boolean not null default true, -- 페이지 활성화/비활성화 기회 추가
    -- 페이지별 추가 필드 (스키마 변경 없이 확장)
    metadata jsonb not null default '{}',
    updated_at timestamptz not null default now()
);

-- updated_at 자동 갱신
create trigger page_contents_set_updated_at
    before update on public.page_contents
    for each row execute function public.handle_updated_at();

-- ## RLS
-- 조회는 누구나(비로그인 포함), 수정은 통합 관리자만.
grant select on public.page_contents to anon, authenticated;
grant insert, update, delete on public.page_contents to authenticated;

alter table public.page_contents enable row level security;

-- 조회: 비로그인 포함 전체 공개
create policy "public can read page_contents"
    on public.page_contents for select to anon, authenticated
    using (true);

-- 생성/수정/삭제: 로그인 관리자면 누구나
create policy "authenticated can write page_contents"
    on public.page_contents for all to authenticated
    using (true)
    with check (true);
