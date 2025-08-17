\echo === BASIC ===
SELECT current_database() AS db, current_user AS "user", now() AS ts;

\echo === ROW COUNTS (key tables) ===
SELECT 'users' tbl, count(*) FROM public.users
UNION ALL SELECT 'clients', count(*) FROM public.clients
UNION ALL SELECT 'projects', count(*) FROM public.projects
UNION ALL SELECT 'tasks', count(*) FROM public.tasks
UNION ALL SELECT 'project_assignments', count(*) FROM public.project_assignments
UNION ALL SELECT 'timesheets', count(*) FROM public.timesheets
UNION ALL SELECT 'time_entries', count(*) FROM public.time_entries
UNION ALL SELECT 'expense_reports', count(*) FROM public.expense_reports
UNION ALL SELECT 'expense_items', count(*) FROM public.expense_items
UNION ALL SELECT 'user_clients', count(*) FROM public.user_clients
UNION ALL SELECT 'approvals', count(*) FROM public.approvals
UNION ALL SELECT 'export_batches', count(*) FROM public.export_batches
UNION ALL SELECT 'export_lines', count(*) FROM public.export_lines
ORDER BY 1;

\echo === COLUMN SHAPES (drift check) ===
SELECT table_name,
       string_agg(column_name || ':' || data_type, ', ' ORDER BY ordinal_position) AS cols
FROM information_schema.columns
WHERE table_schema='public'
  AND table_name IN ('users','clients','projects','tasks',
                     'project_assignments','timesheets','time_entries')
GROUP BY table_name
ORDER BY table_name;
