import { GameState } from "../gameState";

export type MultiPutterCheckFunction = (G: GameState) => boolean;
export type MultiPutterFunction<T> = (G: GameState, addedItems: ReadonlyArray<T>) => GameState;

export default interface MultiPutter<T> {
  readonly canPickMultiple: MultiPutterCheckFunction;
  readonly pickMultiple: MultiPutterFunction<T>;
}
