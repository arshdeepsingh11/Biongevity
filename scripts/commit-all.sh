#!/usr/bin/env bash
# Recreates the project history as one commit per change.
# Usage (from the project root, inside your new repo):
#   bash scripts/commit-all.sh
set -euo pipefail
n=0
while IFS='|' read -r msg files; do
  [ -z "$msg" ] && continue
  # shellcheck disable=SC2086
  read -r -a paths <<< "$files"
  git add -- "${paths[@]}"
  git commit -q -m "$msg"
  n=$((n+1)); echo "✓ [$n] $msg"
done < scripts/commits.txt
echo "Done: $n commits. Push with: git push -u origin main"
