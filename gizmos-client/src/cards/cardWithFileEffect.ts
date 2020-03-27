import { Card, CardEffect, TriggerType, CostColor, CardLevel } from "./card";
import { GameState } from "../gameState";
import { archive } from "../moves/archive";

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

class FileActionEffect extends CardEffect {
  canBeResolved(G: import("../gameState").GameState, ctx: any): boolean {
    return ctx.player.get().CanArchiveAnotherCard();
  }
  gameStateAfterEffect(
    G: import("../gameState").GameState,
    ctx: any,
    cardId: number = -1
  ): GameState | void {
    return archive(G, ctx, cardId);
  }
}
export const fileEffect: FileActionEffect = new FileActionEffect();
