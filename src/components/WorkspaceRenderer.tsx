import type { ReactNode } from "react";
import type { UiNode } from "../types";

const asString = (value: unknown, fallback = "") =>
  typeof value === "string" || typeof value === "number" ? String(value) : fallback;

const asRows = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value)
    ? value.filter(row => row && typeof row === "object" && !Array.isArray(row))
    : [];

const asStrings = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(item => asString(item)).filter(Boolean) : [];

function RenderChildren({ children }: { children?: UiNode[] }) {
  return <>{children?.map((child, index) => <WorkspaceRenderer key={index} node={child} />)}</>;
}

export default function WorkspaceRenderer({ node }: { node: UiNode }): ReactNode {
  const props = node.props ?? {};

  switch (node.type) {
    case "dashboard":
      return (
        <section className="generated-dashboard">
          <header className="generated-heading">
            <span>{asString(props.eyebrow, "GENERATED WORKSPACE")}</span>
            <h2>{asString(props.title, "Untitled workspace")}</h2>
          </header>
          <div className="generated-content">
            <RenderChildren children={node.children} />
          </div>
        </section>
      );
    case "grid": {
      const columns = Math.min(4, Math.max(1, Number(props.columns) || 2));
      return (
        <div
          className={`widget-grid ${props.wideFirst ? "widget-grid--wide-first" : ""}`}
          style={{ "--grid-columns": columns } as React.CSSProperties}
        >
          <RenderChildren children={node.children} />
        </div>
      );
    }
    case "stack":
      return (
        <div className="widget-stack">
          <RenderChildren children={node.children} />
        </div>
      );
    case "row":
      return (
        <div className="widget-row">
          <RenderChildren children={node.children} />
        </div>
      );
    case "card":
      return (
        <article className="widget-card">
          <h3>{asString(props.title, "Card")}</h3>
          <div className="widget-card__body">
            <RenderChildren children={node.children} />
          </div>
        </article>
      );
    case "kpi":
      return (
        <article className={`widget-kpi tone-${asString(props.tone, "neutral")}`}>
          <span>{asString(props.label)}</span>
          <strong>{asString(props.value, "—")}</strong>
          <p>{asString(props.detail)}</p>
        </article>
      );
    case "table": {
      const rows = asRows(props.rows);
      const columns = asStrings(props.columns);
      return (
        <div className="widget-table-wrap">
          <table className="widget-table">
            <thead>
              <tr>{columns.map(column => <th key={column}>{column}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map(column => (
                    <td key={column} data-label={column}>
                      {column === "severity" || column === "status" ? (
                        <span className={`inline-status status-${asString(row[column]).toLowerCase()}`}>
                          {asString(row[column], "—")}
                        </span>
                      ) : (
                        asString(row[column], "—")
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case "badge":
      return (
        <span className={`widget-badge status-${asString(props.tone, "neutral")}`}>
          {asString(props.label)}
        </span>
      );
    case "text":
      return <p className={`widget-text text-${asString(props.tone, "default")}`}>{asString(props.text)}</p>;
    case "progress": {
      const value = Math.min(100, Math.max(0, Number(props.value) || 0));
      return (
        <div className="widget-progress">
          <div><span>{asString(props.label)}</span><strong>{value}%</strong></div>
          <div className="widget-progress__track"><i style={{ width: `${value}%` }} /></div>
        </div>
      );
    }
    case "list":
      return <ul className="widget-list">{asStrings(props.items).map(item => <li key={item}>{item}</li>)}</ul>;
    default:
      return null;
  }
}
