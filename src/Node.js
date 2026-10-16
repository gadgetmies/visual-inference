import { Link, useParams } from "react-router-dom";
import Related, { Directions } from "./Related";
import NodeEditor from "./NodeEditor";
import { causesOf, effectsOf, findNode } from "./graphOps";

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default function Node({
  graph,
  editing,
  updateGraph,
  sourceLevels = 1,
  targetLevels = 1,
}) {
  const params = useParams();
  const nodeId = parseInt(params.nodeId, 10);
  const node = findNode(graph, nodeId);

  if (!node) {
    return (
      <main className="empty">
        <h2>Node not found</h2>
        <p className="muted">It may have been removed from the graph.</p>
        <Link to="/" className="button">
          Back to all nodes
        </Link>
      </main>
    );
  }

  const causes = causesOf(graph, nodeId).length;
  const effects = effectsOf(graph, nodeId).length;

  return (
    <main className={`node-view ${editing ? "node-view-editing" : ""}`}>
      <div className="node-graph">
        <section className="column column-causes" aria-label="Causes">
          <h2 className="column-label label-cause">Causes</h2>
          {causes ? (
            <Related
              nodeId={nodeId}
              levels={sourceLevels}
              direction={Directions.sources}
              graph={graph}
            />
          ) : (
            <p className="column-empty">No known causes</p>
          )}
        </section>
        <section className="column column-focus" aria-label="Selected node">
          <h2 className="column-label">Focus</h2>
          <div className="focus-card">
            <h1>{node.title}</h1>
            <p>
              {plural(causes, "cause")} · {plural(effects, "effect")}
            </p>
          </div>
        </section>
        <section className="column column-effects" aria-label="Effects">
          <h2 className="column-label label-effect">Effects</h2>
          {effects ? (
            <Related
              nodeId={nodeId}
              levels={targetLevels}
              direction={Directions.targets}
              graph={graph}
            />
          ) : (
            <p className="column-empty">No known effects</p>
          )}
        </section>
      </div>
      {editing ? (
        <NodeEditor key={node.id} graph={graph} node={node} updateGraph={updateGraph} />
      ) : null}
    </main>
  );
}
