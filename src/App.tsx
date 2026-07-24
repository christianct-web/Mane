import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  Blocks,
  Braces,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Code2,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import WorkspaceRenderer from "./components/WorkspaceRenderer";
import ProposalPanel from "./components/ProposalPanel";
import { canterSnapshot } from "./data/canterSnapshot";
import { workspaceExamples } from "./examples";
import { ManeSandbox } from "./runtime/ManeSandbox";
import type { ExecutionResult, WorkspaceVersion } from "./types";

const createVersion = (code: string, label: string): WorkspaceVersion => ({
  id: crypto.randomUUID(),
  createdAt: new Date().toISOString(),
  code,
  label
});

function App() {
  const sandboxRef = useRef<ManeSandbox | null>(null);
  const [selectedExample, setSelectedExample] = useState(workspaceExamples[0].id);
  const [code, setCode] = useState(workspaceExamples[0].code);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"workspace" | "actions">("workspace");
  const [versions, setVersions] = useState<WorkspaceVersion[]>([
    createVersion(workspaceExamples[0].code, "Initial generated workspace")
  ]);

  useEffect(() => {
    const sandbox = new ManeSandbox();
    sandboxRef.current = sandbox;
    return () => sandbox.destroy();
  }, []);

  const selected = useMemo(
    () => workspaceExamples.find(item => item.id === selectedExample) ?? workspaceExamples[0],
    [selectedExample]
  );

  const runCode = async () => {
    if (!sandboxRef.current) return;
    setRunning(true);
    setError("");

    try {
      const nextResult = await sandboxRef.current.execute(code, canterSnapshot);
      setResult(nextResult);
      setVersions(current => [
        createVersion(code, `Run ${current.length + 1}`),
        ...current
      ].slice(0, 8));
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : String(runError));
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void runCode();
    }, 50);
    return () => window.clearTimeout(timer);
    // Initial product demo run only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chooseExample = (id: string) => {
    const example = workspaceExamples.find(item => item.id === id);
    if (!example) return;
    setSelectedExample(id);
    setCode(example.code);
    setError("");
  };

  const restoreVersion = (version: WorkspaceVersion) => {
    setCode(version.code);
    setError("");
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><span>M</span></div>
          <div>
            <strong>Mane</strong>
            <small>by Mana Labs 8</small>
          </div>
        </div>
        <div className="topbar-context">
          <span className="live-dot" />
          Canter domain pack
          <ChevronDown size={14} />
        </div>
        <div className="topbar-status">
          <ShieldCheck size={15} />
          Governed runtime
        </div>
      </header>

      <section className="hero">
        <div>
          <span className="eyebrow"><Sparkles size={14} /> ADAPTIVE JAVASCRIPT WORKSPACE</span>
          <h1>The interface builds itself<br />around the work.</h1>
          <p>
            Mane lets an agent write real JavaScript to assemble a useful workspace,
            while business actions remain tenant-scoped, reviewed and auditable.
          </p>
        </div>
        <div className="hero-proof">
          <div><Code2 size={18} /><strong>JavaScript-first</strong><span>No generated JSON dashboard schema</span></div>
          <div><Blocks size={18} /><strong>Product-aware</strong><span>Canter is the first Stable domain pack</span></div>
          <div><ShieldCheck size={18} /><strong>Action-gated</strong><span>Generated code cannot mutate source records</span></div>
        </div>
      </section>

      <section className="studio">
        <aside className="studio-sidebar">
          <div className="sidebar-section">
            <span className="section-label">Workspace brief</span>
            <h2>{selected.name}</h2>
            <p>{selected.description}</p>
          </div>

          <div className="sidebar-section">
            <span className="section-label">Generated examples</span>
            <div className="example-list">
              {workspaceExamples.map(example => (
                <button
                  type="button"
                  className={example.id === selectedExample ? "active" : ""}
                  key={example.id}
                  onClick={() => chooseExample(example.id)}
                >
                  <Braces size={16} />
                  <span><strong>{example.name}</strong><small>{example.description}</small></span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section runtime-contract">
            <span className="section-label">Runtime contract</span>
            <ul>
              <li><CheckCircle2 size={14} /> Isolated worker</li>
              <li><CheckCircle2 size={14} /> Frozen tenant snapshot</li>
              <li><CheckCircle2 size={14} /> No network capability</li>
              <li><CheckCircle2 size={14} /> Allowlisted UI renderer</li>
              <li><CheckCircle2 size={14} /> Reviewed action proposals</li>
            </ul>
          </div>
        </aside>

        <div className="studio-main">
          <div className="editor-pane">
            <div className="pane-header">
              <div>
                <Code2 size={16} />
                <strong>Agent-authored JavaScript</strong>
              </div>
              <span>workspace.js</span>
            </div>
            <textarea
              aria-label="Generated workspace JavaScript"
              spellCheck={false}
              value={code}
              onChange={event => setCode(event.target.value)}
            />
            <div className="editor-actions">
              <span><Activity size={14} /> Runs against a read-only snapshot</span>
              <button type="button" onClick={runCode} disabled={running}>
                <Play size={15} fill="currentColor" />
                {running ? "Building…" : "Build workspace"}
              </button>
            </div>
          </div>

          <div className="preview-pane">
            <div className="pane-header preview-header">
              <div className="preview-tabs">
                <button
                  type="button"
                  className={activeTab === "workspace" ? "active" : ""}
                  onClick={() => setActiveTab("workspace")}
                >
                  Workspace
                </button>
                <button
                  type="button"
                  className={activeTab === "actions" ? "active" : ""}
                  onClick={() => setActiveTab("actions")}
                >
                  Action requests
                  {result?.proposals.length ? <b>{result.proposals.length}</b> : null}
                </button>
              </div>
              {result ? <span><Clock3 size={13} /> {Math.round(result.durationMs)} ms</span> : null}
            </div>

            <div className="preview-body">
              {error ? (
                <div className="error-state">
                  <Code2 size={26} />
                  <strong>Workspace could not be built</strong>
                  <p>{error}</p>
                </div>
              ) : activeTab === "workspace" && result ? (
                <WorkspaceRenderer node={result.tree} />
              ) : activeTab === "actions" && result ? (
                <ProposalPanel proposals={result.proposals} />
              ) : (
                <div className="loading-state">Preparing the governed runtime…</div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="history-section">
        <div>
          <span className="eyebrow"><RotateCcw size={14} /> WORKSPACE HISTORY</span>
          <h2>Every generated interface is reversible.</h2>
        </div>
        <div className="history-list">
          {versions.slice(0, 4).map(version => (
            <button type="button" key={version.id} onClick={() => restoreVersion(version)}>
              <Clock3 size={16} />
              <span>
                <strong>{version.label}</strong>
                <small>{new Date(version.createdAt).toLocaleTimeString("en-TT", {
                  hour: "numeric",
                  minute: "2-digit"
                })}</small>
              </span>
              <RotateCcw size={14} />
            </button>
          ))}
        </div>
      </section>

      <footer>
        <span>Mane v0.1 foundation</span>
        <span>JavaScript inside. Contracts at the edges.</span>
      </footer>
    </main>
  );
}

export default App;
