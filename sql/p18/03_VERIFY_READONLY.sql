SELECT to_regclass('public.vp_p18_templates') AS template_register,
 to_regprocedure('public.vp_p18_publish_template(text,jsonb,text)') AS publisher;
SELECT c.relrowsecurity AS rls, has_table_privilege('authenticated',c.oid,'SELECT') AS can_read,
 has_table_privilege('authenticated',c.oid,'INSERT') AS direct_insert,
 has_table_privilege('authenticated',c.oid,'UPDATE') AS direct_update,
 has_table_privilege('anon',c.oid,'SELECT') AS anon_read
 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname='vp_p18_templates';
SELECT policyname,cmd,roles,qual FROM pg_policies WHERE schemaname='public' AND tablename='vp_p18_templates';
