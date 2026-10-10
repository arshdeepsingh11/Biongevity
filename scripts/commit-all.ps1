# One commit per change from scripts/commits.txt (lines: add|msg|paths  or  rm|msg|paths)
# Run from repo root:  powershell -ExecutionPolicy Bypass -File scripts\commit-all.ps1
$ErrorActionPreference = "Continue"
$n = 0
foreach ($line in Get-Content "scripts/commits.txt") {
  if (-not $line.Trim()) { continue }
  $parts = $line.Split("|", 3)
  $kind = $parts[0]; $msg = $parts[1]
  $paths = $parts[2].Split(" ", [System.StringSplitOptions]::RemoveEmptyEntries)
  if ($kind -eq "rm") {
    $tracked = @(); foreach ($p in $paths) { git ls-files --error-unmatch -- $p 2>$null | Out-Null; if ($LASTEXITCODE -eq 0) { $tracked += $p } }
    if ($tracked.Count -eq 0) { Write-Host "- skip (already removed): $msg"; continue }
    git rm -q -- $tracked
  } else {
    git add -- $paths
  }
  if ($LASTEXITCODE -ne 0) { Write-Host "!! failed: $msg"; exit 1 }
  git diff --cached --quiet
  if ($LASTEXITCODE -eq 0) { Write-Host "- skip (no change): $msg"; continue }
  git commit -q -m $msg
  $n++
  Write-Host "OK [$n] $msg"
}
Write-Host "Done: $n commits."
