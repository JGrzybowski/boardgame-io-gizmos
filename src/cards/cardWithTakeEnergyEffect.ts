import { CardInfo, CardLevel } from "./cardInfo";
import { EnergyType } from "../energyType";
import { TriggerType } from "./triggerType";
import { TakeEnergyLimit, TakeEnergyEffect } from "../cardEffects/takeEnergyEffect";

export function CardWithTakeEnergyEffect(
  cardId: number,
  type: TriggerType,
  howMany: TakeEnergyLimit,
  victoryPoints: number,
  color: EnergyType,
  cost: number,
  level: CardLevel
): CardInfo {
  return { cardId, type, primaryEffect: new TakeEnergyEffect(howMany), victoryPoints, color, cost, level };
}
