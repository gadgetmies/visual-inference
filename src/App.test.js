import { render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => window.localStorage.clear());

test("asks for a data source when none is configured", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /connect a google sheet/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/sheet url or id/i)).toBeInTheDocument();
});

test("opens a graph saved in this browser", () => {
  window.localStorage.setItem(
    "visual-inference:source",
    JSON.stringify({ kind: "local" })
  );
  window.localStorage.setItem(
    "visual-inference:draft:local",
    JSON.stringify({
      nodes: [
        { id: 0, title: "Rain" },
        { id: 1, title: "Wet streets" },
      ],
      connections: [{ source: 0, target: 1, description: "" }],
    })
  );
  render(<App />);
  expect(screen.getByText("Rain")).toBeInTheDocument();
  expect(screen.getByText("Wet streets")).toBeInTheDocument();
});
