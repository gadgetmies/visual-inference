const signs = { "+": "+", "-": "−" };

// Causality always reads left to right: cause → effect.
export default function Connection({ isCause, connection, highlighted = false }) {
  const argument = connection?.kind === "argument";
  const sign = argument ? null : signs[connection?.polarity];
  return (
    <span
      className={`arrow ${isCause ? "arrow-cause" : "arrow-effect"} ${
        highlighted ? "arrow-highlighted" : ""
      } ${argument ? "arrow-argument" : ""}`}
      title={
        argument
          ? "Argument: a reason to believe, not a cause"
          : sign === "+"
          ? "Same direction: more of one means more of the other"
          : sign
          ? "Opposite direction: more of one means less of the other"
          : undefined
      }
    >
      {sign ? <span className="arrow-sign">{sign}</span> : null}
      {argument ? <span className="arrow-sign arrow-sign-argument">why</span> : null}
      <svg viewBox="0 0 28 12" width="28" height="12" aria-hidden="true">
        <path d="M0 6h24" />
        <path d="M19 1l6 5-6 5" />
      </svg>
    </span>
  );
}
