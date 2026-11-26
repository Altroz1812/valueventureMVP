import type { QueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Always leave a signed-out user at the root login screen.
 * Replace, rather than push, the route to avoid retaining the active
 * protected location as the next login destination.
 */
export async function vpSignOutToHome(queryClient: QueryClient): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  queryClient.clear();
  // A full replacement also resets mounted components and stale tenant state.
  if (typeof window !== 'undefined') window.location.replace('/');
}
