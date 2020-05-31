import { GameState } from "../gameState";

export type PickerCheckFunction = (G: GameState) => boolean;
export type PickerFunction<T> = (G: GameState) => [GameState, T];

export default interface Picker<T> {
  readonly canPick: PickerCheckFunction;
  readonly pick: PickerFunction<T>;
}
