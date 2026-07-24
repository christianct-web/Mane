export type Primitive = string | number | boolean | null;

export type UiNode = {
  type:
    | "dashboard"
    | "grid"
    | "stack"
    | "row"
    | "card"
    | "kpi"
    | "table"
    | "badge"
    | "text"
    | "progress"
    | "list";
  props?: Record<string, unknown>;
  children?: UiNode[];
};

export type ActionProposal = {
  id: string;
  action: string;
  payload: Record<string, unknown>;
  reason: string;
  risk: "low" | "medium" | "high";
};

export type ExecutionResult = {
  runId: string;
  tree: UiNode;
  proposals: ActionProposal[];
  logs: string[];
  durationMs: number;
};

export type SandboxFailure = {
  runId: string;
  error: string;
  code?: "COMPILE_ERROR" | "RUNTIME_ERROR" | "TIMEOUT" | "INVALID_OUTPUT";
};

export type WorkspaceVersion = {
  id: string;
  createdAt: string;
  code: string;
  label: string;
};
