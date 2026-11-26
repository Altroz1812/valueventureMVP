// Shared frontend models and legacy configuration definitions.
// Live users, cases, banks and branches come from Supabase; the remaining
// example branch settings are NOT persisted and must not be treated as live data.

export type TenantRole =
  | "Tenant Owner"
  | "Tenant Admin"
  | "Branch Admin"
  | "Back Office"
  | "Checker"
  | "Field Officer"
  | "Accounts"
  | "Manager";

export interface Tenant {
  id: string;
  name: string;
  shortName: string;
  role: TenantRole;
  plan: string;
  status: "active" | "invited";
  adminAccess: boolean; // whether the acting member sees tenant administration
}

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  type: "Head Office" | "Regional" | "Local";
  city: string;
  state: string;
  pin: string;
  address: string;
  manager: string;
  email: string;
  phone: string;
  users: number;
  activeCases: number;
  status: "Active" | "Inactive";
  geofenceKm: number;
  tatDays: number;
  casePrefix: string;
  openedOn: string;
}

export interface BranchAllocation {
  branchId: string;
  localRole: TenantRole;
}

export interface UserRecord {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  mobile: string;
  role: TenantRole;
  allocations: BranchAllocation[];
  status: "Active" | "Pending Invite" | "Suspended";
  employeeType: "Employee" | "Vendor" | "—";
  ibbi?: { regNo: string; expires: string };
  joined: string;
}

export interface CaseRow {
  id: string;
  caseNo: string;
  tenantId: string;
  branchId: string;
  property: string;
  propertyType: string;
  bank: string;
  city: string;
  assignedTo: string;
  stage: "Initiation" | "Initiation QC" | "Field Visit" | "Field QC" | "Report Draft" | "Final QC" | "Approved" | "Delivered"
    | "Received" | "Assigned" | "Visit scheduled" | "Visit done" | "Checker pending" | "Rework" | "Submitted" | "Invoiced";
  priority: "High" | "Normal" | "Low";
  tatLeft: number;
  fee: number;
}

export const branches: Branch[] = [
  {
    id: "br-hyd", tenantId: "abc", name: "Hyderabad (Main)", code: "HYD001", type: "Head Office",
    city: "Hyderabad", state: "Telangana", pin: "500081", address: "Plot 42, Road No. 12, Banjara Hills",
    manager: "Ravi Kumar", email: "hyd@abcvaluers.in", phone: "+91 98490 11223",
    users: 18, activeCases: 46, status: "Active", geofenceKm: 25, tatDays: 2, casePrefix: "HYD",
    openedOn: "2019-04-12",
  },
  {
    id: "br-vja", tenantId: "abc", name: "Vijayawada", code: "VJA001", type: "Regional",
    city: "Vijayawada", state: "Andhra Pradesh", pin: "520010", address: "D.No. 11-4-12, MG Road, Labbipet",
    manager: "Suresh Babu", email: "vja@abcvaluers.in", phone: "+91 98490 44556",
    users: 8, activeCases: 21, status: "Active", geofenceKm: 20, tatDays: 4, casePrefix: "VJA",
    openedOn: "2021-06-02",
  },
  {
    id: "br-wgl", tenantId: "abc", name: "Warangal", code: "WGL001", type: "Local",
    city: "Warangal", state: "Telangana", pin: "506002", address: "2-7-101, Kothapeta, Hanamkonda",
    manager: "Anil Sharma", email: "wgl@abcvaluers.in", phone: "+91 98490 77889",
    users: 5, activeCases: 12, status: "Active", geofenceKm: 15, tatDays: 3, casePrefix: "WGL",
    openedOn: "2022-11-18",
  },
  {
    id: "br-vsk", tenantId: "abc", name: "Visakhapatnam", code: "VSK001", type: "Regional",
    city: "Visakhapatnam", state: "Andhra Pradesh", pin: "530016", address: "48-10-4, Dwaraka Nagar",
    manager: "Priya Nair", email: "vsk@abcvaluers.in", phone: "+91 98490 33445",
    users: 7, activeCases: 17, status: "Active", geofenceKm: 22, tatDays: 3, casePrefix: "VSK",
    openedOn: "2023-02-27",
  },
  {
    id: "ss-tp", tenantId: "sri-sai", name: "Tirupati", code: "TPT001", type: "Head Office",
    city: "Tirupati", state: "Andhra Pradesh", pin: "517501", address: "14-3-209, Leela Mahal Road",
    manager: "Sai Prakash", email: "tp@srisaivaluers.in", phone: "+91 90000 12345",
    users: 4, activeCases: 9, status: "Active", geofenceKm: 18, tatDays: 3, casePrefix: "TPT",
    openedOn: "2020-08-09",
  },
  {
    id: "ss-gnt", tenantId: "sri-sai", name: "Guntur", code: "GNT001", type: "Local",
    city: "Guntur", state: "Andhra Pradesh", pin: "522004", address: "5-21-7, Brodipet",
    manager: "Padma Latha", email: "gnt@srisaivaluers.in", phone: "+91 90000 67890",
    users: 3, activeCases: 6, status: "Inactive", geofenceKm: 12, tatDays: 4, casePrefix: "GNT",
    openedOn: "2023-05-14",
  },
];

// ---------- Role & capability matrix ----------

export interface ModuleDef {
  id: string;
  name: string;
  icon: string;
  actions: string[];
  ibbiLockedAction?: string; // action gated by IBBI compliance lock
}

export const permissionModules: ModuleDef[] = [
  { id: "cases", name: "Case Management", icon: "Folders", actions: ["View", "Create", "Edit", "Delete", "Assign", "Approve", "Export"] },
  { id: "field", name: "Field Operations", icon: "MapPin", actions: ["View", "Assign", "Check In/Out", "Manage Geofence", "Export"] },
  { id: "qc", name: "QC & Review", icon: "ShieldCheck", actions: ["View", "Approve", "Return", "Edit", "Export"] },
  { id: "signoff", name: "Digital Sign-off & Legal", icon: "PenLine", actions: ["View", "Sign", "Generate", "Manage Templates", "Release"], ibbiLockedAction: "Sign" },
  { id: "billing", name: "Billing & MIS", icon: "Receipt", actions: ["View", "Create", "Approve", "Export"] },
  { id: "analytics", name: "Analytics & Audit", icon: "Receipt", actions: ["View", "Audit", "Export"] },
  { id: "admin", name: "Administration", icon: "Settings", actions: ["View", "Manage Users", "Manage Roles", "Edit Settings", "Audit Logs"] },
];

export const matrixRoles = [
  { id: "r-owner", name: "Tenant Owner", ibbi: true, system: true },
  { id: "r-admin", name: "Tenant Admin", ibbi: true, system: true },
  { id: "r-branch", name: "Branch Admin", ibbi: false, system: true },
  { id: "r-backoffice", name: "Back Office", ibbi: false, system: true },
  { id: "r-checker", name: "Checker", ibbi: false, system: true },
  { id: "r-field", name: "Field Officer", ibbi: false, system: true },
  { id: "r-accounts", name: "Accounts", ibbi: false, system: true },
  { id: "r-senior", name: "Senior Valuer (Custom)", ibbi: true, system: false },
];

export type Matrix = Record<string, Record<string, string[]>>;

// ---------- Configuration inheritance (tenant defaults vs branch overrides) ----------

export interface SettingField {
  key: string;
  label: string;
  group: "Workflow & TAT" | "GPS Tolerances" | "QC Rules" | "Billing";
  type: "text" | "number" | "toggle";
  unit?: string;
  defaultValue: string;
}

export const settingFields: SettingField[] = [
  { key: "tat", label: "Default case TAT", group: "Workflow & TAT", type: "number", unit: "days", defaultValue: "3" },
  { key: "priority", label: "Default case priority", group: "Workflow & TAT", type: "text", defaultValue: "Normal" },
  { key: "initQc", label: "Initiation QC required", group: "Workflow & TAT", type: "toggle", defaultValue: "Required" },
  { key: "fieldQc", label: "Field report QC required", group: "Workflow & TAT", type: "toggle", defaultValue: "Required" },
  { key: "approval", label: "Report approval required", group: "Workflow & TAT", type: "toggle", defaultValue: "Required" },
  { key: "revisionWindow", label: "Revision window", group: "Workflow & TAT", type: "number", unit: "days", defaultValue: "7" },
  { key: "gps", label: "GPS tracking enabled", group: "GPS Tolerances", type: "toggle", defaultValue: "Enabled" },
  { key: "gpsCheckin", label: "GPS check-in required", group: "GPS Tolerances", type: "toggle", defaultValue: "Required" },
  { key: "gpsCheckout", label: "GPS check-out required", group: "GPS Tolerances", type: "toggle", defaultValue: "Required" },
  { key: "gpsAccuracy", label: "Allowed GPS accuracy threshold", group: "GPS Tolerances", type: "number", unit: "m", defaultValue: "10" },
  { key: "geofence", label: "Geofence radius", group: "GPS Tolerances", type: "number", unit: "m", defaultValue: "500" },
  { key: "gpsOrigin", label: "GPS origin point", group: "GPS Tolerances", type: "text", defaultValue: "Office" },
  { key: "photos", label: "Minimum visit photos", group: "QC Rules", type: "number", unit: "photos", defaultValue: "8" },
  { key: "mandatory", label: "Mandatory report fields", group: "QC Rules", type: "number", unit: "fields", defaultValue: "12" },
  { key: "qcTat", label: "QC turnaround", group: "QC Rules", type: "number", unit: "days", defaultValue: "1" },
  { key: "reassign", label: "Checker reassignment allowed", group: "QC Rules", type: "toggle", defaultValue: "Disabled" },
  { key: "gst", label: "GST rate", group: "Billing", type: "number", unit: "%", defaultValue: "18" },
  { key: "paymentTerms", label: "Payment terms", group: "Billing", type: "number", unit: "days", defaultValue: "30" },
  { key: "invoicePrefix", label: "Invoice numbering prefix", group: "Billing", type: "text", defaultValue: "ABC/INV" },
  { key: "deliveryFee", label: "Report delivery fee", group: "Billing", type: "number", unit: "₹", defaultValue: "250" },
];

export const branchOverrides: Record<string, Record<string, string>> = {
  "br-hyd": { tat: "2", gpsOrigin: "Employee base", invoicePrefix: "ABC/HYD" },
  "br-vja": { tat: "4", gpsAccuracy: "15", geofence: "300" },
  "br-wgl": { tat: "3", gpsOrigin: "Fixed custom point", photos: "6" },
  "br-vsk": {},
  "ss-tp": {},
  "ss-gnt": {},
};

export function effectiveValue(branchId: string, field: SettingField): { value: string; overridden: boolean } {
  const ov = branchOverrides[branchId]?.[field.key];
  if (ov !== undefined) return { value: ov, overridden: true };
  return { value: field.defaultValue, overridden: false };
}

// ---------- Helpers ----------

export function fmtINR(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}
