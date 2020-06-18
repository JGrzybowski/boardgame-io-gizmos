import { EnergyType } from "../energyType";
import { TriggerType } from "./triggerType";
import { CardInfo, CardLevel } from "./cardInfo";
import { ConvertEffect } from "../cardEffects/convertEffect";

export function ConvertEffectCard(
  cardId: number,
  victoryPoints: number,
  color: EnergyType,
  cost: number,
  level: CardLevel,
  effect1: ConvertEffect,
  effect2?: ConvertEffect
): CardInfo {
  return {
    cardId,
    type: TriggerType.Converter,
    primaryEffect: effect1,
    secondaryEffect: effect2,
    victoryPoints,
    color,
    cost,
    level,
  };
}
