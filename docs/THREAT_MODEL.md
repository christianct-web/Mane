# Mane threat model

## Security objective

Agent-generated JavaScript may create useful interfaces and analyses, but must not
gain ambient authority over the host application or authoritative product state.

## Trust zones

| Zone | Trust |
| --- | --- |
| React host | trusted application code |
| FastAPI capability broker | trusted authoritative policy boundary |
| Product services | trusted domain logic |
| Generated JavaScript | untrusted |
| Generated UI output | untrusted until validated |
| Action proposal | untrusted request until authorised |
| Snapshot data | trusted source, minimised before sandbox delivery |

## Principal threats and controls

### Host DOM or credential theft

Controls:

- unique-origin sandboxed iframe;
- no `allow-same-origin`;
- worker execution;
- no host object references;
- nonce and source checks on messages;
- no tokens in snapshot payloads.

### Data exfiltration

Controls:

- CSP denies connections and remote resources;
- network globals removed in the worker;
- no cookies or local storage in the worker;
- product data minimisation;
- production egress filtering;
- output and log limits.

### Infinite loops or resource exhaustion

Controls:

- disposable worker;
- execution deadline;
- worker termination;
- UI tree depth and node limits;
- proposal and log limits;
- production query and result budgets.

### Cross-tenant access

Controls:

- tenant derived from authenticated server context;
- generated code cannot supply authoritative tenant scope;
- row-level tests;
- capability grants bound to user, role, tenant and domain pack.

### Unauthorised business mutation

Controls:

- sandbox only creates action proposals;
- policy service validates action type and payload;
- server-side approval;
- maker/checker where required;
- idempotent command execution;
- audit event before and after execution.

### Misleading generated calculations

Controls:

- generated calculations labelled analytical;
- authoritative figures come from domain services;
- source and calculation provenance;
- domain evaluation suites;
- no generated statutory, tariff or payment oracle.

### Stored malicious workspace

Controls:

- every run uses the same sandbox;
- source visible before execution;
- signed revision metadata;
- administrator quarantine and kill switch;
- no elevation when a workspace is shared.

## Known v0.1 limitations

The current prototype demonstrates boundaries but is not production-certified.
It still needs:

- independent security review;
- penetration testing;
- production CSP headers;
- server egress controls;
- static source inspection;
- backend capability enforcement;
- persistent audit records;
- incident response and kill-switch operations;
- dependency and supply-chain review.
