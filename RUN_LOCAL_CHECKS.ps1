param([Parameter(Mandatory=$true)][string]$ProjectRoot)
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path -LiteralPath $ProjectRoot).Path
if (!(Test-Path (Join-Path $root 'package.json'))) { throw 'Project package.json missing' }
$report = Join-Path $env:TEMP ('ValuationPro_FIN06_' + (Get-Date -Format 'yyyyMMdd_HHmmss'))
New-Item -ItemType Directory -Path $report | Out-Null
Push-Location $root
$results = @()
try {
  $steps = @(
    @{ Name='TypeScript'; Exe='node'; Args=@('node_modules/typescript/bin/tsc','--noEmit') },
    @{ Name='Regression'; Exe='node'; Args=@('node_modules/vitest/vitest.mjs','run','--pool=threads','--maxWorkers=1','--no-file-parallelism') },
    @{ Name='Dependencies'; Exe='npm.cmd'; Args=@('ls','--all','--json','--legacy-peer-deps=false') },
    @{ Name='ProductionBuild'; Exe='npm.cmd'; Args=@('run','build') }
  )
  foreach ($step in $steps) {
    $log = Join-Path $report ($step.Name + '.log')
    $exe = $step.Exe; $arguments = $step.Args
    $exitCode = -1
    $oldPreference = $ErrorActionPreference
    try {
      $ErrorActionPreference = 'Continue'
      & $exe @arguments 2>&1 | Tee-Object -FilePath $log | Out-Host
      $exitCode = $LASTEXITCODE
    } catch { $_ | Out-File -FilePath $log -Append } finally { $ErrorActionPreference = $oldPreference }
    $status = if ($exitCode -eq 0) {'PASS'} else {'FAIL'}
    $results += [pscustomobject]@{Check=$step.Name;Status=$status;ExitCode=$exitCode;Log=$log}
  }
} finally { Pop-Location }
$results | Export-Csv (Join-Path $report 'results.csv') -NoTypeInformation
$results | Format-Table -AutoSize
Write-Host "Evidence folder: $report"
Write-Host 'Local build/test evidence only. Database, role, concurrency and browser UAT are separate mandatory gates.'
if ($results.Count -ne 4 -or @($results | Where-Object Status -ne 'PASS').Count -gt 0) { exit 1 }
exit 0
