# SmartPickShop Holdings — Full Portfolio Status

**Snapshot:** 2026-09-17 (Pacific evening of Sep 16)
**Account:** [anastaysia94-sudo](https://github.com/anastaysia94-sudo)
**Auditor:** Grok
**Repos:** 16 (14 public, 2 private)
**Open issues:** 8 across the account
**Open PRs:** 9 (3 F.S.A. live PRs + 6 HOSI drafts)

This is the honest board. Code on GitHub is not the same as a product people can use, and a live URL is not the same as a paying customer.

## Scoreboard (plain English)

| Bucket | Meaning | Count |
|---|---|---:|
| **Live and usable** | Real public URL, real product, someone can click it today | 5 |
| **Source-complete, not fully launched** | Built and tested; still missing a human, a bill, a host, or a first real user | 5 |
| **Incomplete / mid-build** | Real work exists; big pieces still open | 3 |
| **Noted but not started** | Repo exists, almost no product inside | 3 |

---

## LIVE AND USABLE

### 1. Fish Shooter Arcade — [fish-shooter-arcade](https://github.com/anastaysia94-sudo/fish-shooter-arcade)
**What it is:** A virtual (no real-money) underwater arcade: 15 fish-shooter tables + 20 slot cabinets, player accounts, and a founder/distributor/agent control desk.
**Live:** https://anastaysia94-sudo.github.io/fish-shooter-arcade/
**Finished:** Games, rooms, weapons, cloud accounts, founder console, PWA, CI, telemetry hooks into EGM4000.
**Incomplete:** 3 open PRs — [#36 Android emulator cert](https://github.com/anastaysia94-sudo/fish-shooter-arcade/pull/36), [#45 dense-graphics cert](https://github.com/anastaysia94-sudo/fish-shooter-arcade/pull/45), [#53 founder-admin v5 sync](https://github.com/anastaysia94-sudo/fish-shooter-arcade/pull/53). Physical phone QA, unique art for every title, real shared multiplayer tables.
**Do not:** Merge #36 until emulator checks are green. Do not enable real-money wagering.

### 2. Cashh Radar — [cashh-radar](https://github.com/anastaysia94-sudo/cashh-radar)
**What it is:** A money-opportunity radar + local-business prospecting tool (find work, rank it, email businesses, track replies).
**Live:** https://cashh-radar-web-production.up.railway.app/
**Finished:** Railway production, 500 source-backed prospects, opportunity lifecycle, PWA, launch-status page.
**Incomplete:** V5/V6 research is at 193 of 400 new prospects. Still on one SQLite database (fine for now; do not add extra servers until Postgres).
**Do not:** Call modeled offer value “earnings.” No Reddit prospecting. No silent email send.

### 3. Founder Dynasty OS — [founder-os](https://github.com/anastaysia94-sudo/founder-os)
**What it is:** Private operating system for running one or many businesses: decisions, risks, evidence, sprints, portfolio.
**Live app:** https://founder-dynasty-os-web-production.up.railway.app (sign-in required)
**Finished:** 19 protected database tables, multi-business switching, CI, backend isolation tests.
**Incomplete:** You have not yet done the real human walkthrough (create Business A + B, switch, sign out, restore). Four Offer shop code is merged; **no public shop URL exists yet.** Vercel emailed that `four-offer-launch` is ready to import. No PayPal purchase receipts in Gmail.
**Next:** Deploy the shop, then one sandbox $19 buy, then one live $19 buy. Do not share shop links before `/ready` is green.

### 4. Dumpster Atlas — [dumpsteratlas](https://github.com/anastaysia94-sudo/dumpsteratlas)
**What it is:** A legal San Jose / Santa Clara map of recycling, CRV, food help, and reuse spots. Verified spots vs community OpenStreetMap spots are labeled separately.
**Live:** https://nqcshihyfhthywpseilx.supabase.co/functions/v1/dumpster-atlas
**Finished:** Map, filters, radius, 5 verified seeds, privacy-light analytics.
**Next ticket:** [Issue #1 — expand verified registry to 25 locations](https://github.com/anastaysia94-sudo/dumpsteratlas/issues/1)

### 5. Snarky How-To — [snarkyhowtos](https://github.com/anastaysia94-sudo/snarkyhowtos)
**What it is:** Practical how-to pages + YouTube pipeline with dry humor aimed at bad process, not the reader.
**Live:** https://nqcshihyfhthywpseilx.supabase.co/functions/v1/snarky-how-to
**Finished:** Episode 001 guide, analytics, YouTube redirect, video-factory source.
**Next ticket:** [Issue #1 — Episode 002 remote-job-scam detector video + Short](https://github.com/anastaysia94-sudo/snarkyhowtos/issues/1)

---

## SOURCE-COMPLETE, NOT FULLY LAUNCHED

### 6. AudioHardcore — [AudioHardcore](https://github.com/anastaysia94-sudo/AudioHardcore)
Local music library (scan, tag, play, sync) for desktop + Android starter + WordPress plugin. Tests pass. Still needs your HTTPS/DNS, signed Android release, and device QA. Closed verification PRs today were “do not merge” acceptance passes.

### 7. EGM4000 — [EGM4000-Android](https://github.com/anastaysia94-sudo/EGM4000-Android)
Gameplay evidence / coaching app (Watch → Measure → Explain → Improve). Android v0.2.1 builds in CI. Public web deploy is **blocked because Render wants billing** (HTTP 402). Open issue: [C015 public HTTPS URL](https://github.com/anastaysia94-sudo/EGM4000-Android/issues/3).

### 8. Manila — [manila](https://github.com/anastaysia94-sudo/manila)
School-letter + IEP/504 meeting coach. Working phone-installable demo. Data stays in the browser. Still needs payments, encrypted two-parent vault, lawyer-reviewed deadlines, FERPA/COPPA before any server.

### 9. Impound Ransom — [impound-ransom](https://github.com/anastaysia94-sudo/impound-ransom)
Tow-lot / impound fee helper. Chicago live data works; other cities are official links + fee-cap memos. $19/$79 checkout is still a local demo (not Stripe).

### 10. SameBeat — [same-beat](https://github.com/anastaysia94-sudo/same-beat)
Hear a song nearby, jump your own legal stream to the same moment. MVP code exists. Needs production AudD token, Spotify/Pandora legal review before public launch.

---

## INCOMPLETE / MID-BUILD

### 11. Human Operating System Institute — [human-operating-system-institute](https://github.com/anastaysia94-sudo/human-operating-system-institute)
Honest self-score: **~22%**. Curriculum map exists. 6 **draft** PRs (#6–#11) and 5 issues all wait for **your** human review. Do not merge. Freeze this week unless you sit down and review Lessons 1–20.

### 12. Anarchy LLM — [Anarchy-LLM](https://github.com/anastaysia94-sudo/Anarchy-LLM)
Chat UI with DAN + Villagers modes, truth-first constitution, Groq on the server. Not deployed. Needs API key on a host, legal/age review. Leave frozen this week.

### 13. AI Bridge — [ai-bridge](https://github.com/anastaysia94-sudo/ai-bridge)
Shared memory so Grok, ChatGPT, and Copilot stop talking past each other. Kit is in place. Templates are **not yet copied into the other 15 repos.**

---

## NOTED BUT NOT STARTED

| Repo | What’s there | What it is not |
|---|---|---|
| [doubletap-rewards](https://github.com/anastaysia94-sudo/doubletap-rewards) (private) | One-line README | No product, no issues, created today |
| [san-jose-prospecting-pwa](https://github.com/anastaysia94-sudo/san-jose-prospecting-pwa) | Empty git repo | Cashh Radar already covers this job |
| [Firek-clone](https://github.com/anastaysia94-sudo/Firek-clone) (private) | LICENSE only | Empty; do not clone third-party games |

---

## Connector / plugin truth

| Plugin | Status |
|---|---|
| GitHub | Working for repos, issues, PRs, files. Projects board + notifications need extra permission. |
| Gmail | Working (`anastaysia487@gmail.com`). Outreach is job applications, not product sales. Northern Frights replied: they are **not** hiring a VA. |
| HubSpot | Connected but **CRM is locked** until you reconnect with permissions. Academy courses are a separate free website. |
| Voice | Working (this briefing). |
| Automations | Weekly Monday 9am PT portfolio pulse created this session. |

---

## Recommended next execution sequence (do in this order)

1. **Money path A — shop:** Import `founder-os/four-offer-launch` on Vercel (email already waiting). Add PayPal **sandbox** keys only in the host dashboard. One $19 sandbox buy. Then one live $19 buy. Then share.
2. **Money path B — W-2:** California 1099 chat jobs (LiveOps/Arise/Rev) are closed by AB5. Apply W-2 remote CS (CVS, TTEC, Concentrix, Amazon CS, Alorica) + HubSpot Academy tonight.
3. **Arcade:** Review F.S.A. PRs #53 and #45. Leave #36 until emulator CI is green.
4. **Local San Jose products:** Dumpster Atlas 25-location expansion; Snarky Episode 002.
5. **Do not this week:** Merge HOSI drafts. Start Anarchy deploy. Fill Firek-clone. Build a second prospecting PWA.

## New product ideas that complement what already exists

1. **SmartPickShop Command Center (public)** — one page that links every live app with honest status badges. Kill the “which URL is real?” problem.
2. **Offer Shop go-live** — the $19 pack is the only thing that can produce a receipt this week.
3. **Dumpster Atlas x Cashh Radar** — reuse the source-check habit; do not mix scavenger data into sales CRM.
4. **Manila paid clinic** — $129 strategy hour is closer to cash than HOSI accreditation.
5. **Archive or delete** empty repos so the account looks like a studio, not a junk drawer.
6. **Job-application tracker in Founder OS** — you are already sending designer/VA/marketing apps; log them as initiatives, not a new app.
