import React from "react";
import { CardInfo } from "../../cards/cardInfo";
import { upperFrame, corners, accentBorder, triggerBoxBorder, triggerBox } from "../colorDictionary";
import { EnergyType } from "../../basicGameElements";
import { TriggerType } from "../../cards/triggerType";
import { EnergySymbol } from "./energySymbol";
import { CostCircle } from "./costCircle";
import { VictoryPointsCount } from "./victoryPointsCounter";
import { SingleColorFrame, MultiColorFrame } from "./frames";
import { TriggerIcon } from "./triggerIcon";
import { CardIdCount } from "./cardId";
import { ConditionalEffectBox } from "./conditionalEffectBox";
import { PlayerLimits } from "../playerLimits";
import { SingleCounter } from "./singleCounter";

export const CardImage: React.FC<CardInfo & { viewBoxHeight: string | number }> = (props) => {
  const { type, level, color, cost, cardId, viewBoxHeight } = props;

  const colors = {
    "frame-general": level === 3 ? upperFrame.brown : upperFrame.gray, //gray, can also be beige for III lvl cards
    "trigger-filter-box": level === 3 ? triggerBox.brown : triggerBox.gray, //gray, can also be beige for III lvl cards
    "trigger-filter-box-border": level === 3 ? triggerBoxBorder.brown : triggerBoxBorder.gray,
  };

  const frame = color === EnergyType.Any ? MultiColorFrame : SingleColorFrame(color);

  const effectBox =
    type === TriggerType.Upgrade ? (
      // <PlayerLimits x="40" y="24" energyLimit="+0" archiveLimit="+1" researchLimit="8" />
      <svg x="29" y="-50" width="80" viewBox="0 0 312 86" style={{}}>
        <SingleCounter text={1} imageX="0" imageY="3" textOffsetX="38.5" textY="57" icon="storage" />
        <SingleCounter text={1} imageX="120" imageY="0" textOffsetX="32" textY="57" icon="archive" />
        <SingleCounter text={1} imageX="220" imageY="7" textOffsetX="44" textY="57" icon="research" />
      </svg>
    ) : type === TriggerType.Converter ? (
      <></>
    ) : (
      <ConditionalEffectBox {...props} />
    );

  return (
    <svg viewBox={`0 0 136.63 ${viewBoxHeight}`} xmlnsXlink="http://www.w3.org/1999/xlink">
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
        style={{ fill: "#fff" }}
        d="M12.75,36.25h112V118.5h-6V124l-86.66.66c.38-1.32,2.82-10.41-2.39-16.15a12,12,0,0,0-2.78-2.24c3-6.65,1.72-14.09-3-18.27-4.39-3.91-10-3.46-11.21-3.34Z"
      />

      {/* Color Symbol */}
      {EnergySymbol(color)}
      {CostCircle(cost)}

      {/* Effect Box */}
      {effectBox}

      {/* Trigger Corners */}
      <TriggerIcon {...props} />

      <VictoryPointsCount {...props} />

      <CardIdCount cardId={cardId} />
    </svg>
  );
};
