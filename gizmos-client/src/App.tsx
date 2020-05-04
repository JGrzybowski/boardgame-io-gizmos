import React from "react";
import "./App.css";
import { PlayerBar } from "./components/playerBar";
import { CardsPile } from "./components/cardsPile";
import { TriggerType } from "./cards/cardInfo";
import { CardWithFileEffect, fileEffect } from "./cards/cardWithFileEffect";
import { EnergyType } from "./basicGameElements";
import { Client } from "boardgame.io/client";
import Gizmos from "./game";
import { Local } from "boardgame.io/multiplayer";
import { GizmosBoard } from "./components/gizmosBoard";

const collection = [
  new CardWithFileEffect(1, TriggerType.Converter, fileEffect, 1, EnergyType.Blue, 1, 1),
  new CardWithFileEffect(2, TriggerType.Build, fileEffect, 1, EnergyType.Yellow, 1, 1),
  new CardWithFileEffect(2, TriggerType.Upgrade, fileEffect, 1, EnergyType.Black, 1, 1),
  new CardWithFileEffect(3, TriggerType.Archive, fileEffect, 2, EnergyType.Red, 1, 1),
  new CardWithFileEffect(42, TriggerType.Converter, fileEffect, 7, EnergyType.Blue, 2, 2),
  new CardWithFileEffect(21, TriggerType.Archive, fileEffect, 4, EnergyType.Yellow, 3, 2),
  new CardWithFileEffect(23, TriggerType.Archive, fileEffect, 2, EnergyType.Red, 2, 2),
  new CardWithFileEffect(71, TriggerType.Converter, fileEffect, 7, EnergyType.Blue, 4, 3),
  new CardWithFileEffect(82, TriggerType.Build, fileEffect, 4, EnergyType.Yellow, 6, 3),
];

const GizmosClient = new Client({
  game: Gizmos,
  gameID: "default",
  board: GizmosBoard,
  playerId: "Player",
  // debug: false,
  numPlayers: 1,
  multiplayer: Local(),
});

export const App: React.FC = () => {
  return (
    <div className="App">
      <GizmosClient playerID="0" />
    </div>
  );
};

export default App;
