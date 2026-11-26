# P20 upstream source register
- Repository: https://github.com/dtjohnson/xlsx-populate
- Version: 1.21.0, upstream commit 7480a02575c9140c0e7995623ea192c88c1886d3 (2020-03-01).
- npm package `xlsx-populate` pinned in package.json. Original distribution `browser/xlsx-populate-no-encryption.js` (verified in upstream tree), loaded through dynamic import. API: `fromDataAsync`, `sheet`, `cell`, `formula`, `value`, `addSheet`, `outputAsync`. No copied implementation or modified upstream module. Package not downloaded or run here; actual integration is at source/dependency declaration level.
- Original MIT LICENSE (blob aaade452e2e8fb3748df4b13825bfa2a052b431d). Package manifest blob d688d907f0b5e4c01542f291366b0dfda92bf5f7; XlsxPopulate.js blob f5c0c49ad23e2560d0bc306784b0f293633ee29c.
- Custom code: report template registry, JSON cell mapping, Supabase RPC/RLS, P19 review checks, browser validation and export UI, audit sheet. No financial formula copied or changed.
- Upstream version is old; run npm audit and test real workbooks, browser bundle, feature fidelity, formulas and dependency security before production. No guarantee of full workbook feature preservation.
