import NodeLink from "./NodeLink";
import Connection from "./Connection";

export const Directions = {
  sources: -1,
  targets: 1,
};

export default function Related({
  graph,
  nodeId,
  levels = 1,
  direction = Directions.sources,
}) {
  const relatedNodes = graph.connections
    .filter(
      ({ target, source }) =>
        (direction === Directions.sources ? target : source) === nodeId
    )
    .map((connection) => ({
      node: graph.nodes.find(
        ({ id }) =>
          id ===
          (direction === Directions.targets
            ? connection.target
            : connection.source)
      ),
      description: connection.description,
    }));

  return relatedNodes.map(({ description, node: { id, title } }) => (
    <div
      key={id}
      style={{
        display: "flex",
        flexDirection: direction === Directions.sources ? "row-reverse" : "row",
      }}
    >
      <Connection
        info={description}
        direction={direction === Directions.targets ? "left" : "right"}
      />
      <NodeLink key={id} id={id} title={title} style={{ flex: 1 }} />
      {levels > 1 ? (
        <div style={{ flex: 1 }}>
          <Related
            graph={graph}
            direction={direction}
            levels={levels - 1}
            nodeId={id}
          />
        </div>
      ) : null}
    </div>
  ));
}
