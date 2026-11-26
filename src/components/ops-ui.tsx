import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { tatTone } from "@/lib/ops";
import type { CaseRow } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function TatBadge({ c }: { c: CaseRow }) {
  const t = tatTone(c.tatLeft, c.stage);
  const label = t === "done" ? "Completed" : t === "overdue" ? `Overdue ${-c.tatLeft}d` : t === "today" ? (c.tatLeft === 0 ? "Due today" : "Due in 1d") : `${c.tatLeft}d left`;
  return (
    <Badge variant="outline" className={cn(
      "font-medium",
      t === "ok" && "border-success/30 bg-success/10 text-success",
      t === "today" && "border-warning/40 bg-warning/10 text-warning",
      t === "overdue" && "border-destructive/30 bg-destructive/10 text-destructive",
      t === "done" && "text-muted-foreground",
    )}>{label}</Badge>
  );
}

export function PriorityBadge({ p }: { p: CaseRow["priority"] }) {
  return <Badge variant={p === "High" ? "destructive" : "secondary"} className="font-medium">{p}</Badge>;
}

export function StatCard({ label, value, hint, icon }: { label: string; value: ReactNode; hint?: string; icon?: ReactNode }) {
  return (
    <Card className="border-border shadow-sm">
      <CardContent className="flex items-start justify-between gap-2 p-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 font-display text-xl font-semibold tabular-nums text-foreground">{value}</p>
          {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
        </div>
        {icon && <div className="rounded-md bg-primary/10 p-1.5 text-primary">{icon}</div>}
      </CardContent>
    </Card>
  );
}

export function EmptyRow({ text }: { text: string }) {
  return <div className="py-6 text-center text-sm text-muted-foreground">{text}</div>;
}
