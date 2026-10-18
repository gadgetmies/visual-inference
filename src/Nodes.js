import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addNode, causesOf, effectsOf, findNodeByTitle } from "./graphOps";
import OverviewTabs from "./OverviewTabs";
import { loopsThrough } from "./loopAnalysis";

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default function Overview({ graph, loops, editing, updateGraph, setEditing }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const [newTitle, setNewTitle] = useState("");

  const nodes = graph.nodes
    .filter(({ title }) => title.toLowerCase().includes(filter.trim().toLowerCase()))
    .sort((a, b) => a.title.localeCompare(b.title));

  const create = (e) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    const existing = findNodeByTitle(graph, title);
    if (existing) {
      navigate(`/node/${existing.id}`);
      return;
    }
    let created;
    updateGraph((g) => {
      const [next, node] = addNode(g, title);
      created = node;
      return next;
    });
    setNewTitle("");
    if (created) navigate(`/node/${created.id}`);
  };

  return (
    <main className="overview">
      <div className="overview-head">
        <div>
          <h1>All nodes</h1>
          <p className="muted">
            {plural(graph.nodes.length, "node")} ·{" "}
            {plural(graph.connections.length, "connection")}. Pick one to see what
            causes it and what it leads to.
          </p>
        </div>
        <OverviewTabs graph={graph} loopCount={loops.loops.length} />
        <label className="field overview-filter">
          <span className="visually-hidden">Filter nodes</span>
          <input
            placeholder="Filter…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </label>
      </div>

      {editing ? (
        <form className="card add-node" onSubmit={create}>
          <label className="field">
            New node
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="E.g. Customer satisfaction"
            />
          </label>
          <button type="submit" className="button button-primary">
            Add node
          </button>
        </form>
      ) : null}

      {graph.nodes.length === 0 ? (
        <div className="empty">
          <h2>This graph is empty</h2>
          <p className="muted">Add a node to get started.</p>
          {!editing ? (
            <button type="button" className="button button-primary" onClick={() => setEditing(true)}>
              Edit graph
            </button>
          ) : null}
        </div>
      ) : (
        <ul className="node-grid">
          {nodes.map(({ id, title }) => {
            const causes = causesOf(graph, id).length;
            const effects = effectsOf(graph, id).length;
            const loopCount = loopsThrough(loops.loops, id).length;
            return (
              <li key={id}>
                <Link to={`/node/${id}`} className="node-card">
                  <span className="node-card-title">{title}</span>
                  <span className="node-card-meta">
                    <span className="tag tag-cause">{plural(causes, "cause")}</span>
                    <span className="tag tag-effect">{plural(effects, "effect")}</span>
                    {loopCount ? (
                      <span className="tag tag-loop">↺ {plural(loopCount, "loop")}</span>
                    ) : null}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
