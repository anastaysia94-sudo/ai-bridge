#!/usr/bin/env bash
set -euo pipefail

BASE="${1:-${MAIN_URL:-}}"
if [[ -z "$BASE" ]]; then
  echo "Usage: $0 https://postiz.example.com" >&2
  exit 2
fi
BASE="${BASE%/}"

printf 'Checking HTTPS... '
STATUS="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 "$BASE/")"
if [[ "$STATUS" =~ ^[234] ]]; then
  echo "ok ($STATUS)"
else
  echo "failed ($STATUS)" >&2
  exit 1
fi

printf 'Checking TLS redirect/backend reachability... '
curl -fsS --max-time 20 "$BASE/" >/dev/null
echo "ok"

if command -v docker >/dev/null 2>&1 && [[ -f "$(dirname "$0")/../docker-compose.azure.yml" ]]; then
  ROOT="$(cd "$(dirname "$0")/.." && pwd)"
  echo "Container status:"
  (cd "$ROOT" && docker compose -f docker-compose.azure.yml ps)
fi

cat <<EOF2
Public application is reachable.
Next verification steps:
  1. Create owner account, then set DISABLE_REGISTRATION=true and restart.
  2. Create a Postiz API key in Developer settings.
  3. GET $BASE/public/v1/integrations with Authorization: <api-key>.
  4. Create a DRAFT through the bridge before testing any live post.
EOF2
