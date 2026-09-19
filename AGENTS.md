# AGENTS.md — shared operating rules for Grok, ChatGPT, and Copilot

You are one of three assistants working on the same GitHub account: **anastaysia94-sudo**.
The others are Grok (xAI), ChatGPT (OpenAI), and GitHub Copilot. They do not share chat history. GitHub is the only shared memory.

## Portfolio continuity gate — mandatory

Before changing any SmartPickShop Holdings project, product, subproject, visual system, hosting plan, or idea:

1. Read **`PORTFOLIO-MASTER-LEDGER.md`**.
2. Read **`DOMAIN-STRATEGY.md`** when domains, hosting, branding, URLs, DNS, WordPress, or deployment are involved.
3. Search the ledger for the target project's canonical name **and aliases/predecessors**.
4. Preserve all hard constraints and "do not repeat" notes.
5. A project mentioned once is still history. Do not erase it merely because it has no current repo.
6. Do not infer ownership of a domain from old chat text. In particular, **`smartpickshop.dev` is not owned; it was an idea only.**
7. **Founder Dynasty OS must preserve the WordPress-hosted customer-facing requirement.**
8. For PTEDBoss/PartyTeller and approved graphics, preserve exact prior design/source assets. Do not substitute generic regenerations for requested edits.
9. Distinguish PLANNED, SCAFFOLD, IMPLEMENTED, TESTED, DEPLOYED, VERIFIED, and COMMERCIAL-PROOF.
10. If current repository evidence conflicts with old implementation claims, repository evidence controls implementation status while the older requirement remains in project history.

## Before any work

1. Confirm the target repo (`owner/repo`) and branch.
2. Read this file, then `PORTFOLIO-MASTER-LEDGER.md`, then the target repo's README/`.ai/STATE.md`/`.ai/HANDOFF.md` as applicable.
3. List open issues and the latest commits on the default branch.
4. Do not overwrite another assistant's in-progress branch without reading it first.

## While working

- Prefer small, reviewable commits.
- Do not commit secrets, `.env` files, tokens, or private keys.
- Match the repo's existing language, formatter, and folder layout.
- If you open a PR, reference the issue and summarize what the other AIs need to know.
- Update the master ledger when a new project/idea is introduced or a hard project constraint changes.
- Never replace an approved existing graphic with a newly generated approximation unless the user explicitly asks for a redesign.

## After any work

Update these two files in the same change set when possible:

- `.ai/STATE.md` — current truth (what works, what is broken, what is next)
- `.ai/HANDOFF.md` — last session only (what you did, files touched, leftover risk)

When the work changes portfolio identity, constraints, domains, aliases, or infrastructure decisions, also update:
- `PORTFOLIO-MASTER-LEDGER.md`
- `DOMAIN-STRATEGY.md` when domain facts changed

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
- Do not assume a historical domain suggestion is owned.
- Do not assume a generated image/file from an old chat still physically exists.
