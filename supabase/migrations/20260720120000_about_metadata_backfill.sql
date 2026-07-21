-- ABOUT 의 고정 01 섹션(leadership)과 그 아래 가변 섹션(sections)을 기존 행에 채운다.
--
-- 씨드(20260720024554)는 `on conflict (slug) do nothing` 이라 이미 존재하는
-- 행을 건드리지 않는다. 그래서 씨드에 두 키를 추가해도 이미 만들어진
-- 데이터베이스에는 반영되지 않는다 — 이 마이그레이션이 그 간극을 메운다.
--
-- 두 키를 각각 따로 채운다. 어드민 저장은 leadership 과 sections 를 항상 함께
-- 쓰지만, 한쪽만 들어 있는 행(손으로 고친 행, 중간 상태)이 있을 수 있다.
-- 각자 없을 때만 채우므로 이미 저장한 내용은 어느 쪽도 덮어쓰지 않는다.
-- 재실행해도 결과가 같다.

-- 01 — leadership (고정 섹션)
update public.page_contents
set metadata = metadata || '{
    "leadership": {
        "label": "LEADERSHIP",
        "role": "CHIEF VISION OFFICER",
        "name": "손정은",
        "bio": "전 MBC 아나운서이자 간판 뉴스데스크 앵커로서 쌓아 올린 신뢰성과 강력한 브랜드 가치를 바탕으로,\n소울브릿지ENT의 장기 비전과 글로벌 미디어 네트워크 전략을 책임집니다.\n대중에게 신뢰와 가치를 동시에 제공하는 ''선한 영향력의 대표 브랜드''를 지향합니다.",
        "points": [
            "미디어 콘텐츠 장기 사업전략 총괄 수립",
            "오리지널 포맷 개발 및 콘텐츠 자문 총지휘",
            "핵심 리더십 및 비전 방향성 제시"
        ],
        "photo": null
    }
}'::jsonb
where slug = 'about'
  and metadata->'leadership' is null;

-- 02+ — 가변 섹션. 섹션 번호도 카드 번호도 저장하지 않는다(위치에서 계산).
update public.page_contents
set metadata = metadata || '{
    "sections": [
        {
            "label": "PORTFOLIO",
            "title": "주요 사업 포트폴리오 다각화",
            "items": [
                {
                    "title": "유튜브 & 오리지널 콘텐츠",
                    "description": "대중성과 신뢰성을 결합한 오리지널 포맷의 유튜브 예능·교양 시리즈를 매 시즌 기획하여, 고정 시청자층과 강력한 미디어 팬덤을 조기에 확보합니다.\n\n자체 유통 채널 기반의 디지털 다이렉트 수익(광고·협찬·멤버십)을 극대화해, 조기 현금 흐름 창출과 생태계 안정을 달성합니다."
                },
                {
                    "title": "방송·OTT 및 IP 트랜스미디어",
                    "description": "파트너사 ''로크미디어''의 검증된 웹툰·웹소설 메가 히트 IP 라이브러리를 활용해, 원천 서사의 미디어 확장 사업을 전방위로 가동합니다.\n\n원천 스토리 IP를 고퀄리티 드라마·영화, 극장 및 글로벌 OTT용 웰메이드 콘텐츠로 가공·생산하여, 고부가가치 라이선싱을 실현합니다."
                }
            ]
        },
        {
            "label": "STRATEGY",
            "title": "4대 전략 비즈니스 필러",
            "items": [
                {
                    "title": "유튜브 오리지널",
                    "description": "고품질의 자체 포맷 기획을 통해 트렌디하고 화제성 높은 뉴미디어 오리지널 채널을 구축합니다."
                },
                {
                    "title": "방송 및 OTT",
                    "description": "기성 방송 채널 공급부터 글로벌 OTT 유통에 이르는 대형 미디어 제작 경쟁력을 확보합니다."
                },
                {
                    "title": "IP 트랜스미디어",
                    "description": "로크미디어 웹소설·웹툰 메가 원형 라이브러리를 영화·드라마·애니메이션으로 확장합니다."
                },
                {
                    "title": "탤런트 매니지먼트",
                    "description": "인플루언서, 전문 방송인, 연기자 등 미디어 파워 유저를 위한 체계적인 브랜딩 케어를 제공합니다."
                }
            ]
        }
    ]
}'::jsonb
where slug = 'about'
  and metadata->'sections' is null;
