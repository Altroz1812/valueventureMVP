-- Adapted from Open-Comps MIT; see third_party/open-comps/LICENSE and SOURCE_REGISTER.md.
BEGIN;
CREATE OR REPLACE FUNCTION public.vp_p17_convert_measure(val NUMERIC, from_unit TEXT, to_unit TEXT)
RETURNS NUMERIC
LANGUAGE plpgsql IMMUTABLE SET search_path='' AS $$
DECLARE
    from_dim TEXT; from_factor NUMERIC;
    to_dim TEXT;   to_factor NUMERIC;
BEGIN
    IF val IS NULL THEN
        RETURN NULL;
    END IF;

    SELECT u.dim, u.factor INTO from_dim, from_factor
    FROM (VALUES
        ('m', 'length', 1.0), ('km', 'length', 1000.0),
        ('ft', 'length', 0.3048), ('yd', 'length', 0.9144),
        ('mi', 'length', 1609.344),
        ('sqm', 'area', 1.0), ('sqft', 'area', 0.09290304),
        ('acre', 'area', 4046.8564224), ('hectare', 'area', 10000.0),
        ('sqyd', 'area', 0.83612736), ('gunta', 'area', 101.17141056),
        ('cent', 'area', 40.468564224),
        ('per_sqyd', 'per_area', 1.0 / 0.83612736),
        ('per_sqm', 'per_area', 1.0),
        ('per_sqft', 'per_area', 10.763910416709722)
    ) AS u(unit, dim, factor)
    WHERE u.unit = from_unit;
    IF from_dim IS NULL THEN
        RAISE EXCEPTION
            'unknown unit "%"',
            from_unit USING ERRCODE = '22023';
    END IF;

    SELECT u.dim, u.factor INTO to_dim, to_factor
    FROM (VALUES
        ('m', 'length', 1.0), ('km', 'length', 1000.0),
        ('ft', 'length', 0.3048), ('yd', 'length', 0.9144),
        ('mi', 'length', 1609.344),
        ('sqm', 'area', 1.0), ('sqft', 'area', 0.09290304),
        ('acre', 'area', 4046.8564224), ('hectare', 'area', 10000.0),
        ('sqyd', 'area', 0.83612736), ('gunta', 'area', 101.17141056),
        ('cent', 'area', 40.468564224),
        ('per_sqyd', 'per_area', 1.0 / 0.83612736),
        ('per_sqm', 'per_area', 1.0),
        ('per_sqft', 'per_area', 10.763910416709722)
    ) AS u(unit, dim, factor)
    WHERE u.unit = to_unit;
    IF to_dim IS NULL THEN
        RAISE EXCEPTION
            'unknown unit "%"',
            to_unit USING ERRCODE = '22023';
    END IF;

    IF from_dim <> to_dim THEN
        RAISE EXCEPTION 'cannot convert % (%) to % (%)',
            from_unit, from_dim, to_unit, to_dim USING ERRCODE = '22023';
    END IF;

    RETURN val * from_factor / to_factor;
END;
$$;
REVOKE ALL ON FUNCTION public.vp_p17_convert_measure(numeric,text,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.vp_p17_convert_measure(numeric,text,text) TO authenticated;
COMMIT;
