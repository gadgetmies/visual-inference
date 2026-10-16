import { Link } from "react-router-dom";

export default function NodeLink({ id, title, description, compact = false }) {
  return (
    <Link
      to={`/node/${id}`}
      className={`node-link ${compact ? "node-link-compact" : ""}`}
      title={description || undefined}
    >
      <span className="node-link-title">{title}</span>
      {description ? <span className="node-link-reason">{description}</span> : null}
    </Link>
  );
}
