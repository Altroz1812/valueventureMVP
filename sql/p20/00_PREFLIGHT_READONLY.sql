SELECT to_regclass('public.vp_p19_analyses') analyses,
 to_regclass('public.vp_p19_reviews') reviews,
 to_regclass('public.vp_property_case_links') links,
 to_regclass('public.vp_qc_tasks') qc,
 to_regclass('public.banks') banks,
 to_regprocedure('public.vp_report_can(text)') report_permission,
 to_regprocedure('public.vp_current_org_id()') org_context,
 to_regclass('public.vp_p20_templates') existing_templates,
 to_regclass('public.vp_p20_exports') existing_exports;
