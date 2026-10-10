#!/usr/bin/env bash
# One commit per change from scripts/commits.txt. Run from repo root: bash scripts/commit-all.sh
n=0
while IFS='|' read -r kind msg files; do
  [ -z "${kind:-}" ] && continue
  read -r -a paths <<< "$files"
  if [ "$kind" = "rm" ]; then
    keep=(); for p in "${paths[@]}"; do git ls-files --error-unmatch -- "$p" >/dev/null 2>&1 && keep+=("$p"); done
    [ ${#keep[@]} -eq 0 ] && { echo "- skip (already removed): $msg"; continue; }
    git rm -q -- "${keep[@]}" || exit 1
  else
    git add -- "${paths[@]}" || exit 1
  fi
  git diff --cached --quiet && { echo "- skip (no change): $msg"; continue; }
  git commit -q -m "$msg"; n=$((n+1)); echo "OK [$n] $msg"
done < scripts/commits.txt
echo "Done: $n commits."
