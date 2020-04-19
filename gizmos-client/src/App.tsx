import React from "react";
import "./App.css";
import { Card } from "./components/card";
import { CardWithFileEffect, fileEffect } from "./cards/cardWithFileEffect";
import { TriggerType } from "./cards/card";
import { EnergyType } from "./basicGameElements";

function App() {
  const c = new CardWithFileEffect(123, TriggerType.Pick, fileEffect, 3, EnergyType.Red, 7, 2);
  return (
    <div className="App">
      <Card CardInfo={c} />
    </div>
  );
}

export default App;
