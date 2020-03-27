import { PlayerState } from "./playerState";

export interface GameContext {
  player: PlayerPluginInterface;
  random: any;
}

interface PlayerPluginInterface {
  get(): PlayerState;
  set(playerState: PlayerState | any): void;
}
