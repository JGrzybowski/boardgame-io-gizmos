import { Card, CardEffect, TriggerType, CostColor, CardLevel } from "./card";

export class CardWithFileEffect extends Card<FileActionEffect> {
  constructor(
    cardId: number,
    type: TriggerType,
    effect: FileActionEffect,
    victoryPoints: number,
    color: CostColor,
    cost: number,
    level: CardLevel
  ) {
    super(cardId, type, effect, victoryPoints, color, cost, level);
  }
}

export abstract class FileActionEffect extends CardEffect {}
