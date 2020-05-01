import React from "react";
import { CardInfo } from "../cards/card";
import { Card } from "./card";
import { CardBack } from "./cardBack";

export const CardsPile: React.FC<{ cards: ReadonlyArray<CardInfo> }> = ({ cards }) => {
  const flexStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  };

  const renderCard = (c: CardInfo): JSX.Element => <Card key={c.cardId} {...c} />;
  const level1Cards = cards.filter((c) => c.level === 1).map(renderCard);
  const level2Cards = cards.filter((c) => c.level === 2).map(renderCard);
  const level3Cards = cards.filter((c) => c.level === 3).map(renderCard);

  return (
    <>
      <div style={{ ...flexStyle, gridRow: "1/2" }}>
        <CardBack level={3} />
        {level3Cards}
      </div>
      <div style={{ ...flexStyle, gridRow: "2/3" }}>
        <CardBack level={2} />
        {level2Cards}
      </div>
      <div style={{ ...flexStyle, gridRow: "3/4" }}>
        <CardBack level={1} />
        {level1Cards}
      </div>
    </>
  );
};
