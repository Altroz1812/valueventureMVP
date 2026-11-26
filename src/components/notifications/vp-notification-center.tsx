import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Bell, CheckCheck, RefreshCw, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useApp } from "@/lib/app-context";
import {
  vpLoadAlerts, vpMarkAlertsRead, vpLoadAlertSettings, vpSaveAlertSettings,
  type VpAlert,
} from "@/lib/vp-alerts";

function timeLabel(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

function AlertLine({ alert, onMark, pending }: {
  alert: VpAlert; onMark: (id: string) => void; pending: boolean;
}) {
  return (
    <div className={`rounded-lg border px-3 py-2 ${alert.read_at ? "bg-background" : "bg-muted/30"}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {alert.severity !== "info" ? <AlertTriangle className="size-3.5 shrink-0 text-amber-600" /> :
            <Bell className="size-3.5 shrink-0 text-muted-foreground" />}
          <strong className="truncate text-xs">{alert.title}</strong>
        </div>
        {!alert.read_at && (
          <Button variant="ghost" size="sm" className="h-7 text-xs" disabled={pending}
            onClick={() => onMark(alert.id)}>Mark read</Button>
        )}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{alert.body}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">
        {alert.kind.toUpperCase()} · {timeLabel(alert.created_at)}
        {alert.case_num != null ? ` · Case #${alert.case_num}` : ""}
      </p>
    </div>
  );
}

/** Insert as an additive card into the existing dashboard; do not replace its layout. */
export function VpNotificationCenter() {
  const { tenant } = useApp();
  const qc = useQueryClient();
  const key = ["vp-alert-inbox", tenant.id];
  const inbox = useQuery({ queryKey: key, queryFn: () => vpLoadAlerts(50), refetchInterval: 60_000 });
  const isAdmin = Boolean(tenant.adminAccess);
  const settings = useQuery({
    queryKey: ["vp-alert-settings", tenant.id],
    queryFn: vpLoadAlertSettings,
    enabled: isAdmin,
  });
  const [caseDays, setCaseDays] = useState("2");
  const [invoiceDays, setInvoiceDays] = useState("3");
  useEffect(() => {
    if (settings.data) {
      setCaseDays(String(settings.data.case_warning_days));
      setInvoiceDays(String(settings.data.invoice_warning_days));
    }
  }, [settings.data]);
  const mark = useMutation({
    mutationFn: vpMarkAlertsRead,
    onSuccess: () => { void qc.invalidateQueries({ queryKey: key }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const save = useMutation({
    mutationFn: () => {
      const a = Number(caseDays), b = Number(invoiceDays);
      if (!Number.isInteger(a) || a < 0 || a > 30 || !Number.isInteger(b) || b < 0 || b > 30)
        throw new Error("Warning windows must be whole numbers between 0 and 30 days");
      return vpSaveAlertSettings(a, b);
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ["vp-alert-settings", tenant.id] }); toast.success("Alert thresholds saved"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const unread = (inbox.data ?? []).filter(a => !a.read_at);

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="flex items-center gap-2 font-display text-base">
          <Bell className="size-4" /> Notifications
          {unread.length > 0 && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{unread.length} unread</span>}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => void inbox.refetch()} disabled={inbox.isFetching}
          aria-label="Refresh notifications"><RefreshCw className="size-4" /></Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {inbox.isLoading && <p className="text-xs text-muted-foreground">Loading notifications…</p>}
        {inbox.error && <p role="alert" className="text-xs text-destructive">{(inbox.error as Error).message}</p>}
        {!inbox.isLoading && !inbox.error && inbox.data?.length === 0 &&
          <p className="text-xs text-muted-foreground">No notifications yet. Alerts appear as real workflow events occur.</p>}
        {(inbox.data ?? []).slice(0, 15).map(a =>
          <AlertLine key={a.id} alert={a} pending={mark.isPending}
            onMark={id => mark.mutate([id])} />)}
        {unread.length > 0 && (
          <Button variant="outline" size="sm" disabled={mark.isPending}
            onClick={() => mark.mutate(unread.map(a => a.id).slice(0, 100))}>
            <CheckCheck className="mr-2 size-4" /> Mark unread as read
          </Button>
        )}
        {inbox.data && inbox.data.length > 15 &&
          <p className="text-xs text-muted-foreground">Showing the 15 newest of {inbox.data.length} loaded alerts.</p>}
        {isAdmin && (
          <div className="space-y-2 rounded-lg border p-3">
            <div className="flex items-center gap-2 text-xs font-semibold"><Settings2 className="size-4" /> TAT warning settings</div>
            {settings.error && <p role="alert" className="text-xs text-destructive">{(settings.error as Error).message}</p>}
            <div className="grid grid-cols-2 gap-3">
              <label className="text-[11px] text-muted-foreground">Case warning (days)
                <Input className="mt-1 h-8" type="number" min={0} max={30} step={1}
                  value={caseDays} onChange={e => setCaseDays(e.target.value)} />
              </label>
              <label className="text-[11px] text-muted-foreground">Invoice warning (days)
                <Input className="mt-1 h-8" type="number" min={0} max={30} step={1}
                  value={invoiceDays} onChange={e => setInvoiceDays(e.target.value)} />
              </label>
            </div>
            <Button variant="outline" size="sm" disabled={save.isPending || settings.isLoading}
              onClick={() => save.mutate()}>Save warning windows</Button>
            <p className="text-[11px] text-muted-foreground">
              Due-date alerts require the trusted daily scan job. External email/WhatsApp delivery is disabled until configured separately.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
