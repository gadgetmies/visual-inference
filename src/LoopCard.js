import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { findNode } from "./graphOps";
import { Change, classifyLoop, LoopTypes, rotateLoop, traceLoop } from "./loopAnalysis";
import LoopBadge from "./LoopBadge";
import { Evidence } from "./Relation";

const changeSymbol = { [Change.up]: "▲", [Change.down]: "▼", [Change.unknown]: "?" };
const changeWord = { [Change.up]: "more", [Change.down]: "less", [Change.unknown]: "unknown" };
const changeClass = { [Change.up]: "up", [Change.down]: "down", [Change.unknown]: "unknown" };

function NodeChip({ id, title, change, isArgument, isReturn }) {
  return (
    <Link
      to={`/node/${id}`}
      className={`loop-node ${isReturn ? "loop-node-return" : ""} ${
        isArgument ? "" : `loop-node-${changeClass[change]}`
      }`}
      aria-label={isArgument ? title : `${changeWord[change]} ${title}`}
    >
      {isReturn ? "↺ " : null}
      {isArgument ? null : (
        <span className="loop-change" aria-hidden="true">
          {changeSymbol[change]} {changeWord[change]}
        </span>
      )}
      {title}
    </Link>
  );
}

const listText = (items) =>
  items.length <= 1
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

// A sentence specific to this loop: which nodes the change passes through and
// how it comes back.
function verdict(type, shown, changes, title) {
  const start = title(shown.nodes[0]);
  const steps = shown.nodes.length;
  const final = changes[steps];
  const middle = shown.nodes
    .slice(1)
    .map((id, i) => `${changeWord[changes[i + 1]]} ${title(id)}`);
  const through = middle.length ? `through ${listText(middle)}` : "directly";

  switch (type) {
    case LoopTypes.circular:
      return `${listText(shown.nodes.map(title))} only support each other: nothing outside this loop backs them up.`;
    case LoopTypes.reinforcing:
      return `More ${start} leads ${through}, back to more ${start}. The change feeds itself.`;
    case LoopTypes.balancing:
      return `More ${start} leads ${through}, back to less ${start}. The loop holds ${start} back.`;
    default: {
      const gap = shown.connections.findIndex((c) => c.polarity !== "+" && c.polarity !== "-");
      const from = title(shown.nodes[gap]);
      const to = title(shown.nodes[(gap + 1) % steps]);
      return final === Change.unknown
        ? `The link from ${from} to ${to} doesn’t say whether it works in the same or the opposite direction, so it is unknown how this loop behaves.`
        : "";
    }
  }
}

function stepSentence(from, to, fromChange, toChange, connection) {
  if (connection.kind === "argument") return `${from} is a reason to believe ${to}.`;
  if (fromChange === Change.unknown || toChange === Change.unknown)
    return `${from} affects ${to}, but the direction is not given.`;
  return `${changeWord[fromChange][0].toUpperCase()}${changeWord[fromChange].slice(1)} ${from} means ${changeWord[toChange]} ${to}.`;
}

export default function LoopCard({ graph, loop, startId, highlighted = false, onToggle }) {
  const [explained, setExplained] = useState(false);
  const shown = startId === undefined ? loop : rotateLoop(loop, startId);
  const title = (id) => findNode(graph, id)?.title || "?";
  const steps = shown.nodes.length;
  const type = classifyLoop(loop);
  const isArgument = type === LoopTypes.circular;
  const changes = traceLoop(shown);
  const unsupported = shown.connections.filter((c) => !c.evidence).length;
  const ids = [...shown.nodes, shown.nodes[0]];

  return (
    <li className={`loop-card ${highlighted ? "loop-card-highlighted" : ""}`}>
      <div className="loop-card-head">
        <LoopBadge type={type} />
        <span className="loop-card-length">
          {steps === 1 ? "Leads to itself" : `${steps} steps`}
        </span>
        {unsupported ? (
          <span
            className="loop-card-unsupported"
            title="A loop is only as strong as its weakest link."
          >
            {unsupported === steps
              ? "No link cites evidence"
              : `${unsupported} of ${steps} links cite no evidence`}
          </span>
        ) : (
          <span className="loop-card-supported">Every link cites evidence</span>
        )}
        <span className="loop-card-actions">
          <button
            type="button"
            className="button button-small button-ghost"
            aria-expanded={explained}
            onClick={() => setExplained(!explained)}
          >
            {explained ? "Hide reasoning" : "Show reasoning"}
          </button>
          {onToggle ? (
            <button
              type="button"
              className="button button-small button-ghost"
              aria-pressed={highlighted}
              onClick={onToggle}
            >
              {highlighted ? "Hide in graph" : "Show in graph"}
            </button>
          ) : null}
        </span>
      </div>

      <p className="loop-path">
        {shown.nodes.map((id, index) => (
          <Fragment key={index}>
            <NodeChip id={id} title={title(id)} change={changes[index]} isArgument={isArgument} />
            <span
              className={`loop-step ${isArgument ? "loop-step-argument" : ""}`}
              aria-hidden="true"
            >
              {isArgument ? "supports" : "→"}
            </span>
          </Fragment>
        ))}
        <NodeChip
          id={shown.nodes[0]}
          title={title(shown.nodes[0])}
          change={changes[steps]}
          isArgument={isArgument}
          isReturn
        />
      </p>

      <p className={`loop-verdict loop-verdict-${type}`}>
        {verdict(type, shown, changes, title)}
      </p>

      {explained ? (
        <ol className="loop-steps">
          {shown.connections.map((connection, index) => {
            const from = title(ids[index]);
            const to = title(ids[index + 1]);
            return (
              <li key={index} className="loop-explain">
                <p className="loop-explain-claim">
                  {stepSentence(from, to, changes[index], changes[index + 1], connection)}
                </p>
                {connection.description ? (
                  <p className="loop-explain-reason">{connection.description}</p>
                ) : (
                  <p className="detail-missing">No reasoning given for this link.</p>
                )}
                {connection.evidence ? (
                  <Evidence evidence={connection.evidence} />
                ) : (
                  <p className="detail-missing">No evidence given.</p>
                )}
              </li>
            );
          })}
        </ol>
      ) : null}
    </li>
  );
}
