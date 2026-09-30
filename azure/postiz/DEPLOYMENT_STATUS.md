# SmartPickShop Postiz Recovery — Live Execution Status

Updated: 2026-09-30

## Objective

Replace Metricool with self-hosted open-source Postiz and recover every missed SmartPickShop Holdings Traffic Strategy publication for **“What Could You Offer Online Today?”**

## Completed

- Postiz remains the selected open-source publishing layer.
- Existing Postiz + Temporal + PostgreSQL + Redis + Caddy + AI bridge deployment kit is present under `azure/postiz/`.
- The normal recurring automation has been converted to **Postiz Traffic Publishing** and is intentionally disabled until one end-to-end live post succeeds.
- Five zero-publication runs have been converted into a concrete **50-post make-good queue**:
  - 5 recovery runs
  - 10 posts per run
  - 5 Instagram + 5 Threads per run
  - unique copy and unique UTM content values
  - campaign destination: `https://anastaysia94-sudo.github.io/fish-shooter-arcade/traffic-strategy-v2/`
- Recovery queue: `make-good-queue-2026-09-30.json`
- Recovery publisher: `publish-make-good.mjs`
- Publisher refuses to run live unless it verifies the expected owned account identities:
  - Instagram: `anastaysiag`
  - Threads: `smart.pick.shop`
- Instagram recovery posts import their media through the Postiz bridge before publishing.
- Current Postiz validation workflow passes after both recovery files were added.

## Hosting checks performed

### Railway
A new Postiz project could not be provisioned because the current Railway Free account hit its resource-provisioning limit. Railway Free also exposes only 0.5 GB RAM per service, below Postiz's supported floor, so Railway Free is not a viable production recovery host.

### Azure
Two read-only GitHub Actions preflights were executed.

1. Service-principal JSON path:
   - `AZURE_CREDENTIALS` is not configured.

2. OIDC path:
   - `AZURE_CLIENT_ID` is not configured.
   - `AZURE_TENANT_ID` is not configured.
   - `AZURE_SUBSCRIPTION_ID` is not configured.

No Azure resources were created or modified by either preflight.

## Remaining external gates

1. A host with sufficient resources must be authorized. The prepared Docker Compose stack can run on an Ubuntu VM/Droplet.
2. The social provider OAuth/developer credentials must be authorized for the self-hosted Postiz instance.
3. After the correct Instagram and Threads channels are visible in Postiz, run:
   - dry identity verification first
   - one live controlled post
   - then the five 10-post make-good batches
4. Re-enable the recurring Postiz automation only after publication IDs/URLs are verified.

## Recovery command

From `azure/postiz/`, with `BRIDGE_URL` and `BRIDGE_API_TOKEN` set:

```bash
node publish-make-good.mjs --run 1
```

That is a dry identity check. Once the output confirms the intended channels:

```bash
node publish-make-good.mjs --run 1 --execute
```

Repeat for runs 2 through 5 after each prior batch verifies successfully.
