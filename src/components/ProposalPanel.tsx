import { AlertTriangle, Check, ShieldCheck } from "lucide-react";
import type { ActionProposal } from "../types";

export default function ProposalPanel({ proposals }: { proposals: ActionProposal[] }) {
  if (!proposals.length) {
    return (
      <div className="proposal-empty">
        <ShieldCheck size={18} />
        <span>This run requested no business-state changes.</span>
      </div>
    );
  }

  return (
    <div className="proposal-list">
      {proposals.map(proposal => (
        <article className="proposal" key={proposal.id}>
          <div className="proposal__icon"><AlertTriangle size={18} /></div>
          <div className="proposal__content">
            <div className="proposal__meta">
              <span>{proposal.action}</span>
              <b>{proposal.risk} risk</b>
            </div>
            <p>{proposal.reason}</p>
            <pre>{JSON.stringify(proposal.payload, null, 2)}</pre>
          </div>
          <button
            type="button"
            title="A production capability broker will apply approved actions."
            disabled
          >
            <Check size={15} />
            Approval gate
          </button>
        </article>
      ))}
      <p className="prototype-note">
        Prototype boundary: approval is intentionally non-operational. No source record is changed.
      </p>
    </div>
  );
}
