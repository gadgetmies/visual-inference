import { Link } from "react-router-dom";
import Relation from "./Relation";

// One card in the cause/effect columns. `anchor` holds the data attributes
// the connector layer uses to draw the arrow to the card it links to.
export default function NodeLink({
  id,
  title,
  connection,
  from,
  to,
  anchor,
  compact = false,
  highlighted = false,
  returnsHere = false,
}) {
  const classes = [
    "node-link",
    compact ? "node-link-compact" : "",
    highlighted ? "node-link-highlighted" : "",
    returnsHere ? "node-link-return" : "",
  ].join(" ");
  const unsupported = !connection.description && !connection.evidence;
  return (
    <Link
      to={`/node/${id}`}
      className={classes}
      title={connection.description || undefined}
      {...anchor}
    >
      {returnsHere ? <span className="node-link-loop">↺ Back to the start</span> : null}
      <span className="node-link-title">{title}</span>
      <Relation from={from} to={to} connection={connection} compact words={!compact} />
      {connection.description ? (
        <span className="node-link-reason">{connection.description}</span>
      ) : null}
      {!compact && unsupported ? (
        <span className="node-link-unsupported">No reasoning or evidence given</span>
      ) : null}
      {!compact && connection.evidence ? (
        <span className="node-link-evidence">Evidence given</span>
      ) : null}
    </Link>
  );
}
