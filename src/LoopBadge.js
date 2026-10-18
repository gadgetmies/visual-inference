import { LoopTypes } from "./loopAnalysis";

export const loopTypeInfo = {
  [LoopTypes.circular]: {
    letter: "!",
    label: "Circular reasoning",
    description: "Every link is an argument, so each claim ends up supporting itself.",
  },
  [LoopTypes.reinforcing]: {
    letter: "R",
    label: "Reinforcing",
    description: "Amplifies itself: a virtuous or vicious circle.",
  },
  [LoopTypes.balancing]: {
    letter: "B",
    label: "Balancing",
    description: "Pushes back towards a limit.",
  },
  [LoopTypes.unknown]: {
    letter: "?",
    label: "Unclassified",
    description: "Some links don’t say whether they work in the same (+) or opposite (−) direction.",
  },
};

export default function LoopBadge({ type }) {
  const info = loopTypeInfo[type];
  return (
    <span className={`loop-badge loop-badge-${type}`} title={info.description}>
      <span className="loop-badge-letter" aria-hidden="true">
        {info.letter}
      </span>
      {info.label}
    </span>
  );
}
