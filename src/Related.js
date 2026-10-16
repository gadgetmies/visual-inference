import NodeLink from "./NodeLink";
import Connection from "./Connection";
import { findNode } from "./graphOps";

export const Directions = {
  sources: -1,
  targets: 1,
};

export default function Related({
  graph,
  nodeId,
  levels = 1,
  depth = 0,
  direction = Directions.sources,
}) {
  const isSources = direction === Directions.sources;
  const relatedNodes = graph.connections
    .filter(({ target, source }) => (isSources ? target : source) === nodeId)
    .map((connection) => ({
      node: findNode(graph, isSources ? connection.source : connection.target),
      description: connection.description,
    }))
    .filter(({ node }) => node);

  if (relatedNodes.length === 0) return null;

  return (
    <div className={`related related-depth-${depth}`}>
      {relatedNodes.map(({ description, node: { id, title } }) => (
        <div
          key={id}
          className={`related-row ${isSources ? "related-sources" : "related-targets"}`}
        >
          <Connection isCause={isSources} />
          <NodeLink id={id} title={title} description={description} compact={depth > 0} />
          {levels > 1 ? (
            <div className="related-nested">
              <Related
                graph={graph}
                direction={direction}
                levels={levels - 1}
                depth={depth + 1}
                nodeId={id}
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
