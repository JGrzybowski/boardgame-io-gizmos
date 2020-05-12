import React, { MouseEventHandler } from "react";
import { EnergyType } from "../basicGameElements";

export const EnergyOrb: React.FC<{
  energyType: EnergyType;
  onClick?: MouseEventHandler<HTMLImageElement>;
  style?: React.CSSProperties;
}> = ({ energyType, onClick, style }) => {
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

  return (
    <div className={`energy-orb ${onClick ? "has-action-buttons" : ""}`} style={style}>
      <img src={svgSrc} alt={`energy ${energyType}`} />
      {onClick && (
        <div className="action-buttons">
          <img src="images/button-pick.svg" alt="Pick action button" onClick={onClick} />
        </div>
      )}
    </div>
  );
};
