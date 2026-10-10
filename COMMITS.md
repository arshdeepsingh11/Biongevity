# ◐ Commits

```
branch   ▸ ai/neural-noir
base     ▸ main
commits  ▸ 78 · one per change
script   ▸ scripts/commit-all.ps1  (PowerShell)  ·  scripts/commit-all.sh  (Git Bash)
plan     ▸ scripts/commits.txt     (add|message|paths · rm|message|paths)
```

## ▸ Run

```powershell
git checkout -b ai/neural-noir
# copy the update files over the project (see README)
powershell -ExecutionPolicy Bypass -File scripts\commit-all.ps1
git push -u origin ai/neural-noir
```

## ▸ Convention

`type(scope): change` — `feat` · `style` · `refactor` · `fix` · `docs` · `chore`
One logical change per commit.
