import React from "react";
import { CardLevel } from "../../cards/cardInfo";
import { upperFrame, triggerBox, triggerBoxBorder } from "../colorDictionary";

export const ConditionalEffectBox: React.FC<{ level: CardLevel }> = ({ level }) => {
  const colors = {
    "frame-general": level === 3 ? upperFrame.brown : upperFrame.gray, //gray, can also be beige for III lvl cards
    "trigger-filter-box": level === 3 ? triggerBox.brown : triggerBox.gray, //gray, can also be beige for III lvl cards
    "trigger-filter-box-border": level === 3 ? triggerBoxBorder.brown : triggerBoxBorder.gray,
  };

  return (
    <polygon
      points="12.75 32.5 68.75 32.5 74.25 20.5 59.5 5.75 12.75 5.75 12.75 32.5"
      style={{ fill: colors["trigger-filter-box"], stroke: colors["trigger-filter-box-border"] }}
      strokeMiterlimit="10"
      strokeWidth="0.75"
    />
  );
};
