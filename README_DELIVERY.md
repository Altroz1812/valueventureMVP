# ValuationPro — Integrated source delivery (10 November 2026)

**This is a reconstructed complete SOURCE tree, not a verified production deployment.**
It was assembled from the ValuationPro workspace ZIP previously supplied in this conversation and separate Phase 1–12 patches; the latest November 10 Windows workspace was **not uploaded**. Therefore, changes made locally after those archives may differ. Keep a backup of your current project and compare before replacing anything.

## Included source
- TanStack Start, React, Vite, TypeScript, Supabase BIGINT multi-tenant architecture; existing case, branch, bank, roles, field visits, QC, reports, billing and analytics code.
- Field Operations schedule/visit voice controls, visit-linked **Valuation Report (Excel 1–9)** action; photo category tagging, GPS and expense interfaces retained.
- Excel-aligned Field Inspection: header and sections 1–9; editable field-level dictation; setbacks, floor areas, boundary comparisons, risk observations, evidence notes. JSON keys retained for previously entered inspection values.
- Case Creation voice-enabled inputs and QC remarks/checklist voice entry. English (India), Hindi and Telugu browser speech-recognition choices, with limited vocabulary normalization.
- Read-only Field QC inspection summary; Case Details live linked-records panel; live dashboard; real alert inbox; Analytics & Audit and Data Connections routes; direct/bulk user provisioning source.
- Source SQL for new inspection RPC/table, plus historical phase migrations separately (DO NOT RE-RUN over an existing project).
- `Valuation_Report_Reference.xlsx` is the original supplied workbook (unaltered).

## Safe setup in Windows PowerShell
1. Back up `D:\valuationpro-workspace-main` and your Supabase database first.
2. Extract to a **separate folder**, e.g. `D:\valuationpro-integrated`. Do not blindly replace your local project; compare your newer source first.
3. `cd D:\valuationpro-integrated`
4. `Copy-Item .env.example .env` and update **ONLY** your Supabase URL and public publishable key from your own project. Do not put service_role or sb_secret values in the browser `.env`.
5. `npm install`
6. `npm run dev` (first start lets TanStack Router regenerate `src/routeTree.gen.ts` for the new routes).
7. In another terminal: `npx tsc --noEmit` then `npm run build`, then `node tools/verify-full-source.mjs .` and `node tools/audit-integrations.mjs .`.
8. Confirm the app opens, log in to your valid tenant, visit `Field Operations → Valuation Report (Excel 1–9)` for an assigned visit, then test every stage with authorized test records.

## Database / field editing
- Run `database/inspection/00_preflight_readonly.sql` and `02_verify_readonly.sql` in **Supabase SQL Editor**, **not PowerShell**.
- **Only if `vp_field_inspections` and RPCs are missing:** examine and then apply `01_inspection_additive.sql` in STAGING after backup. Do not replace or re-create core BIGINT tables.
- For assigned officer draft entry in `Scheduled` status, examine the existing deployed `vp_inspection_save` function, then consider `03_optional_scheduled_draft_rpc.sql` (STAGING first). It changes an existing SECURITY DEFINER RPC and must not overwrite a newer customized function. Submission still requires `On site`/`Completed`; assignment, tenant isolation and QC locks remain server-enforced.
- Photo notes in the spreadsheet form are separate from actual photo uploads through Field Operations.
- The evidence bucket and RPC authorization must be tested using signed-in users of BOTH organizations. RLS-enabled status alone is insufficient.

## Important limitations / pending production acceptance
- This archive cannot automatically incorporate changes made only on your current Windows disk. It therefore must NOT be considered a final production sign-off.
- Build was **not executable in the packaging environment** because npm registry requests failed with EAI_AGAIN. Static TS/TSX parsing and source audit were run, not a full npm build.
- New routes require the generated route tree to update during `npm run dev/build`.
- The app needs your own Supabase environment and previously deployed Phase 1–9 migrations. Historical SQL is for review, not an installation script over a populated database.
- Authenticated UI/browser microphone tests, live save/reload, Scheduled-draft RPC, QC role enforcement, multi-tenant negative tests, invoice reconciliation and backup restore remain to be independently verified.
- External email/WhatsApp delivery, automatic generation of bank-specific signed valuation PDFs, and cryptographic digital signatures are NOT implemented or verified by this ZIP.
- Speech recognition uses supported browsers and HTTPS/localhost, may use a third-party recognition service and may misrecognize spoken measurements. Verify every number, option and address before saving.

## Security
Never commit `.env`, service-role keys, passwords, customer data exports, or private file storage tokens. Existing `supabase/functions/vp-provision-users` requires deployment with server-only secrets and role/tenant checks.
