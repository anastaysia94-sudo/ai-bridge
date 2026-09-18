# Postiz on Azure for Students — reviewed deployment kit

Reviewed: 2026-09-18

This kit turns the Postiz/Azure blueprint into repeatable deployment files for SmartPickShop's AI publishing hub.

## The architecture decision

Postiz's current supported floor is **2 vCPU, 2 GB RAM, 20 GB disk**. It requires PostgreSQL 14+, Redis 6+, and Temporal; Temporal is required for scheduled posts/background workflows in Postiz v2.12.0+.

Azure App Service F1 is useful only as a smoke-test endpoint: it has 1 GB RAM and an always-free allowance of about one CPU-hour per day. It is not a reliable always-on scheduler.

Use one of these profiles:

| Profile | Purpose | Cost model | Reliability |
|---|---|---|---|
| `F1 smoke` | prove container boot / OAuth URL shape | always-free allowance | **not** for scheduled production posts |
| `Student-credit operational` | actual Postiz + Temporal | consumes Azure for Students credit | recommended path in this kit |
| `Strict-free split experiment` | squeeze components across free VM allocations | free-service quotas only where eligible | unsupported; 1 GB VM SKUs remain below Postiz floor |

Azure for Students currently includes $100 credit for 12 months, 750 hours each of B1s/B2pts v2/B2ats v2 VMs for 12 months, and 750 hours of PostgreSQL Flexible Server B1MS with 32 GB storage/backup for 12 months. The free B2pts/B2ats SKUs have only 1 GiB RAM, so they do not meet Postiz's supported floor.

## Current Postiz image and ports

Use the current official image:

```text
ghcr.io/gitroomhq/postiz-app:latest
```

The bundled container listens on port `5000`. The official compose maps `4007:5000`.

## Recommended operational topology

```text
ChatGPT / Grok / Copilot
          |
          v
  AI Bridge API (Bearer token)
          |
          +----> Postiz Public API /public/v1/*
          |
          +----> WhatsApp Cloud API adapter
          |
          +----> Snapchat handoff package

Internet HTTPS
      |
    Caddy
      |
    Postiz
      |----------------------|
      |          |           |
Azure PG      Redis       Temporal
Flexible      (TLS)       + PG + ES
Server
```

The bridge deliberately exposes stable aliases (`/api/v1/posts`, `/api/v1/posts/queue`, `/api/v1/channels`) while translating to Postiz's **actual current API** (`/public/v1/posts`, `/public/v1/integrations`). There is no native `/posts/queue` endpoint in current Postiz; the bridge derives the queue from `GET /public/v1/posts` and `state == "QUEUE"`.

## 1. Before provisioning

Install/use Azure CLI in Azure Cloud Shell and verify the student subscription:

```bash
az account show --output table
az account list --output table
```

Set the intended subscription if needed:

```bash
az account set --subscription "Azure for Students"
```

Never paste social-provider secrets, database passwords, Postiz API keys, or bridge tokens into GitHub.

## 2. F1 smoke test (optional)

This only creates the public App Service container. It requires externally reachable PostgreSQL, Redis, and Temporal first.

```bash
cd azure/postiz
chmod +x scripts/*.sh

export AZURE_RESOURCE_GROUP=rg-postiz
export AZURE_LOCATION=westus2
export APP_NAME='YOUR-GLOBALLY-UNIQUE-NAME'

# Required secrets / service URLs are read from your shell and are not committed.
export DATABASE_URL='postgresql://...'
export REDIS_URL='rediss://...'
export TEMPORAL_ADDRESS='host:7233'
export JWT_SECRET="$(openssl rand -hex 64)"

./scripts/provision-f1-smoke.sh
```

The script configures `WEBSITES_PORT=5000`, `WEBSITES_ENABLE_APP_SERVICE_STORAGE=true`, and the core Postiz URLs for `https://$APP_NAME.azurewebsites.net`.

**Do not turn this into your production scheduler.** F1's free compute quota is not an always-on worker budget.

## 3. Operational VM profile

The deployment script defaults to `Standard_B2als_v2` (2 vCPU / 4 GiB) because it gives Postiz breathing room beyond the 2 GB floor. It is **not one of the free 1 GiB student VM allocations**, so it consumes your $100 student credit.

Provision infrastructure:

```bash
export AZURE_RESOURCE_GROUP=rg-postiz
export AZURE_LOCATION=westus2
export VM_NAME=postiz-vm
export VM_SIZE=Standard_B2als_v2
export ADMIN_USER=postizadmin

./scripts/provision-vm.sh
```

This creates Ubuntu, installs Docker with cloud-init, opens 80/443, and prints the VM public address. A Standard Azure public IPv4 can be billable, so keep that fact in the cost model. If you later use an outbound Cloudflare Tunnel with a domain you control, you can remove the public IP.

## 4. Database

Azure for Students currently includes PostgreSQL Flexible Server B1MS for 750 hours/month for 12 months, with 32 GB storage and 32 GB backup storage for eligible new accounts.

Create it from the portal or CLI. Minimum requirements:

- PostgreSQL 14+
- database: `postiz`
- TLS required
- firewall permits only the VM/application outbound address(es)

Example connection string:

```text
postgresql://POSTIZ_USER:URL_ENCODED_PASSWORD@SERVER.postgres.database.azure.com:5432/postiz?sslmode=require
```

Passwords containing `@`, `:`, `/`, `?`, `#`, `%`, etc. must be URL-encoded inside a connection URI.

## 5. Redis

Postiz needs Redis 6+. For a no-additional-Azure-cost small deployment, an external free Redis provider can be used. The connection must be a native Redis URL, typically TLS:

```text
REDIS_URL=rediss://default:PASSWORD@HOST:PORT
```

Do not substitute a REST endpoint for `REDIS_URL`.

## 6. Configure the VM

Copy this directory to the VM or clone `anastaysia94-sudo/ai-bridge`, then:

```bash
cd azure/postiz
cp postiz.env.example .env
chmod 600 .env
nano .env
```

Fill the required values. Then:

```bash
./scripts/install-postiz.sh
```

The install script validates required variables and starts `docker-compose.azure.yml`.

### HTTPS host

For provider OAuth and TikTok media, use a stable public HTTPS hostname. Set:

```text
POSTIZ_HOST=postiz.example.com
```

and point that DNS name to the VM. Caddy obtains/renews TLS automatically when DNS resolves publicly to the VM and ports 80/443 are reachable.

A temporary wildcard-DNS hostname can be useful for smoke tests, but some social platforms require domain ownership/verification, so use a domain you control before provider review.

## 7. Register the owner, then lock signup

Start with:

```text
DISABLE_REGISTRATION=false
```

Create the owner account. Then change it to:

```text
DISABLE_REGISTRATION=true
```

and restart:

```bash
docker compose -f docker-compose.azure.yml up -d
```

## 8. Add provider keys

See [CHANNELS.md](./CHANNELS.md). Eight of the requested ten networks are native Postiz providers today:

- Facebook
- Instagram
- LinkedIn
- YouTube
- TikTok
- X
- Threads
- Telegram

WhatsApp and Snapchat are separate adapters, not native Postiz providers.

## 9. Generate the Postiz API key

Inside Postiz, open Developer settings and create an API key. Store it only in the bridge environment as:

```text
POSTIZ_API_KEY=...
```

Current Postiz API authentication sends that key directly in `Authorization`, **not** as `Bearer <key>`.

The AI bridge uses a separate bearer secret (`BRIDGE_API_TOKEN`) so ChatGPT/Grok never need the underlying Postiz API key.

## 10. AI bridge

```bash
cd bridge
cp .env.example .env
chmod 600 .env
nano .env
node server.mjs
```

Required bridge variables:

```text
POSTIZ_BASE_URL=https://postiz.example.com
POSTIZ_API_KEY=...
BRIDGE_API_TOKEN=...
PORT=8787
```

The bridge exposes:

```text
GET  /health
GET  /api/v1/channels
GET  /api/v1/posts/queue?startDate=...&endDate=...
POST /api/v1/posts
```

It maps to current Postiz endpoints:

```text
GET  /public/v1/integrations
GET  /public/v1/posts
POST /public/v1/posts
```

## 11. Custom GPT / Plugin schema

Use [openapi.yaml](./openapi.yaml). Replace `https://YOUR-BRIDGE-HOST` with the bridge HTTPS origin.

For a legacy Custom GPT Action, configure API-key authentication as **Bearer** and enter the **bridge token**, not the Postiz key.

OpenAI's current product guidance (September 2026) says Custom GPTs are being retired in favor of Plugins, with migration rolling out. Keep this schema because it remains a standard OpenAPI contract and can be reused by the replacement integration instead of welding the system to a retiring UI.

## 12. Grok

Use [SYSTEM_PROMPT.md](./SYSTEM_PROMPT.md) as the common agent instructions and [GROK_BRIDGE.md](./GROK_BRIDGE.md) for the zero-cost local handoff.

## 13. Verify

```bash
./scripts/verify.sh https://postiz.example.com
```

Then test the bridge:

```bash
export BRIDGE_URL='https://bridge.example.com'
export BRIDGE_API_TOKEN='...'
node bridge/send.mjs channels
```

Test a draft before any real publish:

```bash
cat draft.json | node bridge/send.mjs post
```

Use `"type": "draft"` for the first integration test.

## 14. Definition of done

Phase 1/2 is technically complete when all of these are true:

- [ ] Postiz health responds through stable HTTPS
- [ ] PostgreSQL data survives a Postiz container restart
- [ ] Redis is reachable over its configured connection string
- [ ] Temporal is healthy and Postiz can schedule a draft/post without worker errors
- [ ] owner account exists and public registration is disabled
- [ ] all intended native providers appear and connect successfully
- [ ] Telegram bot/channel works without a 409 long-poll conflict
- [ ] WhatsApp adapter is tested only against permitted recipients/business flows
- [ ] Snapchat is treated as a user-completed Creative Kit/handoff workflow, not fake headless publishing
- [ ] API key works against `/public/v1/integrations`
- [ ] AI bridge token works against `/api/v1/channels`
- [ ] first end-to-end API test is a **draft**, not a live blast across ten networks

Phase 3/4 assets are included in this same kit so the deployment does not stop halfway through the original project.
