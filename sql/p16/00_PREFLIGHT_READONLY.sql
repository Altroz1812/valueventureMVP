-- Read-only: review prerequisites before installing P16. No historical migrations required.
SELECT current_database(),current_user,now() AS checked_at;
WITH expected(t,c,typ) AS (VALUES ('orgs','id','bigint'),('users','id','bigint'),('users','org_id','bigint'),('cases','org_id','bigint'),('cases','num','integer'))
SELECT e.*,i.data_type actual_type,coalesce(i.data_type=e.typ,false) AS matches FROM expected e LEFT JOIN information_schema.columns i ON i.table_schema='public' AND i.table_name=e.t AND i.column_name=e.c;
SELECT s,to_regprocedure(s) IS NOT NULL AS installed FROM unnest(ARRAY['public.vp_current_org_id()','public.vp_field_my_user_id()','public.vp_sec_can(text)','public.vp_sec_case_visible(bigint)']) s;
SELECT conrelid::regclass AS relation,pg_get_constraintdef(oid) AS definition FROM pg_constraint WHERE conrelid IN ('public.cases'::regclass,'public.users'::regclass) AND contype IN ('p','u');
SELECT to_regclass('public.vp_property_master') AS master,to_regclass('public.vp_property_revisions') AS revisions,to_regclass('public.vp_property_case_links') AS links;
