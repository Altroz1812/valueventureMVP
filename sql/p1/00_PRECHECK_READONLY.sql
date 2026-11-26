-- Run in Supabase SQL Editor. Read-only; does not change tenant data.
SELECT
 to_regclass('public.vp_field_inspections') IS NOT NULL AS inspection_table,
 to_regprocedure('public.vp_inspection_save(bigint,jsonb,boolean)') IS NOT NULL AS field_save_rpc,
 to_regprocedure('public.vp_p0_manager_inspection_save(bigint,jsonb,text)') IS NOT NULL AS manager_save_rpc,
 to_regprocedure('public.vp_p0_inspection_access(bigint)') IS NOT NULL AS access_rpc,
 to_regprocedure('public.vp_p1_inspection_save(bigint,jsonb,timestamp with time zone,boolean,text)') IS NOT NULL AS p1_save_already_present;
SELECT column_name,data_type FROM information_schema.columns
WHERE table_schema='public' AND table_name='vp_field_inspections'
AND column_name IN ('org_id','visit_id','data','status','updated_at','updated_by') ORDER BY column_name;
