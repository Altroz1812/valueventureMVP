SELECT to_regclass('public.vp_property_master') AS master,to_regclass('public.vp_property_revisions') AS revisions,to_regclass('public.vp_property_case_links') AS links;
SELECT s,to_regprocedure(s) IS NOT NULL AS installed FROM unnest(ARRAY['public.vp_current_org_id()','public.vp_field_my_user_id()','public.vp_sec_can(text)','public.vp_sec_case_visible(bigint)']) s;
SELECT e.extname,n.nspname FROM pg_extension e JOIN pg_namespace n ON n.oid=e.extnamespace WHERE e.extname='postgis';
SELECT name,default_version,installed_version FROM pg_available_extensions WHERE name='postgis';
