create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create table if not exists body_parts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  image_key text,
  created_at timestamptz not null default now()
);

create table if not exists symptoms (
  id uuid primary key default gen_random_uuid(),
  body_part_id uuid not null references body_parts(id) on delete cascade,
  slug text unique not null,
  name text not null,
  description text,
  ai_updated_at timestamptz,
  seo_score int not null default 50 check (seo_score >= 0 and seo_score <= 100),
  created_at timestamptz not null default now()
);

create table if not exists medical_departments (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text
);

create table if not exists symptom_departments (
  id uuid primary key default gen_random_uuid(),
  symptom_id uuid not null references symptoms(id) on delete cascade,
  department_id uuid not null references medical_departments(id) on delete cascade,
  unique (symptom_id, department_id)
);

create table if not exists symptom_guidance (
  id uuid primary key default gen_random_uuid(),
  symptom_id uuid unique not null references symptoms(id) on delete cascade,
  see_doctor_soon text,
  emergency text,
  created_at timestamptz not null default now()
);

create table if not exists red_flags (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  description text not null
);

create table if not exists symptom_red_flags (
  id uuid primary key default gen_random_uuid(),
  symptom_id uuid not null references symptoms(id) on delete cascade,
  red_flag_id uuid not null references red_flags(id) on delete cascade,
  unique (symptom_id, red_flag_id)
);

create table if not exists symptom_synonyms (
  id uuid primary key default gen_random_uuid(),
  symptom_id uuid not null references symptoms(id) on delete cascade,
  synonym text not null,
  unique (symptom_id, synonym)
);

create table if not exists ai_generated_content (
  id uuid primary key default gen_random_uuid(),
  symptom_id uuid not null references symptoms(id) on delete cascade,
  type text not null check (type in ('faq', 'synonym', 'intent', 'link')),
  content jsonb not null,
  source text not null default 'daily-rule-engine',
  review_status text not null default 'pending' check (review_status in ('pending', 'approved', 'rejected')),
  safety_notes text,
  created_at timestamptz not null default now()
);

create index if not exists symptoms_body_part_id_idx on symptoms(body_part_id);
create index if not exists symptom_departments_symptom_id_idx on symptom_departments(symptom_id);
create index if not exists symptom_departments_department_id_idx on symptom_departments(department_id);
create index if not exists symptom_guidance_symptom_id_idx on symptom_guidance(symptom_id);
create index if not exists symptom_red_flags_symptom_id_idx on symptom_red_flags(symptom_id);
create index if not exists symptom_red_flags_red_flag_id_idx on symptom_red_flags(red_flag_id);
create index if not exists symptom_synonyms_symptom_id_idx on symptom_synonyms(symptom_id);
create index if not exists ai_generated_content_symptom_id_idx on ai_generated_content(symptom_id);
create index if not exists ai_generated_content_type_idx on ai_generated_content(type);
create index if not exists ai_generated_content_review_status_idx on ai_generated_content(review_status);

create index if not exists body_parts_name_trgm_idx on body_parts using gin (name gin_trgm_ops);
create index if not exists symptoms_name_trgm_idx on symptoms using gin (name gin_trgm_ops);
create index if not exists symptoms_description_trgm_idx on symptoms using gin (description gin_trgm_ops);
create index if not exists symptom_synonyms_synonym_trgm_idx on symptom_synonyms using gin (synonym gin_trgm_ops);

alter table body_parts enable row level security;
alter table symptoms enable row level security;
alter table medical_departments enable row level security;
alter table symptom_departments enable row level security;
alter table symptom_guidance enable row level security;
alter table red_flags enable row level security;
alter table symptom_red_flags enable row level security;
alter table symptom_synonyms enable row level security;
alter table ai_generated_content enable row level security;

drop policy if exists "Public read body parts" on body_parts;
create policy "Public read body parts" on body_parts for select using (true);

drop policy if exists "Public read symptoms" on symptoms;
create policy "Public read symptoms" on symptoms for select using (true);

drop policy if exists "Public read medical departments" on medical_departments;
create policy "Public read medical departments" on medical_departments for select using (true);

drop policy if exists "Public read symptom departments" on symptom_departments;
create policy "Public read symptom departments" on symptom_departments for select using (true);

drop policy if exists "Public read symptom guidance" on symptom_guidance;
create policy "Public read symptom guidance" on symptom_guidance for select using (true);

drop policy if exists "Public read red flags" on red_flags;
create policy "Public read red flags" on red_flags for select using (true);

drop policy if exists "Public read symptom red flags" on symptom_red_flags;
create policy "Public read symptom red flags" on symptom_red_flags for select using (true);

drop policy if exists "Public read symptom synonyms" on symptom_synonyms;
create policy "Public read symptom synonyms" on symptom_synonyms for select using (true);

drop policy if exists "Public read approved ai generated content" on ai_generated_content;
create policy "Public read approved ai generated content" on ai_generated_content for select using (review_status = 'approved');
