SELECT c.relname,c.relrowsecurity,has_table_privilege('authenticated',c.oid,'SELECT') can_read,
 has_table_privilege('authenticated',c.oid,'INSERT,UPDATE,DELETE') any_direct_write
FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public' AND c.relname IN ('vp_p20_templates','vp_p20_exports');
SELECT p.proname,p.prosecdef,has_function_privilege('authenticated',p.oid,'EXECUTE') authenticated_execute,
 has_function_privilege('anon',p.oid,'EXECUTE') anon_execute
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public' AND p.proname IN ('vp_p20_publish','vp_p20_prepare');
SELECT tablename,policyname,cmd,qual FROM pg_policies WHERE schemaname='public' AND tablename IN ('vp_p20_templates','vp_p20_exports');
