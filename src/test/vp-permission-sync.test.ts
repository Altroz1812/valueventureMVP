
import { describe, it, expect } from 'vitest';

import {
  normalizeGrantedPermissions,
  normalizeBranchAssignments,
  workspaceAuthorizationKey,
  hasRolePermission,
  mayOpenPath
} from '../lib/vp-p10-permissions';

describe('Workspace authorization synchronization', () => {
  const identity = {
    org_id: '10',
    user_id: '21',
    role: 'Checker',
    is_admin: false
  };

  const permissions = ['qc.View', 'qc.Edit'];

  const branches = [
    { branch_id: '1' },
    { branch_id: '2' }
  ];

  const scope = workspaceAuthorizationKey(
    'test-auth-user',
    identity,
    permissions,
    branches
  );

  it('normalizes permission ordering and duplicates', () => {
    expect(normalizeGrantedPermissions([
      'qc.View', 'qc.Edit', 'qc.View'
    ])).toEqual(['qc.Edit', 'qc.View']);
  });

  it('rejects malformed permission responses', () => {
    expect(() => normalizeGrantedPermissions(null)).toThrow();
    expect(() => normalizeGrantedPermissions(['qc.View', null]))
      .toThrow();
  });

  it('preserves workspace when authorization is unchanged', () => {
    expect(workspaceAuthorizationKey(
      'test-auth-user',
      identity,
      [...permissions].reverse(),
      [...branches].reverse()
    )).toBe(scope);
  });

  it('detects revoked permissions', () => {
    expect(workspaceAuthorizationKey(
      'test-auth-user',
      identity,
      ['qc.View'],
      branches
    )).not.toBe(scope);
  });

  it('detects newly granted permissions', () => {
    expect(workspaceAuthorizationKey(
      'test-auth-user',
      identity,
      [...permissions, 'cases.View'],
      branches
    )).not.toBe(scope);
  });

  it('detects role reassignment', () => {
    expect(workspaceAuthorizationKey(
      'test-auth-user',
      { ...identity, role: 'Valuer' },
      permissions,
      branches
    )).not.toBe(scope);
  });

  it('detects removed branch allocations', () => {
    expect(workspaceAuthorizationKey(
      'test-auth-user',
      identity,
      permissions,
      [{ branch_id: '1' }]
    )).not.toBe(scope);
  });

  it('preserves bigint branch identifiers', () => {
    expect(normalizeBranchAssignments([
      { branch_id: '9223372036854775807' }
    ])).toEqual(['9223372036854775807']);

    expect(() => normalizeBranchAssignments([
      { branch_id: Number.MAX_SAFE_INTEGER + 1 }
    ])).toThrow();
  });

  it('detects a different signed-in user', () => {
    expect(workspaceAuthorizationKey(
      'another-auth-user',
      identity,
      permissions,
      branches
    )).not.toBe(scope);
  });

  it('detects a different organization', () => {
    expect(workspaceAuthorizationKey(
      'test-auth-user',
      { ...identity, org_id: '11' },
      permissions,
      branches
    )).not.toBe(scope);
  });

  it('does not invent administrative permissions', () => {
    expect(hasRolePermission(
      permissions, 'tenant.admin'
    )).toBe(false);

    expect(mayOpenPath(
      '/admin/users', permissions
    )).toBe(false);
  });

  it('denies a module after its permission is revoked', () => {
    expect(mayOpenPath(
      '/qc-checking', ['qc.View']
    )).toBe(true);

    expect(mayOpenPath(
      '/qc-checking', []
    )).toBe(false);
  });
});
