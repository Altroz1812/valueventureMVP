BEGIN;
CREATE FUNCTION public.vp_p19_income(p jsonb,cat text) RETURNS jsonb
LANGUAGE plpgsql IMMUTABLE SET search_path='' AS $$
DECLARE rent numeric; vacancy numeric; expenses numeric; cap numeric; noi numeric;
BEGIN
 IF cat NOT IN ('House','Flat','Commercial') THEN RAISE EXCEPTION 'Income method not available for land'; END IF;
 rent:=public.vp_p19_number(p,'monthly_rent',0.01,1e12);
 vacancy:=public.vp_p19_number(p,'vacancy_pct',0,100);expenses:=public.vp_p19_number(p,'annual_expenses',0,1e12);
 cap:=public.vp_p19_number(p,'cap_rate_pct',0.01,100);
 PERFORM public.vp_p19_text(p,'rent_source');PERFORM public.vp_p19_text(p,'cap_source');
 noi:=rent*12*(1-vacancy/100)-expenses;
 IF noi<=0 THEN RAISE EXCEPTION 'Net operating income must be positive'; END IF;
 RETURN jsonb_build_object('annualGrossRent',rent*12,'effectiveRent',rent*12*(1-vacancy/100),'annualExpenses',expenses,'netOperatingIncome',noi,'capRatePct',cap,'marketValue',round(noi/(cap/100),2));
END $$;
REVOKE ALL ON FUNCTION public.vp_p19_income(jsonb,text) FROM PUBLIC,anon,authenticated;
COMMIT;
