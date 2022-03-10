import { Link } from "react-router-dom";

export default function NodeLink({
  id,
  title,
  style
}) {
  return (
    <div key={id} className="node" id={`node-${id}`} style={style}>
      <Link to={`/${id}`}>{title}</Link>
    </div>
  );
}
