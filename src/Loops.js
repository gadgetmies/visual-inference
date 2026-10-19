import { useState } from "react";
import LoopCard from "./LoopCard";
import OverviewTabs from "./OverviewTabs";
import { loopTypeInfo } from "./LoopBadge";
import { loopKey, LoopTypes, MAX_LOOP_LENGTH, MAX_LOOPS, sortLoops } from "./loopAnalysis";

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default function Loops({ graph, loops: { loops, truncated } }) {
  const [filter, setFilter] = useState(null);
  const typed = sortLoops(loops);
  const types = Object.values(LoopTypes).filter((type) => typed.some((t) => t.type === type));
  const shown = filter ? typed.filter(({ type }) => type === filter) : typed;

  return (
    <main className="overview">
      <div className="overview-head">
        <div>
          <h1>Loops</h1>
          <p className="muted">
            {loops.length === 0
              ? "No node leads back to itself."
              : `${plural(loops.length, "loop")}: chains of effects that lead back to where they started.`}
          </p>
        </div>
        <OverviewTabs graph={graph} loopCount={loops.length} />
      </div>

      {loops.length ? (
        <div className="loop-filters" role="group" aria-label="Show loops">
          <button
            type="button"
            className={`loop-filter ${filter === null ? "active" : ""}`}
            aria-pressed={filter === null}
            onClick={() => setFilter(null)}
          >
            All <span className="count">{loops.length}</span>
          </button>
          {types.map((type) => (
            <button
              key={type}
              type="button"
              className={`loop-filter loop-filter-${type} ${filter === type ? "active" : ""}`}
              aria-pressed={filter === type}
              title={loopTypeInfo[type].description}
              onClick={() => setFilter(filter === type ? null : type)}
            >
              <span className={`loop-badge-letter loop-badge-${type}`} aria-hidden="true">
                {loopTypeInfo[type].letter}
              </span>
              {loopTypeInfo[type].label}
              <span className="count">{typed.filter((t) => t.type === type).length}</span>
            </button>
          ))}
        </div>
      ) : null}

      {truncated ? (
        <div className="notice notice-info">
          Showing the first {MAX_LOOPS} loops of up to {MAX_LOOP_LENGTH} steps. The
          graph has more.
        </div>
      ) : null}

      {loops.length ? (
        <ul className="loop-list">
          {shown.map(({ loop }) => (
            <LoopCard key={loopKey(loop)} graph={graph} loop={loop} />
          ))}
        </ul>
      ) : (
        <div className="empty">
          <h2>No loops yet</h2>
          <p className="muted">
            A loop forms when a chain of effects leads back to where it started.
          </p>
        </div>
      )}

      <aside className="hint loop-legend">
        <strong>How to read a loop.</strong> Each loop follows one change around the
        circle: it starts with <strong>▲ more</strong> of the first node and shows what
        happens to each next one. A link marked + in the sheet (column D) passes the
        change on (more → more, less → less); a link marked − reverses it (more → less,
        less → more). If the change comes back as more, the loop is{" "}
        <strong>reinforcing</strong>: it amplifies itself, as a virtuous or vicious
        circle. If it comes back as less, the loop is <strong>balancing</strong>: it
        pushes back. Loops with links that have no + or − are unclassified.
        <br />
        Links marked as an <strong>argument</strong> in column E (“is a reason to
        believe”) are not causes. A loop made only of arguments is{" "}
        <strong>circular reasoning</strong>: each claim ends up supporting itself.
      </aside>
    </main>
  );
}
