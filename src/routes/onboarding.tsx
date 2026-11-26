import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Globe,
  ImageIcon,
  Mail,
  MapPin,
  Rocket,
  Save,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "ValuationPro — Tenant Onboarding" },
      { name: "description", content: "Set up a new valuation agency workspace in six guided steps: profile, branch, users, workflow, integrations and activation." },
      { property: "og:title", content: "ValuationPro — Tenant Onboarding" },
      { property: "og:description", content: "Set up a new valuation agency workspace in six guided steps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Onboarding,
});

const STEPS = [
  { n: 1, title: "Agency Legal Profile", icon: Building2 },
  { n: 2, title: "Primary Agency Branch", icon: MapPin },
  { n: 3, title: "Invite Initial Users", icon: UserPlus },
  { n: 4, title: "Valuation Workflow", icon: Check },
  { n: 5, title: "Integrations", icon: Globe },
  { n: 6, title: "Review & Activate", icon: Rocket },
];

const STEP_TITLES = [
  "Create your agency account",
  "Create primary agency branch",
  "Invite initial users",
  "Configure valuation workflow",
  "Configure integrations",
  "Review and activate",
];

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [sampleData, setSampleData] = useState(true);
  const [qcMandatory, setQcMandatory] = useState(true);
  const [signoffCompliance, setSignoffCompliance] = useState(true);
  const [invites, setInvites] = useState([
    { name: "Ravi Kumar", email: "ravi@abcvaluers.in", role: "Tenant Owner", branch: "All branches" },
    { name: "Suresh Babu", email: "suresh@abcvaluers.in", role: "Branch Admin", branch: "Hyderabad" },
    { name: "Anil Sharma", email: "anil@abcvaluers.in", role: "Checker", branch: "Hyderabad" },
    { name: "Mohan Rao", email: "mohan@abcvaluers.in", role: "Field Officer", branch: "Hyderabad" },
  ]);

  const integrations = [
    { name: "Supabase Auth", desc: "Secure user logins & invitations", status: "Connected", detail: "auth.abcvaluers.in" },
    { name: "SMS / WhatsApp Gateway", desc: "Assignment & TAT alerts", status: "Not connected", detail: "MSG91 · WA Business" },
    { name: "Email Intake (Gmail)", desc: "Convert bank emails into cases", status: "Connect", detail: "intake@abcvaluers.in" },
    { name: "GPS Field Tracking", desc: "Check-in / check-out GPS audit", status: "Connected", detail: "Google Maps Platform" },
  ];

  const statusTone: Record<string, string> = {
    Connected: "bg-success/15 text-success",
    "Not connected": "bg-muted text-muted-foreground",
    Connect: "bg-accent/25 text-accent-foreground",
  };

  function activate() {
    // This six-step screen uses demonstration inputs and has no persistence
    // contract in the confirmed 16-table database. Do not claim success.
    toast.error('This six-step onboarding workflow is a preview.', {
      description: 'Your initial agency is created securely after Supabase login. Branches, integrations and sample data are not provisioned here yet.',
    });
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Badge variant="outline" className="mb-3 border-primary/30 bg-primary/5 text-primary">
            Tenant onboarding
          </Badge>
          <h1 className="font-display text-2xl font-bold tracking-tight">Set up your valuation agency</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Six short steps. You can save a draft at any point and finish later.
          </p>
        </div>

        {/* Stepper */}
        <ol className="mb-8 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {STEPS.map((s) => (
            <li key={s.n}>
              <button
                onClick={() => setStep(s.n)}
                className={cn(
                  "w-full rounded-xl border px-2 py-2.5 text-center transition-colors",
                  step === s.n
                    ? "border-primary bg-primary text-primary-foreground"
                    : step > s.n
                      ? "border-success/40 bg-success/10 text-success"
                      : "border-border bg-card text-muted-foreground hover:bg-accent/40",
                )}
              >
                <span className="mx-auto mb-1 flex size-6 items-center justify-center rounded-full border text-[11px] font-bold">
                  {step > s.n ? <Check className="size-3.5" /> : s.n}
                </span>
                <span className="block text-[10px] font-semibold leading-tight">{s.title}</span>
              </button>
            </li>
          ))}
        </ol>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-lg">
              Step {step} · {STEP_TITLES[step - 1]}
            </CardTitle>
            <CardDescription>
              {[
                "Legal identity and contact details for the agency.",
                "Every tenant needs at least one active agency branch — this becomes the Head Office.",
                "The owner automatically receives full tenant administration. Invited users only get the branches you select.",
                "Default business rules applied to every new case. Case number example: ABC/HYD/2026/00001.",
                "OAuth credentials are stored securely on the server, never in the browser.",
                "Confirm everything before the workspace goes live.",
              ][step - 1]}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {step === 1 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Agency legal name" required>
                  <Input defaultValue="ABC Valuers Private Limited" />
                </Field>
                <Field label="Display / trade name" required>
                  <Input defaultValue="ABC Valuers" />
                </Field>
                <Field label="Business type" required>
                  <Select defaultValue="pvt">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prop">Proprietorship</SelectItem>
                      <SelectItem value="ptn">Partnership</SelectItem>
                      <SelectItem value="llp">LLP</SelectItem>
                      <SelectItem value="pvt">Private Limited</SelectItem>
                      <SelectItem value="pub">Public Limited</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="CIN"><Input placeholder="U74999TG2019PTC163..." /></Field>
                <Field label="IBBI agency registration"><Input placeholder="IBBI/CO/2020/..." /></Field>
                <Field label="PAN"><Input placeholder="AAACA1234F" /></Field>
                <Field label="GSTIN"><Input placeholder="36AAACA1234F1Z5" /></Field>
                <Field label="Registered address" required><Input defaultValue="Plot 42, Road No. 12, Banjara Hills" /></Field>
                <Field label="City" required><Input defaultValue="Hyderabad" /></Field>
                <Field label="State" required>
                  <Select defaultValue="tg"><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tg">Telangana</SelectItem>
                      <SelectItem value="ap">Andhra Pradesh</SelectItem>
                      <SelectItem value="ka">Karnataka</SelectItem>
                      <SelectItem value="mh">Maharashtra</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="PIN code" required><Input defaultValue="500081" /></Field>
                <Field label="Contact email" required><Input defaultValue="contact@abcvaluers.in" /></Field>
                <Field label="Contact mobile" required><Input defaultValue="+91 98490 11223" /></Field>
                <Field label="Currency">
                  <Select defaultValue="inr"><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="inr">INR (₹)</SelectItem></SelectContent>
                  </Select>
                </Field>
                <Field label="Timezone">
                  <Select defaultValue="ist"><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="ist">Asia/Kolkata (IST)</SelectItem></SelectContent>
                  </Select>
                </Field>
                <Field label="Agency logo">
                  <div className="flex h-10 items-center gap-2 rounded-lg border border-dashed border-input px-3 text-xs text-muted-foreground">
                    <ImageIcon className="size-4" /> Upload PNG or SVG
                  </div>
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Branch name" required><Input defaultValue="Hyderabad Main Office" /></Field>
                <Field label="Branch code" required><Input defaultValue="HYD001" /></Field>
                <Field label="Branch type" required>
                  <Select defaultValue="ho"><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ho">Head Office</SelectItem>
                      <SelectItem value="reg">Regional</SelectItem>
                      <SelectItem value="loc">Local</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Branch status">
                  <Select defaultValue="active"><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Full office address" required><Input defaultValue="Plot 42, Road No. 12, Banjara Hills, Hyderabad" /></Field>
                </div>
                <Field label="State" required>
                  <Select defaultValue="tg"><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="tg">Telangana</SelectItem><SelectItem value="ap">Andhra Pradesh</SelectItem></SelectContent>
                  </Select>
                </Field>
                <Field label="City" required><Input defaultValue="Hyderabad" /></Field>
                <Field label="PIN" required><Input defaultValue="500081" /></Field>
                <Field label="Branch email"><Input defaultValue="hyd@abcvaluers.in" /></Field>
                <Field label="Contact person" required><Input defaultValue="Ravi Kumar" /></Field>
                <Field label="Contact mobile" required><Input defaultValue="+91 98490 11223" /></Field>
                <Field label="Latitude / Longitude">
                  <Input defaultValue="17.4126, 78.4392" placeholder="Optional map location" />
                </Field>
                <div className="sm:col-span-2 rounded-lg bg-primary/5 px-3 py-2.5 text-xs text-primary">
                  <ShieldCheck className="mr-1.5 inline size-3.5" />
                  This branch will be created automatically as the tenant's Head Office.
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                {invites.map((inv, i) => (
                  <div key={i} className="grid grid-cols-2 items-end gap-3 rounded-xl border border-border p-3 sm:grid-cols-[1.2fr_1.2fr_1fr_1fr_auto]">
                    <Field label="Full name"><Input value={inv.name} onChange={(e) => setInvites(invites.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} /></Field>
                    <Field label="Email address"><Input value={inv.email} onChange={(e) => setInvites(invites.map((x, j) => (j === i ? { ...x, email: e.target.value } : x)))} /></Field>
                    <Field label="Tenant role">
                      <Select value={inv.role} onValueChange={(v) => setInvites(invites.map((x, j) => (j === i ? { ...x, role: v } : x)))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="owner">Tenant Owner</SelectItem>
                          <SelectItem value="admin">Tenant Admin</SelectItem>
                          <SelectItem value="branch">Branch Admin</SelectItem>
                          <SelectItem value="backoffice">Back Office</SelectItem>
                          <SelectItem value="checker">Checker</SelectItem>
                          <SelectItem value="field">Field Officer</SelectItem>
                          <SelectItem value="accounts">Accounts</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Branch access">
                      <Select value={inv.branch} onValueChange={(v) => setInvites(invites.map((x, j) => (j === i ? { ...x, branch: v } : x)))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All branches</SelectItem>
                          <SelectItem value="hyd">Hyderabad</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Button
                      variant="ghost" size="icon" className="mb-0.5"
                      onClick={() => setInvites(invites.filter((_, j) => j !== i))}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline" size="sm"
                  onClick={() => setInvites([...invites, { name: "", email: "", role: "Back Office", branch: "Hyderabad" }])}
                >
                  <UserPlus className="size-4" /> Add another invite
                </Button>
                <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                  Invitations are sent via Supabase Auth. A person who already has a ValuationPro login can accept this
                  invitation without creating another account — their role here stays separate from other agencies.
                </p>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Case numbering format" required>
                    <Input defaultValue="{AGENCY}/{BRANCH}/{YYYY}/{SEQ}" />
                  </Field>
                  <Field label="Default case priority">
                    <Select defaultValue="Normal"><SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="high">High</SelectItem><SelectItem value="normal">Normal</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent>
                    </Select>
                  </Field>
                  <Field label="Default TAT rules (days)">
                    <Input type="number" defaultValue={3} />
                  </Field>
                  <Field label="Default assignment method">
                    <Select defaultValue="round-robin"><SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="round-robin">Round robin</SelectItem>
                        <SelectItem value="manual">Branch Admin manual</SelectItem>
                        <SelectItem value="load">Least loaded officer</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Revision handling">
                    <Select defaultValue="review"><SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="review">Admin approval to reopen</SelectItem>
                        <SelectItem value="auto">Auto-reopen within window</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Case closure rule">
                    <Select defaultValue="delivery"><SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="delivery">After report delivery</SelectItem><SelectItem value="payment">After payment received</SelectItem></SelectContent>
                    </Select>
                  </Field>
                </div>
                <div className="divide-y rounded-xl border border-border">
                  {[
                    { label: "Initiation QC required", desc: "Every case is checked before field assignment", on: true },
                    { label: "Field report QC required", desc: "Checker reviews every field report", on: true },
                    { label: "Report approval required", desc: "Sign-off before delivery to the bank", on: true },
                    { label: "Allow vendor field officers", desc: "External empanelled valuers can be assigned", on: true },
                    { label: "Allow internal field officers", desc: "Employees can visit properties", on: true },
                  ].map((t) => (
                    <div key={t.label} className="flex items-center justify-between gap-4 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{t.label}</p>
                        <p className="text-xs text-muted-foreground">{t.desc}</p>
                      </div>
                      <Switch defaultChecked={t.on} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {integrations.map((i) => (
                  <div key={i.name} className="flex items-start justify-between gap-3 rounded-xl border border-border p-4">
                    <div>
                      <p className="text-sm font-semibold">{i.name}</p>
                      <p className="text-xs text-muted-foreground">{i.desc}</p>
                      <p className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Mail className="size-3" /> {i.detail}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={cn("border-transparent text-[10px]", statusTone[i.status])}>
                        {i.status}
                      </Badge>
                      <Button variant="ghost" size="sm" className="mt-2 h-7 px-2 text-[11px]">Test</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { t: "Agency", rows: ["ABC Valuers Private Limited", "Private Limited · PAN AAACA1234F", "Hyderabad, Telangana 500081"] },
                    { t: "Head Office", rows: ["Hyderabad Main Office (HYD001)", "GPS attendance recording", "Contact: Ravi Kumar"] },
                    { t: "Users invited", rows: ["4 users across 4 roles", "Owner gets full administration", "2 users limited to Hyderabad"] },
                    { t: "Workflow", rows: ["Numbering: ABC/HYD/2026/00001", "TAT 3 days · Priority Normal", "Initiation QC, Field QC & approval ON"] },
                    { t: "Integrations", rows: ["Supabase Auth · Connected", "GPS Field Tracking · Connected", "2 pending connections"] },
                    { t: "Subscription", rows: ["Enterprise · Annual", "Renews 03 Nov 2027", "Unlimited branches & users"] },
                  ].map((s) => (
                    <div key={s.t} className="rounded-xl border border-border p-4">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{s.t}</p>
                      {s.rows.map((r) => (
                        <p key={r} className="flex items-center gap-1.5 py-0.5 text-xs text-foreground">
                          <Check className="size-3 text-success" /> {r}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">Pre-load sample data</p>
                    <p className="text-xs text-muted-foreground">Start with demo cases, users and bank masters to explore the workspace.</p>
                  </div>
                  <Switch checked={sampleData} onCheckedChange={setSampleData} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer actions */}
        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))}>
            <ArrowLeft className="size-4" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => toast('Draft persistence is not enabled in Phase 1. No changes were saved.')}
            >
              <Save className="size-4" /> Save as Draft
            </Button>
            {step < 6 ? (
              <Button onClick={() => setStep((s) => Math.min(6, s + 1))}>
                Save & Continue <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button onClick={activate} className="bg-success text-success-foreground hover:bg-success/90">
                <Rocket className="size-4" /> Activate Workspace
              </Button>
            )}
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Users className="size-3.5" /> Only Tenant Owner and Tenant Admin see tenant administration; branch users see only their permitted modules.
        </p>
      </div>
    </AppShell>
  );
}
