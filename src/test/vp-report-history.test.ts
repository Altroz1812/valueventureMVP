
import { describe, it, expect } from 'vitest';
import {
  caseReportHistory,
  releasedHistory,
  chooseReleasedReport,
  reportProvenance
} from '../lib/vp-report-history';

const rows = [
  {num: 1, version_no: 2, status: 'Released'},
  {num: 1, version_no: 4, status: 'Draft'},
  {num: 2, version_no: 8, status: 'Released'},
  {num: 1, version_no: 1, status: 'Released'}
];

describe('Immutable report history', () => {
  it('isolates report history by case', () => {
    expect(caseReportHistory(rows, 1).map(x => x.version_no))
      .toEqual([4, 2, 1]);
  });

  it('excludes drafts from released history', () => {
    expect(releasedHistory(caseReportHistory(rows, 1))
      .map(x => x.version_no)).toEqual([2, 1]);
  });

  it('selects latest released rather than latest draft', () => {
    expect(chooseReleasedReport(
      caseReportHistory(rows, 1), null
    )?.version_no).toBe(2);
  });

  it('selects exact historical version', () => {
    expect(chooseReleasedReport(
      caseReportHistory(rows, 1), '1'
    )?.version_no).toBe(1);
  });

  it('never substitutes another report for a missing selection', () => {
    expect(chooseReleasedReport(
      caseReportHistory(rows, 1), '8'
    )).toBeUndefined();
  });

  it('never selects a draft as a released report', () => {
    expect(chooseReleasedReport(
      caseReportHistory(rows, 1), '4'
    )).toBeUndefined();
  });

  it('rejects ambiguous duplicate versions', () => {
    expect(chooseReleasedReport([rows[0], rows[0]], null))
      .toBeUndefined();
  });

  it('retains official valuation and workpaper references', () => {
    const result = reportProvenance({
      version_no: 3,
      valuation_version_no: 7,
      status: 'Released',
      case_snapshot: {
        valuation_method: 'P19 comparison',
        p20_export_id: '9223372036854775807'
      }
    });

    expect(result.valuationVersion).toBe(7);
    expect(result.workpaper).toBe('9223372036854775807');
    expect(result.method).toBe('P19 comparison');
  });

  it('does not fabricate missing historical references', () => {
    const result = reportProvenance({version_no: 1});

    expect(result.workpaper).toBe('Not recorded');
    expect(result.valuationVersion).toBeNull();
  });
});


import {
  snapshotsEqual,
  reportIdentifier,
  validReportPdfPath,
  hasPdfHeader,
  checkReportSnapshots
} from '../lib/vp-report-history';

describe('Released report readback', () => {
  it('compares JSON snapshots independently of property order', () => {
    expect(snapshotsEqual(
      {b: 2, a: {x: 1}},
      {a: {x: 1}, b: 2}
    )).toBe(true);
  });

  it('detects changed valuation amounts', () => {
    expect(snapshotsEqual(
      {marketValue: 100000},
      {marketValue: 110000}
    )).toBe(false);
  });

  it('does not accept missing snapshots as matched', () => {
    expect(snapshotsEqual(null, null)).toBe(false);
    expect(snapshotsEqual(undefined, undefined)).toBe(false);
  });

  it('preserves exact bigint identifiers', () => {
    expect(reportIdentifier('9223372036854775807'))
      .toBe('9223372036854775807');

    expect(reportIdentifier(Number.MAX_SAFE_INTEGER + 1))
      .toBeNull();
  });

  it('restricts stored PDF paths to the exact case and tenant', () => {
    expect(validReportPdfPath('10/21/report.pdf', '10', 21))
      .toBe(true);

    expect(validReportPdfPath('11/21/report.pdf', '10', 21))
      .toBe(false);

    expect(validReportPdfPath('10/22/report.pdf', '10', 21))
      .toBe(false);

    expect(validReportPdfPath('10/21/../report.pdf', '10', 21))
      .toBe(false);
  });

  it('recognizes a PDF header without claiming full validation', () => {
    expect(hasPdfHeader(new Uint8Array([37,80,68,70,45])))
      .toBe(true);

    expect(hasPdfHeader(new Uint8Array([1,2,3,4,5])))
      .toBe(false);
  });

  it('never marks missing official records as matched', () => {
    const checks = checkReportSnapshots(
      {valuation_version_no: 2},
      null, null, null, null
    );

    expect(checks.some(c => c.status === 'Matched')).toBe(false);
  });

  it('detects mismatched official versions and calculations', () => {
    const checks = checkReportSnapshots(
      {
        org_id: 1, num: 2, valuation_version_no: 3,
        inputs_snapshot: {area: 100},
        calculations_snapshot: {marketValue: 1000}
      },
      {
        org_id: 1, num: 2, version_no: 4,
        method: 'Land and Building',
        inputs: {area: 100},
        calculations: {marketValue: 1100}
      },
      null, null, null
    );

    expect(checks.find(c => c.label === 'Official valuation reference')
      ?.status).toBe('Mismatch');

    expect(checks.find(c => c.label === 'Valuation calculations')
      ?.status).toBe('Mismatch');
  });
});


import {
  validBankCell,
  compareBankCell,
  buildBankMappingReadback
} from '../lib/vp-report-history';

describe('Bank workbook reconciliation', () => {
  const report = {
    org_id: 1,
    num: 21,
    case_snapshot: {
      bank: 'Example Bank',
      p20_export_id: '12'
    },
    inputs_snapshot: {
      export_id: '12',
      analysis_version: 4,
      method: 'comparison',
      property_snapshot: {category: 'Land'}
    },
    calculations_snapshot: {marketValue: 1000000}
  };

  const workpaper = {
    id: '12',
    org_id: 1,
    num: 21,
    analysis_version: 4,
    template_id: '5',
    cell_values: {
      status: 'REVIEWED WORKPAPER - NOT RELEASED',
      case_num: 21,
      method: 'comparison',
      analysis_version: 4,
      marketValue: 1000000
    }
  };

  const template = {
    id: '5',
    org_id: 1,
    bank_name: 'Example Bank',
    category: 'Land',
    mapping: [
      {field: 'status', sheet: 'Sheet1', cell: 'B2'},
      {field: 'case_num', sheet: 'Sheet1', cell: 'B3'},
      {field: 'method', sheet: 'Sheet1', cell: 'B4'},
      {field: 'analysis_version', sheet: 'Sheet1', cell: 'B5'},
      {field: 'marketValue', sheet: 'Sheet1', cell: 'B6'}
    ]
  };

  it('validates Excel address boundaries', () => {
    expect(validBankCell('A1')).toBe(true);
    expect(validBankCell('XFD1048576')).toBe(true);
    expect(validBankCell('XFE1')).toBe(false);
    expect(validBankCell('A1048577')).toBe(false);
    expect(validBankCell('A0')).toBe(false);
  });

  it('distinguishes zero from a blank cell', () => {
    expect(compareBankCell(0, null, undefined).status)
      .toBe('Mismatch');

    expect(compareBankCell(null, 0, undefined).status)
      .toBe('Mismatch');

    expect(compareBankCell(null, undefined, undefined).status)
      .toBe('Matched');
  });

  it('does not coerce numeric strings', () => {
    expect(compareBankCell(100, '100', undefined).status)
      .toBe('Mismatch');
  });

  it('never accepts a formula as a verified input value', () => {
    expect(compareBankCell(100, 100, 'A1+B1').status)
      .toBe('Formula');
  });

  it('matches the exact registered values and snapshot', () => {
    expect(buildBankMappingReadback(
      report, workpaper, template
    ).every(item => item.reference === 'Matched')).toBe(true);
  });

  it('detects changed market values', () => {
    const mismatched = {
      ...workpaper,
      cell_values: {
        ...workpaper.cell_values,
        marketValue: 1100000
      }
    };

    expect(buildBankMappingReadback(
      report, mismatched, template
    ).find(item => item.field === 'marketValue')?.reference)
      .toBe('Mismatch');
  });

  it('rejects a different historical workpaper', () => {
    expect(() => buildBankMappingReadback(
      report, {...workpaper, id: '13'}, template
    )).toThrow();
  });

  it('rejects duplicate mapped cell targets', () => {
    expect(() => buildBankMappingReadback(
      report,
      workpaper,
      {
        ...template,
        mapping: [
          ...template.mapping,
          {field: 'bank', sheet: 'sheet1', cell: 'B2'}
        ]
      }
    )).toThrow();
  });
});


import {
  reportInspectionReference,
  reportAmount,
  validAnnexPhoto,
  validAnnexImage
} from '../lib/vp-report-history';

describe('PDF draft and photographic annexure', () => {
  const reference = {
    visitId:'45',
    revision:'2026-11-01T10:00:00Z'
  };

  const photo = {
    id:12,
    org_id:10,
    visit_id:45,
    storage_path:
      '10/21/45/12345678-1234-1234-1234-123456789abc.jpg',
    size:10000,
    mime:'image/jpeg',
    uploaded_at:'2026-11-01T09:00:00Z'
  };

  it('uses the stored inspection reference', () => {
    expect(reportInspectionReference({
      inputs_snapshot:{
        inspection_snapshot:{
          visit_id:'45',
          updated_at:reference.revision
        }
      }
    })).toEqual(reference);
  });

  it('does not substitute missing inspections', () => {
    expect(reportInspectionReference({})).toBeNull();
  });

  it('distinguishes missing values from zero', () => {
    expect(reportAmount(null)).toBe('Not recorded');
    expect(reportAmount(undefined)).toBe('Not recorded');
    expect(reportAmount(0)).not.toBe('Not recorded');
    expect(reportAmount(NaN)).toBe('Not recorded');
  });

  it('accepts exact scoped photograph references', () => {
    expect(validAnnexPhoto(photo,'10',21,reference)).toBe(true);
  });

  it('rejects photographs from other cases', () => {
    expect(validAnnexPhoto(photo,'10',22,reference)).toBe(false);
  });

  it('rejects photographs from other tenants', () => {
    expect(validAnnexPhoto(photo,'11',21,reference)).toBe(false);
  });

  it('rejects photographs uploaded after snapshot revision', () => {
    expect(validAnnexPhoto({
      ...photo,
      uploaded_at:'2026-11-01T11:00:00Z'
    },'10',21,reference)).toBe(false);
  });

  it('rejects unsupported image types and paths', () => {
    expect(validAnnexPhoto({
      ...photo,mime:'image/svg+xml'
    },'10',21,reference)).toBe(false);

    expect(validAnnexPhoto({
      ...photo,storage_path:'10/21/45/../photo.jpg'
    },'10',21,reference)).toBe(false);
  });

  it('validates image signatures', () => {
    expect(validAnnexImage(
      new Uint8Array([255,216,255,1]),'image/jpeg'
    )).toBe(true);

    expect(validAnnexImage(
      new Uint8Array([1,2,3,4]),'image/jpeg'
    )).toBe(false);
  });
});

import {
  parseReleaseArtifactReadback
} from '../lib/vp-report-history';

describe('Release artifact metadata verification', () => {

  it('accepts matching release metadata', () => {
    expect(parseReleaseArtifactReadback({
      status: 'metadata_matched'
    }).status).toBe('Matched');
  });

  it('detects changed storage identity', () => {
    expect(parseReleaseArtifactReadback({
      status: 'metadata_changed'
    }).status).toBe('Mismatch');
  });

  it('detects missing released PDF', () => {
    expect(parseReleaseArtifactReadback({
      status: 'object_missing'
    }).status).toBe('Mismatch');
  });

  it('flags public or missing storage', () => {
    expect(parseReleaseArtifactReadback({
      status: 'bucket_not_private'
    }).status).toBe('Mismatch');
  });

  it('does not fabricate metadata for historical reports', () => {
    expect(parseReleaseArtifactReadback({
      status: 'not_recorded'
    }).status).toBe('Unavailable');
  });

  it('fails closed for unknown responses', () => {
    expect(parseReleaseArtifactReadback(null).status)
      .toBe('Unavailable');

    expect(parseReleaseArtifactReadback({
      status: 'unexpected'
    }).status).toBe('Unavailable');
  });
});
