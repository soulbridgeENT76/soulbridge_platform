-- ## 사이트 전역 설정 (브랜드 / 연락처 / SNS)
-- 페이지가 아니라 "사이트" 단위 설정이라 page_contents(slug 기반)와 분리한다.
-- footer는 모든 페이지에 렌더되므로 특정 페이지 행에 종속시키면 안 된다.
-- src/shared/config/site.ts 의 SITE / CONTACT / SOCIALS 를 대체한다.
-- (public.handle_updated_at() 은 이전 마이그레이션에서 생성됨)
create table public.site_settings (
    id smallint primary key default 1 check (id = 1),

    -- name, intro, (description, copyright)
    -- 홈 히어로 슬로건(tagline)은 페이지 문구라 page_contents(slug='home')로 간다.
    brand jsonb not null default '{}' check (jsonb_typeof(brand) = 'object'),

    -- email, address, tel, hours, directions, map_address
    contact jsonb not null default '{}' check (jsonb_typeof(contact) = 'object'),

    -- 키 고정 객체. 배열이 아닌 이유: src/shared/ui/social-links.tsx 의 BRAND_ICON이
    -- 라벨→아이콘을 하드코딩하고 매칭 실패 시 조용히 렌더를 건너뛴다. 즉 새 SNS는
    -- 아이콘 import(=배포) 없이는 추가할 수 없으므로 라벨을 자유 입력으로 두면
    -- 없는 유연성을 가장하게 된다. 값이 빈 문자열이면 미설정으로 취급한다.
    -- { instagram, youtube, messenger, kakao }
    socials jsonb not null default '{}' check (jsonb_typeof(socials) = 'object'),

    updated_at timestamptz not null default now()
);

-- 컬럼별로 소유 화면이 다르다:
--   brand, socials → /admin/brand 가 편집
--   contact        → /admin/contact 가 편집 (SNS만 브랜드 참조)
--   /admin/footer  → 아무것도 소유하지 않고 brand·contact를 참조만 한다
comment on table public.site_settings is
    '사이트 전역 설정. 항상 id=1 한 행만 존재한다. brand·socials는 /admin/brand, contact는 /admin/contact 가 편집한다.';

-- updated_at 자동 갱신
create trigger site_settings_set_updated_at
    before update on public.site_settings
    for each row execute function public.handle_updated_at();

-- ## 시드
-- src/shared/config/site.ts 의 현재 값. SNS href는 아직 미정이라 빈 문자열.
insert into public.site_settings (id, brand, contact, socials)
values (
    1,
    '{
        "logo": null,
        "name": "Soul Bridge ENT",
        "intro": "영혼과 영혼을 잇는 미래 엔터테인먼트",
        "copyright": "SOUL BRIDGE ENT. ALL RIGHTS RESERVED."
    }'::jsonb,
    '{
        "email": "soulbridgeent@gmail.com",
        "address": "서울특별시 000 주소 추후 기재",
        "tel": "02-000-0000",
        "map_address": "서울특별시 마포구 성암로 330 DMC첨단산업센터"
    }'::jsonb,
    '{
        "instagram": "",
        "youtube": "",
        "messenger": ""
    }'::jsonb
);

-- ## RLS
-- 조회는 누구나(비로그인 포함) — footer/contact가 공개 페이지에서 렌더된다.
-- 수정은 로그인 관리자만. insert/delete는 아무에게도 주지 않는다:
--   설정 행은 위 시드로 이미 존재하고, 추가 생성(check id=1)도 삭제도 정상 동작이 아니다.
grant select on public.site_settings to anon, authenticated;
grant update on public.site_settings to authenticated;

alter table public.site_settings enable row level security;

create policy "public can read site_settings"
    on public.site_settings for select to anon, authenticated
    using (true);

-- update는 대상 행을 먼저 select 할 수 있어야 동작한다(위 select 정책이 그 역할을 겸한다).
create policy "authenticated can update site_settings"
    on public.site_settings for update to authenticated
    using (true)
    with check (true);
