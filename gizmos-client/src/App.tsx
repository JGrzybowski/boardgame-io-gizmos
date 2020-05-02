import React from "react";
import "./App.css";
import { PlayerBar } from "./components/playerBar";
import { CardsPile } from "./components/cardsPile";
import { TriggerType } from "./cards/card";
import { CardWithFileEffect, fileEffect } from "./cards/cardWithFileEffect";
import { EnergyType } from "./basicGameElements";
import { Local } from "boardgame.io/multiplayer";
import { ActionButton } from "./components/actionButton";
import Gizmos from "./game";
import { Client } from "boardgame.io/client";

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

const client = new Client({
  game: Gizmos,
  gameID: "default",
  playerId: "Player",
  debug: false,
  numPlayers: 1,
  multiplayer: Local(),
});
client.start();

export const App: React.FC = () => {
  const styles1players = {
    display: "grid",
    height: "100vh",
    gridTemplateColumns: "50vw",
    gridTemplateRows: "50vh 50vh",
    gridTemplateAreas: `
    "commonArea localPlayer"
    "commonArea actions"`,
  };

  const commonAreaGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateRows: "33% 34% 33%",
    margin: "40px",
  };

  return (
    <div className="App" style={styles1players}>
      <div id="commonArea" style={{ ...commonAreaGridStyle, gridArea: "commonArea" }}>
        <CardsPile cards={collection} />
      </div>

      <PlayerBar styles={{ gridArea: "localPlayer" }} />

      <div style={{ gridArea: "actions" }}>
        {/* <button onClick="selectCardForArchive">File</button> */}
        {/* <button onClick="selectOrbToPick">File</button> */}
        {/* <button onClick="selectCardToPick">File</button> */}
        {/* <button onClick="selectPileToResearch">File</button> */}
        {/* <ActionButton actionName="File"   desctiption="Take a card and put it into archive." />
        <ActionButton actionName="Pick"   desctiption="Take an energy from the rail." />
        <ActionButton actionName="Build"  desctiption="Spend energy to build a machine." />
        <ActionButton
          actionName="Research"
          desctiption="Take a peek at top cards from one of the piles and build or archive one of them."
        /> */}
      </div>
    </div>
  );
};

export default App;
