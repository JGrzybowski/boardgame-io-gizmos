import React from "react";
import { CardWithFileEffect, fileEffect } from "../cards/cardWithFileEffect";
import { TriggerType } from "../cards/card";
import { EnergyType } from "../basicGameElements";
import { CardStack, MiniCardStack } from "./cardStack";
import { ActionButton } from "./actionButton";
import { MiniCard } from "./card";
import { EnergyCounter } from "./energyCounter";
import { CardCost } from "../cards/cardCost";

export const PlayerBar: React.FC<{ styles?: React.CSSProperties }> = ({ styles = {} }) => {
  const collection = [
    new CardWithFileEffect(1, TriggerType.Converter, fileEffect, 7, EnergyType.Blue, 2, 2),
    new CardWithFileEffect(2, TriggerType.Build, fileEffect, 4, EnergyType.Yellow, 4, 3),
    new CardWithFileEffect(3, TriggerType.Archive, fileEffect, 2, EnergyType.Red, 3, 1),
    new CardWithFileEffect(4, TriggerType.Pick, fileEffect, 1, EnergyType.Black, 6, 1),
    new CardWithFileEffect(4, TriggerType.Upgrade, fileEffect, 0, EnergyType.Any, 1, 3),
  ];

  return (
    <div
      style={{
        ...styles,
        display: "grid",
        gridTemplateColumns: "repeat(5, minmax(150px, 1fr))",
        columnGap: "5px",
        justifyItems: "center",
        alignItems: "end",
      }}
    >
      <MiniCardStack cards={collection} />
      <MiniCardStack cards={collection} />
      <MiniCardStack cards={collection} />
      <MiniCardStack cards={collection} />
      <CardStack cards={[collection[0], collection[1]]} />

      <ActionButton actionName="File" desctiption="Take a card and put it into archive." />
      <ActionButton actionName="Pick" desctiption="Take an energy from the rail." />
      <ActionButton actionName="Build" desctiption="Spend energy to build a machine." />
      <ActionButton
        actionName="Research"
        desctiption="Take a peek at top cards from one of the piles and build or archive one of them."
      />

      <EnergyCounter energyCount={new CardCost(2, 5, 1, 5)} />
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
        gridTemplateColumns: "repeat(5, minmax(150px, 1fr))",
        columnGap: "5px",
        justifyItems: "center",
        alignItems: flipped ? "start" : "end",
      }}
    >
      <MiniCardStack cards={collection} flipped={flipped} />
      <MiniCardStack cards={collection} flipped={flipped} />
      <MiniCardStack cards={collection} flipped={flipped} />
      <MiniCardStack cards={collection} flipped={flipped} />
      <CardStack cards={[collection[0], collection[1]]} />
    </div>
  );
};
