import React from "react";

export const CostCircle: React.FC<number> = (cost) => {
  return (
    <>
      <circle style={{ fill: "#e4d7a1" }} cx="17.25" cy="118.25" r="9.5" />
      <text x="11.75" y="124.25" className="numeric-value">
        {cost}
      </text>
    </>
  );
};
