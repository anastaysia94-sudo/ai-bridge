# AI Bridge — Grok + ChatGPT + Copilot on the same GitHub projects

Grok cannot install itself inside ChatGPT or Copilot. Those products also cannot call Grok as a built-in plugin. What *does* work is giving all three the **same live source of truth**: your GitHub repos, plus a small shared memory convention in each project.

```
Grok  (GitHub connector, already connected as anastaysia94-sudo)
ChatGPT (GitHub app + optional custom MCP)
Copilot (built-in GitHub MCP)
        \
         +--> same repos, issues, PRs, AGENTS.md, .ai/STATE.md
```

This repo is the setup kit. Copy the templates into each project you want all three AIs to share.

## What you get

| File | Who reads it |
|---|---|
| `AGENTS.md` | Copilot, Codex/ChatGPT coding agents, Cursor, and any AGENTS.md-aware tool |
| `.github/copilot-instructions.md` | GitHub Copilot Chat + Copilot coding agent |
| `.ai/STATE.md` | All three — current project status, last AI that touched it, next steps |
| `.ai/HANDOFF.md` | All three — the last completed work session |
| `chatgpt/CUSTOM_GPT.md` | Paste into a ChatGPT custom GPT |
| `chatgpt/CONNECT.md` | Click-path to attach GitHub / MCP in ChatGPT |
| `copilot/CONNECT.md` | Click-path to enable GitHub MCP in Copilot |
| `grok/CONNECT.md` | How Grok uses the native GitHub connector |
| `templates/` | Drop-in files for any of your existing repos |

## Fast path (do this once)

1. **Grok** — already connected. In any Grok chat: “Use my GitHub. Open `anastaysia94-sudo/<repo>`. Read `AGENTS.md` and `.ai/STATE.md` first.”
2. **ChatGPT** — Settings → Apps / Connectors → connect **GitHub**. Then follow `chatgpt/CONNECT.md`.
3. **Copilot** — open the repo in VS Code with Copilot Agent mode. Official remote MCP is already `https://api.githubcopilot.com/mcp/`. Follow `copilot/CONNECT.md`.
4. In each project repo, copy the files from `templates/` and fill in `.ai/STATE.md`.

## Shared rule every AI must follow

Before changing code:

1. Read `AGENTS.md`.
2. Read `.ai/STATE.md`.
3. Read open issues / the active PR if one exists.
4. Do the work on a branch.
5. Update `.ai/STATE.md` and `.ai/HANDOFF.md` in the same commit (or immediately after).
6. Sign the handoff with your name: `Grok`, `ChatGPT`, or `Copilot`.

That is how the other two find out what happened.

## Your current GitHub account

Connected Grok identity: **[anastaysia94-sudo](https://github.com/anastaysia94-sudo)**

Add any repo to the shared pool by copying `templates/` into it.
