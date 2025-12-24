# Supabase + Render Deployment Checklist

This project is deployed as **one Render Web Service**:

- Frontend is built to `dist/` via `npm run build`
- Backend API Gateway serves `dist/` and handles `/api/*`

## 1) Supabase: required environment variables

### Frontend (Vite)
Set these in Render (Environment):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Backend (API Gateway)
Set these in Render (Environment):

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` **(server-only; never expose to frontend)**

Optional overrides (use defaults if omitted):

- `SUPABASE_RAG_BUCKET=rag-documents`
- `SUPABASE_RAG_TABLE=rag_documents`

- `SUPABASE_CONFIG_TABLE=system_config`
- `SUPABASE_CONFIG_ID=default`

- `SUPABASE_RAG_DOCS_TABLE=rag_ingested_documents`
- `SUPABASE_RAG_VECTORS_TABLE=rag_vectors`

## 2) Supabase: Storage setup (private)

Create a bucket:

- Bucket name: `rag-documents`
- Public: **OFF** (private)

## 3) Supabase: SQL schema (copy/paste)

Run the following SQL in Supabase SQL Editor.

```sql
-- Admin config persistence
create table if not exists public.system_config (
  id text primary key,
  config jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists system_config_updated_at_idx
  on public.system_config (updated_at desc);

-- Uploaded document metadata (Storage references)
create table if not exists public.rag_documents (
  id text primary key,
  filename text not null,
  category text not null default 'general',
  uploaded_at timestamptz not null default now(),
  processed_at timestamptz null,
  status text not null default 'uploaded',
  chunk_count integer null,
  storage_bucket text not null default 'rag-documents',
  storage_path text null
);

create index if not exists rag_documents_uploaded_at_idx
  on public.rag_documents (uploaded_at desc);

-- Ingested documents used by RAG service
create table if not exists public.rag_ingested_documents (
  id text primary key,
  title text not null,
  content text not null,
  source text not null,
  category text not null default 'general',
  uploaded_at timestamptz not null default now()
);

-- Vector chunks (JSON embedding for now)
create table if not exists public.rag_vectors (
  id text primary key,
  doc_id text not null references public.rag_ingested_documents(id) on delete cascade,
  chunk_index integer not null,
  text text not null,
  embedding jsonb not null,
  title text not null,
  source text not null,
  category text not null default 'general'
);

create index if not exists rag_vectors_doc_id_idx on public.rag_vectors (doc_id);
create index if not exists rag_vectors_category_idx on public.rag_vectors (category);
```

## 4) Render settings

### Build command

```bash
npm install && npm run build
```

### Start command

```bash
npm run start
```

## 5) Notes

- `/admin` and `/documents` are admin-only.
- Document downloads/previews use signed URLs:
  - `GET /api/documents/:id/url`
- RAG + config persistence uses Supabase when `SUPABASE_SERVICE_ROLE_KEY` is set; otherwise local JSON fallback is used.
