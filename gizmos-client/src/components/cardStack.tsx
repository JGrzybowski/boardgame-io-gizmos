import React from "react";
import { CardInfo } from "../cards/card";
import { Card } from "./card";

export const CardStack: React.FC<{ cards: ReadonlyArray<CardInfo> }> = ({ cards }) => {
  const gridStyle = {
    display: "grid",
    "grid-template-rows": "repeat(5, 47px)",
    width: "200px",
  };

  const renderedCards = cards.map((c: CardInfo) => <Card key={c.cardId} {...c} />);

  return <div style={gridStyle}>{renderedCards}</div>;
};
