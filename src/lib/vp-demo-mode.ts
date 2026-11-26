export type WorkspaceMode = 'demo' | 'live' | 'unknown';
export function workspaceMode(value: unknown): WorkspaceMode {
  if (value === true) return 'demo';
  if (value === false) return 'live';
  return 'unknown';
}
