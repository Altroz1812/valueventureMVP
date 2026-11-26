import { vpDb } from "@/lib/vp-db";

// All user and tenant identity is resolved inside PostgreSQL. The browser never
// supplies an org_id, an inbox recipient, or an alert payload.
export type VpAlert = {
  id: string;
  kind: "case" | "qc" | "report" | "billing" | "tat";
  title: string;
  body: string;
  case_num: number | null;
  invoice_id: string | null;
  severity: "info" | "warning" | "critical";
  created_at: string;
  read_at: string | null;
};

export type VpAlertSettings = {
  case_warning_days: number;
  invoice_warning_days: number;
  email_enabled: boolean;
  whatsapp_enabled: boolean;
};

export async function vpLoadAlerts(limit = 50): Promise<VpAlert[]> {
  const { data, error } = await vpDb.rpc("vp_alert_list", { p_limit: limit, p_offset: 0 });
  if (error) throw error;
  return (data ?? []) as VpAlert[];
}

export async function vpMarkAlertsRead(ids: string[]): Promise<number> {
  if (!ids.length) return 0;
  // Keep BIGINT identities as decimal strings to avoid JS number precision loss.
  const { data, error } = await vpDb.rpc("vp_alert_mark_read", { p_ids: ids });
  if (error) throw error;
  return Number(data ?? 0);
}

export async function vpLoadAlertSettings(): Promise<VpAlertSettings> {
  const { data, error } = await vpDb.rpc("vp_alert_settings_read");
  if (error) throw error;
  const value = (Array.isArray(data) ? data[0] : data) as VpAlertSettings | null;
  if (!value) throw new Error("Alert settings are unavailable");
  return value;
}

export async function vpSaveAlertSettings(caseDays: number, invoiceDays: number): Promise<void> {
  const { error } = await vpDb.rpc("vp_alert_settings_save", {
    p_case_warning_days: caseDays,
    p_invoice_warning_days: invoiceDays,
  });
  if (error) throw error;
}
