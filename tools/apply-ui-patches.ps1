# ValuationPro Phase 8 - careful additive UI changes.
# Run from D:\valuationpro-workspace-main AFTER copying the new src files.
# Validates ALL target patterns before modifying ANY file. Keeps .phase8.bak backups.
$ErrorActionPreference = 'Stop'
$root = (Get-Location).Path
$app = Join-Path $root 'src\components\app-shell.tsx'
$data = Join-Path $root 'src\lib\data.ts'
$matrix = Join-Path $root 'src\routes\admin.roles-permissions.tsx'
foreach ($path in @($app,$data,$matrix)) { if (-not (Test-Path $path)) { throw "Missing $path" } }
$files = @{}
foreach ($path in @($app,$data,$matrix)) { $files[$path] = [System.IO.File]::ReadAllText($path).Replace("`r`n", "`n") }
function Once([string]$text,[string]$old,[string]$new,[string]$name) {
  $count = ([regex]::Matches($text,[regex]::Escape($old))).Count
  if ($count -ne 1) { throw "$name: expected exactly one match; found $count. No changes were written." }
  return $text.Replace($old,$new)
}
if ($files[$app].Contains('to: "/analytics"') -or $files[$data].Contains('id: "analytics"')) {
  throw 'Phase 8 UI edits already present or partially applied. Check the files manually.'
}
$nav = $files[$app]
$nav = Once $nav '  Receipt,' "  Receipt,`n  BarChart3," 'Sidebar icon import'
$nav = Once $nav '  { label: "Billing & MIS", to: "/billing-mis", icon: Receipt },' "  { label: `"Billing & MIS`", to: `"/billing-mis`", icon: Receipt },`n  { label: `"Analytics & Audit`", to: `"/analytics`", icon: BarChart3 }," 'Sidebar link'
$permission = $files[$data]
$permission = Once $permission '  { id: "admin", name: "Administration", icon: "Settings", actions: ["View", "Manage Users", "Manage Roles", "Edit Settings", "Audit Logs"] },' "  { id: `"analytics`", name: `"Analytics & Audit`", icon: `"Receipt`", actions: [`"View`", `"Audit`", `"Export`"] },`n  { id: `"admin`", name: `"Administration`", icon: `"Settings`", actions: [`"View`", `"Manage Users`", `"Manage Roles`", `"Edit Settings`", `"Audit Logs`"] }," 'Role Matrix module'
$roles = $files[$matrix]
$roles = Once $roles '  Receipt,' "  Receipt,`n  BarChart3," 'Role Matrix icon import'
$roles = Once $roles '  billing: Receipt,' "  billing: Receipt,`n  analytics: BarChart3," 'Role Matrix icon lookup'
$oldCall = @'
    const { error } = await vpDb.rpc('vp_admin_replace_module_permissions', {
      p_role: roleId, p_module: moduleId, p_actions: actions,
    });
'@
$newCall = @'
    const { error } = moduleId === 'analytics'
      ? await vpDb.rpc('vp8_admin_set_analytics_permissions', { p_role: roleId, p_actions: actions })
      : await vpDb.rpc('vp_admin_replace_module_permissions', {
          p_role: roleId, p_module: moduleId, p_actions: actions,
        });
'@
$roles = Once $roles $oldCall $newCall 'Role Matrix RPC routing'
# ALL validations passed; backup and then write changes.
foreach ($path in @($app,$data,$matrix)) { Copy-Item -LiteralPath $path -Destination ($path+'.phase8.bak') -Force }
[System.IO.File]::WriteAllText($app,$nav,[System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText($data,$permission,[System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText($matrix,$roles,[System.Text.UTF8Encoding]::new($false))
Write-Host 'Phase 8 sidebar and Role Matrix patches applied. Backups: *.phase8.bak' -ForegroundColor Green
