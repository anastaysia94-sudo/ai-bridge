# Connect Grok to the same GitHub projects

Grok already has a native GitHub connector. In this environment it is signed in as **anastaysia94-sudo**.

## Web / app

1. Open [grok.com/connectors](https://grok.com/connectors).
2. Confirm **GitHub** is connected. If it is not, click it and finish OAuth as anastaysia94-sudo.
3. Optional: **New Connector → Custom** only if you later host your own MCP server. You do not need a custom connector for GitHub itself.

## How to start a project session in Grok

```
Use my GitHub connector.
Repo: anastaysia94-sudo/<project>
Read AGENTS.md and .ai/STATE.md first.
Work on the current task, then update .ai/STATE.md and .ai/HANDOFF.md and sign it Grok.
```

## Custom MCP later

Grok custom connectors require a public HTTPS MCP URL. Local stdio servers need a tunnel. The official GitHub MCP URL used by Copilot is:

```
https://api.githubcopilot.com/mcp/
```

You normally should **not** add that as a second GitHub connector in Grok. Use Grok's native GitHub connector instead so you do not double-auth and double-tool.

## Skill

This account also has a Grok skill named `ai-bridge` that tells Grok to follow the shared STATE/HANDOFF protocol automatically.
