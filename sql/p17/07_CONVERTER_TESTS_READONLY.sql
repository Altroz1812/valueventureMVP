-- Adapted from the upstream Open-Comps MIT test_convert_measure.sql (12 cases).
-- Every row should return true. No data writes or test extensions.
SELECT '100m to feet' AS test, round(public.vp_p17_convert_measure(100,'m','ft'),3)=328.084 AS passed
UNION ALL SELECT '5 miles to meters',public.vp_p17_convert_measure(5,'mi','m')=8046.72
UNION ALL SELECT '10km to miles',round(public.vp_p17_convert_measure(10,'km','mi'),4)=6.2137
UNION ALL SELECT '1387.56m to miles',round(public.vp_p17_convert_measure(1387.56,'m','mi'),2)=0.86
UNION ALL SELECT 'acre to sqft',public.vp_p17_convert_measure(1,'acre','sqft')=43560
UNION ALL SELECT 'hectare to sqm',public.vp_p17_convert_measure(1,'hectare','sqm')=10000
UNION ALL SELECT '100sqm to sqft',round(public.vp_p17_convert_measure(100,'sqm','sqft'),2)=1076.39
UNION ALL SELECT 'per sqft to per sqm',round(public.vp_p17_convert_measure(10,'per_sqft','per_sqm'),2)=107.64
UNION ALL SELECT 'same unit',public.vp_p17_convert_measure(42,'mi','mi')=42
UNION ALL SELECT 'null input',public.vp_p17_convert_measure(NULL,'m','ft') IS NULL;
DO $$
BEGIN
 BEGIN PERFORM public.vp_p17_convert_measure(1,'ft','sqm'); RAISE EXCEPTION 'Expected 22023 for mismatched dimensions'; EXCEPTION WHEN SQLSTATE '22023' THEN NULL; END;
 BEGIN PERFORM public.vp_p17_convert_measure(1,'furlong','m'); RAISE EXCEPTION 'Expected 22023 for unknown unit'; EXCEPTION WHEN SQLSTATE '22023' THEN NULL; END;
END $$;
SELECT 'Both error handling tests passed' AS result;
