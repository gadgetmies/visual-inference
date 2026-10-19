import { useLayoutEffect, useRef, useState } from "react";

// Draws the arrows between cards. Every card that is connected to another one
// carries data-parent-key (the data-node-key of the card it links to) and
// data-side ("cause": the arrow runs from this card to its parent; "effect":
// from the parent to this card). Positions are measured from the DOM so the
// arrows always meet the boxes, whatever their size. The layer measures the
// element it is placed in.
export default function ConnectorLayer({ deps }) {
  const [layout, setLayout] = useState({ width: 0, height: 0, links: [] });
  const svgRef = useRef(null);

  useLayoutEffect(() => {
    // The parent's ref isn't attached yet when a child's layout effect runs, so
    // find the container through the layer's own element.
    const container = svgRef.current?.parentElement;
    if (!container) return undefined;

    const measure = () => {
      const box = container.getBoundingClientRect();
      const links = [];
      container.querySelectorAll("[data-parent-key]").forEach((card) => {
        if (!card.offsetParent) return; // hidden on narrow screens
        const parent = container.querySelector(
          `[data-node-key="${card.dataset.parentKey}"]`
        );
        if (!parent || !parent.offsetParent) return;
        const isCause = card.dataset.side === "cause";
        const [from, to] = isCause
          ? [card.getBoundingClientRect(), parent.getBoundingClientRect()]
          : [parent.getBoundingClientRect(), card.getBoundingClientRect()];
        links.push({
          key: card.dataset.nodeKey,
          side: card.dataset.side,
          polarity: card.dataset.polarity,
          kind: card.dataset.kind,
          highlighted: card.dataset.highlighted === "true",
          sx: from.right - box.left,
          sy: from.top + from.height / 2 - box.top,
          ex: to.left - box.left,
          ey: to.top + to.height / 2 - box.top,
        });
      });
      setLayout({ width: box.width, height: box.height, links });
    };

    measure();
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(container);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return (
    <svg
      ref={svgRef}
      className="connector-layer"
      width={layout.width}
      height={layout.height}
      aria-hidden="true"
    >
      <defs>
        {["cause", "effect", "highlight"].map((type) => (
          <marker
            key={type}
            id={`arrowhead-${type}`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0 0L10 5L0 10z" className={`connector-head connector-head-${type}`} />
          </marker>
        ))}
      </defs>
      {layout.links.map(({ key, side, polarity, kind, highlighted, sx, sy, ex, ey }) => {
        const bend = Math.max(12, (ex - sx) / 2);
        const type = highlighted ? "highlight" : side;
        // Put the sign next to the card the arrow belongs to, not where arrows
        // fanning out of one card bunch together.
        const t = side === "cause" ? 0.25 : 0.75;
        const [mx, my] = bezierPoint(t, [sx, sy], [sx + bend, sy], [ex - bend, ey], [ex, ey]);
        const sign = kind === "argument" ? null : polarity === "+" ? "+" : polarity === "-" ? "−" : null;
        return (
          <g key={key} className={`connector connector-${type} ${kind === "argument" ? "connector-argument" : ""}`}>
            <path
              d={`M${sx} ${sy}C${sx + bend} ${sy} ${ex - bend} ${ey} ${ex - 1} ${ey}`}
              markerEnd={`url(#arrowhead-${type})`}
            />
            {sign ? (
              <g className="connector-sign" transform={`translate(${mx} ${my})`}>
                <circle r="8" />
                <text dy="0.35em">{sign}</text>
              </g>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

function bezierPoint(t, p0, p1, p2, p3) {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [0, 1].map((i) => a * p0[i] + b * p1[i] + c * p2[i] + d * p3[i]);
}
