import { createFileRoute, Link } from '@tanstack/react-router';
import { AppShell, PageHeader } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
export const Route = createFileRoute("/admin/settings/branches/$id")({
  head: () => ({
    meta: [
      { title: "ValuationPro — Branch Configuration" },
      { name: "description", content: "Field-level configuration inheritance between agency defaults and branch overrides." },
      { property: "og:title", content: "ValuationPro — Branch Configuration" },
      { property: "og:description", content: "Field-level configuration inheritance between agency defaults and branch overrides." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BranchSettingsPage,
});

function BranchSettingsPage(){
  return <AppShell><PageHeader title="Branch configuration" description="Manage your agency's live branch records from Administration."/><Card><CardContent className="space-y-4 p-5"><div className="flex items-start gap-3"><AlertTriangle className="size-5 shrink-0 text-warning" aria-hidden="true"/><div><h2 className="font-semibold">Legacy configuration preview retired</h2><p className="mt-1 text-sm text-muted-foreground">The former settings screen used sample values and did not persist changes to the database. Live workflow defaults and branch overrides require a separate configuration migration. Manage existing branch records using the branch register.</p></div></div><Button asChild><Link to="/admin/branches"><ArrowLeft className="size-4"/>Open branch register</Link></Button></CardContent></Card></AppShell>;
}
