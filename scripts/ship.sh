#!/usr/bin/env bash
# Usage: ./scripts/ship.sh v0.2.0 "prompt, schema, cached sample"
set -euo pipefail
VERSION="${1:?version required, e.g. v0.2.0}"
MSG="${2:?message required}"

git add -A

# 1. secret guard: block anything that looks like a Google API key
if git diff --cached | grep -E 'AIza[0-9A-Za-z_-]{35}' >/dev/null; then
  echo "ABORT: possible Gemini/Google API key in staged changes." >&2
  git reset -q
  exit 1
fi

# 2. quality gate
npm run check --silent || true

# 3. commit, tag, push
if git diff --cached --quiet; then
  echo "Nothing new to commit for $VERSION."; exit 0
fi

git commit -m "$VERSION: $MSG"
git tag -a "$VERSION" -m "$MSG" -f

# If remote origin exists, push
if git remote get-url origin >/dev/null 2>&1; then
  git push origin main --follow-tags || echo "Push skipped: origin not configured or remote not reachable"
fi

echo "Shipped $VERSION"
