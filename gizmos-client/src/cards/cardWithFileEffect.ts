import { Card, CardEffect, TriggerType, CardLevel } from "./card";
import { GameState } from "../gameState";
import { archiveAction } from "../moves/archive";
import { GameContext } from "../gameContext";
import {EnergyType} from "../basicGameElements";
import {CardCost} from "./cardCost";

export class CardWithFileEffect extends Card<FileActionEffect> {
  constructor(
    cardId: number,
    type: TriggerType,
    effect: FileActionEffect,
    victoryPoints: number,
    color: EnergyType,
    cost: number,
    level: CardLevel
  ) {
    const cardCost = CardCost.fromTypeAndAmount(color, cost);
    super(cardId, type, effect, victoryPoints, color, cardCost, level);
  }
}

class FileActionEffect extends CardEffect {
  canBeResolved(G: GameState, ctx: GameContext): boolean {
    return ctx.player?.get().canArchiveAnotherCard();
  }
  gameStateAfterEffect(G: GameState, ctx: GameContext, cardId = -1): GameState | string {
    return archiveAction.move(G, ctx, cardId);
  }
}
export const fileEffect: FileActionEffect = new FileActionEffect();
