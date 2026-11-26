import { Link, useRouterState } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { CalendarDays, CircleUserRound, FileText, House, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useApp } from '@/lib/app-context';
import { cn } from '@/lib/utils';
import { vpSignOutToHome } from '@/lib/vp-session';

/** Only the Field Officer's mobile workspace gets this navigation. It grants no permissions. */
export function FieldMobileBottomNav() {
  const { tenant, currentUserName, can } = useApp();
  const queryClient = useQueryClient();
  const location = useRouterState({ select: state => state.location });
  if (tenant.role !== 'Field Officer' || !(
    can('field.View') || can('field.Check In/Out')
  )) return null;
  const onField = location.pathname === '/field-operations';
  const reportTab = onField && (location.search as Record<string, unknown>)['view'] === 'reports';
  const inInspection = location.pathname.startsWith('/field-inspections/');
  const item = 'flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 text-xs font-medium transition-colors';
  const active = 'bg-primary/10 text-primary';
  const idle = 'text-muted-foreground hover:bg-muted hover:text-foreground';
  return <nav aria-label="Field Officer mobile navigation" className="vp-field-bottom-nav fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 px-2 pt-2 shadow-[0_-8px_20px_-18px_#000] backdrop-blur md:hidden">
    <div className="mx-auto flex max-w-lg items-stretch gap-1">
      <Link to="/" aria-label="Home" aria-current={location.pathname==='/'?'page':undefined} className={cn(item,location.pathname==='/'?active:idle)}>
        <House className="size-5"/><span>Home</span>
      </Link>
      <Link to="/field-operations" search={{view:'visits'}} aria-label="My visits" aria-current={onField&&!reportTab?'page':undefined} className={cn(item,onField&&!reportTab?active:idle)}>
        <CalendarDays className="size-5"/><span>Visits</span>
      </Link>
      <Link to="/field-operations" search={{view:'reports'}} aria-label="My reports" aria-current={reportTab||inInspection?'page':undefined} className={cn(item,reportTab||inInspection?active:idle)}>
        <FileText className="size-5"/><span>Reports</span>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger className={cn(item,idle,'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary')} aria-label="Profile and sign out">
          <CircleUserRound className="size-5"/><span>Profile</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" className="mb-3 w-60">
          <DropdownMenuLabel><span className="block truncate">{currentUserName}</span><span className="text-xs font-normal text-muted-foreground">{tenant.role} · {tenant.name}</span></DropdownMenuLabel>
          <DropdownMenuSeparator/>
          <DropdownMenuItem onClick={() => void vpSignOutToHome(queryClient).catch((error: unknown) => toast.error(error instanceof Error ? error.message : 'Sign out failed'))}>
            <LogOut className="mr-2 size-4"/> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </nav>;
}
