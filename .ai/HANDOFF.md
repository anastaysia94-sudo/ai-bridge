# Handoff

```
assistant: ChatGPT
repo: anastaysia94-sudo/ai-bridge
branch: ai/postiz-azure
when: 2026-09-18
```

Worked on the Azure for Students + Postiz + ChatGPT/Grok social automation hub.

Done this session:
- Read `AGENTS.md`, prior `.ai/STATE.md`, prior `.ai/HANDOFF.md`, open issues, branches, and latest commits before changing anything.
- Created issue #3 and branch `ai/postiz-azure` from main.
- Revalidated current Microsoft Azure for Students and Postiz documentation instead of relying on the older blueprint.
- Verified current Postiz image, resource floor, Temporal requirement, native provider set, OAuth callback paths, current Public API paths, and current platform character/media limits.
- Built `azure/postiz/` deployment kit with F1 smoke script, supported Student-credit VM path, PostgreSQL provisioning, external Redis configuration, Caddy HTTPS proxy, Postiz + Temporal compose stack, environment template, ten-channel matrix, verification script, and no committed secrets.
- Built an AI compatibility bridge that maps the owner's requested `/api/v1/*` contract to Postiz's actual `/public/v1/*` API, including media import, and keeps the Postiz key server-side.
- Added optional WhatsApp Cloud API send/webhook adapter with webhook signature verification.
- Added Snapchat handoff packaging rather than claiming unsupported headless publishing.
- Added OpenAPI 3.0 schema, current ChatGPT Action/plugin migration notes, shared system prompt, and a local Grok sender usable from desktop or Android Termux.
- Added a mock bridge test; local tests pass for auth, channel lookup, queue filtering, draft creation, media-from-URL import and Snapchat handoff.
- Added GitHub Actions validation for shell syntax, bridge tests, Compose config and YAML parsing.
- Did not create Azure resources because no direct Azure management connector is installed and owner credentials/secrets must not be guessed or committed.
- Did not claim the hub is live.

Next assistant:
- Check CI on the Postiz Azure PR. Repair only evidence-backed failures.
- Once green, merge if there is no conflicting active work.
- Then guide/execute the Azure CLI sequence with the owner through Cloud Shell or ChatGPT Work browser access.
- First API write must be `type=draft`; verify it in Postiz before any live/scheduled distribution.
- Do not put provider secrets, database passwords, Postiz API keys, or bridge tokens in git/chat.
- Preserve the distinction between free-service quotas and Student-credit spending.

— ChatGPT
