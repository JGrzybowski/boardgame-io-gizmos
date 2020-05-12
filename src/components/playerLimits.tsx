import React from "react";
import { SingleCounter } from "./card/singleCounter";

export const PlayerLimits: React.FC<{
  energyLimit: number | string;
  archiveLimit: number | string;
  researchLimit: number | string;
}> = ({ energyLimit, archiveLimit, researchLimit }) => {
  return (
    <svg viewBox="0 0 312 86">
      <SingleCounter text={energyLimit} imageX="0" imageY="3" textOffsetX="38.5" textY="57" icon="storage" />
      <SingleCounter text={archiveLimit} imageX="120" imageY="0" textOffsetX="32" textY="57" icon="archive" />
      <SingleCounter text={researchLimit} imageX="220" imageY="7" textOffsetX="44" textY="57" icon="research" />
    </svg>
  );
};
