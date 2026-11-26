/**
 * P4 conservative OCR-vs-inspection review. These statuses are prompts for a
 * human reviewer, not an automated title, boundary, area or QC determination.
 */
import type { OcrSuggestion } from './vp-ocr-candidates';

export type EvidenceReviewStatus = 'new' | 'matches' | 'conflict' | 'unit-check' | 'manual-only';
export type EvidenceReview = { status: EvidenceReviewStatus; detail: string; canAccept: boolean };

function comparable(value: string): string {
  return value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase();
}

const plotDimensions = new Set(['land_length', 'land_breadth']);

export function reviewOcrEvidence(
  candidate: OcrSuggestion,
  currentValues: Readonly<Record<string, string>>,
): EvidenceReview {
  if (candidate.field === 'approach_road_width') {
    return {
      status: 'manual-only', canAccept: false,
      detail: 'Approach-road width has no persisted measurement unit. Confirm the unit and enter it manually with provenance.',
    };
  }
  if (plotDimensions.has(candidate.field)) {
    const inspectionUnit = currentValues['measurement_unit']?.trim();
    if (!candidate.source_unit) {
      return {
        status: 'unit-check', canAccept: false,
        detail: 'Source line does not state feet or metres. Verify the original and enter this dimension manually.',
      };
    }
    if (!inspectionUnit || inspectionUnit !== candidate.source_unit) {
      return {
        status: 'unit-check', canAccept: false,
        detail: `OCR states ${candidate.source_unit}; inspection measurement unit is ${inspectionUnit || 'unset'}. Set/verify matching units before accepting. No automatic conversion.`,
      };
    }
  }
  const existing = currentValues[candidate.field]?.trim() ?? '';
  if (!existing) return { status: 'new', detail: 'Empty inspection field; verify the original document.', canAccept: true };
  if (comparable(existing) === comparable(candidate.value)) {
    return { status: 'matches', detail: 'OCR agrees with the current field; verify the original document.', canAccept: true };
  }
  return {
    status: 'conflict', canAccept: true,
    detail: `Different from current inspection value: ${existing.slice(0, 120)}. Requires explicit replacement confirmation.`,
  };
}
