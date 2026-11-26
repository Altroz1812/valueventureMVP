import type { ValuationInput } from '@/lib/valuation';

/** Derived suggestions only. Nothing is saved or approved by this module. */
export type InspectionMeasureData = Record<string, string>;
export type SelectedTransfer = {
  landAreaSqYd?: { rectangular_confirmed: true };
  builtUpSqFt?: { floors: string[] };
  ageYears?: true;
};
export type ValuationTransferProposal = {
  field: 'landAreaSqYd' | 'builtUpSqFt' | 'ageYears';
  label: string;
  value: number;
  explanation: string;
};

const floorKey = (value: string) => /^floor_area_[0-5]$/.test(value);
const decimal = (raw: string | undefined): number | null => {
  if (!raw || !/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(raw.trim())) return null;
  const n = Number(raw.trim());
  return Number.isFinite(n) && n >= 0 && n <= 1_000_000_000 ? n : null;
};
const roundTwo = (number: number) => Math.round((number + Number.EPSILON) * 100) / 100;

export function proposeReviewedTransfer(
  source: InspectionMeasureData,
  selection: SelectedTransfer,
): ValuationTransferProposal[] {
  const result: ValuationTransferProposal[] = [];
  if (selection.landAreaSqYd?.rectangular_confirmed) {
    const length = decimal(source['land_length']);
    const breadth = decimal(source['land_breadth']);
    const unit = source['measurement_unit'];
    if (length === null || breadth === null || length <= 0 || breadth <= 0) {
      throw new Error('Both positive land dimensions are required.');
    }
    if (unit !== 'Feet' && unit !== 'Metres') {
      throw new Error('Select Feet or Metres on the inspection before deriving land area.');
    }
    const squareYards = unit === 'Feet'
      ? (length * breadth) / 9
      : (length * breadth) / 0.83612736;
    result.push({
      field: 'landAreaSqYd', label: 'Land area (sq.yd)',
      value: roundTwo(squareYards),
      explanation: `${length} × ${breadth} ${unit}; rectangular shape confirmed; ${unit === 'Feet' ? '÷ 9' : '÷ 0.83612736'} to square yards`,
    });
  }
  const chosenFloors = selection.builtUpSqFt?.floors ?? [];
  if (chosenFloors.length) {
    if (new Set(chosenFloors).size !== chosenFloors.length || !chosenFloors.every(floorKey)) {
      throw new Error('Invalid or duplicated floor choice.');
    }
    let total = 0;
    for (const key of chosenFloors) {
      const amount = decimal(source[key]);
      if (amount === null || amount <= 0) throw new Error(`Floor area ${key} must be positive.`);
      total += amount;
    }
    result.push({
      field: 'builtUpSqFt', label: 'Built-up area (sq.ft)',
      value: roundTwo(total),
      explanation: `Explicitly selected floor areas: ${chosenFloors.join(', ')}; excludes all other floors and does not certify chargeable area`,
    });
  }
  if (selection.ageYears) {
    const age = decimal(source['property_age']);
    if (age === null) throw new Error('Property age is missing or invalid.');
    result.push({field: 'ageYears', label: 'Building age (years)', value: age, explanation: 'Recorded property age from submitted site inspection'});
  }
  return result;
}

export function mergeReviewedTransfer(
  current: ValuationInput,
  proposals: readonly ValuationTransferProposal[],
): ValuationInput {
  return Object.assign({}, current, ...proposals.map(p => ({[p.field]: p.value})));
}
