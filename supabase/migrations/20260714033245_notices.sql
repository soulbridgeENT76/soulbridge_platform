-- ## notices(공지·뉴스) 테이블
-- category 는 notice_categories 로 관리하고 notices.category 는 그 이름을 텍스트로
-- 담는다(FK 없음 — 앱이 카테고리를 문자열로 다룬다). slug 는 선택값 — 지정하면
-- 커스텀 URL, 비우면 id(uuid)로 접근한다. type 0=자체작성(content 를 상세에 노출),
-- 1=링크(reference_url 로 리다이렉트). 공개 노출은 is_active + published_at(과거)
-- 두 조건을 모두 만족해야 한다.

create table public.notice_categories (
    id bigint generated always as identity primary key,
    name text not null unique
);

create table public.notices (
    id uuid primary key default gen_random_uuid(),
    slug text unique,                       -- 선택 커스텀 URL (없으면 id 로 접근)
    title text not null,
    content text not null default '',       -- 상세 본문
    type smallint not null default 0 check (type in (0, 1)),
    reference_url text,
    category text not null,                 -- notice_categories.name
    is_active boolean not null default false,
    published_at timestamptz,               -- 발행 시각. null=미발행(초안)
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    -- 링크 타입인데 주소가 없으면 눌러도 갈 곳이 없다 — 스키마에서 막는다.
    constraint notices_reference_url_required
        check (type <> 1 or reference_url is not null)
);

-- updated_at 자동 갱신. 이후 마이그레이션들이 재사용하는 공용 함수라 여기서 정의한다.
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger notices_set_updated_at
    before update on public.notices
    for each row execute function public.handle_updated_at();

create index notices_published_at_idx on public.notices (published_at);

-- ## RLS
grant select on public.notice_categories to anon;
grant select on public.notices to anon;
grant select, insert, update, delete on public.notice_categories to authenticated;
grant select, insert, update, delete on public.notices to authenticated;

alter table public.notice_categories enable row level security;
alter table public.notices enable row level security;

create policy "authenticated full access notice_categories"
    on public.notice_categories for all to authenticated
    using (true)
    with check (true);

create policy "public can read notice_categories"
    on public.notice_categories for select to anon
    using (true);

-- 조회(공개): 비로그인은 활성이면서 발행 시각이 지난 공지만.
create policy "public can read notices"
    on public.notices for select to anon
    using (
        is_active
        and published_at is not null
        and published_at <= now()
    );

-- 조회(관리자): 초안·예약분까지 전부.
create policy "authenticated can read notices"
    on public.notices for select to authenticated
    using (true);

create policy "authenticated can insert notices"
    on public.notices for insert to authenticated
    with check (true);

create policy "authenticated can update notices"
    on public.notices for update to authenticated
    using (true)
    with check (true);

create policy "authenticated can delete notices"
    on public.notices for delete to authenticated
    using (true);

-- ## 씨드 — 카테고리(고정 2종) + 정적 공지 6건 (전부 자체작성 type=0)
insert into public.notice_categories (name)
values ('NOTICE'), ('NEWS');

insert into public.notices (slug, category, title, content, type, reference_url, is_active, published_at)
values
    ('official-launch', 'NEWS', '소울브릿지ENT 공식 출범 — "영혼과 영혼을 잇는 미래 엔터테인먼트"', '소울브릿지ENT가 ''영혼과 영혼을 잇는 미래 엔터테인먼트''를 슬로건으로 공식 출범했습니다.
깊이 있는 메시지를 전하는 오리지널 콘텐츠 제작 역량과 독점적인 원천 IP 확장을 기반으로, 지속 가능한 미디어 성장을 지향합니다.
유튜브 오리지널부터 드라마·OTT, 웹툰·웹소설 IP까지 아우르는 종합 미디어 컴퍼니로의 도약을 시작합니다.', 0, null, true, timestamptz '2026-07-02 00:00:00+00'),
    ('cvo-appointment', 'NEWS', '손정은 CVO 합류, 장기 비전 및 글로벌 미디어 전략 총괄', '전 MBC 아나운서이자 간판 뉴스데스크 앵커 손정은이 소울브릿지ENT의 Chief Vision Officer(CVO)로 합류했습니다.
쌓아 올린 신뢰성과 브랜드 가치를 바탕으로 장기 비전과 글로벌 미디어 네트워크 전략을 총괄합니다.
대중에게 신뢰와 가치를 동시에 전하는 ''선한 영향력의 대표 브랜드''를 만들어 갈 예정입니다.', 0, null, true, timestamptz '2026-06-24 00:00:00+00'),
    ('rok-media-partnership', 'NEWS', '로크미디어와 웹툰·웹소설 원천 IP 파트너십 체결', '소울브릿지ENT가 로크미디어와 웹툰·웹소설 원천 IP 파트너십을 체결했습니다.
검증된 메가 히트 IP 라이브러리를 활용해 원천 서사를 드라마·영화·애니메이션으로 확장하는 트랜스미디어 사업을 본격 가동합니다.
글로벌 플랫폼 공동 유통 구조를 통해 고부가가치 라이선싱을 실현할 계획입니다.', 0, null, true, timestamptz '2026-06-18 00:00:00+00'),
    ('youtube-channel-teaser', 'NOTICE', '오리지널 유튜브 채널 하반기 론칭 예고', '소울브릿지ENT의 오리지널 뉴미디어 유튜브 채널이 2026년 하반기 론칭됩니다.
대중성과 신뢰성을 결합한 오리지널 포맷의 예능·교양 시리즈를 매 시즌 선보일 예정입니다.
채널 오픈 및 콘텐츠 공개 일정은 추후 공지를 통해 안내드리겠습니다.', 0, null, true, timestamptz '2026-06-10 00:00:00+00'),
    ('open-audition', 'NOTICE', '신규 크리에이터·아티스트 상시 오디션 안내', '소울브릿지ENT와 함께 성장할 신규 크리에이터·아티스트를 상시 모집합니다.
방송인, 배우, 인플루언서 등 미디어 파워 유저를 대상으로 체계적인 브랜딩 케어를 제공합니다.
지원 방법 및 세부 사항은 공식 채널을 통해 안내되며, 문의는 soulbridgeent@gmail.com으로 받습니다.', 0, null, false, timestamptz '2026-06-05 00:00:00+00'),
    ('incorporation', 'NEWS', '소울브릿지ENT 법인 설립 완료', '소울브릿지ENT가 법인 설립을 완료하고 사업을 공식 개시했습니다.
오리지널 뉴미디어 유튜브 채널과 핵심 기획 인프라 셋업을 시작으로 3개년 성장 로드맵을 실행해 나갑니다.
콘텐츠와 사람, 세대를 잇는 종합 엔터테인먼트로 나아가겠습니다.', 0, null, true, timestamptz '2026-06-01 00:00:00+00')
on conflict (slug) do nothing;
