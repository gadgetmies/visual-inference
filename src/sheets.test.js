import { graphFromRows, graphToTsv, parseCsv, parseSheetId } from "./sheets";

test("parses sheet ids from URLs and raw ids", () => {
  const id = "1qbP4LUm-EZAB_Rn-ntIcec5EyE3uWiks6bfSUfEEnvM";
  expect(parseSheetId(`https://docs.google.com/spreadsheets/d/${id}/edit#gid=0`)).toBe(id);
  expect(parseSheetId(` ${id} `)).toBe(id);
  expect(parseSheetId("not a sheet")).toBeNull();
});

test("parses quoted CSV", () => {
  expect(parseCsv('"a","b, c"\n"d ""e""",""\r\n')).toEqual([
    ["a", "b, c"],
    ['d "e"', ""],
  ]);
});

test("builds a graph and adds nodes only named in connections", () => {
  const graph = graphFromRows(
    [["Rain"], [""]],
    [
      ["Rain", "Wet streets", "Water falls"],
      ["Wet streets", "Slipping"],
      ["", ""],
    ]
  );
  expect(graph.nodes.map((n) => n.title)).toEqual(["Rain", "Wet streets", "Slipping"]);
  expect(graph.connections).toEqual([
    { source: 0, target: 1, description: "Water falls" },
    { source: 1, target: 2, description: "" },
  ]);
});

test("exports TSV that pastes into Sheets", () => {
  const tsv = graphToTsv({
    nodes: [
      { id: 0, title: "A" },
      { id: 1, title: "B" },
    ],
    connections: [{ source: 0, target: 1, description: 'says "hi"\tthere' }],
  });
  expect(tsv.nodes).toBe("A\nB");
  expect(tsv.connections).toBe('A\tB\t"says ""hi""\tthere"');
});
