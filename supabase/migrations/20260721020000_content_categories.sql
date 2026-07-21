-- 카테고리를 DB(content_categories)로 관리한다.
--
-- 20260721010000 이 이 테이블을 드롭했지만(당시 카테고리를 상수로 두기로 함),
-- 이후 방침이 바뀌어 어드민에서 카테고리를 추가·삭제한다. contents.category 는
-- 이름 문자열을 담으므로 FK 는 두지 않는다 — 사용 중인 카테고리 삭제는 앱
-- 액션에서 막는다.
--
-- create/policy/seed 모두 멱등하게 작성해, 이 테이블이 이미 있든 없든(=신규
-- db reset 이든 기존 DB 든) 같은 결과에 도달한다.

create table if not exists public.content_categories (
    id bigint generated always as identity primary key,
    name text not null unique
);

grant select on public.content_categories to anon;
grant select, insert, update, delete on public.content_categories to authenticated;

alter table public.content_categories enable row level security;

drop policy if exists "public can read content_categories"
    on public.content_categories;
create policy "public can read content_categories"
    on public.content_categories for select to anon
    using (true);

drop policy if exists "authenticated full access categories"
    on public.content_categories;
create policy "authenticated full access categories"
    on public.content_categories for all to authenticated
    using (true)
    with check (true);

-- ## 씨드 — 필터·폼의 선택지. id 순서가 표시 순서가 된다.
insert into public.content_categories (name)
values ('YOUTUBE'), ('DRAMA · OTT'), ('WEBTOON'), ('WEBNOVEL')
on conflict (name) do nothing;
