import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  addConnection,
  addNode,
  causesOf,
  deleteNode,
  effectsOf,
  findNode,
  findNodeByTitle,
  removeConnection,
  renameNode,
  updateConnection,
} from "./graphOps";

function ConnectionEditor({ graph, connection, otherId, updateGraph }) {
  const other = findNode(graph, otherId);
  const { source, target } = connection;
  return (
    <li className="connection-editor">
      <div className="connection-editor-head">
        <Link to={`/node/${otherId}`}>{other?.title}</Link>
        <button
          type="button"
          className="button button-small button-ghost"
          onClick={() => updateGraph((g) => removeConnection(g, source, target))}
          aria-label={`Remove connection with ${other?.title}`}
        >
          Remove
        </button>
      </div>
      <textarea
        aria-label={`Reasoning for ${other?.title}`}
        placeholder="Why does this lead to that? (optional)"
        value={connection.description || ""}
        onChange={(e) =>
          updateGraph((g) => updateConnection(g, source, target, e.target.value))
        }
      />
    </li>
  );
}

function AddConnection({ graph, node, isCause, updateGraph }) {
  const [title, setTitle] = useState("");
  const listId = `add-${isCause ? "cause" : "effect"}-options`;
  const existing = new Set(
    (isCause ? causesOf(graph, node.id) : effectsOf(graph, node.id)).map((c) =>
      isCause ? c.source : c.target
    )
  );
  const options = graph.nodes.filter(({ id }) => id !== node.id && !existing.has(id));
  const match = title.trim() ? findNodeByTitle(graph, title) : null;

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    updateGraph((g) => {
      let other = findNodeByTitle(g, title);
      let next = g;
      if (!other) [next, other] = addNode(g, title);
      return isCause
        ? addConnection(next, other.id, node.id)
        : addConnection(next, node.id, other.id);
    });
    setTitle("");
  };

  return (
    <form className="add-connection" onSubmit={submit}>
      <label className="field field-small">
        {isCause ? "Add a cause" : "Add an effect"}
        <span className="add-connection-row">
          <input
            list={listId}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Search or create a node…"
          />
          <button type="submit" className="button" disabled={!title.trim() || match?.id === node.id}>
            {match ? "Add" : "Create"}
          </button>
        </span>
        <datalist id={listId}>
          {options.map(({ id, title }) => (
            <option key={id} value={title} />
          ))}
        </datalist>
      </label>
    </form>
  );
}

export default function NodeEditor({ graph, node, updateGraph }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState(node.title);
  const duplicate = findNodeByTitle(graph, title);
  const titleError = !title.trim()
    ? "The title can’t be empty."
    : duplicate && duplicate.id !== node.id
    ? "Another node already has this title."
    : null;

  const commitTitle = () => {
    if (!titleError && title.trim() !== node.title)
      updateGraph((g) => renameNode(g, node.id, title.trim()));
  };

  const causes = causesOf(graph, node.id);
  const effects = effectsOf(graph, node.id);

  return (
    <aside className="editor" aria-label="Edit node">
      <h2>Edit node</h2>
      <label className="field">
        Title
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={commitTitle}
          onKeyDown={(e) => e.key === "Enter" && commitTitle()}
          aria-invalid={Boolean(titleError)}
        />
        {titleError ? <span className="field-error">{titleError}</span> : null}
      </label>

      <section className="editor-section">
        <h3 className="column-label label-cause">Causes</h3>
        <ul className="connection-list">
          {causes.map((c) => (
            <ConnectionEditor
              key={`${c.source}-${c.target}`}
              graph={graph}
              connection={c}
              otherId={c.source}
              updateGraph={updateGraph}
            />
          ))}
        </ul>
        <AddConnection graph={graph} node={node} isCause updateGraph={updateGraph} />
      </section>

      <section className="editor-section">
        <h3 className="column-label label-effect">Effects</h3>
        <ul className="connection-list">
          {effects.map((c) => (
            <ConnectionEditor
              key={`${c.source}-${c.target}`}
              graph={graph}
              connection={c}
              otherId={c.target}
              updateGraph={updateGraph}
            />
          ))}
        </ul>
        <AddConnection graph={graph} node={node} isCause={false} updateGraph={updateGraph} />
      </section>

      <button
        type="button"
        className="button button-danger editor-delete"
        onClick={() => {
          if (window.confirm(`Delete “${node.title}” and all its connections?`)) {
            updateGraph((g) => deleteNode(g, node.id));
            navigate("/");
          }
        }}
      >
        Delete node
      </button>
    </aside>
  );
}
