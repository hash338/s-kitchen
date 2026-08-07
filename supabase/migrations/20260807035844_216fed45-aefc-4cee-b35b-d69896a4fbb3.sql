insert into public.user_roles (user_id, role)
select id, 'admin'::app_role from auth.users where email in ('admin@gmail.com','hasanyounes5412@gmail.com')
on conflict (user_id, role) do nothing;