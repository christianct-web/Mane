import type { ActionProposal, ExecutionResult, SandboxFailure, UiNode } from "../types";

const UI_TYPES = new Set([
  "dashboard",
  "grid",
  "stack",
  "row",
  "card",
  "kpi",
  "table",
  "badge",
  "text",
  "progress",
  "list"
]);

const MAX_TREE_DEPTH = 12;
const MAX_TREE_NODES = 500;
const MAX_PROPOSALS = 20;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function validateNode(value: unknown, depth: number, count: { value: number }): value is UiNode {
  if (!isRecord(value) || typeof value.type !== "string" || !UI_TYPES.has(value.type)) {
    return false;
  }

  if (depth > MAX_TREE_DEPTH || ++count.value > MAX_TREE_NODES) {
    return false;
  }

  if (value.props !== undefined && !isRecord(value.props)) {
    return false;
  }

  if (value.children !== undefined) {
    if (!Array.isArray(value.children)) {
      return false;
    }

    return value.children.every(child => validateNode(child, depth + 1, count));
  }

  return true;
}

export function isUiNode(value: unknown): value is UiNode {
  return validateNode(value, 0, { value: 0 });
}

function isProposal(value: unknown): value is ActionProposal {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.action === "string" &&
    isRecord(value.payload) &&
    typeof value.reason === "string" &&
    ["low", "medium", "high"].includes(String(value.risk))
  );
}

export function parseSandboxMessage(
  value: unknown
): ExecutionResult | SandboxFailure | null {
  if (!isRecord(value) || value.channel !== "mane:sandbox") {
    return null;
  }

  const runId = typeof value.runId === "string" ? value.runId : "";
  if (!runId) {
    return null;
  }

  if (value.kind === "failure") {
    return {
      runId,
      error: typeof value.error === "string" ? value.error : "Unknown sandbox error",
      code:
        value.code === "COMPILE_ERROR" ||
        value.code === "RUNTIME_ERROR" ||
        value.code === "TIMEOUT" ||
        value.code === "INVALID_OUTPUT"
          ? value.code
          : undefined
    };
  }

  if (
    value.kind !== "result" ||
    !isUiNode(value.tree) ||
    !Array.isArray(value.proposals) ||
    value.proposals.length > MAX_PROPOSALS ||
    !value.proposals.every(isProposal)
  ) {
    return {
      runId,
      error: "The generated workspace returned an invalid or oversized result.",
      code: "INVALID_OUTPUT"
    };
  }

  return {
    runId,
    tree: value.tree,
    proposals: value.proposals,
    logs: Array.isArray(value.logs)
      ? value.logs.filter(item => typeof item === "string").slice(0, 100)
      : [],
    durationMs:
      typeof value.durationMs === "number" && Number.isFinite(value.durationMs)
        ? value.durationMs
        : 0
  };
}
