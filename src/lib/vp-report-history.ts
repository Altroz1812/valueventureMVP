
type ObjectRow = Record<string, unknown>;

function asRow(value: unknown): ObjectRow {
  return value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value)
      ? value as ObjectRow
      : {};
}

function positiveVersion(value: unknown): number | null {
  return typeof value === 'number' &&
    Number.isSafeInteger(value) &&
    value > 0
      ? value
      : null;
}

function label(value: unknown): string {
  return typeof value === 'string' && value.trim()
    ? value
    : 'Not recorded';
}

export function reportVersion(value: unknown): number {
  return positiveVersion(asRow(value)['version_no']) ?? 0;
}

export function caseReportHistory<T>(
  rows: readonly T[],
  caseNum: number
): T[] {
  if (!Number.isSafeInteger(caseNum) || caseNum <= 0) return [];

  return rows.filter(value => {
    const row = asRow(value);

    return row['num'] === caseNum &&
      reportVersion(value) > 0 &&
      (
        row['status'] === 'Draft' ||
        row['status'] === 'Released'
      );
  }).sort((a, b) => reportVersion(b) - reportVersion(a));
}

export function releasedHistory<T>(
  rows: readonly T[]
): T[] {
  return rows.filter(
    row => asRow(row)['status'] === 'Released'
  ).sort((a, b) => reportVersion(b) - reportVersion(a));
}

export function chooseReleasedReport<T>(
  rows: readonly T[],
  selection: string | null
): T | undefined {
  const released = releasedHistory(rows);

  if (!released.length) return undefined;

  const target = selection === null
    ? reportVersion(released[0])
    : Number(selection);

  if (!Number.isSafeInteger(target) || target <= 0) {
    return undefined;
  }

  const matches = released.filter(
    row => reportVersion(row) === target
  );

  // Never select an ambiguous or unavailable version.
  return matches.length === 1 ? matches[0] : undefined;
}

export function reportProvenance(value: unknown) {
  const row = asRow(value);
  const snapshot = asRow(row['case_snapshot']);
  const inputs = asRow(row['inputs_snapshot']);

  const method = label(snapshot['valuation_method']);

  return {
    reportVersion: reportVersion(value),
    valuationVersion:
      positiveVersion(row['valuation_version_no']),
    format: label(row['format_name']),
    status: label(row['status']),
    bank: label(snapshot['bank']),
    property: label(snapshot['property_address']),
    method,
    workpaper: label(
      snapshot['p20_export_id'] ??
      inputs['export_id']
    ),
    releasedAt: label(row['released_at']),
    registration: label(row['released_reg_no'])
  };
}


export type ReportReadbackCheck = {
  label: string;
  status: 'Matched' | 'Mismatch' | 'Unavailable' | 'Not applicable';
  detail: string;
};

function canonicalSnapshot(value: unknown): string {
  if (value === undefined) return 'undefined';

  if (Array.isArray(value)) {
    return '[' + value.map(canonicalSnapshot).join(',') + ']';
  }

  if (value !== null && typeof value === 'object') {
    const row = value as Record<string, unknown>;

    return '{' + Object.keys(row).sort().map(key =>
      JSON.stringify(key) + ':' + canonicalSnapshot(row[key])
    ).join(',') + '}';
  }

  return JSON.stringify(value) ?? 'undefined';
}

export function snapshotsEqual(a: unknown, b: unknown): boolean {
  if (a === undefined || b === undefined ||
      a === null || b === null) return false;

  return canonicalSnapshot(a) === canonicalSnapshot(b);
}

export function reportIdentifier(value: unknown): string | null {
  const id =
    typeof value === 'number' && Number.isSafeInteger(value)
      ? String(value)
      : typeof value === 'string'
        ? value
        : '';

  if (!/^[1-9][0-9]{0,18}$/.test(id)) return null;

  if (id.length === 19 && id > '9223372036854775807') {
    return null;
  }

  return id;
}

export function validReportPdfPath(
  value: unknown,
  orgId: string,
  caseNum: number
): value is string {
  if (!reportIdentifier(orgId) ||
      !Number.isSafeInteger(caseNum) ||
      caseNum <= 0) return false;

  if (typeof value !== 'string') return false;

  const segments = value.split('/');

  return segments.length >= 3 &&
    segments[0] === orgId &&
    segments[1] === String(caseNum) &&
    segments.every(part =>
      part.length > 0 &&
      part !== '.' &&
      part !== '..' &&
      !part.includes('\\') &&
      !part.includes('%')
    );
}

export function hasPdfHeader(bytes: Uint8Array): boolean {
  return bytes.length >= 5 &&
    bytes[0] === 37 &&
    bytes[1] === 80 &&
    bytes[2] === 68 &&
    bytes[3] === 70 &&
    bytes[4] === 45;
}

export function checkReportSnapshots(
  reportValue: unknown,
  officialValue: unknown,
  qcValue: unknown,
  exportValue: unknown,
  templateValue: unknown
): ReportReadbackCheck[] {
  const report = asRow(reportValue);
  const official = asRow(officialValue);
  const qc = asRow(qcValue);
  const workpaper = asRow(exportValue);
  const template = asRow(templateValue);
  const inputs = asRow(report['inputs_snapshot']);
  const caseData = asRow(report['case_snapshot']);
  const property = asRow(inputs['property_snapshot']);

  const checks: ReportReadbackCheck[] = [];

  function add(
    label: string,
    available: boolean,
    matched: boolean,
    detail: string
  ) {
    checks.push({
      label,
      status: !available
        ? 'Unavailable'
        : matched ? 'Matched' : 'Mismatch',
      detail
    });
  }

  const officialExists = Object.keys(official).length > 0;

  add(
    'Official valuation reference',
    officialExists,
    official['version_no'] === report['valuation_version_no'] &&
      official['num'] === report['num'] &&
      reportIdentifier(official['org_id']) !== null &&
      reportIdentifier(official['org_id']) ===
        reportIdentifier(report['org_id']),
    'Exact report-linked official valuation version'
  );

  add(
    'Valuation inputs',
    officialExists,
    snapshotsEqual(
      report['inputs_snapshot'], official['inputs']
    ),
    'Stored report inputs compared with official inputs'
  );

  add(
    'Valuation calculations',
    officialExists,
    snapshotsEqual(
      report['calculations_snapshot'], official['calculations']
    ),
    'Stored calculation snapshot compared without recalculation'
  );

  add(
    'Final QC reference',
    Object.keys(qc).length > 0,
    reportIdentifier(qc['id']) !== null &&
      reportIdentifier(qc['id']) ===
        reportIdentifier(report['final_qc_task_id']) &&
      reportIdentifier(qc['org_id']) ===
        reportIdentifier(report['org_id']) &&
      qc['num'] === report['num'] &&
      qc['review_stage'] === 'Final QC' &&
      qc['status'] === 'Approved',
    'Referenced approval record; not a separate proof of version binding'
  );

  const method = String(
    official['method'] ?? caseData['valuation_method'] ?? ''
  );

  if (!officialExists && !method) {
    checks.push({
      label: 'Bank workpaper',
      status: 'Unavailable',
      detail: 'Valuation method could not be established'
    });

    return checks;
  }

  if (!method.startsWith('P19 ')) {
    checks.push({
      label: 'Bank workpaper',
      status: 'Not applicable',
      detail: 'Legacy valuation method'
    });

    return checks;
  }

  const exportId = reportIdentifier(caseData['p20_export_id']);
  const inputExportId = reportIdentifier(inputs['export_id']);

  add(
    'Adopted workpaper reference',
    Object.keys(workpaper).length > 0,
    exportId !== null &&
      exportId === inputExportId &&
      exportId === reportIdentifier(workpaper['id']) &&
      reportIdentifier(workpaper['org_id']) ===
        reportIdentifier(report['org_id']) &&
      workpaper['num'] === report['num'] &&
      workpaper['analysis_version'] === inputs['analysis_version'],
    'Workpaper ' + (exportId ?? 'not recorded')
  );

  add(
    'Original bank template',
    Object.keys(template).length > 0,
    reportIdentifier(template['id']) !== null &&
      reportIdentifier(template['id']) ===
        reportIdentifier(workpaper['template_id']) &&
      reportIdentifier(template['org_id']) ===
        reportIdentifier(report['org_id']) &&
      template['bank_name'] === caseData['bank'] &&
      template['category'] === property['category'],
    String(template['title'] ?? 'Template unavailable')
  );

  return checks;
}


export type BankCellValue = string | number | boolean | null;

export type BankMappedCell = {
  field: string;
  sheet: string;
  cell: string;
  expected: BankCellValue;
  reference: 'Matched' | 'Mismatch' | 'Registered only';
};

export type BankCellResult = {
  status: 'Matched' | 'Mismatch' | 'Formula' | 'Unavailable';
  actual: string;
};

const requiredBankFields = [
  'status',
  'case_num',
  'method',
  'analysis_version',
  'marketValue'
];

const calculationFields = [
  'marketValue',
  'guidelineValue',
  'realizableValue',
  'distressValue',
  'landValue',
  'buildingValue',
  'replacementCost',
  'depreciation',
  'amenities',
  'adoptedRate',
  'basis',
  'netOperatingIncome',
  'capRatePct',
  'annualGrossRent',
  'annualExpenses'
];

const allowedBankFields = new Set([
  ...requiredBankFields,
  ...calculationFields,
  'bank',
  'customer',
  'category',
  'address',
  'property_label',
  'effective_date',
  'formula_version',
  'reason',
  'review_reason'
]);

function bankScalar(value: unknown): BankCellValue {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  if (typeof value === 'string' ||
      typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  throw new Error('Invalid mapped workbook value');
}

export function validBankCell(address: string): boolean {
  const match = /^([A-Z]{1,3})([1-9][0-9]{0,6})$/.exec(address);

  if (!match) return false;

  let column = 0;

  for (const letter of match[1]!) {
    column = column * 26 + letter.charCodeAt(0) - 64;
  }

  return column <= 16384 &&
    Number(match[2]) <= 1048576;
}

export function buildBankMappingReadback(
  reportValue: unknown,
  workpaperValue: unknown,
  templateValue: unknown
): BankMappedCell[] {
  const report = asRow(reportValue);
  const workpaper = asRow(workpaperValue);
  const template = asRow(templateValue);

  const inputs = asRow(report['inputs_snapshot']);
  const calculations = asRow(report['calculations_snapshot']);
  const caseData = asRow(report['case_snapshot']);
  const property = asRow(inputs['property_snapshot']);
  const analysisInputs = asRow(inputs['analysis_inputs']);
  const values = asRow(workpaper['cell_values']);

  if (!reportIdentifier(workpaper['id']) ||
      reportIdentifier(workpaper['id']) !==
        reportIdentifier(caseData['p20_export_id']) ||
      reportIdentifier(workpaper['id']) !==
        reportIdentifier(inputs['export_id']) ||
      workpaper['num'] !== report['num'] ||
      workpaper['analysis_version'] !==
        inputs['analysis_version'] ||
      reportIdentifier(template['id']) !==
        reportIdentifier(workpaper['template_id']) ||
      reportIdentifier(report['org_id']) === null ||
      reportIdentifier(report['org_id']) !==
        reportIdentifier(workpaper['org_id']) ||
      reportIdentifier(report['org_id']) !==
        reportIdentifier(template['org_id']) ||
      template['bank_name'] !== caseData['bank'] ||
      template['category'] !== property['category']) {
    throw new Error('Original workpaper or template reference mismatch');
  }

  const mapping = template['mapping'];

  if (!Array.isArray(mapping) ||
      mapping.length < 5 ||
      mapping.length > 80) {
    throw new Error('Invalid registered bank mapping');
  }

  const source = new Map<string, unknown>();

  source.set('status', 'REVIEWED WORKPAPER - NOT RELEASED');
  source.set('case_num', report['num']);
  source.set('bank', caseData['bank']);
  source.set('category', property['category']);
  source.set('address', property['address']);
  source.set('property_label', property['label']);
  source.set('effective_date', inputs['effective_date']);
  source.set('method', inputs['method']);
  source.set('analysis_version', inputs['analysis_version']);
  source.set('formula_version', inputs['formula_version']);
  source.set('reason', analysisInputs['reason']);

  for (const field of calculationFields) {
    source.set(field, calculations[field]);
  }

  const seenTargets = new Set<string>();
  const seenFields = new Set<string>();

  const result = mapping.map(value => {
    const row = asRow(value);

    if (Object.keys(row).sort().join(',') !== 'cell,field,sheet') {
      throw new Error('Unexpected mapping structure');
    }

    const field = row['field'];
    const sheet = row['sheet'];
    const cell = row['cell'];

    if (typeof field !== 'string' ||
        !allowedBankFields.has(field) ||
        typeof sheet !== 'string' ||
        !sheet.trim() ||
        sheet.trim() !== sheet ||
        sheet.length > 31 ||
        sheet.toLowerCase() === '_vp20_audit' ||
        typeof cell !== 'string' ||
        !validBankCell(cell)) {
      throw new Error('Invalid bank mapping field or address');
    }

    const target = sheet.toLowerCase() + ':' + cell;

    if (seenTargets.has(target)) {
      throw new Error('Duplicate bank mapping target: ' + target);
    }

    seenTargets.add(target);
    seenFields.add(field);

    const expected = bankScalar(values[field]);

    let reference: BankMappedCell['reference'] =
      'Registered only';

    if (source.has(field)) {
      const official = bankScalar(source.get(field));

      reference = official === expected
        ? 'Matched'
        : 'Mismatch';
    }

    if (requiredBankFields.includes(field) &&
        expected === null) {
      reference = 'Mismatch';
    }

    if (field === 'marketValue' &&
        (typeof expected !== 'number' || expected < 0)) {
      reference = 'Mismatch';
    }

    return { field, sheet, cell, expected, reference };
  });

  if (requiredBankFields.some(field => !seenFields.has(field))) {
    throw new Error('Required bank mapping fields missing');
  }

  return result;
}

export function compareBankCell(
  expected: BankCellValue,
  actual: unknown,
  formula: unknown
): BankCellResult {
  if (formula !== undefined &&
      formula !== null &&
      formula !== '') {
    return {
      status: 'Formula',
      actual: 'Formula requires manual verification'
    };
  }

  try {
    const parsed = bankScalar(actual);

    return {
      status: parsed === expected ? 'Matched' : 'Mismatch',
      actual: parsed === null ? '(Blank)' : String(parsed)
    };

  } catch {
    return {
      status: 'Unavailable',
      actual: 'Unsupported cell value'
    };
  }
}


export type ReportInspectionReference = {
  visitId: string;
  revision: string;
};

export function reportInspectionReference(
  reportValue: unknown
): ReportInspectionReference | null {
  const report = asRow(reportValue);
  const inputs = asRow(report['inputs_snapshot']);
  const inspection = asRow(inputs['inspection_snapshot']);

  const visitId = reportIdentifier(inspection['visit_id']);
  const revision = inspection['updated_at'];

  if (!visitId ||
      typeof revision !== 'string' ||
      !Number.isFinite(Date.parse(revision))) {
    return null;
  }

  return { visitId, revision };
}

export function reportAmount(value: unknown): string {
  if (typeof value !== 'number' ||
      !Number.isFinite(value) ||
      value < 0) {
    return 'Not recorded';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(value);
}

export function validAnnexPhoto(
  value: unknown,
  orgId: string,
  caseNum: number,
  reference: ReportInspectionReference
): boolean {
  const row = asRow(value);
  const mime = row['mime'];
  const storagePath = row['storage_path'];
  const size = row['size'];
  const uploadedAt = row['uploaded_at'];

  if (!reportIdentifier(orgId) ||
      !reportIdentifier(reference.visitId) ||
      !Number.isSafeInteger(caseNum) ||
      caseNum <= 0 ||
      !reportIdentifier(row['id']) ||
      reportIdentifier(row['org_id']) !== orgId ||
      reportIdentifier(row['visit_id']) !== reference.visitId) {
    return false;
  }

  if (typeof storagePath !== 'string' ||
      typeof size !== 'number' ||
      !Number.isInteger(size) ||
      size < 1 ||
      size > 10485760 ||
      typeof uploadedAt !== 'string' ||
      !Number.isFinite(Date.parse(uploadedAt)) ||
      !Number.isFinite(Date.parse(reference.revision)) ||
      Date.parse(uploadedAt) > Date.parse(reference.revision)) {
    return false;
  }

  const segments = storagePath.split('/');

  if (segments.length !== 4 ||
      segments[0] !== orgId ||
      segments[1] !== String(caseNum) ||
      segments[2] !== reference.visitId) {
    return false;
  }

  const name = segments[3] ?? '';

  const extension =
    mime === 'image/jpeg' ? 'jpg' :
    mime === 'image/png' ? 'png' :
    mime === 'image/webp' ? 'webp' : '';

  if (!extension) return false;

  const match =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/i
      .exec(name);

  return match !== null && match[1] === extension;
}

export function validAnnexImage(
  bytes: Uint8Array,
  mime: unknown
): boolean {
  if (mime === 'image/jpeg') {
    return bytes.length > 3 &&
      bytes[0] === 255 &&
      bytes[1] === 216 &&
      bytes[2] === 255;
  }

  if (mime === 'image/png') {
    return bytes.length > 8 &&
      [137,80,78,71,13,10,26,10].every(
        (value,index) => bytes[index] === value
      );
  }

  if (mime === 'image/webp') {
    return bytes.length > 12 &&
      bytes[0] === 82 && bytes[1] === 73 &&
      bytes[2] === 70 && bytes[3] === 70 &&
      bytes[8] === 87 && bytes[9] === 69 &&
      bytes[10] === 66 && bytes[11] === 80;
  }

  return false;
}

export function parseReleaseArtifactReadback(
  value: unknown
): ReportReadbackCheck {

  const row = asRow(value);

  const label = 'Release-time storage metadata';

  switch (row['status']) {

    case 'metadata_matched':
      return {
        label,
        status: 'Matched',
        detail:
          'Stored object identity and metadata match the ' +
          'release-time record. This is not a binary hash comparison.'
      };

    case 'metadata_changed':
      return {
        label,
        status: 'Mismatch',
        detail:
          'Storage object identity or metadata changed since release.'
      };

    case 'object_missing':
      return {
        label,
        status: 'Mismatch',
        detail:
          'The PDF registered at release is no longer available.'
      };

    case 'bucket_not_private':
      return {
        label,
        status: 'Mismatch',
        detail:
          'The report storage bucket is missing or not private.'
      };

    case 'not_recorded':
      return {
        label,
        status: 'Unavailable',
        detail:
          'No release-time metadata was recorded for this report.'
      };

    default:
      return {
        label,
        status: 'Unavailable',
        detail:
          'Unrecognized or unavailable artifact verification response.'
      };
  }
}
