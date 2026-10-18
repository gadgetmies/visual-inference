import { useState } from "react";
import LoopCard from "./LoopCard";
import OverviewTabs from "./OverviewTabs";
import { loopTypeInfo } from "./LoopBadge";
import { classifyLoop, loopKey, LoopTypes, MAX_LOOP_LENGTH, MAX_LOOPS } from "./loopAnalysis";

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default function Loops({ graph, loops: { loops, truncated } }) {
  const [filter, setFilter] = useState(null);
  const typed = loops.map((loop) => ({ loop, type: classifyLoop(loop) }));
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
        <strong>How loops are classified.</strong> Each link is <strong>+</strong> when
        more of the cause means more of the effect, or <strong>−</strong> when it means
        less (column D of the connections tab). A loop with an even number of − links is{" "}
        <strong>reinforcing</strong>: it amplifies itself, as a virtuous or vicious
        circle. An odd number makes it <strong>balancing</strong>: it pushes back towards
        a limit. Loops with links that have no + or − are unclassified.
      </aside>
    </main>
  );
}
