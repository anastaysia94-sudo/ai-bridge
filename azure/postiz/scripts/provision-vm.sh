#!/usr/bin/env bash
set -euo pipefail

: "${AZURE_RESOURCE_GROUP:=rg-postiz}"
: "${AZURE_LOCATION:=westus2}"
: "${VM_NAME:=postiz-vm}"
: "${VM_SIZE:=Standard_B2als_v2}"
: "${ADMIN_USER:=postizadmin}"
: "${IMAGE:=Ubuntu2404}"

command -v az >/dev/null || { echo "Azure CLI (az) is required" >&2; exit 1; }
az account show >/dev/null

az group create \
  --name "$AZURE_RESOURCE_GROUP" \
  --location "$AZURE_LOCATION" \
  --output none

CLOUD_INIT_FILE="$(mktemp)"
trap 'rm -f "$CLOUD_INIT_FILE"' EXIT
cat > "$CLOUD_INIT_FILE" <<'CLOUDINIT'
#cloud-config
package_update: true
packages:
  - ca-certificates
  - curl
  - git
  - jq
runcmd:
  - install -m 0755 -d /etc/apt/keyrings
  - curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  - chmod a+r /etc/apt/keyrings/docker.asc
  - /bin/sh -c '. /etc/os-release && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${VERSION_CODENAME} stable" > /etc/apt/sources.list.d/docker.list'
  - apt-get update
  - apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  - systemctl enable --now docker
CLOUDINIT

az vm create \
  --resource-group "$AZURE_RESOURCE_GROUP" \
  --name "$VM_NAME" \
  --location "$AZURE_LOCATION" \
  --image "$IMAGE" \
  --size "$VM_SIZE" \
  --admin-username "$ADMIN_USER" \
  --generate-ssh-keys \
  --public-ip-sku Standard \
  --custom-data "$CLOUD_INIT_FILE" \
  --output none

az vm open-port --resource-group "$AZURE_RESOURCE_GROUP" --name "$VM_NAME" --port 80 --priority 1001 --output none
az vm open-port --resource-group "$AZURE_RESOURCE_GROUP" --name "$VM_NAME" --port 443 --priority 1002 --output none

PUBLIC_IP="$(az vm show -d --resource-group "$AZURE_RESOURCE_GROUP" --name "$VM_NAME" --query publicIps -o tsv)"

echo "VM created: $VM_NAME ($VM_SIZE)"
echo "Public IP: $PUBLIC_IP"
echo "SSH: ssh ${ADMIN_USER}@${PUBLIC_IP}"
echo "NOTE: Standard Azure public IPv4 can be billable and this VM size consumes Student credit."
echo "After cloud-init finishes, clone ai-bridge and run azure/postiz/scripts/install-postiz.sh on the VM."
