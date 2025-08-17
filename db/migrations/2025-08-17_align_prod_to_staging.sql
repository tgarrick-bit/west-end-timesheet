-- 2025-08-17_align_prod_to_staging.sql
-- Purpose: align production schema to staging superset used by manager approvals.
-- Safe/idempotent: only adds columns/types if missing and backfills from existing data.
-- Run order:
--   1) Staging first  : psql "$STG_DATABASE_URL"  -f 2025-08-17_align_prod_to_staging.sql
--   2) If clean, Prod : psql "$PROD_DATABASE_URL" -f 2025-08-17_align_prod_to_staging.sql

BEGIN;

-- 0) Essentials
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1) Enums (create if missing)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin','employee','approver','payroll');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='entry_status') THEN
    CREATE TYPE entry_status AS ENUM ('pending','approved','rejected');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='timesheet_status') THEN
    CREATE TYPE timesheet_status AS ENUM ('draft','submitted','approved','payroll_approved','rejected');
  END IF;
END $$;

-- 2) users: add role column if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='users' AND column_name='role'
  ) THEN
    ALTER TABLE public.users ADD COLUMN role user_role NOT NULL DEFAULT 'employee';
  END IF;
END $$;

-- 3) project_assignments: add pay_rate, bill_rate if missing
ALTER TABLE public.project_assignments
  ADD COLUMN IF NOT EXISTS pay_rate  numeric(12,2),
  ADD COLUMN IF NOT EXISTS bill_rate numeric(12,2);

-- 4) timesheets: add status column if missing and backfill
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='timesheets' AND column_name='status'
  ) THEN
    ALTER TABLE public.timesheets ADD COLUMN status timesheet_status;
  END IF;

  -- Backfill (one-time; safe to re-run due to WHERE status IS NULL)
  UPDATE public.timesheets ts
  SET status = CASE
    WHEN ts.rejection_reason IS NOT NULL THEN 'rejected'
    WHEN ts.payroll_approved_at IS NOT NULL THEN 'payroll_approved'
    WHEN ts.client_approved_at  IS NOT NULL THEN 'approved'
    WHEN ts.submitted_at        IS NOT NULL THEN 'submitted'
    ELSE 'draft'
  END
  WHERE ts.status IS NULL;
END $$;

-- 5) time_entries: add columns and backfill
DO $$
BEGIN
  -- Columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='time_entries' AND column_name='user_id') THEN
    ALTER TABLE public.time_entries ADD COLUMN user_id uuid;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='time_entries' AND column_name='date') THEN
    ALTER TABLE public.time_entries ADD COLUMN "date" date;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='time_entries' AND column_name='minutes') THEN
    ALTER TABLE public.time_entries ADD COLUMN minutes integer;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='time_entries' AND column_name='client_id') THEN
    ALTER TABLE public.time_entries ADD COLUMN client_id uuid;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='time_entries' AND column_name='assignment_id') THEN
    ALTER TABLE public.time_entries ADD COLUMN assignment_id uuid;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='time_entries' AND column_name='bill_rate_applied') THEN
    ALTER TABLE public.time_entries ADD COLUMN bill_rate_applied numeric(12,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='time_entries' AND column_name='status') THEN
    ALTER TABLE public.time_entries ADD COLUMN status entry_status;
  END IF;
END $$;

-- Backfill user_id from timesheets
UPDATE public.time_entries te
SET user_id = ts.user_id
FROM public.timesheets ts
WHERE te.timesheet_id = ts.id
  AND te.user_id IS NULL;

-- Backfill date from entry_date
UPDATE public.time_entries
SET "date" = entry_date
WHERE "date" IS NULL AND entry_date IS NOT NULL;

-- Backfill minutes from total_minutes, else compute from start/end
UPDATE public.time_entries
SET minutes = total_minutes
WHERE minutes IS NULL AND total_minutes IS NOT NULL;

UPDATE public.time_entries
SET minutes = ROUND((EXTRACT(EPOCH FROM ((end_time::time) - (start_time::time))) / 60.0))::int
WHERE minutes IS NULL AND start_time IS NOT NULL AND end_time IS NOT NULL;

-- Backfill client_id from projects
UPDATE public.time_entries te
SET client_id = p.client_id
FROM public.projects p
WHERE p.id = te.project_id
  AND te.client_id IS NULL;

-- Backfill assignment_id using the best matching assignment (by dates)
UPDATE public.time_entries te
SET assignment_id = pa.id
FROM LATERAL (
  SELECT id
  FROM public.project_assignments pa
  WHERE pa.user_id = te.user_id
    AND pa.project_id = te.project_id
    AND (pa.start_date IS NULL OR pa.start_date <= COALESCE(te."date", te.entry_date))
    AND (pa.end_date   IS NULL OR pa.end_date   >= COALESCE(te."date", te.entry_date))
  ORDER BY pa.start_date DESC NULLS LAST
  LIMIT 1
) pa
WHERE te.assignment_id IS NULL;

-- Backfill bill_rate_applied from assignment
UPDATE public.time_entries te
SET bill_rate_applied = pa.bill_rate
FROM public.project_assignments pa
WHERE te.assignment_id = pa.id
  AND te.bill_rate_applied IS NULL
  AND pa.bill_rate IS NOT NULL;

-- Backfill status from timesheets
UPDATE public.time_entries te
SET status = CASE
  WHEN ts.rejection_reason IS NOT NULL THEN 'rejected'
  WHEN ts.client_approved_at  IS NOT NULL THEN 'approved'
  ELSE 'pending'
END
FROM public.timesheets ts
WHERE te.timesheet_id = ts.id
  AND te.status IS NULL;

-- 6) FKs/indexes (safe to re-run)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='time_entries' AND column_name='user_id')
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='time_entries_user_id_fkey' AND conrelid='public.time_entries'::regclass) THEN
    ALTER TABLE public.time_entries
      ADD CONSTRAINT time_entries_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_time_entries_user_proj_date ON public.time_entries(user_id, project_id, "date");
CREATE INDEX IF NOT EXISTS idx_user_clients_user_client ON public.user_clients(user_id, client_id);

COMMIT;
