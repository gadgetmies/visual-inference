import { defaultSheetSource, parseSheetId, SourceKinds } from "./sheets";

const SOURCE_KEY = "visual-inference:source";
const draftKey = (sourceKey) => `visual-inference:draft:${sourceKey}`;

const read = (key) => {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? null : JSON.parse(value);
  } catch (e) {
    return null;
  }
};

const write = (key, value) => {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Storage can be unavailable (private mode, quota); edits then live in memory only.
  }
};

// A sheet given in the page URL (?sheet=…) wins, so links can be shared.
// Next comes the source the visitor chose earlier, then the build-time default.
export function initialSource() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = parseSheetId(params.get("sheet") || "");
  if (fromUrl) {
    return {
      ...defaultSheetSource,
      sheetId: fromUrl,
      nodesTab: params.get("nodes") ?? defaultSheetSource.nodesTab,
      connectionsTab:
        params.get("connections") ?? defaultSheetSource.connectionsTab,
      hasHeader: params.get("header") === "1",
    };
  }

  const stored = read(SOURCE_KEY);
  if (stored) return stored;

  const fromEnv = parseSheetId(process.env.REACT_APP_SHEET_ID || "");
  if (fromEnv) {
    return {
      ...defaultSheetSource,
      sheetId: fromEnv,
      nodesTab: process.env.REACT_APP_NODES_TAB ?? defaultSheetSource.nodesTab,
      connectionsTab:
        process.env.REACT_APP_CONNECTIONS_TAB ?? defaultSheetSource.connectionsTab,
      hasHeader: process.env.REACT_APP_SHEET_HAS_HEADER === "true",
    };
  }
  return null;
}

export function saveSource(source) {
  write(SOURCE_KEY, source);
  // Drop ?sheet=… from the address so the newly chosen source sticks on reload.
  if (window.location.search) {
    window.history.replaceState(null, "", window.location.pathname + window.location.hash);
  }
}

export function sourceKey(source) {
  if (!source) return null;
  switch (source.kind) {
    case SourceKinds.sheet:
      return `sheet:${source.sheetId}`;
    case SourceKinds.proxy:
      return `proxy:${source.url}`;
    default:
      return "local";
  }
}

export const loadDraft = (key) => (key ? read(draftKey(key)) : null);
export const saveDraft = (key, graph) => key && write(draftKey(key), graph);

export function shareableUrl(source) {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  if (source?.kind === SourceKinds.sheet) {
    url.searchParams.set("sheet", source.sheetId);
    if (source.nodesTab !== defaultSheetSource.nodesTab)
      url.searchParams.set("nodes", source.nodesTab);
    if (source.connectionsTab !== defaultSheetSource.connectionsTab)
      url.searchParams.set("connections", source.connectionsTab);
    if (source.hasHeader) url.searchParams.set("header", "1");
  }
  return url.toString();
}
