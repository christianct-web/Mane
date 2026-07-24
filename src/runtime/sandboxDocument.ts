const workerSource = String.raw`
const MAX_LOGS = 100;
const logs = [];
const proposals = [];
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

const serialise = value => {
  if (typeof value === "string") return value;
  try { return JSON.stringify(value); } catch { return String(value); }
};

const safeConsole = Object.freeze({
  log: (...values) => {
    if (logs.length < MAX_LOGS) logs.push(values.map(serialise).join(" "));
  },
  warn: (...values) => {
    if (logs.length < MAX_LOGS) logs.push("[warn] " + values.map(serialise).join(" "));
  }
});

const deepFreeze = value => {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  Object.values(value).forEach(deepFreeze);
  return value;
};

const clean = value => JSON.parse(JSON.stringify(value));
const node = (type, props = {}, children = []) => ({ type, props, children });
const normaliseChildren = value => Array.isArray(value) ? value : value ? [value] : [];

const ui = deepFreeze({
  dashboard: (props, children) => node("dashboard", clean(props), normaliseChildren(children)),
  grid: (props, children) => node("grid", clean(props), normaliseChildren(children)),
  stack: children => node("stack", {}, normaliseChildren(children)),
  row: children => node("row", {}, normaliseChildren(children)),
  card: (title, children) => node("card", { title: String(title) }, normaliseChildren(children)),
  kpi: (label, value, detail = "", tone = "neutral") =>
    node("kpi", { label: String(label), value: String(value), detail: String(detail), tone }),
  table: (rows, columns) => node("table", { rows: clean(rows), columns: clean(columns) }),
  badge: (label, tone = "neutral") => node("badge", { label: String(label), tone }),
  text: (text, tone = "default") => node("text", { text: String(text), tone }),
  progress: (label, value) => node("progress", { label: String(label), value: Number(value) }),
  list: items => node("list", { items: clean(items) }),
  money: value => new Intl.NumberFormat("en-TT", {
    style: "currency",
    currency: "TTD",
    maximumFractionDigits: 0
  }).format(Number(value) || 0)
});

self.fetch = undefined;
self.XMLHttpRequest = undefined;
self.WebSocket = undefined;
self.EventSource = undefined;
self.importScripts = undefined;

self.onmessage = async event => {
  const { runId, code, snapshot } = event.data || {};
  const started = performance.now();

  try {
    const frozenSnapshot = deepFreeze(clean(snapshot));
    const mana = deepFreeze({
      context: frozenSnapshot.tenant,
      data: {
        list: async name => {
          if (!Object.prototype.hasOwnProperty.call(frozenSnapshot, name)) {
            throw new Error("Dataset is not available: " + name);
          }
          const value = frozenSnapshot[name];
          if (!Array.isArray(value)) throw new Error("Dataset is not a list: " + name);
          return clean(value);
        },
        get: async (name, id) => {
          if (!Object.prototype.hasOwnProperty.call(frozenSnapshot, name)) {
            throw new Error("Dataset is not available: " + name);
          }
          const value = frozenSnapshot[name];
          if (!Array.isArray(value)) throw new Error("Dataset is not a list: " + name);
          return clean(value.find(item => item && item.id === id) ?? null);
        }
      },
      actions: {
        propose: async proposal => {
          if (!proposal || typeof proposal !== "object") {
            throw new Error("Action proposal must be an object.");
          }
          const action = String(proposal.action || "");
          const reason = String(proposal.reason || "");
          if (!action || !reason) {
            throw new Error("Action proposal requires action and reason.");
          }
          const record = {
            id: crypto.randomUUID(),
            action,
            payload: clean(proposal.payload || {}),
            reason,
            risk: ["low", "medium", "high"].includes(proposal.risk)
              ? proposal.risk
              : "medium"
          };
          proposals.push(record);
          return clean(record);
        }
      }
    });

    let fn;
    try {
      fn = new AsyncFunction("mana", "ui", "console", '"use strict";\\n' + code);
    } catch (error) {
      self.postMessage({
        kind: "failure",
        runId,
        code: "COMPILE_ERROR",
        error: error instanceof Error ? error.message : String(error)
      });
      return;
    }

    const tree = await fn(mana, ui, safeConsole);
    self.postMessage({
      kind: "result",
      runId,
      tree: clean(tree),
      proposals: clean(proposals),
      logs: clean(logs),
      durationMs: performance.now() - started
    });
  } catch (error) {
    self.postMessage({
      kind: "failure",
      runId,
      code: "RUNTIME_ERROR",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
`;

export function createSandboxDocument(nonce: string, timeoutMs: number): string {
  const encodedWorker = JSON.stringify(workerSource);
  const encodedNonce = JSON.stringify(nonce);

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Security-Policy"
      content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' blob:; worker-src blob:; connect-src 'none'; img-src data:; style-src 'unsafe-inline'; form-action 'none'; base-uri 'none';">
  </head>
  <body>
    <script>
      (() => {
        "use strict";
        const NONCE = ${encodedNonce};
        const TIMEOUT_MS = ${timeoutMs};
        const WORKER_SOURCE = ${encodedWorker};

        const reply = value => parent.postMessage({
          channel: "mane:sandbox",
          nonce: NONCE,
          ...value
        }, "*");

        window.addEventListener("message", event => {
          const message = event.data;
          if (!message || message.channel !== "mane:host" || message.nonce !== NONCE) return;

          const blob = new Blob([WORKER_SOURCE], { type: "text/javascript" });
          const url = URL.createObjectURL(blob);
          const worker = new Worker(url);
          let settled = false;

          const finish = value => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            worker.terminate();
            URL.revokeObjectURL(url);
            reply(value);
          };

          const timer = setTimeout(() => finish({
            kind: "failure",
            runId: message.runId,
            code: "TIMEOUT",
            error: "Generated JavaScript exceeded the execution limit."
          }), TIMEOUT_MS);

          worker.onmessage = workerEvent => finish(workerEvent.data);
          worker.onerror = error => finish({
            kind: "failure",
            runId: message.runId,
            code: "RUNTIME_ERROR",
            error: error.message || "Sandbox worker failed."
          });
          worker.postMessage({
            runId: message.runId,
            code: message.code,
            snapshot: message.snapshot
          });
        });

        reply({ kind: "ready", runId: "bootstrap" });
      })();
    </script>
  </body>
</html>`;
}
