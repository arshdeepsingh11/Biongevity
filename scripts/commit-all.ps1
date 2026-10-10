# Biongevity — one commit per change.
# Run from repo root:  powershell -ExecutionPolicy Bypass -File scripts\commit-all.ps1
# 1) prune: delete files in src/ that are not part of this version (scripts/manifest.txt)
# 2) commit: one commit per line of scripts/commits.txt  (message|path path ...)
# 3) sync:   commit anything left so the tree is clean
$ErrorActionPreference = "Continue"
$keep = @{}; foreach ($m in Get-Content "scripts/manifest.txt") { if ($m.Trim()) { $keep[$m.Trim()] = $true } }
$root = (Get-Location).Path
$pruned = 0
Get-ChildItem -LiteralPath "src" -Recurse -File | ForEach-Object {
  $rel = $_.FullName.Substring($root.Length + 1).Replace("\", "/")
  if (-not $keep.ContainsKey($rel)) { Remove-Item -LiteralPath $_.FullName -Force; $pruned++; Write-Host "- pruned $rel" }
}
Get-ChildItem -LiteralPath "src" -Recurse -Directory | Sort-Object { $_.FullName.Length } -Descending | ForEach-Object {
  if (-not (Get-ChildItem -LiteralPath $_.FullName -Force)) { Remove-Item -LiteralPath $_.FullName -Force }
}
Write-Host "Pruned $pruned stale files."

$n = 0
foreach ($line in Get-Content "scripts/commits.txt") {
  if (-not $line.Trim()) { continue }
  $parts = $line.Split("|", 2); $msg = $parts[0]
  $specs = @()
  foreach ($p in $parts[1].Split(" ", [System.StringSplitOptions]::RemoveEmptyEntries)) {
    $tracked = $false; git ls-files --error-unmatch -- ":(literal)$p" 2>$null | Out-Null; if ($LASTEXITCODE -eq 0) { $tracked = $true }
    if ((Test-Path -LiteralPath $p) -or $tracked) { $specs += ":(literal)$p" }
  }
  if ($specs.Count -eq 0) { Write-Host "- skip (nothing to do): $msg"; continue }
  git add -A -- $specs
  git diff --cached --quiet
  if ($LASTEXITCODE -eq 0) { Write-Host "- skip (no change): $msg"; continue }
  git commit -q -m $msg
  $n++; Write-Host "OK [$n] $msg"
}
git add -A
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) { git commit -q -m "chore: sync remaining files"; $n++; Write-Host "OK [$n] chore: sync remaining files" }
Write-Host "Done: $n commits."
