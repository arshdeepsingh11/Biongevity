$ErrorActionPreference = "Stop"
$n = 0
Get-Content "scripts/commits.txt" | ForEach-Object {
  if (-not $_.Trim()) { return }
  $parts = $_.Split("|", 3)
  $msg = $parts[1]
  $paths = $parts[2].Split(" ", [System.StringSplitOptions]::RemoveEmptyEntries)
  git add -- $paths
  if ($LASTEXITCODE -ne 0) { throw "git add failed on: $msg" }
  git diff --cached --quiet
  if ($LASTEXITCODE -eq 0) { Write-Host "- skip (no change): $msg"; return }
  git commit -q -m $msg
  if ($LASTEXITCODE -ne 0) { throw "commit failed on: $msg" }
  $script:n++
  Write-Host "OK [$script:n] $msg"
}
Write-Host "Done: $n commits."
