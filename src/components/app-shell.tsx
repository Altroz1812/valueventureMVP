import { VpSubscriptionUsage } from '@/components/vp-subscription-usage';
import { VpDemoBanner } from '@/components/vp-demo-banner';
import { useEffect, useState, type ReactNode } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Bell, Menu, LogOut, ChevronDown, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/app-context';
import { mayOpenPath } from '@/lib/vp-p10-permissions';
import { workspaceGroups, isWorkspacePath, type WorkspaceEntry } from '@/lib/vp-workspace-nav';
import { vpSignOutToHome } from '@/lib/vp-session';
import { FieldMobileBottomNav } from '@/components/field/vp-mobile-bottom-nav';

import { VpIcon } from '@/components/workspace/vp-icon';
import { VpCommandMenu } from '@/components/workspace/vp-command-menu';

function initials(name: string) { return name.trim().split(/\s+/).slice(0,2).map(w=>w.charAt(0)).join('').toUpperCase() || 'VP'; }
function Brand({ collapsed = false }: { collapsed?: boolean }) {
  return <div className="flex min-w-0 items-center gap-3"><span className="vp-brand-mark flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#2563eb] text-white"><svg viewBox="0 0 32 32" className="size-6" fill="none" aria-hidden="true"><path d="M5 12 16 5l11 7-11 7L5 12Zm0 0v8l11 7 11-7v-8M16 19v8" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round"/><path d="m11 9 11 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg></span>{!collapsed&&<div className="min-w-0"><p className="truncate text-base font-semibold tracking-tight">ValuationPro</p><p className="text-xs text-slate-300">Agency workspace</p></div>}</div>;
}
export function TenantSwitcher() {
  const {tenant}=useApp();
  return <div className="flex min-w-0 items-center gap-2"><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">{initials(tenant.name)}</span><div className="min-w-0"><p className="text-xs text-muted-foreground">Organization</p><p className="max-w-[180px] truncate text-sm font-semibold" title={tenant.name}>{tenant.name}</p></div></div>;
}
export function BranchSelector() {
  const {branch,setBranch,tenantBranches,canUseAllBranches}=useApp();
  // Show the actual filter, not a different branch chosen only for display.
  const visible=tenantBranches.some(b=>b.id===branch);
  return <Select value={branch==='all'||visible?branch:''} onValueChange={setBranch}>
    <SelectTrigger className="h-10 lg:h-8 w-[168px] max-w-full bg-card" aria-label="Branch context"><SelectValue placeholder="Select branch"/></SelectTrigger>
    <SelectContent>{(canUseAllBranches||branch==='all')&&<SelectItem value="all">{canUseAllBranches?'All branches':'Assigned branches'}</SelectItem>}{tenantBranches.map(b=><SelectItem key={b.id} value={b.id} disabled={b.status==='Inactive'&&!canUseAllBranches}>{b.name}</SelectItem>)}</SelectContent>
  </Select>;
}
function WorkspaceNavigation({collapsed=false,mobile=false,onExpand}:{collapsed?:boolean;mobile?:boolean;onExpand?:()=>void}) {
  const {capabilities}=useApp(); const pathname=useRouterState({select:s=>s.location.pathname});
  const [expanded,setExpanded]=useState<Record<string,boolean>>({});
  const groups=workspaceGroups(capabilities);
  function renderLink(item:WorkspaceEntry,nested=false){
    const active=isWorkspacePath(pathname,item.to);
    const link=<Link to={item.to} aria-label={item.label} aria-current={active?'page':undefined} title={collapsed?item.label:undefined} className={cn('vp-nav-link flex min-h-11 lg:min-h-9 items-center gap-2 rounded-md px-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300',collapsed&&'justify-center px-0',nested&&!collapsed&&'ml-2 pl-3',active?'bg-[#294b76] font-semibold text-white':'text-slate-200 hover:bg-white/10 hover:text-white')}><VpIcon name={item.icon}/>{!collapsed&&<span className="min-w-0">{item.label}</span>}</Link>;
    return mobile?<SheetClose key={item.to} asChild>{link}</SheetClose>:<div key={item.to}>{link}</div>;
  }
  return <nav aria-label="Main navigation" className="space-y-1">

    {groups.map(g=>{const active=g.items.some(i=>isWorkspacePath(pathname,i.to));const open=expanded[g.id]??active;if(g.items.length===1&&['dashboard','cases'].includes(g.id))return renderLink(g.items[0]!);return <div key={g.id}>
      <button type="button" title={collapsed?g.label:undefined} aria-label={g.label} aria-expanded={!collapsed&&open} onClick={()=>{if(collapsed)onExpand?.();setExpanded(p=>({...p,[g.id]:collapsed||!open}));}} className={cn('flex min-h-11 lg:min-h-9 w-full items-center gap-2 rounded-md px-2 text-left text-sm font-medium focus-visible:outline-2 focus-visible:outline-blue-300',active?'bg-white/10 text-white':'text-slate-200 hover:bg-white/10',collapsed&&'justify-center px-0')}><VpIcon name={g.icon}/>{!collapsed&&<><span className="flex-1">{g.label}</span><ChevronDown className={cn('size-4',open&&'rotate-180')} aria-hidden="true"/></>}</button>
      {!collapsed&&open&&<div className="mt-1 space-y-1">{g.items.map(i=>renderLink(i,true))}</div>}
    </div>;})}
    {!groups.length&&<p role="status" className="px-2 py-3 text-sm text-slate-300">No permitted workspaces.</p>}
  </nav>;
}
function MobileWorkspaceMenu(){const {tenant}=useApp();return <Sheet><SheetTrigger asChild><Button variant="ghost" size="icon" className="size-11 lg:hidden" aria-label="Open navigation menu"><Menu className="size-5"/></Button></SheetTrigger><SheetContent side="left" className="w-[min(22rem,90vw)] overflow-y-auto border-slate-600 bg-[#101e35] p-5 text-white"><SheetHeader className="mb-5 text-left"><SheetTitle className="text-white">ValuationPro</SheetTitle><SheetDescription className="text-slate-300">{tenant.name} · {tenant.role}</SheetDescription></SheetHeader><WorkspaceNavigation mobile/></SheetContent></Sheet>;}
export function AppShell({children}:{children:ReactNode}){
  const {tenant,currentUserName,capabilities}=useApp();const queryClient=useQueryClient();const [collapsed,setCollapsed]=useState(false);
  useEffect(()=>{try{setCollapsed(localStorage.getItem('vp-sidebar-collapsed')==='true');}catch{/* optional preference */}},[]);
  function updateCollapsed(v:boolean){setCollapsed(v);try{localStorage.setItem('vp-sidebar-collapsed',String(v));}catch{/* optional preference */}}
  function signOut(){void vpSignOutToHome(queryClient).catch((error:unknown)=>toast.error(error instanceof Error?error.message:'Sign out failed'));}
  return <div className="min-h-screen bg-background text-foreground">
    <a href="#vp-main-content" className="sr-only z-[70] rounded-md bg-card p-3 text-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to main content</a>
    <aside className={cn('vp-shell-chrome fixed inset-y-0 left-0 z-20 hidden flex-col vp-enterprise-sidebar bg-[#101e35] text-white lg:flex',collapsed?'w-[60px]':'w-[216px]')}>
      <div className="flex min-h-16 lg:min-h-12 items-center border-b border-white/15 px-3"><Brand collapsed={collapsed}/></div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2"><WorkspaceNavigation collapsed={collapsed} onExpand={()=>updateCollapsed(false)}/></div>
      <div className="border-t border-white/15 p-2"><div className="flex items-center gap-3 px-1 py-2"><Avatar className="size-9 shrink-0"><AvatarFallback className="bg-blue-100 font-semibold text-blue-900">{initials(currentUserName)}</AvatarFallback></Avatar>{!collapsed&&<div className="min-w-0"><p className="truncate text-sm font-semibold">{currentUserName}</p><p className="truncate text-xs text-slate-300">{tenant.role}</p></div>}</div></div>
    </aside>
    <div className={cn('vp-shell-body min-w-0',collapsed?'lg:ml-[60px]':'lg:ml-[216px]')}>
      <header className="vp-shell-chrome sticky top-0 z-10 border-b border-border bg-card">
        <div className="flex min-h-16 lg:min-h-12 items-center gap-2 px-3 sm:px-4"><MobileWorkspaceMenu/>
          <Button variant="ghost" size="icon" className="hidden size-11 lg:size-8 lg:inline-flex" aria-label={collapsed?'Expand sidebar':'Collapse sidebar'} aria-expanded={!collapsed} onClick={()=>updateCollapsed(!collapsed)}>{collapsed?<PanelLeftOpen/>:<PanelLeftClose/>}</Button>
          <div className="hidden min-w-0 md:block"><TenantSwitcher/></div><span className="min-w-0 truncate text-sm font-bold md:hidden">ValuationPro</span>
          <div className="ml-auto hidden sm:block"><BranchSelector/></div>
          <div className="ml-auto flex items-center gap-1 sm:ml-0"><VpCommandMenu/>{mayOpenPath('/notifications',capabilities)&&<Button asChild variant="ghost" size="icon" className="size-11 lg:size-8"><Link to="/notifications" aria-label="Notifications"><Bell className="size-5"/></Link></Button>}
            <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-11 lg:size-8" aria-label="Account menu"><Avatar className="size-9"><AvatarFallback>{initials(currentUserName)}</AvatarFallback></Avatar></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-56"><DropdownMenuLabel>{currentUserName}</DropdownMenuLabel><DropdownMenuSeparator/><DropdownMenuItem onClick={signOut}><LogOut className="mr-2 size-4"/>Sign out</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
          </div>
        </div><div className="border-t border-border px-4 py-2 sm:hidden"><BranchSelector/></div>
      </header>
      <main id="vp-main-content" tabIndex={-1} className="vp-workspace mx-auto min-w-0 w-full max-w-none px-3 pb-28 pt-4 sm:px-4 md:pb-8 lg:py-3"><VpDemoBanner orgId={tenant.id} /><VpSubscriptionUsage />{children}</main>
    </div><FieldMobileBottomNav/>
  </div>;
}
export function PageHeader({title,description,children}:{title:string;description?:string;children?:ReactNode}){
  return <div className="vp-page-header mb-3 flex flex-wrap items-center justify-between gap-3"><div className="min-w-0"><h1 className="text-xl font-semibold tracking-tight">{title}</h1>{description&&<p className="mt-0.5 max-w-3xl text-sm leading-snug text-muted-foreground">{description}</p>}</div>{children&&<div className="flex flex-wrap items-center gap-2">{children}</div>}</div>;
}
