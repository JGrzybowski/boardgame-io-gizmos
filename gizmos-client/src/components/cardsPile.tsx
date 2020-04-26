import React from "react";
import { CardInfo, CardLevel } from "../cards/card";
import { MiniCard, CardBack, Card } from "./card";

export const CardsPile: React.FC<{ cards: ReadonlyArray<CardInfo> }> = ({ cards }) => {
  const flexStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  };

  const renderCard = (c: CardInfo) => <Card key={c.cardId} {...c} />;
  const level1Cards = cards.filter((c) => c.level === 1).map(renderCard);
  const level2Cards = cards.filter((c) => c.level === 2).map(renderCard);
  const level3Cards = cards.filter((c) => c.level === 3).map(renderCard);

  return (
    <div style={flexStyle}>
      <CardBack level={1} />
      {level1Cards}
      <CardBack level={2} />
      {level2Cards}
      <CardBack level={3} />
      {level3Cards}
    </div>
  );
};
