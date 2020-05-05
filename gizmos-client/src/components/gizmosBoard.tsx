import React from "react";
import { CardsPile } from "./cardsPile";
import { PlayerBar } from "./playerBar";
import { Client } from "boardgame.io/client";
import { GameState } from "../gameState";
import { GameContext } from "../gameContext";

interface BoardProps {
  G: GameState;
  ctx: GameContext;
  moves: unknown;
  events: unknown; //An object containing functions to dispatch various game events like endTurn and endPhase.
  reset: () => void;
  undo: () => void; //Function that undoes the last move.
  redo: () => void; //Function that redoes the previously undone move.
  //step: //Function that will advance the game if AI is configured.
  //log: //The game log.
  //gameID: //The game ID associated with the client.
  //playerID: //The player ID associated with the client.
  //gameMetadata: //An object containing the players that have joined the game from a room.
}

export const GizmosBoard: React.FC<BoardProps> = ({ G, ctx, moves, events }) => {
  const commonAreaGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateRows: "33% 34% 33%",
    margin: "40px",
  };

  //   const collection = [
  //     new CardWithFileEffect(1, TriggerType.Converter, fileEffect, 1, EnergyType.Blue, 1, 1),
  //     new CardWithFileEffect(2, TriggerType.Build, fileEffect, 1, EnergyType.Yellow, 1, 1),
  //     new CardWithFileEffect(2, TriggerType.Upgrade, fileEffect, 1, EnergyType.Black, 1, 1),
  //     new CardWithFileEffect(3, TriggerType.Archive, fileEffect, 2, EnergyType.Red, 1, 1),
  //     new CardWithFileEffect(42, TriggerType.Converter, fileEffect, 7, EnergyType.Blue, 2, 2),
  //     new CardWithFileEffect(21, TriggerType.Archive, fileEffect, 4, EnergyType.Yellow, 3, 2),
  //     new CardWithFileEffect(23, TriggerType.Archive, fileEffect, 2, EnergyType.Red, 2, 2),
  //     new CardWithFileEffect(71, TriggerType.Converter, fileEffect, 7, EnergyType.Blue, 4, 3),
  //     new CardWithFileEffect(82, TriggerType.Build, fileEffect, 4, EnergyType.Yellow, 6, 3),
  //   ];

  const styles1players = {
    display: "grid",
    height: "100vh",
    gridTemplateColumns: "50vw",
    gridTemplateRows: "50vh 50vh",
    gridTemplateAreas: `
        "commonArea ."
        "commonArea localPlayer"`,
  };

  return (
    <div style={styles1players}>
      <div id="commonArea" style={{ ...commonAreaGridStyle, gridArea: "commonArea" }}>
        <CardsPile cards={G.cards} />
      </div>
      <PlayerBar styles={{ gridArea: "localPlayer" }} />
    </div>
  );
};
