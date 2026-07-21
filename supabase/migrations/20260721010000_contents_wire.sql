-- contents 를 CMS 에 연결. contents.category 는 카테고리 이름을 텍스트로 담는다.
-- (카테고리 목록 관리는 이후 마이그레이션 20260721020000 에서 content_categories
--  테이블을 다시 세워 담당한다.)
--
-- 기존 스키마: category_id FK, 라우팅 slug 없음, 컬럼명 오타(tuhmbnail_type).
-- 테이블이 비어 있어 안전하게 정리한다.

alter table public.contents
    drop column category_id,
    add column category text not null default 'YOUTUBE',
    add column slug text not null unique,
    add column year text not null default '';

-- 오타 컬럼명 정정
alter table public.contents rename column tuhmbnail_type to thumbnail_type;

-- category_id FK 가 사라졌으니 카테고리 테이블도 제거한다.
drop table public.content_categories;

-- 그리드 정렬 인덱스 (created_at 순으로 조회)
create index contents_created_at_idx on public.contents (created_at);

-- ## 씨드 — 기존 정적 CONTENTS
-- description = 제목 하단 노트, content = 상세 본문(synopsis).
-- thumbnail_type 0=이미지 / 1=유튜브. 아직 실제 미디어가 없어 thumbnail_url 은 null.
-- created_at 을 어긋나게 넣어 기존 배열 순서를 보존한다.
insert into public.contents (slug, category, title, year, description, content, thumbnail_type, created_at)
values
    ('bridge-people-s1', 'YOUTUBE', '다리를 놓는 사람들 : 시즌 1', '2026', '인터뷰 다큐', '세상 어딘가에서 조용히 사람과 사람을 잇고 있는 이들을 찾아 나선 인터뷰 다큐멘터리입니다.
화려한 성공담이 아니라, 흔들리면서도 끝내 손을 내미는 순간에 카메라를 둡니다.
매 회차 한 사람의 진심을 온전히 담아, 지친 하루 끝의 시청자에게 다시 걸어갈 이유를 건넵니다.

매주 수요일 저녁, 소울브릿지ENT 공식 유튜브 채널에서 공개됩니다.

기획·제작 소울브릿지ENT
연출 김도현
촬영 이준서, 박민재
편집 정하늘
음악 소울브릿지 사운드
내레이션 손정은
제작총괄 손정은', 1, timestamptz '2026-07-21 00:00:01+00'),
    ('temperature-of-sincerity', 'YOUTUBE', '진심의 온도', '2026', '교양 시리즈', '우리는 하루에도 수없이 마음을 주고받지만, 그 온도를 들여다볼 틈은 좀처럼 없습니다.
「진심의 온도」는 평범한 일상 속 작은 진심이 사람을 어떻게 바꾸는지 차분히 따라가는 교양 시리즈입니다.
빠르게 소비되는 콘텐츠 사이에서, 오래 남을 온기를 이야기합니다.

기획·제작 소울브릿지ENT
연출 오세진
구성 한가람
촬영 박민재
편집 정하늘
음악 소울브릿지 사운드', 1, timestamptz '2026-07-21 00:00:02+00'),
    ('bridge-talk', 'YOUTUBE', '브릿지 토크', '2026', '인터뷰 예능', '편안한 자리, 솔직한 대화.
「브릿지 토크」는 화제의 인물을 무대가 아닌 눈높이에서 마주하는 인터뷰 예능입니다.
준비된 답변 대신 예상 밖의 진심이 터져 나오는 순간을 포착해, 보는 이에게 웃음과 여운을 동시에 남깁니다.

기획·제작 소울브릿지ENT
연출 김도현
작가 유서연, 한가람
촬영 이준서
편집 조은별
음악 소울브릿지 사운드
진행 손정은', 1, timestamptz '2026-07-21 00:00:03+00'),
    ('soulbridge-drama', 'DRAMA · OTT', '소울브릿지 (가제)', '2027', '공동 기획', '독점 원천 IP를 바탕으로 개발 중인 오리지널 드라마입니다.
서로 다른 세계에 속한 두 사람이 하나의 사건으로 연결되며 벌어지는 이야기를 그립니다.
소울브릿지ENT가 지향하는 ''메시지 중심 서사''를 고품질 영상 언어로 구현하는 첫 대형 프로젝트입니다.

2027년 방영을 목표로 프리프로덕션이 진행 중입니다.

기획 소울브릿지ENT
극본 개발 중
연출 캐스팅 예정
원작 IP 소울브릿지ENT
공동제작 소울브릿지ENT · 파트너 스튜디오
제작총괄 손정은', 0, timestamptz '2026-07-21 00:00:04+00'),
    ('art-of-connection', 'DRAMA · OTT', '연결의 기술', '2028', '글로벌 유통', '단절의 시대에 ''연결''은 기술일까, 마음일까.
글로벌 OTT 유통을 목표로 기획 중인 웰메이드 콘텐츠로, 문화와 언어를 넘어 공감을 만들어내는 이야기를 지향합니다.
원천 IP의 힘을 국제 무대에서 증명할 소울브릿지ENT의 글로벌 도전작입니다.

기획 소울브릿지ENT
극본 개발 중
원작 IP 소울브릿지ENT
공동제작 글로벌 파트너 협의 중
배급 글로벌 OTT (협의 중)
제작총괄 손정은', 0, timestamptz '2026-07-21 00:00:05+00'),
    ('second-season', 'WEBTOON', '두 번째 계절', '2027', '로크미디어 제휴', '로크미디어와 함께 선보이는 오리지널 웹툰입니다.
끝난 줄 알았던 계절이 다시 찾아오듯, 놓쳐버린 인연과 다시 마주하게 된 사람들의 이야기를 섬세한 감성으로 그립니다.
드라마·애니메이션으로 확장될 트랜스미디어 원형 IP입니다.

글 제휴 작가
그림 제휴 작가
기획 소울브릿지ENT
제공 로크미디어 · 소울브릿지ENT
IP 매니지먼트 소울브릿지ENT', 0, timestamptz '2026-07-21 00:00:06+00'),
    ('night-interview', 'WEBNOVEL', '밤의 인터뷰', '2027', '원천 IP', '모두가 잠든 시각, 한 통의 인터뷰 요청으로 시작되는 미스터리 웹소설입니다.
진실에 다가갈수록 드러나는 인물들의 내면을 촘촘한 심리 묘사로 파고듭니다.
영상화를 염두에 두고 설계된 독점 원천 IP로, 강력한 서사 확장 가능성을 지녔습니다.

글 제휴 작가
기획 소울브릿지ENT
편집 소울브릿지ENT 콘텐츠팀
원천 IP 소울브릿지ENT', 0, timestamptz '2026-07-21 00:00:07+00')
on conflict (slug) do nothing;
