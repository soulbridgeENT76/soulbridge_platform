-- ## page_contents 기본 데이터
-- 지금까지 코드 상수로 박혀 있던 페이지 문구를 CMS로 옮긴다.
-- 출처: src/widgets/hero-slider/model/slides.ts (홈 슬라이드 5개),
--       src/shared/config/page-copy.ts, src/entities/about/model/about.ts (섹션 페이지 5개).
--
-- 컬럼 대응은 admin 편집 화면 기준이다:
--   subtitle    = 상단 작은 영문 라벨(eyebrow)
--   title       = 대제목 (줄바꿈 그대로 반영)
--   description = 소제목/본문 (줄바꿈 그대로 반영)
--   metadata    = 문구가 아닌 것들(배너 이미지, 버튼, 연결 경로 등)
--
-- slug 규칙: 홈 슬라이드는 'home/<이동할 페이지>', 섹션 페이지는 '<페이지>'.
--
-- on conflict do nothing: 이미 손본 행을 이 마이그레이션이 덮어쓰면 안 된다.
-- 재실행해도 기존 데이터는 그대로 두고 빠진 것만 채운다.

-- ## 홈 슬라이드 (5개)
-- metadata.order 로 노출 순서를 잡는다. id(identity) 순서에 기대면
-- 나중에 슬라이드를 지웠다 다시 넣을 때 순서가 틀어진다.
--
-- metadata.banner 는 admin 홈 편집 화면에서 올리는 배경 이미지 두 장의
-- 스토리지 경로다(images 버킷 기준 상대 경로, mediaUrl() 로 URL을 만든다).
-- desktop = 가로 2560x1440, mobile = 세로 1440x2560. 모바일은 데스크톱을
-- 자른 게 아니라 세로 구도로 따로 잡은 이미지라 둘을 각각 받는다.
-- 아직 올린 이미지가 없으므로 null 로 시작한다.
--
-- metadata.scheme 은 그 이미지 위에 얹는 글자색이다.
-- "dark" = 어두운 글자(밝은 배경용), "light" = 밝은 글자(어두운 배경용).
--
-- metadata.section 은 해당 메뉴가 꺼지면 이 슬라이드도 홈에서 감춘다는 뜻이다.
-- 메뉴에 없는 페이지로 유도하는 배너가 남지 않게 한다. 다섯 슬라이드가 각각
-- 하나의 섹션에 대응하므로 전부 section 을 갖는다 — ABOUT 도 예외가 아니라,
-- 끄면 홈이 CONTENTS 배너부터 시작한다.
insert into public.page_contents (slug, subtitle, title, description, metadata)
values
    (
        'home/about',
        'CONNECTING SOULS, INSPIRING LIVES.',
        E'사람과 사람을 잇는 이야기,\n소울브릿지 ENT',
        E' 한 사람의 진심 어린 이야기가\n 누군가에게 다시 나아갈 힘이 되기를.\n 우리는 그 이야기를 가장 따뜻하고 깊이 있게 담아냅니다.',
        '{
            "order": 1,
            "slide_id": "about",
            "banner": { "desktop": null, "mobile": null },
            "scheme": "dark",
            "cta": { "label": "OUR STORY", "href": "/about" },
            "section": "/about"
        }'::jsonb
    ),
    (
        'home/contents',
        'CONTENTS',
        E'이야기를 담아내는\n모든 방식',
        E'유튜브 오리지널부터 드라마, 웹툰·웹소설 IP까지.\n소울브릿지ENT가 만드는 이야기.',
        '{
            "order": 2,
            "slide_id": "contents",
            "banner": { "desktop": null, "mobile": null },
            "scheme": "dark",
            "cta": { "label": "VIEW CONTENTS", "href": "/contents" },
            "section": "/contents"
        }'::jsonb
    ),
    (
        'home/artists',
        'ARTISTS',
        E'이야기를 전하는\n사람들',
        E'방송인, 배우, 크리에이터.\n각자의 목소리로 이야기를 전하는 사람들.',
        '{
            "order": 3,
            "slide_id": "artists",
            "banner": { "desktop": null, "mobile": null },
            "scheme": "dark",
            "cta": { "label": "MEET OUR ARTISTS", "href": "/artists" },
            "section": "/artists"
        }'::jsonb
    ),
    (
        -- 이 슬라이드만 본문 대신 최신 뉴스 3건을 렌더한다(shows_news).
        -- 그래서 description 이 비어 있다.
        'home/notice',
        'LATEST NOTICE',
        E'소울브릿지ENT의\n새로운 소식',
        null,
        '{
            "order": 4,
            "slide_id": "notice",
            "banner": { "desktop": null, "mobile": null },
            "scheme": "dark",
            "shows_news": true,
            "news_limit": 3,
            "cta": { "label": "VIEW ALL NOTICE", "href": "/notice" },
            "section": "/notice"
        }'::jsonb
    ),
    (
        'home/contact',
        'GET IN TOUCH',
        E'당신의 이야기를\n들려주세요',
        E'제휴·캐스팅·미디어 협업 문의를 기다립니다.\n소울브릿지ENT와 함께 새로운 이야기를 만들어가요.',
        '{
            "order": 5,
            "slide_id": "contact",
            "banner": { "desktop": null, "mobile": null },
            "scheme": "dark",
            "cta": { "label": "CONTACT US", "href": "/contact" },
            "section": "/contact"
        }'::jsonb
    )
on conflict (slug) do nothing;

-- ## 섹션 페이지 (5개)
-- metadata.nav_order 는 헤더/푸터 메뉴 노출 순서(site.ts 의 NAV 와 같은 순서),
-- nav_label 은 메뉴에 찍히는 라벨이다. 페이지 제목과 다를 수 있어 따로 둔다.
insert into public.page_contents (slug, subtitle, title, description, metadata)
values
    (
        'about',
        'OUR STORY',
        E'영혼과 영혼을 잇는\n미래 엔터테인먼트',
        E'소울브릿지ENT는 단순한 에이전시를 넘어,\n깊이 있는 메시지를 전하는 오리지널 콘텐츠 제작 역량과\n독점적인 원천 IP 확장을 기반으로 지속 가능한 미디어 성장을 지향합니다.',
        '{
            "nav_order": 1,
            "nav_label": "ABOUT",
            "href": "/about"
        }'::jsonb
    ),
    (
        'contents',
        'VIEW CONTENTS',
        '이야기를 담아내는 모든 방식',
        '유튜브 오리지널부터 드라마, 웹툰·웹소설 IP까지 — 소울브릿지ENT가 만드는 콘텐츠를 소개합니다.',
        '{
            "nav_order": 2,
            "nav_label": "CONTENTS",
            "href": "/contents"
        }'::jsonb
    ),
    (
        'artists',
        'MEET OUR ARTIST',
        '이야기를 전하는 사람들',
        '방송인부터 배우, 크리에이터까지 — 소울브릿지ENT와 함께 진심을 전하는 아티스트를 소개합니다.',
        '{
            "nav_order": 3,
            "nav_label": "ARTISTS",
            "href": "/artists"
        }'::jsonb
    ),
    (
        'notice',
        'VIEW ALL NOTICE',
        '소울브릿지ENT의 새로운 소식',
        '보도자료부터 공지까지 — 소울브릿지ENT의 소식을 가장 먼저 전해드립니다.',
        '{
            "nav_order": 4,
            "nav_label": "NOTICE",
            "href": "/notice"
        }'::jsonb
    ),
    (
        -- 연락처 값(이메일·주소·전화·지도)은 site_settings.contact 가 갖는다.
        -- 여기에는 페이지 상단 문구만 둬서 출처가 갈리지 않게 한다.
        'contact',
        'CONTACT US',
        '찾아오시는 길',
        '협업·제휴·출연 문의를 환영합니다. 아래 연락처로 편하게 연락 주시고, 방문 시 위치는 지도를 참고해 주세요.',
        '{
            "nav_order": 5,
            "nav_label": "CONTACT",
            "href": "/contact"
        }'::jsonb
    )
on conflict (slug) do nothing;
