import { CardInfo, CardLevel } from "./cardInfo";
import { EnergyType } from "../energyType";
import { TriggerType } from "./triggerType";
import { fileEffect } from "../cardEffects/fileActionEffect";

export function CardWithFileEffect(
  cardId: number,
  type: TriggerType,
  victoryPoints: number,
  color: EnergyType,
  cost: number,
  level: CardLevel
): CardInfo {
  return { cardId, type, primaryEffect: fileEffect, victoryPoints, color, cost, level };
}
