import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// The repo's generated Database type targets a different UUID schema.
// The Phase-1 SQL/RPC contract is deliberately kept separate until the live
// 16-table types are regenerated from the user's Supabase project.
export const vpDb = supabase as unknown as SupabaseClient;

export type VpIdentity = {
  org_id: string;
  org_name: string;
  org_code: string;
  org_type: string;
  user_id: string;
  user_name: string;
  email: string;
  role: string;
  is_admin: boolean;
};

