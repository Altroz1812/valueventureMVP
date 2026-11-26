-- P21: prerequisites only; no changes.
SELECT to_regclass('public.vp_p6_saved_ocr') AS ocr_register,
 to_regclass('public.vp_property_master') AS property_master,
 to_regclass('public.vp_property_current_links') AS current_links,
 to_regprocedure('public.vp_sec_case_visible(bigint)') AS case_visibility,
 to_regprocedure('public.vp_p6_save_ocr(bigint,integer,text,text,jsonb,jsonb,integer)') AS save_ocr,
 to_regprocedure('public.vp_p6_ocr_history(integer,bigint)') AS ocr_history,
 to_regprocedure('public.vp_p16_save_property(bigint,integer,jsonb,text)') AS save_property;
