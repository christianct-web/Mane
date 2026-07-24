# Mane product definition

## Product

**Mane** is the adaptive workspace layer for the Mana Labs 8 Stable.

### Positioning

> The interface that builds itself around the work.

### Product promise

Describe the operational view, investigation tool, control room or analysis you
need. Mane writes the JavaScript, builds it in the current product, and preserves
the result as a governed workspace.

### Design principle

> JavaScript inside. Contracts at the edges.

## Why it exists

Fixed dashboards eventually fail every serious operational team. Different
companies, roles, days and exceptions require different arrangements of the same
underlying information.

Traditional customisation has two poor outcomes:

- the vendor accumulates client-specific screens and configuration debt;
- the client exports data to spreadsheets and creates a shadow operating system.

Mane allows the product surface to adapt without turning authoritative business
logic into arbitrary generated code.

## Users

### Primary

- operations managers;
- analysts;
- customs brokers and senior clerks;
- accountants and payroll reviewers;
- legal researchers;
- compliance reviewers.

### Secondary

- Mana Labs 8 implementation teams;
- client administrators;
- individual operators creating personal views.

## First wedge: Canter

The first domain pack is a Canter Retail Profit Recovery and Inbound Control
workspace.

Initial jobs:

- prioritise late and high-value inbound shipments;
- build supplier risk views;
- assemble exception control rooms;
- create morning operational briefs;
- group related evidence and recommended next actions;
- request controlled escalations.

## Stable expansion

| Product | Mane domain pack |
| --- | --- |
| Canter | retail analytics, procurement, inventory and exception workspaces |
| Rein | credit-union verification, consent, education and evidence workspaces |
| Pegasus | matter rooms, evidence matrices, timelines and source comparison |
| Stallion | declaration review desks and shipment discrepancy workspaces |
| Gallop | payroll variance, reconciliation and controlled review workspaces |
| Bronco | incident rooms and camera-event investigation |
| Pony | owner-only operational views, not the WhatsApp customer experience |
| Prance | merchant creative review and campaign workspaces |

## Product boundaries

Mane may:

- generate JavaScript;
- transform data supplied through capabilities;
- assemble and persist interfaces;
- create calculations for analysis;
- create action proposals;
- explain why a proposed action exists;
- restore older workspace versions.

Mane may not directly:

- submit customs declarations;
- approve or transmit payroll;
- calculate authoritative statutory liabilities;
- move money or refund deposits;
- alter consent;
- alter verified evidence;
- change tariffs, statutory rules or compliance policy;
- access another tenant;
- read authentication credentials;
- make arbitrary network requests.

## MVP

### Included

- JavaScript workspace editor/runtime;
- Canter demo capability pack;
- tenant-scoped snapshot;
- allowlisted UI kit;
- action proposal API;
- sandbox timeout;
- result validation;
- revision restore;
- clear prototype boundaries.

### Next production slice

- LLM-generated code with visible review;
- FastAPI capability broker;
- PostgreSQL workspaces and revisions;
- JWT/RBAC and row-level tenant tests;
- action policy registry;
- server-authorised approval execution;
- code static analysis;
- signed audit events;
- share and group ownership;
- evaluation suite for generated workspace quality.

## Success measures

- time from request to useful workspace;
- percentage of generated runs that render successfully;
- percentage accepted without manual code edits;
- number of repeated workflows saved as durable workspaces;
- action proposals accepted versus rejected;
- zero unauthorised cross-tenant reads;
- zero direct generated-code mutations of authoritative product state;
- successful rollback of every workspace revision.
