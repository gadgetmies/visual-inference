import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Related, { Directions } from "./Related";
import NodeEditor from "./NodeEditor";
import LoopCard from "./LoopCard";
import { causesOf, effectsOf, findNode } from "./graphOps";
import { loopKey, loopsThrough } from "./loopAnalysis";

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default function Node({
  graph,
  loops,
  editing,
  updateGraph,
  sourceLevels = 1,
  targetLevels = 1,
}) {
  const params = useParams();
  const nodeId = parseInt(params.nodeId, 10);
  const node = findNode(graph, nodeId);
  const [highlightedKey, setHighlightedKey] = useState(null);

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
  const nodeLoops = loopsThrough(loops.loops, nodeId);
  const highlighted = nodeLoops.find((loop) => loopKey(loop) === highlightedKey);
  const highlight = highlighted
    ? new Set(highlighted.connections.map((c) => `${c.source}>${c.target}`))
    : null;

  const related = (direction, levels) => (
    <Related
      nodeId={nodeId}
      focusId={nodeId}
      levels={levels}
      direction={direction}
      graph={graph}
      highlight={highlight}
    />
  );

  return (
    <main className={`node-view ${editing ? "node-view-editing" : ""}`}>
      <div className="node-main">
        <div className="node-graph">
          <section className="column column-causes" aria-label="Causes">
            <h2 className="column-label label-cause">Causes</h2>
            {causes ? (
              related(Directions.sources, sourceLevels)
            ) : (
              <p className="column-empty">No known causes</p>
            )}
          </section>
          <section className="column column-focus" aria-label="Selected node">
            <h2 className="column-label">Focus</h2>
            <div className={`focus-card ${highlight ? "focus-card-highlighted" : ""}`}>
              <h1>{node.title}</h1>
              <p>
                {plural(causes, "cause")} · {plural(effects, "effect")}
                {nodeLoops.length ? ` · ↺ ${plural(nodeLoops.length, "loop")}` : ""}
              </p>
            </div>
          </section>
          <section className="column column-effects" aria-label="Effects">
            <h2 className="column-label label-effect">Effects</h2>
            {effects ? (
              related(Directions.targets, targetLevels)
            ) : (
              <p className="column-empty">No known effects</p>
            )}
          </section>
        </div>

        {nodeLoops.length ? (
          <section className="node-loops" aria-labelledby="node-loops-title">
            <h2 id="node-loops-title">Loops through this node</h2>
            <p className="muted">
              Chains of effects that lead from {node.title} back to itself.
            </p>
            <ul className="loop-list">
              {nodeLoops.map((loop) => {
                const key = loopKey(loop);
                return (
                  <LoopCard
                    key={key}
                    graph={graph}
                    loop={loop}
                    startId={nodeId}
                    highlighted={key === highlightedKey}
                    onToggle={() => setHighlightedKey(key === highlightedKey ? null : key)}
                  />
                );
              })}
            </ul>
          </section>
        ) : null}
      </div>
      {editing ? (
        <NodeEditor key={node.id} graph={graph} node={node} updateGraph={updateGraph} />
      ) : null}
    </main>
  );
}
