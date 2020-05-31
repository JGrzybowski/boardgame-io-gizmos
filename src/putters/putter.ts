import { GameState } from "../gameState";

export type PutterCheckFunction = (G: GameState) => boolean;
export type PutterFunction<T> = (G: GameState, addedItem: T) => GameState;

export default interface Putter<T> {
  readonly canPick: PutterCheckFunction;
  readonly pick: PutterFunction<T>;
}
