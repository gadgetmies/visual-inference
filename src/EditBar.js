import { useRef, useState } from "react";
import { graphToTsv, sheetUrl, SourceKinds } from "./sheets";
import { isValidGraph } from "./graphOps";

const download = (filename, text) => {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export default function EditBar({
  graph,
  source,
  hasDraft,
  editing,
  onDone,
  onDiscard,
  onImport,
}) {
  const [message, setMessage] = useState(null);
  const fileInput = useRef(null);
  const isLocal = source.kind === SourceKinds.local;

  const flash = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 2500);
  };

  const copy = async (which) => {
    const text = graphToTsv(graph)[which];
    try {
      await navigator.clipboard.writeText(text);
      flash(`Copied ${which}. Paste into cell A1 of the ${which} tab.`);
    } catch (e) {
      window.prompt(`Copy the ${which}`, text);
    }
  };

  const importJson = async (file) => {
    try {
      const imported = JSON.parse(await file.text());
      if (!isValidGraph(imported)) throw new Error("invalid");
      onImport(imported);
      flash(`Imported ${imported.nodes.length} nodes.`);
    } catch (e) {
      flash("That file is not a graph exported from Visual inference.");
    }
  };

  const isExample = source.kind === SourceKinds.example;
  const status = isLocal
    ? "Changes are saved in this browser."
    : isExample
    ? hasDraft
      ? "You have changed the example. Discard the changes to restore it."
      : "Try editing the example. Your changes stay in this browser."
    : hasDraft
    ? "You have local changes that are not in the sheet yet."
    : "Changes are saved in this browser until you copy them to the sheet.";

  return (
    <div className="edit-bar" role="region" aria-label="Editing">
      <span className="edit-bar-title">{editing ? "Editing" : "Local changes"}</span>
      <span className="edit-bar-status" aria-live="polite">
        {message || status}
      </span>
      {!isLocal ? (
        <>
          <button type="button" className="button button-small" onClick={() => copy("nodes")}>
            Copy nodes
          </button>
          <button
            type="button"
            className="button button-small"
            onClick={() => copy("connections")}
          >
            Copy connections
          </button>
          {source.kind === SourceKinds.sheet ? (
            <a
              className="button button-small"
              href={sheetUrl(source.sheetId)}
              target="_blank"
              rel="noreferrer"
            >
              Open sheet
            </a>
          ) : null}
        </>
      ) : null}
      <button
        type="button"
        className="button button-small"
        onClick={() => download("visual-inference-graph.json", JSON.stringify(graph, null, 2))}
      >
        Export JSON
      </button>
      <button
        type="button"
        className="button button-small"
        onClick={() => fileInput.current?.click()}
      >
        Import JSON
      </button>
      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(e) => {
          if (e.target.files[0]) importJson(e.target.files[0]);
          e.target.value = "";
        }}
      />
      {!isLocal && hasDraft ? (
        <button
          type="button"
          className="button button-small button-danger"
          onClick={() => {
            if (
              window.confirm(
                isExample
                  ? "Discard your changes and restore the example?"
                  : "Discard your local changes and show the sheet as it is?"
              )
            )
              onDiscard();
          }}
        >
          Discard changes
        </button>
      ) : null}
      {editing ? (
        <button type="button" className="button button-small button-primary" onClick={onDone}>
          Done
        </button>
      ) : null}
    </div>
  );
}
