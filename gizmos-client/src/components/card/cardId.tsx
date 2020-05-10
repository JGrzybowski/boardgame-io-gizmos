import React from "react";

export const CardIdCount: React.FC<{ cardId: number }> = ({ cardId }) => {
  const cardIdStyle = {
    fontSize: "0.4em",
    fontFamily: "source-code-pro,monospace",
    fill: "gray",
  };
  return (
    <text x="121.8" y="126" style={cardIdStyle}>
      {cardId.toString().padStart(3, "0")}
    </text>
  );
};
