BEGIN;
CREATE FUNCTION public.vp_p19_number(p jsonb,k text,lo numeric,hi numeric) RETURNS numeric
LANGUAGE plpgsql IMMUTABLE SET search_path='' AS $$
DECLARE v numeric;
BEGIN
 IF jsonb_typeof(p->k) IS DISTINCT FROM 'number' THEN RAISE EXCEPTION 'Missing numeric field: %',k; END IF;
 v:=(p->>k)::numeric;
 IF v<lo OR v>hi THEN RAISE EXCEPTION 'Out of range: %',k; END IF;
 RETURN v;
END $$;
CREATE FUNCTION public.vp_p19_text(p jsonb,k text) RETURNS text
LANGUAGE plpgsql IMMUTABLE SET search_path='' AS $$
BEGIN
 IF jsonb_typeof(p->k) IS DISTINCT FROM 'string' OR length(btrim(p->>k)) NOT BETWEEN 1 AND 1000 THEN
 RAISE EXCEPTION 'Source or reason required: %',k; END IF;
 RETURN btrim(p->>k);
END $$;
REVOKE ALL ON FUNCTION public.vp_p19_number(jsonb,text,numeric,numeric),public.vp_p19_text(jsonb,text) FROM PUBLIC,anon,authenticated;
COMMIT;
