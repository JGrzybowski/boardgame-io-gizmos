import React from "react";
import { CardWithFileEffect, fileEffect } from "../cards/cardWithFileEffect";
import { TriggerType } from "../cards/card";
import { EnergyType } from "../basicGameElements";
import { CardStack } from "./cardStack";
import { ActionButton } from "./actionButton";

export const PlayerBar: React.FC<{ styles?: React.CSSProperties }> = ({ styles = {} }) => {
  const collection = [
    new CardWithFileEffect(1, TriggerType.Converter, fileEffect, 7, EnergyType.Red, 7, 2),
    new CardWithFileEffect(2, TriggerType.Build, fileEffect, 4, EnergyType.Red, 7, 2),
    new CardWithFileEffect(3, TriggerType.Archive, fileEffect, 2, EnergyType.Red, 7, 2),
    new CardWithFileEffect(4, TriggerType.Pick, fileEffect, 1, EnergyType.Red, 7, 2),
  ];

  return (
    <div
      style={{
        ...styles,
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(150px, 1fr))",
        columnGap: "5px",
        justifyItems: "center",
      }}
    >
      <CardStack cards={collection} />
      <CardStack cards={collection} />
      <CardStack cards={collection} />
      <CardStack cards={collection} />

      <ActionButton actionName="File" desctiption="Take a card and put it into archive." />
      <ActionButton actionName="Pick" desctiption="Take an energy from the rail." />
      <ActionButton actionName="Build" desctiption="Spend energy to build a machine." />
      <ActionButton
        actionName="Research"
        desctiption="Take a peek at top cards from one of the piles and build or archive one of them."
      />
    </div>
  );
};

export const OpponentBar: React.FC<{ styles?: React.CSSProperties; flipped?: boolean }> = ({
  styles = {},
  flipped = false,
}) => {
  const collection = [
    new CardWithFileEffect(1, TriggerType.Converter, fileEffect, 7, EnergyType.Red, 7, 2),
    new CardWithFileEffect(2, TriggerType.Build, fileEffect, 4, EnergyType.Red, 7, 2),
    new CardWithFileEffect(3, TriggerType.Archive, fileEffect, 2, EnergyType.Red, 7, 2),
    new CardWithFileEffect(4, TriggerType.Pick, fileEffect, 1, EnergyType.Red, 7, 2),
  ];

  const flipStyle = flipped ? { transform: "rotate(180deg)" } : {};

  return (
    <div
      style={{
        ...styles,
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(150px, 1fr))",
        columnGap: "5px",
        justifyItems: "center",
      }}
    >
      <CardStack cards={collection} flipped={flipped} />
      <CardStack cards={collection} flipped={flipped} />
      <CardStack cards={collection} flipped={flipped} />
      <CardStack cards={collection} flipped={flipped} />
    </div>
  );
};
