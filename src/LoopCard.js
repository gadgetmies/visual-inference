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

function verdict(type, start, final) {
  switch (type) {
    case LoopTypes.circular:
      return `Each claim rests only on the others: nothing outside the loop supports ${start}.`;
    case LoopTypes.reinforcing:
      return `Starting from more ${start}, the chain comes back to more ${start}: every round amplifies the change, as a virtuous or vicious circle.`;
    case LoopTypes.balancing:
      return `Starting from more ${start}, the chain comes back to less ${start}: the loop pushes back against the change.`;
    default:
      return final === Change.unknown
        ? "Some links don’t say whether they work in the same or the opposite direction, so the outcome is unknown."
        : "";
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
        {verdict(type, title(shown.nodes[0]), changes[steps])}
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
