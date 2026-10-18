import LoopCard from "./LoopCard";
import OverviewTabs from "./OverviewTabs";
import { loopKey, MAX_LOOP_LENGTH, MAX_LOOPS } from "./loopAnalysis";

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default function Loops({ graph, loops: { loops, truncated } }) {
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
      {truncated ? (
        <div className="notice notice-info">
          Showing the first {MAX_LOOPS} loops of up to {MAX_LOOP_LENGTH} steps. The
          graph has more.
        </div>
      ) : null}
      {loops.length ? (
        <ul className="loop-list">
          {loops.map((loop) => (
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
    </main>
  );
}
