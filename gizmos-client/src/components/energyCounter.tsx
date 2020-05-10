import React, { MouseEventHandler } from "react";
import { EnergyType } from "../basicGameElements";
import { EnergyTypeDictionary } from "../cards/energyTypeDictionary";
import { EnergyOrb } from "./energyOrb";

export const EnergyCounter: React.FC<{
  energyCount: EnergyTypeDictionary;
  showAny?: boolean;
  onClick?: (energyType: EnergyType) => MouseEventHandler<HTMLImageElement>;
}> = ({ energyCount, showAny, onClick }) => {
  const counters = Object.values(EnergyType)
    .filter((et) => showAny || et !== EnergyType.Any)
    .map((e) => (
      <div key={e} className="numeric-value" style={{ fontSize: "x-large", margin: "3px", flexGrow: 1 }}>
        <EnergyOrb energyType={e} onClick={onClick && onClick(e)} /> {energyCount.get(e)}
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
