import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Branch, Tenant, UserRecord } from './data';
import { vpDb, type VpIdentity } from './vp-db';
import { hasRolePermission } from './vp-p10-permissions';

interface AppContextValue {
  tenant: Tenant;
  capabilities: readonly string[];
  can: (action: string) => boolean;
  branch: string;
  setTenantById: (id: string) => void;
  setBranch: (id: string) => void;
  tenantBranches: Branch[];
  tenantUsers: UserRecord[];
  reloadUsers: () => Promise<void>;
  reloadBranches: () => Promise<void>;
  currentUserName: string;
  canUseAllBranches: boolean;
  branchLabel: string;
}
const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children, identity, capabilities }: { children: ReactNode; identity: VpIdentity; capabilities: readonly string[] }) {
  const [branch, setBranch] = useState('all');
  const [tenantUsers, setTenantUsers] = useState<UserRecord[]>([]);
  const [tenantBranches,setTenantBranches] = useState<Branch[]>([]);
  const tenant: Tenant = useMemo(() => ({
    id: identity.org_id,
    name: identity.org_name,
    shortName: identity.org_name,
    role: identity.role as Tenant['role'],
    plan: 'Active workspace',
    status: 'active',
    adminAccess: identity.is_admin,
  }), [identity]);

  const reloadUsers = useCallback(async () => {
    const { data, error } = await vpDb.rpc('vp_list_users');
    if (error) throw error;
    setTenantUsers((data ?? []).map((u: { id: string | number; org_id: string | number; name: string; login: string; role: string; active: boolean }) => ({
      id: String(u.id), tenantId: String(u.org_id), name: u.name,
      email: u.login, mobile: '—', role: u.role,
      allocations: [], status: u.active ? 'Active' : 'Suspended',
      employeeType: '—', joined: '—',
    })) as UserRecord[]);
  }, [identity.org_id]);

  useEffect(() => { void reloadUsers().catch(console.error); }, [reloadUsers]);
  const reloadBranches = useCallback(async () => {
    const {data,error}=await vpDb.from('vp_branches').select(
      'id,org_id,name,code,branch_type,city,state,pin,address,manager_name,email,phone,geofence_km,tat_days,case_prefix,is_active,created_at'
    ).eq('org_id',identity.org_id).order('name');
    if(error) throw error;
    setTenantBranches((data??[]).map((b:any)=>({
      id:String(b.id),tenantId:String(b.org_id),name:b.name,code:b.code,
      type:b.branch_type,city:b.city,state:b.state,pin:b.pin,address:b.address,
      manager:b.manager_name,email:b.email,phone:b.phone,geofenceKm:Number(b.geofence_km),
      tatDays:b.tat_days,casePrefix:b.case_prefix,openedOn:String(b.created_at).slice(0,10),
      users:0,activeCases:0,status:b.is_active?'Active':'Inactive',
    })) as Branch[]);
  },[identity.org_id]);
  useEffect(()=>{ void reloadBranches().catch(console.error); },[reloadBranches]);

  const setTenantById = useCallback((id: string) => {
    if (id !== identity.org_id) throw new Error('Unauthorized workspace switch');
  }, [identity.org_id]);
  const canUseAllBranches = identity.is_admin || identity.role !== 'Field Officer';

  const can = (action: string) => hasRolePermission(capabilities, action);
  return <AppContext.Provider value={{
    tenant, capabilities, can, branch, setTenantById, setBranch, tenantBranches, tenantUsers,
    reloadUsers, reloadBranches, currentUserName: identity.user_name,
    canUseAllBranches, branchLabel: branch === 'all' ? (canUseAllBranches ? 'All branches' : 'Assigned branches') : (tenantBranches.find(b=>b.id===branch)?.name ?? 'Selected branch'),
  }}>{children}</AppContext.Provider>;
}
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
