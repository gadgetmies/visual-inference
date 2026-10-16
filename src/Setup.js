import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import exampleGraph from "./exampleGraph";
import { defaultSheetSource, parseSheetId, sheetUrl, SourceKinds } from "./sheets";
import { loadDraft, shareableUrl } from "./storage";

const kinds = [
  { kind: SourceKinds.sheet, label: "Google Sheet" },
  { kind: SourceKinds.proxy, label: "Sheet proxy" },
  { kind: SourceKinds.local, label: "This browser" },
];

export default function Setup({ source, error, onSubmit, onReload, embedded = false }) {
  const navigate = useNavigate();
  const [kind, setKind] = useState(source?.kind || SourceKinds.sheet);
  const [sheetInput, setSheetInput] = useState(
    source?.kind === SourceKinds.sheet ? sheetUrl(source.sheetId) : ""
  );
  const [nodesTab, setNodesTab] = useState(source?.nodesTab ?? defaultSheetSource.nodesTab);
  const [connectionsTab, setConnectionsTab] = useState(
    source?.connectionsTab ?? defaultSheetSource.connectionsTab
  );
  const [hasHeader, setHasHeader] = useState(source?.hasHeader ?? false);
  const [proxyUrl, setProxyUrl] = useState(source?.url || "");
  const [username, setUsername] = useState(source?.username || "");
  const [password, setPassword] = useState(source?.password || "");
  const [formError, setFormError] = useState(null);
  const [copied, setCopied] = useState(false);

  const done = () => embedded && navigate("/");

  const submit = (e) => {
    e.preventDefault();
    if (kind === SourceKinds.sheet) {
      const sheetId = parseSheetId(sheetInput);
      if (!sheetId) {
        setFormError("That doesn’t look like a Google Sheets URL or ID.");
        return;
      }
      if (!connectionsTab.trim()) {
        setFormError("Name the tab that lists the connections.");
        return;
      }
      onSubmit({
        kind,
        sheetId,
        nodesTab: nodesTab.trim(),
        connectionsTab: connectionsTab.trim(),
        hasHeader,
      });
    } else if (kind === SourceKinds.proxy) {
      if (!/^https?:\/\//.test(proxyUrl.trim())) {
        setFormError("Enter the full proxy URL, starting with https://");
        return;
      }
      onSubmit({ kind, url: proxyUrl.trim(), username, password });
    }
    setFormError(null);
    done();
  };

  const startLocal = (withExample) => {
    const existing = loadDraft("local");
    if (
      withExample &&
      existing?.nodes.length > 0 &&
      !window.confirm("Replace the graph saved in this browser with the example?")
    ) {
      return;
    }
    onSubmit({ kind: SourceKinds.local }, withExample ? exampleGraph : null);
    done();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl(source));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      window.prompt("Copy this link", shareableUrl(source));
    }
  };

  const shownError = formError || error;
  const localGraph = kind === SourceKinds.local ? loadDraft("local") : null;

  return (
    <div className={`setup ${embedded ? "setup-embedded" : ""}`}>
      <form className="card setup-card" onSubmit={submit}>
        {embedded ? null : (
          <div className="brand brand-large">
            <Logo size={32} />
            <span>Visual inference</span>
          </div>
        )}
        <div>
          <h1>{embedded ? "Data source" : "Connect a Google Sheet"}</h1>
          <p className="muted">
            Explore how things lead to one another. The graph is read from a Google
            Sheet: one tab lists the nodes, another lists the connections between them.
          </p>
        </div>

        <div className="segmented" role="tablist" aria-label="Source type">
          {kinds.map(({ kind: value, label }) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={kind === value}
              className={kind === value ? "active" : ""}
              onClick={() => {
                setKind(value);
                setFormError(null);
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {shownError ? (
          <div className="notice notice-error" role="alert">
            {shownError}
          </div>
        ) : null}

        {kind === SourceKinds.sheet ? (
          <>
            <label className="field">
              Sheet URL or ID
              <input
                value={sheetInput}
                onChange={(e) => setSheetInput(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/…"
                autoFocus={!embedded}
                required
              />
            </label>
            <div className="field-row">
              <label className="field">
                Nodes tab
                <input
                  value={nodesTab}
                  onChange={(e) => setNodesTab(e.target.value)}
                  placeholder="Optional"
                />
              </label>
              <label className="field">
                Connections tab
                <input
                  value={connectionsTab}
                  onChange={(e) => setConnectionsTab(e.target.value)}
                  required
                />
              </label>
            </div>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={hasHeader}
                onChange={(e) => setHasHeader(e.target.checked)}
              />
              The first row of each tab is a header
            </label>
            <div className="hint">
              Share the sheet as <strong>Anyone with the link can view</strong>.
              <br />
              Nodes tab: column A is the title. Connections tab: A is the cause, B the
              effect and C the reasoning (optional). Nodes that only appear in
              connections are added automatically.
            </div>
          </>
        ) : null}

        {kind === SourceKinds.proxy ? (
          <>
            <label className="field">
              Proxy URL
              <input
                value={proxyUrl}
                onChange={(e) => setProxyUrl(e.target.value)}
                placeholder="https://google-sheet-server.example.com/api/<sheet id>"
                required
              />
            </label>
            <div className="field-row">
              <label className="field">
                Username
                <input value={username} onChange={(e) => setUsername(e.target.value)} />
              </label>
              <label className="field">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>
            <div className="hint">
              For private sheets served through a google-sheet-server compatible proxy,
              which responds with <code>{"{ sheets: [{ values }, …] }"}</code>. The
              credentials are stored in this browser.
            </div>
          </>
        ) : null}

        {kind === SourceKinds.local ? (
          <div className="hint">
            Build a graph without a sheet. It is saved in this browser; export it as
            JSON or copy it into a sheet when you are ready to share.
            {localGraph?.nodes.length ? (
              <>
                <br />A graph with {localGraph.nodes.length} nodes is already saved here.
              </>
            ) : null}
          </div>
        ) : null}

        <div className="actions">
          {kind === SourceKinds.local ? (
            <>
              <button type="button" className="button" onClick={() => startLocal(true)}>
                Load the example
              </button>
              <button
                type="button"
                className="button button-primary"
                onClick={() => startLocal(false)}
              >
                {localGraph?.nodes.length ? "Open saved graph" : "Start an empty graph"}
              </button>
            </>
          ) : (
            <>
              {embedded && onReload && source?.kind !== SourceKinds.local ? (
                <button
                  type="button"
                  className="button"
                  onClick={() => {
                    onReload();
                    done();
                  }}
                >
                  Reload from source
                </button>
              ) : (
                <span />
              )}
              <button type="submit" className="button button-primary">
                Load graph
              </button>
            </>
          )}
        </div>

        {embedded && source?.kind === SourceKinds.sheet ? (
          <div className="share-row">
            <span className="muted">
              Share a link that opens this sheet directly.
            </span>
            <button type="button" className="button button-small" onClick={copyLink}>
              {copied ? "Link copied" : "Copy link"}
            </button>
          </div>
        ) : null}
      </form>
    </div>
  );
}
