-- READ ONLY. Expected: both functions installed, geofence rejection removed,
-- photo checks and assigned-officer checks retained.
SELECT p.proname AS function_name,
  has_function_privilege('authenticated',p.oid,'EXECUTE') AS authenticated_execute,
  position('Outside configured property geofence' in pg_get_functiondef(p.oid))=0 AS geofence_rejection_removed,
  position('Only the assigned officer' in pg_get_functiondef(p.oid))>0
    OR position('Only assigned officer' in pg_get_functiondef(p.oid))>0 AS officer_check_present,
  position('GPS captured' in pg_get_functiondef(p.oid))>0 AS gps_audit_present
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public' AND p.proname IN ('vp_field_checkin','vp_field_checkout')
ORDER BY p.proname;
-- Visit #2 status will remain Scheduled until its assigned officer retries check-in.
SELECT id,num,status,checkin_at,checkin_accuracy_m,checkout_at,checkout_accuracy_m
FROM public.vp_site_visits WHERE id=2;
