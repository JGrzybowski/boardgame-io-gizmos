import { GameState } from "../gameState";
import { GameContext } from "../gameContext";

export abstract class CardEffect {
  abstract canBeResolved(G: GameState, ctx: GameContext): boolean;
  abstract gameStateAfterEffect(G: GameState, ctx: GameContext): GameState | string;
}
