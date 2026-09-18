# Shared AI state — SmartPickShop launch + CA income path

- **account:** anastaysia94-sudo
- **active product:** Founder Dynasty OS Four Offer storefront + Cashh Radar live service
- **last assistant:** ChatGPT
- **updated:** 2026-09-18 (Postiz Azure deployment branch)
- **full board:** [PORTFOLIO-STATUS.md](../PORTFOLIO-STATUS.md)
- **tracker:** https://github.com/anastaysia94-sudo/ai-bridge/issues/1

## What is true right now

- founder-os: Four Offer storefront code is still on **main** under `four-offer-launch/`. No open PRs on founder-os.
- Public storefront URL still not found / not deployed as a live public shop. Do not claim a shop URL.
- Cashh Radar production is **live and healthy** (checked 2026-09-18):
  - `/api/health` → status ok, version 2.2.0, **535 opportunities**, **1 user**, organizations 0
  - `/api/health/ready` → status ready (database, schema, production secret, secure cookie, HTTPS, support email all true)
- F.S.A. arcade live: `https://anastaysia94-sudo.github.io/fish-shooter-arcade/`
- F.S.A. open PRs: #36 (emulator smoke for Android v12 — leave open; check status pending / no green emulator checks), #45 (dense graphics certification). Do not merge #36 until emulator checks are green.
- HOSI: draft PRs still open. Human review required. Frozen. Do not merge HOSI drafts.
- HubSpot connector is connected but **CRM is locked** (missing permissions). Owner must reconnect HubSpot.
- Gmail (last 24h at prior Grok check): PayPal August account statement email only. No PayPal purchase receipts. No Railway or Render receipts.

## Azure Postiz social hub — in progress on branch

- Tracker: issue #3, `Azure Postiz hub — Phase 1/2 deploy package`.
- Active branch: `ai/postiz-azure`.
- Current official Postiz image verified: `ghcr.io/gitroomhq/postiz-app:latest`.
- Current Postiz supported floor verified: 2 vCPU / 2 GB RAM / 20 GB disk; required services include PostgreSQL, Redis and Temporal.
- Azure App Service F1 is documented as a smoke/test target only, not the always-on scheduler.
- Azure for Students currently lists $100/12-month credit, 750h each of B1s/B2pts v2/B2ats v2 for 12 months, and PostgreSQL Flexible Server B1MS/32 GB for 750h/month for 12 months for eligible accounts.
- B2pts v2 and B2ats v2 have only 1 GiB RAM, below Postiz's supported floor. Do not call the strict-free VM split supported or production-ready.
- Operational kit defaults to `Standard_B2als_v2` (2 vCPU / 4 GiB), which consumes Student credit rather than the free VM allocation.
- Native requested Postiz providers verified: Facebook, Instagram, LinkedIn, YouTube, TikTok, X, Threads and Telegram.
- WhatsApp is implemented as a separate Meta Cloud API adapter; Snapchat is a user-completed handoff package, not fake headless publishing.
- Current real Postiz public API is `/public/v1/posts` and `/public/v1/integrations`; there is no native `/posts/queue` endpoint. The SmartPick bridge supplies `/api/v1/posts`, `/api/v1/posts/queue`, and `/api/v1/channels` aliases.
- Local bridge tests pass for bearer auth, channel lookup, queue filtering, draft creation, media-from-URL import and Snapchat handoff.
- No Azure resources have been created from ChatGPT: there is no direct Azure connector installed. Provisioning scripts require the owner to execute Azure CLI/Cloud Shell with the owner's subscription and secrets.
- No live secrets are committed.

## Evidence classes (plain English)

- Code exists and tests passed = source + CI.
- A public URL answers = that one app is running.
- No PayPal purchase receipt in Gmail = **no commercial proof yet.**
- Do not claim customers, revenue, or a public storefront URL until `/ready` on the storefront host is 200 and one real test buy exists.
- Do not claim the Postiz Azure hub is deployed until its HTTPS health check and one API draft test succeed against the actual Azure instance.

## Next human steps (in order)

1. For Postiz: merge the reviewed `ai/postiz-azure` PR after CI is green, then execute `azure/postiz/scripts/provision-vm.sh` and `provision-postgres.sh` from Azure Cloud Shell/local Azure CLI with the owner's credentials.
2. For Postiz: populate `.env` only on the VM, start the Compose stack, run `verify.sh`, create the owner, lock registration, then connect native providers.
3. For Postiz: create a Postiz API key, configure `BRIDGE_API_TOKEN`, and verify a **draft** through `/bridge/api/v1/posts` before any live publish.
4. Deploy founder-os `four-offer-launch` (Vercel or other host) and hit `/health` then `/ready`.
5. Put PayPal **sandbox** keys in the host dashboard only (never git, never chat).
6. One sandbox $19 buy: pay → file recorded → ZIP downloads → checksum matches.
7. Then one live $19 buy.
8. Reconnect HubSpot with CRM read/write if deal tracking is wanted.
9. Leave HOSI frozen. Leave fish-shooter-arcade #36 open until emulator checks are green.
