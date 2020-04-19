import React from "react";
import "./App.css";
import { CardWithFileEffect, fileEffect } from "./cards/cardWithFileEffect";
import { TriggerType } from "./cards/card";
import { EnergyType } from "./basicGameElements";
import { CardStack } from "./components/cardStack";

function App() {
  const collection = [
    new CardWithFileEffect(1, TriggerType.Converter, fileEffect, 7, EnergyType.Red, 7, 2),
    new CardWithFileEffect(2, TriggerType.Build, fileEffect, 4, EnergyType.Red, 7, 2),
    new CardWithFileEffect(3, TriggerType.Archive, fileEffect, 2, EnergyType.Red, 7, 2),
    new CardWithFileEffect(4, TriggerType.Pick, fileEffect, 1, EnergyType.Red, 7, 2),
    new CardWithFileEffect(738, TriggerType.Upgrade, fileEffect, 8, EnergyType.Red, 7, 2),
  ];
  return (
    <div className="App">
      <CardStack cards={collection} />
    </div>
  );
}

export default App;
