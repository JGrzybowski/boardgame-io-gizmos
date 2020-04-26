import React from "react";
import { CardInfo } from "../cards/card";
import { Card, MiniCard } from "./card";

export const CardStack: React.FC<{ cards: ReadonlyArray<CardInfo>; flipped?: boolean }> = ({ cards, flipped }) => {
  const flexStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column-reverse",
    width: "75%",
  };

  const renderedCards = cards.map((c: CardInfo) => <MiniCard key={c.cardId} {...c} />);

  return <div style={flexStyle}>{renderedCards}</div>;
};
