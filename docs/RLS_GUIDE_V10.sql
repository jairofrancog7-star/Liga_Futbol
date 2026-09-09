-- RLS_GUIDE_V10.sql
-- Guía, NO ejecutar ciegamente. Ajustar a roles reales.

alter table players enable row level security;
alter table teams enable row level security;
alter table matches enable row level security;
alter table match_events enable row level security;
alter table sanctions enable row level security;
alter table shots enable row level security;
alter table predictions enable row level security;
alter table mvp_votes enable row level security;

-- Ejemplo: lectura pública de datos no privados.
-- La producción debería exponer una vista pública de players sin `private_profile`.
-- Nunca crear una policy SELECT pública sobre documentos privados.

-- Ejemplo conceptual:
-- create policy "public read teams" on teams for select using (is_active = true);
-- create policy "public read matches" on matches for select using (true);

-- Para escrituras administrativas:
-- usar auth.uid() + tabla profile_roles y políticas por rol.
-- No confiar sólo en checks del frontend.
