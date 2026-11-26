// Land & Building (cost) method valuation engine used by the case dossier.
export interface ValuationInput {
  landAreaSqYd: number;
  landRate: number; // ₹ per sq.yd (market)
  guidelineRate: number; // ₹ per sq.yd (SRO / circle rate)
  builtUpSqFt: number;
  constructionRate: number; // ₹ per sq.ft replacement cost
  ageYears: number;
  lifeYears: number;
  salvagePct: number; // residual value after full life, e.g. 10
  amenities: number;
  realizablePct: number; // e.g. 90
  distressPct: number; // e.g. 80
}

export function computeValuation(i: ValuationInput) {
  const landValue = Math.round(i.landAreaSqYd * i.landRate);
  const replacementCost = Math.round(i.builtUpSqFt * i.constructionRate);
  const age = Math.min(Math.max(i.ageYears, 0), i.lifeYears);
  // Straight-line depreciation down to the salvage value.
  const depreciationPct = i.lifeYears > 0 ? ((100 - i.salvagePct) * age) / i.lifeYears : 0;
  const depreciation = Math.round((replacementCost * depreciationPct) / 100);
  const buildingValue = replacementCost - depreciation;
  const marketValue = landValue + buildingValue + Math.round(i.amenities);
  const guidelineValue = Math.round(i.landAreaSqYd * i.guidelineRate) + buildingValue;
  return {
    landValue,
    replacementCost,
    depreciationPct: Math.round(depreciationPct * 100) / 100,
    depreciation,
    buildingValue,
    marketValue,
    guidelineValue,
    realizableValue: Math.round((marketValue * i.realizablePct) / 100),
    distressValue: Math.round((marketValue * i.distressPct) / 100),
  };
}

/** Indian-style words for a rupee amount (e.g. "Eighty Five Lakh Rupees Only"). */
export function rupeesInWords(n: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const two = (x: number) => (x < 20 ? ones[x]! : `${tens[Math.floor(x / 10)]}${x % 10 ? " " + ones[x % 10] : ""}`);
  const three = (x: number) => (x >= 100 ? `${ones[Math.floor(x / 100)]} Hundred${x % 100 ? " " + two(x % 100) : ""}` : two(x));
  n = Math.round(n);
  if (n === 0) return "Zero Rupees Only";
  const parts: string[] = [];
  const crore = Math.floor(n / 1e7); n %= 1e7;
  const lakh = Math.floor(n / 1e5); n %= 1e5;
  const thousand = Math.floor(n / 1e3); n %= 1e3;
  if (crore) parts.push(`${three(crore)} Crore`);
  if (lakh) parts.push(`${two(lakh)} Lakh`);
  if (thousand) parts.push(`${two(thousand)} Thousand`);
  if (n) parts.push(three(n));
  return `${parts.join(" ")} Rupees Only`;
}
