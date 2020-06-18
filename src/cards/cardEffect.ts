import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { PlayerState } from "../playerState";

export interface CardEffect<T = undefined> {
  canBeResolved(G: GameState, p: PlayerState, data: T): boolean;
  gameStateAfterEffect(G: GameState, ctx: GameContext, data: T): GameState | string;
}
