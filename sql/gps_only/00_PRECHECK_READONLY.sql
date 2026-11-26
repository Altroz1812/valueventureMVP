-- READ ONLY: use in Supabase SQL Editor before the geofence-removal patch.
-- No rows are modified. Do not run the historical Phase 3 schema script again.
SELECT
  to_regprocedure('public.vp_field_checkin(bigint,double precision,double precision,numeric)') IS NOT NULL AS checkin_rpc,
  to_regprocedure('public.vp_field_checkout(bigint,double precision,double precision,numeric)') IS NOT NULL AS checkout_rpc,
  to_regprocedure('public.vp_field_distance_m(double precision,double precision,double precision,double precision)') IS NOT NULL AS distance_function,
  to_regclass('public.vp_site_visits') IS NOT NULL AS site_visits_table,
  to_regclass('public.vp_visit_photos') IS NOT NULL AS visit_photos_table;

-- Check actual function bodies before replacement. If your project has customized
-- logic, review that logic and merge the tiny geofence change manually.
SELECT p.oid::regprocedure AS signature,
       pg_get_functiondef(p.oid) AS existing_definition
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public' AND p.proname IN ('vp_field_checkin','vp_field_checkout')
ORDER BY p.proname;

-- Optional: view the exact visit that was blocked (only if Visit #2 exists).
SELECT id,org_id,num,status,assigned_user_id,radius_m,max_accuracy_m,
       checkin_at,checkout_at FROM public.vp_site_visits WHERE id=2;
