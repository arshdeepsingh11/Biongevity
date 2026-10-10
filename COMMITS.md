# ◐ Commits

```
branch   ▸ ai/aurora-glass
base     ▸ main
commits  ▸ ~105 · one per change
script   ▸ scripts/commit-all.ps1 (PowerShell) · scripts/commit-all.sh (Git Bash)
plan     ▸ scripts/commits.txt    message|paths
manifest ▸ scripts/manifest.txt   every file in this version — anything else in src/ is pruned
```

## ▸ Run

```powershell
git checkout main
git checkout -b ai/aurora-glass
# copy the update over the project
powershell -ExecutionPolicy Bypass -File scripts\commit-all.ps1
git push -u origin ai/aurora-glass
```

## ▸ Convention

`type(scope): change` — `feat` · `style` · `refactor` · `fix` · `docs` · `chore`
One logical change per commit.
