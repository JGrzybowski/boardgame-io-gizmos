import { StageConfig } from "boardgame.io";
import { GameContext } from "../gameContext";
import { GameState } from "../gameState";

export interface GameStage extends StageConfig<GameState, GameContext> {
  readonly name: string;
}
