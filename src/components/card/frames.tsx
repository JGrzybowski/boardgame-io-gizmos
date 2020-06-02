import React from "react";
import { EnergyType } from "../../energyType";
import { accentBorder } from "../colorDictionary";

export function SingleColorFrame(energyType: EnergyType): JSX.Element {
  const frameColor =
    energyType === EnergyType.Red
      ? accentBorder.R
      : energyType === EnergyType.Blue
      ? accentBorder.U
      : energyType === EnergyType.Black
      ? accentBorder.B
      : energyType === EnergyType.Yellow
      ? accentBorder.Y
      : "pink";

  return (
    <path
      d="M128.25,120.9h-6.37v5.84H28.67c.28-.55,4.43-9,0-15.75a13,13,0,0,0-4.75-4.25c3.32-5.67,2.4-12.65-1.88-16.66-5.11-4.8-12.32-2.86-12.67-2.76V67.63H0v59.8a9.22,9.22,0,0,0,9.19,9.19H127.44a9.22,9.22,0,0,0,9.19-9.19V67.64h-8.38Z"
      style={{ fill: frameColor }}
    />
  );
}

export const MultiColorFrame = (
  <g style={{ clipPath: "url(#clip-path)" }}>
    <path
      d="M128.25,120.9h-6.37v5.84H28.67c.28-.55,4.43-9,0-15.75a13,13,0,0,0-4.75-4.25c3.32-5.67,2.4-12.65-1.88-16.66-5.11-4.8-12.32-2.86-12.67-2.76V67.63H0v59.8a9.22,9.22,0,0,0,9.19,9.19H127.44a9.22,9.22,0,0,0,9.19-9.19V67.64h-8.38Z"
      fill="#bd1f23"
    />
    <path fill="#191a1a" d="M61.49,112.34q-8.48,21-16.94,42.1L81.23,159l-9.39-48.13Z" />
    <path fill="#5b6aab" d="M48.87,108.73,6,147.37,36.1,166l35-64.38Z" />
    <path fill="#5b6aab" d="M97.68,116.21l55.84,29.52,9.87-52-56.81,6Z" />
    <path fill="#e1a72e" d="M39.33,100.15l-57.49,21.67C-11,133-6.8,144.73.36,155.89l50.38-50Z" />
    <path fill="#e1a72e" d="M82,112.92l32.62,35.61,37.64-2.61-48-32.8Z" />
    <path fill="#191a1a" d="M95.16,101.31l71.42-5.61-1.74-31.65-55,4.65Q102.52,85,95.16,101.31Z" />
  </g>
);
