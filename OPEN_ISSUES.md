# ValuationPro persistent defect register


## Official valuation integration - P28

| ID | Issue | Status |
|---|---|---|
| VP-001 | P23 frontend adoption | Source patch; live verification pending |
| VP-002 | Role Matrix and direct API access | Open |
| VP-003 | Tenant and branch isolation | Open |
| VP-004 | Field Officer submission and rework | Open |
| VP-005 | Maker-checker independence | Open |
| VP-006 | User lifecycle and recovery | Open |
| VP-007 | Administrator and back-office dashboard | Open |
| VP-008 | Actual OCR and persistence | Open |
| VP-009 | Unified property/inspection field mapping | Open |
| VP-010 | Bank template and Excel integration | Open |
| VP-011 | PDF generation and authorized release | Open |
| VP-012 | Report amendments and immutable history | Open |
| VP-013 | Mobile and accessibility | Open |
| VP-014 | Billing and MIS reconciliation | Open |
| VP-015 | Supabase project alignment | Open |
| VP-016 | Remaining dependency cleanup | Open |

No issue is closed solely because its source code compiles.


## Report Studio development status

P28.2: local automated verification reported passed.
Live P28 acceptance, unified field mapping and dedicated QC handoff remain open.

P29 report history: source implementation pending live acceptance.
VP-010 bank template and Excel verification remains open.
VP-011 final PDF pipeline and controlled release remains open.
VP-012 amendment workflow and immutable artifact verification remains open.

No historical defect is closed by this update.


## Report readback milestone

P29.1 report history: local automated verification reported passed.

P29.2: selected released report snapshot comparison, Final QC
reference readback, original workpaper/template traceability and
current PDF SHA-256 fingerprint added.

VP-010: actual bank workbook rendering and recalculation remain open.
VP-011: PDF generation and release-time artifact hash binding remain open.
VP-012: amendment workflow and historical artifact acceptance remain open.

Live cross-role verification is still required.
No previously recorded defects are closed.


## Bank workbook reconciliation

P29.2 local automated tests reported passed.

P29.3 adds original mapping readback, official snapshot
reconciliation and actual mapped Excel cell comparison.

VP-010 remains open for real bank templates, formula
recalculation, print layout and direct historical generation
from the released-report screen.

VP-011 and VP-012 remain open for final PDF generation,
release-time artifact integrity and amendment workflows.

No production acceptance is inferred from automated tests.


## PDF Studio and photographic annexure

P29.3 automated verification reported passed.

P29.4 provides internal A4 draft report preparation, stored
calculation presentation and scoped historical visit photographs.

VP-010: real bank XLSX layouts, formula recalculation and
direct historical workbook regeneration remain open.

VP-011: automatic bank-format PDF rendering, actual sketch
placement, immutable photo manifests, release-time binary
hashes and digital signature workflow remain open.

VP-012: controlled report amendments remain open.

Live browser, print, photo-access and cross-role tests remain
required. No previous defect has been closed.

## Release artifact integrity

P29.4 local automated verification reported passed.

P29.5 adds release-time storage object identity capture and
authorized metadata comparison. Database installation and
live release/readback acceptance remain pending.

VP-011 remains open for trusted binary SHA-256 verification,
bank-specific PDF rendering and digital signatures.

VP-012 remains open for controlled amendment workflows,
including post-delivery and invoiced-case restrictions.

Existing released reports have not been backfilled.

No previous defect is closed.


## Enterprise authorization synchronization

P30.1 introduces active-session permission refresh, same-origin
tab notification, own-branch allocation comparison, and cache
invalidation on authorization changes.

VP-002: live permission revocation and role matrix acceptance
remain open until tested with separate accounts.

VP-003: database case, visit, branch and tenant isolation
remain open for live negative tests.

VP-006: suspended accounts, provisioning and password-reset
runtime acceptance remain open.

VP-007: administrator and back-office dashboard acceptance
remains open.

P29.5 SQL installation and live release acceptance are not
assumed from this implementation.

All earlier unresolved issues remain open.

## P30.2 - Atomic user access management

Existing role and branch updates are coordinated through
vp_admin_save_user_access in one database transaction.

Source implementation supplied. SQL execution and local
verification must be recorded separately.

VP-002 remains open for live role revocation, direct RPC
authorization and Role Matrix persistence.

VP-003 remains open for branch selector filtering and
cross-branch database access tests.

VP-006 remains open for provisioning, account suspension,
password reset and existing-session tests.

Legacy administration RPCs remain available. Concurrent
updates through those paths require separate review.

No previously recorded defect is closed.
