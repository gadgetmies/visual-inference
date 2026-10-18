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
  focusId,
  highlight = null,
  levels = 1,
  depth = 0,
  direction = Directions.sources,
}) {
  const isSources = direction === Directions.sources;
  const relatedNodes = graph.connections
    .filter(({ target, source }) => (isSources ? target : source) === nodeId)
    .map((connection) => ({
      node: findNode(graph, isSources ? connection.source : connection.target),
      connection,
    }))
    .filter(({ node }) => node);

  if (relatedNodes.length === 0) return null;

  return (
    <div className={`related related-depth-${depth}`}>
      {relatedNodes.map(({ connection, node: { id, title } }) => {
        const highlighted = highlight?.has(`${connection.source}>${connection.target}`);
        // Following the chain arrived back at the focused node: a loop.
        const returnsHere = id === focusId;
        return (
          <div
            key={id}
            className={`related-row ${isSources ? "related-sources" : "related-targets"}`}
          >
            <Connection isCause={isSources} connection={connection} highlighted={highlighted} />
            <NodeLink
              id={id}
              title={title}
              description={connection.description}
              compact={depth > 0}
              highlighted={highlighted}
              returnsHere={returnsHere}
            />
            {levels > 1 ? (
              <div className="related-nested">
                {returnsHere ? null : (
                  <Related
                    graph={graph}
                    direction={direction}
                    levels={levels - 1}
                    depth={depth + 1}
                    nodeId={id}
                    focusId={focusId}
                    highlight={highlight}
                  />
                )}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
