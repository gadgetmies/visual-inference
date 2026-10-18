import { Fragment } from "react";
import { Link } from "react-router-dom";
import { findNode } from "./graphOps";
import { rotateLoop } from "./loopAnalysis";

export default function LoopCard({ graph, loop, startId, highlighted = false, onToggle }) {
  const shown = startId === undefined ? loop : rotateLoop(loop, startId);
  const title = (id) => findNode(graph, id)?.title || "?";
  const steps = shown.nodes.length;

  return (
    <li className={`loop-card ${highlighted ? "loop-card-highlighted" : ""}`}>
      <div className="loop-card-head">
        <span className="loop-card-length">
          {steps === 1 ? "Leads to itself" : `${steps} steps`}
        </span>
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
            <span className="loop-step" aria-label="leads to">
              →
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
