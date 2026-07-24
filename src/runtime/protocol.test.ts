import { describe, expect, it } from "vitest";
import { isUiNode, parseSandboxMessage } from "./protocol";

describe("workspace output validation", () => {
  it("accepts an allowlisted UI tree", () => {
    expect(
      isUiNode({
        type: "card",
        props: { title: "Exceptions" },
        children: [{ type: "text", props: { text: "Three open" }, children: [] }]
      })
    ).toBe(true);
  });

  it("rejects raw HTML and unknown component types", () => {
    expect(isUiNode({ type: "html", props: { html: "<script>alert(1)</script>" } })).toBe(false);
  });

  it("rejects oversized trees", () => {
    let tree: unknown = { type: "text", props: { text: "end" } };
    for (let index = 0; index < 20; index += 1) {
      tree = { type: "stack", children: [tree] };
    }
    expect(isUiNode(tree)).toBe(false);
  });

  it("parses a valid sandbox result", () => {
    const parsed = parseSandboxMessage({
      channel: "mane:sandbox",
      kind: "result",
      runId: "run-1",
      tree: { type: "text", props: { text: "ready" } },
      proposals: [],
      logs: [],
      durationMs: 8
    });
    expect(parsed).toMatchObject({ runId: "run-1", durationMs: 8 });
  });
});
