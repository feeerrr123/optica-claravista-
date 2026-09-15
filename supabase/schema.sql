-- Óptica Claravista — tabla de citas.
-- Pégalo en Supabase → SQL Editor → Run. Se puede ejecutar tal cual una sola vez.

create extension if not exists pgcrypto; -- para gen_random_uuid()

create table if not exists public.citas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text not null,
  email text not null,
  servicio text not null,
  mensaje text default '',
  fecha date not null,
  hora time not null,
  duracion_min integer not null default 30,
  estado text not null default 'confirmada' check (estado in ('confirmada', 'cancelada')),
  google_event_id text,
  token text not null unique,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

-- No se puede reservar dos veces el mismo hueco (solo cuenta si sigue confirmada).
create unique index if not exists citas_hueco_unico
  on public.citas (fecha, hora)
  where estado = 'confirmada';

-- Búsqueda rápida por el enlace de gestión.
create index if not exists citas_token_idx on public.citas (token);

-- RLS activado y SIN políticas: nadie entra con la clave pública (anon).
-- Solo el servidor, con la clave de servicio (SUPABASE_SERVICE_ROLE_KEY),
-- puede leer o escribir esta tabla. Esa clave nunca sale del backend.
alter table public.citas enable row level security;
