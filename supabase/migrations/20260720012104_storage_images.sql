-- ## 이미지 버킷
-- src/shared/config/storage.ts 의 MEDIA_BUCKET · MEDIA_FOLDER 와 1:1 대응한다.
--
-- public = true 인 이유: 헤더·푸터 로고는 비로그인 방문자에게도 보여야 한다.
-- 서명 URL로 바꾸면 렌더마다 서버 왕복이 생겨 CDN 캐시가 무의미해진다.
--
-- 사진류는 webp만: 업로더(admin-image-upload.tsx)가 모든 원본을 webp로 재인코딩한다.
-- 로고만 예외로 svg 원본을 그대로 저장한다(벡터라 재인코딩하면 오히려 손해). 그 외
-- 타입이 올라올 경로가 없으므로 두 종류로 좁혀둔다.
--
-- on conflict: supabase start 가 config.toml 을 보고 이미 만들어둔 버킷과 충돌하지
-- 않도록. 마이그레이션을 몇 번 돌려도 같은 상태로 수렴한다.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('images', 'images', true, 52428800, array['image/webp', 'image/svg+xml'])
on conflict (id) do update
    set public             = excluded.public,
        file_size_limit    = excluded.file_size_limit,
        allowed_mime_types = excluded.allowed_mime_types;

-- ## RLS
-- 조회는 누구나(비로그인 포함), 쓰기는 로그인 관리자만 — page_contents 와 같은 정책.
--
-- storage.objects 에는 alter table ... enable row level security 를 걸지 않는다:
-- 소유자가 supabase_storage_admin 이라 must be owner 로 실패하고, Supabase가 이미
-- RLS를 켜둔 상태다. grant 도 기본 설정에 포함돼 있어 정책만 추가하면 된다.
create policy "public can read images"
    on storage.objects for select to anon, authenticated
    using (bucket_id = 'images');

-- for all: 로그인 사용자는 이 버킷의 어떤 객체든 지울 수 있다. 모든 로그인 사용자가
-- 관리자라는 이 프로젝트의 전제(config.toml 의 enable_signup = false)에 따른 것으로,
-- 테이블 정책들과 동일한 신뢰 모델이다.
create policy "authenticated can write images"
    on storage.objects for all to authenticated
    using (bucket_id = 'images')
    with check (bucket_id = 'images');

-- ## brand.logo 형태 정리
-- 이전 버그(update-brand/api/actions.ts 가 File 을 String() 으로 변환)로 로고 칸에
-- '[object File]' 문자열이 저장된 DB가 있다. 문자열에는 폭 정보가 없어 객체로
-- 승격할 수 없으므로 null(= public/logo.png 폴백)로 되돌린다.
update public.site_settings
   set brand = jsonb_set(brand, '{logo}', 'null'::jsonb)
 where brand ? 'logo'
   and jsonb_typeof(brand -> 'logo') not in ('object', 'null');
