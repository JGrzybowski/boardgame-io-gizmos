import React from "react";
import { EnergyType } from "../basicGameElements";
import { ReactComponent as EnergyImgR } from "../images/energy-red.svg";
import { ReactComponent as EnergyImgU } from "../images/energy-blue.svg";
import { ReactComponent as EnergyImgB } from "../images/energy-black.svg";
import { ReactComponent as EnergyImgY } from "../images/energy-yellow.svg";
import { ReactComponent as EnergyImgAny } from "../images/energy-any.svg";

export const EnergyOrb: React.FC<{ energyType: EnergyType }> = ({ energyType }) => {
  const svg =
    energyType === EnergyType.Red
      ? EnergyImgR
      : energyType === EnergyType.Blue
      ? EnergyImgU
      : energyType === EnergyType.Black
      ? EnergyImgB
      : energyType === EnergyType.Yellow
      ? EnergyImgY
      : EnergyImgAny;
  return <>{svg}</>;
};
