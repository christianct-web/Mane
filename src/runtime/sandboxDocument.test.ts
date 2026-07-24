import { describe, expect, it } from "vitest";
import { createSandboxDocument } from "./sandboxDocument";

describe("sandbox document", () => {
  const document = createSandboxDocument("nonce-for-test", 1250);

  it("uses a network-denying content security policy", () => {
    expect(document).toContain("default-src 'none'");
    expect(document).toContain("connect-src 'none'");
    expect(document).toContain("form-action 'none'");
  });

  it("binds the protocol to the supplied nonce", () => {
    expect(document).toContain('const NONCE = "nonce-for-test"');
    expect(document).toContain("message.nonce !== NONCE");
  });

  it("creates a disposable worker with a deadline", () => {
    expect(document).toContain("const TIMEOUT_MS = 1250");
    expect(document).toContain("worker.terminate()");
    expect(document).toContain('code: "TIMEOUT"');
  });

  it("does not expose ordinary network clients to generated code", () => {
    expect(document).toContain("self.fetch = undefined");
    expect(document).toContain("self.XMLHttpRequest = undefined");
    expect(document).toContain("self.WebSocket = undefined");
    expect(document).toContain("self.EventSource = undefined");
  });
});
