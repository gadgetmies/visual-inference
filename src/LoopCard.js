import { Fragment } from "react";
import { Link } from "react-router-dom";
import { findNode } from "./graphOps";
import { classifyLoop, rotateLoop } from "./loopAnalysis";
import LoopBadge from "./LoopBadge";

const signLabel = { "+": "+", "-": "−" };
const signName = { "+": "same direction", "-": "opposite direction" };

export default function LoopCard({ graph, loop, startId, highlighted = false, onToggle }) {
  const shown = startId === undefined ? loop : rotateLoop(loop, startId);
  const title = (id) => findNode(graph, id)?.title || "?";
  const steps = shown.nodes.length;
  const unsupported = shown.connections.filter((c) => !c.evidence).length;

  return (
    <li className={`loop-card ${highlighted ? "loop-card-highlighted" : ""}`}>
      <div className="loop-card-head">
        <LoopBadge type={classifyLoop(loop)} />
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
      </div>
      <p className="loop-path">
        {shown.nodes.map((id, index) => (
          <Fragment key={index}>
            <Link to={`/node/${id}`} className="loop-node">
              {title(id)}
            </Link>
            <span
              className={`loop-step loop-step-${shown.connections[index].polarity || "unknown"} ${
                shown.connections[index].kind === "argument" ? "loop-step-argument" : ""
              }`}
              aria-label={
                shown.connections[index].kind === "argument"
                  ? "is a reason to believe"
                  : `leads to (${signName[shown.connections[index].polarity] || "direction unknown"})`
              }
            >
              {shown.connections[index].kind === "argument" ? "supports" : "→"}
              {shown.connections[index].kind !== "argument" &&
              signLabel[shown.connections[index].polarity] ? (
                <span className="loop-step-sign">
                  {signLabel[shown.connections[index].polarity]}
                </span>
              ) : null}
            </span>
          </Fragment>
        ))}
        <Link to={`/node/${shown.nodes[0]}`} className="loop-node loop-node-return">
          ↺ {title(shown.nodes[0])}
        </Link>
      </p>
    </li>
  );
}
