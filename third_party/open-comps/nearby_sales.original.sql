CREATE FUNCTION nearby_sales(
    lat DOUBLE PRECISION DEFAULT NULL,
    long DOUBLE PRECISION DEFAULT NULL,
    zip TEXT DEFAULT NULL,
    radius_m DOUBLE PRECISION DEFAULT 5000
) RETURNS TABLE (
    sale_id UUID,
    property_id UUID,
    property_name TEXT,
    comp_type TEXT,
    sale_date DATE,
    currency CHAR(3),
    sale_price NUMERIC(14,2),
    price_per_area NUMERIC(10,2),
    price_per_unit NUMERIC(14,2),
    unit_count_at_sale INTEGER,
    cap_rate NUMERIC(5,2),
    sale_type sale_type,
    verification_status verification_status,
    dist_meters DOUBLE PRECISION
)
LANGUAGE plpgsql STABLE AS $$
DECLARE
    anchor GEOGRAPHY := resolve_search_anchor(lat, long, zip);
BEGIN
    RETURN QUERY
    SELECT ps.id, p.id, p.name, ct.code, ps.sale_date, ps.currency,
           ps.sale_price, ps.price_per_area, ps.price_per_unit,
           ps.unit_count_at_sale, ps.cap_rate, ps.sale_type,
           ps.verification_status,
           ST_Distance(p.location, anchor)
    FROM property_sales ps
    JOIN properties p ON p.id = ps.property_id
    LEFT JOIN comp_types ct ON ct.id = ps.comp_type_id
    WHERE p.location IS NOT NULL
      AND ST_DWithin(p.location, anchor, radius_m)
    ORDER BY p.location <-> anchor, ps.sale_date DESC;
END;
$$;
