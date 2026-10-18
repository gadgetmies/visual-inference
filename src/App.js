import "./App.css";
import Header from "./Header.js";
import Overview from "./Nodes.js";
import Node from "./Node.js";
import Setup from "./Setup.js";
import EditBar from "./EditBar.js";
import Loops from "./Loops.js";
import { findLoops } from "./loopAnalysis.js";

import { HashRouter, Link, Navigate, Route, Routes, useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchGraphFromProxy,
  fetchGraphFromSheet,
  SourceKinds,
} from "./sheets.js";
import { emptyGraph } from "./graphOps.js";
import exampleGraph from "./exampleGraph.js";
import {
  initialSource,
  loadDraft,
  saveDraft,
  saveSource,
  sourceKey,
} from "./storage.js";

function LegacyNodeRedirect() {
  const { nodeId } = useParams();
  return <Navigate replace to={`/node/${nodeId}`} />;
}

function App() {
  const [source, setSource] = useState(initialSource);
  const key = sourceKey(source);
  const [remoteGraph, setRemoteGraph] = useState(null);
  const [draft, setDraft] = useState(() => loadDraft(key));
  const [error, setError] = useState(null);
  const [reloadCount, setReloadCount] = useState(0);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setRemoteGraph(null);
    setError(null);
    if (!source) return;

    if (source.kind === SourceKinds.local) {
      setRemoteGraph(emptyGraph);
      return;
    }
    if (source.kind === SourceKinds.example) {
      setRemoteGraph(exampleGraph);
      return;
    }

    const load =
      source.kind === SourceKinds.proxy
        ? fetchGraphFromProxy(source)
        : fetchGraphFromSheet(source);
    load.then(
      (graph) => !cancelled && setRemoteGraph(graph),
      (e) => !cancelled && setError(e.message || "Loading the graph failed.")
    );
    return () => {
      cancelled = true;
    };
  }, [source, reloadCount]);

  const graph = draft || remoteGraph;
  const loops = useMemo(() => (graph ? findLoops(graph) : { loops: [], truncated: false }), [graph]);
  const isLocal = source?.kind === SourceKinds.local;
  const isExample = source?.kind === SourceKinds.example;

  // Runs the update synchronously so callers can read results (e.g. a new
  // node's id) right away.
  const updateGraph = useCallback(
    (update) => {
      const next = update(graph || emptyGraph);
      saveDraft(key, next);
      setDraft(next);
    },
    [key, graph]
  );

  const discardDraft = () => {
    saveDraft(key, null);
    setDraft(null);
  };

  const chooseSource = (nextSource, initialGraph = null) => {
    const nextKey = sourceKey(nextSource);
    saveSource(nextSource);
    if (initialGraph) saveDraft(nextKey, initialGraph);
    setDraft(loadDraft(nextKey));
    setSource(nextSource);
    setReloadCount((n) => n + 1);
    setEditing(Boolean(initialGraph) || nextSource.kind === SourceKinds.local);
  };

  if (!source || (error && !draft)) {
    return (
      <HashRouter>
        <Setup source={source} error={error} onSubmit={chooseSource} />
      </HashRouter>
    );
  }

  return (
    <HashRouter>
      <div className="app">
        <Header
          source={source}
          graph={graph}
          editing={editing}
          setEditing={setEditing}
        />
        {editing || (draft && !isLocal) ? (
          <EditBar
            graph={graph}
            source={source}
            hasDraft={Boolean(draft)}
            editing={editing}
            onDone={() => setEditing(false)}
            onDiscard={discardDraft}
            onImport={(imported) => updateGraph(() => imported)}
          />
        ) : null}
        {isExample ? (
          <div className="example-banner">
            <span>
              You’re viewing an example about city cycling. Pick a node to see what
              causes it and what it leads to.
            </span>
            <Link to="/settings" className="button button-small button-primary">
              Use your own sheet
            </Link>
          </div>
        ) : null}
        {error && draft ? (
          <div className="notice notice-error" role="alert">
            {error} Showing your locally saved copy.
          </div>
        ) : null}
        {graph === null ? (
          <div className="loading" role="status">
            <span className="spinner" aria-hidden="true" />
            Loading graph…
          </div>
        ) : (
          <Routes>
            <Route
              index
              element={
                <Overview
                  graph={graph}
                  loops={loops}
                  editing={editing}
                  updateGraph={updateGraph}
                  setEditing={setEditing}
                />
              }
            />
            <Route
              path="/node/:nodeId"
              element={
                <Node
                  graph={graph}
                  loops={loops}
                  editing={editing}
                  updateGraph={updateGraph}
                  sourceLevels={2}
                  targetLevels={2}
                />
              }
            />
            <Route path="/loops" element={<Loops graph={graph} loops={loops} />} />
            <Route
              path="/settings"
              element={
                <Setup
                  source={source}
                  onSubmit={chooseSource}
                  onReload={() => setReloadCount((n) => n + 1)}
                  embedded
                />
              }
            />
            <Route path="/:nodeId" element={<LegacyNodeRedirect />} />
          </Routes>
        )}
      </div>
    </HashRouter>
  );
}

export default App;
