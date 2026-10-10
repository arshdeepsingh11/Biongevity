# ◐ Commits

```
branch   ▸ ai/neural-noir
commits  ▸ ~67 · one per change
script   ▸ scripts/commit-all.ps1 (PowerShell) · scripts/commit-all.sh (Git Bash)
plan     ▸ scripts/commits.txt    message|paths
manifest ▸ scripts/manifest.txt   every file in this version — anything else in src/ is pruned
```

## ▸ Run

```powershell
git checkout ai/neural-noir
# copy the update over the project
powershell -ExecutionPolicy Bypass -File scripts\commit-all.ps1
npm install
npm run build
git push
```

## ▸ Convention

`type(scope): change` — `feat` · `style` · `refactor` · `fix` · `docs` · `chore`
One logical change per commit.
