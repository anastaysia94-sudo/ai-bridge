# Connect GitHub Copilot to the same projects

Copilot already lives on GitHub. You mainly need Agent mode plus the official GitHub MCP server so it can read issues, PRs, and files the same way Grok does.

## VS Code / Copilot Chat

1. Open the project repo in VS Code.
2. Sign into Copilot with the same GitHub user: **anastaysia94-sudo**.
3. Switch Copilot Chat to **Agent** mode.
4. Confirm GitHub MCP is enabled. Official remote server:

```json
{
  "servers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

Put that in `.vscode/mcp.json` in the project, or in your user MCP settings.

5. First prompt:

```
Read AGENTS.md and .ai/STATE.md. Then continue the current task.
When you finish, update .ai/STATE.md and .ai/HANDOFF.md and sign it Copilot.
```

## Copilot CLI

GitHub MCP is built into Copilot CLI. No extra server is required for GitHub context.

Optional user config `~/.copilot/mcp-config.json` if you add other servers later. Do not replace the built-in GitHub server unless you have a reason.

## Copilot coding agent on github.com

If you assign an issue to Copilot on the website, it will also read:

- `AGENTS.md`
- `.github/copilot-instructions.md`

Keep those two files in every shared project.

## What Copilot should always do

- Treat `.ai/STATE.md` as the briefing from Grok and ChatGPT.
- Sign handoffs as `Copilot`.
- Use issues/PRs instead of only local unsynced edits when the other AIs need to see the work.
