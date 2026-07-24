# Validation and self-critique

## What the earlier analysis got right

1. Space Agent's most valuable contribution is not chat. It is the self-shaping
   product surface: agent-authored capabilities become persistent interface.
2. Its system, group and user layers are relevant to a multi-tenant Mana Labs 8
   platform.
3. Skills, workspaces, widgets, rollback and contextual prompts are reusable ideas.
4. Authoritative operations in customs, payroll, payments, verification and
   consent must remain deterministic and audited.
5. Canter is an effective first domain because analytics and operational exception
   work naturally benefit from an adaptive interface.

## Where the first response was wrong

The first recommendation replaced agent-authored JavaScript with generated JSON
workspace definitions. That removed the defining capability under evaluation.
It reduced Mane to a conventional dashboard builder with an LLM planner.

JSON is appropriate for messages across trust boundaries. It should not become
the language the agent is forced to use to create the workspace.

## Where the second response was incomplete

The corrected answer restored JavaScript but suggested a sandboxed iframe as if
that alone solved the security problem.

An iframe is a useful boundary, but it does not by itself provide:

- a dependable CPU timeout;
- a narrow authority model;
- protection from all browser storage or network surfaces;
- output-size limits;
- validated actions;
- tenant isolation;
- an audit trail.

The v0.1 foundation therefore uses two boundaries:

1. a unique-origin sandboxed iframe with a restrictive CSP;
2. a disposable worker for execution and timeout control.

The worker receives snapshots and explicit capabilities, not the host runtime.
The host separately validates the returned UI tree and action proposals.

## Where this foundation still falls short

- Browser primitives are not a formal proof of confinement.
- The production runtime should evaluate QuickJS/WASM or SES compartments as an
  additional defence, not as a replacement for browser/process isolation.
- The current UI vocabulary is intentionally small.
- Data snapshots are local demo fixtures.
- Action approval is intentionally non-operational.
- Workspace history is in-memory rather than PostgreSQL.
- There is no LLM provider integration.
- There is no FastAPI capability broker or JWT/RBAC enforcement yet.
- Generated code is not statically analysed before execution.
- There is no independent penetration test or security sign-off.

## Correct product conclusion

Mane should be a shared Mana Labs 8 platform with a standalone demonstrator and
embeddable domain packs. It should not be confined to Canter, but Canter should
be the first implementation. Rein remains a separate verification, compliance
education and evidence product for credit unions.

This avoids two opposite mistakes:

- forking Space Agent wholesale and inheriting its trust model;
- stripping away JavaScript until the product is no longer meaningfully adaptive.
