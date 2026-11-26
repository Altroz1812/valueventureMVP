// Targeted change for the Phase 5 case dossier. Does not touch database or unrelated screens.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || process.cwd());
const dossier = path.join(root, 'src', 'routes', 'cases_.$caseId.tsx');
const component = path.join(root, 'src', 'components', 'cases', 'vp-case-linked-records.tsx');
if (!fs.existsSync(dossier)) { console.error('STOP: No case dossier at', dossier); process.exit(1); }
if (!fs.existsSync(component)) { console.error('STOP: Copy the linked-records component to', component); process.exit(1); }
const before = fs.readFileSync(dossier, 'utf8');
if (before.includes('<VpCaseLinkedRecords ')) { console.log('ALREADY APPLIED: no changes'); process.exit(0); }
const anchor = '<Card><CardHeader><CardTitle className="text-sm">Field visit</CardTitle></CardHeader><CardContent className="space-y-1 text-sm text-muted-foreground">No verified visit record connected. Field Operations is Phase 3.</CardContent></Card>';
if (!before.includes(anchor)) {
  console.error('STOP: The current dossier differs from the Phase 5 source. No automatic edits were made.');
  console.error('Manually add: <VpCaseLinkedRecords caseNum={c.caseNum} bankName={c.bank} /> inside the Overview TabsContent.');
  process.exit(2);
}
const importLine = "import { VpCaseLinkedRecords } from '@/components/cases/vp-case-linked-records';\n";
if (before.includes('VpCaseLinkedRecords') && !before.includes(importLine.trim())) {
  console.error('STOP: Unexpected existing component symbol. Review manually.'); process.exit(2);
}
let output = before.replace(anchor, '<VpCaseLinkedRecords caseNum={c.caseNum} bankName={c.bank} />');
if (!output.includes(importLine.trim())) output = importLine + output;
const backup = `${dossier}.before-data-wiring-${new Date().toISOString().replace(/[:.]/g,'-')}.bak`;
fs.copyFileSync(dossier, backup);
fs.writeFileSync(dossier, output, 'utf8');
console.log('SUCCESS: linked bank, visits and QC records to Case Details');
console.log('Backup:', backup);
