import React from "react";

const numbersStyle: React.CSSProperties = {
  fontSize: "xx-large",
  fontFamily: "source-code-pro,monospace",
  fontWeight: "bold",
  fill: "black",
  // "pointer-events": "none",
  userSelect: "none",
};

interface SingleCounterProps {
  value: number | string;
  textX: number | string;
  textY: number | string;
  imageX?: number | string;
  imageY?: number | string;
}

const singleCounter: React.FC<SingleCounterProps> = ({ value }) => {
  return (
    <svg>
      <image x="160" y="0" height="80" href="images/storage-limit.svg" />
      <text x="40" y="20">
        {value}
      </text>
    </svg>
  );
};

export const PlayerLimits: React.FC<{
  energyLimit: number;
  archiveLimit: number;
  researchLimit: number;
}> = ({ energyLimit, archiveLimit, researchLimit }) => {
  return (
    <svg viewBox="0 0 312 90">
      <image x="0" y="0" height="80" href="images/storage-limit.svg" />
      <image x="120" y="0" height="80" href="images/file-limit.svg" />
      <image x="220" y="0" height="80" href="images/research-limit.svg" />
      <text x="43" y="47" style={numbersStyle}>
        {energyLimit}
      </text>
      <text x="155" y="50" style={numbersStyle}>
        {archiveLimit}
      </text>
      <text x="268" y="44" style={numbersStyle}>
        {researchLimit}
      </text>
    </svg>
  );
};
