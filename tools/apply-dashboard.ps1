# Phase 9 Dashboard — minimal, safe patch against existing Phase 2+ dashboard.
# Run FROM the current ValuationPro project root. The script does NOT overwrite
# the entire index.tsx file or remove your Phase 7 notification center.
$ErrorActionPreference = 'Stop'
$file = Join-Path (Get-Location).Path 'src\routes\index.tsx'
$component = Join-Path (Get-Location).Path 'src\components\dashboard\vp9-dashboard-cards.tsx'
$client = Join-Path (Get-Location).Path 'src\lib\vp-dashboard.ts'
foreach ($p in @($file,$component,$client)) { if (-not (Test-Path -LiteralPath $p)) { throw "Missing file: $p" } }
$source = [System.IO.File]::ReadAllText($file)
if ($source.Contains('<Vp9DashboardCards />')) { throw 'Phase 9 dashboard patch is already applied. No changes written.' }
$importAnchor = 'import { AppShell, PageHeader } from "@/components/app-shell";'
$import = 'import { Vp9DashboardCards, Vp9DashboardBranchPerformance, Vp9DashboardActivity, Vp9DashboardRecentCases, Vp9DashboardOverdueBanner } from "@/components/dashboard/vp9-dashboard-cards";'
if (-not $source.Contains($importAnchor)) { throw 'Could not locate dashboard imports; update manually using README. No changes written.' }

$kpiGrid = '(?s)<div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">.*?</div>\s*(?=<div className="mt-6 grid gap-6 xl:grid-cols-3">)'
$branchCard = '(?s)<Card className="border-border shadow-sm">\s*<CardHeader className="pb-2">\s*<CardTitle className="font-display text-base">Branch Performance</CardTitle>.*?</Card>'
$recentCard = '(?s)<Card className="border-border shadow-sm xl:col-span-2">\s*<CardHeader className="flex flex-row items-center justify-between pb-2">\s*<CardTitle className="font-display text-base">Recent Cases</CardTitle>.*?</Card>'
$oldAlert = '(?s)\{error && <p role="alert".*?\{overdue\.length > 0 && \(\s*<div className="mb-6 flex items-center.*?</div>\s*\)\}'
$activityCard = '(?s)<Card className="border-border shadow-sm">\s*<CardHeader className="pb-2">\s*<CardTitle className="font-display text-base">Recent Activity</CardTitle>.*?</Card>'
$checks = @{ 'Five KPI cards'=$kpiGrid; 'Branch Performance card'=$branchCard; 'Recent Activity card'=$activityCard; 'Recent Cases card'=$recentCard; 'Old TAT banner'=$oldAlert }
foreach ($label in $checks.Keys) {
  $found = [regex]::Matches($source,$checks[$label]).Count
  if ($found -ne 1) { throw "Cannot safely patch ${label}: expected one source block, found $found. No changes written." }
}

# Stop the old Case-only activity request after replacing it with Phase 8 audit.
$oldActivity = '(?s)\r?\n\s*const activity=useQuery\(\{queryKey:\[''vp-dashboard-activity''.*?\}\}\);'
if ([regex]::Matches($source,$oldActivity).Count -eq 1) {
  $source = [regex]::Replace($source,$oldActivity,'')
}
# Remove the broad client-side cases query and old derived KPI helpers.
$caseHook = '(?m)^\s*const \{cases:tenantCases,error\}=useVpCases\(\);\r?\n'
$oldVisible = '(?m)^\s*const visibleBranches = tenantBranches\.filter\(.*?\);\r?\n'
$oldUnfinished = '(?m)^\s*const unfinished=.*?;\r?\n'
$oldActive = '(?m)^\s*const activeCases = tenantCases\.filter\(unfinished\)\.length;\r?\n'
$oldOverdue = '(?m)^\s*const overdue = tenantCases\.filter\(.*?;\r?\n'
foreach ($pattern in @($caseHook,$oldVisible,$oldUnfinished,$oldActive,$oldOverdue)) {
  if ([regex]::Matches($source,$pattern).Count -eq 1) { $source = [regex]::Replace($source,$pattern,'') }
}
# Optional obsolete Phase 2 KPI constants. They should not remain as demo data.
$oldKpis = '(?s)\r?\n\s*const kpis = \[.*?\r?\n\s*\];'
if ([regex]::Matches($source,$oldKpis).Count -eq 1) {
  $source = [regex]::Replace($source,$oldKpis,'')
}
$source = $source.Replace($importAnchor,$importAnchor + "`r`n" + $import)
$source = [regex]::Replace($source,$kpiGrid,'<Vp9DashboardCards />' + "`r`n`r`n      ")
$source = [regex]::Replace($source,$branchCard,'<Vp9DashboardBranchPerformance />')
$source = [regex]::Replace($source,$activityCard,'<Vp9DashboardActivity />')
$source = [regex]::Replace($source,$recentCard,'<Vp9DashboardRecentCases />')
$source = [regex]::Replace($source,$oldAlert,'<Vp9DashboardOverdueBanner />')

# Fix the inert 'Last 30 days' button by linking to the Phase 8 date filter screen.
$oldDate = '<Button variant="outline" size="sm">' + "`n" + '          <CalendarClock className="size-4" /> Last 30 days' + "`n" + '        </Button>'
$normalized = $source.Replace("`r`n","`n")
if ($normalized.Contains($oldDate)) {
  $normalized = $normalized.Replace($oldDate,'<Button asChild variant="outline" size="sm"><Link to="/analytics"><CalendarClock className="size-4" /> Date filters</Link></Button>')
}
$source = $normalized

Copy-Item -LiteralPath $file -Destination ($file + '.phase9.bak') -Force
[System.IO.File]::WriteAllText($file,$source,[System.Text.UTF8Encoding]::new($false))
Write-Host 'Dashboard cards and activity connected. Existing layout and Phase 7 notification preserved.' -ForegroundColor Green
Write-Host 'Backup: src\routes\index.tsx.phase9.bak'
