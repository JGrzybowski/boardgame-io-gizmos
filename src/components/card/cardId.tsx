import React from "react";

export const CardIdCount: React.FC<{ cardId: number }> = ({ cardId }) => {
  const cardIdStyle = {
    fontSize: "0.4em",
    fontFamily: "source-code-pro,monospace",
    fill: "white",
  };
  return (
    <text x="64" y="132" style={cardIdStyle}>
      {cardId.toString().padStart(3, "0")}
    </text>
  );
};
