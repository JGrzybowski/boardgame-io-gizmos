import React from "react";
import { EnergyType } from "../basicGameElements";
import { CardCost } from "../cards/cardCost";

export const EnergyCounter: React.FC<{ energyCount: CardCost }> = ({ energyCount }) => {
  const counters = Object.values(EnergyType)
    .filter((et) => et !== EnergyType.Any)
    .map((e) => <div style={{ margin: "3px" }}>{e.toString()} = 0</div>);

  return <div style={{ display: "flex", flexDirection: "row" }}>{counters}</div>;
};
