import React from "react";
import { CardInfo } from "../cards/card";
import { Card } from "./card";

export const CardStack: React.FC<{ cards: ReadonlyArray<CardInfo>; flipped?: boolean }> = ({ cards, flipped }) => {
  const gridStyle = {
    display: "grid",
    gridTemplateRows: `repeat(${cards.length - 1}, 47px)`,
    width: "75%",
    transform: flipped ? "rotate(180deg)" : "",
  };

  const renderedCards = cards.map((c: CardInfo) => <Card key={c.cardId} {...c} />);

  return <div style={gridStyle}>{renderedCards}</div>;
};
