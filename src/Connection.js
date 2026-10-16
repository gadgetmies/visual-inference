// Causality always reads left to right: cause → effect.
export default function Connection({ isCause }) {
  return (
    <span className={`arrow ${isCause ? "arrow-cause" : "arrow-effect"}`} aria-hidden="true">
      <svg viewBox="0 0 28 12" width="28" height="12">
        <path d="M0 6h24" />
        <path d="M19 1l6 5-6 5" />
      </svg>
    </span>
  );
}
