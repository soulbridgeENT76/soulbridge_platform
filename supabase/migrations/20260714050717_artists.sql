-- ## artist 관련 테이블
-- slug: /artists/[slug] 라우팅 식별자. photo: Storage 경로(mediaUrl 이 렌더 시
-- 붙인다). sort_order: 어드민에서 통제하는 그리드 표시 순서. artist_links.key 는
-- 공용 SocialKey(@shared/config/socials) 값이다.

create table public.artists (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    name text not null,
    english_name text not null,
    description text not null,
    occupation text not null,
    photo text,
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
);

create table public.artist_links (
    id bigint primary key generated always as identity,
    artist_id uuid not null references public.artists (id) on delete cascade,
    key text not null, -- react-icons 아이콘을 고르는 SocialKey
    href text not null,
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

-- ## 인덱스
create index artist_links_artist_id_idx on public.artist_links (artist_id);
create index artist_careers_artist_id_idx on public.artist_careers (artist_id);
create index artists_sort_order_idx on public.artists (sort_order);

-- ## RLS — 조회는 anon 포함, 쓰기는 로그인 관리자.
grant select on public.artists to anon, authenticated;
grant select on public.artist_links to anon, authenticated;
grant select on public.artist_careers to anon, authenticated;
grant insert, update, delete on public.artists to authenticated;
grant insert, update, delete on public.artist_links to authenticated;
grant insert, update, delete on public.artist_careers to authenticated;

alter table public.artists enable row level security;
alter table public.artist_links enable row level security;
alter table public.artist_careers enable row level security;

create policy "public can read artists"
    on public.artists for select to anon, authenticated
    using (true);

create policy "public can read artist_links"
    on public.artist_links for select to anon, authenticated
    using (true);

create policy "public can read artist_careers"
    on public.artist_careers for select to anon, authenticated
    using (true);

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

-- ## 씨드 — 6명 + SNS 링크 + 활동이력. created_at 을 어긋나게 넣어 순서를
-- 보존하고, sort_order 는 그 순서대로 1..6 으로 굳힌다.
insert into public.artists (slug, name, english_name, occupation, description, created_at)
values
    (
        'sohn-jung-eun', '손정은', 'SOHN JUNG-EUN', '방송인',
        E'전 MBC 아나운서이자 간판 뉴스데스크 앵커로서 쌓아 올린 신뢰성과 브랜드 가치를 바탕으로, 소울브릿지ENT의 장기 비전과 글로벌 미디어 네트워크 전략을 이끌고 있습니다.\n대중에게 신뢰와 가치를 동시에 전하는 ''선한 영향력의 대표 브랜드''를 지향하며, 콘텐츠를 통한 진심의 연결을 실천합니다.',
        timestamptz '2026-07-20 00:00:01+00'
    ),
    (
        'kim-seo-hyun', '김서현', 'KIM SEO-HYUN', '배우',
        E'섬세한 감정 연기로 주목받는 라이징 배우. 인물의 내면을 겹겹이 쌓아 올리는 연기로 작품마다 다른 얼굴을 보여줍니다.\n소울브릿지ENT와 함께 원천 IP 기반 오리지널 드라마에서 새로운 도전을 준비하고 있습니다.',
        timestamptz '2026-07-20 00:00:02+00'
    ),
    (
        'lee-do-yoon', '이도윤', 'LEE DO-YOON', '크리에이터',
        E'일상의 진심을 담아내는 뉴미디어 크리에이터. 편안한 화법과 솔직한 시선으로 폭넓은 팬덤을 보유하고 있습니다.\n소울브릿지ENT의 오리지널 유튜브 포맷에서 기획과 진행을 맡아 활동합니다.',
        timestamptz '2026-07-20 00:00:03+00'
    ),
    (
        'park-chae-won', '박채원', 'PARK CHAE-WON', '배우',
        E'무대와 스크린을 오가며 탄탄한 기본기를 다져온 배우. 장르를 가리지 않는 폭넓은 스펙트럼이 강점입니다.\n글로벌 OTT를 겨냥한 소울브릿지ENT의 웰메이드 프로젝트에 합류를 논의 중입니다.',
        timestamptz '2026-07-20 00:00:04+00'
    ),
    (
        'jung-ha-ram', '정하람', 'JUNG HA-RAM', '방송인',
        E'현장을 읽는 순발력과 따뜻한 진행으로 신뢰받는 방송인. 인터뷰이의 진심을 자연스럽게 끌어내는 대화가 강점입니다.\n소울브릿지ENT의 인터뷰 다큐·교양 콘텐츠에서 활약하고 있습니다.',
        timestamptz '2026-07-20 00:00:05+00'
    ),
    (
        'choi-eun-ho', '최은호', 'CHOI EUN-HO', '크리에이터',
        E'트렌디한 감각과 기획력을 겸비한 콘텐츠 크리에이터. 짧은 포맷부터 시즌제 시리즈까지 다양한 영상을 만들어 왔습니다.\n소울브릿지ENT의 뉴미디어 오리지널 채널에서 신규 포맷 개발에 참여합니다.',
        timestamptz '2026-07-20 00:00:06+00'
    )
on conflict (slug) do nothing;

-- sort_order 를 created_at 순서대로 1,2,3… 로 굳힌다(서로 유일해야 이웃 교환
-- 재정렬이 동작한다).
with ordered as (
    select id, row_number() over (order by created_at) as rn
    from public.artists
)
update public.artists a
set sort_order = ordered.rn
from ordered
where ordered.id = a.id;

-- ## SNS 링크
-- artist_links 에는 유니크 제약이 없어 재실행하면 행이 불어난다. 이미 링크가
-- 있는 아티스트는 건너뛰어 멱등하게 만든다.
insert into public.artist_links (artist_id, key, href)
select a.id, v.key, v.href
from public.artists a
join (
    values
        ('sohn-jung-eun', 'instagram', '#'),
        ('sohn-jung-eun', 'youtube', '#'),
        ('kim-seo-hyun', 'instagram', '#'),
        ('lee-do-yoon', 'youtube', '#'),
        ('lee-do-yoon', 'instagram', '#'),
        ('park-chae-won', 'instagram', '#'),
        ('jung-ha-ram', 'instagram', '#'),
        ('jung-ha-ram', 'youtube', '#'),
        ('choi-eun-ho', 'youtube', '#')
) as v (slug, key, href) on v.slug = a.slug
where not exists (
    select 1 from public.artist_links l where l.artist_id = a.id
);

-- ## 활동 이력
-- label 은 연도 표기("2020 — 2024"처럼 범위도 들어간다), description 은 활동
-- 내용이다. 정적 데이터에 있던 배역(role) 필드는 렌더되는 곳도, 어드민에서
-- 입력할 칸도 없어 옮기지 않는다.
insert into public.artist_careers (artist_id, label, description)
select a.id, v.label, v.description
from public.artists a
join (
    values
        ('sohn-jung-eun', '2026', '다리를 놓는 사람들 : 시즌 1'),
        ('sohn-jung-eun', '2020 — 2024', 'MBC 뉴스데스크'),
        ('sohn-jung-eun', '2018', 'MBC 라디오 정오의 희망곡'),
        ('kim-seo-hyun', '2027', '소울브릿지 (가제)'),
        ('kim-seo-hyun', '2025', '단편영화 「봄의 문장」'),
        ('kim-seo-hyun', '2024', '웹드라마 「오후 세 시」'),
        ('lee-do-yoon', '2026', '브릿지 토크'),
        ('lee-do-yoon', '2026', '진심의 온도'),
        ('lee-do-yoon', '2023 — ', '개인 채널 「도윤의 하루」'),
        ('park-chae-won', '2028', '연결의 기술'),
        ('park-chae-won', '2024', '연극 「겨울 정원」'),
        ('park-chae-won', '2022', '드라마 「그해 여름」'),
        ('jung-ha-ram', '2026', '다리를 놓는 사람들 : 시즌 1'),
        ('jung-ha-ram', '2023', '지역 방송 「오늘의 이웃」'),
        ('choi-eun-ho', '2026', '소울브릿지 오리지널 (기획)'),
        ('choi-eun-ho', '2022 — ', '개인 채널 「은호 필름」')
) as v (slug, label, description) on v.slug = a.slug
where not exists (
    select 1 from public.artist_careers c where c.artist_id = a.id
);
