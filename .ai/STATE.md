# Shared AI state — SmartPickShop launch + CA income path

- **account:** anastaysia94-sudo
- **active product:** Founder Dynasty OS Four Offer storefront + Cashh Radar live service
- **last assistant:** Grok
- **updated:** 2026-09-17

## What is true right now

- founder-os PR #3 (Four Offer storefront) is **merged** into `main`. CI was green (storefront-smoke + PHP lint).
- founder-os has **no open PRs**.
- **Public storefront URL still not found.** Do not claim the shop is live for customers.
- Cashh Radar production is **live** on Railway: `https://cashh-radar-web-production.up.railway.app/`
  - Rechecked 2026-09-17: `/api/health` = ok, app Cashh Radar 2.2.0, 535 opportunities, 1 user, last alerts job ok
- fish-shooter-arcade PR #36 (Android emulator smoke) is **still open**. Do not merge until emulator CI is green.
- HOSI draft PRs stay draft. Human review required.
- EGM4000 public deploy still blocked on Render billing.
- HubSpot connector is connected but **missing CRM permissions** (needs reconnect). HubSpot *Academy* certificates are a separate free website and do not use this connector.
- Gmail works (`anastaysia487@gmail.com`). Recent mail: Upwork voice-actor interview invite (Sep 16), freelance graphic designer outreach to Healthbuk (Sep 17), HubSpot connect notice, UoPeople admissions reminders. No PayPal purchase receipts. No CVS/TTEC/Concentrix application replies found.

## California job-path facts (Grok research, this thread)

- Owner lives in San Jose, CA and does not have a CA ID.
- LiveOps, Arise, Omni, many ModSquad gigs, and Rev.com transcription **do not hire CA residents** as 1099 contractors because of AB5.
- Realistic path: free HubSpot/Trailhead/Zendesk badges tonight, then **W-2 remote** apps (CVS, TTEC, Concentrix, Amazon CS, Alorica) plus AI-task platforms (Appen, TELUS Digital, Outlier).
- A US passport or out-of-state license + Social Security card is enough for I-9. CA ID is helpful later, not required to apply.

## Evidence classes (plain English)

- Code exists and tests passed = source + CI.
- Cashh Radar answers health checks = that one app is running.
- No PayPal purchase receipt in Gmail = **no commercial proof yet**.
- Do not claim customers, revenue, or a public storefront URL until `/ready` on the storefront host is 200 and one real test buy exists.

## Next human steps (in order)

1. Deploy founder-os storefront from `main` and hit `/health` then `/ready`.
2. Put PayPal **sandbox** keys in the host dashboard only (never git, never chat).
3. One sandbox $19 buy: pay → file recorded → ZIP downloads → checksum matches.
4. Then one live $19 buy.
5. Only then share links.
6. Reconnect HubSpot with CRM read/write if deal tracking is wanted.
7. Tonight: HubSpot Academy customer-support course. Tomorrow: apply W-2 remote CS jobs listed in Grok chat.
8. Leave HOSI and Anarchy frozen this week.
