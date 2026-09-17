# AGENTS.md — shared operating rules for Grok, ChatGPT, and Copilot

You are one of three assistants working on the same GitHub account: **anastaysia94-sudo**.
The others are Grok (xAI), ChatGPT (OpenAI), and GitHub Copilot. They do not share chat history. GitHub is the only shared memory.

## Before any work

1. Confirm the target repo (`owner/repo`) and branch.
2. Read this file, then `.ai/STATE.md`, then `.ai/HANDOFF.md` if it exists.
3. List open issues and the latest commits on the default branch.
4. Do not overwrite another assistant's in-progress branch without reading it first.

## While working

- Prefer small, reviewable commits.
- Do not commit secrets, `.env` files, tokens, or private keys.
- Match the repo's existing language, formatter, and folder layout.
- If you open a PR, reference the issue and summarize what the other AIs need to know.

## After any work

Update these two files in the same change set when possible:

- `.ai/STATE.md` — current truth (what works, what is broken, what is next)
- `.ai/HANDOFF.md` — last session only (what you did, files touched, leftover risk)

Sign the handoff:

```
assistant: Grok | ChatGPT | Copilot
repo: owner/repo
branch: name
when: ISO-8601
```

## Coordination

- One active implementation branch per task. Name it `ai/<short-task>`.
- Use GitHub issues as the task queue. Label with `ai` when an assistant owns it.
- If two assistants might collide, stop and write the conflict into `.ai/STATE.md` instead of force-pushing.

## What not to assume

- Do not assume the other assistant saw your chat.
- Do not assume local files exist. Read GitHub.
- Do not invent repo conventions that are not in this file or the project README.
