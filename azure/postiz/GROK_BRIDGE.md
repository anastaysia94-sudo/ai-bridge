# Grok -> Postiz bridge at $0 software cost

Grok's consumer UI should not be assumed to have permission to call an arbitrary private REST API directly. The dependable zero-software-cost bridge is a tiny local sender that accepts the JSON Grok produces and posts it to the same AI bridge used by ChatGPT.

## Desktop / Linux / macOS / Termux

Set two environment variables locally:

```bash
export BRIDGE_URL='https://postiz.example.com/bridge'
export BRIDGE_API_TOKEN='YOUR_BRIDGE_TOKEN'
```

Never paste the token into Grok, a GitHub issue, or a repository file.

Ask Grok to follow `SYSTEM_PROMPT.md` and output only the final Postiz JSON payload for a requested post. Save/copy that payload locally, then:

```bash
cat payload.json | node bridge/send.mjs post
```

Inspect channels:

```bash
node bridge/send.mjs channels
```

Inspect the next 30 days of queue:

```bash
node bridge/send.mjs queue
```

Send a permitted WhatsApp message payload:

```bash
cat whatsapp.json | node bridge/send.mjs whatsapp
```

Create a Snapchat handoff package:

```bash
cat snapchat.json | node bridge/send.mjs snapchat
```

## Why this is preferable to browser automation

- no Grok account cookie scraping;
- no storing Postiz keys in browser JavaScript;
- no reverse-engineered Snapchat/WhatsApp login automation;
- one revocable bridge token;
- the Postiz API key stays on the server;
- works from Termux on Android as well as a normal computer.

## Optional GitHub-mediated automation

Because Grok, ChatGPT, and Copilot already share `anastaysia94-sudo/ai-bridge`, GitHub can remain the source of instructions and code. Do **not** make every commit auto-publish social posts. If a GitHub Actions dispatch is added later, put `BRIDGE_API_TOKEN` in GitHub Actions Secrets and require an explicit manual dispatch or protected environment approval. Code commits should never equal publishing consent by accident.
