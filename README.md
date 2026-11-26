# ValuationPro P2 — Reviewed Inspection → Valuation Integration

**Current integration delivery (15 Nov 2026).** Based on the 15 Nov P1 full-source ZIP, retaining all P0/P1 components. P2 adds verified measurement review, a stage/role-gated valuation save with an inspection-revision check, and an audit history. See **P2_DELIVERY.md** before migration. Full browser and Supabase tests are still pending.

# ValuationPro Workspace

Build the complete ValuationPro multi-tenant property valuation SaaS application based on the attached specification and agreed architecture:

1. Global Application Shell:
- Interactive Tenant Switcher (e.g. "ABC Valuers Pvt. Ltd.", switch tenant dialog) and Branch Context Selector ("Hyderabad (Main)", "Vijayawada", "Warangal", "Visakhapatnam", or "All Branches").
- Navigation sidebar with Workspace modules (Dashboard, Cases, QC & Checking, Field Operations, Reports, Billing & MIS) and Administration modules (Agency Branches, Users & Permissions, Role Matrix, Bank Masters, Configuration Settings).

2. 6-Step Guided Tenant Onboarding Wizard (/onboarding):
- Step 1: Agency Legal Profile (legal name, trade name, CIN, IBBI agency registration, PAN/GSTIN, contact details, currency, timezone, logo).
- Step 2: Primary Agency Branch (branch name, code, address, city, state, PIN, branch head, contact, operating geofence radius).
- Step 3: Invite Initial Users (name, email, tenant role, branch assignments).
- Step 4: Configure Valuation Workflow (asset classes, approval tiers, mandatory QC toggle, sign-off compliance).
- Step 5: Configure Integrations (Supabase auth, SMS/WhatsApp gateways, email intake, GPS tracking).
- Step 6: Review & Activate (summary card, pre-load sample data toggle, activation CTA).

3. User Management Directory (/admin/users):
- KPI metric strip: Total Users, Active, Pending Invites, IBBI Signatories, Multi-Branch Staff.
- Search and multi-filters: Branch, Role, Status, and Compliance filter.
- User table with avatar, contact info, tenant role, multi-branch badges with local roles, verified IBBI registration badge (with expiry tracking), status, and action dropdown.
- "Invite User" slide-over drawer with 3 tabs: Profile & Role, Multi-Branch Allocations, and Regulatory/IBBI Compliance.

4. Role & Capability Matrix Grid (/admin/roles-permissions):
- Central custom role management across modules: Case Management, Field Ops & Geofencing, QC & Review, Digital Sign-off & Legal, Billing & MIS, and Administration.
- Interactive permission checkboxes with group toggles, clone role capability, and IBBI compliance lock on sign-off permissions.

5. Agency Branch Management (/admin/branches):
- Branch listing with status, branch code, city, active cases, staff counts, and quick actions.
- Add/Edit Branch modal with geofencing radius, operating parameters, and contact info.
- Branch Details view with performance metrics, staff roster, and bank associations.

6. Configuration Inheritance (/admin/settings/branches/:id):
- Field-level inheritance comparing Agency Default vs. Branch Effective Value across Workflow/TAT, GPS Tolerances, QC Rules, and Billing.
- Two-state indicators: "Inherited Default" vs. "Custom Override" with a one-click "Revert to Agency Default" button.

7. Bank Masters & Rate Cards (/admin/bank-masters):
- PSU, Private, and NBFC client hierarchy with empanelled agency branches, empanelment validity dates, default report formats, and tariff rate cards.

Style with Tailwind CSS, Lucide icons, and shadcn/ui components, populated with realistic Indian property valuation agency seed data.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2f98d176-253a-4501-8995-5685f16e4436).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## P3 — optional document OCR

See **P3_DELIVERY.md** and **P3_ACCEPTANCE.md**. This package adds an authenticated, consent-based OCR integration for registered PDF/JPEG/PNG case documents, source-page preview, human-confirmed inspection suggestions and a per-user request audit. **The external Google Vision provider is not preconfigured, and P2 migration/runtime verification is still pending.**
