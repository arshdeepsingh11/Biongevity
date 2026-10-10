#!/usr/bin/env bash
# Biongevity — one commit per change. Run from repo root: bash scripts/commit-all.sh
pruned=0
while IFS= read -r f; do
  grep -qxF "$f" scripts/manifest.txt || { rm -f -- "$f"; pruned=$((pruned+1)); echo "- pruned $f"; }
done < <(find src -type f)
find src -type d -empty -delete
echo "Pruned $pruned stale files."
n=0
while IFS='|' read -r msg files; do
  [ -z "${msg:-}" ] && continue
  specs=()
  for p in $files; do
    if [ -e "$p" ] || git ls-files --error-unmatch -- ":(literal)$p" >/dev/null 2>&1; then specs+=(":(literal)$p"); fi
  done
  [ ${#specs[@]} -eq 0 ] && { echo "- skip (nothing to do): $msg"; continue; }
  git add -A -- "${specs[@]}"
  git diff --cached --quiet && { echo "- skip (no change): $msg"; continue; }
  git commit -q -m "$msg"; n=$((n+1)); echo "OK [$n] $msg"
done < scripts/commits.txt
git add -A
git diff --cached --quiet || { git commit -q -m "chore: sync remaining files"; n=$((n+1)); echo "OK [$n] chore: sync remaining files"; }
echo "Done: $n commits."
