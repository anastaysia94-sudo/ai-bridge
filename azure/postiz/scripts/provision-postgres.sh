#!/usr/bin/env bash
set -euo pipefail

: "${AZURE_RESOURCE_GROUP:=rg-postiz}"
: "${AZURE_LOCATION:=westus2}"
: "${PG_SERVER_NAME:?Set PG_SERVER_NAME to a globally unique PostgreSQL server name}"
: "${PG_ADMIN_USER:=postizadmin}"
: "${PG_ADMIN_PASSWORD:?Set PG_ADMIN_PASSWORD in your protected shell}"
: "${PG_DATABASE:=postiz}"
: "${VM_NAME:=postiz-vm}"

command -v az >/dev/null || { echo "Azure CLI (az) is required" >&2; exit 1; }
az account show >/dev/null

VM_IP="$(az vm show -d \
  --resource-group "$AZURE_RESOURCE_GROUP" \
  --name "$VM_NAME" \
  --query publicIps -o tsv)"

if [[ -z "$VM_IP" ]]; then
  echo "Could not resolve public IP for VM $VM_NAME." >&2
  exit 1
fi

az postgres flexible-server create \
  --resource-group "$AZURE_RESOURCE_GROUP" \
  --name "$PG_SERVER_NAME" \
  --location "$AZURE_LOCATION" \
  --admin-user "$PG_ADMIN_USER" \
  --admin-password "$PG_ADMIN_PASSWORD" \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 17 \
  --public-access None \
  --database-name "$PG_DATABASE" \
  --output none

az postgres flexible-server firewall-rule create \
  --resource-group "$AZURE_RESOURCE_GROUP" \
  --server-name "$PG_SERVER_NAME" \
  --name allow-postiz-vm \
  --start-ip-address "$VM_IP" \
  --end-ip-address "$VM_IP" \
  --output none

HOST="${PG_SERVER_NAME}.postgres.database.azure.com"
echo "PostgreSQL created."
echo "Host: $HOST"
echo "Database: $PG_DATABASE"
echo "User: $PG_ADMIN_USER"
echo "Allowed client IP: $VM_IP"
echo "Set DATABASE_URL using sslmode=require and URL-encode the password. The password is intentionally not printed."
echo "Azure for Students' B1MS/32-GB free amount is eligibility/time-limited; verify Cost Management after creation."
