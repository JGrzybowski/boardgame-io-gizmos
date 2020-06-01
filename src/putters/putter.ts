import { GameState } from "../gameState";

export type PutterCheckFunction<T> = (G: GameState, addedItem: T) => boolean;
export type PutterFunction<T> = (G: GameState, addedItem: T) => GameState;

export default interface Putter<T> {
  readonly canPut: PutterCheckFunction<T>;
  readonly put: PutterFunction<T>;
}
