import { CardInfo, CardEffect, TriggerType, CardLevel } from "./card";
import { GameState } from "../gameState";
import { archiveAction } from "../moves/archive";
import { GameContext } from "../gameContext";
import { EnergyType } from "../basicGameElements";

export class CardWithFileEffect extends CardInfo<FileActionEffect> {
  constructor(
    cardId: number,
    type: TriggerType,
    effect: FileActionEffect,
    victoryPoints: number,
    color: EnergyType,
    cost: number,
    level: CardLevel
  ) {
    super(cardId, type, effect, victoryPoints, color, cost, level);
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
