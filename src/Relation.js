// States what a connection claims, in a form that doesn't depend on grammar:
// "People cycling ▲ → Car trips ▼" reads as "more cycling means fewer car trips".

const up = "▲";
const down = "▼";

export function relationLabel(from, to, connection) {
  if (connection.kind === "argument") return `${from} is a reason to believe ${to}`;
  if (connection.polarity === "+") return `More ${from} means more ${to}`;
  if (connection.polarity === "-") return `More ${from} means less ${to}`;
  return `${from} affects ${to}; the direction is not given`;
}

export default function Relation({ from, to, connection, compact = false, words = false }) {
  const label = relationLabel(from, to, connection);
  const argument = connection.kind === "argument";
  const { polarity } = connection;

  if (compact) {
    return (
      <span
        className={`relation relation-compact ${words ? "relation-pill" : ""}`}
        title={label}
        aria-label={label}
      >
        {argument ? (
          <span className="relation-why">{words ? "is a reason for" : "reason"}</span>
        ) : polarity ? (
          <>
            <span className="relation-up">
              {up}
              {words ? " more" : null}
            </span>
            <span className="relation-to">→</span>
            <span className={polarity === "+" ? "relation-up" : "relation-down"}>
              {polarity === "+" ? up : down}
              {words ? (polarity === "+" ? " more" : " less") : null}
            </span>
          </>
        ) : (
          <span className="relation-unknown">direction not given</span>
        )}
      </span>
    );
  }

  return (
    <span className="relation" title={label}>
      <span className="visually-hidden">{label}</span>
      <span aria-hidden="true" className="relation-visual">
        <span className="relation-term">
          {from}
          {argument || !polarity ? null : <span className="relation-up"> {up}</span>}
        </span>
        <span className="relation-to">{argument ? "is a reason for" : "→"}</span>
        <span className="relation-term">
          {to}
          {argument ? null : polarity === "+" ? (
            <span className="relation-up"> {up}</span>
          ) : polarity === "-" ? (
            <span className="relation-down"> {down}</span>
          ) : (
            <span className="relation-unknown"> (direction?)</span>
          )}
        </span>
      </span>
    </span>
  );
}

// Evidence is free text: one source per line (or separated by " ; "). URLs
// become links labelled with their host name.
export function splitEvidence(evidence = "") {
  return evidence
    .split(/\n| ; /)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function Evidence({ evidence }) {
  const items = splitEvidence(evidence);
  if (!items.length) return null;
  return (
    <ul className="evidence">
      {items.map((item, index) => {
        const url = item.match(/https?:\/\/\S+/);
        if (!url) return <li key={index}>{item}</li>;
        let host = url[0];
        try {
          host = new URL(url[0]).hostname.replace(/^www\./, "");
        } catch (e) {}
        const text = item.replace(url[0], "").trim();
        return (
          <li key={index}>
            {text ? `${text} ` : null}
            <a href={url[0]} target="_blank" rel="noreferrer">
              {host}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
