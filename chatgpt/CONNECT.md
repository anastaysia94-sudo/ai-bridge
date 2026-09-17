# Connect ChatGPT to the same GitHub projects

ChatGPT does not speak to Grok directly. Connect ChatGPT to **GitHub**, then tell it to treat this repo as the briefing file.

## 1. Built-in GitHub app (do this first)

1. Open ChatGPT.
2. Go to **Settings → Apps** (sometimes labeled Connectors or Plugins).
3. Find **GitHub** and click **Connect**.
4. Authorize the same account: **anastaysia94-sudo**.
5. Start a new chat and say:

```
Use my GitHub connection.
Repo: anastaysia94-sudo/<project>
Read AGENTS.md and .ai/STATE.md first, then work.
When you finish, update .ai/STATE.md and .ai/HANDOFF.md and sign it ChatGPT.
```

That is enough for most work.

## 2. Custom GPT that always behaves

1. ChatGPT → **Explore GPTs → Create**.
2. Paste the entire contents of `chatgpt/CUSTOM_GPT.md` into Instructions.
3. Under Actions / Knowledge / Connectors, attach **GitHub** if the UI offers it.
4. Conversation starters:

- `Brief me on anastaysia94-sudo/<repo> from AGENTS.md and .ai/STATE.md`
- `Continue the last handoff in anastaysia94-sudo/<repo>`
- `Open a PR for the current task and update the handoff`

## 3. Optional: custom MCP (Developer Mode)

Use this only if you want ChatGPT to call the official GitHub MCP server the same way Copilot does.

1. ChatGPT Settings → Security and login (or Apps & Connectors → Advanced) → enable **Developer Mode**. Requires Plus / Pro / Business / Enterprise. Free cannot add custom MCP.
2. Create a custom connector.
3. Server URL:

```
https://api.githubcopilot.com/mcp/
```

4. Authenticate with GitHub OAuth or a PAT when prompted.

If that URL is rejected by ChatGPT's connector form, stay on the built-in GitHub app from step 1. It is the supported path.

## 4. What ChatGPT should always do

- Read `.ai/STATE.md` before editing.
- Sign `.ai/HANDOFF.md` as `ChatGPT`.
- Never assume Grok or Copilot saw the chat.
