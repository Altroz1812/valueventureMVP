import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(process.argv[2] ?? '.');
const read = (p) => fs.readFileSync(path.join(root,p),'utf8');
const list = (p) => fs.readdirSync(path.join(root,p));
const old = 'database/HISTORY_DO_NOT_RERUN/04_phase4_qc_management.sql';
const history = read(old);
const patch = read('sql/p15/01_QC_GPS_ALIGNMENT_STAGING.sql');
const ui = read('src/lib/vp-qc.ts');
const route = read('src/routes/qc-checking.tsx');
const archive = 'database/INCOMPATIBLE_UUID_SCHEMA_DO_NOT_RUN';
const checks = [
 ['no executable UUID migration', !list('supabase/migrations').some(n=>n.endsWith('.sql'))],
 ['historical UUID migration retained', list(archive).some(n=>n.endsWith('.sql'))],
 ['new GPS label matches SQL', ui.includes('GPS check-in and check-out recorded') && patch.includes('GPS check-in and check-out recorded')],
 ['new photo label matches SQL', ui.includes('Minimum 8 registered photos attached') && patch.includes('Minimum 8 registered photos attached')],
 ['new defect label matches SQL', ui.includes('GPS evidence missing or invalid') && patch.includes('GPS evidence missing or invalid')],
 ['old labels absent from active QC UI', !/GPS check-in within geofence|GPS outside geofence|Minimum 8 geotagged photos attached/.test(ui)],
 ['QC description states GPS recording only', route.includes('No geofence is enforced')],
 ['guarded function replacement preserves current bodies', patch.includes('pg_get_functiondef') && patch.includes('original_decide') && patch.includes('EXECUTE decide_def')],
 ['legacy guard matches actual archived SQL exactly', history.includes(patch.match(/\$old\$([\s\S]*?)\$old\$/)?.[1] ?? 'MISSING')],
 ['recorded coordinate/accuracy guard', ['checkin_at IS NULL','checkout_at IS NULL','checkin_lat BETWEEN','checkout_lat BETWEEN','checkin_accuracy_m > 0','checkout_accuracy_m > 0','checkout_at < v_visit.checkin_at'].every(n=>patch.includes(n))],
 ['checker and photo safeguards required', ['Only the assigned checker','Field officer cannot decide QC','greatest(8,v_visit.min_photos)'].every(n=>patch.includes(n))],
 ['no destructive table operations or grants', !/\b(DROP TABLE|TRUNCATE|DELETE FROM|GRANT EXECUTE)\b/i.test(patch)],
 ['transaction and idempotence guard', patch.includes('BEGIN;') && patch.includes('COMMIT;') && patch.includes('already installed')],
 ['no packaged private env or git metadata', !fs.existsSync(path.join(root,'.env')) && !fs.existsSync(path.join(root,'.git'))],
];
for (const [name,ok] of checks) console.log(`${ok?'PASS':'FAIL'} ${name}`);
assert.ok(checks.every(([,ok])=>ok), 'P15 static assertions failed');
console.log(`${checks.length}/${checks.length} P15 static assertions passed (not runtime SQL tests)`);
