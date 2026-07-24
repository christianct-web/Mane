# Mane architecture

## System shape

Mane is a shared platform with product-specific domain packs. Canter owns retail
analytics and operational profit recovery. Rein is a separate credit-union
verification, compliance education and evidence product.

```text
User brief
   |
Agent code generator
   |
Visible JavaScript source
   |
Sandbox runtime
   |---- read-only capability calls ----> FastAPI capability broker
   |                                      |
   |                                      +--> tenant-scoped product APIs
   |
   +---- UI tree -----------------------> host renderer
   |
   +---- action proposals -------------> policy + approval service
                                          |
                                          +--> authorised product command
```

JSON or structured clone exists at the boundaries because those boundaries must
be validated. The agent still authors JavaScript.

## Runtime foundation

The v0.1 browser runtime has four layers.

### 1. Host application

The trusted React application owns:

- identity context;
- the product shell;
- sandbox lifecycle;
- output validation;
- UI rendering;
- action-review presentation.

Generated code never receives a reference to this application.

### 2. Unique-origin iframe

The host creates an iframe with:

```html
sandbox="allow-scripts"
```

It does not grant `allow-same-origin`. The iframe carries a restrictive CSP and
communicates with the host through a nonce-bound message protocol.

### 3. Disposable worker

Each execution gets a new worker. The worker:

- receives the code and a serialisable snapshot;
- freezes the snapshot;
- removes ordinary network globals;
- exposes only `mana`, `ui` and a limited console;
- executes the JavaScript;
- returns serialisable output;
- is terminated after success, failure or timeout.

### 4. Host validator and renderer

The host rejects:

- unknown UI component types;
- invalid properties;
- trees deeper than the configured limit;
- trees over the node limit;
- invalid action proposals;
- excessive action proposals.

The renderer never uses generated `innerHTML`.

## Production capability broker

The FastAPI broker will add the authoritative controls that a browser cannot:

- derive tenant and user from the signed session;
- ignore tenant identifiers supplied by generated code;
- enforce capability and field allowlists;
- enforce row-level tenant scope;
- apply query budgets;
- redact restricted fields;
- record query and action audit events;
- require idempotency keys for commands;
- enforce maker/checker and approval policy;
- issue short-lived snapshot handles.

## Domain packs

A domain pack contains:

- capability manifest;
- dataset/query definitions;
- action definitions;
- approval policies;
- UI helpers;
- skills and examples;
- product-specific evaluation cases.

Generated JavaScript asks for domain data by capability name. It does not receive
database credentials or arbitrary SQL.

## Storage

Production storage belongs in PostgreSQL.

Core records:

- `workspaces`
- `workspace_revisions`
- `workspace_runs`
- `capability_grants`
- `action_proposals`
- `action_approvals`
- `audit_events`

Generated source, capability manifest version, input snapshot hash, result hash,
model identity, prompt version and approver identity should be retained for each
run.

## Why not use the Space Agent filesystem directly

The file layers are useful inspiration for ownership and inheritance. Mana Labs 8
already uses FastAPI, React and PostgreSQL for authoritative products. Replacing
that stack would create two security and tenancy models.

Mane maps the idea into database-backed scopes:

- platform defaults;
- organisation workspace templates;
- individual workspace revisions.
