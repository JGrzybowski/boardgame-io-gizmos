import { CardInfo, CardEffectFunction, CardLevel } from "./cardInfo";
import { EnergyType } from "../energyType";
import { TriggerType } from "./triggerType";

export function UpgradeEffectCard(
  cardId: number,
  oneTimeEffect: CardEffectFunction,
  victoryPoints: number,
  color: EnergyType,
  cost: number,
  level: CardLevel
): CardInfo {
  return {
    cardId,
    type: TriggerType.Upgrade,
    oneTimeEffect,
    victoryPoints,
    color,
    cost,
    level,
  };
}
