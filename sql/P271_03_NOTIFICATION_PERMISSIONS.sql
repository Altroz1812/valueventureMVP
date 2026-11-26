BEGIN;

REVOKE ALL
ON FUNCTION public.vp_alert_member()
FROM PUBLIC, anon;

REVOKE ALL
ON FUNCTION public.vp_alert_admin()
FROM PUBLIC, anon;

GRANT EXECUTE
ON FUNCTION public.vp_alert_member()
TO authenticated;

GRANT EXECUTE
ON FUNCTION public.vp_alert_admin()
TO authenticated;

COMMIT;