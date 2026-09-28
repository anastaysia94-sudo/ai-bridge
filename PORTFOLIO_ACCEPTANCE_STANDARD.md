# Portfolio Production Acceptance Standard v1

Effective: 2026-09-28

This is the canonical verification standard for Anastaysia Ventures / SmartPickShop portfolio projects.

## Truth boundary

A build is not a launch. A deployment is not production acceptance. A test payment is not revenue. A sent application is not a customer. A synthetic user is not a customer. No evidence means NOT VERIFIED.

## Required states

Use exactly these states for each applicable gate:
- NOT_STARTED
- IMPLEMENTED
- VERIFIED
- BLOCKED_EXTERNAL
- NOT_APPLICABLE

A project may be called **STRONG / production-accepted** only when every applicable blocking gate is VERIFIED. BLOCKED_EXTERNAL remains open and must name the exact external action.

## Blocking gates

| Gate | Minimum evidence |
|---|---|
| G01 Source identity | repository + branch + exact commit SHA |
| G02 Clean production build | successful production build/run ID and artifact identity |
| G03 Automated regression | relevant unit/integration/e2e checks green at accepted source |
| G04 Core workflow | beginning-to-end intended user workflow passes |
| G05 Failure paths | bad input, network/service failure and recovery behavior tested |
| G06 Authentication/authorization | login/logout/recovery/unauthorized access where applicable |
| G07 Persistence | required data survives refresh/restart/relogin where applicable |
| G08 Mobile/device | supported mobile viewport or real hardware acceptance |
| G09 Desktop/browser | supported desktop/browser acceptance |
| G10 Secrets/security | no client/repo secrets; production security configuration verified |
| G11 Payment | sandbox/real payment flow verified where commerce exists |
| G12 Fulfillment | purchased entitlement/delivery reaches correct customer and asset |
| G13 Recovery/rollback | rollback/restore path documented and tested where applicable |
| G14 Artifact integrity | version/package identity plus checksum/signature where distributed |
| G15 Monitoring/health | live health/readiness and useful operational diagnostics |
| G16 Source/deploy match | running production revision matches intended accepted source |
| G17 Commercial validation | real qualified user/buyer behavior recorded without inference |
| G18 Revenue | received funds reconciled to a real customer transaction; never inferred |

## Android release extension

Android store-ready status additionally requires:
1. durable upload signing identity;
2. signed APK/AAB signature verification;
3. physical-device install/launch and core workflow;
4. internal-track upload acceptance when Google Play distribution is intended;
5. internal-track install smoke before production rollout.

Emulator evidence does not replace physical-device evidence.

## Commercial evidence ladder

OUTREACH -> HUMAN_REPLY -> QUALIFIED_CONVERSATION -> PAID_SCOPE -> DELIVERY -> RECEIVED_PAYMENT -> REPEAT/REFERRAL

Only RECEIVED_PAYMENT or later counts as verified revenue.

## Evidence record

For every verification event record:
- project
- date/time
- gate
- state
- commit/revision
- CI/deployment/run/artifact/transaction ID
- evidence location
- exact blocker if open
- smallest next action

## Global bar definitions

- Implementation = STRONG only when core required workflows for the designated launch set are implemented and no critical placeholder remains.
- Verification = STRONG only when this matrix is applied and all applicable blocking gates for the designated launch set are verified.
- Production Launch = STRONG only when the designated launch set has real production endpoints/releases, source-match, health/monitoring, recovery and customer path acceptance.
- Commercial Validation = STRONG only with multiple real qualified users/buyers and documented conversion/objection evidence.
- Verified Revenue = STRONG only with multiple reconciled received customer payments and evidence of repeatable acquisition or repeat business.

## Resume rule

Continue from the first non-VERIFIED applicable blocking gate. Do not rerun settled gates unless source/config/environment changed or contradictory evidence appears.
