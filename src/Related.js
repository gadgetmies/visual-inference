import NodeLink from "./NodeLink";
import { findNode } from "./graphOps";

export const Directions = {
  sources: -1,
  targets: 1,
};

export default function Related({
  graph,
  nodeId,
  parentKey = "focus",
  focusId,
  highlight = null,
  levels = 1,
  depth = 0,
  direction = Directions.sources,
}) {
  const isSources = direction === Directions.sources;
  const parentTitle = findNode(graph, nodeId)?.title || "";
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
        const highlighted = Boolean(highlight?.has(`${connection.source}>${connection.target}`));
        // Following the chain arrived back at the focused node: a loop.
        const returnsHere = id === focusId;
        const key = `${parentKey}/${isSources ? "c" : "e"}${id}`;
        return (
          <div
            key={id}
            className={`related-row ${isSources ? "related-sources" : "related-targets"}`}
          >
            <NodeLink
              id={id}
              title={title}
              connection={connection}
              from={isSources ? title : parentTitle}
              to={isSources ? parentTitle : title}
              compact={depth > 0}
              highlighted={highlighted}
              returnsHere={returnsHere}
              anchor={{
                "data-node-key": key,
                "data-parent-key": parentKey,
                "data-side": isSources ? "cause" : "effect",
                "data-polarity": connection.polarity || "",
                "data-kind": connection.kind || "cause",
                "data-highlighted": highlighted,
              }}
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
                    parentKey={key}
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
