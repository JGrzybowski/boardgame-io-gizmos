import React from "react";
import { corners } from "../colorDictionary";

export const VictoryPointsCount: React.FC<{ level: number; victoryPoints: number }> = ({ level, victoryPoints }) => (
  <>
    <path
      style={{ fill: level === 3 ? corners.brown : corners.gray }}
      d="M132.5,29.25a26.54,26.54,0,0,0,4.12-.32V9.19A9.19,9.19,0,0,0,127.43,0H111.67a18,18,0,0,0-2.42,9C109.25,20.18,119.66,29.25,132.5,29.25Z"
    />
    <text x="116" y="17.5" className="numeric-value">
      {victoryPoints}
    </text>
    <image x="120.5" y="4" width="15" height="15" xlinkHref={"images/victory-point.svg"} />
  </>
);
