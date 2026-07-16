-- ## 테이블 선언
create table public.news_categories (
    id bigint generated always as identity primary key,
    name text not null unique
);

create table public.news (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    content text not null default '',
    category_id bigint references public.news_categories (id) on delete restrict,
    is_active boolean not null default false,
    published_at timestamptz, -- 발행 시각. null=미발행(초안), 값 있으면 발행됨.
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

-- ## 자동화
-- updated_at 자동 갱신
create trigger news_set_updated_at
    before update on public.news
    for each row execute function public.handle_updated_at();

-- ## RLS
-- 조회는 누구나(비로그인 anon 포함), 생성/수정/삭제는 로그인 관리자만.
-- anon도 읽으려면 테이블 GRANT와 RLS 정책 양쪽에 anon이 포함돼야 한다.
grant select on public.news_categories to anon;
grant select on public.news to anon;
grant select, insert, update, delete on public.news_categories to authenticated;
grant select, insert, update, delete on public.news to authenticated;

alter table public.news_categories enable row level security;
alter table public.news enable row level security;

-- 조회: 비로그인 포함 전체 공개
create policy "public can read news_categories"
    on public.news_categories for select to anon, authenticated
    using (true);

-- 조회(공개): 비로그인은 활성(is_active) 상태이면서 발행 시각이 지난 뉴스만.
-- 두 조건 모두 충족해야 한다. 활성이어도 예약 시각 전이면 안 보이고,
-- 시각이 지났어도 비활성이면 안 보인다.
create policy "public can read news"
    on public.news for select to anon
    using (
        is_active
        and published_at is not null
        and published_at <= now()
    );

-- 조회(관리자): 로그인 관리자는 발행 여부·작성자와 무관하게 전체 조회 가능.
-- (생성/수정/삭제는 아래 정책에서 여전히 소유권으로 제한된다.)
create policy "authenticated can read news"
    on public.news for select to authenticated
    using (true);

-- 카테고리: 로그인 관리자 전체 접근(저자 개념 없음).
create policy "authenticated can write news_categories"
    on public.news_categories for all to authenticated
    using (true)
    with check (true);

-- 생성/수정/삭제: 로그인 관리자면 누구나.
create policy "authenticated can insert news"
    on public.news for insert to authenticated
    with check (true);

create policy "authenticated can update news"
    on public.news for update to authenticated
    using (true)
    with check (true);

create policy "authenticated can delete news"
    on public.news for delete to authenticated
    using (true);
