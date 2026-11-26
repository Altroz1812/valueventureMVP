# ValuationPro — Frontend & backend recheck (10 November 2026)

**Basis:** user's latest `src(3).zip`, through the first safe-cleanup package `ValuationPro_Source_Cleaned_2026-11-10`. The original ZIP is untouched. This recheck operates on **source files only**; it does not update a live Supabase project.

## Actual code changes

| Area | Change | Why | Runtime behavior |
|---|---|---|---|
| Backend/data-access client helpers | Added `src/lib/vp-query.ts` and reused it in `src/lib/vp-cases.ts` and `src/lib/vp-field.ts` | Eliminated two almost-identical paged-fetch loops | Retains 500-row pages and tenant `org_id` filter. Case order remains descending by `num`; visits/photos remain ascending by `id` |
| Frontend case stage normalization | `vp-cases.ts` now derives recognized UI stages from the canonical `STAGES` list in `ops.ts` | Removed a second hard-coded version of the workflow stage list | No stage changes intended; a single source of truth for the eight UI stages |
| Frontend demo types | Removed the unused `BankMaster` interface from `data.ts`; clarified its legacy-settings comment | Avoids describing mock data as live bank data | No rendered screen change |
| Voice helper | Removed an unused public export on `matchSpokenOption`; kept its implementation | Reduces accidental API surface | Existing VoiceOption behavior unchanged |
| SQL/deployment | Moved an old UUID-based migration from `supabase/migrations/` into `database/INCOMPATIBLE_UUID_SCHEMA_DO_NOT_RUN/` | It targets `organizations`, `valuation_cases`, `site_visits` instead of live BIGINT `orgs`, `cases`, `vp_site_visits` | **No database change**. Never run `supabase db push` without checking remote migration history |
| Tests and checks | Added `src/test/vp-query.test.ts`, `tools/audit-clean-code.mjs`, and a read-only RPC existence query | Makes future refactors verifiable | No runtime change |

There were **no byte-for-byte duplicates among retained active TS/TSX source files**. Same-purpose but different-function Supabase clients (browser RLS and server admin) were deliberately kept separate. Historical SQL is not equivalent to redundant active code and has been retained for audit.

## Validation performed here

- New local source audit: **PASS** (341 local imports, 0 unresolved, 0 identical source-file groups, 0 private `.env` files, 0 incompatible migrations left in executable folder).
- Existing Phase 10 static audit: **18 PASS / 0 WARN / 0 FAIL**.
- Full-source static check: **21/21 PASS**.
- TypeScript/TSX syntax parsing: **PASS**, all source files (this is NOT type checking).
- Pure pagination regression tests: **PASS** (page offsets, partial final page and propagated server error), executed using a transpiled isolated helper without live Supabase access. A Vitest version is included for local testing.
- No `npm ci`, `npx tsc --noEmit`, `npm run build`, live login/RLS tests, browser voice tests, or SQL migration execution was possible in this environment. **Do not treat this package as production accepted.**

## Important gaps NOT hidden by the cleanup

1. **Legacy branch settings display misleading demo records.** `src/routes/admin.settings.branches.$id.tsx` uses mock `branches` and in-memory `branchOverrides` from `src/lib/data.ts`. Its Save currently changes local JavaScript state but does not persist to Supabase. A proper DB-backed settings screen and authorized RPC is needed. Removing the example data alone would break the route; the page was preserved and flagged, not silently replaced.
2. **Generated Supabase `types.ts` is for a UUID-based database**, while the ValuationPro application relies on the BIGINT schema and casts `vpDb` to a generic client. Regenerate types from the *actual live project* only after confirming schema; never use the old UUID types to generate SQL.
3. **Three user-management RPC names** appear in frontend/backend application calls but are **not defined in SQL bundled with this source**: `vp_admin_attach_invited_user`, `vp_admin_replace_user_branches`, `vp_admin_user_directory`. They may exist in the live project. Confirm through `database/diagnostics/check_user_management_rpcs_readonly.sql` before altering anything.
4. **Field Officer editability**, Tenant Owner controlled override, Excel inspection save/submit and reviewed transfer to valuation, speech-recognition behavior in actual browsers, cross-tenant RLS, QC role permissions and dashboard reconciliation still need authenticated end-to-end tests.
5. `supabase/functions/vp-provision-users` is a separate deployed Edge Function; this ZIP does not verify its deployment, secrets or permissions. The client-side `client.server.ts` is not an active frontend duplicate and must not be casually merged with the public Supabase client.

## Install and validate safely (Windows)

Extract this revised ZIP into a **new** folder, not on top of `D:\valuationpro-workspace-main`.

```powershell
cd D:\ValuationPro_Source_Rechecked_2026-11-10
Copy-Item .env.example .env
# Add only your own Supabase URL and publishable key to .env
npm ci
npm run audit:clean
npx tsc --noEmit
npm run build
npm test
node .\tools\audit-integrations.mjs .
node .\tools\verify-full-source.mjs .
```

Confirm live Case Creation, Field Operations, Field Inspection, QC, Users, Reports, Billing, Dashboard and tenant isolation before replacing the current working source. Do not copy or expose service-role/secret keys in browser environment variables. Do not execute historical or quarantined SQL migrations.
