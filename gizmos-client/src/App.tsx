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
    gridTemplateRows: "33vh 34vh 33vh",
    gridTemplateAreas: `
    "op1 commonArea"
    " .  commonArea" 
    " .  localPlayer"`,
  };

  const styles3players = {
    display: "grid",
    height: "100vh",
    gridTemplateColumns: "50vw 50vw",
    gridTemplateRows: "33vh 34vh 33vh",
    gridTemplateAreas: `
    "op1 commonArea"
    " .  commonArea" 
    "op2 localPlayer"`,
  };

  const styles4players = {
    display: "grid",
    height: "100vh",
    gridTemplateColumns: "50vw 50vw",
    gridTemplateRows: "33vh 34vh 33vh",
    gridTemplateAreas: `
    "op1 commonArea"
    "op2 commonArea" 
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

  const commonAreaGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateRows: "33% 34% 33%",
    margin: "40px",
  };

  return (
    <div className="App" style={styles4players}>
      <OpponentBar styles={{ gridArea: "op1", alignSelf: "top" }} />
      <OpponentBar styles={{ gridArea: "op2", alignSelf: "top" }} />
      <OpponentBar styles={{ gridArea: "op3", alignSelf: "bottom" }} />

      <div id="commonArea" style={{ ...commonAreaGridStyle, gridArea: "commonArea" }}>
        <CardsPile cards={collection} />
      </div>

      <PlayerBar styles={{ gridArea: "localPlayer" }} />
    </div>
  );
};

export default App;
