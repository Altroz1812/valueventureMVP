
import {
  createFileRoute,
  Link,
} from '@tanstack/react-router';

import {
  ArrowUpRight,
  CalendarClock,
  Home,
  Users,
  ShieldCheck,
  FilePenLine, MapPin, Camera, ChevronRight, ClipboardList,
} from 'lucide-react';

import {
  AppShell,
  PageHeader,
} from '@/components/app-shell';

import {
  Vp9DashboardCards,
  VpWorkloadGraphic,
  Vp9DashboardBranchPerformance,
  Vp9DashboardActivity,
  Vp9DashboardRecentCases,
  Vp9DashboardOverdueBanner,
} from '@/components/dashboard/vp9-dashboard-cards';

import { Button } from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useApp } from '@/lib/app-context';
import { useQuery } from '@tanstack/react-query';
import { vpDb } from '@/lib/vp-db';
import { useVpFieldVisits } from '@/lib/vp-field';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {
        title: 'ValuationPro — Agency Dashboard',
      },
      {
        name: 'description',
        content:
          'Live valuation case pipeline, QC queue and branch performance across your agency branches.',
      },
      {
        property: 'og:title',
        content: 'ValuationPro — Agency Dashboard',
      },
      {
        property: 'og:description',
        content:
          'Live valuation case pipeline, QC queue and branch performance across your agency branches.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
  }),

  component: Dashboard,
});

function Dashboard() {
  const {
    tenant,
    branch,
    tenantBranches,
    can,
    branchLabel,
  } = useApp();

  // Role Matrix permissions.
  const canViewAnalytics = can('analytics.View');
  const canAdminister = can('tenant.admin');

  const canViewCases = can('cases.View');

  
  const canOpenField = can('field.View') || can('field.Assign') || can('field.Check In/Out');
  const canOpenQc = can('qc.View');
  const canOpenBilling = can('billing.View');
  const canOpenReports = can('signoff.View') || can('signoff.Generate');

  const selectedBranch =
    branch === 'all'
      ? null
      : tenantBranches.find(
          (b) => b.id === branch
        );

  const branchName =
    branch === 'all'
      ? branchLabel
      : selectedBranch?.name ?? 'Selected Branch';

  const description =
    `Workspace overview for ${tenant.name} · ${branchName}`;

  if (tenant.role === 'Field Officer' && canOpenField) {
    return <FieldOfficerHome />;
  }

  return (
    <AppShell>
      <PageHeader
        title="Agency overview"
        description={description}
      >

        {canViewCases && (
          <Button asChild size="sm">
            <Link to="/cases">
              <ArrowUpRight className="size-4" />
              Open cases
            </Link>
          </Button>
        )}
      </PageHeader>

      {!canViewAnalytics ? (
        <Card className="mt-6 border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="size-5" />
              Welcome to your workspace
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You can open the modules permitted to your role. Live dashboard
              statistics are available only when Analytics → View is enabled
              in your Role Matrix.
            </p>
            <div className="flex flex-wrap gap-2">
              {canViewCases && <Button asChild size="sm" variant="outline"><Link to="/cases">Cases</Link></Button>}
              {canOpenField && <Button asChild size="sm" variant="outline"><Link to="/field-operations" search={{ view: 'visits' }}>Field Operations</Link></Button>}
              {canOpenQc && <Button asChild size="sm" variant="outline"><Link to="/qc-checking">QC &amp; Checking</Link></Button>}
              {canOpenReports && <Button asChild size="sm" variant="outline"><Link to="/reports">Reports</Link></Button>}
              {canOpenBilling && <Button asChild size="sm" variant="outline"><Link to="/billing-mis">Billing &amp; MIS</Link></Button>}
              {canAdminister && (
                <>
                  <Button asChild size="sm" variant="outline"><Link to="/admin/users"><Users className="mr-2 size-4" />Users</Link></Button>
                  <Button asChild size="sm" variant="outline"><Link to="/admin/roles-permissions"><ShieldCheck className="mr-2 size-4" />Role Matrix</Link></Button>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Access is determined by your assigned role. If a required module
              is missing, contact your tenant administrator.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="vp-dashboard-layout">
          <Vp9DashboardOverdueBanner />

          <Vp9DashboardCards />

          <div className="vp-dashboard-grid mt-3">
            <Vp9DashboardRecentCases />

            <div className="min-w-0 space-y-3">
              <VpWorkloadGraphic/>
              <Vp9DashboardBranchPerformance />

              <Vp9DashboardActivity />
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}


/** A proper mobile landing page for the Field Officer, rather than analytics-denied desktop widgets. */
function FieldOfficerHome() {
  const {tenant,currentUserName}=useApp();
  const visitsQuery=useVpFieldVisits();
  const self=useQuery({
    queryKey:['vp-field-self',tenant.id],
    queryFn:async():Promise<string>=>{
      const {data,error}=await vpDb.rpc('vp_field_my_user_id');
      if(error)throw error;
      if(data==null)throw new Error('No assigned field officer identity');
      return String(data);
    }, retry:false,
  });
  const myVisits=(visitsQuery.data??[]).filter(v=>v.status!=='Cancelled'&&self.data===String(v.assigned_user_id));
  const next=myVisits.find(v=>v.status==='On site')??myVisits.find(v=>v.status==='Scheduled')??myVisits[0];
  const scheduled=myVisits.filter(v=>v.status==='Scheduled').length;
  const active=myVisits.filter(v=>v.status==='On site').length;
  return <AppShell>
    <div className="mx-auto max-w-2xl space-y-5">
      <section className="rounded-2xl bg-primary p-5 text-primary-foreground shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/75">Field Officer workspace</p>
        <h1 className="mt-2 font-display text-2xl font-bold">My Field Visits</h1>
        <p className="mt-1 text-sm text-primary-foreground/80">Welcome, {currentUserName}. Manage your assigned cases from your phone.</p>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-white/10 p-3"><p className="text-2xl font-bold">{myVisits.length}</p><p className="text-xs text-primary-foreground/80">Assigned</p></div>
          <div className="rounded-xl bg-white/10 p-3"><p className="text-2xl font-bold">{scheduled}</p><p className="text-xs text-primary-foreground/80">Scheduled</p></div>
          <div className="rounded-xl bg-white/10 p-3"><p className="text-2xl font-bold">{active}</p><p className="text-xs text-primary-foreground/80">On site</p></div>
        </div>
      </section>
      {(visitsQuery.error||self.error)&&<p className="rounded-xl border border-destructive p-3 text-sm text-destructive" role="alert">Could not load assigned visit details: {String(visitsQuery.error?.message??self.error?.message)}</p>}
      {(visitsQuery.isLoading||self.isLoading)&&<p className="text-sm text-muted-foreground" role="status">Loading assigned visits…</p>}
      <div className="grid grid-cols-2 gap-3">
        <Button asChild className="min-h-14 rounded-xl"><Link to="/field-operations" search={{view:'visits'}}><MapPin className="mr-2 size-4"/>My Visits</Link></Button>
        <Button asChild className="min-h-14 rounded-xl" variant="outline"><Link to="/field-operations" search={{view:'reports'}}><FilePenLine className="mr-2 size-4"/>My Reports</Link></Button>
      </div>
      {next?<Card className="rounded-2xl border-border"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><CalendarClock className="size-5"/>Next assigned visit</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between"><strong>Case #{next.num}</strong><span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">{next.status}</span></div>
          <p className="text-sm text-muted-foreground">{new Date(next.scheduled_at).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'})}</p>
          <div className="grid grid-cols-2 gap-2 text-xs"><div className="rounded-xl bg-muted/60 p-3"><MapPin className="mb-1 size-4"/>GPS {next.checkin_at?'recorded':'pending'}</div>
            <div className="rounded-xl bg-muted/60 p-3"><Camera className="mb-1 size-4"/>{next.photo_count} real photos</div></div>
          <Button asChild className="min-h-12 w-full rounded-xl"><Link to="/field-inspections/$visitId" params={{visitId:String(next.id)}}><FilePenLine className="mr-2 size-4"/>Continue Report<ChevronRight className="ml-auto size-4"/></Link></Button>
        </CardContent></Card>
      :!visitsQuery.isLoading&&!self.isLoading?<div className="rounded-2xl border border-dashed p-6 text-center"><ClipboardList className="mx-auto mb-2 size-8 text-muted-foreground"/><p className="text-sm font-semibold">No assigned visits</p><p className="text-xs text-muted-foreground">QC will assign your first case.</p></div>:null}
      <p className="text-xs text-muted-foreground">GPS check-in, original site photos and report submissions are protected actions and remain separate from voice entry.</p>
    </div>
  </AppShell>;
}
