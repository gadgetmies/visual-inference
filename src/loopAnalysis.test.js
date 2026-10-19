import {
  classifyLoop,
  findLoops,
  hasPath,
  LoopTypes,
  loopsThrough,
  rotateLoop,
  sortLoops,
  traceLoop,
} from "./loopAnalysis";
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

test("classifies loops by the number of opposite links", () => {
  const loop = (...polarities) => ({ connections: polarities.map((polarity) => ({ polarity })) });
  expect(classifyLoop(loop("+", "+"))).toBe(LoopTypes.reinforcing);
  expect(classifyLoop(loop("-", "+", "-"))).toBe(LoopTypes.reinforcing);
  expect(classifyLoop(loop("+", "-"))).toBe(LoopTypes.balancing);
  expect(classifyLoop(loop("+", ""))).toBe(LoopTypes.unknown);
  const argumentLoop = (...kinds) => ({ connections: kinds.map((kind) => ({ kind, polarity: "+" })) });
  expect(classifyLoop(argumentLoop("argument", "argument"))).toBe(LoopTypes.circular);
  expect(classifyLoop(argumentLoop("argument", "cause"))).toBe(LoopTypes.reinforcing);
});

test("the example has both reinforcing and balancing loops", () => {
  const types = findLoops(exampleGraph).loops.map(classifyLoop);
  expect(types).toContain(LoopTypes.reinforcing);
  expect(types).toContain(LoopTypes.balancing);
  expect(types).toContain(LoopTypes.circular);
  expect(types).not.toContain(LoopTypes.unknown);
});

test("lists circular reasoning first", () => {
  const sorted = sortLoops(findLoops(exampleGraph).loops);
  expect(sorted[0].type).toBe(LoopTypes.circular);
});

test("finds paths along argument links only", () => {
  const g = {
    nodes: [0, 1, 2].map((id) => ({ id, title: `${id}` })),
    connections: [
      { source: 0, target: 1, kind: "argument" },
      { source: 1, target: 2, kind: "cause" },
    ],
  };
  const isArgument = (c) => c.kind === "argument";
  expect(hasPath(g, 0, 2)).toBe(true);
  expect(hasPath(g, 0, 2, isArgument)).toBe(false);
  expect(hasPath(g, 0, 1, isArgument)).toBe(true);
});

test("traces a change around a loop", () => {
  const loop = (...polarities) => ({ connections: polarities.map((polarity) => ({ polarity })) });
  // More cycling → less car trips → less injuries → more safety → more cycling.
  expect(traceLoop(loop("-", "+", "-", "+"))).toEqual([1, -1, -1, 1, 1]);
  expect(traceLoop(loop("+", "-"))).toEqual([1, 1, -1]);
  expect(traceLoop(loop("+", "", "+"))).toEqual([1, 1, 0, 0]);
});
