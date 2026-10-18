// Finds feedback loops: paths of connections that lead back to where they started.

export const MAX_LOOP_LENGTH = 8;
export const MAX_LOOPS = 500;

// Every elementary cycle up to `maxLength` steps, each reported once. A cycle is
// found from its lowest-indexed node only, so rotations are not duplicated.
// Returns { loops, truncated } where each loop is { nodes, connections }.
export function findLoops(graph, { maxLength = MAX_LOOP_LENGTH, maxLoops = MAX_LOOPS } = {}) {
  const order = new Map(graph.nodes.map(({ id }, index) => [id, index]));
  const outgoing = new Map(graph.nodes.map(({ id }) => [id, []]));
  graph.connections.forEach((c) => {
    if (outgoing.has(c.source) && order.has(c.target)) outgoing.get(c.source).push(c);
  });

  const state = { loops: [], truncated: false };

  const visit = (start, nodeId, pathNodes, pathConnections, onPath) => {
    for (const connection of outgoing.get(nodeId)) {
      if (state.loops.length >= maxLoops) {
        state.truncated = true;
        return;
      }
      const next = connection.target;
      if (next === start) {
        state.loops.push({
          nodes: [...pathNodes],
          connections: [...pathConnections, connection],
        });
      } else if (
        order.get(next) > order.get(start) &&
        !onPath.has(next) &&
        pathNodes.length < maxLength
      ) {
        onPath.add(next);
        pathNodes.push(next);
        pathConnections.push(connection);
        visit(start, next, pathNodes, pathConnections, onPath);
        pathNodes.pop();
        pathConnections.pop();
        onPath.delete(next);
      }
    }
  };

  graph.nodes.forEach(({ id }) => visit(id, id, [id], [], new Set([id])));

  const { loops, truncated } = state;
  loops.sort((a, b) => a.nodes.length - b.nodes.length);
  return { loops, truncated };
}

export const loopsThrough = (loops, nodeId) =>
  loops.filter(({ nodes }) => nodes.includes(nodeId));

// The loop rotated so that it starts (and ends) at `nodeId`.
export function rotateLoop(loop, nodeId) {
  const at = loop.nodes.indexOf(nodeId);
  if (at <= 0) return loop;
  return {
    ...loop,
    nodes: [...loop.nodes.slice(at), ...loop.nodes.slice(0, at)],
    connections: [...loop.connections.slice(at), ...loop.connections.slice(0, at)],
  };
}

// Whether a path already leads from `from` to `to`, optionally only along
// connections accepted by `accept`. Adding `to → from` would then close a loop.
export function hasPath(graph, from, to, accept = () => true) {
  const seen = new Set([from]);
  const queue = [from];
  while (queue.length) {
    const current = queue.shift();
    if (current === to) return true;
    graph.connections.forEach((c) => {
      if (c.source === current && !seen.has(c.target) && accept(c)) {
        seen.add(c.target);
        queue.push(c.target);
      }
    });
  }
  return false;
}

export const loopKey = (loop) => loop.connections.map((c) => `${c.source}>${c.target}`).join(",");
