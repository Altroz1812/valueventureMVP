import { describe, expect, it } from 'vitest';
import { workspaceMode } from '@/lib/vp-demo-mode';
describe('P32 workspace identification', () => {
  it('recognizes demo', () => expect(workspaceMode(true)).toBe('demo'));
  it('recognizes live', () => expect(workspaceMode(false)).toBe('live'));
  it('rejects absent flags', () => { expect(workspaceMode(undefined)).toBe('unknown'); expect(workspaceMode(null)).toBe('unknown'); });
  it('rejects strings', () => { expect(workspaceMode('true')).toBe('unknown'); expect(workspaceMode('false')).toBe('unknown'); });
  it('rejects other types', () => { expect(workspaceMode(0)).toBe('unknown'); expect(workspaceMode({demo:true})).toBe('unknown'); });
});
