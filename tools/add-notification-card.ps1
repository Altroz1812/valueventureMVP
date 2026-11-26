# OPTIONAL. Run from your current ValuationPro project root.
# Only edits src/routes/index.tsx; refuses ambiguous changes; creates a backup.
$ErrorActionPreference = 'Stop'
$file = Join-Path (Get-Location) 'src\routes\index.tsx'
if (-not (Test-Path -LiteralPath $file)) { throw "Dashboard file not found: $file" }
$source = [System.IO.File]::ReadAllText($file)
$import = 'import { VpNotificationCenter } from "@/components/notifications/vp-notification-center";'
$anchor = '<div className="space-y-6">'
if (-not $source.Contains($import)) {
    # import before the current export, preserving the existing imports and route.
    $match = [regex]::Match($source, '(?m)^export const Route')
    if (-not $match.Success) { throw 'Cannot identify route import location; apply manual README instructions' }
    $source = $source.Insert($match.Index, $import + [Environment]::NewLine + [Environment]::NewLine)
}
if (-not $source.Contains('<VpNotificationCenter />')) {
    $count = ([regex]::Matches($source, [regex]::Escape($anchor))).Count
    if ($count -ne 1) { throw "Found $count dashboard sidebar anchors; cannot patch safely. Apply README instructions manually." }
    $source = $source.Replace($anchor, $anchor + [Environment]::NewLine + '          <VpNotificationCenter />')
}
Copy-Item -LiteralPath $file -Destination ($file + '.phase7.bak') -Force
[System.IO.File]::WriteAllText($file, $source)
Write-Host 'Dashboard notification card added. Original backed up as index.tsx.phase7.bak.'
