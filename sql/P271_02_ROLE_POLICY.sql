BEGIN;

CREATE FUNCTION public.vp_baseline_own_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $function$

    SELECT u.role
    FROM public.users u
    JOIN public.valuation_auth_links l
        ON l.user_id = u.id
    WHERE l.auth_uid = (SELECT auth.uid())
      AND u.active IS TRUE
      AND u.org_id = (
          SELECT public.vp_current_org_id()
      )
    LIMIT 1;

$function$;

REVOKE ALL
ON FUNCTION public.vp_baseline_own_role()
FROM PUBLIC, anon;

GRANT EXECUTE
ON FUNCTION public.vp_baseline_own_role()
TO authenticated;

ALTER POLICY vp_p10_role_perms_gate
ON public.role_perms
USING (
    org_id = (
        SELECT public.vp_current_org_id()
    )
    AND (
        (
            SELECT public.vp_sec_can('tenant.admin')
        )
        OR role = (
            SELECT public.vp_baseline_own_role()
        )
    )
);

COMMIT;