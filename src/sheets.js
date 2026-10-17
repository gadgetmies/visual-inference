// Reading graphs from Google Sheets.
//
// A sheet shared as "Anyone with the link can view" can be read straight
// from the browser through the Google Visualization endpoint, which returns
// CSV and allows cross-origin requests. No server or API key is needed.

export const SourceKinds = {
  sheet: "sheet",
  proxy: "proxy",
  local: "local",
  example: "example",
};

export const defaultSheetSource = {
  kind: SourceKinds.sheet,
  sheetId: "",
  nodesTab: "Nodes",
  connectionsTab: "Connections",
  hasHeader: false,
};

export function parseSheetId(input = "") {
  const value = input.trim();
  const match = value.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9-_]{20,}$/.test(value)) return value;
  return null;
}

export const sheetUrl = (sheetId) =>
  `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;

const tabCsvUrl = (sheetId, tab) =>
  `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    tab
  )}`;

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

async function fetchTab(sheetId, tab) {
  let res;
  try {
    res = await fetch(tabCsvUrl(sheetId, tab));
  } catch (e) {
    throw new Error("Could not reach Google Sheets. Check your connection.");
  }
  const contentType = res.headers.get("content-type") || "";
  if (!res.ok || contentType.includes("text/html")) {
    throw new Error(
      "The sheet could not be read. Make sure it is shared as “Anyone with the link can view”."
    );
  }
  return res.text();
}

const isBlank = (row) => row.every((cell) => (cell || "").trim() === "");

// Builds the graph from raw rows: node rows have the title in the first
// column, connection rows are [cause, effect, reasoning]. Nodes that are only
// mentioned in connections are added automatically.
export function graphFromRows(nodeRows, connectionRows) {
  const nodes = [];
  const idByTitle = new Map();
  const ensureNode = (rawTitle) => {
    const title = (rawTitle || "").trim();
    if (!title) return null;
    if (!idByTitle.has(title)) {
      const id = nodes.length;
      nodes.push({ id, title });
      idByTitle.set(title, id);
    }
    return idByTitle.get(title);
  };

  nodeRows.filter((row) => !isBlank(row)).forEach(([title]) => ensureNode(title));

  const connections = connectionRows
    .filter((row) => !isBlank(row))
    .map(([source, target, description = ""]) => ({
      source: ensureNode(source),
      target: ensureNode(target),
      description: description.trim(),
    }))
    .filter(({ source, target }) => source !== null && target !== null);

  return { nodes, connections };
}

export async function fetchGraphFromSheet({
  sheetId,
  nodesTab,
  connectionsTab,
  hasHeader,
}) {
  const [nodesCsv, connectionsCsv] = await Promise.all([
    nodesTab ? fetchTab(sheetId, nodesTab) : Promise.resolve(""),
    fetchTab(sheetId, connectionsTab),
  ]);

  // Google silently falls back to the first tab when a tab name is unknown.
  if (nodesTab && nodesCsv === connectionsCsv) {
    throw new Error(
      `The tabs “${nodesTab}” and “${connectionsTab}” returned the same data. Check the tab names.`
    );
  }

  const skipHeader = (rows) => (hasHeader ? rows.slice(1) : rows);
  return graphFromRows(
    skipHeader(parseCsv(nodesCsv)),
    skipHeader(parseCsv(connectionsCsv))
  );
}

// Compatible with the google-sheet-server API the app originally used:
// { sheets: [{ values: [[title], …] }, { values: [[source, target, description], …] }] }
export async function fetchGraphFromProxy({ url, username, password }) {
  const headers = new Headers();
  if (username || password) {
    headers.set("Authorization", `Basic ${btoa(`${username}:${password}`)}`);
  }
  let res;
  try {
    res = await fetch(url, { headers });
  } catch (e) {
    throw new Error("Could not reach the sheet proxy.");
  }
  if (res.status === 401 || res.status === 403) {
    throw new Error("The proxy rejected the credentials.");
  }
  if (!res.ok) throw new Error(`The proxy responded with ${res.status}.`);
  const { sheets } = await res.json();
  return graphFromRows(sheets[0]?.values || [], sheets[1]?.values || []);
}

const tsvCell = (value = "") => {
  const text = String(value);
  return /[\t\n"]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const toTsv = (rows) => rows.map((row) => row.map(tsvCell).join("\t")).join("\n");

// Tab-separated text that pastes straight into Google Sheets cells.
export function graphToTsv({ nodes, connections }) {
  const title = (id) => nodes.find((node) => node.id === id)?.title || "";
  return {
    nodes: toTsv(nodes.map(({ title }) => [title])),
    connections: toTsv(
      connections.map(({ source, target, description }) => [
        title(source),
        title(target),
        description || "",
      ])
    ),
  };
}
