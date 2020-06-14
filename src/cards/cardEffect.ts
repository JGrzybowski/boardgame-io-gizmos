import { GameState } from "../gameState";
import { GameContext } from "../gameContext";

export interface CardEffect {
  canBeResolved(G: GameState, ctx: GameContext): boolean;
  gameStateAfterEffect(G: GameState, ctx: GameContext): GameState | string;
}
