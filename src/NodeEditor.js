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
  isArgument,
  removeConnection,
  renameNode,
  updateConnection,
} from "./graphOps";
import { hasPath } from "./loopAnalysis";

const kindOptions = [
  { value: "cause", label: "Causes", title: "A real-world cause and effect" },
  { value: "argument", label: "Is a reason for", title: "A reason to believe the other claim" },
];

function KindPicker({ value, onChange }) {
  return (
    <div className="polarity-picker kind-picker" role="radiogroup" aria-label="Kind of link">
      {kindOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          title={option.title}
          className={value === option.value ? "active" : ""}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// What adding a link from → to would do: close a circular argument, close a
// loop, or nothing special.
function loopWarning(graph, from, to, argument) {
  if (argument && hasPath(graph, to, from, isArgument)) {
    return { circular: true, text: "This closes a circular argument: the claims would only support each other." };
  }
  if (hasPath(graph, to, from)) return { circular: false, text: "↺ This closes a loop." };
  return null;
}

const polarityOptions = [
  { value: "+", label: "+ Same", title: "More of the cause means more of the effect" },
  { value: "-", label: "− Opposite", title: "More of the cause means less of the effect" },
  { value: "", label: "Unknown", title: "Direction of the effect not specified" },
];

function PolarityPicker({ value, onChange }) {
  return (
    <div className="polarity-picker" role="radiogroup" aria-label="Direction of the effect">
      {polarityOptions.map((option) => (
        <button
          key={option.value || "unknown"}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          title={option.title}
          className={value === option.value ? "active" : ""}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ConnectionEditor({ graph, connection, otherId, updateGraph }) {
  const other = findNode(graph, otherId);
  const { source, target } = connection;
  const circular = isArgument(connection) && hasPath(graph, target, source, isArgument);
  return (
    <li className={`connection-editor ${circular ? "connection-editor-circular" : ""}`}>
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
      <KindPicker
        value={connection.kind || "cause"}
        onChange={(kind) => updateGraph((g) => updateConnection(g, source, target, { kind }))}
      />
      {isArgument(connection) ? null : (
        <PolarityPicker
          value={connection.polarity || ""}
          onChange={(polarity) =>
            updateGraph((g) => updateConnection(g, source, target, { polarity }))
          }
        />
      )}
      {circular ? (
        <p className="editor-warning" role="status">
          Part of circular reasoning: through other arguments, this claim ends up
          supporting itself.
        </p>
      ) : null}
      <textarea
        aria-label={`Reasoning for ${other?.title}`}
        placeholder="Reasoning: why does this lead to that?"
        value={connection.description || ""}
        onChange={(e) =>
          updateGraph((g) =>
            updateConnection(g, source, target, { description: e.target.value })
          )
        }
      />
      <textarea
        className="evidence-input"
        aria-label={`Evidence for ${other?.title}`}
        placeholder="Evidence: links or sources, one per line"
        value={connection.evidence || ""}
        onChange={(e) =>
          updateGraph((g) => updateConnection(g, source, target, { evidence: e.target.value }))
        }
      />
    </li>
  );
}

function AddConnection({ graph, node, isCause, updateGraph }) {
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("cause");
  const listId = `add-${isCause ? "cause" : "effect"}-options`;
  const existing = new Set(
    (isCause ? causesOf(graph, node.id) : effectsOf(graph, node.id)).map((c) =>
      isCause ? c.source : c.target
    )
  );
  const options = graph.nodes.filter(({ id }) => id !== node.id && !existing.has(id));
  const match = title.trim() ? findNodeByTitle(graph, title) : null;
  const warning =
    match && match.id !== node.id
      ? isCause
        ? loopWarning(graph, match.id, node.id, kind === "argument")
        : loopWarning(graph, node.id, match.id, kind === "argument")
      : null;

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    updateGraph((g) => {
      let other = findNodeByTitle(g, title);
      let next = g;
      if (!other) [next, other] = addNode(g, title);
      return isCause
        ? addConnection(next, other.id, node.id, { kind })
        : addConnection(next, node.id, other.id, { kind });
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
      {title.trim() ? <KindPicker value={kind} onChange={setKind} /> : null}
      {warning ? (
        <p className={warning.circular ? "editor-warning" : "editor-note"} role="status">
          {warning.text}
        </p>
      ) : null}
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
