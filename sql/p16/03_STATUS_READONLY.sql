SELECT to_regclass('public.vp_property_master') AS master,
 to_regclass('public.vp_property_revisions') AS revisions,
 to_regclass('public.vp_property_case_links') AS links,
 to_regprocedure('public.vp_p16_validate(jsonb)') AS validator,
 to_regprocedure('public.vp_p16_save_property(bigint,integer,jsonb,text)') AS save_rpc,
 to_regprocedure('public.vp_p16_link_case(integer,bigint,integer,integer,text)') AS link_rpc;
