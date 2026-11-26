# Quarantined migration for incompatible UUID-based schema

This file was originally at `supabase/migrations/20261104095551_2645a470-189f-4711-aaf7-0c8e80715bf1.sql`.
It references UUID tables `organizations`, `organization_branches`,
`valuation_cases`, `site_visits`, `valuation_reports`, and `profiles`,
which do **not** match ValuationPro's active BIGINT schema of `orgs`,
`cases`, `vp_site_visits`, etc. It is retained for audit, NOT deployment.

This relocation is source-only. No remote migration history was changed.
