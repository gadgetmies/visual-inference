// Pure helpers for editing a graph. Every function returns a new graph.

export const isArgument = (connection) => connection.kind === "argument";

export const emptyGraph = { nodes: [], connections: [] };

const nextId = (nodes) => nodes.reduce((max, { id }) => Math.max(max, id), -1) + 1;

export const findNode = (graph, id) => graph.nodes.find((node) => node.id === id);

export const findNodeByTitle = (graph, title) => {
  const normalized = title.trim().toLowerCase();
  return graph.nodes.find((node) => node.title.trim().toLowerCase() === normalized);
};

export function addNode(graph, title) {
  const node = { id: nextId(graph.nodes), title: title.trim() };
  return [{ ...graph, nodes: [...graph.nodes, node] }, node];
}

export function renameNode(graph, id, title) {
  return {
    ...graph,
    nodes: graph.nodes.map((node) => (node.id === id ? { ...node, title } : node)),
  };
}

export function deleteNode(graph, id) {
  return {
    nodes: graph.nodes.filter((node) => node.id !== id),
    connections: graph.connections.filter(
      ({ source, target }) => source !== id && target !== id
    ),
  };
}

export const hasConnection = (graph, source, target) =>
  graph.connections.some((c) => c.source === source && c.target === target);

export function addConnection(graph, source, target, fields = {}) {
  if (source === target || hasConnection(graph, source, target)) return graph;
  return {
    ...graph,
    connections: [
      ...graph.connections,
      { description: "", polarity: "", kind: "cause", evidence: "", ...fields, source, target },
    ],
  };
}

// `changes` is an object of fields to set, e.g. { description } or { polarity }.
export function updateConnection(graph, source, target, changes) {
  return {
    ...graph,
    connections: graph.connections.map((c) =>
      c.source === source && c.target === target ? { ...c, ...changes } : c
    ),
  };
}

export function removeConnection(graph, source, target) {
  return {
    ...graph,
    connections: graph.connections.filter(
      (c) => !(c.source === source && c.target === target)
    ),
  };
}

export const causesOf = (graph, id) =>
  graph.connections.filter(({ target }) => target === id);

export const effectsOf = (graph, id) =>
  graph.connections.filter(({ source }) => source === id);

export function isValidGraph(value) {
  return (
    value &&
    Array.isArray(value.nodes) &&
    Array.isArray(value.connections) &&
    value.nodes.every((n) => Number.isInteger(n.id) && typeof n.title === "string") &&
    value.connections.every(
      (c) => Number.isInteger(c.source) && Number.isInteger(c.target)
    )
  );
}
