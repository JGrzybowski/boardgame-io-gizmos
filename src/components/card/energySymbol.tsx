import React from "react";
import { EnergyType } from "../../energyType";

export const EnergySymbol: React.FC<EnergyType> = (energyType) => {
  const energySvgLink =
    energyType === EnergyType.Red
      ? "images/energy-red.svg"
      : energyType === EnergyType.Blue
      ? "images/energy-blue.svg"
      : energyType === EnergyType.Black
      ? "images/energy-black.svg"
      : energyType === EnergyType.Yellow
      ? "images/energy-yellow.svg"
      : "images/energy-any.svg";

  return <image x="7.5" y="91" width="15" height="15" xlinkHref={energySvgLink} />;
};
