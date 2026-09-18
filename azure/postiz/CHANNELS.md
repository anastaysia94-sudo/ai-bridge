# Ten-channel connection matrix

Base URL in examples:

```text
https://postiz.example.com
```

Current native Postiz support for this project's requested networks: **8/10**.

| Network | Native Postiz | Connection / callback | Required self-host env |
|---|---:|---|---|
| Facebook | yes | `/integrations/social/facebook` | `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET` |
| Instagram via FB Business | yes | `/integrations/social/instagram` | Facebook vars |
| Instagram standalone | yes | `/integrations/social/instagram-standalone` | `INSTAGRAM_APP_ID`, `INSTAGRAM_APP_SECRET` |
| LinkedIn | yes | `/integrations/social/linkedin` | `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET` |
| LinkedIn Page | yes | `/integrations/social/linkedin-page` | LinkedIn vars |
| YouTube | yes | `/integrations/social/youtube` | `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET` |
| TikTok | yes | `/integrations/social/tiktok` | `TIKTOK_CLIENT_ID`, `TIKTOK_CLIENT_SECRET` |
| X | yes | `/integrations/social/x` | `X_API_KEY`, `X_API_SECRET` |
| Threads | yes | `/integrations/social/threads` | `THREADS_APP_ID`, `THREADS_APP_SECRET` |
| Telegram | yes | bot setup; no OAuth callback | `TELEGRAM_BOT_NAME`, `TELEGRAM_TOKEN` |
| WhatsApp | no | bridge uses Meta Cloud API | bridge-only vars |
| Snapchat | no | user-completed Creative Kit/share handoff | none in Postiz |

## Current Postiz text limits used by the agent

These are Postiz's current composer limits, not promises that every account/API entitlement has the same limit forever:

- X: 280 normally; longer limits depend on account/mode
- LinkedIn: 3,000
- Instagram: 2,200
- Facebook Page: 63,206
- Threads: 500
- YouTube: 5,000
- TikTok: 2,000
- Telegram: 4,096

The system prompt tells the agent to stay inside the conservative/default limit unless the connected account's capabilities are known.

## Facebook

Callback:

```text
https://postiz.example.com/integrations/social/facebook
```

Environment:

```text
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
```

A private app used only by its own admins/testers is simpler. A public multi-user integration can require Meta review/business verification and advanced permissions.

## Instagram

Facebook Business route:

```text
https://postiz.example.com/integrations/social/instagram
```

Standalone professional-account route:

```text
https://postiz.example.com/integrations/social/instagram-standalone
```

Instagram requires media for ordinary Instagram posting in Postiz. Reels/stories have their own media rules.

## LinkedIn

Personal profile:

```text
https://postiz.example.com/integrations/social/linkedin
```

Page:

```text
https://postiz.example.com/integrations/social/linkedin-page
```

## YouTube

Callback:

```text
https://postiz.example.com/integrations/social/youtube
```

Enable the Google APIs required by the current Postiz provider instructions (YouTube Data API v3, Analytics API, Reporting API). YouTube publishing requires exactly one video attachment in Postiz.

## TikTok

Callback:

```text
https://postiz.example.com/integrations/social/tiktok
```

TikTok requires a public HTTPS deployment and publicly reachable media. The current Postiz docs distinguish Direct Post from Upload; unaudited Direct Post clients can be restricted by TikTok, so do not assume public auto-publishing is available until the developer app is approved for the needed capability.

## X

Callback:

```text
https://postiz.example.com/integrations/social/x
```

Current Postiz self-host instructions use OAuth 1.0a for X because media upload still depends on the older API path. Set read/write permissions in the X developer app.

## Threads

Callback:

```text
https://postiz.example.com/integrations/social/threads
```

If `THREADS_APP_ID` / `THREADS_APP_SECRET` are absent at boot, Postiz may hide Threads from the Add Channel dialog.

## Telegram

There is no OAuth callback. Create a bot and set:

```text
TELEGRAM_BOT_NAME=YourBot_bot
TELEGRAM_TOKEN=...
```

Postiz currently uses Telegram `getUpdates` long polling. Only one process should consume a bot token at a time; duplicate consumers can cause Telegram 409 conflicts.

## WhatsApp adapter

WhatsApp is not a current native Postiz provider. The included bridge exposes:

```text
POST /api/v1/whatsapp/send
GET  /bridge/webhooks/whatsapp
POST /bridge/webhooks/whatsapp
```

Bridge environment:

```text
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_ACCESS_TOKEN=...
WHATSAPP_VERIFY_TOKEN=...
WHATSAPP_APP_SECRET=...
WHATSAPP_GRAPH_VERSION=vXX.X
```

Public webhook URL: `https://YOUR-POSTIZ-HOST/bridge/webhooks/whatsapp`.

`POST /api/v1/whatsapp/send` accepts a Meta Cloud API message object and sends it to the configured phone-number endpoint. The webhook verifies Meta's challenge and, when `WHATSAPP_APP_SECRET` is configured, validates `X-Hub-Signature-256` before accepting events.

This is business messaging, not evidence of a generic server-side WhatsApp Channels publishing API. Meta messaging charges/rules can apply, so WhatsApp cannot be promised as unlimited `$0 forever`.

## Snapchat adapter

Snapchat is not a native Postiz provider and the public Creative Kit model is a share/handoff flow, not a generic headless server publisher.

The bridge therefore exposes:

```text
POST /api/v1/snapchat/package
```

It returns a normalized package such as:

```json
{
  "platform": "snapchat",
  "caption": "...",
  "mediaUrl": "https://...",
  "scheduledFor": "2026-09-25T22:00:00.000Z",
  "status": "requires-user-share"
}
```

A mobile/browser client can pass that package into Creative Kit. It intentionally does **not** pretend to publish a Story silently from a server.
