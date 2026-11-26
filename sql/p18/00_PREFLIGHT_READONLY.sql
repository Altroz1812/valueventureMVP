SELECT to_regclass('public.vp_field_inspections') AS inspection_table,
 to_regprocedure('public.vp_p1_inspection_save(bigint,jsonb,timestamptz,boolean,text)') AS save_rpc,
 to_regprocedure('public.vp_current_org_id()') AS tenant_helper,
 to_regprocedure('public.vp_field_my_user_id()') AS actor_helper,
 to_regprocedure('public.vp_is_admin(bigint)') AS admin_helper,
 to_regclass('public.vp_p18_templates') AS existing_p18;
