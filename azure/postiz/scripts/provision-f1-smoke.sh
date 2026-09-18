#!/usr/bin/env bash
set -euo pipefail

: "${AZURE_RESOURCE_GROUP:=rg-postiz}"
: "${AZURE_LOCATION:=westus2}"
: "${APP_SERVICE_PLAN:=asp-postiz-free}"
: "${APP_NAME:?Set APP_NAME to a globally unique Azure Web App name}"
: "${DATABASE_URL:?Set DATABASE_URL}"
: "${REDIS_URL:?Set REDIS_URL}"
: "${TEMPORAL_ADDRESS:?Set TEMPORAL_ADDRESS}"
: "${JWT_SECRET:?Set JWT_SECRET}"

IMAGE="ghcr.io/gitroomhq/postiz-app:latest"
BASE="https://${APP_NAME}.azurewebsites.net"

command -v az >/dev/null || { echo "Azure CLI (az) is required" >&2; exit 1; }
az account show >/dev/null

az group create \
  --name "$AZURE_RESOURCE_GROUP" \
  --location "$AZURE_LOCATION" \
  --output none

az appservice plan create \
  --name "$APP_SERVICE_PLAN" \
  --resource-group "$AZURE_RESOURCE_GROUP" \
  --location "$AZURE_LOCATION" \
  --sku F1 \
  --is-linux \
  --output none

az webapp create \
  --name "$APP_NAME" \
  --plan "$APP_SERVICE_PLAN" \
  --resource-group "$AZURE_RESOURCE_GROUP" \
  --container-image-name "$IMAGE" \
  --output none

# Never echo values. Azure app settings encrypt values at rest, but this script still
# expects the secrets to originate from the caller's protected shell/session.
az webapp config appsettings set \
  --name "$APP_NAME" \
  --resource-group "$AZURE_RESOURCE_GROUP" \
  --settings \
    WEBSITES_PORT=5000 \
    WEBSITES_ENABLE_APP_SERVICE_STORAGE=true \
    MAIN_URL="$BASE" \
    FRONTEND_URL="$BASE" \
    NEXT_PUBLIC_BACKEND_URL="$BASE/api" \
    BACKEND_INTERNAL_URL=http://localhost:3000 \
    DATABASE_URL="$DATABASE_URL" \
    REDIS_URL="$REDIS_URL" \
    JWT_SECRET="$JWT_SECRET" \
    TEMPORAL_ADDRESS="$TEMPORAL_ADDRESS" \
    TEMPORAL_NAMESPACE=default \
    IS_GENERAL=true \
    RUN_CRON=true \
    DISABLE_REGISTRATION=false \
  --output none

az webapp restart --name "$APP_NAME" --resource-group "$AZURE_RESOURCE_GROUP" --output none

echo "F1 smoke endpoint created: $BASE"
echo "WARNING: F1 is not a reliable always-on Postiz scheduler. Use this for boot/OAuth smoke testing only."
