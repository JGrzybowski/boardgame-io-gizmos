import React from "react";
import { CardInfo } from "../cards/cardInfo";
import { Card } from "./card";
import { CardBack } from "./cardBack";
import { CardWithLevel } from "../cards/cardsCollection";

export const CardsPile: React.FC<{ cards: ReadonlyArray<CardInfo>; moves: any }> = ({ cards, moves }) => {
  const flexStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
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
  const level1Cards = cards.filter(CardWithLevel(1)).map(renderCard);
  const level2Cards = cards.filter(CardWithLevel(2)).map(renderCard);
  const level3Cards = cards.filter(CardWithLevel(3)).map(renderCard);

  return (
    <div style={{ alignSelf: "stretch", justifySelf: "stretch" }}>
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
    </div>
  );
};
