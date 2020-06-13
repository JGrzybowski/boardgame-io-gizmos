import { CardEffect } from "../cards/cardEffect";
import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { archiveAction } from "../moves/archive";

export class FileActionEffect extends CardEffect {
  canBeResolved(G: GameState, ctx: GameContext): boolean {
    if (ctx.playerID) return G.players[ctx.playerID]?.canArchiveAnotherCard();
    return false;
  }
  gameStateAfterEffect(G: GameState, ctx: GameContext, cardId = -1): GameState | string {
    return archiveAction.move(G, ctx, cardId);
  }
}

export const fileEffect: FileActionEffect = new FileActionEffect();
