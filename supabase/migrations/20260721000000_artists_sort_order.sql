-- 아티스트 목록 순서를 어드민에서 직접 통제하기 위한 sort_order 컬럼.
--
-- 그동안 그리드는 created_at 순서였다(등록순). 그것으로는 "손정은을 맨 앞에
-- 고정"처럼 순서를 손으로 바꿀 수 없어, 명시적인 정렬 키를 둔다.

alter table public.artists
    add column sort_order integer not null default 0;

-- 기존 행은 현재 보이던 순서(created_at)를 그대로 sort_order 로 굳힌다.
-- row_number 로 1,2,3… 을 매겨 서로 겹치지 않게 한다 — 위/아래 이동은 이웃과
-- 값을 맞바꾸는 방식이라 값이 유일해야 한다.
with ordered as (
    select id, row_number() over (order by created_at) as rn
    from public.artists
)
update public.artists a
set sort_order = ordered.rn
from ordered
where ordered.id = a.id;

-- 목록·상세 모두 sort_order 로 조회하므로 인덱스를 둔다.
create index artists_sort_order_idx on public.artists (sort_order);
