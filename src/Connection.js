import Info from "./Info";

export default function Connection({ info }) {
  return (
    <div style={{ position: "relative" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 350 100"
        style={{ position: "absolute", left: "-2em", width: "4em", top: "50%" }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
        </defs>
        <line
          x1="0"
          y1="50"
          x2="250"
          y2="50"
          stroke="#000"
          strokeWidth="8"
          markerEnd="url(#arrowhead)"
        />
      </svg>
      {info ? (
        <Info
          style={{ position: "absolute", left: "-1em", top: "50%" }}
          text={info}
        />
      ) : null}
    </div>
  );
}
