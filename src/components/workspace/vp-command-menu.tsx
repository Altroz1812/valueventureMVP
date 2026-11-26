import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { useApp } from '@/lib/app-context';
import { workspaceGroups } from '@/lib/vp-workspace-nav';
import { mayOpenPath } from '@/lib/vp-p10-permissions';
import { VpIcon } from './vp-icon';
export function VpCommandMenu(){
  const [open,setOpen]=useState(false);const navigate=useNavigate();const {capabilities}=useApp();
  useEffect(()=>{const handler=(event:KeyboardEvent)=>{if(event.defaultPrevented||event.isComposing)return;if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();setOpen(v=>!v);}};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler);},[]);
  const groups=workspaceGroups(capabilities);
  function go(to:string){if(!mayOpenPath(to,capabilities))return;setOpen(false);void navigate({to});}
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild><Button variant="outline" className="h-11 lg:h-8 gap-2 bg-background px-2" aria-label="Open quick navigation (Control or Command K)"><Search className="size-[18px]" strokeWidth={1.65} aria-hidden="true"/><span className="hidden xl:inline">Jump to…</span><kbd className="ml-2 hidden rounded border bg-muted px-1.5 text-xs xl:inline">Ctrl K</kbd></Button></DialogTrigger>
    <DialogContent className="max-w-xl gap-0 overflow-hidden p-0">
      <div className="border-b px-3 pb-2 pt-3"><DialogTitle>Quick navigation</DialogTitle><DialogDescription className="mt-1">Find a permitted workspace. No customer or document search.</DialogDescription></div>
      <Command className="rounded-none"><CommandInput autoFocus aria-label="Find workspace" placeholder="Search workspaces…"/><CommandList className="max-h-[min(50vh,400px)] p-2"><CommandEmpty>No matching workspaces.</CommandEmpty>{groups.map(g=><CommandGroup key={g.id} heading={g.label}>{g.items.map(i=><CommandItem key={i.to} value={`${g.label} ${i.label} ${i.to}`} onSelect={()=>go(i.to)} className="min-h-11 lg:min-h-9 gap-2 rounded-md px-2"><VpIcon name={i.icon}/><span className="flex-1">{i.label}</span><ArrowUpRight className="size-4 text-muted-foreground" aria-hidden="true"/></CommandItem>)}</CommandGroup>)}{mayOpenPath('/notifications',capabilities)&&<CommandGroup heading="Personal"><CommandItem value="notifications" onSelect={()=>go('/notifications')}><VpIcon name="notifications"/>Notifications</CommandItem></CommandGroup>}</CommandList></Command>
      <p className="border-t px-3 py-2 text-xs text-muted-foreground">Use arrow keys to browse, Enter to open, Escape to close.</p>
    </DialogContent>
  </Dialog>;
}
