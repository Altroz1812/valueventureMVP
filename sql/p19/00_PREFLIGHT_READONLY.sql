SELECT to_regclass('public.vp_property_case_links') property_links,
 to_regclass('public.vp_property_revisions') property_revisions,
 to_regclass('public.vp_case_market_evidence') evidence,
 to_regclass('public.vp_qc_tasks') qc_tasks,
 to_regprocedure('public.vp_p17_convert_measure(numeric,text,text)') converter,
 to_regprocedure('public.vp_p2_valuer_inspection_for_case(integer)') approved_inspection,
 to_regprocedure('public.vp_report_can(text)') report_permission,
 to_regprocedure('public.vp_sec_case_visible(bigint)') case_visibility,
 to_regclass('public.vp_p19_analyses') existing_analysis;
