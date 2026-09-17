# Shared AI state — SmartPickShop launch + CA income path

- **account:** anastaysia94-sudo
- **active product:** Founder Dynasty OS Four Offer storefront + Cashh Radar live service
- **last assistant:** Grok
- **updated:** 2026-09-17T06:00:00Z (Grok full audit)
- **full board:** [PORTFOLIO-STATUS.md](../PORTFOLIO-STATUS.md)
- **tracker:** https://github.com/anastaysia94-sudo/ai-bridge/issues/1

## What is true right now

- 16 repos. 5 are live and clickable. 3 are empty shells.
- founder-os: Four Offer storefront code is still on **main** under `four-offer-launch/`. No open PRs on founder-os.
- Public storefront URL still not found / not deployed as a live public shop. Do not claim a shop URL.
- Vercel emailed that `four-offer-launch` is available to import (16 Sep).
- Cashh Radar production is **live and healthy**:
  - `/api/health` → status ok, version 2.2.0, **535 opportunities**, **1 user**, organizations 0
  - `/api/health/ready` → status ready (database, schema, production secret, secure cookie, HTTPS, support email all true)
- Dumpster Atlas live: `https://nqcshihyfhthywpseilx.supabase.co/functions/v1/dumpster-atlas` (5 verified spots; issue #1 asks for 25).
- Snarky How-To live: `https://nqcshihyfhthywpseilx.supabase.co/functions/v1/snarky-how-to` (Episode 002 is the open ticket).
- F.S.A. arcade live: `https://anastaysia94-sudo.github.io/fish-shooter-arcade/`
- F.S.A. open PRs: #36 (emulator smoke for Android v12 — leave open, do not merge until green), #45 (dense graphics). #53 is closed.
- HOSI: 6 draft PRs (#6–#11) + open issues. Human review required. Frozen this week. Do not merge HOSI drafts.
- EGM4000 public deploy still blocked on Render billing (402).
- HubSpot connector is connected but **CRM is locked** (missing permissions). Owner must reconnect HubSpot.
- Gmail (last 7 days): Vercel import-ready mail for four-offer-launch; no PayPal purchase receipts; no Railway/Render sales receipts. Northern Frights replied they are **not** hiring (do not re-pitch).

## California job-path facts

- Owner lives in San Jose, CA and does not have a CA ID.
- LiveOps, Arise, Omni, many ModSquad gigs, and Rev.com transcription **do not hire CA residents** as 1099 contractors because of AB5.
- Realistic path: free HubSpot/Trailhead/Zendesk badges, then **W-2 remote** apps (CVS, TTEC, Concentrix, Amazon CS, Alorica) plus AI-task platforms (Appen, TELUS Digital, Outlier).
- A US passport or out-of-state license + Social Security card is enough for I-9.

## Evidence classes (plain English)

- Code exists and tests passed = source + CI.
- A public URL answers = that one app is running.
- No PayPal purchase receipt in Gmail = **no commercial proof yet.**
- Do not claim customers, revenue, or a public storefront URL until `/ready` on the storefront host is 200 and one real test buy exists.

## Next human steps (in order)

1. Deploy founder-os `four-offer-launch` (Vercel or other host) and hit `/health` then `/ready`.
2. Put PayPal **sandbox** keys in the host dashboard only (never git, never chat).
3. One sandbox $19 buy: pay → file recorded → ZIP downloads → checksum matches.
4. Then one live $19 buy.
5. Only then share links.
6. Reconnect HubSpot with CRM read/write if deal tracking is wanted.
7. Tonight: HubSpot Academy customer-support course. Tomorrow: W-2 remote CS jobs.
8. Leave HOSI and Anarchy frozen this week.
9. Optional product work after shop: Dumpster Atlas 25 locations, Snarky Episode 002, F.S.A. PR #45 review (not #36 until emulator green).
