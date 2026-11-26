# P18 JSON Forms source integration register

- Repository: https://github.com/eclipsesource/jsonforms
- Release: v3.8.0, commit 6075bcee93205c8fbe1f88eec19ed9058ad0f965 (2026-06-16).
- Actual package imports: `@jsonforms/react` (`JsonForms`), `@jsonforms/vanilla-renderers` (`vanillaRenderers`, `vanillaCells`), `@jsonforms/core` (schema types); all pinned to exactly 3.8.0 in package.json.
- Verified upstream manifests: `packages/core/package.json`, `packages/react/package.json`, `packages/vanilla-renderers/package.json` at v3.8.0; React and vanilla peer dependencies allow React ^19.0.0.
- License: identical MIT text for the three packages, upstream blob 064ca1d9d2c6e0e301befe1097d62c647ecc111c. License retained here; installed packages retain their own notices.
- Upstream implementation is NOT rewritten or copied into application files. Installation will fetch the actual official npm artifacts; npm registry DNS/network access was unavailable during preparation, so packages and updated lockfile have NOT been materialized/tested. Run npm install locally before npm ci.
- Independent application code: bounded template definitions, category defaults, conversion to JSON Schema/UI schema, tenant template publication RPC, snapshot storage, original save/submit integration, reviewer summary, scoped styles and ValuationPro tests. No claim of reuse of ValuatorX or COVAL source. No upstream JSON Forms tests were run.
- P17 retains its existing Open-Comps source integration register, unchanged.
