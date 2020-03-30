import { Card, CardEffect, TriggerType, CostColor, CardLevel } from "./card";
import { GameState } from "../gameState";
import { archiveAction } from "../moves/archive";
import { GameContext } from "../gameContext";

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
  canBeResolved(G: import("../gameState").GameState, ctx: GameContext): boolean {
    return ctx.player?.get().canArchiveAnotherCard();
  }
  gameStateAfterEffect(G: import("../gameState").GameState, ctx: GameContext, cardId: number = -1): GameState | string {
    return archiveAction.move(G, ctx, cardId);
  }
}
export const fileEffect: FileActionEffect = new FileActionEffect();
