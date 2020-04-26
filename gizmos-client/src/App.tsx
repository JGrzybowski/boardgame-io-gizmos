import React from "react";
import "./App.css";
import { PlayerBar } from "./components/playerBar";
import { OpponentBar } from "./components/playerBar";
import { CardsPile } from "./components/cardsPile";
import { TriggerType } from "./cards/card";
import { CardWithFileEffect, fileEffect } from "./cards/cardWithFileEffect";
import { EnergyType } from "./basicGameElements";

export const App: React.FC = () => {
  const styles2players = {
    display: "grid",
    height: "100vh",
    gridTemplateColumns: "50vw 50vw",
    gridTemplateRows: "30vh 40vh 30vh",
    gridTemplateAreas: `
    "op1 op1"
     "commonArea commonArea" 
     "localPlayer localPlayer"`,
  };

  const styles3players = {
    display: "grid",
    gridTemplateColumns: "50vw 50vw",
    gridTemplateRows: "30vh 40vh 30vh",
    gridTemplateAreas: `"op1 op2"
    "commonArea commonArea" 
    "localPlayer localPlayer"`,
  };

  const styles4players = {
    display: "grid",
    gridTemplateColumns: "50vw 50vw",
    gridTemplateRows: "30vh 30vh 30vh",
    gridTemplateAreas: `"op1 op2"
    "commonArea commonArea" 
    "op3 localPlayer"`,
  };

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

  return (
    <div className="App" style={styles4players}>
      <OpponentBar styles={{ gridArea: "op1", alignSelf: "top" }} flipped={true} />
      <OpponentBar styles={{ gridArea: "op2", alignSelf: "top" }} flipped={true} />

      <div style={{ display: "flex", flexDirection: "row", gridArea: "commonArea" }}>
        <CardsPile cards={collection} />
      </div>

      <OpponentBar styles={{ gridArea: "op3", alignSelf: "bottom" }} />
      <PlayerBar styles={{ gridArea: "localPlayer" }} />
    </div>
  );
};

export default App;
