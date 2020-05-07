import React from "react";
import { CardInfo } from "../cards/cardInfo";
import { Card } from "./card";
import { CardBack } from "./cardBack";

export const CardsPile: React.FC<{ cards: ReadonlyArray<CardInfo>; moves: any }> = ({ cards, moves }) => {
  const flexStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  };

  const renderCard = (c: CardInfo): JSX.Element => (
    <Card
      key={c.cardId}
      {...c}
      OnBuildButtonClick={() => moves.buildFromCommonAction(c.cardId)}
      OnArchiveButtonClick={() => moves.archiveAction(c.cardId)}
    />
  );
  const level1Cards = cards
    .filter((c: CardInfo) => c.level === 1)
    .slice(0, 4)
    .map(renderCard);
  const level2Cards = cards
    .filter((c: CardInfo) => c.level === 2)
    .slice(0, 3)
    .map(renderCard);
  const level3Cards = cards
    .filter((c: CardInfo) => c.level === 3)
    .slice(0, 2)
    .map(renderCard);

  return (
    <>
      <div style={{ ...flexStyle, gridRow: "1/2" }}>
        <CardBack level={3} onClick={() => moves.researchAction(3)} />
        {level3Cards}
      </div>
      <div style={{ ...flexStyle, gridRow: "2/3" }}>
        <CardBack level={2} onClick={() => moves.researchAction(2)} />
        {level2Cards}
      </div>
      <div style={{ ...flexStyle, gridRow: "3/4" }}>
        <CardBack level={1} onClick={() => moves.researchAction(1)} />
        {level1Cards}
      </div>
    </>
  );
};
