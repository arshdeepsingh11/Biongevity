#!/usr/bin/env bash
# Biongevity - one commit per small change. Run from repo root: bash scripts/commit-all.sh
# commits.txt: "message|path path@N ..."  ("path@N" = copy scripts/stages/N/path first; plain path = final version)
pruned=0
while IFS= read -r f; do
  grep -qxF "$f" scripts/manifest.txt || { rm -f -- "$f"; pruned=$((pruned+1)); echo "- pruned $f"; }
done < <(find src -type f)
find src -type d -empty -delete
echo "Pruned $pruned stale files."
final=scripts/.final
while IFS='|' read -r msg files; do
  [ -z "${msg:-}" ] && continue
  for spec in $files; do p="${spec%%@*}"
    if [ -e "$p" ] && [ ! -e "$final/$p" ]; then mkdir -p "$(dirname "$final/$p")"; cp -- "$p" "$final/$p"; fi
  done
done < scripts/commits.txt
n=0
while IFS='|' read -r msg files; do
  [ -z "${msg:-}" ] && continue
  specs=()
  for spec in $files; do
    p="${spec%%@*}"
    if [ "$spec" != "$p" ]; then mkdir -p "$(dirname "$p")"; cp -- "scripts/stages/${spec##*@}/$p" "$p";
    elif [ -e "$final/$p" ]; then cp -- "$final/$p" "$p"; fi
    if [ -e "$p" ] || git ls-files --error-unmatch -- ":(literal)$p" >/dev/null 2>&1; then specs+=(":(literal)$p"); fi
  done
  [ ${#specs[@]} -eq 0 ] && { echo "- skip (nothing to do): $msg"; continue; }
  git add -A -- "${specs[@]}"
  git diff --cached --quiet && { echo "- skip (no change): $msg"; continue; }
  git commit -q -m "$msg"; n=$((n+1)); echo "OK [$n] $msg"
done < scripts/commits.txt
if [ -d "$final" ]; then (cd "$final" && find . -type f) | while read -r f; do cp -- "$final/$f" "$f"; done; rm -rf "$final"; fi
rm -rf scripts/stages
git add -A
git diff --cached --quiet || { git commit -q -m "chore: sync remaining files"; n=$((n+1)); echo "OK [$n] chore: sync remaining files"; }
echo "Done: $n commits."
echo "Next: git push origin ai/neural-noir"
