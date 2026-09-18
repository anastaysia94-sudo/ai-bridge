#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "Missing $ROOT/.env. Copy postiz.env.example to .env and fill it first." >&2
  exit 1
fi

set -a
# shellcheck disable=SC1091
source ./.env
set +a

required=(POSTIZ_HOST MAIN_URL FRONTEND_URL NEXT_PUBLIC_BACKEND_URL JWT_SECRET DATABASE_URL REDIS_URL TEMPORAL_DB_PASSWORD)
for key in "${required[@]}"; do
  if [[ -z "${!key:-}" ]]; then
    echo "Missing required variable: $key" >&2
    exit 1
  fi
done

if [[ "$MAIN_URL" != "https://$POSTIZ_HOST" || "$FRONTEND_URL" != "https://$POSTIZ_HOST" ]]; then
  echo "MAIN_URL and FRONTEND_URL must equal https://$POSTIZ_HOST for this deployment." >&2
  exit 1
fi

if [[ ${#JWT_SECRET} -lt 32 ]]; then
  echo "JWT_SECRET must be a long random value (32+ characters; 64-byte random is recommended)." >&2
  exit 1
fi

chmod 600 .env
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER" || true

docker compose -f docker-compose.azure.yml config >/dev/null
docker compose -f docker-compose.azure.yml pull
docker compose -f docker-compose.azure.yml up -d

echo "Postiz stack started."
echo "Follow startup: docker compose -f docker-compose.azure.yml logs -f --tail=100"
echo "Then verify: ./scripts/verify.sh https://$POSTIZ_HOST"
