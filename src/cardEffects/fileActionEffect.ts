import { CardEffect } from "../cards/cardEffect";
import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { archiveAction } from "../moves/archive";
import { PlayerState } from "../playerState";

export class FileActionEffect implements CardEffect<number> {
  canBeResolved(G: GameState, p: PlayerState): boolean {
    return p.canArchiveAnotherCard();
  }
  gameStateAfterEffect(G: GameState, ctx: GameContext, cardId = -1): GameState | string {
    return archiveAction.move(G, ctx, cardId);
  }
}

export const fileEffect: FileActionEffect = new FileActionEffect();
