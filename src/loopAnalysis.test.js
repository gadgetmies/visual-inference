import { findLoops, hasPath, loopsThrough, rotateLoop } from "./loopAnalysis";
import exampleGraph from "./exampleGraph";

const graph = (edges) => ({
  nodes: [...new Set(edges.flat())].map((id) => ({ id, title: `N${id}` })),
  connections: edges.map(([source, target]) => ({ source, target, description: "" })),
});

test("finds each loop once, shortest first", () => {
  const { loops, truncated } = findLoops(
    graph([
      [0, 1],
      [1, 0],
      [1, 2],
      [2, 3],
      [3, 1],
      [3, 4],
    ])
  );
  expect(truncated).toBe(false);
  expect(loops.map((l) => l.nodes)).toEqual([
    [0, 1],
    [1, 2, 3],
  ]);
  expect(loops[1].connections.map((c) => [c.source, c.target])).toEqual([
    [1, 2],
    [2, 3],
    [3, 1],
  ]);
});

test("finds self-loops and respects limits", () => {
  expect(findLoops(graph([[0, 0]])).loops).toHaveLength(1);
  const ring = graph([...Array(10)].map((_, i) => [i, (i + 1) % 10]));
  expect(findLoops(ring).loops).toHaveLength(0);
  expect(findLoops(ring, { maxLength: 10 }).loops).toHaveLength(1);
  const dense = graph(
    [0, 1, 2, 3, 4, 5].flatMap((a) => [0, 1, 2, 3, 4, 5].filter((b) => a !== b).map((b) => [a, b]))
  );
  const { loops, truncated } = findLoops(dense, { maxLoops: 20 });
  expect(loops).toHaveLength(20);
  expect(truncated).toBe(true);
});

test("rotates loops and finds paths", () => {
  const g = graph([
    [0, 1],
    [1, 2],
    [2, 0],
  ]);
  const [loop] = findLoops(g).loops;
  expect(rotateLoop(loop, 2).nodes).toEqual([2, 0, 1]);
  expect(rotateLoop(loop, 2).connections[0]).toMatchObject({ source: 2, target: 0 });
  expect(loopsThrough([loop], 1)).toHaveLength(1);
  expect(hasPath(g, 0, 2)).toBe(true);
  expect(hasPath(graph([[0, 1]]), 1, 0)).toBe(false);
});

test("the example has loops", () => {
  expect(findLoops(exampleGraph).loops.length).toBeGreaterThan(3);
});
