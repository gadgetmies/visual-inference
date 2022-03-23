import { useNavigate, useParams } from "react-router-dom";
import * as R from "ramda";
import Related, { Directions } from "./Related";
import { useEffect } from "react";

export default function Node({ graph, sourceLevels = 1, targetLevels = 1 }) {
  const params = useParams();
  const navigate = useNavigate();

  if (graph.nodes.length === 0) {
    console.log("navigating");
    navigate("/");
    return "Loading..."
  }

  const nodeId = parseInt(params?.nodeId, 10);
  const node = graph.nodes.find(R.propEq("id", nodeId || 0));

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Related
          nodeId={nodeId}
          levels={sourceLevels}
          direction={Directions.sources}
          graph={graph}
        />
      </div>
      <div
        style={{ flex: 0, display: "flex", position: "relative" }}
        id={`node-${node.id}`}
      >
        <div className="node" style={{ minWidth: "10em" }}>
          <span>{node.title}</span>
        </div>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Related
          nodeId={nodeId}
          levels={targetLevels}
          direction={Directions.targets}
          graph={graph}
        />
      </div>
    </div>
  );
}
