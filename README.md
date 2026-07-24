# Mane

**The governed JavaScript workspace that shapes itself around the work.**

Mane is a shared Mana Labs 8 platform capability inspired by Space Agent's strongest
idea: an agent should be able to write JavaScript that creates a useful interface
inside the running product.

Mane preserves that JavaScript-first model while separating generated code from
authoritative product operations.

## What this foundation proves

- Agent-authored JavaScript runs outside the host application.
- The code receives a frozen, tenant-scoped data snapshot rather than credentials.
- Network access is blocked inside the execution environment.
- A worker watchdog stops long-running code.
- JavaScript can transform data and dynamically compose an approved UI vocabulary.
- Business mutations become explicit action proposals.
- Proposed actions do not execute in this prototype.
- Workspace source can be restored from prior versions.
- Canter retail profit recovery and inbound control is the first domain pack.

## Run locally

```bash
npm install
npm run dev
```

Validation:

```bash
npm run check
```

## Architecture in one sentence

> JavaScript inside; strict contracts at the edges.

The browser host creates a sandboxed, unique-origin iframe. The iframe creates a
dedicated worker and runs the generated JavaScript there. The worker receives only:

- `mana.context`
- `mana.data.list()` and `mana.data.get()` over a frozen snapshot
- `mana.actions.propose()`
- the allowlisted `ui` component API

The worker cannot access the host DOM, authentication cookies, local storage, or
the live product database.

See:

- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/THREAT_MODEL.md`
- `docs/SELF-CRITIQUE.md`

## Status

Version 0.1 is a product and runtime foundation, not a production security claim.
Production work still requires an independent security review, the FastAPI
capability broker, persistent workspace revisions, tenant-isolation tests,
authorised action execution, and LLM orchestration.
