CREATE TABLE objects (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

alter table objects enable row level security;

create policy "User can see their own objects only."
on objects
for select using ( (select auth.uid()) = user_id );
