import { CardInfo, CardLevel, CardEffectFunction } from "./cardInfo";
import { GameState } from "../gameState";
import { archiveAction } from "../moves/archive";
import { GameContext } from "../gameContext";
import { EnergyType } from "../energyType";
import { TriggerType } from "./triggerType";
import { CardEffect } from "./cardEffect";

class FileActionEffect extends CardEffect {
  canBeResolved(G: GameState, ctx: GameContext): boolean {
    if (ctx.playerID) return G.players[ctx.playerID]?.canArchiveAnotherCard();
    return false;
  }
  gameStateAfterEffect(G: GameState, ctx: GameContext, cardId = -1): GameState | string {
    return archiveAction.move(G, ctx, cardId);
  }
}
export const fileEffect: FileActionEffect = new FileActionEffect();

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
