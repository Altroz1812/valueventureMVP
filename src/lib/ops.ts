// Shared stage, GST and TAT helpers. Live case and QC state comes from Supabase.
import type { CaseRow } from "./data";

export const STAGES: CaseRow["stage"][] = [
  "Initiation", "Initiation QC", "Field Visit", "Field QC", "Report Draft", "Final QC", "Approved", "Delivered",
];

export function nextStage(s: CaseRow["stage"]): CaseRow["stage"] {
  const i = STAGES.indexOf(s);
  return STAGES[Math.min(i + 1, STAGES.length - 1)]!;
}

/** Stage a case goes back to when QC returns it for correction. */
export function returnStage(s: CaseRow["stage"]): CaseRow["stage"] {
  if (s === "Initiation QC") return "Initiation";
  if (s === "Field QC") return "Field Visit";
  if (s === "Final QC") return "Report Draft";
  return s;
}

/** GST split: intra-state → CGST + SGST halves, inter-state → IGST. */
export function gstBreakup(fee: number, ratePct: number, interState: boolean) {
  const tax = Math.round((fee * ratePct) / 100);
  if (interState) return { cgst: 0, sgst: 0, igst: tax, total: fee + tax };
  const half = Math.round(tax / 2);
  return { cgst: half, sgst: tax - half, igst: 0, total: fee + tax };
}

export function tatTone(tatLeft: number, stage: CaseRow["stage"]): "ok" | "today" | "overdue" | "done" {
  if (["Approved", "Delivered", "Submitted", "Invoiced"].includes(stage)) return "done";
  if (tatLeft < 0) return "overdue";
  if (tatLeft <= 1) return "today";
  return "ok";
}
