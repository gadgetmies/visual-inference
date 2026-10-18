import { Link } from "react-router-dom";

export default function NodeLink({
  id,
  title,
  description,
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
  return (
    <Link to={`/node/${id}`} className={classes} title={description || undefined}>
      {returnsHere ? <span className="node-link-loop">↺ Back to the start</span> : null}
      <span className="node-link-title">{title}</span>
      {description ? <span className="node-link-reason">{description}</span> : null}
    </Link>
  );
}
