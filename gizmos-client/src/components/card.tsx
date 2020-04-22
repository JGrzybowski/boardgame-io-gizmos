import React from "react";
import { CardInfo, TriggerType } from "../cards/card";
import { upperFrame, corners, accentBorder, triggerBoxBorder, triggerBox } from "./colorDictionary";
import { EnergyType } from "../basicGameElements";

export const Card: React.FC<CardInfo> = ({ type, victoryPoints, level, color, cost, cardId }) => {
  const energySvgLink =
    color === EnergyType.Red
      ? "../images/energy-red.svg"
      : color === EnergyType.Blue
      ? "../images/energy-blue.svg"
      : color === EnergyType.Black
      ? "../images/energy-black.svg"
      : color === EnergyType.Yellow
      ? "../images/energy-yellow.svg"
      : "../images/energy-any.svg";

  const triggerIcon =
    type === TriggerType.Archive
      ? { x: "5", y: "5.5", width: "20", height: "20", xlinkHref: "images/file-trigger.svg" }
      : type === TriggerType.Build
      ? { x: "5", y: "3.5", width: "19", height: "19", xlinkHref: "images/build-trigger.svg" }
      : type === TriggerType.Converter
      ? { x: "8", y: "3.5", width: "20", height: "20", xlinkHref: "images/convert-trigger.svg" }
      : type === TriggerType.Pick
      ? { x: "4", y: "3.5", width: "20", height: "20", xlinkHref: "images/pick-trigger.svg" }
      : type === TriggerType.Upgrade
      ? { x: "6", y: "5.5", width: "16", height: "16", xlinkHref: "images/upgrade-trigger.svg" }
      : {};

  const colors = {
    "upper-corner": level === 3 ? corners.brown : corners.gray, //gray, can also be beige for III lvl cards
    "frame-general": level === 3 ? upperFrame.brown : upperFrame.gray, //gray, can also be beige for III lvl cards
    "frame-accent":
      color === EnergyType.Red
        ? accentBorder.R
        : color === EnergyType.Blue
        ? accentBorder.U
        : color === EnergyType.Black
        ? accentBorder.B
        : color === EnergyType.Yellow
        ? accentBorder.Y
        : "black",
    illustration: "#fff",
    "cost-circle": "#e4d7a1",
    "cost-accent": "#d92730", //red can be also one of RUBY or Any (mixed)
    "trigger-filter-box": level === 3 ? triggerBox.brown : triggerBox.gray, //gray, can also be beige for III lvl cards
    "trigger-filter-box-border": level === 3 ? triggerBoxBorder.brown : triggerBoxBorder.gray,
  };

  const numbersStyle = {
    "font-size": "large",
    "font-family": "source-code-pro,monospace",
    "font-weight": "bold",
    fill: "black",
  };

  const cardIdStyle = {
    "font-size": "0.4em",
    "font-family": "source-code-pro,monospace",
    fill: "gray",
  };

  const multiColorFrame = (
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

  function singleColorFrame(energyType: EnergyType): JSX.Element {
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

  const frame = color === EnergyType.Any ? multiColorFrame : singleColorFrame(color);

  return (
    <div style={{ height: "100%", width: "100%", margin: "auto" }}>
      <svg viewBox="0 0 136.63 136.63" xmlnsXlink="http://www.w3.org/1999/xlink">
        <defs>
          <clipPath id="clip-path">
            <path
              fill="none"
              d="M128.25,120.9h-6.37v5.84H28.67c.28-.55,4.43-9,0-15.75a13,13,0,0,0-4.75-4.25c3.32-5.67,2.4-12.65-1.88-16.66-5.11-4.8-12.32-2.86-12.67-2.76V67.63H0v59.8a9.22,9.22,0,0,0,9.19,9.19H127.44a9.22,9.22,0,0,0,9.19-9.19V67.64h-8.38Z"
            />
          </clipPath>
        </defs>
        <path
          d="M9.19,0H127.43a9.19,9.19,0,0,1,9.19,9.19V127.44a9.19,9.19,0,0,1-9.19,9.19H9.19A9.19,9.19,0,0,1,0,127.44V9.19A9.19,9.19,0,0,1,9.19,0"
          style={{ fill: colors["frame-general"] }}
        />
        {frame}
        {/* Ilustration */}
        <path
          style={{ fill: colors.illustration }}
          d="M12.75,36.25h112V118.5h-6V124l-86.66.66c.38-1.32,2.82-10.41-2.39-16.15a12,12,0,0,0-2.78-2.24c3-6.65,1.72-14.09-3-18.27-4.39-3.91-10-3.46-11.21-3.34Z"
        />
        {/* Color Symbol */}
        <circle style={{ fill: "pink" }} cx="15" cy="98.58" r="7.25" />
        <image x="7.5" y="91" width="15" height="15" xlinkHref={energySvgLink} />
        <circle style={{ fill: colors["cost-circle"] }} cx="17.25" cy="118.25" r="9.5" />
        <text x="12.5" y="123.75" style={numbersStyle}>
          {cost}
        </text>
        <polygon
          points="12.75 32.5 68.75 32.5 74.25 20.5 59.5 5.75 12.75 5.75 12.75 32.5"
          style={{ fill: colors["trigger-filter-box"], stroke: colors["trigger-filter-box-border"] }}
          stroke-miterlimit="10"
          stroke-width="0.75"
        />
        {/* Trigger Corners */}
        <path
          style={{ fill: colors["upper-corner"] }}
          d="M31.5,8a17.88,17.88,0,0,0-1.89-8H9.19A9.2,9.2,0,0,0,0,9.19V26.93a26.17,26.17,0,0,0,8.25,1.32C21.09,28.25,31.5,19.18,31.5,8Z"
        />
        <image {...triggerIcon} />
        {/* Victory points corner */}
        <path
          style={{ fill: colors["upper-corner"] }}
          d="M132.5,29.25a26.54,26.54,0,0,0,4.12-.32V9.19A9.19,9.19,0,0,0,127.43,0H111.67a18,18,0,0,0-2.42,9C109.25,20.18,119.66,29.25,132.5,29.25Z"
        />
        <text x="118" y="17.5" style={numbersStyle}>
          {victoryPoints}
        </text>
        <image x="122.5" y="4" width="15" height="15" xlinkHref={"images/victory-point.svg"} /> */}
        {/* Card Id number */}
        <text x="121.8" y="126" style={cardIdStyle}>
          {cardId.toString().padStart(3, "0")}
        </text>
      </svg>
    </div>
  );
};
