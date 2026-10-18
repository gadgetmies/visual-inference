import { NavLink } from "react-router-dom";

export default function OverviewTabs({ graph, loopCount }) {
  return (
    <nav className="segmented overview-tabs" aria-label="Overview">
      <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
        Nodes <span className="count">{graph.nodes.length}</span>
      </NavLink>
      <NavLink to="/loops" className={({ isActive }) => (isActive ? "active" : "")}>
        Loops <span className="count">{loopCount}</span>
      </NavLink>
    </nav>
  );
}
