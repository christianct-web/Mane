import { createSandboxDocument } from "./sandboxDocument";
import { parseSandboxMessage } from "./protocol";
import type { ExecutionResult, SandboxFailure } from "../types";

type PendingRun = {
  resolve: (value: ExecutionResult) => void;
  reject: (error: Error) => void;
};

export class ManeSandbox {
  private readonly iframe: HTMLIFrameElement;
  private readonly nonce = crypto.randomUUID();
  private readonly pending = new Map<string, PendingRun>();
  private ready: Promise<void>;
  private markReady!: () => void;

  constructor(timeoutMs = 1600) {
    this.ready = new Promise(resolve => {
      this.markReady = resolve;
    });

    this.iframe = document.createElement("iframe");
    this.iframe.setAttribute("sandbox", "allow-scripts");
    this.iframe.setAttribute("aria-hidden", "true");
    this.iframe.tabIndex = -1;
    this.iframe.style.display = "none";
    this.iframe.srcdoc = createSandboxDocument(this.nonce, timeoutMs);

    window.addEventListener("message", this.handleMessage);
    document.body.appendChild(this.iframe);
  }

  async execute(code: string, snapshot: unknown): Promise<ExecutionResult> {
    await this.ready;
    const runId = crypto.randomUUID();

    return new Promise((resolve, reject) => {
      this.pending.set(runId, { resolve, reject });
      this.iframe.contentWindow?.postMessage(
        {
          channel: "mane:host",
          nonce: this.nonce,
          runId,
          code,
          snapshot
        },
        "*"
      );
    });
  }

  destroy(): void {
    window.removeEventListener("message", this.handleMessage);
    this.pending.forEach(({ reject }) => reject(new Error("Sandbox was destroyed.")));
    this.pending.clear();
    this.iframe.remove();
  }

  private handleMessage = (event: MessageEvent): void => {
    if (event.source !== this.iframe.contentWindow) {
      return;
    }

    const raw = event.data as Record<string, unknown> | null;
    if (!raw || raw.nonce !== this.nonce || raw.channel !== "mane:sandbox") {
      return;
    }

    if (raw.kind === "ready") {
      this.markReady();
      return;
    }

    const parsed = parseSandboxMessage(raw);
    if (!parsed) {
      return;
    }

    const pending = this.pending.get(parsed.runId);
    if (!pending) {
      return;
    }

    this.pending.delete(parsed.runId);
    if ("tree" in parsed) {
      pending.resolve(parsed);
    } else {
      const failure = parsed as SandboxFailure;
      pending.reject(new Error(`${failure.code ?? "SANDBOX_ERROR"}: ${failure.error}`));
    }
  };
}
