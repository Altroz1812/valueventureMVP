# No executable SQL migrations distributed here

The historical SQL for the live BIGINT ValuationPro database is in
`database/HISTORY_DO_NOT_RERUN/`. The older UUID schema migration was moved to
`database/INCOMPATIBLE_UUID_SCHEMA_DO_NOT_RUN/` because it references
`public.organizations`, `public.valuation_cases`, and `public.site_visits`
from another schema and must not be applied to the existing live project.

Do **not** run `supabase db push` based on this source archive without first
reconciling the deployment's migration history and backing up the database.
This source cleanup did not modify the database.
