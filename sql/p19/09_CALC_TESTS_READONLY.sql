-- SQL editor owner only. Synthetic examples, no customer data or writes.
DO $$
DECLARE v jsonb;
BEGIN
 v:=public.vp_p19_cost('{"parcels":[{"label":"P1","area":200,"unit":"sqyd","rate":45000,"source":"test"}],"floors":[{"label":"GF","area":1000,"rate":2000,"age":10,"life":50,"salvage":0,"source":"test"},{"label":"FF","area":800,"rate":2000,"age":5,"life":50,"salvage":0,"source":"test"}],"amenities":100000,"amenities_source":"test"}','House');
 IF (v->>'marketValue')::numeric<>12140000 OR (v->>'depreciation')::numeric<>560000 THEN RAISE EXCEPTION 'Cost test failed: %',v; END IF;
 v:=public.vp_p19_income('{"monthly_rent":50000,"vacancy_pct":10,"annual_expenses":40000,"cap_rate_pct":5,"rent_source":"test","cap_source":"test"}','Commercial');
 IF (v->>'marketValue')::numeric<>10000000 THEN RAISE EXCEPTION 'Income test failed: %',v; END IF;
 v:=public.vp_p19_comparison('{"basis":"land","subject_area":200,"area_source":"test","comparables":[{"evidence_id":"1","adjustment":10,"reason":"test"},{"evidence_id":"2","adjustment":0,"reason":"test"}]}','[{"evidence_id":"1","snapshot":{"kind":"registered_sale","status":"verified","category":"Land","area_basis":"land","amount":4000000,"area":100,"area_unit":"sqyd"}},{"evidence_id":"2","snapshot":{"kind":"registered_sale","status":"verified","category":"Land","area_basis":"land","amount":4600000,"area":100,"area_unit":"sqyd"}}]','Land');
 IF (v->>'marketValue')::numeric<>9000000 THEN RAISE EXCEPTION 'Comparison test failed: %',v; END IF;
 BEGIN
  PERFORM public.vp_p19_number('{"x":null}','x',0,100);
  RAISE EXCEPTION 'TEST FAILED: null accepted' USING ERRCODE='XX000';
 EXCEPTION WHEN raise_exception THEN NULL; END;
 BEGIN
  PERFORM public.vp_p19_income('{"monthly_rent":50000,"vacancy_pct":10,"annual_expenses":40000,"cap_rate_pct":0,"rent_source":"test","cap_source":"test"}','Commercial');
  RAISE EXCEPTION 'TEST FAILED: zero cap rate accepted' USING ERRCODE='XX000';
 EXCEPTION WHEN raise_exception THEN NULL; END;
 BEGIN
  PERFORM public.vp_p19_comparison('{"basis":"land","subject_area":200,"area_source":"test","comparables":[{"evidence_id":"1","adjustment":0,"reason":"test"}]}','[]','Land');
  RAISE EXCEPTION 'TEST FAILED: unselected evidence accepted' USING ERRCODE='XX000';
 EXCEPTION WHEN raise_exception THEN NULL; END;
END $$;
SELECT '6 P19 SQL calculation and rejection checks passed' AS result;
