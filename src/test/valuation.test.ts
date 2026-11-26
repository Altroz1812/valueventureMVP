import { describe, expect, it } from "vitest";
import { computeValuation, rupeesInWords } from "@/lib/valuation";

const base = { landAreaSqYd: 200, landRate: 40000, guidelineRate: 25000, builtUpSqFt: 1800, constructionRate: 2000, ageYears: 10, lifeYears: 60, salvagePct: 10, amenities: 100000, realizablePct: 90, distressPct: 80 };

describe("valuation engine", () => {
  it("depreciates building straight-line to salvage", () => {
    const v = computeValuation(base);
    expect(v.landValue).toBe(8000000);
    expect(v.replacementCost).toBe(3600000);
    expect(v.depreciation).toBe(540000); // 15% after 10 of 60 years
    expect(v.marketValue).toBe(8000000 + 3060000 + 100000);
    expect(v.realizableValue).toBe(Math.round(v.marketValue * 0.9));
    expect(v.distressValue).toBe(Math.round(v.marketValue * 0.8));
  });
  it("caps depreciation at full life", () => {
    expect(computeValuation({ ...base, ageYears: 90 }).depreciationPct).toBe(90);
  });
  it("writes amounts in Indian words", () => {
    expect(rupeesInWords(8500000)).toBe("Eighty Five Lakh Rupees Only");
    expect(rupeesInWords(12345678)).toBe("One Crore Twenty Three Lakh Forty Five Thousand Six Hundred Seventy Eight Rupees Only");
  });
});
