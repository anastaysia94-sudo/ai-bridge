# ChatGPT connection — legacy Custom GPT Action and plugin-ready API

Reviewed against current OpenAI guidance on 2026-09-18.

## Important product change

OpenAI currently documents that Custom GPTs are being retired in favor of Plugins, with migration rolling out in September 2026 and retirement timelines varying by account/workspace. The API built here is intentionally plain OpenAPI so it can serve both the existing Actions workflow and the replacement plugin workflow.

## Legacy Custom GPT Action setup

1. Deploy Postiz and the bridge so this responds over HTTPS:

   ```text
   https://YOUR-POSTIZ-HOST/bridge/health
   ```

2. Generate a bridge token locally/server-side:

   ```bash
   openssl rand -hex 32
   ```

3. Put that value in the server's `.env` as:

   ```text
   BRIDGE_API_TOKEN=...
   ```

4. In the GPT editor, go to **Actions** and choose **Create new action**.

5. Under authentication choose **API key**, then **Bearer**.

6. Enter the **bridge token**. Do not enter the Postiz API key.

7. Open `openapi.yaml`, replace:

   ```text
   https://YOUR-POSTIZ-HOST/bridge
   ```

   with your real HTTPS origin, then paste/import the schema.

8. The editor should detect operations including:

   - `listConnectedChannels`
   - `getUpcomingQueue`
   - `createOrSchedulePost`
   - `sendWhatsApMessage`
   - `createSnapchatHandoff`

9. In Preview, test read-only first:

   ``text
   List my connected publishing channels. Do not create or modify posts.
   ```

10. Test a write as a **draft**, not a live post:

   ```text
   Create a draft for my connected Threads account saying "API bridge draft test". Do not publish it.
   ```

11. Confirm the draft in Postiz before enabling live scheduling/publishing behavior.

## Authentication design

There are intentionally two different credentials:

```text
ChatGPT/Grok
   Authorization: Bearer <BRIDGE_API_TOKEN>
             |
             v
      SmartPick bridge
   Authorization: <POSTIZ_API_KEY>
             |
             v
       Postiz Public API
```

Current Postiz Public API examples use the API key directly in the `Authorization` header. The bridge hides that detail and exposes conventional bearer authentication to AI clients.

## Why not point ChatGPT straight at Postiz?

You could write an OpenAPI file that calls `/public/v1/*` directly, but then the AI client would hold the Postiz API key and your requested `/api/v1/channels` / `/posts/queue` contract would not exist. The bridge keeps the real key server-side, supplies the missing queue alias, and gives us a clean place for WhatsApp/Snapchat adapters.

## Plugin migration

Keep the same HTTPS API and OpenAPI schema. When the Plugin migration/control is available to this account, use this bridge as the plugin's external tool/API rather than rebuilding the publishing logic. The server contract is the durable part; the ChatGPT configuration screen is the disposable part, as software tradition demands.
