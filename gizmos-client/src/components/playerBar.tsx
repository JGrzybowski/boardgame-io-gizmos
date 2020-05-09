import React, { ReactNode } from "react";
import { TriggerType, CardInfo } from "../cards/cardInfo";
import { CardStack } from "./cardStack";
import { EnergyCounter } from "./energyCounter";
import { PlayerState } from "../playerState";
import { Card, MiniCard } from "./card";
import { EnergyType } from "../basicGameElements";
import { PlayerLimits } from "./playerLimits";

function renderMiniCard(card: CardInfo): ReactNode {
  return <MiniCard key={card.cardId} {...card} OnActivateButtonClick={() => alert(`activation ${card.cardId}`)} />;
}

export const PlayerBar: React.FC<{ style?: React.CSSProperties; playerState: PlayerState; moves: any }> = ({
  style = {},
  playerState,
  moves,
}) => {
  return (
    <div
      style={{
        ...style,
        borderBottom: "1px solid black",
        display: "grid",
        gridTemplateColumns: "repeat(6, minmax(150px, 1fr))",
        columnGap: "5px",
        justifyItems: "center",
        alignItems: "end",
        alignSelf: "end",
      }}
    >
      <CardStack>{playerState.machines.filter((m) => m.type === TriggerType.Upgrade).map(renderMiniCard)}</CardStack>
      <CardStack>{playerState.machines.filter((m) => m.type === TriggerType.Converter).map(renderMiniCard)} </CardStack>
      <CardStack>{playerState.machines.filter((m) => m.type === TriggerType.Archive).map(renderMiniCard)} </CardStack>
      <CardStack>{playerState.machines.filter((m) => m.type === TriggerType.Pick).map(renderMiniCard)} </CardStack>
      <CardStack>{playerState.machines.filter((m) => m.type === TriggerType.Build).map(renderMiniCard)} </CardStack>

      <CardStack>
        {playerState?.archive?.map?.((card) => (
          <Card key={card.cardId} {...card} OnBuildButtonClick={() => moves.buildFromArchiveAction(card.cardId)} />
        ))}
      </CardStack>

      <EnergyCounter
        energyCount={playerState.energyStorage}
        onClick={(energyType: EnergyType) => () => moves.payAction(energyType)}
      />
      <PlayerLimits
        energyLimit={playerState.energyStorageCapacity}
        archiveLimit={playerState.archiveLimit}
        researchLimit={playerState.researchLimit}
      />
    </div>
  );
};
