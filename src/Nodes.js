import { Link } from "react-router-dom";

export default function Nodes({ graph: { nodes } }) {
  return (
    <div>
      {nodes.map(({ id, title }) => (
        <Link key={id} to={`/${id}`} className="node">
          {title}
        </Link>
      ))}
    </div>
  );
}
