import { relationLabel, splitEvidence } from "./Relation";

test("states the claim of a link in words", () => {
  expect(relationLabel("Rain", "Floods", { polarity: "+" })).toBe("More Rain means more Floods");
  expect(relationLabel("Rain", "Picnics", { polarity: "-" })).toBe("More Rain means less Picnics");
  expect(relationLabel("A", "B", { polarity: "" })).toMatch(/direction is not given/);
  expect(relationLabel("A", "B", { kind: "argument" })).toBe("A is a reason to believe B");
});

test("splits evidence into sources", () => {
  expect(splitEvidence("One\nTwo ; Three\n\n")).toEqual(["One", "Two", "Three"]);
  expect(splitEvidence("")).toEqual([]);
});
