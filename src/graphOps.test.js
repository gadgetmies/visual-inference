import {
  addConnection,
  addNode,
  deleteNode,
  emptyGraph,
  removeConnection,
  renameNode,
  updateConnection,
} from "./graphOps";

test("edits a graph immutably", () => {
  let [g, a] = addNode(emptyGraph, " A ");
  let b;
  [g, b] = addNode(g, "B");
  expect(a).toEqual({ id: 0, title: "A" });
  expect(b.id).toBe(1);

  g = addConnection(g, a.id, b.id);
  expect(addConnection(g, a.id, b.id)).toBe(g);
  expect(addConnection(g, a.id, a.id)).toBe(g);

  g = updateConnection(g, a.id, b.id, { description: "because", polarity: "-" });
  expect(g.connections).toEqual([
    { source: 0, target: 1, description: "because", polarity: "-", kind: "cause" },
  ]);

  g = renameNode(g, b.id, "Bee");
  expect(g.nodes[1].title).toBe("Bee");

  expect(removeConnection(g, a.id, b.id).connections).toEqual([]);
  expect(deleteNode(g, a.id)).toEqual({ nodes: [{ id: 1, title: "Bee" }], connections: [] });
  expect(emptyGraph.nodes).toEqual([]);
});
