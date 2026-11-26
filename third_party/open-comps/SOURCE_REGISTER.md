# P17 upstream integration register
Repository: https://github.com/property-hackers/open-comps
Pinned commit: a2c42772c766fe31eb900fd7368cf900cd8b8190 (2026-07-10).
License: MIT (see LICENSE; original copyright Chase Pursley).
Original text retrieved via GitHub file API at pinned commit, transcribed into the files here. The `nearby_sales.original.sql` file contains the original function excerpt only, not the whole upstream migration. No upstream schema migration is installed or required. These reference files are NOT deployment scripts.

| Upstream path | Reuse in this project | Changes |
|---|---|---|
| supabase/migrations/20260709240000_convert_measure.sql | sql/p17/01_CONVERTER.sql | Actual function body retained; name and search_path scoped; extra sqyd, gunta, cent and per_sqyd factors added; grants restricted. |
| supabase/migrations/20260709210000_comp_search_functions.sql (`nearby_sales`) | sql/p17/04_SEARCH.sql | Actual spatial query structure retained (RETURN QUERY, ST_Distance, ST_DWithin and nearest-first `<->` ordering); replace UUID schema and ZIP resolver with pinned P16 property revisions and BIGINT evidence; add tenant and category filters, date cutoff, type and area basis, verification and known-subject exclusion. |
| supabase/migrations/20260709210000_comp_search_functions.sql (`comps_for_property`) | sql/p17/04_SEARCH.sql | Adapted selection predicates (exclude subject, effective-date cutoff, age, verified-only), not full original function. Size/vintage filters and property-type taxonomies not ported. |
| supabase/tests/database/test_convert_measure.sql | sql/p17/07_CONVERTER_TESTS_READONLY.sql | 12 upstream assertions adapted for SQL Editor without pgTAP. |
| LICENSE | LICENSE | MIT attribution retained. |

Custom code: evidence schema, RLS, permissions, append-only capture, single independent review, case snapshot selection, all React UI/API, India-specific evidence categories and area bases. No upstream market datasets, scraper, valuation formula or dependencies imported. No new npm dependency. No complete Open-Comps application installed. Upstream tests not run; SQL live testing remains pending. Git blob SHA-1 comparison matched the original converter (`271795cf13465ccb57b79c50de65754d22308454`), original converter tests (`a030ae652f5c755186ebc94d090e3c3d8e1742f4`) and LICENSE (`9486400a050c5401ca9408d0eafc6a59869ac3b8`) exactly. The nearby_sales excerpt is not a complete blob; its upstream full-file blob is `f59bbd9ee0c5bb63726872d40b8920aa22ffa4b9`. Full source links: https://github.com/property-hackers/open-comps/tree/a2c42772c766fe31eb900fd7368cf900cd8b8190
