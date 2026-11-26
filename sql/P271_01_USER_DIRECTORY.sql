BEGIN;

CREATE OR REPLACE FUNCTION public.vp_list_users()
RETURNS TABLE (
    id text,
    org_id text,
    login text,
    name text,
    role text,
    active boolean,
    last_login timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $function$

    SELECT
        u.id::text,
        u.org_id::text,
        u.login,
        u.name,
        u.role,
        u.active,
        u.last_login
    FROM public.users u
    WHERE u.org_id = (
        SELECT public.vp_current_org_id()
    )
    AND (
        u.id = (
            SELECT public.vp_field_my_user_id()
        )
        OR (
            SELECT public.vp_sec_can('tenant.admin')
        )
        OR (
            SELECT public.vp_sec_can('field.Assign')
        )
        OR (
            SELECT public.vp_sec_can('qc.Edit')
        )
    )
    ORDER BY u.name;

$function$;

REVOKE ALL
ON FUNCTION public.vp_list_users()
FROM PUBLIC, anon;

GRANT EXECUTE
ON FUNCTION public.vp_list_users()
TO authenticated;

COMMIT;