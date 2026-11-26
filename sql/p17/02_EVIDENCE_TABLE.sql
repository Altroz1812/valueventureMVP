BEGIN;
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;
SET LOCAL search_path=pg_catalog,extensions,public;
CREATE TABLE public.vp_market_evidence (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 org_id bigint NOT NULL REFERENCES public.orgs(id),
 property_id bigint, property_revision integer,
 category text NOT NULL CHECK(category IN ('Land','House','Flat','Commercial','Industrial','Agricultural','Other')),
 kind text NOT NULL CHECK(kind IN ('registered_sale','broker_enquiry','asking_price','guideline','land_rate','previous_valuation')),
 label text NOT NULL CHECK(length(trim(label)) BETWEEN 1 AND 200),
 address text NOT NULL CHECK(length(trim(address)) BETWEEN 1 AND 2000),
 observed_on date NOT NULL CHECK(observed_on<=CURRENT_DATE),
 source_ref text NOT NULL CHECK(length(trim(source_ref)) BETWEEN 1 AND 2000),
 amount numeric NOT NULL CHECK(amount>0 AND amount<=1e15),
 area numeric NOT NULL CHECK(area>0 AND area<=1e12),
 area_unit text NOT NULL CHECK(area_unit IN ('sqyd','sqft','sqm','acre','gunta','cent','hectare')),
 area_basis text NOT NULL CHECK(area_basis IN ('land','builtup','carpet','superbuiltup')),
 road_access text NOT NULL DEFAULT '' CHECK(length(road_access)<=1000),
 notes text NOT NULL DEFAULT '' CHECK(length(notes)<=2000),
 latitude double precision, longitude double precision,
 location geography(Point,4326) GENERATED ALWAYS AS (CASE WHEN latitude IS NOT NULL AND longitude IS NOT NULL THEN ST_SetSRID(ST_MakePoint(longitude,latitude),4326)::geography END) STORED,
 status text NOT NULL DEFAULT 'unverified' CHECK(status IN ('unverified','verified','rejected')),
 created_by bigint NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
 reviewed_by bigint, reviewed_at timestamptz, review_reason text,
 CHECK ((latitude IS NULL AND longitude IS NULL) OR (latitude IS NOT NULL AND longitude IS NOT NULL AND latitude BETWEEN -90 AND 90 AND longitude BETWEEN -180 AND 180)),
 CHECK ((property_id IS NULL)=(property_revision IS NULL)),
 CHECK ((status='unverified' AND reviewed_by IS NULL AND reviewed_at IS NULL AND review_reason IS NULL) OR (status IN ('verified','rejected') AND reviewed_by IS NOT NULL AND reviewed_by<>created_by AND reviewed_at IS NOT NULL AND length(trim(review_reason)) BETWEEN 1 AND 1000)),
 UNIQUE(org_id,id),
 FOREIGN KEY(org_id,property_id,property_revision) REFERENCES public.vp_property_revisions(org_id,property_id,revision),
 FOREIGN KEY(org_id,created_by) REFERENCES public.users(org_id,id),
 FOREIGN KEY(org_id,reviewed_by) REFERENCES public.users(org_id,id)
);
CREATE INDEX vp_p17_location_idx ON public.vp_market_evidence USING gist(location);
CREATE INDEX vp_p17_org_date_idx ON public.vp_market_evidence(org_id,category,observed_on DESC,id DESC);
ALTER TABLE public.vp_market_evidence ENABLE ROW LEVEL SECURITY;
CREATE POLICY vp_p17_read ON public.vp_market_evidence FOR SELECT TO authenticated USING(org_id=(SELECT public.vp_current_org_id()) AND (SELECT public.vp_sec_can('cases.View')));
REVOKE ALL ON public.vp_market_evidence FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.vp_market_evidence TO authenticated;
COMMIT;
