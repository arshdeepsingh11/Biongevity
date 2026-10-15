# Biongevity - one commit per small change.
# Run from repo root:  powershell -ExecutionPolicy Bypass -File scripts\commit-all.ps1
# 1) prune:  delete files in src/ that are not part of this version (scripts/manifest.txt)
# 2) commit: one commit per line of scripts/commits.txt   (message|path path@stage ...)
#            "path@N" first copies scripts/stages/N/path over path, so one file can get several small commits.
#            A plain "path" restores the final version of that file.
# 3) clean:  remove the staging folders and commit anything left so the tree is clean
$ErrorActionPreference = "Continue"
$root = (Get-Location).Path
$keep = @{}; foreach ($m in Get-Content "scripts/manifest.txt") { if ($m.Trim()) { $keep[$m.Trim()] = $true } }
$pruned = 0
Get-ChildItem -LiteralPath "src" -Recurse -File | ForEach-Object {
  $rel = $_.FullName.Substring($root.Length + 1).Replace("\", "/")
  if (-not $keep.ContainsKey($rel)) { Remove-Item -LiteralPath $_.FullName -Force; $pruned++; Write-Host "- pruned $rel" }
}
Get-ChildItem -LiteralPath "src" -Recurse -Directory | Sort-Object { $_.FullName.Length } -Descending | ForEach-Object {
  if (-not (Get-ChildItem -LiteralPath $_.FullName -Force)) { Remove-Item -LiteralPath $_.FullName -Force }
}
Write-Host "Pruned $pruned stale files."

function Ensure-Dir($rel) { [System.IO.Directory]::CreateDirectory((Join-Path $root (Split-Path $rel -Parent))) | Out-Null }

# Back up the final version of every file named in commits.txt
$final = "scripts/.final"
$lines = Get-Content "scripts/commits.txt" -Encoding UTF8
foreach ($line in $lines) {
  if (-not $line.Trim()) { continue }
  foreach ($spec in $line.Split("|", 2)[1].Split(" ", [System.StringSplitOptions]::RemoveEmptyEntries)) {
    $p = $spec.Split("@")[0]
    if ((Test-Path -LiteralPath $p) -and -not (Test-Path -LiteralPath "$final/$p")) {
      Ensure-Dir "$final/$p"
      Copy-Item -LiteralPath $p -Destination (Join-Path $root "$final/$p") -Force
    }
  }
}

$n = 0
foreach ($line in $lines) {
  if (-not $line.Trim()) { continue }
  $parts = $line.Split("|", 2); $msg = $parts[0]
  $specs = @()
  foreach ($spec in $parts[1].Split(" ", [System.StringSplitOptions]::RemoveEmptyEntries)) {
    $bits = $spec.Split("@"); $p = $bits[0]
    if ($bits.Count -gt 1) {
      Ensure-Dir $p
      Copy-Item -LiteralPath "scripts/stages/$($bits[1])/$p" -Destination (Join-Path $root $p) -Force
    } elseif (Test-Path -LiteralPath "$final/$p") {
      Copy-Item -LiteralPath "$final/$p" -Destination (Join-Path $root $p) -Force
    }
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

# Restore every final file (safety), then remove the staging folders
if (Test-Path $final) {
  Get-ChildItem -LiteralPath $final -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring((Join-Path $root $final).Length + 1)
    Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $root $rel) -Force
  }
  Remove-Item -Recurse -Force $final
}
if (Test-Path "scripts/stages") { Remove-Item -Recurse -Force "scripts/stages" }
git add -A
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) { git commit -q -m "chore: sync remaining files"; $n++; Write-Host "OK [$n] chore: sync remaining files" }
Write-Host "Done: $n commits."
Write-Host "Next: git push origin ai/neural-noir"
