import React from "react";
import { EnergyType } from "../basicGameElements";
import { EnergyTypeDictionary } from "../cards/energyTypeDictionary";
import { EnergyOrb } from "./energyOrb";

export const EnergyCounter: React.FC<{ energyCount: EnergyTypeDictionary }> = ({ energyCount }) => {
  const numbersStyle: React.CSSProperties = {
    fontSize: "x-large",
    fontFamily: "source-code-pro,monospace",
    fontWeight: "bold",
    fill: "black",
  };

  const counters = Object.values(EnergyType)
    .filter((et) => et !== EnergyType.Any)
    .map((e) => (
      <div key={e} style={{ ...numbersStyle, margin: "3px", flexGrow: 1 }}>
        <EnergyOrb energyType={e} /> {energyCount.get(e)}
      </div>
    ));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        alignSelf: "stretch",
        justifySelf: "stretch",
      }}
    >
      {counters}
    </div>
  );
};
