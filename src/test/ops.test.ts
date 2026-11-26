import { describe, expect, it } from "vitest";
import { gstBreakup, nextStage, returnStage } from "@/lib/ops";

describe("GST", () => {
  it("splits 18% into CGST+SGST within state", () => {
    expect(gstBreakup(4200, 18, false)).toEqual({ cgst: 378, sgst: 378, igst: 0, total: 4956 });
  });
  it("charges full 18% as IGST across states", () => {
    expect(gstBreakup(4000, 18, true)).toEqual({ cgst: 0, sgst: 0, igst: 720, total: 4720 });
  });
});

describe("QC workflow", () => {
  it("approval moves Field QC to Report Draft", () => expect(nextStage("Field QC")).toBe("Report Draft"));
  it("return sends Final QC back to Report Draft", () => expect(returnStage("Final QC")).toBe("Report Draft"));
});
