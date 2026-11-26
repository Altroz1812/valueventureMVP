# ValuationPro — Remove Geofence Restriction, Keep GPS Audit (2026-11-16)

## Why
A 1-metre geofence rejected Visit #2 because the browser measured 2 metres from
its configured property pin; the same GPS reading reported 167 metres of uncertainty.
This package removes distance/accuracy thresholds **as check-in/out blockers**.
It DOES NOT remove GPS, staff assignment, required photographs, logs, RLS, or QC.

## Database (Supabase SQL Editor, **not** PowerShell)
1. Back up the project and test in staging. This package was checked against the
   bundled Phase 3 function bodies, **not your live database's current functions**.
2. Run `sql/00_PRECHECK_READONLY.sql`. Compare existing definitions with your
   live implementation. If customized, **do not run the replacement blindly**.
3. After review, run `sql/01_DISABLE_GEOFENCE_KEEP_GPS.sql`.
4. Run `sql/02_VERIFY_READONLY.sql`.
5. Do **not** rerun old Phase 1–9 scripts or reset visits/cases.

This SQL preserves the original function signatures, assignments, tenant checks,
status transitions, registered-photo count, case stage updates, audit logs and
permissions. It does not delete historical pins/radius data. For new check-ins,
`checkin_verified` / `checkout_verified` is intentionally `false`: without a
geofence, coordinates are **recorded**, not independently verified.

## Frontend (P8 source baseline)
After backing up your project, copy these paths into the same relative locations:
- `src/routes/field-operations.tsx`
- `src/routes/admin.branches.tsx`
- `src/routes/onboarding.tsx`
- `src/components/cases/vp-case-linked-records.tsx`

These full replacement files are based on the **P8 integrated source**. If your
local files include additional changes, diff and merge instead of overwriting.
The scheduling RPC signature remains unchanged; existing stored property pin
settings are retained during rescheduling but are no longer editable or enforced.

Run:
```powershell
npx tsc --noEmit
npm test
npm run build
```

## Acceptance test
- Visit #2 still Scheduled; assigned officer checks in with GPS as before.
- GPS and accuracy recorded; no geofence rejection, even with poor accuracy.
- Unauthorized/unassigned user cannot check in.
- Check-out still requires registered site photos.
- Check-out records GPS, accuracy, photos; case workflow/QC remain unchanged.
- History shows GPS **recorded**, never **geofence verified**.

## Caveat
Browser GPS can be imprecise or spoofed. With geofence disabled, attendance is
supported by GPS metadata, assigned officer, timestamp and photographic evidence,
not guaranteed proof the officer was physically at the property.

## Separate blockers
Missing P0 `vp_p0_inspection_access` and P1 `vp_p1_inspection_save` are not fixed
by this change; those still require separate backend reconciliation.
