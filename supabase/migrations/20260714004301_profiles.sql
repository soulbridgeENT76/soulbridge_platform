CREATE TABLE public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    email text not null unique,
    display_name text default ('관리자'),
    created_at timestamptz not null default now()
);

-- functions
-- 회원가입 시 profiles 자동 생성
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.profiles (id, email)
    values (new.id, new.email);
    return new;
end;
$$;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- RLS
-- 로그인 사용자 = 관리자. 조회/수정/삭제 모두 로그인만 하면 허용.
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.profiles to service_role;

alter table public.profiles enable row level security;

create policy "authenticated can read profiles"
    on public.profiles for select to authenticated
    using (true);

create policy "authenticated can update profiles"
    on public.profiles for update to authenticated
    using (true)
    with check (true);

create policy "authenticated can delete profiles"
    on public.profiles for delete to authenticated
    using (true);
