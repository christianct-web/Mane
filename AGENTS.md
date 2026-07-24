# Mane repository guide

## Purpose

Mane is the governed JavaScript-first adaptive workspace for the Mana Labs 8
Stable. Preserve the product principle: JavaScript inside, strict contracts at
the edges.

## Non-negotiable boundaries

- Generated code is untrusted.
- Never expose host tokens, cookies, storage, database credentials or product
  service clients to generated code.
- Never allow generated code to directly execute authoritative business actions.
- Tenant scope must be derived by the trusted backend.
- Do not add raw HTML rendering for generated output.
- Do not represent analytical calculations as authoritative statutory, tariff,
  payment or compliance results.
- Every new mutation capability requires an action policy, approval rule, audit
  event and test.

## Structure

- `src/runtime/`: sandbox protocol, execution environment and validation.
- `src/components/`: trusted host renderers and review surfaces.
- `src/data/`: non-sensitive demonstration snapshots only.
- `docs/`: product, architecture, threat model and decisions.

## Verification

Run:

```bash
npm run check
```

Security-sensitive runtime changes also require manual browser testing of:

- network denial;
- timeout termination;
- invalid output rejection;
- action proposal isolation;
- iframe source and nonce validation.
