import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(process.argv[2] ?? '.');
let passed = 0;
function check(rel, token) {
  const filename = path.join(root, rel);
  if (!fs.existsSync(filename) || !fs.readFileSync(filename, 'utf8').includes(token)) {
    throw new Error(`FAIL: ${rel} missing expected: ${token}`);
  }
  passed++;
  console.log(`PASS ${rel} :: ${token}`);
}
check('src/lib/vp-p5-rpc-diagnostics.ts', "code === 'PGRST202'");
check('src/lib/vp-p5-rpc-diagnostics.ts', "code === '42501'");
check('src/components/cases/vp-inspection-valuation-review.tsx', 'classifyReadRpcProbe(query.error)');
check('src/components/cases/vp-inspection-valuation-review.tsx', 'No valuation or inspection data was changed.');
check('src/routes/admin.data-integrity.tsx', "rpc: 'vp_p2_valuer_inspection_for_case'");
check('src/routes/admin.data-integrity.tsx', "rpc: 'vp_p2_transfer_history'");
check('src/routes/admin.data-integrity.tsx', "p_case_num: 0");
check('sql/p5/00_BACKEND_READINESS_READONLY.sql', 'vp_p2_save_reviewed_valuation');
check('tests/p5-rpc-diagnostics.test.ts', "'missing'");
check('src/lib/vp-local-ocr.ts', 'tesseract');
console.log(`P5 source preflight: ${passed}/${passed} checks passed. Not a runtime acceptance test.`);
