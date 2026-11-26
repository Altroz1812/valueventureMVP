-- P9: run in Supabase SQL Editor on STAGING. Does not modify anything.
SELECT key, exists_ok FROM (VALUES
 ('cases', to_regclass('public.cases') IS NOT NULL),
 ('visits', to_regclass('public.vp_site_visits') IS NOT NULL),
 ('photo registry', to_regclass('public.vp_visit_photos') IS NOT NULL),
 ('field inspections', to_regclass('public.vp_field_inspections') IS NOT NULL),
 ('inspection access', to_regprocedure('public.vp_p0_inspection_access(bigint)') IS NOT NULL),
 ('inspection save', to_regprocedure('public.vp_p1_inspection_save(bigint,jsonb,timestamptz,boolean,text)') IS NOT NULL),
 ('self identity', to_regprocedure('public.vp_field_my_user_id()') IS NOT NULL),
 ('tenant identity', to_regprocedure('public.vp_current_org_id()') IS NOT NULL),
 ('existing QC', to_regclass('public.vp_qc_tasks') IS NOT NULL),
 ('activity log', to_regclass('public.log') IS NOT NULL)
) AS prerequisites(key, exists_ok);
SELECT column_name,data_type FROM information_schema.columns
WHERE table_schema='public' AND ((table_name='cases' AND column_name IN ('org_id','num','cust','addr','meta','stage'))
OR (table_name='vp_site_visits' AND column_name IN ('org_id','id','num','assigned_user_id','scheduled_at','status','checkin_at','updated_at'))
OR (table_name='users' AND column_name IN ('org_id','id','login')))
ORDER BY table_name,column_name;
