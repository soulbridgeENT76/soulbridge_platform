-- 콘텐츠 slug 를 선택값으로 바꾼다.
--
-- 지정하지 않으면 id(uuid)가 라우팅 식별자가 된다 (예: /contents/<uuid>).
-- 제목 기반 자동 생성은 없앤다 — 한글 제목이 지저분한 slug 를 만들기 때문.
--
-- unique 제약은 유지: nullable 이라 slug 없는(NULL) 행은 여럿 공존할 수 있고,
-- 지정된 slug 끼리는 여전히 유일하다.
alter table public.contents alter column slug drop not null;
