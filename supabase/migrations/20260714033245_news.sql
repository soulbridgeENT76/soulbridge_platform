-- ## 테이블 선언
create table public.news_categories (
    id bigint generated always as identity primary key,
    name text not null unique
);

create table public.news (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    content text not null default '',
    -- 0=자체 작성(content 를 상세 페이지에 보여준다), 1=링크(상세 페이지 없이
    -- reference_url 로 리다이렉트). 대부분 자체 작성이라 0이 기본값.
    type smallint not null default 0 check (type in (0, 1)),
    -- type=1 이면 리다이렉트 대상이라 필수(아래 constraint), type=0 이면
    -- 본문에 곁들이는 참고 링크로 선택 입력.
    reference_url text,
    category_id bigint references public.news_categories (id) on delete restrict,
    is_active boolean not null default false,
    published_at timestamptz, -- 발행 시각. null=미발행(초안), 값 있으면 발행됨.
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    -- 링크 타입인데 주소가 없으면 목록에서 눌러도 갈 곳이 없다. 리다이렉트
    -- 대상이 비는 상태를 스키마 차원에서 막는다. (type=0 은 제약 없음)
    constraint news_reference_url_required
        check (type <> 1 or reference_url is not null)
);

-- ## 자동화
-- updated_at 자동 갱신. 이후 마이그레이션들이 그대로 재사용하는 공용 함수라
-- 여기서 한 번만 정의한다.
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

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

-- 조회(관리자): 초안·예약분까지 전부 보여야 편집할 수 있으므로 조건 없이 전체 공개.
create policy "authenticated can read news"
    on public.news for select to authenticated
    using (true);

-- 카테고리: 로그인 관리자면 전체 접근.
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
