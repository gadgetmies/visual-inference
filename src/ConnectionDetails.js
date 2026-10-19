import { Link } from "react-router-dom";
import Relation, { Evidence } from "./Relation";
import { causesOf, effectsOf, findNode } from "./graphOps";

function Detail({ graph, connection }) {
  const from = findNode(graph, connection.source)?.title || "?";
  const to = findNode(graph, connection.target)?.title || "?";
  return (
    <li className="detail">
      <Relation from={from} to={to} connection={connection} />
      {connection.description ? (
        <p className="detail-reason">{connection.description}</p>
      ) : (
        <p className="detail-missing">No reasoning given for this link.</p>
      )}
      {connection.evidence ? (
        <div className="detail-evidence">
          <span className="detail-label">Evidence</span>
          <Evidence evidence={connection.evidence} />
        </div>
      ) : (
        <p className="detail-missing">No evidence given.</p>
      )}
    </li>
  );
}

// Every direct link of the node with its claim, reasoning and evidence: the
// argument behind the arrows.
export default function ConnectionDetails({ graph, node }) {
  const causes = causesOf(graph, node.id);
  const effects = effectsOf(graph, node.id);
  const all = [...causes, ...effects];
  if (!all.length) return null;
  const withEvidence = all.filter((c) => c.evidence).length;

  return (
    <section className="details" aria-labelledby="details-title">
      <div className="details-head">
        <h2 id="details-title">How it connects</h2>
        <p className="muted">
          The claim behind each arrow, why it should hold, and what supports it.{" "}
          {withEvidence} of {all.length} links cite evidence.
        </p>
      </div>
      <div className="details-columns">
        {[
          ["Causes", "label-cause", causes],
          ["Effects", "label-effect", effects],
        ].map(([label, className, list]) =>
          list.length ? (
            <div key={label}>
              <h3 className={`column-label ${className}`}>{label}</h3>
              <ul className="detail-list">
                {list.map((c) => (
                  <Detail key={`${c.source}>${c.target}`} graph={graph} connection={c} />
                ))}
              </ul>
            </div>
          ) : null
        )}
      </div>
      <p className="details-legend muted">
        ▲ more, ▼ less. <Link to="/loops">Loops</Link> show where chains of these
        links come back around.
      </p>
    </section>
  );
}
