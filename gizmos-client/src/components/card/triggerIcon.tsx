import React from "react";
import { TriggerType } from "../../cards/triggerType";
import { CardLevel } from "../../cards/cardInfo";
import { corners } from "../colorDictionary";

export const TriggerIcon: React.FC<{ type: TriggerType; level: CardLevel }> = ({ type, level }) => {
  return (
    <>
      <path
        style={{ fill: level === 3 ? corners.brown : corners.gray }}
        d="M31.5,8a17.88,17.88,0,0,0-1.89-8H9.19A9.2,9.2,0,0,0,0,9.19V26.93a26.17,26.17,0,0,0,8.25,1.32C21.09,28.25,31.5,19.18,31.5,8Z"
      />
      {type === TriggerType.Archive ? (
        <image x="5" y="5.5" width="20" height="20" xlinkHref="images/file-trigger.svg" />
      ) : type === TriggerType.Build ? (
        <image x="5" y="3.5" width="19" height="19" xlinkHref="images/build-trigger.svg" />
      ) : type === TriggerType.Converter ? (
        <image x="8" y="3.5" width="20" height="20" xlinkHref="images/convert-trigger.svg" />
      ) : type === TriggerType.Pick ? (
        <image x="4" y="3.5" width="20" height="20" xlinkHref="images/pick-trigger.svg" />
      ) : type === TriggerType.Upgrade ? (
        <image x="6" y="5.5" width="16" height="16" xlinkHref="images/upgrade-trigger.svg" />
      ) : (
        <></>
      )}
    </>
  );
};
