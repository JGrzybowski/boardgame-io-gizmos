import { GameState } from "../gameState";

export type MultiPutterCheckFunction<T> = (G: GameState, addedItems: ReadonlyArray<T>) => boolean;
export type MultiPutterFunction<T> = (G: GameState, addedItems: ReadonlyArray<T>) => GameState;

export default interface MultiPutter<T> {
  readonly canPutMultiple: MultiPutterCheckFunction<T>;
  readonly putMultiple: MultiPutterFunction<T>;
}
