const signs = { "+": "+", "-": "−" };

// Causality always reads left to right: cause → effect.
export default function Connection({ isCause, connection, highlighted = false }) {
  const sign = signs[connection?.polarity];
  return (
    <span
      className={`arrow ${isCause ? "arrow-cause" : "arrow-effect"} ${
        highlighted ? "arrow-highlighted" : ""
      }`}
      title={
        sign === "+"
          ? "Same direction: more of one means more of the other"
          : sign
          ? "Opposite direction: more of one means less of the other"
          : undefined
      }
    >
      {sign ? <span className="arrow-sign">{sign}</span> : null}
      <svg viewBox="0 0 28 12" width="28" height="12" aria-hidden="true">
        <path d="M0 6h24" />
        <path d="M19 1l6 5-6 5" />
      </svg>
    </span>
  );
}
