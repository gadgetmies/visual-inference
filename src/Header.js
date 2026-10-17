import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { findNodeByTitle } from "./graphOps";
import { SourceKinds } from "./sheets";
import Logo from "./Logo";

const sourceLabel = (source) => {
  switch (source.kind) {
    case SourceKinds.sheet:
      return "Google Sheet";
    case SourceKinds.proxy:
      return "Sheet proxy";
    case SourceKinds.example:
      return "Example";
    default:
      return "Local graph";
  }
};

export default function Header({ source, graph, editing, setEditing }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const jump = (e) => {
    e.preventDefault();
    if (!graph) return;
    const node =
      findNodeByTitle(graph, query) ||
      graph.nodes.find(({ title }) =>
        title.toLowerCase().includes(query.trim().toLowerCase())
      );
    if (node) {
      navigate(`/node/${node.id}`);
      setQuery("");
    }
  };

  return (
    <header className="header">
      <Link to="/" className="brand">
        <Logo />
        <span>Visual inference</span>
      </Link>
      <Link to="/settings" className="chip" title="Change the data source">
        {sourceLabel(source)}
        {graph ? ` · ${graph.nodes.length} nodes` : ""}
      </Link>
      <div className="header-spacer" />
      <form className="search" onSubmit={jump} role="search">
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="7" cy="7" r="5" />
          <path d="M11 11l3.5 3.5" />
        </svg>
        <input
          list="node-titles"
          placeholder="Jump to a node…"
          aria-label="Jump to a node"
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            // Picking an option from the datalist navigates immediately.
            const match = graph && graph.nodes.find(({ title }) => title === value);
            if (match && e.nativeEvent.inputType !== "insertText") {
              navigate(`/node/${match.id}`);
              setQuery("");
            }
          }}
        />
        <datalist id="node-titles">
          {(graph?.nodes || []).map(({ id, title }) => (
            <option key={id} value={title} />
          ))}
        </datalist>
      </form>
      <button
        type="button"
        className={`button ${editing ? "button-primary" : ""}`}
        aria-pressed={editing}
        onClick={() => setEditing(!editing)}
      >
        {editing ? "Done editing" : "Edit graph"}
      </button>
      <Link to="/settings" className="button button-icon" aria-label="Data source settings">
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path d="M3 5h12M3 9h12M3 13h12" />
          <circle cx="6" cy="5" r="1.6" className="fill-surface" />
          <circle cx="12" cy="9" r="1.6" className="fill-surface" />
          <circle cx="8" cy="13" r="1.6" className="fill-surface" />
        </svg>
      </Link>
    </header>
  );
}
