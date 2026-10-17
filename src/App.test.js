import { fireEvent, render, screen } from "@testing-library/react";
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

test("opens the example from the setup screen", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: /explore the example graph/i }));
  expect(screen.getByText(/you’re viewing an example/i)).toBeInTheDocument();
  expect(screen.getByText("Protected bike lanes")).toBeInTheDocument();
  // The example doesn't overwrite a graph saved in this browser.
  expect(window.localStorage.getItem("visual-inference:draft:local")).toBeNull();
});

test("opens the example from ?example", () => {
  window.history.replaceState(null, "", "/?example");
  render(<App />);
  expect(screen.getByText("People cycling")).toBeInTheDocument();
  window.history.replaceState(null, "", "/");
});
