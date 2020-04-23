import React, { SVGProps } from "react";
import { CardInfo, TriggerType } from "../cards/card";
import { upperFrame, corners, accentBorder, triggerBoxBorder, triggerBox } from "./colorDictionary";
import { EnergyType } from "../basicGameElements";

const numbersStyle = {
  "font-size": "large",
  "font-family": "source-code-pro,monospace",
  "font-weight": "bold",
  fill: "black",
};

const victoryPointsCount: React.FC<{ level: number; victoryPoints: number }> = ({ level, victoryPoints }) => (
  <>
    <path
      style={{ fill: level === 3 ? corners.brown : corners.gray }}
      d="M132.5,29.25a26.54,26.54,0,0,0,4.12-.32V9.19A9.19,9.19,0,0,0,127.43,0H111.67a18,18,0,0,0-2.42,9C109.25,20.18,119.66,29.25,132.5,29.25Z"
    />
    <text x="116" y="17.5" style={numbersStyle}>
      {victoryPoints}
    </text>
    <image x="120.5" y="4" width="15" height="15" xlinkHref={"images/victory-point.svg"} />
  </>
);

const cardIdCount: React.FC<number> = (cardId) => {
  const cardIdStyle = {
    "font-size": "0.4em",
    "font-family": "source-code-pro,monospace",
    fill: "gray",
  };
  return (
    <text x="121.8" y="126" style={cardIdStyle}>
      {cardId.toString().padStart(3, "0")}
    </text>
  );
};

function triggerIcon(triggerType: TriggerType): JSX.Element {
  return triggerType === TriggerType.Archive ? (
    <image x="5" y="5.5" width="20" height="20" xlinkHref="images/file-trigger.svg" />
  ) : triggerType === TriggerType.Build ? (
    <image x="5" y="3.5" width="19" height="19" xlinkHref="images/build-trigger.svg" />
  ) : triggerType === TriggerType.Converter ? (
    <image x="8" y="3.5" width="20" height="20" xlinkHref="images/convert-trigger.svg" />
  ) : triggerType === TriggerType.Pick ? (
    <image x="4" y="3.5" width="20" height="20" xlinkHref="images/pick-trigger.svg" />
  ) : triggerType === TriggerType.Upgrade ? (
    <image x="6" y="5.5" width="16" height="16" xlinkHref="images/upgrade-trigger.svg" />
  ) : (
    <></>
  );
}

export const MiniCard: React.FC<CardInfo> = ({ type, victoryPoints, level, color, cost, cardId }) => {
  const colors = {
    "frame-general": level === 3 ? upperFrame.brown : upperFrame.gray, //gray, can also be beige for III lvl cards
    "trigger-filter-box": level === 3 ? triggerBox.brown : triggerBox.gray, //gray, can also be beige for III lvl cards
    "trigger-filter-box-border": level === 3 ? triggerBoxBorder.brown : triggerBoxBorder.gray,
  };

  return (
    <div style={{ height: "100%", width: "100%", margin: "auto" }}>
      <svg viewBox="0 0 136.63 136.63" xmlnsXlink="http://www.w3.org/1999/xlink">
        <defs>
          <clipPath id="clip-path">
            <rect x="0.01" width="136.62" height="36.25" style={{ fill: "none" }} />
          </clipPath>
        </defs>
        <g style={{ clipPath: "url(#clip-path)" }}>
          <path
            d="M9.19,0H127.43a9.19,9.19,0,0,1,9.19,9.19V127.44a9.19,9.19,0,0,1-9.19,9.19H9.19A9.19,9.19,0,0,1,0,127.44V9.19A9.19,9.19,0,0,1,9.19,0"
            style={{ fill: "#b7a770" }}
          />
          <polygon
            points="12.75 32.5 68.75 32.5 74.25 20.5 59.5 5.75 12.75 5.75 12.75 32.5"
            style={{ fill: "#8b7e54", stroke: "#736845", strokeMiterlimit: 10, strokeWidth: ".75px" }}
          />
          <path
            style={{ fill: "#d8cdab" }}
            d="M31.5,8a17.88,17.88,0,0,0-1.89-8H9.19A9.2,9.2,0,0,0,0,9.19V26.93a26.17,26.17,0,0,0,8.25,1.32C21.09,28.25,31.5,19.18,31.5,8Z"
          />
          <path
            style={{ fill: "#d8cdab" }}
            d="M132.5,29.25a26.54,26.54,0,0,0,4.12-.32V9.19A9.19,9.19,0,0,0,127.43,0H111.67a18,18,0,0,0-2.42,9C109.25,20.18,119.66,29.25,132.5,29.25Z"
          />
        </g>
        ]{/* Trigger Box */}
        <polygon
          points="12.75 32.5 68.75 32.5 74.25 20.5 59.5 5.75 12.75 5.75 12.75 32.5"
          style={{ fill: colors["trigger-filter-box"], stroke: colors["trigger-filter-box-border"] }}
          stroke-miterlimit="10"
          stroke-width="0.75"
        />
        {/* Trigger Corners */}
        <path
          style={{ fill: level === 3 ? corners.brown : corners.gray }}
          d="M31.5,8a17.88,17.88,0,0,0-1.89-8H9.19A9.2,9.2,0,0,0,0,9.19V26.93a26.17,26.17,0,0,0,8.25,1.32C21.09,28.25,31.5,19.18,31.5,8Z"
        />
        {triggerIcon(type)}
        {victoryPointsCount({ level, victoryPoints })}
        {cardIdCount}
      </svg>
    </div>
  );
};
