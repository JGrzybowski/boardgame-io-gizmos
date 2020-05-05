import React from "react";
import { CardWithFileEffect, fileEffect } from "../cards/cardWithFileEffect";
import { TriggerType } from "../cards/cardInfo";
import { EnergyType } from "../basicGameElements";
import { CardStack, MiniCardStack } from "./cardStack";
import { ActionButton } from "./actionButton";
import { EnergyCounter } from "./energyCounter";
import { EnergyTypeDictionary } from "../cards/energyTypeDictionary";
import { PlayerState } from "../playerState";

export const PlayerBar: React.FC<{ style?: React.CSSProperties; playerState: PlayerState }> = ({
  style = {},
  playerState,
}) => {
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
        ...style,
        borderBottom: "1px solid black",
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
      <CardStack cards={[...(playerState?.archive ?? [])]} />

      <EnergyCounter energyCount={new EnergyTypeDictionary(2, 5, 1, 5)} />
    </div>
  );
};
