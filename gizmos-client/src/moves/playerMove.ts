import { LongFormMove } from "boardgame.io";
import { GameContext } from "../gameContext";
import { GameState } from "../gameState";

export declare type MoveCondition<A extends any[] = any[]> = (G: GameState, ctx: GameContext, ...args: A) => boolean;
export const always = () => true;
export const never = () => false;

export interface PlayerMove extends LongFormMove<GameState, GameContext> {
  // condition: MoveCondition;
}
