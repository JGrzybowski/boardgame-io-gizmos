import React from "react";
import { EnergyType } from "../basicGameElements";

export const EnergyOrb: React.FC<{ energyType: EnergyType }> = ({ energyType }) => {
  const svgSrc =
    energyType === EnergyType.Red
      ? "images/energy-red.svg"
      : energyType === EnergyType.Blue
      ? "images/energy-blue.svg"
      : energyType === EnergyType.Black
      ? "images/energy-black.svg"
      : energyType === EnergyType.Yellow
      ? "images/energy-yellow.svg"
      : "images/energy-any.svg";
  return <img src={svgSrc} alt={`energy ${energyType}`} />;
};
