import { CardInfo, CardLevel, CardEffectFunction } from "./cardInfo";
import { EnergyType } from "../energyType";
import { TriggerType } from "./triggerType";
import { FileActionEffect, fileEffect } from "../cardEffects/fileActionEffect";

export class CardWithFileEffect extends CardInfo<FileActionEffect> {
  constructor(
    cardId: number,
    type: TriggerType,
    oneTimeEffect: CardEffectFunction,
    victoryPoints: number,
    color: EnergyType,
    cost: number,
    level: CardLevel
  ) {
    super(cardId, type, oneTimeEffect, fileEffect, victoryPoints, color, cost, level);
  }
}
