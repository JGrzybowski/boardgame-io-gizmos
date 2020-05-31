import { GameState } from "../gameState";

export type MultiPickerCheckFunction = (G: GameState) => boolean;
export type MultiPickerFunction<T> = (G: GameState) => [GameState, ReadonlyArray<T>];

export default interface MultiPicker<T> {
  readonly canPickMultiple: MultiPickerCheckFunction;
  readonly pickMultiple: MultiPickerFunction<T>;
}
